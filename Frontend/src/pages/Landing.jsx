import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Headphones, Music2, Sparkles, ChevronRight } from "lucide-react";
import { authService } from "@/services/authService";

const Landing = () => {
    const navigate = useNavigate();

    // ✅ Auth Redirect Logic Added
    useEffect(() => {
        if (authService.isAuthenticated()) {
            navigate("/home");
        }
    }, [navigate]);

    return (
        <div className="min-h-screen animated-gradient overflow-hidden">

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">

                    {/* ✅ Logo.png Added */}
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="MUSIFYBEATS Logo"
                            className="w-10 h-10 rounded-full object-cover shadow-md"
                        />
                        <span className="text-xl font-display font-bold gradient-text">
                            MUSIFYBEATS
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link to="/auth">
                            <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                                Log in
                            </Button>
                        </Link>
                        <Link to="/auth?mode=signup">
                            <Button className="btn-gradient">
                                Sign up free
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="container mx-auto text-center">

                    {/* Floating glow elements */}
                    <div className="absolute top-40 left-20 w-20 h-20 rounded-full bg-primary/20 blur-3xl animate-float" />
                    <div className="absolute top-60 right-20 w-32 h-32 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
                    <div className="absolute bottom-20 left-1/3 w-24 h-24 rounded-full bg-primary/30 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-fade-in">
                            <Sparkles className="w-4 h-4 text-accent" />
                            <span className="text-sm text-muted-foreground">
                                AI-Powered Music Discovery
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 animate-fade-in">
                            <span className="gradient-text">Feel the Beat,</span>
                            <br />
                            <span className="text-foreground">Live the Music</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                            Millions of songs. Personalized playlists. Discover your perfect soundtrack with AI-powered recommendations.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                            <Link to="/auth?mode=signup">
                                <Button size="lg" className="btn-gradient text-lg px-8 py-6 gap-2">
                                    <Play className="w-5 h-5" />
                                    Start Listening Free
                                </Button>
                            </Link>
                            <Link to="/browse">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6 gap-2 glass border-border hover:bg-muted/50">
                                    <Headphones className="w-5 h-5" />
                                    Explore Music
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 animate-fade-in">
                        Why Choose <span className="gradient-text">MUSIFYBEATS</span>?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="glass-hover p-8 rounded-2xl animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
                                    <feature.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Playlists Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl md:text-3xl font-display font-bold">Trending Playlists</h2>
                        <Link to="/browse" className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                            See all <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {playlists.map((playlist, index) => (
                            <div
                                key={playlist.name}
                                className="group cursor-pointer animate-fade-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="relative mb-4 img-hover-zoom rounded-lg">
                                    <div className="aspect-square rounded-lg" style={{ background: playlist.gradient }}>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                <Play className="w-6 h-6 text-white ml-1" fill="white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="font-semibold truncate">{playlist.name}</h3>
                                <p className="text-sm text-muted-foreground truncate">{playlist.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="container mx-auto">
                    <div className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                                Ready to start your
                                <br />
                                <span className="gradient-text">musical journey?</span>
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                                Join millions of music lovers. Create playlists, discover new artists, and let AI curate your perfect mix.
                            </p>
                            <Link to="/auth?mode=signup">
                                <Button size="lg" className="btn-gradient text-lg px-10 py-6">
                                    Get Started — It's Free
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-12 px-6">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" className="w-8 h-8 rounded-full" />
                        <span className="font-display font-bold">MUSIFYBEATS</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © 2026 MUSIFYBEATS. Made with ♥ for music lovers.
                    </p>
                </div>
            </footer>

        </div>
    );
};

/* Data Arrays */
const features = [
    {
        icon: Sparkles,
        title: "AI-Powered Discovery",
        description: "Our smart algorithms learn your taste and create personalized playlists just for you."
    },
    {
        icon: Music2,
        title: "Millions of Songs",
        description: "Access an extensive library of tracks across all genres."
    },
    {
        icon: Headphones,
        title: "High Quality Audio",
        description: "Experience crystal-clear sound with premium streaming quality."
    }
];

const playlists = [
    { name: "Today's Top Hits", description: "The hottest tracks right now", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { name: "Chill Vibes", description: "Relax and unwind", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { name: "Workout Mix", description: "Energy for your session", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { name: "Focus Flow", description: "Concentration music", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
    { name: "Party Mode", description: "Turn up the energy", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" }
];

export default Landing;
