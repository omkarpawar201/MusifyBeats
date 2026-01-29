using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        // DTO for creating/updating songs
        public class SongDto
        {
            public string Title { get; set; }
            public int Duration { get; set; }
            public string? Language { get; set; }
            public int ArtistId { get; set; }
            public int? AlbumId { get; set; }
            public string? AudioUrl { get; set; }
            public string? CoverUrl { get; set; }
            public List<int>? GenreIds { get; set; }
            public List<int>? MoodIds { get; set; }
        }

        // GET: api/songs (with filtering and pagination)
        [HttpGet]
        public async Task<IActionResult> GetAllSongs(
            [FromQuery] int? genreId,
            [FromQuery] int? moodId,
            [FromQuery] int? artistId,
            [FromQuery] string? language,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = _context.Songs
                .Include(s => s.Artist)
                .Include(s => s.Album)
                .Include(s => s.SongGenres).ThenInclude(sg => sg.Genre)
                .Include(s => s.SongMoods).ThenInclude(sm => sm.Mood)
                .AsQueryable();

            // Apply filters
            if (genreId.HasValue)
            {
                query = query.Where(s => s.SongGenres.Any(sg => sg.GenreId == genreId.Value));
            }

            if (moodId.HasValue)
            {
                query = query.Where(s => s.SongMoods.Any(sm => sm.MoodId == moodId.Value));
            }

            if (artistId.HasValue)
            {
                query = query.Where(s => s.ArtistId == artistId.Value);
            }

            if (!string.IsNullOrWhiteSpace(language))
            {
                query = query.Where(s => s.Language == language);
            }

            // Pagination
            var totalCount = await query.CountAsync();
            var songs = await query
                .OrderByDescending(s => s.Id) // Fix Skip/Take warning
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(s => new
                {
                    s.Id,
                    s.Title,
                    s.Duration,
                    s.Language,
                    s.AudioUrl,
                    s.CoverUrl,
                    Artist = new { s.Artist.Id, s.Artist.Name },
                    Album = s.Album == null ? null : new { s.Album.Id, s.Album.Title },
                    Genres = s.SongGenres.Select(sg => new { sg.Genre.Id, sg.Genre.Name }).ToList(),
                    Moods = s.SongMoods.Select(sm => new { sm.Mood.Id, sm.Mood.Name }).ToList()
                })
                .ToListAsync();

            return Ok(new
            {
                songs,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }

        // GET: api/songs/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSongById(int id)
        {
            var song = await _context.Songs
                .Include(s => s.Artist)
                .Include(s => s.Album)
                .Include(s => s.SongGenres).ThenInclude(sg => sg.Genre)
                .Include(s => s.SongMoods).ThenInclude(sm => sm.Mood)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (song == null)
                return NotFound(new { message = "Song not found" });

            return Ok(song);
        }

        // GET: api/songs/trending
        [HttpGet("trending")]
        public async Task<IActionResult> GetTrending()
        {
            var songs = await _context.Songs
                .Include(s => s.Artist)
                .Include(s => s.Album)
                .OrderByDescending(s => s.Id) // Mock: latest songs as trending
                .Take(10)
                .ToListAsync();

            return Ok(songs);
        }

        // GET: api/songs/search
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest(new { message = "Search query is required" });

            var songs = await _context.Songs
                .Include(s => s.Artist)
                .Include(s => s.Album)
                .Where(s => s.Title.Contains(q) || s.Artist.Name.Contains(q))
                .Take(20)
                .ToListAsync();

            return Ok(songs);
        }

        // POST: api/songs (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> CreateSong([FromBody] SongDto songDto)
        {
            // Validate artist exists
            var artist = await _context.Artists.FindAsync(songDto.ArtistId);
            if (artist == null)
                return BadRequest(new { message = "Invalid artist ID" });

            // Validate album if provided
            if (songDto.AlbumId.HasValue)
            {
                var album = await _context.Albums.FindAsync(songDto.AlbumId.Value);
                if (album == null)
                    return BadRequest(new { message = "Invalid album ID" });
            }

            var song = new Song
            {
                Title = songDto.Title,
                Duration = songDto.Duration,
                Language = songDto.Language,
                ArtistId = songDto.ArtistId,
                AlbumId = songDto.AlbumId,
                AudioUrl = songDto.AudioUrl,
                CoverUrl = songDto.CoverUrl
            };

            _context.Songs.Add(song);
            await _context.SaveChangesAsync();

            // Add genres
            if (songDto.GenreIds != null && songDto.GenreIds.Any())
            {
                foreach (var genreId in songDto.GenreIds)
                {
                    _context.SongGenres.Add(new SongGenre
                    {
                        SongId = song.Id,
                        GenreId = genreId
                    });
                }
            }

            // Add moods
            if (songDto.MoodIds != null && songDto.MoodIds.Any())
            {
                foreach (var moodId in songDto.MoodIds)
                {
                    _context.SongMoods.Add(new SongMood
                    {
                        SongId = song.Id,
                        MoodId = moodId
                    });
                }
            }

            await _context.SaveChangesAsync();

            // Reload with relationships
            var createdSong = await _context.Songs
                .Include(s => s.Artist)
                .Include(s => s.Album)
                .Include(s => s.SongGenres).ThenInclude(sg => sg.Genre)
                .Include(s => s.SongMoods).ThenInclude(sm => sm.Mood)
                .FirstOrDefaultAsync(s => s.Id == song.Id);

            return CreatedAtAction(nameof(GetSongById), new { id = song.Id }, createdSong);
        }

        // PUT: api/songs/{id} (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSong(int id, [FromBody] SongDto songDto)
        {
            var song = await _context.Songs
                .Include(s => s.SongGenres)
                .Include(s => s.SongMoods)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (song == null)
                return NotFound(new { message = "Song not found" });

            // Validate artist
            var artist = await _context.Artists.FindAsync(songDto.ArtistId);
            if (artist == null)
                return BadRequest(new { message = "Invalid artist ID" });

            // Validate album if provided
            if (songDto.AlbumId.HasValue)
            {
                var album = await _context.Albums.FindAsync(songDto.AlbumId.Value);
                if (album == null)
                    return BadRequest(new { message = "Invalid album ID" });
            }

            // Update song properties
            song.Title = songDto.Title;
            song.Duration = songDto.Duration;
            song.Language = songDto.Language;
            song.ArtistId = songDto.ArtistId;
            song.AlbumId = songDto.AlbumId;
            song.AudioUrl = songDto.AudioUrl;
            song.CoverUrl = songDto.CoverUrl;

            // Update genres
            _context.SongGenres.RemoveRange(song.SongGenres);
            if (songDto.GenreIds != null && songDto.GenreIds.Any())
            {
                foreach (var genreId in songDto.GenreIds)
                {
                    _context.SongGenres.Add(new SongGenre
                    {
                        SongId = song.Id,
                        GenreId = genreId
                    });
                }
            }

            // Update moods
            _context.SongMoods.RemoveRange(song.SongMoods);
            if (songDto.MoodIds != null && songDto.MoodIds.Any())
            {
                foreach (var moodId in songDto.MoodIds)
                {
                    _context.SongMoods.Add(new SongMood
                    {
                        SongId = song.Id,
                        MoodId = moodId
                    });
                }
            }

            await _context.SaveChangesAsync();

            // Reload with relationships
            var updatedSong = await _context.Songs
                .Include(s => s.Artist)
                .Include(s => s.Album)
                .Include(s => s.SongGenres).ThenInclude(sg => sg.Genre)
                .Include(s => s.SongMoods).ThenInclude(sm => sm.Mood)
                .FirstOrDefaultAsync(s => s.Id == id);

            return Ok(updatedSong);
        }

        // DELETE: api/songs/{id} (ADMIN ONLY)
        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSong(int id)
        {
            var song = await _context.Songs.FindAsync(id);
            if (song == null)
                return NotFound(new { message = "Song not found" });

            _context.Songs.Remove(song);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Song deleted successfully" });
        }

        // Helper to get user ID from email
        private async Task<long?> GetUserIdByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            return user?.Id;
        }

        // POST: api/songs/{id}/like (USER)
        [Authorize]
        [HttpPost("{id}/like")]
        public async Task<IActionResult> LikeSong(int id)
        {
            var email = User.FindFirstValue("sub");
            var userId = await GetUserIdByEmailAsync(email);
            if (userId == null) return Unauthorized(new { message = "User record not found" });

            var songExists = await _context.Songs.AnyAsync(s => s.Id == id);
            if (!songExists)
                return NotFound(new { message = "Song not found" });

            var alreadyLiked = await _context.SongLikes
                .AnyAsync(l => l.SongId == id && l.UserId == userId.Value);

            if (alreadyLiked)
                return BadRequest(new { message = "Song already liked" });

            _context.SongLikes.Add(new SongLike
            {
                SongId = id,
                UserId = userId.Value
            });

            await _context.SaveChangesAsync();
            return Ok(new { message = "Song liked successfully" });
        }

        // DELETE: api/songs/{id}/like (USER)
        [Authorize]
        [HttpDelete("{id}/like")]
        public async Task<IActionResult> UnlikeSong(int id)
        {
            var email = User.FindFirstValue("sub");
            var userId = await GetUserIdByEmailAsync(email);
            if (userId == null) return Unauthorized(new { message = "User record not found" });

            var like = await _context.SongLikes
                .FirstOrDefaultAsync(l => l.SongId == id && l.UserId == userId.Value);

            if (like == null)
                return NotFound(new { message = "Like not found" });

            _context.SongLikes.Remove(like);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Song unliked successfully" });
        }

        // GET: api/songs/liked (USER)
        [Authorize]
        [HttpGet("liked")]
        public async Task<IActionResult> GetLikedSongs()
        {
            var email = User.FindFirstValue("sub");
            var userId = await GetUserIdByEmailAsync(email);
            if (userId == null) return Unauthorized(new { message = "User record not found" });

            var songs = await _context.SongLikes
                .Where(l => l.UserId == userId.Value)
                .Include(l => l.Song)
                    .ThenInclude(s => s.Artist)
                .Include(l => l.Song)
                    .ThenInclude(s => s.Album)
                .Select(l => l.Song)
                .ToListAsync();

            return Ok(songs);
        }

        // POST: api/songs/{id}/listen (Track listening history)
        [Authorize]
        [HttpPost("{id}/listen")]
        public async Task<IActionResult> TrackListen(int id, [FromBody] int durationPlayed)
        {
            var email = User.FindFirstValue("sub");
            var userId = await GetUserIdByEmailAsync(email);
            if (userId == null) return Unauthorized(new { message = "User record not found" });

            var songExists = await _context.Songs.AnyAsync(s => s.Id == id);
            if (!songExists)
                return NotFound(new { message = "Song not found" });

            _context.ListeningHistories.Add(new ListeningHistory
            {
                UserId = userId.Value,
                SongId = id,
                PlayedAt = DateTime.UtcNow,
                DurationPlayed = durationPlayed
            });

            await _context.SaveChangesAsync();
            return Ok(new { message = "Listening history recorded" });
        }
    }
}
