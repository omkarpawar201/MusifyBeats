using Microsoft.EntityFrameworkCore;
using PlaylistService.Models;

namespace PlaylistService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<PlaylistSong> PlaylistSongs { get; set; }
        public DbSet<AppUser> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Map entities to lowercase table names
            modelBuilder.Entity<Playlist>().ToTable("playlists");
            modelBuilder.Entity<PlaylistSong>().ToTable("playlist_songs");
            modelBuilder.Entity<AppUser>().ToTable("users");

            // Configure Playlist-PlaylistSong relationship and Composite Key
            modelBuilder.Entity<PlaylistSong>()
                .HasKey(ps => new { ps.PlaylistId, ps.SongId });

            modelBuilder.Entity<PlaylistSong>()
                .HasOne(ps => ps.Playlist)
                .WithMany(p => p.PlaylistSongs)
                .HasForeignKey(ps => ps.PlaylistId)
                .OnDelete(DeleteBehavior.Cascade);

            // Create index on UserId for faster queries
            modelBuilder.Entity<Playlist>()
                .HasIndex(p => p.UserId);

            // Create index on IsPublic for public playlist queries
            modelBuilder.Entity<Playlist>()
                .HasIndex(p => p.IsPublic);
        }
    }
}

