using System.Text;
using Newtonsoft.Json;

namespace AI_Services.Services
{
    public class GeminiMoodService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public GeminiMoodService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<string> DetectMoodAsync(string userPrompt)
        {
            string apiKey = _config["Gemini:ApiKey"];
            string model = _config["Gemini:Model"];

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new
                            {
                                text = $"""
                                You are an emotion classifier.
                                Detect the user's mood from this message.
                                Allowed moods: Happy, Sad, Chill, Workout, Romantic.
                                Reply with ONLY ONE word.
                                Message: "{userPrompt}"
                                """
                            }
                        }
                    }
                }
            };

            var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            dynamic result = JsonConvert.DeserializeObject(json);

            string mood = "Chill";
            try
            {
                mood = result?.candidates?[0]?.content?.parts?[0]?.text?.ToString()?.Trim() ?? "Chill";
            }
            catch { }

            string[] allowed = { "Happy", "Sad", "Chill", "Workout", "Romantic" };
            if (!allowed.Contains(mood))
                mood = "Chill";

            return mood;
        }
    }
}
