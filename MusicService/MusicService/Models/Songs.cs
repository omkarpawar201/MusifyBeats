using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicService.Models
{
    public class Song
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(300)]
        public string Title { get; set; }

        // Duration in seconds
        public int Duration { get; set; }

        [MaxLength(100)]
        public string? Language { get; set; }

        // Foreign Keys
        public int? AlbumId { get; set; }

        [Required]
        public int ArtistId { get; set; }

        // File URLs
        [MaxLength(500)]
        public string? AudioUrl { get; set; }

        [MaxLength(500)]
        public string? CoverUrl { get; set; }

        // Navigation properties
        [ForeignKey("ArtistId")]
        public Artist Artist { get; set; }

        [ForeignKey("AlbumId")]
        public Album? Album { get; set; }

        // Many-to-many relationships
        public ICollection<SongGenre> SongGenres { get; set; } = new List<SongGenre>();
        public ICollection<SongMood> SongMoods { get; set; } = new List<SongMood>();
        public ICollection<SongLike> SongLikes { get; set; } = new List<SongLike>();
        public ICollection<ListeningHistory> ListeningHistories { get; set; } = new List<ListeningHistory>();
    }
}
