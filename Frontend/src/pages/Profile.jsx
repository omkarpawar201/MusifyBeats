import React, { useEffect, useState } from 'react';
import { musicService } from '../services/musicService';
import { authService } from '../services/authService';
import { User, Mail, Music, Heart, Calendar } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ likedSongs: 0, playlists: 0 });

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        // Fetch user stats
        const fetchStats = async () => {
            try {
                const [songs, playlists] = await Promise.all([
                    musicService.getLikedSongs(),
                    musicService.getMyPlaylists()
                ]);
                setStats({
                    likedSongs: songs?.length || 0,
                    playlists: playlists?.length || 0
                });
            } catch (error) {
                console.error("Failed to load user stats", error);
            }
        };

        fetchStats();
    }, []);

    if (!user) {
        return <div className="p-8 text-white">Please log in to view your profile.</div>;
    }

    // Generate initials
    const initials = user.displayName
        ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : (user.email || 'U').substring(0, 2).toUpperCase();

    return (
        <MainLayout>
            <div className="pt-8 pb-20 space-y-8 px-6 md:px-8">
                {/* ... existing content ... */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 pb-6 border-b border-white/10">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <span className="text-5xl font-bold text-white tracking-widest">{initials}</span>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-white/70">Profile</h2>
                        <h1 className="text-4xl md:text-6xl font-black text-white">{user.displayName || 'User'}</h1>
                        <div className="text-zinc-400 mt-2 flex items-center justify-center md:justify-start gap-4 text-sm">
                            <span className="flex items-center gap-1">
                                <Mail size={14} /> {user.email}
                            </span>
                            <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                            <span className="flex items-center gap-1">
                                <User size={14} /> {user.role || 'Member'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 hover:bg-zinc-900/80 transition pr-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/20 text-red-500 rounded-lg">
                                <Heart size={24} />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm">Liked Songs</p>
                                <p className="text-2xl font-bold text-white">{stats.likedSongs}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 hover:bg-zinc-900/80 transition pr-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 text-green-500 rounded-lg">
                                <Music size={24} />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm">Public Playlists</p>
                                <p className="text-2xl font-bold text-white">{stats.playlists}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 hover:bg-zinc-900/80 transition pr-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm">Joined</p>
                                <p className="text-lg font-bold text-white">Recently</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Profile;
