import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Play, ChevronRight, Loader2, MoreHorizontal, PlusCircle, ListMusic, Sparkles } from "lucide-react";
import { authService } from "@/services/authService";
import { musicService } from "@/services/musicService";
import { usePlayer } from "@/context/PlayerContext";
import AddToPlaylistDialog from "@/components/playlist/AddToPlaylistDialog";
import { AiPlaylistDialog } from "@/components/AiPlaylistDialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Home = () => {
    const [user, setUser] = useState(null);
    const [trending, setTrending] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToPlaylistSongId, setAddingToPlaylistSongId] = useState(null);
    const [showAiDialog, setShowAiDialog] = useState(false);

    const navigate = useNavigate();
    const { playSong } = usePlayer();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate("/auth");
            return;
        }
        setUser(authService.getCurrentUser());

        const fetchData = async () => {
            try {
                // Fetch trending songs from real API
                const trendingData = await musicService.getTrending();
                setTrending(trendingData || []);
                // Use trending as new releases for now
                setNewReleases((trendingData || []).slice(0, 6));

                // Fetch public playlists
                const playlistsData = await musicService.getPublicPlaylists(1, 5);
                setPlaylists(playlistsData.playlists || []);
            } catch (error) {
                console.error("Failed to fetch music data:", error);
                setTrending([]);
                setNewReleases([]);
                setPlaylists([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const handlePlay = (song, playlist, event) => {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        playSong(song, playlist);
    };

    const handleSongAction = (e, songId) => {
        e.stopPropagation();
        setAddingToPlaylistSongId(songId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <Loader2 className="w-10 h-10 animate-spin text-green-500" />
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="p-6 md:p-8 pb-32">
                {/* Header greeting */}
                <div className="flex items-center justify-between mb-8 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                        {getGreeting()}, <span className="gradient-text capitalize">{user?.displayName || user?.user?.displayName || user?.email?.split('@')[0] || 'Music Lover'}</span>
                    </h1>
                    <Button
                        onClick={() => setShowAiDialog(true)}
                        className="btn-neon bg-gradient-to-r from-brand-pink to-brand-orange text-white border-0 hover:opacity-90 transition-all shadow-lg shadow-brand-pink/20"
                    >
                        <Sparkles className="w-5 h-5 mr-2" />
                        AI Playlist
                    </Button>
                </div>

                {/* Featured Playlists */}
                {playlists.length > 0 && (
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl md:text-2xl font-semibold text-white">Featured Playlists</h2>
                            <button className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors">
                                See all <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {playlists.map((playlist, index) => (
                                <div
                                    key={playlist.id}
                                    className="group cursor-pointer animate-fade-in relative"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                                >
                                    <div className="relative mb-4 overflow-hidden rounded-xl shadow-lg bg-zinc-800 aspect-square flex items-center justify-center">
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                            <ListMusic className="w-12 h-12 text-white opacity-50" />
                                        </div>
                                    </div>
                                    <h3 className="font-semibold truncate text-white group-hover:text-purple-400 transition-colors">{playlist.name}</h3>
                                    <p className="text-sm text-zinc-400 truncate">By {playlist.ownerName || 'Admin'}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Trending Now */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-semibold text-white">Trending Now</h2>
                        <button className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors">
                            See all <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {trending.length > 0 ? trending.map((item, index) => (
                            <div
                                key={item.id || index}
                                className="group cursor-pointer animate-fade-in relative"
                                style={{ animationDelay: `${index * 0.05}s` }}
                                onClick={() => playSong(item, trending)}
                            >
                                <div className="relative mb-4 overflow-hidden rounded-xl shadow-lg bg-zinc-800">
                                    <div
                                        className="aspect-square transition-transform duration-500 group-hover:scale-110"
                                        style={{
                                            backgroundImage: item.coverUrl ? `url(${item.coverUrl})` : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Play Button */}
                                    <button
                                        className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:scale-110 hover:bg-green-400"
                                        onClick={(e) => handlePlay(item, trending, e)}
                                    >
                                        <Play className="w-5 h-5 text-black ml-1" fill="currentColor" />
                                    </button>

                                    {/* Add to Playlist Button (Quick Action) */}
                                    <button
                                        className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => handleSongAction(e, item.id)}
                                        title="Add to Playlist"
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                    </button>
                                </div>
                                <h3 className="font-semibold truncate text-white group-hover:text-green-400 transition-colors">{item.title}</h3>
                                <p className="text-sm text-zinc-400 truncate">{item.artist?.name || 'Unknown Artist'}</p>
                            </div>
                        )) : <p className="text-zinc-500">No trending music found.</p>}
                    </div>
                </section>

                {/* New Releases */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-semibold text-white">New Releases</h2>
                        <button className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors">
                            See all <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {newReleases.length > 0 ? newReleases.map((item, index) => (
                            <div
                                key={item.id || index}
                                className="group cursor-pointer animate-fade-in relative"
                                style={{ animationDelay: `${index * 0.05}s` }}
                                onClick={() => playSong(item, newReleases)}
                            >
                                <div className="relative mb-4 bg-zinc-800 rounded-xl overflow-hidden">
                                    <div
                                        className="aspect-square transition-transform duration-500 group-hover:scale-110"
                                        style={{
                                            backgroundImage: item.coverUrl ? `url(${item.coverUrl})` : 'linear-gradient(135deg, #a55eea 0%, #8854d0 100%)',
                                            backgroundSize: 'cover'
                                        }}
                                    />
                                    {/* Play Button */}
                                    <button
                                        className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all hover:scale-110 hover:bg-green-400"
                                        onClick={(e) => handlePlay(item, newReleases, e)}
                                    >
                                        <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                                    </button>

                                    {/* Add to Playlist Button */}
                                    <button
                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => handleSongAction(e, item.id)}
                                        title="Add to Playlist"
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                    </button>
                                </div>
                                <h3 className="font-semibold truncate text-white">{item.title}</h3>
                                <p className="text-sm text-zinc-400 truncate">{item.artist?.name || 'Unknown Artist'}</p>
                            </div>
                        )) : <p className="text-zinc-500">No new releases found.</p>}
                    </div>
                </section>
            </div>

            {/* Add to Playlist Dialog */}
            {addingToPlaylistSongId && (
                <AddToPlaylistDialog
                    songId={addingToPlaylistSongId}
                    onClose={() => setAddingToPlaylistSongId(null)}
                />
            )}

            <AiPlaylistDialog
                open={showAiDialog}
                onOpenChange={setShowAiDialog}
            />
        </MainLayout>
    );
};

export default Home;
