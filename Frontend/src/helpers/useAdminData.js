import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { musicApi, authApi, playlistApi } from "../services/api";
import { toast } from "sonner";
import axios from 'axios';

// Admin Stats
export const useAdminStats = () => {
    return useQuery({
        queryKey: ["admin", "stats"],
        queryFn: async () => {
            // Fetching stats from multiple endpoints to aggregate
            // Ideally, specific admin endpoints should exist. Using normal ones for now functionality.
            // Or mocking slightly if admin endpoints are not ready, but we will try to use list endpoints.
            const [users, songs, artists, playlists] = await Promise.all([
                authApi.get("/users"), // Adjust if this endpoint doesn't exist or is different
                musicApi.get("/songs"),
                musicApi.get("/artists"),
                playlistApi.get("/public") // Proxy for total playlists
            ]);

            // Mocking recent users if not available
            const recentUsers = users.data ? users.data.slice(0, 5) : [];

            return {
                totalUsers: users.data?.length || 0,
                totalSongs: songs.data?.totalCount || songs.data?.songs?.length || 0,
                totalArtists: artists.data?.length || 0,
                totalPlaylists: playlists.data?.totalCount || playlists.data?.playlists?.length || 0,
                recentUsers
            };
        },
        // Fallback if APIs fail (e.g. auth/users might not exist yet)
        retry: false
    });
};


// --- Songs ---
export const useAdminSongs = (search) => {
    return useQuery({
        queryKey: ["admin", "songs", search],
        queryFn: async () => {
            const params = search ? { search } : {};
            const { data } = await musicApi.get("/songs", { params });
            // Enhance data if needed, or if API returns array directly
            return { songs: Array.isArray(data) ? data : data.songs || [] };
        },
    });
};

export const useCreateOrUpdateSong = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (songData) => {
            if (songData.id) {
                return musicApi.put(`/songs/${songData.id}`, songData);
            } else {
                return musicApi.post("/songs", songData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["admin", "songs"]);
            toast.success("Song saved successfully");
        },
        onError: (err) => {
            toast.error("Failed to save song");
            console.error(err);
        }
    });
};

export const useDeleteSong = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id }) => {
            return musicApi.delete(`/songs/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["admin", "songs"]);
            toast.success("Song deleted");
        },
        onError: () => toast.error("Failed to delete song"),
    });
};


// --- Artists ---
export const useAdminArtists = () => {
    return useQuery({
        queryKey: ["admin", "artists"],
        queryFn: async () => {
            const { data } = await musicApi.get("/artists");
            return { artists: Array.isArray(data) ? data : [] };
        },
    });
};

export const useCreateOrUpdateArtist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (artistData) => {
            if (artistData.id) {
                return musicApi.put(`/artists/${artistData.id}`, artistData);
            } else {
                return musicApi.post("/artists", artistData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["admin", "artists"]);
            toast.success("Artist saved successfully");
        },
        onError: () => toast.error("Failed to save artist"),
    });
};

export const useDeleteArtist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id }) => {
            return musicApi.delete(`/artists/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["admin", "artists"]);
            toast.success("Artist deleted");
        },
        onError: () => toast.error("Failed to delete artist"),
    });
};


// --- Users ---
export const useAdminUsers = () => {
    return useQuery({
        queryKey: ["admin", "users"],
        queryFn: async () => {
            // Assuming GET /api/auth/users exists for admins
            const { data } = await authApi.get("/users");
            return { users: Array.isArray(data) ? data : [] };
        },
    });
};

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, role }) => {
            return authApi.put(`/users/${userId}/role`, { role });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["admin", "users"]);
            toast.success("User role updated");
        },
        onError: () => toast.error("Failed to update role"),
    });
};
