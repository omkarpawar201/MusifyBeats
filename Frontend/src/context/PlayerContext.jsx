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

    // New Features
    const [shuffle, setShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState("off"); // off, all, one

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
            if (repeatMode === "one") {
                audio.currentTime = 0;
                audio.play().catch(e => console.error(e));
            } else {
                playNext();
            }
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [queue, currentIndex, repeatMode]); // Added repeatMode dependency

    // Handle song changes
    useEffect(() => {
        if (currentSong) {
            const audio = audioRef.current;
            // Only update src if it changed (prevents reload on re-render)
            if (audio.src !== currentSong.audioUrl) {
                audio.src = currentSong.audioUrl;
            }
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
        } else if (currentIndex === -1 || !queue.find(s => s.id === song.id)) {
            // New isolated song or queue replacement
            setQueue([song]);
            setCurrentIndex(0);
        } else {
            // Song exists in current queue, just jump to it
            const index = queue.findIndex(s => s.id === song.id);
            setCurrentIndex(index);
        }

        setCurrentSong(song);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (!currentSong && queue.length > 0) {
            playSong(queue[0], queue);
        } else if (currentSong) {
            setIsPlaying(!isPlaying);
        }
    };

    const playNext = (manual = false) => {
        console.log("PlayerContext: playNext", { manual, len: queue.length, idx: currentIndex });
        if (queue.length === 0) return;

        let nextIndex = currentIndex + 1;

        if (shuffle) {
            if (queue.length > 1) {
                // Pick a random index distinct from current
                do {
                    nextIndex = Math.floor(Math.random() * queue.length);
                } while (nextIndex === currentIndex);
            } else {
                nextIndex = 0;
            }
        } else if (nextIndex >= queue.length) {
            // End of queue
            if (repeatMode === "all" || manual) { // Wrap on manual click or repeat-all
                nextIndex = 0;
            } else {
                setIsPlaying(false);
                return;
            }
        }

        setCurrentIndex(nextIndex);
        setCurrentSong(queue[nextIndex]);
        setIsPlaying(true);
    };

    const playPrevious = () => {
        console.log("PlayerContext: playPrevious", { len: queue.length, idx: currentIndex });
        if (queue.length === 0) return;

        if (audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
            return;
        }

        let prevIndex = currentIndex - 1;

        if (shuffle) {
            if (queue.length > 1) {
                do {
                    prevIndex = Math.floor(Math.random() * queue.length);
                } while (prevIndex === currentIndex);
            } else {
                prevIndex = 0;
            }
        } else if (prevIndex < 0) {
            // Wrap to end
            prevIndex = queue.length - 1;
        }

        setCurrentIndex(prevIndex);
        setCurrentSong(queue[prevIndex]);
        setIsPlaying(true);
    };

    const seek = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setProgress(time);
        }
    };

    const toggleShuffle = () => setShuffle(!shuffle);
    const toggleRepeat = () => {
        setRepeatMode(current => current === "off" ? "all" : current === "all" ? "one" : "off");
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
            shuffle,
            repeatMode,
            playSong,
            togglePlay,
            playNext,
            playPrevious,
            seek,
            setVolume,
            setIsMuted,
            toggleShuffle,
            toggleRepeat
        }}>
            {children}
        </PlayerContext.Provider>
    );
};
