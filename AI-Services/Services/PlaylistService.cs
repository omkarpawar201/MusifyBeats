using AI_Services.Data;
using AI_Services.Models;

using Microsoft.EntityFrameworkCore;

namespace AI_Services.Services
{
    public class PlaylistService
    {
        private readonly AppDbContext _context;

        public PlaylistService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Song>> GetPlaylistByMood(string mood, int maxSongs)
        {
            if (maxSongs > 50) maxSongs = 50;

            return await _context.Songs
                .Where(s => s.Mood != null && s.Mood == mood)
                .OrderBy(x => Guid.NewGuid())
                .Take(maxSongs)
                .ToListAsync();
        }
    }
}
