import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Users, Radio } from "lucide-react";
import { authService } from "@/services/authService";

const Landing = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (authService.isAuthenticated()) {
            navigate("/home");
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-background">

            {/* Navigation */}
            <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Logo Image */}
                    <img
                        src="/logo.png"
                        alt="MUSIFYBEATS Logo"
                        className="w-11 h-11 rounded-full object-cover shadow-md"
                    />
                    <span className="text-2xl font-display font-bold gradient-text">
                        MUSIFYBEATS
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        to="/auth"
                        className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                        Log in
                    </Link>
                    <Link to="/auth?mode=signup">
                        <Button className="rounded-full px-6 btn-gradient font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/30">
                            Sign up
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative container mx-auto px-6 pt-20 md:pt-32 pb-24 text-center">

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-[120px] rounded-full -z-10 opacity-60 pointer-events-none" />

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 tracking-tight animate-fade-in">
                    Feel the <span className="gradient-text">Rhythm</span>.<br />
                    Experience the <span className="gradient-text">Future</span>.
                </h1>

                <p
                    className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-fade-in leading-relaxed"
                    style={{ animationDelay: "0.1s" }}
                >
                    Stream unlimited music, build your own playlists, and explore trending tracks.
                    <br className="hidden md:block" /> Your music. Your vibe. Anytime, anywhere.
                </p>

                <div
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in"
                    style={{ animationDelay: "0.2s" }}
                >
                    <Link to="/auth?mode=signup">
                        <Button
                            size="lg"
                            className="rounded-full px-10 h-16 text-xl btn-gradient font-bold hover:scale-105 transition-transform shadow-xl shadow-primary/30"
                        >
                            Start Listening Free
                        </Button>
                    </Link>

                    <Link to="/auth">
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full px-10 h-16 text-xl border-2 border-primary/40 hover:bg-primary/10 font-bold backdrop-blur-sm"
                        >
                            Explore Plans
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Play,
                            title: "Unlimited Ad-Free Music",
                            description: "Enjoy seamless high-quality streaming without interruptions. Just pure music."
                        },
                        {
                            icon: Users,
                            title: "Connect with Friends",
                            description: "Share playlists, follow listeners, and see what your friends love."
                        },
                        {
                            icon: Radio,
                            title: "AI Smart Discovery",
                            description: "Get personalized song recommendations powered by intelligent music matching."
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="glass p-8 rounded-2xl hover:bg-primary/5 transition-colors animate-fade-in"
                            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                        >
                            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-6">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="container mx-auto px-6 py-10 text-center border-t border-border mt-10">
                <h3 className="text-2xl font-display font-bold mb-2 gradient-text">
                    MUSIFYBEATS
                </h3>

                <p className="text-muted-foreground mb-4">
                    The next-generation music streaming platform. Discover. Stream. Share.
                </p>

                <div className="flex justify-center gap-6 text-sm text-muted-foreground mb-4">
                    <Link to="#" className="hover:text-foreground">About</Link>
                    <Link to="#" className="hover:text-foreground">Privacy</Link>
                    <Link to="#" className="hover:text-foreground">Terms</Link>
                    <Link to="#" className="hover:text-foreground">Support</Link>
                </div>

                <p className="text-xs text-muted-foreground">
                    © 2026 MUSIFYBEATS. All rights reserved.
                </p>
            </footer>

        </div>
    );
};

export default Landing;
