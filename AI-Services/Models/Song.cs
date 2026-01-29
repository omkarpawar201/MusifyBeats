using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AI_Services.Models
{
    [Table("Songs")]
    public class Song
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("artist")]
        public string? Artist { get; set; }

        [Column("album")]
        public string? Album { get; set; }

        [Column("genre")]
        public string? Genre { get; set; }

        [Column("mood")]
        public string? Mood { get; set; }

        [Column("duration")]
        public int? Duration { get; set; }

        [Column("file_url")]
        public string? FileUrl { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }
    }
}
