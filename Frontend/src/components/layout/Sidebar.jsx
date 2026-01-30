import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    Home,
    Search,
    Library,
    PlusSquare,
    Heart,
    ChevronLeft,
    ChevronRight,
    Compass,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { musicService } from "@/services/musicService";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const Sidebar = ({ collapsed, onToggle, className, isMobile }) => {
    const location = useLocation();
    const [playlists, setPlaylists] = useState([]);

    // State for delete confirmation dialog
    const [deletePlaylistId, setDeletePlaylistId] = useState(null);
    const [deletePlaylistName, setDeletePlaylistName] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        // Initial fetch logic with retry
        const loadPlaylists = async () => {
            if (authService.isAuthenticated()) {
                await fetchPlaylists();
            } else {
                // Retry once after a short delay if auth is not ready
                setTimeout(async () => {
                    if (authService.isAuthenticated()) {
                        await fetchPlaylists();
                    }
                }, 500);
            }
        };

        loadPlaylists();

        // Listen for playlist updates (custom event)
        const handlePlaylistUpdate = () => fetchPlaylists();
        window.addEventListener('playlist-updated', handlePlaylistUpdate);

        return () => {
            window.removeEventListener('playlist-updated', handlePlaylistUpdate);
        };
    }, [location.pathname]);

    const fetchPlaylists = async () => {
        try {
            const data = await musicService.getMyPlaylists();
            // Update state with data or empty array
            setPlaylists(data || []);
        } catch (error) {
            console.error("Sidebar playlist fetch failed", error);
            // Don't clear playlists on error to avoid flashing if previously loaded
        }
    };

    // Open the confirmation dialog
    const handleDeleteClick = (id, name) => {
        setDeletePlaylistId(id);
        setDeletePlaylistName(name);
        setIsDeleteDialogOpen(true);
    };

    // Actual deletion logic
    const confirmDelete = async () => {
        if (!deletePlaylistId) return;

        try {
            await musicService.deletePlaylist(deletePlaylistId);
            toast.success(`Playlist "${deletePlaylistName}" deleted`);
            fetchPlaylists(); // Refresh list
            window.dispatchEvent(new Event('playlist-updated'));
        } catch (error) {
            console.error("Failed to delete playlist:", error);
            toast.error("Failed to delete playlist");
        } finally {
            setIsDeleteDialogOpen(false);
            setDeletePlaylistId(null);
            setDeletePlaylistName("");
        }
    };

    const navItems = [
        { icon: Home, label: "Home", href: "/home" },
        { icon: Search, label: "Search", href: "/search" },
        { icon: Compass, label: "Browse", href: "/browse" },
        { icon: Library, label: "Your Library", href: "/library" },
    ];

    const playlistItems = [
        { icon: PlusSquare, label: "Create Playlist", href: "/library", id: "create-playlist" },
        { icon: Heart, label: "Liked Songs", href: "/library", id: "liked-songs" },
    ];

    return (
        <aside
            className={cn(
                "h-full glass border-r border-border transition-all duration-300 flex flex-col bg-sidebar-background",
                isMobile ? "w-64" : "fixed left-0 top-0",
                !isMobile && (collapsed ? "w-20" : "w-64"),
                className
            )}
        >
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <Link to="/home" className="flex items-center gap-3">
                    <img src="/logo.png" alt="Musify Beats" className="w-10 h-10 rounded-full object-cover shrink-0" />
                    {!collapsed && (
                        <span className="text-lg font-display font-bold gradient-text">
                            MUSIFYBEATS
                        </span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="px-3 flex-1">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200",
                                        isActive
                                            ? "bg-muted text-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <item.icon className={cn("w-6 h-6 shrink-0", isActive && "text-primary")} />
                                    {!collapsed && <span className="font-medium">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="my-6 border-t border-border" />

                <ul className="space-y-1">
                    {playlistItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <li key={item.id || item.href}>
                                <Link
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200",
                                        isActive
                                            ? "bg-muted text-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <item.icon className={cn("w-6 h-6 shrink-0", isActive && "text-primary")} />
                                    {!collapsed && <span className="font-medium">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Playlists section */}
                {!collapsed && (
                    <div className="mt-6">
                        <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Your Playlists
                        </h3>
                        <ul className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                            {playlists.length > 0 ? (
                                playlists.map((playlist) => (
                                    <li key={playlist.id} className="group flex items-center justify-between hover:bg-muted/50 rounded-lg pr-2 transition-colors">
                                        <Link
                                            to={`/playlist/${playlist.id}`}
                                            className="block px-4 py-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate flex-1"
                                        >
                                            {playlist.name}
                                        </Link>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDeleteClick(playlist.id, playlist.name);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all p-1"
                                            title="Delete Playlist"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-sm text-muted-foreground italic">
                                    No playlists found
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </nav>

            {/* Collapse button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-accent transition-colors"
            >
                {collapsed ? (
                    <ChevronRight className="w-4 h-4" />
                ) : (
                    <ChevronLeft className="w-4 h-4" />
                )}
            </button>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Playlist</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the playlist <span className="font-semibold text-white">"{deletePlaylistName}"</span>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </aside>
    );
};

export default Sidebar;
