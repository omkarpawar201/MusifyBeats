using Microsoft.EntityFrameworkCore;
using MusicService.Models;

namespace MusicService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Song> Songs { get; set; }
        public DbSet<Artist> Artists { get; set; }
        public DbSet<Album> Albums { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Mood> Moods { get; set; }
        public DbSet<SongGenre> SongGenres { get; set; }
        public DbSet<SongMood> SongMoods { get; set; }
        public DbSet<SongLike> SongLikes { get; set; }
        public DbSet<ListeningHistory> ListeningHistories { get; set; }
        public DbSet<AppUser> Users { get; set; } // Added AppUser DbSet

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Map entities to match existing Database Schema (PascalCase from Identity/Migrations)
            modelBuilder.Entity<Song>().ToTable("Songs");
            modelBuilder.Entity<Artist>().ToTable("Artists");
            modelBuilder.Entity<Album>().ToTable("Albums");
            modelBuilder.Entity<Genre>().ToTable("Genres");
            modelBuilder.Entity<Mood>().ToTable("Moods");
            modelBuilder.Entity<SongGenre>().ToTable("SongGenres");
            modelBuilder.Entity<SongMood>().ToTable("SongMoods");
            modelBuilder.Entity<SongLike>().ToTable("SongLikes");
            modelBuilder.Entity<ListeningHistory>().ToTable("ListeningHistories");
            // AppUser might not exist in Music DB yet if it's new, but keeping it consistent if it does.
            // If MusicService shares DB with Auth, it might be 'users'. 
            // But based on context, MusicService likely doesn't own Users or it's a separate microservice. 
            // However, theDbContext has it. Let's assume it should be "Users" if it exists, or strict mapping.
            // Given the migration didn't have it, we might error on 'Users' later, but let's fix the known errors first.
            modelBuilder.Entity<AppUser>().ToTable("Users");

            // Configure composite keys for junction tables
            modelBuilder.Entity<SongGenre>()
                .HasKey(sg => new { sg.SongId, sg.GenreId });

            modelBuilder.Entity<SongMood>()
                .HasKey(sm => new { sm.SongId, sm.MoodId });

            // Configure relationships
            modelBuilder.Entity<SongGenre>()
                .HasOne(sg => sg.Song)
                .WithMany(s => s.SongGenres)
                .HasForeignKey(sg => sg.SongId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SongGenre>()
                .HasOne(sg => sg.Genre)
                .WithMany(g => g.SongGenres)
                .HasForeignKey(sg => sg.GenreId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SongMood>()
                .HasOne(sm => sm.Song)
                .WithMany(s => s.SongMoods)
                .HasForeignKey(sm => sm.SongId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SongMood>()
                .HasOne(sm => sm.Mood)
                .WithMany(m => m.SongMoods)
                .HasForeignKey(sm => sm.MoodId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Album-Artist relationship
            modelBuilder.Entity<Album>()
                .HasOne(a => a.Artist)
                .WithMany(ar => ar.Albums)
                .HasForeignKey(a => a.ArtistId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Song-Artist relationship
            modelBuilder.Entity<Song>()
                .HasOne(s => s.Artist)
                .WithMany(a => a.Songs)
                .HasForeignKey(s => s.ArtistId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Song-Album relationship
            modelBuilder.Entity<Song>()
                .HasOne(s => s.Album)
                .WithMany(a => a.Songs)
                .HasForeignKey(s => s.AlbumId)
                .OnDelete(DeleteBehavior.SetNull);
             
             // Verify column mappings for key entities if needed (optional since attributes handle it)
        }
    }
}
