import { z } from "zod";

export const MusicGenreArrayValues = [
    "Pop", "Rock", "Hip Hop", "Electronic", "Jazz",
    "Classical", "R&B", "Country", "Latin", "Folk", "Blues", "Metal"
];

export const MusicMoodArrayValues = [
    "Happy", "Sad", "Energetic", "Relaxed", "Focused",
    "Romantic", "Melancholic", "Party", "Workout", "Sleep"
];

export const UserRoleArrayValues = ["USER", "ADMIN"];

export const songSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "Title is required"),
    artistId: z.string().min(1, "Artist is required"),
    albumId: z.string().optional(),
    genreId: z.string().min(1, "Genre is required"),
    moodId: z.string().min(1, "Mood is required"),
    durationSeconds: z.coerce.number().min(1, "Duration is required"),
    audioUrl: z.string().url("Invalid audio URL").optional().or(z.literal("")),
    coverUrl: z.string().url("Invalid cover URL").optional().or(z.literal("")),
    isTrending: z.boolean().default(false),
});

export const artistSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    bio: z.string().optional().or(z.literal("")),
    imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
    monthlyListeners: z.coerce.number().optional(),
});

export const albumSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "Title is required"),
    artistId: z.string().min(1, "Artist is required"),
    releaseYear: z.coerce.number().min(1900, "Invalid year").max(new Date().getFullYear() + 1, "Invalid year"),
    coverUrl: z.string().url("Invalid cover URL").optional().or(z.literal("")),
});
