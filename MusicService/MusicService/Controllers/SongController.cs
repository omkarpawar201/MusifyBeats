using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicService.Data;
using MusicService.Models;
using System.Security.Claims;

namespace MusicService.Controllers
{
    [ApiController]
    [Route("api/songs")]
    public class SongController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SongController(AppDbContext context)
        {
            _context = context;
        }

        //SEARCH SONGS (PUBLIC)
        [HttpGet("search")]
        public IActionResult Search(string q)
        {
            return Ok(
                _context.Songs
                    .Where(s => s.Title.Contains(q) || s.Artist.Contains(q))
                    .ToList()
            );
        }

        //LIKE SONG
        [Authorize]
        [HttpPost("{id}/like")]
        public IActionResult LikeSong(int id)
        {
            var email = User.FindFirstValue("sub");

            if (_context.SongLikes.Any(l => l.SongId == id && l.UserEmail == email))
                return BadRequest("Already liked");

            _context.SongLikes.Add(new SongLike
            {
                SongId = id,
                UserEmail = email
            });

            _context.SaveChanges();
            return Ok("Song liked");
        }

        // UNLIKE SONG
        [Authorize]
        [HttpDelete("{id}/like")]
        public IActionResult UnlikeSong(int id)
        {
            var email = User.FindFirstValue("sub");

            var like = _context.SongLikes
                .FirstOrDefault(l => l.SongId == id && l.UserEmail == email);

            if (like == null) return NotFound();

            _context.SongLikes.Remove(like);
            _context.SaveChanges();
            return Ok("Song unliked");
        }

        // VIEW LIKED SONGS
        [Authorize]
        [HttpGet("liked")]
        public IActionResult LikedSongs()
        {
            var email = User.FindFirstValue("sub");

            var songs = from like in _context.SongLikes
                        join song in _context.Songs
                        on like.SongId equals song.Id
                        where like.UserEmail == email
                        select song;

            return Ok(songs.ToList());
        }

        // ADMIN: ADD SONG
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public IActionResult AddSong(Song song)
        {
            _context.Songs.Add(song);
            _context.SaveChanges();
            return Ok(song);
        }

        // ADMIN: DELETE SONG
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public IActionResult DeleteSong(int id)
        {
            var song = _context.Songs.Find(id);
            if (song == null) return NotFound();

            _context.Songs.Remove(song);
            _context.SaveChanges();
            return Ok("Song deleted");
        }
    }
}
