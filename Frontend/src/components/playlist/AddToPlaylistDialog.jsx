import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { musicService } from '@/services/musicService';
import { Button } from '@/components/ui/button';
import { Plus, Check, Loader2, Music } from 'lucide-react';
import { toast } from 'sonner';

const AddToPlaylistDialog = ({ songId, onClose }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingTo, setAddingTo] = useState(null);

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const data = await musicService.getMyPlaylists();
            setPlaylists(data || []);
        } catch (error) {
            console.error('Failed to fetch playlists:', error);
            toast.error('Failed to load playlists');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToPlaylist = async (playlistId, playlistName) => {
        try {
            setAddingTo(playlistId);
            await musicService.addSongToPlaylist(playlistId, songId);
            toast.success(`Added to ${playlistName}`);
            onClose();
        } catch (error) {
            console.error('Failed to add song to playlist:', error);
            toast.error('Failed to add song');
        } finally {
            setAddingTo(null);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-zinc-900 border border-white/10 p-6 rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Add to Playlist</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-green-500" />
                    </div>
                ) : playlists.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">
                        <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No playlists found.</p>
                        <p className="text-sm mt-1">Create a playlist in your Library first.</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {playlists.map((playlist) => (
                            <button
                                key={playlist.id}
                                disabled={addingTo === playlist.id}
                                onClick={() => handleAddToPlaylist(playlist.id, playlist.name)}
                                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group text-left"
                            >
                                <div className="h-10 w-10 bg-zinc-800 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {playlist.coverUrl ? (
                                        <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Music className="w-5 h-5 text-zinc-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-white truncate">{playlist.name}</h3>
                                </div>
                                {addingTo === playlist.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                                ) : (
                                    <Plus className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default AddToPlaylistDialog;
