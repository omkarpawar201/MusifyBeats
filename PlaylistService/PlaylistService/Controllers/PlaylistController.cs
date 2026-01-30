using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlaylistService.Data;
using PlaylistService.Models;
using System.Security.Claims;

namespace PlaylistService.Controllers
{
    [ApiController]
    [Route("api/playlists")]
    public class PlaylistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlaylistController(AppDbContext context)
        {
            _context = context;
        }

        // Helper to get user ID from email
        private async Task<long?> GetUserIdByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            return user?.Id;
        }

        // DTOs
        public class CreatePlaylistRequest
        {
            public string Name { get; set; }
            public string? Description { get; set; }
            public bool IsPublic { get; set; } = false;
        }

        public class UpdatePlaylistRequest
        {
            public string? Name { get; set; }
            public string? Description { get; set; }
            public bool? IsPublic { get; set; }
        }

        // DTOs updated to remove OwnerEmail if not needed strictly, or keep returning it?
        // User schema has owner_email in users table, but playlist has user_id.
        // We can return the owner email by looking it up if needed, but for now let's return OwnerId or similar?
        // Let's keep the DTO structure similar but map accordingly.
        public class PlaylistWithSongsDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string? Description { get; set; }
            public long OwnerId { get; set; } // Changed from Email to ID
            public bool IsPublic { get; set; }
            public DateTime CreatedAt { get; set; }
            public List<SongInPlaylistDto> Songs { get; set; }
        }

        public class SongInPlaylistDto
        {
            public int SongId { get; set; }
            public DateTime AddedAt { get; set; }
        }

        // CREATE PLAYLIST
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreatePlaylist([FromBody] CreatePlaylistRequest request)
        {
            var email = User.FindFirstValue("sub");
            var userId = await GetUserIdByEmailAsync(email);
            if (userId == null) return Unauthorized(new { message = "User record not found" });

            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Playlist name is required" });

            var playlist = new Playlist
            {
                Name = request.Name,
                Description = request.Description,
                UserId = userId.Value,
                IsPublic = request.IsPublic,
                CreatedAt = DateTime.UtcNow
            };

            _context.Playlists.Add(playlist);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPlaylistById), new { id = playlist.Id }, playlist);
        }

        // GET MY PLAYLISTS
        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyPlaylists()
        {
            var email = User.FindFirstValue("sub");
            var userId = await GetUserIdByEmailAsync(email);
            if (userId == null) return Unauthorized(new { message = "User record not found" });

            var playlists = await _context.Playlists
                .Where(p => p.UserId == userId.Value)
                .Include(p => p.PlaylistSongs)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(playlists);
        }

        // GET PUBLIC PLAYLISTS
        [HttpGet("public")]
        public async Task<IActionResult> GetPublicPlaylists([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var query = _context.Playlists
                .Where(p => p.IsPublic)
                .Include(p => p.PlaylistSongs)
                .Include(p => p.AppUser)
                .OrderByDescending(p => p.CreatedAt);

            var totalCount = await query.CountAsync();
            var playlists = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.UserId,
                    p.IsPublic,
                    p.CreatedAt,
                    SongsCount = p.PlaylistSongs.Count,
                    OwnerName = p.AppUser != null ? p.AppUser.DisplayName : "Unknown"
                })
                .ToListAsync();

            return Ok(new
            {
                playlists,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }

        // GET PLAYLIST BY ID (with songs)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlaylistById(int id)
        {
            var playlist = await _context.Playlists
                .Include(p => p.PlaylistSongs)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (playlist == null)
                return NotFound(new { message = "Playlist not found" });

            // Check if user has access (owner or public)
            var email = User.FindFirstValue("sub");
            // If public, allow. If not public, need to check owner.
            if (!playlist.IsPublic)
            {
                 if (string.IsNullOrEmpty(email)) return Forbid(); // Not logged in
                 var userId = await GetUserIdByEmailAsync(email);
                 if (userId == null || playlist.UserId != userId.Value) return Forbid();
            }

            var dto = new PlaylistWithSongsDto
            {
                Id = playlist.Id,
                Name = playlist.Name,
                Description = playlist.Description,
                OwnerId = playlist.UserId,
                IsPublic = playlist.IsPublic,
                CreatedAt = playlist.CreatedAt,
                Songs = playlist.PlaylistSongs.Select(ps => new SongInPlaylistDto
                {
                    SongId = ps.SongId,
                    AddedAt = ps.AddedAt
                }).ToList()
            };

            return Ok(dto);
        }

        // UPDATE PLAYLIST
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlaylist(int id, [FromBody] UpdatePlaylistRequest request)
        {
            var email = User.FindFirstValue("sub");
            var userId = await GetUserIdByEmailAsync(email);
            // Even if userId is null, check below implicitly handles it? No, need check.
            if (userId == null) return Unauthorized(new { message = "User record not found" });

            var playlist = await _context.Playlists.FindAsync(id);
            if (playlist == null)
                return NotFound(new { message = "Playlist not found" });

            // Only owner can update
            if (playlist.UserId != userId.Value)
                return Forbid();

            // Update only provided fields
            if (!string.IsNullOrWhiteSpace(request.Name))
                playlist.Name = request.Name;

            if (request.Description != null)
                playlist.Description = request.Description;

            if (request.IsPublic.HasValue)
                playlist.IsPublic = request.IsPublic.Value;

            await _context.SaveChangesAsync();

            return Ok(playlist);
        }

        // DELETE PLAYLIST
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlaylist(int id)
        {
            var email = User.FindFirstValue("sub");
            var userId = await GetUserIdByEmailAsync(email);
            var isAdmin = User.IsInRole("ADMIN");

            var playlist = await _context.Playlists
                .Include(p => p.PlaylistSongs)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (playlist == null)
                return NotFound(new { message = "Playlist not found" });

            // Only owner or admin can delete
            // If userId is null (not found in DB), deny unless admin? 
            // Admin logic might be tricky without userId, but let's assume Admin role is enough.
            if (!isAdmin)
            {
                if (userId == null || playlist.UserId != userId.Value)
                    return Forbid();
            }

            _context.Playlists.Remove(playlist);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Playlist deleted successfully" });
        }

        // ADD SONG TO PLAYLIST
        [Authorize]
        [HttpPost("{playlistId}/songs/{songId}")]
        public async Task<IActionResult> AddSongToPlaylist(int playlistId, int songId)
        {
            var email = User.FindFirstValue("sub");
            var userId = await GetUserIdByEmailAsync(email);
            if (userId == null) return Unauthorized(new { message = "User record not found" });

            var playlist = await _context.Playlists.FindAsync(playlistId);
            if (playlist == null)
                return NotFound(new { message = "Playlist not found" });

            // Only owner can add songs
            if (playlist.UserId != userId.Value)
                return Forbid();

            // Check if song already exists in playlist
            var exists = await _context.PlaylistSongs
                .AnyAsync(ps => ps.PlaylistId == playlistId && ps.SongId == songId);

            if (exists)
                return BadRequest(new { message = "Song already exists in playlist" });

            var playlistSong = new PlaylistSong
            {
                PlaylistId = playlistId,
                SongId = songId,
                AddedAt = DateTime.UtcNow
            };

            _context.PlaylistSongs.Add(playlistSong);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Song added to playlist successfully", playlistSong });
        }

        // REMOVE SONG FROM PLAYLIST
        [Authorize]
        [HttpDelete("{playlistId}/songs/{songId}")]
        public async Task<IActionResult> RemoveSongFromPlaylist(int playlistId, int songId)
        {
            var email = User.FindFirstValue("sub");
            var userId = await GetUserIdByEmailAsync(email);
            if (userId == null) return Unauthorized(new { message = "User record not found" });

            var playlist = await _context.Playlists.FindAsync(playlistId);
            if (playlist == null)
                return NotFound(new { message = "Playlist not found" });

            // Only owner can remove songs
            if (playlist.UserId != userId.Value)
                return Forbid();

            var playlistSong = await _context.PlaylistSongs
                .FirstOrDefaultAsync(ps => ps.PlaylistId == playlistId && ps.SongId == songId);

            if (playlistSong == null)
                return NotFound(new { message = "Song not found in playlist" });

            _context.PlaylistSongs.Remove(playlistSong);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Song removed from playlist successfully" });
        }

        // GET PLAYLIST SONGS (just the song IDs and metadata)
        [HttpGet("{playlistId}/songs")]
        public async Task<IActionResult> GetPlaylistSongs(int playlistId)
        {
            var playlist = await _context.Playlists
                .Include(p => p.PlaylistSongs)
                .FirstOrDefaultAsync(p => p.Id == playlistId);

            if (playlist == null)
                return NotFound(new { message = "Playlist not found" });

            // Check access
            if (!playlist.IsPublic)
            {
                 var email = User.FindFirstValue("sub");
                 if (string.IsNullOrEmpty(email)) return Forbid();
                 var userId = await GetUserIdByEmailAsync(email);
                 if (userId == null || playlist.UserId != userId.Value) return Forbid();
            }

            var songs = playlist.PlaylistSongs
                .OrderBy(ps => ps.AddedAt)
                .Select(ps => new SongInPlaylistDto
                {
                    SongId = ps.SongId,
                    AddedAt = ps.AddedAt
                })
                .ToList();

            return Ok(songs);
        }
    }
}
