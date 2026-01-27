using System.ComponentModel.DataAnnotations;

namespace PlaylistService.Models
{
    public class Playlist
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string OwnerEmail { get; set; }

        // Store as JSON or comma-separated for now
        public string Songs { get; set; } = "";
    }
}
