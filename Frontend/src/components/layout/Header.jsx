import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { Search, Bell, ChevronLeft, ChevronRight, User, Settings, LogOut, Menu } from "lucide-react";

const Header = ({ onMenuToggle }) => {
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setUser(authService.getCurrentUser());
    }, []);

    const handleSignOut = () => {
        authService.logout();
        navigate("/");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const userName = user?.displayName || user?.email?.split("@")[0] || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-30 glass border-b border-border px-4 py-3 md:px-6 md:py-4 transition-all duration-300">
            <div className="flex items-center justify-between gap-4">
                {/* Navigation buttons */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden rounded-full bg-muted/50 hover:bg-muted"
                        onClick={onMenuToggle}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-muted/50 hover:bg-muted"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-muted/50 hover:bg-muted"
                        onClick={() => navigate(1)}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>

                {/* Search bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="What do you want to listen to?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-12 rounded-full bg-muted/50 border-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </form>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <ModeToggle />
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="w-5 h-5" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="rounded-full p-1">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <span className="text-sm font-semibold text-white uppercase">
                                        {userInitial}
                                    </span>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 glass border-border">
                            <div className="px-3 py-2">
                                <p className="font-medium capitalize">{userName}</p>
                                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate("/profile")}>
                                <User className="w-4 h-4 mr-2" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                                <LogOut className="w-4 h-4 mr-2" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Header;
