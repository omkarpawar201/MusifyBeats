using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicService.Data;
using MusicService.Models;

namespace MusicService.Controllers
{
    [ApiController]
    [Route("api/moods")]
    public class MoodController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MoodController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/moods
        [HttpGet]
        public async Task<IActionResult> GetAllMoods()
        {
            var moods = await _context.Moods.ToListAsync();
            return Ok(moods);
        }

        // GET: api/moods/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMoodById(int id)
        {
            var mood = await _context.Moods.FindAsync(id);

            if (mood == null)
                return NotFound(new { message = "Mood not found" });

            return Ok(mood);
        }

        // POST: api/moods (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> CreateMood([FromBody] Mood mood)
        {
            if (string.IsNullOrWhiteSpace(mood.Name))
                return BadRequest(new { message = "Mood name is required" });

            // Check for duplicate
            var exists = await _context.Moods.AnyAsync(m => m.Name.ToLower() == mood.Name.ToLower());
            if (exists)
                return BadRequest(new { message = "Mood already exists" });

            _context.Moods.Add(mood);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMoodById), new { id = mood.Id }, mood);
        }

        // PUT: api/moods/{id} (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMood(int id, [FromBody] Mood mood)
        {
            var existingMood = await _context.Moods.FindAsync(id);
            if (existingMood == null)
                return NotFound(new { message = "Mood not found" });

            // Check for duplicate name
            var duplicate = await _context.Moods
                .AnyAsync(m => m.Id != id && m.Name.ToLower() == mood.Name.ToLower());
            if (duplicate)
                return BadRequest(new { message = "Mood name already exists" });

            existingMood.Name = mood.Name;
            await _context.SaveChangesAsync();

            return Ok(existingMood);
        }

        // DELETE: api/moods/{id} (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMood(int id)
        {
            var mood = await _context.Moods
                .Include(m => m.SongMoods)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (mood == null)
                return NotFound(new { message = "Mood not found" });

            // Remove all song-mood associations
            _context.SongMoods.RemoveRange(mood.SongMoods);
            _context.Moods.Remove(mood);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Mood deleted successfully" });
        }
    }
}
