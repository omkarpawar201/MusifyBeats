using Microsoft.EntityFrameworkCore;
using MusicService.Models;

namespace MusicService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Song> Songs { get; set; }
        public DbSet<SongLike> SongLikes { get; set; }
    }
}
