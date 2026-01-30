import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Play, Clock, X, Loader2, Plus } from "lucide-react";
import { authService } from "@/services/authService";
import { musicService } from "@/services/musicService";
import { mockSongs, mockArtists } from "@/lib/mockData";
import { usePlayer } from "@/context/PlayerContext";
import AddToPlaylistDialog from "@/components/playlist/AddToPlaylistDialog";
import { Button } from "@/components/ui/button";

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Derived state from URL
    const query = searchParams.get("q") || "";
    const genreId = searchParams.get("genreId");
    const moodId = searchParams.get("moodId");

    const [recentSearches, setRecentSearches] = useState([
        "The Weeknd", "Taylor Swift", "Chill vibes playlist", "90s hits"
    ]);
    const [results, setResults] = useState({ songs: [], artists: [] });
    const [loading, setLoading] = useState(false);
    const [addingToPlaylistSongId, setAddingToPlaylistSongId] = useState(null);

    const navigate = useNavigate();
    const { playSong } = usePlayer();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate("/auth");
        }
    }, [navigate]);

    // Unified fetch logic
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (genreId || moodId) {
                    // Filter mode
                    const songsResp = await musicService.getAllSongs({
                        genreId: genreId,
                        moodId: moodId
                    });

                    // Backend returns { songs: [], totalCount: ... } or just [] if older version
                    // Safe access to array
                    const songList = songsResp.songs || songsResp;

                    setResults({
                        songs: Array.isArray(songList) ? songList : [],
                        artists: []
                    });
                } else if (query.trim()) {
                    // Search mode
                    const data = await musicService.search(query);
                    setResults(data);
                } else {
                    // Reset
                    setResults({ songs: [], artists: [] });
                }
            } catch (error) {
                console.error("Search/Filter failed", error);

                // Only mock fallback for text search, not filters
                if (query.trim() && !genreId && !moodId) {
                    const lowerQuery = query.toLowerCase();
                    const filteredSongs = mockSongs.filter(s =>
                        s.title.toLowerCase().includes(lowerQuery) ||
                        s.artist.toLowerCase().includes(lowerQuery)
                    );
                    const filteredArtists = mockArtists.filter(a =>
                        a.name.toLowerCase().includes(lowerQuery)
                    );
                    setResults({ songs: filteredSongs, artists: filteredArtists });
                } else {
                    setResults({ songs: [], artists: [] });
                }
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, genreId, moodId]);

    const updateQuery = (newQuery) => {
        // When user types in search box, clear filters
        setSearchParams({ q: newQuery });
    };

    const removeRecentSearch = (searchTerm) => {
        setRecentSearches(prev => prev.filter(s => s !== searchTerm));
    };

    const handlePlay = (song, event) => {
        if (event) event.stopPropagation();
        playSong(song, results.songs);
    };

    const handleSongAction = (e, songId) => {
        e.stopPropagation();
        setAddingToPlaylistSongId(songId);
    };

    const hasQuery = query.trim().length > 0 || genreId || moodId;

    // Static categories for browsing when no search query
    const browseCategories = [
        { name: "Podcasts", gradient: "linear-gradient(135deg, #006450 0%, #008060 100%)" },
        { name: "Made For You", gradient: "linear-gradient(135deg, #8C67AC 0%, #E040FB 100%)" },
        { name: "Charts", gradient: "linear-gradient(135deg, #8D67AB 0%, #8D67AB 100%)" },
        { name: "New Releases", gradient: "linear-gradient(135deg, #E8115B 0%, #E8115B 100%)" },
        { name: "Discover", gradient: "linear-gradient(135deg, #8400E7 0%, #8400E7 100%)" },
        { name: "Live Events", gradient: "linear-gradient(135deg, #AF2896 0%, #AF2896 100%)" },
    ];

    const getFilterTitle = () => {
        if (genreId) return `Songs in Genre`;
        if (moodId) return `Songs for Mood`;
        return "Songs";
    };

    return (
        <MainLayout>
            <div className="p-6 md:p-8 pb-32">
                {/* Search input */}
                <div className="relative max-w-2xl mb-8">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="What do you want to listen to?"
                        value={query}
                        onChange={(e) => updateQuery(e.target.value)}
                        className="w-full h-14 pl-12 text-lg rounded-full bg-muted/50 border-none focus:ring-2 focus:ring-primary"
                        autoFocus={!genreId && !moodId}
                    />
                    {query && (
                        <button
                            onClick={() => updateQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {!hasQuery ? (
                    /* Recent searches */
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Recent searches</h2>
                        <div className="flex flex-wrap gap-3">
                            {recentSearches.map((search) => (
                                <div
                                    key={search}
                                    className="flex items-center gap-2 glass-hover px-4 py-2 rounded-full cursor-pointer group"
                                    onClick={() => updateQuery(search)}
                                >
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span>{search}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeRecentSearch(search);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Browse all section when no query */}
                        <div className="mt-12">
                            <h2 className="text-xl font-semibold mb-6">Browse all</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {browseCategories.map((category, index) => (
                                    <div
                                        key={category.name}
                                        className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer animate-fade-in shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                                        style={{ animationDelay: `${index * 0.03}s` }}
                                    >
                                        <div
                                            className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                                            style={{ background: category.gradient }}
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                        <span className="absolute bottom-4 left-4 text-xl font-bold text-white drop-shadow-md">
                                            {category.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ) : (
                    /* Search results */
                    <div className="space-y-8">
                        {loading && (
                            <div className="flex justify-center p-4">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        )}

                        {!loading && (
                            <>
                                {/* Songs */}
                                {results.songs && results.songs.length > 0 && (
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4">{getFilterTitle()}</h2>
                                        <div className="space-y-2">
                                            {results.songs.map((song, index) => (
                                                <div
                                                    key={song.id || index}
                                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer animate-fade-in"
                                                    style={{ animationDelay: `${index * 0.03}s` }}
                                                    onClick={() => handlePlay(song)}
                                                >
                                                    <div className="relative">
                                                        <div
                                                            className="w-12 h-12 rounded"
                                                            style={{
                                                                backgroundImage: song.coverUrl ? `url(${song.coverUrl})` : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                                                                backgroundSize: 'cover'
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded">
                                                            <Play className="w-5 h-5 text-white" fill="white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium truncate">{song.title}</h3>
                                                        <p className="text-sm text-muted-foreground truncate">{song.artist?.name || song.artist || 'Unknown Artist'}</p>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground mr-4">{song.duration}</span>

                                                    {/* Add to Playlist Button */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-white hover:bg-white/10"
                                                        onClick={(e) => handleSongAction(e, song.id)}
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Artists */}
                                {results.artists && results.artists.length > 0 && (
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4">Artists</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                            {results.artists.map((artist, index) => (
                                                <div
                                                    key={artist.id || index}
                                                    className="group text-center cursor-pointer animate-fade-in"
                                                    style={{ animationDelay: `${index * 0.05}s` }}
                                                >
                                                    <div className="relative mb-4">
                                                        <div
                                                            className="aspect-square rounded-full mx-auto shadow-lg"
                                                            style={{
                                                                backgroundImage: artist.imageUrl ? `url(${artist.imageUrl})` : 'linear-gradient(135deg, #a55eea 0%, #8854d0 100%)',
                                                                backgroundSize: 'cover'
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                                                <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h3 className="font-semibold">{artist.name}</h3>
                                                    <p className="text-sm text-muted-foreground">Artist</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {(!results.songs?.length && !results.artists?.length) && (
                                    <div className="text-center py-12">
                                        <p className="text-xl text-muted-foreground">
                                            No results found
                                        </p>
                                        <p className="text-muted-foreground mt-2">
                                            Try adjusting your search or filters
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Add to Playlist Dialog */}
                {addingToPlaylistSongId && (
                    <AddToPlaylistDialog
                        songId={addingToPlaylistSongId}
                        onClose={() => setAddingToPlaylistSongId(null)}
                    />
                )}
            </div>
        </MainLayout>
    );
};

export default Search;
