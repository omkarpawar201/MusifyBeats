import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Disc } from "lucide-react";
import { useAdminAlbums, useCreateOrUpdateAlbum, useDeleteAlbum, useAdminArtists } from "@/helpers/useAdminData";
import { albumSchema } from "@/helpers/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import styles from "./admin.albums.module.css";

export default function AdminAlbumsPage() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const { data: albumsData, isLoading } = useAdminAlbums();
    const { data: artistsData } = useAdminArtists();

    const createMutation = useCreateOrUpdateAlbum();
    const deleteMutation = useDeleteAlbum();

    const form = useForm({
        resolver: zodResolver(albumSchema),
        defaultValues: {
            title: "",
            artistId: "",
            releaseYear: new Date().getFullYear(),
            coverUrl: "",
        },
    });

    const handleSubmit = async (values) => {
        try {
            await createMutation.mutateAsync({
                ...values,
                artistId: parseInt(values.artistId),
                coverUrl: values.coverUrl || null,
            });
            setIsSheetOpen(false);
            form.reset(form.defaultValues);
            setEditingAlbum(null);
        } catch (error) {
            console.error("Failed to save album", error);
        }
    };

    const handleEdit = (album) => {
        const values = {
            id: album.id,
            title: album.title,
            artistId: album.artistId?.toString() || "",
            releaseYear: album.releaseYear || new Date().getFullYear(),
            coverUrl: album.coverUrl || "",
        };
        setEditingAlbum(values);
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
        setEditingAlbum(null);
        form.reset({
            title: "",
            artistId: "",
            releaseYear: new Date().getFullYear(),
            coverUrl: "",
        });
        setIsSheetOpen(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Albums</h1>
                <Button onClick={openNewSheet}>
                    <Plus size={18} /> Add Album
                </Button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Album</th>
                            <th>Artist</th>
                            <th className={styles.actionsCol}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={3}><Skeleton className={styles.rowSkeleton} /></td>
                                </tr>
                            ))
                        ) : albumsData?.albums?.length === 0 ? (
                            <tr>
                                <td colSpan={3} className={styles.emptyState}>No albums found</td>
                            </tr>
                        ) : (
                            albumsData?.albums?.map((album) => (
                                <tr key={album.id}>
                                    <td className={styles.coverCell}>
                                        <div className={styles.avatar}>
                                            {album.coverUrl ? (
                                                <img src={album.coverUrl} alt={album.title} />
                                            ) : (
                                                <Disc size={20} />
                                            )}
                                        </div>
                                        {album.title}
                                    </td>
                                    <td>{album.artistName || (artistsData?.artists?.find(a => a.id === album.artistId)?.name) || "Unknown"}</td>

                                    <td className={styles.actionsCol}>
                                        <div className={styles.actions}>
                                            <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(album)}>
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon-sm" className={styles.deleteBtn} onClick={() => setDeleteId(album.id)}>
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
                        <SheetTitle>{editingAlbum ? "Edit Album" : "Add New Album"}</SheetTitle>
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

                                <SheetFooter>
                                    <Button type="submit" disabled={createMutation.isPending}>
                                        {createMutation.isPending ? "Saving..." : "Save Album"}
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
                        <DialogTitle>Delete Album</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this album? This will cascade delete songs associated with it (check DB constraints).
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
