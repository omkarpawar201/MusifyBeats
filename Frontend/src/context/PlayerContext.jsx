import { createContext, useContext, useState, useRef, useEffect } from "react";
import { musicService } from "../services/musicService";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(70);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // Audio element ref
    const audioRef = useRef(new Audio());

    useEffect(() => {
        // Configure audio events
        const audio = audioRef.current;

        const updateProgress = () => {
            setProgress(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        const handleEnded = () => {
            playNext();
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [queue, currentIndex]); // Re-bind if needed, though ref implies single instance

    // Handle song changes
    useEffect(() => {
        if (currentSong) {
            const audio = audioRef.current;
            audio.src = currentSong.audioUrl;
            audio.volume = volume / 100;
            if (isPlaying) {
                audio.play().catch(e => console.error("Playback error:", e));
            }
        }
    }, [currentSong]);

    // Handle play/pause
    useEffect(() => {
        const audio = audioRef.current;
        if (isPlaying) {
            if (audio.src) audio.play().catch(e => console.error("Playback error:", e));
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    // Handle volume
    useEffect(() => {
        const audio = audioRef.current;
        audio.volume = isMuted ? 0 : volume / 100;
    }, [volume, isMuted]);

    const playSong = (song, newQueue = []) => {
        if (newQueue.length > 0) {
            setQueue(newQueue);
            const index = newQueue.findIndex(s => s.id === song.id);
            setCurrentIndex(index !== -1 ? index : 0);
        } else if (currentIndex === -1) {
            // If no queue, make specific song the queue
            setQueue([song]);
            setCurrentIndex(0);
        }

        setCurrentSong(song);
        setIsPlaying(true);

        // Track listen if duration > 30s (handled by backend usually, but we can trigger it)
        // musicService.trackListen(song.id, ...);
    };

    const togglePlay = () => {
        if (!currentSong && queue.length > 0) {
            playSong(queue[0]);
        } else if (currentSong) {
            setIsPlaying(!isPlaying);
        }
    };

    const playNext = () => {
        if (queue.length > 0 && currentIndex < queue.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentSong(queue[nextIndex]);
            setIsPlaying(true);
        } else {
            // Loop or stop
            setIsPlaying(false);
        }
    };

    const playPrevious = () => {
        if (queue.length > 0 && currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            setCurrentSong(queue[prevIndex]);
            setIsPlaying(true);
        } else {
            // Restart current song
            audioRef.current.currentTime = 0;
        }
    };

    const seek = (time) => {
        audioRef.current.currentTime = time;
        setProgress(time);
    };

    return (
        <PlayerContext.Provider value={{
            currentSong,
            isPlaying,
            queue,
            progress,
            duration,
            volume,
            isMuted,
            playSong,
            togglePlay,
            playNext,
            playPrevious,
            seek,
            setVolume,
            setIsMuted
        }}>
            {children}
        </PlayerContext.Provider>
    );
};
