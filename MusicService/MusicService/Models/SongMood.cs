using System.ComponentModel.DataAnnotations.Schema;

namespace MusicService.Models
{
    public class SongMood
    {
        public int SongId { get; set; }
        public int MoodId { get; set; }

        // Navigation properties
        [ForeignKey("SongId")]
        public Song Song { get; set; }

        [ForeignKey("MoodId")]
        public Mood Mood { get; set; }
    }
}
