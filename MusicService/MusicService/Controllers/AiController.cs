using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicService.Data;
using MusicService.Models;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace MusicService.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public AiController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzePrompt([FromBody] AiRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Prompt))
                return BadRequest(new { message = "Prompt is required" });

            Console.WriteLine($"========================================");
            Console.WriteLine($"AI PLAYLIST REQUEST");
            Console.WriteLine($"User Prompt: \"{request.Prompt}\"");
            Console.WriteLine($"========================================");

            try
            {
                // 1. Fetch available Genres and Moods to send to Gemini as context
                var genres = await _context.Genres.ToListAsync();
                var moods = await _context.Moods.ToListAsync();

                var genresList = string.Join(", ", genres.Select(g => $"{g.Id}:{g.Name}"));
                var moodsList = string.Join(", ", moods.Select(m => $"{m.Id}:{m.Name}"));

                // 2. Construct Gemini Prompt
                var apiKey = _configuration["Gemini:ApiKey"];
                // Using gemini-2.5-flash as confirmed by model list.
                var apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";

                var systemInstruction = $@"
You are a music recommendation assistant.
Analyze the user's prompt: ""{request.Prompt}""

Available Genres (ID:Name): [{genresList}]
Available Moods (ID:Name): [{moodsList}]

Task:
1. Select ONE most suitable Genre ID from the list.
2. Select ONE most suitable Mood ID from the list.
3. Generate a creative Playlist Name (short).
4. Generate a short Description.

Output format MUST be strictly JSON:
{{
  ""suggestedName"": ""string"",
  ""suggestedDescription"": ""string"",
  ""genreId"": integer,
  ""moodId"": integer,
  ""reasoning"": ""string""
}}
Do NOT include markdown formatting (like ```json), just the raw JSON string.
";

                var payload = new
                {
                    contents = new[]
                    {
                        new { parts = new[] { new { text = systemInstruction } } }
                    }
                };

                var jsonPayload = JsonSerializer.Serialize(payload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                // 3. Call Gemini API
                var response = await _httpClient.PostAsync(apiUrl, content);
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, new { message = "AI Service unavailable", details = responseString });
                }

                // 4. Parse Gemini Response
                using var doc = JsonDocument.Parse(responseString);
                var candidates = doc.RootElement.GetProperty("candidates");
                if (candidates.GetArrayLength() == 0) return StatusCode(500, new { message = "No response from AI" });

                var text = candidates[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();

                // Clean up markdown if present (safety check)
                text = Regex.Replace(text, @"^```json\s*", "", RegexOptions.Multiline);
                text = Regex.Replace(text, @"\s*```$", "", RegexOptions.Multiline);

                var aiResponse = JsonSerializer.Deserialize<AiResponse>(text, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                // Log the AI's selection
                var selectedGenre = genres.FirstOrDefault(g => g.Id == aiResponse.GenreId);
                var selectedMood = moods.FirstOrDefault(m => m.Id == aiResponse.MoodId);
                
                Console.WriteLine($"AI ANALYSIS RESULT:");
                Console.WriteLine($"  Playlist Name: \"{aiResponse.SuggestedName}\"");
                Console.WriteLine($"  Selected Genre: {selectedGenre?.Name ?? "Unknown"} (ID: {aiResponse.GenreId})");
                Console.WriteLine($"  Selected Mood: {selectedMood?.Name ?? "Unknown"} (ID: {aiResponse.MoodId})");
                Console.WriteLine($"  Reasoning: {aiResponse.Reasoning}");
                Console.WriteLine($"========================================");

                return Ok(aiResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal AI Error", error = ex.Message });
            }
        }
    }
}
