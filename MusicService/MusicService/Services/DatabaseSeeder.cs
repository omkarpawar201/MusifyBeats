using MusicService.Data;
using MusicService.Models;

namespace MusicService.Services
{
    public class DatabaseSeeder
    {
        private readonly AppDbContext _context;

        public DatabaseSeeder(AppDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            // Check if data already exists
            if (_context.Artists.Any())
            {
                return; // Database already seeded
            }

            // Create Genres
            var genres = new List<Genre>
            {
                new Genre { Name = "Pop" },
                new Genre { Name = "Rock" },
                new Genre { Name = "Hip-Hop" },
                new Genre { Name = "Electronic" },
                new Genre { Name = "Jazz" },
                new Genre { Name = "Classical" },
                new Genre { Name = "R&B" },
                new Genre { Name = "Country" },
                new Genre { Name = "Indie" },
                new Genre { Name = "Bollywood" }
            };
            _context.Genres.AddRange(genres);
            await _context.SaveChangesAsync();

            // Create Moods
            var moods = new List<Mood>
            {
                new Mood { Name = "Happy" },
                new Mood { Name = "Sad" },
                new Mood { Name = "Energetic" },
                new Mood { Name = "Relaxing" },
                new Mood { Name = "Romantic" },
                new Mood { Name = "Motivational" },
                new Mood { Name = "Chill" },
                new Mood { Name = "Party" }
            };
            _context.Moods.AddRange(moods);
            await _context.SaveChangesAsync();

            // Create Artists
            var artists = new List<Artist>
            {
                new Artist { Name = "The Weeknd", Bio = "Canadian singer and songwriter" },
                new Artist { Name = "Taylor Swift", Bio = "American singer-songwriter" },
                new Artist { Name = "Drake", Bio = "Canadian rapper and singer" },
                new Artist { Name = "Dua Lipa", Bio = "British-Albanian singer" },
                new Artist { Name = "Ed Sheeran", Bio = "English singer-songwriter" },
                new Artist { Name = "Billie Eilish", Bio = "American singer-songwriter" },
                new Artist { Name = "Arijit Singh", Bio = "Indian playback singer" },
                new Artist { Name = "Coldplay", Bio = "British rock band" },
                new Artist { Name = "Imagine Dragons", Bio = "American pop rock band" },
                new Artist { Name = "Ariana Grande", Bio = "American singer and actress" }
            };
            _context.Artists.AddRange(artists);
            await _context.SaveChangesAsync();

            // Create Albums
            var albums = new List<Album>
            {
                new Album { Title = "After Hours", ArtistId = 1, ReleaseDate = new DateTime(2020, 3, 20) },
                new Album { Title = "Midnights", ArtistId = 2, ReleaseDate = new DateTime(2022, 10, 21) },
                new Album { Title = "Certified Lover Boy", ArtistId = 3, ReleaseDate = new DateTime(2021, 9, 3) },
                new Album { Title = "Future Nostalgia", ArtistId = 4, ReleaseDate = new DateTime(2020, 3, 27) },
                new Album { Title = "Divide", ArtistId = 5, ReleaseDate = new DateTime(2017, 3, 3) },
                new Album { Title = "Happier Than Ever", ArtistId = 6, ReleaseDate = new DateTime(2021, 7, 30) },
                new Album { Title = "Aashiqui 2", ArtistId = 7, ReleaseDate = new DateTime(2013, 4, 26) },
                new Album { Title = "A Head Full of Dreams", ArtistId = 8, ReleaseDate = new DateTime(2015, 12, 4) },
                new Album { Title = "Evolve", ArtistId = 9, ReleaseDate = new DateTime(2017, 6, 23) },
                new Album { Title = "Positions", ArtistId = 10, ReleaseDate = new DateTime(2020, 10, 30) }
            };
            _context.Albums.AddRange(albums);
            await _context.SaveChangesAsync();

            // Create Songs
            var songs = new List<Song>
            {
                new Song { Title = "Blinding Lights", ArtistId = 1, AlbumId = 1, Duration = 200, Language = "English", AudioUrl = "https://localhost:44342/audio/1.mp3", CoverUrl = "https://localhost:44342/covers/1.jpg" },
                new Song { Title = "Save Your Tears", ArtistId = 1, AlbumId = 1, Duration = 215, Language = "English", AudioUrl = "https://localhost:44342/audio/2.mp3", CoverUrl = "https://localhost:44342/covers/2.jpg" },
                new Song { Title = "Anti-Hero", ArtistId = 2, AlbumId = 2, Duration = 200, Language = "English", AudioUrl = "https://localhost:44342/audio/3.mp3", CoverUrl = "https://localhost:44342/covers/3.jpg" },
                new Song { Title = "Lavender Haze", ArtistId = 2, AlbumId = 2, Duration = 202, Language = "English", AudioUrl = "https://localhost:44342/audio/4.mp3", CoverUrl = "https://localhost:44342/covers/4.jpg" },
                new Song { Title = "One Dance", ArtistId = 3, AlbumId = 3, Duration = 173, Language = "English", AudioUrl = "https://localhost:44342/audio/5.mp3", CoverUrl = "http://localhost:44342/covers/5.jpg" },
                new Song { Title = "Levitating", ArtistId = 4, AlbumId = 4, Duration = 203, Language = "English", AudioUrl = "https://localhost:44342/audio/6.mp3", CoverUrl = "http://localhost:44342/covers/6.jpg" },
                new Song { Title = "Don't Start Now", ArtistId = 4, AlbumId = 4, Duration = 183, Language = "English", AudioUrl = "https://localhost:44342/audio/7.mp3", CoverUrl = "http://localhost:5000/covers/7.jpg" },
                new Song { Title = "Shape of You", ArtistId = 5, AlbumId = 5, Duration = 233, Language = "English", AudioUrl = "https://localhost:44342/audio/8.mp3", CoverUrl = "http://localhost:5000/covers/8.jpg" },
                new Song { Title = "Perfect", ArtistId = 5, AlbumId = 5, Duration = 263, Language = "English", AudioUrl = "https://localhost:44342/audio/9.mp3", CoverUrl = "http://localhost:5000/covers/9.jpg" },
                new Song { Title = "Happier Than Ever", ArtistId = 6, AlbumId = 6, Duration = 298, Language = "English", AudioUrl = "https://localhost:44342/audio/10.mp3", CoverUrl = "http://localhost:5000/covers/10.jpg" },
                new Song { Title = "Tum Hi Ho", ArtistId = 7, AlbumId = 7, Duration = 262, Language = "Hindi", AudioUrl = "https://localhost:44342/audio/11.mp3", CoverUrl = "http://localhost:5000/covers/11.jpg" },
                new Song { Title = "Adventure of a Lifetime", ArtistId = 8, AlbumId = 8, Duration = 263, Language = "English", AudioUrl = "https://localhost:5000/audio/12.mp3", CoverUrl = "http://localhost:5000/covers/12.jpg" },
                new Song { Title = "Believer", ArtistId = 9, AlbumId = 9, Duration = 204, Language = "English", AudioUrl = "https://localhost:5000/audio/13.mp3", CoverUrl = "http://localhost:5000/covers/13.jpg" },
                new Song { Title = "Thunder", ArtistId = 9, AlbumId = 9, Duration = 187, Language = "English", AudioUrl = "httsp://localhost:5000/audio/14.mp3", CoverUrl = "http://localhost:5000/covers/14.jpg" },
                new Song { Title = "positions", ArtistId = 10, AlbumId = 10, Duration = 172, Language = "English", AudioUrl = "https://localhost:5000/audio/15.mp3", CoverUrl = "http://localhost:5000/covers/15.jpg" }
            };
            _context.Songs.AddRange(songs);
            await _context.SaveChangesAsync();

            // Add Genres to Songs
            var songGenres = new List<SongGenre>
            {
                new SongGenre { SongId = 1, GenreId = 1 }, // Blinding Lights - Pop
                new SongGenre { SongId = 1, GenreId = 4 }, // Blinding Lights - Electronic
                new SongGenre { SongId = 2, GenreId = 1 }, // Save Your Tears - Pop
                new SongGenre { SongId = 3, GenreId = 1 }, // Anti-Hero - Pop
                new SongGenre { SongId = 4, GenreId = 1 }, // Lavender Haze - Pop
                new SongGenre { SongId = 5, GenreId = 3 }, // One Dance - Hip-Hop
                new SongGenre { SongId = 6, GenreId = 1 }, // Levitating - Pop
                new SongGenre { SongId = 7, GenreId = 1 }, // Don't Start Now - Pop
                new SongGenre { SongId = 8, GenreId = 1 }, // Shape of You - Pop
                new SongGenre { SongId = 9, GenreId = 1 }, // Perfect - Pop
                new SongGenre { SongId = 10, GenreId = 1 }, // Happier Than Ever - Pop
                new SongGenre { SongId = 11, GenreId = 10 }, // Tum Hi Ho - Bollywood
                new SongGenre { SongId = 12, GenreId = 2 }, // Adventure - Rock
                new SongGenre { SongId = 13, GenreId = 2 }, // Believer - Rock
                new SongGenre { SongId = 14, GenreId = 2 }, // Thunder - Rock
                new SongGenre { SongId = 15, GenreId = 7 }  // positions - R&B
            };
            _context.SongGenres.AddRange(songGenres);
            await _context.SaveChangesAsync();

            // Add Moods to Songs
            var songMoods = new List<SongMood>
            {
                new SongMood { SongId = 1, MoodId = 3 }, // Blinding Lights - Energetic
                new SongMood { SongId = 2, MoodId = 2 }, // Save Your Tears - Sad
                new SongMood { SongId = 3, MoodId = 1 }, // Anti-Hero - Happy
                new SongMood { SongId = 4, MoodId = 7 }, // Lavender Haze - Chill
                new SongMood { SongId = 5, MoodId = 8 }, // One Dance - Party
                new SongMood { SongId = 6, MoodId = 8 }, // Levitating - Party
                new SongMood { SongId = 7, MoodId = 3 }, // Don't Start Now - Energetic
                new SongMood { SongId = 8, MoodId = 5 }, // Shape of You - Romantic
                new SongMood { SongId = 9, MoodId = 5 }, // Perfect - Romantic
                new SongMood { SongId = 10, MoodId = 2 }, // Happier Than Ever - Sad
                new SongMood { SongId = 11, MoodId = 5 }, // Tum Hi Ho - Romantic
                new SongMood { SongId = 12, MoodId = 1 }, // Adventure - Happy
                new SongMood { SongId = 13, MoodId = 6 }, // Believer - Motivational
                new SongMood { SongId = 14, MoodId = 3 }, // Thunder - Energetic
                new SongMood { SongId = 15, MoodId = 5 }  // positions - Romantic
            };
            _context.SongMoods.AddRange(songMoods);
            await _context.SaveChangesAsync();
        }
    }
}
