using System.Linq;
using System.Threading.Tasks;
using MusicService.Data;

namespace MusicService.Services
{
    public class RecommendationService
    {
        private readonly AppDbContext _context;
        private readonly GeminiClient _geminiClient;

        public RecommendationService(AppDbContext context, GeminiClient geminiClient)
        {
            _context = context;
            _geminiClient = geminiClient;
        }

        public async Task<string> GetPersonalizedRecommendations(string email)
        {
            var recentSongIds = _context.ListeningHistories
                .Where(l => l.UserEmail == email)
                .OrderByDescending(l => l.PlayedAt)
                .Take(20)
                .Select(l => l.SongId)
                .ToList();

            var song = _context.Songs
                .Where(s => recentSongIds.Contains(s.Id))
                .ToList();

            if (!song.Any())
                return "[]";

            var prompt = GeminiPromptBuilder.Build(song);
            return await _geminiClient.GetRecommendationsAsync(prompt);
        }
    }
}
