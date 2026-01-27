using System.ComponentModel.DataAnnotations;

namespace PlaylistService.Models
{
    public class Playlist
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string OwnerEmail { get; set; }
    }
}
