import { musicApi } from './api';

export const adminService = {
    // Songs
    createSong: async (songData) => {
        const response = await musicApi.post('/songs', songData);
        return response.data;
    },

    updateSong: async (id, songData) => {
        const response = await musicApi.put(`/songs/${id}`, songData);
        return response.data;
    },

    deleteSong: async (id) => {
        const response = await musicApi.delete(`/songs/${id}`);
        return response.data;
    },

    // Artists
    createArtist: async (artistData) => {
        const response = await musicApi.post('/artists', artistData);
        return response.data;
    },

    updateArtist: async (id, artistData) => {
        const response = await musicApi.put(`/artists/${id}`, artistData);
        return response.data;
    },

    deleteArtist: async (id) => {
        const response = await musicApi.delete(`/artists/${id}`);
        return response.data;
    },

    // Albums
    createAlbum: async (albumData) => {
        const response = await musicApi.post('/albums', albumData);
        return response.data;
    },

    updateAlbum: async (id, albumData) => {
        const response = await musicApi.put(`/albums/${id}`, albumData);
        return response.data;
    },

    deleteAlbum: async (id) => {
        const response = await musicApi.delete(`/albums/${id}`);
        return response.data;
    },

    // Genres
    createGenre: async (genreData) => {
        const response = await musicApi.post('/genres', genreData);
        return response.data;
    },

    updateGenre: async (id, genreData) => {
        const response = await musicApi.put(`/genres/${id}`, genreData);
        return response.data;
    },

    deleteGenre: async (id) => {
        const response = await musicApi.delete(`/genres/${id}`);
        return response.data;
    },

    // Moods
    createMood: async (moodData) => {
        const response = await musicApi.post('/moods', moodData);
        return response.data;
    },

    updateMood: async (id, moodData) => {
        const response = await musicApi.put(`/moods/${id}`, moodData);
        return response.data;
    },

    deleteMood: async (id) => {
        const response = await musicApi.delete(`/moods/${id}`);
        return response.data;
    }
};
