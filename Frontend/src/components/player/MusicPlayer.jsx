import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Repeat,
    Shuffle,
    Volume2,
    VolumeX,
    Heart,
    Maximize2,
    ListMusic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/context/PlayerContext";
import { musicService } from "@/services/musicService";
import { useState, useEffect } from "react";

const MusicPlayer = () => {
    const {
        currentSong,
        isPlaying,
        togglePlay,
        playNext,
        playPrevious,
        seek,
        progress,
        duration,
        volume,
        setVolume,
        isMuted,
        setIsMuted
    } = usePlayer();

    // Local UI state
    const [isLiked, setIsLiked] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [repeatMode, setRepeatMode] = useState("off");

    useEffect(() => {
        if (currentSong) {
            // Check if liked (feature to be implemented fully with backend)
            setIsLiked(false);
        }
    }, [currentSong]);

    const handleLike = async () => {
        if (!currentSong) return;
        try {
            if (isLiked) {
                await musicService.unlikeSong(currentSong.id);
            } else {
                await musicService.likeSong(currentSong.id);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Like action failed", error);
        }
    };

    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSeek = (value) => {
        seek(value[0]);
    };

    if (!currentSong) return null; // Don't show player if no song selected

    return (
        <div className="player-bar h-24 px-4 flex items-center justify-between gap-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed bottom-0 left-0 right-0 z-50">
            {/* Currently playing */}
            <div className="flex items-center gap-4 min-w-[200px] w-[30%]">
                <div
                    className="w-14 h-14 rounded-lg shrink-0 shadow-lg bg-secondary bg-cover bg-center"
                    style={{
                        backgroundImage: currentSong.coverUrl ? `url(${currentSong.coverUrl})` : undefined,
                        background: !currentSong.coverUrl ? "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" : undefined
                    }}
                />
                <div className="min-w-0">
                    <h4 className="font-semibold truncate">{currentSong.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{currentSong.artist?.name || currentSong.artist || 'Unknown Artist'}</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={handleLike}
                >
                    <Heart
                        className={cn("w-5 h-5 transition-colors", isLiked && "fill-primary text-primary")}
                    />
                </Button>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-2 max-w-[600px] w-[40%]">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("w-8 h-8", isShuffled && "text-primary")}
                        onClick={() => setIsShuffled(!isShuffled)}
                    >
                        <Shuffle className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={playPrevious}>
                        <SkipBack className="w-5 h-5" />
                    </Button>

                    <Button
                        size="icon"
                        className="w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform shadow-md"
                        onClick={togglePlay}
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5" fill="currentColor" />
                        ) : (
                            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                        )}
                    </Button>

                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={playNext}>
                        <SkipForward className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("w-8 h-8 relative", repeatMode !== "off" && "text-primary")}
                        onClick={() => setRepeatMode(prev => prev === "off" ? "all" : prev === "all" ? "one" : "off")}
                    >
                        <Repeat className="w-4 h-4" />
                        {repeatMode === "one" && (
                            <span className="absolute -top-1 -right-1 text-[10px] font-bold text-primary">1</span>
                        )}
                    </Button>
                </div>

                {/* Progress bar */}
                <div className="w-full flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-10 text-right">
                        {formatTime(progress)}
                    </span>
                    <Slider
                        value={[progress]}
                        onValueChange={handleSeek}
                        max={duration || 100}
                        step={1}
                        className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-10">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* Volume and extras */}
            <div className="flex items-center gap-3 justify-end min-w-[200px] w-[30%]">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                    <ListMusic className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-2 group">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => setIsMuted(!isMuted)}
                    >
                        {isMuted || volume === 0 ? (
                            <VolumeX className="w-4 h-4" />
                        ) : (
                            <Volume2 className="w-4 h-4" />
                        )}
                    </Button>
                    <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={(value) => {
                            setVolume(value[0]);
                            if (value[0] > 0) setIsMuted(false);
                        }}
                        max={100}
                        step={1}
                        className="w-24"
                    />
                </div>

                <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Maximize2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default MusicPlayer;
