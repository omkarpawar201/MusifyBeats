using AI_Services.Models;
using AI_Services.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_Services.Controllers
{
    [ApiController]
    [Route("api/ai/chat")]
    [Authorize] // JWT protected
    public class AIChatController : ControllerBase
    {
        private readonly GeminiMoodService _gemini;
        private readonly PlaylistService _playlist;

        public AIChatController(GeminiMoodService gemini, PlaylistService playlist)
        {
            _gemini = gemini;
            _playlist = playlist;
        }

        [HttpPost("playlist")]
        public async Task<IActionResult> GeneratePlaylist([FromBody] ChatPlaylistRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Prompt))
                return BadRequest(new { message = "Prompt cannot be empty." });

            var mood = await _gemini.DetectMoodAsync(request.Prompt);
            var songs = await _playlist.GetPlaylistByMood(mood, request.MaxSongs);

            return Ok(new
            {
                message = $"Here’s a {mood} playlist just for you 🎧",
                mood,
                totalSongs = songs.Count,
                songs
            });
        }
    }
}
