import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search, Pencil, Trash2, Music } from "lucide-react";
import { useAdminSongs, useCreateOrUpdateSong, useDeleteSong, useAdminArtists } from "@/helpers/useAdminData";
import { MusicGenreArrayValues, MusicMoodArrayValues, songSchema } from "@/helpers/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/helpers/useDebounce";
import { useForm } from "react-hook-form";
import styles from "./admin.songs.module.css";

export default function AdminSongsPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingSong, setEditingSong] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const { data: songsData, isLoading } = useAdminSongs(debouncedSearch);
    const { data: artistsData } = useAdminArtists();

    const createMutation = useCreateOrUpdateSong();
    const deleteMutation = useDeleteSong();

    const form = useForm({
        resolver: zodResolver(songSchema),
        defaultValues: {
            title: "",
            artistId: "",
            albumId: "_empty",
            genre: "Pop",
            mood: "Happy",
            durationSeconds: 180,
            audioUrl: "",
            coverUrl: "",
            isTrending: false,
        },
    });

    const handleSubmit = async (values) => {
        try {
            await createMutation.mutateAsync({
                ...values,
                artistId: parseInt(values.artistId),
                albumId: values.albumId && values.albumId !== "_empty" ? parseInt(values.albumId) : undefined,
                audioUrl: values.audioUrl || null,
                coverUrl: values.coverUrl || null,
            });
            setIsSheetOpen(false);
            form.reset(form.defaultValues);
            setEditingSong(null);
        } catch (error) {
            console.error("Failed to save song", error);
        }
    };

    const handleEdit = (song) => {
        const values = {
            id: song.id,
            title: song.title,
            artistId: song.artistId?.toString() || "",
            albumId: song.albumId ? song.albumId.toString() : "_empty",
            genre: song.genre,
            mood: song.mood,
            durationSeconds: song.durationSeconds,
            audioUrl: song.audioUrl || "",
            coverUrl: song.coverUrl || "",
            isTrending: song.isTrending || false,
        };
        setEditingSong(values);
        form.reset(values);
        setIsSheetOpen(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteMutation.mutateAsync({ id: deleteId });
            setDeleteId(null);
        }
    };

    const openNewSheet = () => {
        setEditingSong(null);
        form.reset({
            title: "",
            artistId: "",
            albumId: "_empty",
            genre: "Pop",
            mood: "Happy",
            durationSeconds: 180,
            audioUrl: "",
            coverUrl: "",
            isTrending: false,
        });
        setIsSheetOpen(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Songs</h1>
                <Button onClick={openNewSheet}>
                    <Plus size={18} /> Add Song
                </Button>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={18} />
                    <Input
                        placeholder="Search songs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Artist</th>
                            <th>Genre</th>
                            <th>Mood</th>
                            <th>Duration</th>
                            <th>Plays</th>
                            <th>Status</th>
                            <th className={styles.actionsCol}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={8}><Skeleton className={styles.rowSkeleton} /></td>
                                </tr>
                            ))
                        ) : songsData?.songs?.length === 0 ? (
                            <tr>
                                <td colSpan={8} className={styles.emptyState}>No songs found</td>
                            </tr>
                        ) : (
                            songsData?.songs?.map((song) => (
                                <tr key={song.id}>
                                    <td className={styles.titleCell}>
                                        <div className={styles.coverThumb}>
                                            {song.coverUrl ? <img src={song.coverUrl} alt="" /> : <Music size={16} />}
                                        </div>
                                        {song.title}
                                    </td>
                                    <td>{song.artistName}</td>
                                    <td><Badge variant="outline">{song.genre}</Badge></td>
                                    <td><Badge variant="secondary">{song.mood}</Badge></td>
                                    <td>{Math.floor(song.durationSeconds / 60)}:{(song.durationSeconds % 60).toString().padStart(2, '0')}</td>
                                    <td>{song.playCount?.toLocaleString() || 0}</td>
                                    <td>{song.isTrending && <Badge variant="success">Trending</Badge>}</td>
                                    <td className={styles.actionsCol}>
                                        <div className={styles.actions}>
                                            <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(song)}>
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon-sm" className={styles.deleteBtn} onClick={() => setDeleteId(song.id)}>
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

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className={styles.sheetContent}>
                    <SheetHeader>
                        <SheetTitle>{editingSong ? "Edit Song" : "Add New Song"}</SheetTitle>
                    </SheetHeader>
                    <div className={styles.formContainer}>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="artistId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Artist</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select artist" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {artistsData?.artists?.map(artist => (
                                                        <SelectItem key={artist.id} value={artist.id.toString()}>
                                                            {artist.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className={styles.row}>
                                    <FormField
                                        control={form.control}
                                        name="genre"
                                        render={({ field }) => (
                                            <FormItem className={styles.half}>
                                                <FormLabel>Genre</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Genre" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {MusicGenreArrayValues.map(g => (
                                                            <SelectItem key={g} value={g}>{g}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="mood"
                                        render={({ field }) => (
                                            <FormItem className={styles.half}>
                                                <FormLabel>Mood</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Mood" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {MusicMoodArrayValues.map(m => (
                                                            <SelectItem key={m} value={m}>{m}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="durationSeconds"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration (seconds)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="coverUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cover Image URL</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="audioUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Audio URL</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isTrending"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Trending Song
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <SheetFooter>
                                    <Button type="submit" disabled={createMutation.isPending}>
                                        {createMutation.isPending ? "Saving..." : "Save Song"}
                                    </Button>
                                </SheetFooter>
                            </form>
                        </Form>
                    </div>
                </SheetContent>
            </Sheet>

            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Song</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this song? This action cannot be undone.
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
