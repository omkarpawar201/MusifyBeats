using System.Collections.Generic;
using System.Linq;
using MusicService.Models;

namespace MusicService.Services
{
    public static class GeminiPromptBuilder
    {
        public static string Build(List<Song> songs)
        {
            var history = string.Join("\n",
                songs.Select(s => $"{s.Title} by {s.Artist} ({s.Genre})"));

            return $@"
You are an AI music recommendation system.

User listening history:
{history}

Recommend 10 new songs:
- Similar genre and mood
- Do NOT repeat songs
- Mix of popular and new

Return JSON only in format:
[
  {{ ""title"": """", ""artist"": """", ""genre"": """" }}
]
";
        }
    }
}
