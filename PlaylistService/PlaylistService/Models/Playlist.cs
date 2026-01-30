using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PlaylistService.Models
{
    [Table("Playlists")]
    public class Playlist
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("Name")]
        public string Name { get; set; }

        [MaxLength(500)]
        [Column("Description")]
        public string? Description { get; set; }

        [Required]
        [Column("UserId")]
        public long UserId { get; set; }

        [Column("IsPublic")]
        public bool IsPublic { get; set; } = false;

        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        [JsonIgnore]
        public AppUser AppUser { get; set; }

        [JsonIgnore]
        public ICollection<PlaylistSong> PlaylistSongs { get; set; } = new List<PlaylistSong>();
    }
}

