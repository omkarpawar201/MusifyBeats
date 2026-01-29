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
} from "lucide-react";

import { useState, useEffect } from "react";
import { musicService } from "@/services/musicService";
import { authService } from "@/services/authService";

const Sidebar = ({ collapsed, onToggle, className, isMobile }) => {
    const location = useLocation();
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        if (authService.isAuthenticated()) {
            fetchPlaylists();
        }
    }, [location.pathname]); // Re-fetch on navigate roughly

    const fetchPlaylists = async () => {
        try {
            const data = await musicService.getMyPlaylists();
            setPlaylists(data || []);
        } catch (error) {
            console.error("Sidebar playlist fetch failed", error);
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
                            {playlists.map((playlist) => (
                                <li key={playlist.id}>
                                    <Link
                                        to={`/playlist/${playlist.id}`}
                                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
                                    >
                                        {playlist.name}
                                    </Link>
                                </li>
                            ))}
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
        </aside>
    );
};

export default Sidebar;
