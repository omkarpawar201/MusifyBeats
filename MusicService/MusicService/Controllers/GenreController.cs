using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicService.Data;
using MusicService.Models;

namespace MusicService.Controllers
{
    [ApiController]
    [Route("api/genres")]
    public class GenreController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GenreController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/genres
        [HttpGet]
        public async Task<IActionResult> GetAllGenres()
        {
            var genres = await _context.Genres.ToListAsync();
            return Ok(genres);
        }

        // GET: api/genres/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGenreById(int id)
        {
            var genre = await _context.Genres.FindAsync(id);

            if (genre == null)
                return NotFound(new { message = "Genre not found" });

            return Ok(genre);
        }

        // POST: api/genres (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> CreateGenre([FromBody] Genre genre)
        {
            if (string.IsNullOrWhiteSpace(genre.Name))
                return BadRequest(new { message = "Genre name is required" });

            // Check for duplicate
            var exists = await _context.Genres.AnyAsync(g => g.Name.ToLower() == genre.Name.ToLower());
            if (exists)
                return BadRequest(new { message = "Genre already exists" });

            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGenreById), new { id = genre.Id }, genre);
        }

        // PUT: api/genres/{id} (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGenre(int id, [FromBody] Genre genre)
        {
            var existingGenre = await _context.Genres.FindAsync(id);
            if (existingGenre == null)
                return NotFound(new { message = "Genre not found" });

            // Check for duplicate name
            var duplicate = await _context.Genres
                .AnyAsync(g => g.Id != id && g.Name.ToLower() == genre.Name.ToLower());
            if (duplicate)
                return BadRequest(new { message = "Genre name already exists" });

            existingGenre.Name = genre.Name;
            await _context.SaveChangesAsync();

            return Ok(existingGenre);
        }

        // DELETE: api/genres/{id} (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            var genre = await _context.Genres
                .Include(g => g.SongGenres)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (genre == null)
                return NotFound(new { message = "Genre not found" });

            // Remove all song-genre associations
            _context.SongGenres.RemoveRange(genre.SongGenres);
            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Genre deleted successfully" });
        }
    }
}
