using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicService.Models
{
    [Table("song_likes")]
    public class SongLike
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("song_id")]
        public int SongId { get; set; }

        [Required]
        [Column("user_id")]
        public long UserId { get; set; }

        // Navigation properties
        [ForeignKey("SongId")]
        public Song Song { get; set; }

        [ForeignKey("UserId")]
        public AppUser AppUser { get; set; }
    }
}

