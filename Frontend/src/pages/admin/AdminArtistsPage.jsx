import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { useAdminArtists, useCreateOrUpdateArtist, useDeleteArtist } from "@/helpers/useAdminData";
import { artistSchema } from "@/helpers/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import styles from "./admin.artists.module.css";

export default function AdminArtistsPage() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingArtist, setEditingArtist] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const { data: artistsData, isLoading } = useAdminArtists();
    const createMutation = useCreateOrUpdateArtist();
    const deleteMutation = useDeleteArtist();

    const form = useForm({
        resolver: zodResolver(artistSchema),
        defaultValues: {
            name: "",
            bio: "",
            imageUrl: "",
            monthlyListeners: 0,
        },
    });

    const handleSubmit = async (values) => {
        try {
            await createMutation.mutateAsync({
                ...values,
                bio: values.bio || null,
                imageUrl: values.imageUrl || null,
                monthlyListeners: values.monthlyListeners || 0,
            });
            setIsSheetOpen(false);
            form.reset(form.defaultValues);
            setEditingArtist(null);
        } catch (error) {
            console.error("Failed to save artist", error);
        }
    };

    const handleEdit = (artist) => {
        const values = {
            id: artist.id,
            name: artist.name,
            bio: artist.bio || "",
            imageUrl: artist.imageUrl || "",
            monthlyListeners: artist.monthlyListeners || 0,
        };
        setEditingArtist(values);
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
        setEditingArtist(null);
        form.reset({
            name: "",
            bio: "",
            imageUrl: "",
            monthlyListeners: 0,
        });
        setIsSheetOpen(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Artists</h1>
                <Button onClick={openNewSheet}>
                    <Plus size={18} /> Add Artist
                </Button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Artist</th>
                            <th>Bio</th>

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
                        ) : artistsData?.artists?.length === 0 ? (
                            <tr>
                                <td colSpan={3} className={styles.emptyState}>No artists found</td>
                            </tr>
                        ) : (
                            artistsData?.artists?.map((artist) => (
                                <tr key={artist.id}>
                                    <td className={styles.nameCell}>
                                        <Avatar className={styles.avatar}>
                                            <AvatarImage src={artist.imageUrl || undefined} />
                                            <AvatarFallback><User size={16} /></AvatarFallback>
                                        </Avatar>
                                        {artist.name}
                                    </td>
                                    <td className={styles.bioCell}>{artist.bio || "-"}</td>

                                    <td className={styles.actionsCol}>
                                        <div className={styles.actions}>
                                            <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(artist)}>
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon-sm" className={styles.deleteBtn} onClick={() => setDeleteId(artist.id)}>
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
                        <SheetTitle>{editingArtist ? "Edit Artist" : "Add New Artist"}</SheetTitle>
                    </SheetHeader>
                    <div className={styles.formContainer}>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />



                                <SheetFooter>
                                    <Button type="submit" disabled={createMutation.isPending}>
                                        {createMutation.isPending ? "Saving..." : "Save Artist"}
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
                        <DialogTitle>Delete Artist</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this artist? This action cannot be undone.
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
