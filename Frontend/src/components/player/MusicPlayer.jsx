import { useState } from "react";
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

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(30);
    const [volume, setVolume] = useState(75);
    const [isMuted, setIsMuted] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [repeatMode, setRepeatMode] = useState("off");

    const currentSong = {
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        duration: "3:20",
        currentTime: "1:00",
        gradient: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
    };

    const handleRepeatClick = () => {
        if (repeatMode === "off") setRepeatMode("all");
        else if (repeatMode === "all") setRepeatMode("one");
        else setRepeatMode("off");
    };

    return (
        <div className="player-bar h-24 px-4 flex items-center justify-between gap-4">
            {/* Currently playing */}
            <div className="flex items-center gap-4 min-w-[200px] w-[30%]">
                <div
                    className="w-14 h-14 rounded-lg shrink-0 shadow-lg"
                    style={{ background: currentSong.gradient }}
                />
                <div className="min-w-0">
                    <h4 className="font-semibold truncate">{currentSong.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setIsLiked(!isLiked)}
                >
                    <Heart
                        className={cn("w-5 h-5 transition-colors", isLiked && "fill-accent text-accent")}
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

                    <Button variant="ghost" size="icon" className="w-8 h-8">
                        <SkipBack className="w-5 h-5" />
                    </Button>

                    <Button
                        size="icon"
                        className="w-10 h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-transform"
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5" fill="currentColor" />
                        ) : (
                            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                        )}
                    </Button>

                    <Button variant="ghost" size="icon" className="w-8 h-8">
                        <SkipForward className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("w-8 h-8 relative", repeatMode !== "off" && "text-primary")}
                        onClick={handleRepeatClick}
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
                        {currentSong.currentTime}
                    </span>
                    <Slider
                        value={[progress]}
                        onValueChange={(value) => setProgress(value[0])}
                        max={100}
                        step={1}
                        className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-10">
                        {currentSong.duration}
                    </span>
                </div>
            </div>

            {/* Volume and extras */}
            <div className="flex items-center gap-3 justify-end min-w-[200px] w-[30%]">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                    <ListMusic className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-2">
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
                            setIsMuted(value[0] === 0);
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
