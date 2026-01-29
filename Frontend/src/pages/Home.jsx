import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Play, ChevronRight, Loader2 } from "lucide-react";
import { authService } from "@/services/authService";
import { musicService } from "@/services/musicService";
import { usePlayer } from "@/context/PlayerContext";

const Home = () => {
    const [user, setUser] = useState(null);
    const [trending, setTrending] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const [loading, setLoading] = useState(true);
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
                console.log("Trending Data Fetched:", trendingData); // Debug log
                setTrending(trendingData || []);
                // Use trending as new releases for now
                setNewReleases((trendingData || []).slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch music data:", error);
                if (error.response) {
                    console.error("Error Response:", error.response.status, error.response.data);
                }
                setTrending([]);
                setNewReleases([]);
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

    const handlePlay = (song, event) => {
        event.stopPropagation(); // Prevent navigation if clicking card
        playSong(song);
    };

    const userName = user?.displayName || user?.email?.split("@")[0];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="p-6 md:p-8 pb-32">
                {/* Header greeting */}
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 animate-fade-in">
                    {getGreeting()}, <span className="gradient-text capitalize">{user?.displayName || user?.user?.displayName || user?.email?.split('@')[0] || 'Music Lover'}</span>
                </h1>

                {/* Trending Now */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-semibold">Trending Now</h2>
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            See all <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {trending.length > 0 ? trending.map((item, index) => (
                            <div
                                key={item.id || index}
                                className="group cursor-pointer animate-fade-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
                                onClick={() => playSong(item)}
                            >
                                <div className="relative mb-4 overflow-hidden rounded-xl shadow-lg">
                                    <div
                                        className="aspect-square bg-secondary transition-transform duration-500 group-hover:scale-110"
                                        style={{
                                            backgroundImage: item.coverUrl ? `url(${item.coverUrl})` : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div
                                        className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:scale-110"
                                        onClick={(e) => handlePlay(item, e)}
                                    >
                                        <Play className="w-5 h-5 text-white ml-1" fill="white" />
                                    </div>
                                </div>
                                <h3 className="font-semibold truncate text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-sm text-muted-foreground truncate">{item.artist?.name || 'Unknown Artist'}</p>
                            </div>
                        )) : <p>No trending music found.</p>}
                    </div>
                </section>

                {/* New Releases */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-semibold">New Releases</h2>
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            See all <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {newReleases.length > 0 ? newReleases.map((item, index) => (
                            <div
                                key={item.id || index}
                                className="group cursor-pointer animate-fade-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
                                onClick={() => playSong(item)}
                            >
                                <div className="relative mb-4">
                                    <div
                                        className="aspect-square rounded-lg shadow-lg bg-secondary"
                                        style={{
                                            backgroundImage: item.coverUrl ? `url(${item.coverUrl})` : 'linear-gradient(135deg, #a55eea 0%, #8854d0 100%)',
                                            backgroundSize: 'cover'
                                        }}
                                    />
                                    <div
                                        className="absolute bottom-2 right-2 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all hover:scale-110"
                                        onClick={(e) => handlePlay(item, e)}
                                    >
                                        <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                                    </div>
                                </div>
                                <h3 className="font-semibold truncate">{item.title}</h3>
                                <p className="text-sm text-muted-foreground truncate">{item.artist?.name || 'Unknown Artist'}</p>
                            </div>
                        )) : <p>No new releases found.</p>}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default Home;
