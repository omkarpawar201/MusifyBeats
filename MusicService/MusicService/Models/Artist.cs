using System.ComponentModel.DataAnnotations;

namespace MusicService.Models
{
    public class Artist
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(1000)]
        public string? Bio { get; set; }

        // Navigation properties
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<Song> Songs { get; set; } = new List<Song>();

        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<Album> Albums { get; set; } = new List<Album>();
    }
}
