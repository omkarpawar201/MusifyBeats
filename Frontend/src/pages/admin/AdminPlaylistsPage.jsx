import React, { useState } from "react";
import { ListMusic, Plus, Pencil, Trash2, Music, Search, Check } from "lucide-react";
import {
    useAdminPlaylists,
    useCreateOrUpdatePlaylist,
    useDeletePlaylist,
    usePlaylistSongs,
    useAddSongToPlaylist,
    useRemoveSongFromPlaylist,
    useAdminSongs
} from "@/helpers/useAdminData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/helpers/useDebounce";
import styles from "./admin.playlists.module.css";
import { toast } from "sonner";

export default function AdminPlaylistsPage() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isManageSongsOpen, setIsManageSongsOpen] = useState(false);
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    const [managingPlaylist, setManagingPlaylist] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // Data
    const { data: playlistsData, isLoading } = useAdminPlaylists();
    const createMutation = useCreateOrUpdatePlaylist();
    const deleteMutation = useDeletePlaylist();

    // Form State (Manual for simplicity as schema is simple)
    const [formData, setFormData] = useState({ name: "", description: "" });

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await createMutation.mutateAsync({
                id: editingPlaylist?.id,
                name: formData.name,
                description: formData.description
            });
            setIsSheetOpen(false);
            setEditingPlaylist(null);
            setFormData({ name: "", description: "" });
        } catch (error) {
            console.error("Failed to save playlist", error);
        }
    };

    const handleEdit = (playlist) => {
        setEditingPlaylist(playlist);
        setFormData({ name: playlist.name, description: playlist.description || "" });
        setIsSheetOpen(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteMutation.mutateAsync({ id: deleteId });
            setDeleteId(null);
        }
    };

    const openNewSheet = () => {
        setEditingPlaylist(null);
        setFormData({ name: "", description: "" });
        setIsSheetOpen(true);
    };

    const openManageSongs = (playlist) => {
        setManagingPlaylist(playlist);
        setIsManageSongsOpen(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Playlists</h1>
                <Button onClick={openNewSheet}>
                    <Plus size={18} /> Create Playlist
                </Button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Songs</th>
                            <th className={styles.actionsCol}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={4}><Skeleton className={styles.rowSkeleton} /></td>
                                </tr>
                            ))
                        ) : playlistsData?.playlists?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className={styles.emptyState}>No playlists found</td>
                            </tr>
                        ) : (
                            playlistsData?.playlists?.map((playlist) => (
                                <tr key={playlist.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center text-zinc-500">
                                                <ListMusic size={20} />
                                            </div>
                                            <span className="font-medium text-white">{playlist.name}</span>
                                        </div>
                                    </td>
                                    <td className="text-zinc-400">{playlist.description || "-"}</td>
                                    <td>{playlist.songsCount || 0}</td>
                                    <td className={styles.actionsCol}>
                                        <div className={styles.actions}>
                                            <Button variant="ghost" size="sm" onClick={() => openManageSongs(playlist)}>
                                                <Music size={16} className="mr-2" /> Songs
                                            </Button>
                                            <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(playlist)}>
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon-sm" className={styles.deleteBtn} onClick={() => setDeleteId(playlist.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className={styles.sheetContent}>
                    <SheetHeader>
                        <SheetTitle>{editingPlaylist ? "Edit Playlist" : "Create New Playlist"}</SheetTitle>
                    </SheetHeader>
                    <div className={styles.formContainer}>
                        <form onSubmit={handleSave} className={styles.form}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="Top Hits 2026"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="The best hits of the year..."
                                />
                            </div>
                            <Button type="submit" disabled={createMutation.isPending} className="mt-4">
                                {createMutation.isPending ? "Saving..." : "Save Playlist"}
                            </Button>
                        </form>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Manage Songs Sheet */}
            <Sheet open={isManageSongsOpen} onOpenChange={setIsManageSongsOpen}>
                <SheetContent className={`${styles.sheetContent} sm:max-w-xl w-full`}>
                    <SheetHeader>
                        <SheetTitle>Manage Songs: {managingPlaylist?.name}</SheetTitle>
                    </SheetHeader>
                    {managingPlaylist && <PlaylistSongManager playlistId={managingPlaylist.id} />}
                </SheetContent>
            </Sheet>

            {/* Delete Dialog */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Playlist</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this playlist? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function PlaylistSongManager({ playlistId }) {
    const { data: songsInPlaylist, isLoading: loadingPlaylistSongs } = usePlaylistSongs(playlistId);
    const addSongMutation = useAddSongToPlaylist();
    const removeSongMutation = useRemoveSongFromPlaylist();

    // Search for adding new songs
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const { data: searchResults, isLoading: searching } = useAdminSongs(debouncedSearch);

    const [showResults, setShowResults] = useState(false);

    const handleAdd = async (song) => {
        await addSongMutation.mutateAsync({ playlistId, songId: song.id });
        setSearch("");
        setShowResults(false);
    };

    const handleRemove = async (songId) => {
        await removeSongMutation.mutateAsync({ playlistId, songId });
    };

    return (
        <div className={`${styles.songManagerContainer} mt-6`}>
            {/* Add Song Section */}
            <div className="relative z-50">
                <div className={styles.pickerHeader}>
                    <Search size={18} className="text-zinc-400" />
                    <Input
                        placeholder="Search songs to add..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setShowResults(true); }}
                        className="bg-zinc-800 border-zinc-700"
                        onFocus={() => setShowResults(true)}
                    />
                </div>

                {showResults && (
                    <div className={styles.songResults}>
                        {searching ? (
                            <div className="p-4 text-center text-sm text-zinc-500">Searching...</div>
                        ) : (searchResults?.songs?.length === 0 || !searchResults?.songs) ? (
                            <div className="p-4 text-center text-sm text-zinc-500">No songs found</div>
                        ) : (
                            searchResults?.songs?.map((song) => {
                                const isAdded = songsInPlaylist?.songsDetails?.some(s => s.id === song.id);
                                return (
                                    <div
                                        key={song.id}
                                        className={styles.resultItem}
                                        onClick={() => !isAdded && handleAdd(song)}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            {song.coverUrl && <img src={song.coverUrl} className="w-8 h-8 rounded" alt="" />}
                                            <div className="truncate">
                                                <div className="text-sm font-medium text-white truncate">{song.title}</div>
                                                <div className="text-xs text-zinc-500 truncate">{song.artistName}</div>
                                            </div>
                                        </div>
                                        {isAdded ? (
                                            <span className={styles.addedBadge}>Added</span>
                                        ) : (
                                            <Plus size={16} className="text-zinc-400 hover:text-white" />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Current Songs List */}
            <div className={styles.songList}>
                <h3 className="text-sm font-semibold text-zinc-400 mb-3 px-2">
                    Current Songs ({songsInPlaylist?.songsDetails?.length || 0})
                </h3>

                {loadingPlaylistSongs ? (
                    <div className="space-y-2 p-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : songsInPlaylist?.songsDetails?.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500">
                        <Music className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p>No songs in this playlist yet.</p>
                    </div>
                ) : (
                    songsInPlaylist?.songsDetails?.map((song) => (
                        <div key={song.id} className={styles.songItem}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                {song.coverUrl && <img src={song.coverUrl} className="w-10 h-10 rounded" alt="" />}
                                <div className="min-w-0">
                                    <div className="font-medium text-sm text-white truncate">{song.title}</div>
                                    <div className="text-xs text-zinc-500 truncate">{song.artistName}</div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleRemove(song.id)}
                                className="text-zinc-500 hover:text-red-500"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
