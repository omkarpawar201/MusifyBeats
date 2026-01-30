import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { musicService } from '../services/musicService';
import { authService } from '../services/authService';
import { usePlayer } from '../context/PlayerContext';
import MainLayout from '../components/layout/MainLayout';
import { Play, Clock, Trash2, Music, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PlaylistDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { playSong } = usePlayer();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        setCurrentUser(authService.getCurrentUser());
        fetchPlaylist();
    }, [id]);

    const fetchPlaylist = async () => {
        try {
            setLoading(true);
            const data = await musicService.getPlaylistById(id);

            // Enrich songs with details if they are just IDs (depending on backend response)
            // Backend returns { ..., songs: [{ songId, addedAt }] } usually.
            // We need full song details. 
            // The backend for 'getPlaylistById' returns:
            // "Songs": [{"songId": 1, "addedAt": "..."}] 
            // It does NOT return full song objects for the "Songs" list in the DTO I inspected earlier.
            // Wait, inspect musicService.js / PlaylistService.
            // PlaylistController.cs: "Songs = playlist.PlaylistSongs.Select(ps => new SongInPlaylistDto ...)"
            // So we ONLY get IDs. We need to fetch song details for each ID.

            // This is inefficient (N+1), but for now we must do it or update backend.
            // Let's do it here for now.

            if (data.songs && data.songs.length > 0) {
                const songPromises = data.songs.map(s => musicService.getSongById(s.songId));
                const songsDetails = await Promise.all(songPromises);
                data.songsDetails = songsDetails; // Attach full objects
            } else {
                data.songsDetails = [];
            }

            setPlaylist(data);
        } catch (error) {
            console.error("Error fetching playlist:", error);
            toast.error("Failed to load playlist");
            navigate('/library');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlaylist = async () => {
        if (!confirm("Are you sure you want to delete this playlist?")) return;
        try {
            await musicService.deletePlaylist(id);
            toast.success("Playlist deleted");
            navigate('/library');
        } catch (error) {
            toast.error("Failed to delete playlist");
        }
    };

    const handleRemoveSong = async (songId) => {
        try {
            await musicService.removeSongFromPlaylist(id, songId);
            setPlaylist(prev => ({
                ...prev,
                songsDetails: prev.songsDetails.filter(s => s.id !== songId)
            }));
            toast.success("Song removed from playlist");
        } catch (error) {
            toast.error("Failed to remove song");
        }
    };

    const handlePlayPlaylist = () => {
        if (playlist?.songsDetails?.length > 0) {
            playSong(playlist.songsDetails[0], playlist.songsDetails);
        }
    };

    if (loading) return <MainLayout><div className="p-8 text-white">Loading...</div></MainLayout>;
    if (!playlist) return <MainLayout><div className="p-8 text-white">Playlist not found</div></MainLayout>;

    const isOwner = currentUser && (currentUser.id === playlist.ownerId || currentUser.email === playlist.ownerEmail); // Handle both for safety

    return (
        <MainLayout>
            <div className="pb-24">
                {/* Playlist Header */}
                <div className="flex flex-col md:flex-row items-end gap-6 p-8 bg-gradient-to-b from-zinc-800 to-zinc-900/50">
                    <div className="w-52 h-52 bg-zinc-800 shadow-2xl flex items-center justify-center rounded-md">
                        <Music className="w-20 h-20 text-zinc-600" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <p className="text-sm font-bold uppercase tracking-wider text-white">Playlist</p>
                        <h1 className="text-5xl md:text-7xl font-black text-white">{playlist.name}</h1>
                        <p className="text-zinc-400">{playlist.description}</p>
                        <div className="flex items-center gap-2 text-sm text-white font-medium">
                            <span>{playlist.ownerName || 'User'}</span>
                            <span>•</span>
                            <span>{playlist.songsDetails?.length || 0} songs</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-zinc-900/50 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handlePlayPlaylist}
                            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-black"
                        >
                            <Play fill="currentColor" size={24} />
                        </Button>
                    </div>
                    {isOwner && (
                        <Button variant="destructive" size="icon" onClick={handleDeletePlaylist}>
                            <Trash2 size={20} />
                        </Button>
                    )}
                </div>

                {/* Songs List */}
                <div className="px-6">
                    <div className="border-b border-white/10 pb-2 mb-4 flex text-sm text-zinc-400 uppercase tracking-wider">
                        <div className="w-10 text-center">#</div>
                        <div className="flex-1">Title</div>
                        <div className="hidden md:block w-1/4">Album</div>
                        <div className="w-16 text-center"><Clock size={16} /></div>
                        {isOwner && <div className="w-10"></div>}
                    </div>

                    <div className="space-y-1">
                        {playlist.songsDetails?.map((song, index) => (
                            <div key={song.id} className="group flex items-center py-2 px-2 hover:bg-white/5 rounded-md transition-colors text-sm text-zinc-400 hover:text-white">
                                <div className="w-10 text-center flex items-center justify-center">
                                    <span className="group-hover:hidden">{index + 1}</span>
                                    <button onClick={() => playSong(song, playlist.songsDetails)} className="hidden group-hover:block text-white">
                                        <Play size={16} fill="currentColor" />
                                    </button>
                                </div>
                                <div className="flex-1 flex items-center gap-3 min-w-0">
                                    <img src={song.coverUrl || '/default-cover.png'} alt="" className="w-10 h-10 rounded object-cover" />
                                    <div className="min-w-0">
                                        <p className="text-white font-medium truncate">{song.title}</p>
                                        <p className="truncate text-xs">{song.artist?.name}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block w-1/4 truncate">
                                    {song.album?.title || '-'}
                                </div>
                                <div className="w-16 text-center">
                                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                                </div>
                                {isOwner && (
                                    <div className="w-10 flex justify-center opacity-0 group-hover:opacity-100">
                                        <button onClick={() => handleRemoveSong(song.id)} className="text-zinc-500 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {playlist.songsDetails?.length === 0 && (
                            <div className="text-center py-10 text-zinc-500">
                                This playlist is empty.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PlaylistDetails;
