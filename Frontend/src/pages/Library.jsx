import React, { useState, useEffect } from 'react';
import { musicService } from '../services/musicService';
import { usePlayer } from '../context/PlayerContext';
import { Play, Heart, Music, ListMusic, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';

const Library = () => {
    const [activeTab, setActiveTab] = useState('playlists');
    const [likedSongs, setLikedSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playSong } = usePlayer();
    const navigate = useNavigate();

    useEffect(() => {
        fetchLibraryData();
    }, []);

    const fetchLibraryData = async () => {
        try {
            setLoading(true);
            const [songsData, playlistsData] = await Promise.all([
                musicService.getLikedSongs(),
                musicService.getMyPlaylists()
            ]);
            setLikedSongs(songsData || []);
            setPlaylists(playlistsData || []);
        } catch (error) {
            console.error('Error fetching library:', error);
            toast.error('Failed to load library content');
        } finally {
            setLoading(false);
        }
    };

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '', isPublic: false });
    const [isCreating, setIsCreating] = useState(false);

    const handleCreatePlaylist = async (e) => {
        if (e) e.preventDefault();

        if (!newPlaylist.name.trim()) {
            toast.error('Playlist name is required');
            return;
        }

        try {
            setIsCreating(true);
            const created = await musicService.createPlaylist(
                newPlaylist.name,
                newPlaylist.description,
                newPlaylist.isPublic
            );
            toast.success('Playlist created successfully!');
            setShowCreateModal(false);
            setNewPlaylist({ name: '', description: '', isPublic: false });
            fetchLibraryData(); // Refresh list
        } catch (error) {
            console.error('Failed to create playlist:', error);
            toast.error('Failed to create playlist');
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex bg-black items-center justify-center p-8">
                <div className="text-white">Loading your library...</div>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="p-6 md:p-8 space-y-6 pb-24">
                {/* ... (Header and Tabs content preserved but wrapped) ... */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Your Library</h1>
                    {activeTab === 'playlists' && (
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full px-6"
                        >
                            <Plus size={20} />
                            Create Playlist
                        </Button>
                    )}
                </div>

                {/* Create Playlist Modal (Overlay) */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                            <h2 className="text-2xl font-bold text-white mb-6">Create New Playlist</h2>
                            <form onSubmit={handleCreatePlaylist} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newPlaylist.name}
                                        onChange={e => setNewPlaylist(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-zinc-800 border-none rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-green-500"
                                        placeholder="My Awesome Playlist"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Description (Optional)</label>
                                    <textarea
                                        value={newPlaylist.description}
                                        onChange={e => setNewPlaylist(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full bg-zinc-800 border-none rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-green-500 h-24 resize-none"
                                        placeholder="Give your playlist a description"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isPublic"
                                        checked={newPlaylist.isPublic}
                                        onChange={e => setNewPlaylist(prev => ({ ...prev, isPublic: e.target.checked }))}
                                        className="w-4 h-4 accent-green-500"
                                    />
                                    <label htmlFor="isPublic" className="text-sm text-zinc-300">Make this playlist public</label>
                                </div>
                                <div className="flex items-center gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isCreating}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-black font-bold"
                                    >
                                        {isCreating ? 'Creating...' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex space-x-4 border-b border-white/10 pb-1">
                    <button
                        onClick={() => setActiveTab('playlists')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'playlists' ? 'text-green-500' : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        Playlists
                        {activeTab === 'playlists' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('liked')}
                        className={`pb-3 px-2 text-sm font-medium transition-colors relative ${activeTab === 'liked' ? 'text-green-500' : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        Liked Songs
                        {activeTab === 'liked' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="min-h-[300px]">
                    {activeTab === 'playlists' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {playlists.length > 0 ? (
                                playlists.map((playlist) => (
                                    <div
                                        key={playlist.id}
                                        onClick={() => navigate(`/playlist/${playlist.id}`)}
                                        className="bg-zinc-900/40 group p-4 rounded-md hover:bg-zinc-800/40 transition-all cursor-pointer"
                                    >
                                        <div className="aspect-square bg-zinc-800 rounded-md mb-4 flex items-center justify-center relative shadow-lg">
                                            {playlist.coverUrl ? (
                                                <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover rounded-md" />
                                            ) : (
                                                <Music className="text-zinc-600 w-12 h-12" />
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-white truncate w-full">{playlist.name}</h3>
                                        <p className="text-sm text-zinc-400 mt-1 truncate">
                                            By {playlist.ownerName || 'You'}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-12 text-zinc-500 space-y-4">
                                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
                                        <ListMusic className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p>No playlists yet.</p>
                                    <Button variant="outline" onClick={() => setShowCreateModal(true)}>Create your first playlist</Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-zinc-900/20 rounded-lg overflow-hidden">
                            {likedSongs.length > 0 ? (
                                <div className="divide-y divide-white/5">
                                    {likedSongs.map((song, index) => (
                                        <div
                                            key={song.id}
                                            className="group flex items-center gap-4 p-3 hover:bg-white/5 transition-colors"
                                        >
                                            <div className="w-8 text-center text-zinc-500 text-sm group-hover:hidden">
                                                {index + 1}
                                            </div>
                                            <button
                                                onClick={() => playSong(song)}
                                                className="w-8 h-8 hidden group-hover:flex items-center justify-center text-white"
                                            >
                                                <Play fill="currentColor" size={16} />
                                            </button>

                                            <div className="h-10 w-10 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                                                {song.coverUrl && <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-medium truncate">{song.title}</h4>
                                                <p className="text-sm text-zinc-400 truncate">{song.artist?.name}</p>
                                            </div>

                                            <div className="hidden md:block text-sm text-zinc-400 w-1/4 truncate">
                                                {song.album?.title || 'Single'}
                                            </div>

                                            <div className="text-sm text-zinc-400 w-12 text-right">
                                                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                                            </div>

                                            <div className="w-8 flex justify-center">
                                                <Heart className="w-4 h-4 text-green-500 fill-green-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-col items-center justify-center py-20 text-zinc-500 space-y-4 flex">
                                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
                                        <Heart className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p>Songs you like will appear here</p>
                                    <Button variant="outline" onClick={() => navigate('/search')}>Find songs to like</Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Library;
