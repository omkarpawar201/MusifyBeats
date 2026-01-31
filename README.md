<p align="center">
  <img src="assets/musifybeats-logo1.png" alt="MusifyBeats Logo" width="200"/>
</p>

# MusifyBeats

MusifyBeats is a modern, full-stack music streaming web application built with a microservices architecture. It delivers high-quality music playback experiences with advanced features like AI-powered recommendations, playlist management, and comprehensive music library organization.

## 🏗️ Architecture

The application follows a microservices architecture with three independent backend services and a unified React frontend:

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│                    Vite + TailwindCSS                        │
└───────────────┬─────────────┬──────────────┬────────────────┘
                │             │              │
        ┌───────▼──────┐ ┌───▼──────┐ ┌────▼─────────┐
        │ Auth Service │ │  Music   │ │  Playlist    │
        │   (Java)     │ │ Service  │ │  Service     │
        │ Spring Boot  │ │(.NET 8)  │ │  (.NET 8)    │
        └──────┬───────┘ └────┬─────┘ └──────┬───────┘
               │              │               │
        ┌──────▼──────────────▼───────────────▼───────┐
        │         Microsoft SQL Server                 │
        └─────────────────────────────────────────────┘
```

## ✨ Features

### User Management
- **User Registration & Authentication** - Secure JWT-based authentication
- **Profile Management** - User profile customization and settings
- **Role-based Access Control** - Secure authorization system

### Music Library
- **Comprehensive Music Catalog** - Browse songs, albums, and artists
- **Advanced Search** - Search by title, artist, album, genre, mood, or language
- **Rich Metadata** - Detailed information including genres, moods, release dates, and more
- **Album Management** - Organized album collections with cover art
- **Artist Profiles** - Dedicated artist pages with discographies

### Playback & Streaming
- **High-Quality Audio Streaming** - Efficient HTTP range request-based streaming
- **Audio Player** - Full-featured player with controls and progress tracking
- **Queue Management** - Play queue with shuffle and repeat options

### Playlists
- **Create & Manage Playlists** - Personal playlist creation and organization
- **Add/Remove Songs** - Easy playlist curation
- **Playlist Sharing** - Share playlists with other users

### AI Features
- **AI-Powered Recommendations** - Intelligent music suggestions based on listening habits
- **Mood-based Discovery** - Find music matching your current mood
- **Genre Exploration** - Discover new music across different genres

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM 6.30
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form + Zod validation

### Backend Services

#### Auth Service (Java)
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Security**: Spring Security + JWT (JJWT 0.11.5)
- **ORM**: Spring Data JPA
- **Database**: Microsoft SQL Server / H2 (development)
- **Password Encryption**: BCrypt

#### Music Service (.NET)
- **Framework**: ASP.NET Core 8.0
- **Language**: C#
- **ORM**: Entity Framework Core 8.0
- **Database**: Microsoft SQL Server
- **Authentication**: JWT Bearer
- **API Documentation**: Swagger/OpenAPI

#### Playlist Service (.NET)
- **Framework**: ASP.NET Core 8.0
- **Language**: C#
- **ORM**: Entity Framework Core 8.0
- **Database**: Microsoft SQL Server
- **Authentication**: JWT Bearer
- **API Documentation**: Swagger/OpenAPI

### Database
- **RDBMS**: Microsoft SQL Server
- **Schema**: Normalized relational design with proper indexing
- **Storage**: Local file storage for audio files and cover images

### Cloud & Deployment
- **Cloud Platform**: Microsoft Azure
- **Containerization**: Docker support
- **CI/CD**: Azure DevOps pipelines

## 📁 Project Structure

```
Project final/
├── Frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layers
│   │   ├── context/            # React context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── routes/             # Route configurations
│   │   └── lib/                # Utility libraries
│   ├── public/                 # Static assets
│   └── package.json
│
├── auth-service/               # Java Spring Boot authentication service
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/musifybeats/auth/
│   │   │   │   ├── config/    # Security & CORS configuration
│   │   │   │   ├── controller/# REST controllers
│   │   │   │   ├── model/     # Entity models
│   │   │   │   ├── repository/# Data repositories
│   │   │   │   └── service/   # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
├── MusicService/               # .NET Core music management service
│   └── MusicService/
│       ├── Controllers/        # API controllers
│       │   ├── SongController.cs
│       │   ├── AlbumController.cs
│       │   ├── ArtistController.cs
│       │   ├── GenreController.cs
│       │   ├── MoodController.cs
│       │   └── AiController.cs
│       ├── Models/             # Entity models
│       ├── Data/               # DbContext & repositories
│       ├── Services/           # Business logic
│       ├── Migrations/         # EF Core migrations
│       └── MusicService.csproj
│
├── PlaylistService/            # .NET Core playlist service
│   └── PlaylistService/
│       ├── Controllers/
│       │   └── PlaylistController.cs
│       ├── Models/             # Entity models
│       ├── Data/               # DbContext & repositories
│       ├── Services/           # Business logic
│       └── PlaylistService.csproj
│
└── assets/                     # Project assets (logos, etc.)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17 or higher
- **.NET SDK** 8.0
- **Microsoft SQL Server** (Express, Developer, or LocalDB)
- **Maven** 3.6+ (for Java service)
- **Git**

### Environment Variables

#### Frontend (.env)
```env
VITE_AUTH_API=http://localhost:8080
VITE_MUSIC_API=http://localhost:5000
VITE_PLAYLIST_API=http://localhost:5001
```

#### Auth Service (application.properties)
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=MusifyBeatsAuth;encrypt=true;trustServerCertificate=true
spring.datasource.username=your_username
spring.datasource.password=your_password
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000
```

#### Music Service (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MusifyBeatsMusic;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "JwtSettings": {
    "Secret": "your_jwt_secret_key",
    "Issuer": "MusifyBeats",
    "Audience": "MusifyBeatsUsers"
  }
}
```

#### Playlist Service (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MusifyBeatsPlaylist;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "JwtSettings": {
    "Secret": "your_jwt_secret_key",
    "Issuer": "MusifyBeats",
    "Audience": "MusifyBeatsUsers"
  }
}
```

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Project final"
```

#### 2. Setup Auth Service (Java)
```bash
cd auth-service
mvn clean install
mvn spring-boot:run
# Service runs on http://localhost:8080
```

#### 3. Setup Music Service (.NET)
```bash
cd MusicService/MusicService
dotnet restore
dotnet ef database update
dotnet run
# Service runs on http://localhost:5000
```

#### 4. Setup Playlist Service (.NET)
```bash
cd PlaylistService/PlaylistService
dotnet restore
dotnet ef database update
dotnet run
# Service runs on http://localhost:5001
```

#### 5. Setup Frontend (React)
```bash
cd Frontend
npm install
npm run dev
# Application runs on http://localhost:5173
```

## 📊 Database Schema

The application uses three separate databases:

- **MusifyBeatsAuth** - User authentication and profile data
- **MusifyBeatsMusic** - Songs, albums, artists, genres, moods, and metadata
- **MusifyBeatsPlaylist** - User playlists and playlist-song relationships

### Key Entities

**Auth Database:**
- Users
- Roles
- UserRoles

**Music Database:**
- Songs
- Albums
- Artists
- Genres
- Moods
- Languages
- SongGenres (many-to-many)
- SongMoods (many-to-many)
- AlbumArtists (many-to-many)

**Playlist Database:**
- Playlists
- PlaylistSongs
- UserPlaylists

## 🔒 Security

- **JWT Authentication** - Secure token-based authentication across all services
- **Password Encryption** - BCrypt hashing for user passwords
- **CORS Configuration** - Properly configured cross-origin resource sharing
- **HTTPS Support** - SSL/TLS encryption for production deployments
- **Input Validation** - Comprehensive validation on both frontend and backend
- **SQL Injection Prevention** - Parameterized queries via ORM

## 🧪 Testing

### Frontend
```bash
cd Frontend
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
```

### Backend Services
```bash
# Auth Service
cd auth-service
mvn test

# Music Service
cd MusicService/MusicService
dotnet test

# Playlist Service
cd PlaylistService/PlaylistService
dotnet test
```

## 📦 Building for Production

### Frontend
```bash
cd Frontend
npm run build
# Output in dist/ folder
```

### Backend Services
```bash
# Auth Service
cd auth-service
mvn clean package
# JAR file in target/ folder

# Music Service
cd MusicService/MusicService
dotnet publish -c Release
# Published files in bin/Release/net8.0/publish/

# Playlist Service
cd PlaylistService/PlaylistService
dotnet publish -c Release
# Published files in bin/Release/net8.0/publish/
```

## 🌐 API Documentation

Once the services are running, access the API documentation:

- **Auth Service**: http://localhost:8080/swagger-ui.html (if configured)
- **Music Service**: http://localhost:5000/swagger
- **Playlist Service**: http://localhost:5001/swagger

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


For support, email support@musifybeats.com or open an issue in the repository.

---

<p align="center">Made with ❤️ by the MusifyBeats Team</p>
