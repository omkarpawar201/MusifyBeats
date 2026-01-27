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

        // ➕ CREATE PLAYLIST
        [HttpPost]
        public IActionResult Create(string name)
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

        // ADD SONG
        [HttpPost("{playlistId}/songs/{songId}")]
        public IActionResult AddSong(int playlistId, int songId)
        {
            var email = User.FindFirstValue("sub");

            var playlist = _context.Playlists.Find(playlistId);
            if (playlist == null || playlist.OwnerEmail != email)
                return Forbid();

            _context.PlaylistSongs.Add(new PlaylistSong
            {
                PlaylistId = playlistId,
                SongId = songId
            });

            _context.SaveChanges();
            return Ok("Song added");
        }

        // REMOVE SONG
        [HttpDelete("{playlistId}/songs/{songId}")]
        public IActionResult RemoveSong(int playlistId, int songId)
        {
            var email = User.FindFirstValue("sub");

            var ps = _context.PlaylistSongs
                .FirstOrDefault(p => p.PlaylistId == playlistId && p.SongId == songId);

            if (ps == null) return NotFound();

            _context.PlaylistSongs.Remove(ps);
            _context.SaveChanges();
            return Ok("Song removed");
        }

        // DELETE PLAYLIST
        [HttpDelete("{id}")]
        public IActionResult DeletePlaylist(int id)
        {
            var email = User.FindFirstValue("sub");
            var playlist = _context.Playlists.Find(id);

            if (playlist == null) return NotFound();

            if (playlist.OwnerEmail != email && !User.IsInRole("ADMIN"))
                return Forbid();

            _context.Playlists.Remove(playlist);
            _context.SaveChanges();
            return Ok("Playlist deleted");
        }
    }
}
