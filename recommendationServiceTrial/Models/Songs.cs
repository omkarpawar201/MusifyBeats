using System.ComponentModel.DataAnnotations;

namespace MusicService.Models
{
    public class Song
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? Title { get; set; }

        public string? Artist { get; set; }
        public string? Album { get; set; }
        public string? Genre { get; set; }
    }
}
