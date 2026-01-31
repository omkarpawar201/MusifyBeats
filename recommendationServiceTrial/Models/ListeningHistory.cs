using System;

namespace MusicService.Models
{
    public class ListeningHistory
    {
        public int Id { get; set; }
        public string? UserEmail { get; set; }
        public int SongId { get; set; }
        public DateTime PlayedAt { get; set; }
    }
}
