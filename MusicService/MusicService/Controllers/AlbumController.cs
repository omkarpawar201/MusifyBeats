using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicService.Data;
using MusicService.Models;

namespace MusicService.Controllers
{
    [ApiController]
    [Route("api/albums")]
    public class AlbumController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AlbumController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/albums
        [HttpGet]
        public async Task<IActionResult> GetAllAlbums()
        {
            var albums = await _context.Albums
                .Include(a => a.Artist)
                .Include(a => a.Songs)
                .ToListAsync();

            return Ok(albums);
        }

        // GET: api/albums/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAlbumById(int id)
        {
            var album = await _context.Albums
                .Include(a => a.Artist)
                .Include(a => a.Songs)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (album == null)
                return NotFound(new { message = "Album not found" });

            return Ok(album);
        }

        // GET: api/albums/artist/{artistId}
        [HttpGet("artist/{artistId}")]
        public async Task<IActionResult> GetAlbumsByArtist(int artistId)
        {
            var albums = await _context.Albums
                .Include(a => a.Artist)
                .Where(a => a.ArtistId == artistId)
                .ToListAsync();

            return Ok(albums);
        }

        // POST: api/albums (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> CreateAlbum([FromBody] Album album)
        {
            if (string.IsNullOrWhiteSpace(album.Title))
                return BadRequest(new { message = "Album title is required" });

            // Verify artist exists
            var artist = await _context.Artists.FindAsync(album.ArtistId);
            if (artist == null)
                return BadRequest(new { message = "Invalid artist ID" });

            _context.Albums.Add(album);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAlbumById), new { id = album.Id }, album);
        }

        // PUT: api/albums/{id} (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAlbum(int id, [FromBody] Album album)
        {
            var existingAlbum = await _context.Albums.FindAsync(id);
            if (existingAlbum == null)
                return NotFound(new { message = "Album not found" });

            // Verify artist exists if changed
            if (album.ArtistId != existingAlbum.ArtistId)
            {
                var artist = await _context.Artists.FindAsync(album.ArtistId);
                if (artist == null)
                    return BadRequest(new { message = "Invalid artist ID" });
            }

            existingAlbum.Title = album.Title;
            existingAlbum.ArtistId = album.ArtistId;
            existingAlbum.ReleaseDate = album.ReleaseDate;
            existingAlbum.CoverUrl = album.CoverUrl;

            await _context.SaveChangesAsync();

            return Ok(existingAlbum);
        }

        // DELETE: api/albums/{id} (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlbum(int id)
        {
            var album = await _context.Albums
                .Include(a => a.Songs)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (album == null)
                return NotFound(new { message = "Album not found" });

            // Check if album has songs
            if (album.Songs.Any())
            {
                return BadRequest(new { message = "Cannot delete album with existing songs. Please delete them first or set their album to null." });
            }

            _context.Albums.Remove(album);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Album deleted successfully" });
        }
    }
}
