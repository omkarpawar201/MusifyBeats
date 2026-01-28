import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { authService } from "@/services/authService";

const Browse = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate("/auth");
        }
    }, [navigate]);

    const genres = [
        { title: "Pop", color: "bg-pink-500" },
        { title: "Hip-Hop", color: "bg-orange-500" },
        { title: "Rock", color: "bg-red-500" },
        { title: "Indie", color: "bg-emerald-500" },
        { title: "R&B", color: "bg-blue-600" },
        { title: "Latin", color: "bg-yellow-500" },
        { title: "Electronic", color: "bg-purple-500" },
        { title: "Country", color: "bg-amber-700" },
        { title: "Classical", color: "bg-sky-600" },
        { title: "Jazz", color: "bg-indigo-500" },
        { title: "Soul", color: "bg-rose-500" },
        { title: "Metal", color: "bg-slate-700" },
    ];

    return (
        <MainLayout>
            <div className="p-6 md:p-8 pb-32">
                <h1 className="text-3xl font-display font-bold mb-8">Browse All</h1>

                <section>
                    <h2 className="text-xl font-semibold mb-6">Genres & Moods</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {genres.map((genre) => (
                            <div
                                key={genre.title}
                                className={`aspect-square rounded-2xl p-5 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ${genre.color}`}
                            >
                                <span className="text-2xl font-bold text-white absolute top-4 left-4 drop-shadow-md">
                                    {genre.title}
                                </span>
                                {/* Decorative elements */}
                                <div className="absolute -bottom-2 -right-2 w-24 h-24 rounded-full bg-white/20 rotate-12 blur-sm" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-transparent to-black/10" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default Browse;
