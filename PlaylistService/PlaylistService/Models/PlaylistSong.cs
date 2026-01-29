using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlaylistService.Models
{
    [Table("playlist_songs")]
    public class PlaylistSong
    {
        [Key]
        [Column("playlist_id", Order = 0)]
        public int PlaylistId { get; set; }

        [Key]
        [Column("song_id", Order = 1)]
        public int SongId { get; set; }

        [Column("added_at")]
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("PlaylistId")]
        public Playlist Playlist { get; set; }
    }
}

