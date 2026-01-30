import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Auth = () => {
    const [searchParams] = useSearchParams();
    const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Check if user is already logged in
        if (authService.isAuthenticated()) {
            const user = authService.getCurrentUser();
            if (user?.role?.toLowerCase() === "admin") {
                navigate("/admin");
            } else {
                navigate("/home");
            }
        }
    }, [navigate]);

    const validateForm = () => {
        const newErrors = {};
        if (!email) newErrors.email = "Email is required";
        if (isSignUp) {
            if (!password || password.length < 8) {
                newErrors.password = "Password must be at least 8 characters";
            } else if (!/[A-Z]/.test(password)) {
                newErrors.password = "Password must contain at least one uppercase letter";
            } else if (!/[a-z]/.test(password)) {
                newErrors.password = "Password must contain at least one lowercase letter";
            } else if (!/[0-9]/.test(password)) {
                newErrors.password = "Password must contain at least one number";
            } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                newErrors.password = "Password must contain at least one special character";
            }
        } else {
            if (!password) newErrors.password = "Password is required";
        }
        if (isSignUp && !displayName) newErrors.displayName = "Display Name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAuth = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            if (isSignUp) {
                await authService.register(email, password, displayName);
                toast({
                    title: "Registration Successful",
                    description: "Your account has been created. Please log in.",
                });
                setIsSignUp(false);
            } else {
                const response = await authService.login(email, password);
                toast({
                    title: "Welcome back!",
                    description: "Logged in successfully.",
                });

                if (response.user?.role?.toLowerCase() === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/home");
                }
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Authentication Failed",
                description: error.response?.data?.message || "Invalid credentials or server error.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen animated-gradient flex items-center justify-center px-4 py-8 md:px-0 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />

            <div className="w-full max-w-md relative z-10 my-10">
                <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary/20 border-white/10 animate-fade-in relative overflow-hidden">
                    {/* Top gradient line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange via-brand-pink to-brand-cyan" />

                    {/* Logo */}
                    <Link to="/" className="flex items-center justify-center gap-3 mb-8">
                        <img src="/logo.png" alt="Musify Beats" className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />
                        <span className="text-2xl font-display font-bold text-brand-gradient tracking-wide">MUSIFYBEATS</span>
                    </Link>

                    <h1 className="text-2xl font-display font-bold text-center mb-2">
                        {isSignUp ? "Create your account" : "Welcome back"}
                    </h1>
                    <p className="text-muted-foreground text-center mb-8">
                        {isSignUp
                            ? "Start your musical journey today"
                            : "Log in to continue listening"}
                    </p>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {isSignUp && (
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input
                                    id="displayName"
                                    type="text"
                                    placeholder="Your Name"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="h-12 bg-muted/30 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl"
                                    disabled={loading}
                                />
                                {errors.displayName && (
                                    <p className="text-sm text-destructive">{errors.displayName}</p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-muted/30 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl"
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-muted/30 border-white/10 focus:border-primary/50 focus:ring-primary/20 pr-12 transition-all rounded-xl"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 btn-neon text-lg mt-4 shadow-lg shadow-primary/25"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isSignUp ? (
                                "Create account"
                            ) : (
                                "Log in"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-muted-foreground">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="ml-2 text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                {isSignUp ? "Log in" : "Sign up"}
                            </button>
                        </p>
                    </div>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default Auth;
