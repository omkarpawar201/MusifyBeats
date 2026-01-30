using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicService.Data;
using MusicService.Models;

namespace MusicService.Controllers
{
    [ApiController]
    [Route("api/artists")]
    public class ArtistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ArtistController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/artists
        [HttpGet]
        public async Task<IActionResult> GetAllArtists()
        {
            var artists = await _context.Artists
                .ToListAsync();

            return Ok(artists);
        }

        // GET: api/artists/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArtistById(int id)
        {
            var artist = await _context.Artists
                .Include(a => a.Songs)
                .Include(a => a.Albums)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (artist == null)
                return NotFound(new { message = "Artist not found" });

            return Ok(artist);
        }

        // POST: api/artists (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> CreateArtist([FromBody] Artist artist)
        {
            if (string.IsNullOrWhiteSpace(artist.Name))
                return BadRequest(new { message = "Artist name is required" });

            _context.Artists.Add(artist);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetArtistById), new { id = artist.Id }, artist);
        }

        // PUT: api/artists/{id} (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArtist(int id, [FromBody] Artist artist)
        {
            var existingArtist = await _context.Artists.FindAsync(id);
            if (existingArtist == null)
                return NotFound(new { message = "Artist not found" });

            existingArtist.Name = artist.Name;
            existingArtist.Bio = artist.Bio;

            await _context.SaveChangesAsync();

            return Ok(existingArtist);
        }

        // DELETE: api/artists/{id} (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArtist(int id)
        {
            var artist = await _context.Artists
                .Include(a => a.Songs)
                .Include(a => a.Albums)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (artist == null)
                return NotFound(new { message = "Artist not found" });

            // Check if artist has songs or albums
            if (artist.Songs.Any() || artist.Albums.Any())
            {
                return BadRequest(new { message = "Cannot delete artist with existing songs or albums. Please delete them first." });
            }

            _context.Artists.Remove(artist);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Artist deleted successfully" });
        }
    }
}
