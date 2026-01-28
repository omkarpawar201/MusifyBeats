import { musicApi } from './api';

export const musicService = {
    // Songs
    getAllSongs: async () => {
        const response = await musicApi.get('/songs');
        return response.data;
    },

    getTrending: async () => {
        const response = await musicApi.get('/songs/trending');
        return response.data;
    },

    getNewReleases: async () => {
        const response = await musicApi.get('/albums/new-releases');
        return response.data;
    },

    // Search
    search: async (query) => {
        const response = await musicApi.get(`/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Playlists
    getMyPlaylists: async () => {
        const response = await musicApi.get('/playlists/my');
        return response.data;
    },

    createPlaylist: async (name, description) => {
        const response = await musicApi.post('/playlists', { name, description });
        return response.data;
    }
};
