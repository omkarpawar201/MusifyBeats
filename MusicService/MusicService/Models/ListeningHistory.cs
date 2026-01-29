using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicService.Models
{
    [Table("listening_history")]
    public class ListeningHistory
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("user_id")]
        public long UserId { get; set; }

        [Required]
        [Column("song_id")]
        public int SongId { get; set; }

        [Required]
        [Column("played_at")]
        public DateTime PlayedAt { get; set; }

        // Duration played in seconds
        [Column("duration_played")]
        public int DurationPlayed { get; set; }

        // Navigation properties
        [ForeignKey("SongId")]
        public Song Song { get; set; }

        [ForeignKey("UserId")]
        public AppUser AppUser { get; set; }
    }
}
