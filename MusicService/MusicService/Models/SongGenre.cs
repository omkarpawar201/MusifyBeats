using System.ComponentModel.DataAnnotations.Schema;

namespace MusicService.Models
{
    public class SongGenre
    {
        public int SongId { get; set; }
        public int GenreId { get; set; }

        // Navigation properties
        [ForeignKey("SongId")]
        public Song Song { get; set; }

        [ForeignKey("GenreId")]
        public Genre Genre { get; set; }
    }
}
