import { musicApi, playlistApi } from './api';

export const musicService = {
    // Songs
    // AI
    getAiSuggestion: async (prompt) => {
        const response = await musicApi.post(`/ai/analyze`, { prompt });
        return response.data;
    },

    // Songs
    getAllSongs: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.genreId) params.append('genreId', filters.genreId);
        if (filters.moodId) params.append('moodId', filters.moodId);
        if (filters.artistId) params.append('artistId', filters.artistId);
        if (filters.language) params.append('language', filters.language);
        if (filters.page) params.append('page', filters.page);
        if (filters.pageSize) params.append('pageSize', filters.pageSize);

        const response = await musicApi.get(`/songs?${params.toString()}`);
        return response.data;
    },

    getSongById: async (id) => {
        const response = await musicApi.get(`/songs/${id}`);
        return response.data;
    },

    getTrending: async () => {
        const response = await musicApi.get('/songs/trending');
        return response.data;
    },

    search: async (query) => {
        const response = await musicApi.get(`/songs/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Likes
    likeSong: async (songId) => {
        const response = await musicApi.post(`/songs/${songId}/like`);
        return response.data;
    },

    unlikeSong: async (songId) => {
        const response = await musicApi.delete(`/songs/${songId}/like`);
        return response.data;
    },

    getLikedSongs: async () => {
        const response = await musicApi.get('/songs/liked');
        return response.data;
    },

    // Listening history
    trackListen: async (songId, durationPlayed) => {
        const response = await musicApi.post(`/songs/${songId}/listen`, durationPlayed);
        return response.data;
    },

    // Artists
    getAllArtists: async () => {
        const response = await musicApi.get('/artists');
        return response.data;
    },

    getArtistById: async (id) => {
        const response = await musicApi.get(`/artists/${id}`);
        return response.data;
    },

    // Albums
    getAllAlbums: async () => {
        const response = await musicApi.get('/albums');
        return response.data;
    },

    getAlbumById: async (id) => {
        const response = await musicApi.get(`/albums/${id}`);
        return response.data;
    },

    getAlbumsByArtist: async (artistId) => {
        const response = await musicApi.get(`/albums/artist/${artistId}`);
        return response.data;
    },

    createAlbum: async (data) => {
        const response = await musicApi.post('/albums', data);
        return response.data;
    },

    updateAlbum: async (id, data) => {
        const response = await musicApi.put(`/albums/${id}`, data);
        return response.data;
    },

    deleteAlbum: async (id) => {
        const response = await musicApi.delete(`/albums/${id}`);
        return response.data;
    },

    // Genres
    getAllGenres: async () => {
        const response = await musicApi.get('/genres');
        return response.data;
    },

    // Moods
    getAllMoods: async () => {
        const response = await musicApi.get('/moods');
        return response.data;
    },

    // Playlists (Using Playlist Microservice)
    getMyPlaylists: async () => {
        const response = await playlistApi.get('/my');
        return response.data;
    },

    getPublicPlaylists: async (page = 1, pageSize = 20) => {
        const response = await playlistApi.get(`/public?page=${page}&pageSize=${pageSize}`);
        return response.data;
    },

    getPlaylistById: async (id) => {
        const response = await playlistApi.get(`/${id}`);
        return response.data;
    },

    createPlaylist: async (name, description, isPublic = false) => {
        const response = await playlistApi.post('/', { name, description, isPublic });
        return response.data;
    },

    updatePlaylist: async (id, data) => {
        const response = await playlistApi.put(`/${id}`, data);
        return response.data;
    },

    deletePlaylist: async (id) => {
        const response = await playlistApi.delete(`/${id}`);
        return response.data;
    },

    addSongToPlaylist: async (playlistId, songId) => {
        const response = await playlistApi.post(`/${playlistId}/songs/${songId}`);
        return response.data;
    },

    removeSongFromPlaylist: async (playlistId, songId) => {
        const response = await playlistApi.delete(`/${playlistId}/songs/${songId}`);
        return response.data;
    },

    getSongsByBatch: async (ids) => {
        const response = await musicApi.post('/songs/batch', ids);
        return response.data;
    },

    getPlaylistSongs: async (playlistId) => {
        // 1. Get IDs from PlaylistService
        const response = await playlistApi.get(`/${playlistId}/songs`);
        const playlistSongs = response.data; // [{ songId: 1, addedAt: ... }]

        if (!playlistSongs || playlistSongs.length === 0) {
            return { songsDetails: [] };
        }

        // 2. Get Details from MusicService
        const ids = playlistSongs.map(ps => ps.songId);
        const songsDetails = await musicService.getSongsByBatch(ids);

        // 3. Return combined or just details (Admin page expects songsDetails)
        return { songsDetails };
    }
};
