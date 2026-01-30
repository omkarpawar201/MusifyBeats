using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PlaylistService.Models
{
    [Table("PlaylistSongs")]
    public class PlaylistSong
    {
        [Key]
        [Column("PlaylistId", Order = 0)]
        public int PlaylistId { get; set; }

        [Key]
        [Column("SongId", Order = 1)]
        public int SongId { get; set; }

        [Column("AddedAt")]
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("PlaylistId")]
        [JsonIgnore]
        public Playlist Playlist { get; set; }
    }
}

