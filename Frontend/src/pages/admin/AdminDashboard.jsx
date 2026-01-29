import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Music, Mic2, ListMusic, TrendingUp, LogOut } from "lucide-react";
import { useAdminStats } from "@/helpers/useAdminData";
import { authService } from "@/services/authService";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import styles from "./admin.module.css";

export default function AdminDashboard() {
    const { data: stats, isLoading } = useAdminStats();
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate("/auth");
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className={styles.title}>Admin Dashboard</h1>
                        <p className={styles.subtitle}>Overview of system statistics and quick actions.</p>
                    </div>
                    <Button variant="destructive" onClick={handleLogout} className="gap-2">
                        <LogOut size={16} /> Logout
                    </Button>
                </div>
            </header>

            <div className={styles.statsGrid}>
                <StatsCard
                    title="Total Users"
                    value={stats?.totalUsers}
                    icon={<Users size={24} />}
                    isLoading={isLoading}
                    color="#8b5cf6" // Primary color approximation
                />
                <StatsCard
                    title="Total Songs"
                    value={stats?.totalSongs}
                    icon={<Music size={24} />}
                    isLoading={isLoading}
                    color="#ec4899" // Secondary color approximation
                />
                <StatsCard
                    title="Total Artists"
                    value={stats?.totalArtists}
                    icon={<Mic2 size={24} />}
                    isLoading={isLoading}
                    color="#f59e0b" // Accent color approximation
                />
                <StatsCard
                    title="Total Playlists"
                    value={stats?.totalPlaylists}
                    icon={<ListMusic size={24} />}
                    isLoading={isLoading}
                    color="#3b82f6" // Info color approximation
                />
            </div>

            <div className={styles.actionsSection}>
                <h2 className={styles.sectionTitle}>Quick Actions</h2>
                <div className={styles.actionsGrid}>
                    <Button asChild variant="outline" className={styles.actionButton}>
                        <Link to="/admin/songs">
                            <Music size={18} /> Manage Songs
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className={styles.actionButton}>
                        <Link to="/admin/artists">
                            <Mic2 size={18} /> Manage Artists
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className={styles.actionButton}>
                        <Link to="/admin/users">
                            <Users size={18} /> Manage Users
                        </Link>
                    </Button>
                </div>
            </div>

            <div className={styles.recentSection}>
                <h2 className={styles.sectionTitle}>
                    <TrendingUp size={20} /> Recent Activity
                </h2>
                <div className={styles.recentCard}>
                    <h3 className={styles.recentTitle}>Newest Users</h3>
                    {isLoading ? (
                        <div className={styles.skeletonList}>
                            <Skeleton className={styles.rowSkeleton} />
                            <Skeleton className={styles.rowSkeleton} />
                            <Skeleton className={styles.rowSkeleton} />
                        </div>
                    ) : (
                        <ul className={styles.recentList}>
                            {stats?.recentUsers?.map((user) => (
                                <li key={user.id} className={styles.recentItem}>
                                    <div className={styles.userInfo}>
                                        <span className={styles.userName}>{user.displayName}</span>
                                        <span className={styles.userEmail}>{user.email}</span>
                                    </div>
                                    <span className={styles.date}>
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                                    </span>
                                </li>
                            ))}
                            {stats?.recentUsers?.length === 0 && (
                                <li className={styles.emptyState}>No recent users</li>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, isLoading, color }) {
    return (
        <div className={styles.statsCard} style={{ borderTopColor: color }}>
            <div className={styles.statsHeader}>
                <span className={styles.statsTitle}>{title}</span>
                <div className={styles.iconWrapper} style={{ color }}>
                    {icon}
                </div>
            </div>
            <div className={styles.statsValue}>
                {isLoading ? <Skeleton className={styles.valueSkeleton} /> : (value?.toLocaleString() ?? 0)}
            </div>
        </div>
    );
}
