using System.ComponentModel.DataAnnotations;

namespace MusicService.Models
{
    public class SongLike
    {
        [Key]
        public int Id { get; set; }

        public int SongId { get; set; }
        public string UserEmail { get; set; }
    }
}
