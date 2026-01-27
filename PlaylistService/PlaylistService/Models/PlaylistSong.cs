using System.ComponentModel.DataAnnotations;

namespace PlaylistService.Models
{
    public class PlaylistSong
    {
        [Key]
        public int Id { get; set; }
        public int PlaylistId { get; set; }
        public int SongId { get; set; }
    }
}
