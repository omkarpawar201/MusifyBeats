using Microsoft.EntityFrameworkCore;
using PlaylistService.Models;

namespace PlaylistService.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Playlist> Playlists { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

    }
}
