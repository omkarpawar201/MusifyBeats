using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicService.Models
{
    public class Album
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        public int ArtistId { get; set; }

        public DateTime? ReleaseDate { get; set; }

        [MaxLength(500)]
        public string? CoverUrl { get; set; }

        // Navigation properties
        [ForeignKey("ArtistId")]
        public Artist Artist { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<Song> Songs { get; set; } = new List<Song>();
    }
}
