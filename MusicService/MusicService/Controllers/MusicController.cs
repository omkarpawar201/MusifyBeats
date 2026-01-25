using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MusicService.Controllers
{
    [ApiController]
    [Route("api/music")]
    public class MusicController : ControllerBase
    {
        // Any authenticated user
        [Authorize]
        [HttpGet("songs")]
        public IActionResult GetSongs()
        {
            var songs = new[]
            {
                new { Id = 1, Title = "Song One", Artist = "Artist A" },
                new { Id = 2, Title = "Song Two", Artist = "Artist B" }
            };

            return Ok(songs);
        }

        // Admin only
        [Authorize(Roles = "ADMIN")]
        [HttpPost("add")]
        public IActionResult AddSong()
        {
            return Ok("Song added (ADMIN only)");
        }
    }
}
