using System.ComponentModel.DataAnnotations;

namespace MusicService.Models
{
    public class Genre
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        // Navigation property for many-to-many relationship
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<SongGenre> SongGenres { get; set; } = new List<SongGenre>();
    }
}
