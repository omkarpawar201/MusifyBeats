import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MusicPlayer from "../player/MusicPlayer";

const MainLayout = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

            {/* Main content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-64"}`}>
                <Header />
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    {children}
                </main>
            </div>

            {/* Music Player */}
            <MusicPlayer />
        </div>
    );
};

export default MainLayout;
