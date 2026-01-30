using System.ComponentModel.DataAnnotations;

namespace MusicService.Models
{
    public class Mood
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        // Navigation property for many-to-many relationship
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<SongMood> SongMoods { get; set; } = new List<SongMood>();
    }
}
