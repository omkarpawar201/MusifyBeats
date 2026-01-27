using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlaylistService.Data;
using PlaylistService.Models;
using System.Security.Claims;

namespace PlaylistService.Controllers
{
    [ApiController]
    [Route("api/playlists")]
    [Authorize]
    public class PlaylistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlaylistController(AppDbContext context)
        {
            _context = context;
        }

        // USER: Create playlist
        [HttpPost]
        public IActionResult CreatePlaylist([FromBody] string name)
        {
            var email = User.FindFirstValue("sub");

            var playlist = new Playlist
            {
                Name = name,
                OwnerEmail = email
            };

            _context.Playlists.Add(playlist);
            _context.SaveChanges();

            return Ok(playlist);
        }

        // USER: Get own playlists
        [HttpGet("my")]
        public IActionResult MyPlaylists()
        {
            var email = User.FindFirstValue("sub");
            var playlists = _context.Playlists
                                    .Where(p => p.OwnerEmail == email)
                                    .ToList();
            return Ok(playlists);
        }

        // ADMIN: Get all playlists
        [Authorize(Roles = "ADMIN")]
        [HttpGet("all")]
        public IActionResult AllPlaylists()
        {
            return Ok(_context.Playlists.ToList());
        }

        // ADMIN: Delete playlist
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var playlist = _context.Playlists.Find(id);
            if (playlist == null) return NotFound();

            _context.Playlists.Remove(playlist);
            _context.SaveChanges();

            return Ok("Playlist deleted");
        }
    }
}
