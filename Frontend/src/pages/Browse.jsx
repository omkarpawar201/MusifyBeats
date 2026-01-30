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
        { id: 1, title: "Pop", color: "bg-pink-500" },
        { id: 2, title: "Rock", color: "bg-red-500" },
        { id: 3, title: "Hip-Hop", color: "bg-orange-500" },
        { id: 4, title: "Electronic", color: "bg-purple-500" },
        { id: 5, title: "Jazz", color: "bg-indigo-500" },
        { id: 6, title: "Classical", color: "bg-sky-600" },
        { id: 7, title: "R&B", color: "bg-blue-600" },
        { id: 8, title: "Country", color: "bg-amber-700" },
        { id: 9, title: "Indie", color: "bg-emerald-500" },
        { id: 10, title: "Bollywood", color: "bg-rose-600" },
    ];

    const moods = [
        { id: 1, title: "Happy", color: "bg-yellow-400" },
        { id: 2, title: "Sad", color: "bg-slate-500" },
        { id: 3, title: "Energetic", color: "bg-orange-600" },
        { id: 4, title: "Relaxing", color: "bg-teal-500" },
        { id: 5, title: "Romantic", color: "bg-rose-400" },
        { id: 6, title: "Motivational", color: "bg-cyan-600" },
        { id: 7, title: "Chill", color: "bg-violet-400" },
        { id: 8, title: "Party", color: "bg-fuchsia-600" },
    ];

    return (
        <MainLayout>
            <div className="p-6 md:p-8 pb-32">
                <h1 className="text-3xl font-display font-bold mb-8">Browse All</h1>

                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-6">Genres</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {genres.map((genre) => (
                            <div
                                key={genre.title}
                                onClick={() => navigate(`/search?genreId=${genre.id}`)}
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

                <section>
                    <h2 className="text-xl font-semibold mb-6">Moods</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {moods.map((mood) => (
                            <div
                                key={mood.title}
                                onClick={() => navigate(`/search?moodId=${mood.id}`)}
                                className={`aspect-video rounded-2xl p-5 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ${mood.color}`}
                            >
                                <span className="text-2xl font-bold text-white absolute top-4 left-4 drop-shadow-md">
                                    {mood.title}
                                </span>
                                {/* Decorative elements */}
                                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/20 rotate-45 blur-md" />
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default Browse;
