import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSongsPage from "./pages/admin/AdminSongsPage";
import AdminArtistsPage from "./pages/admin/AdminArtistsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

import PlaylistDetails from "./pages/PlaylistDetails";

import { ThemeProvider } from "@/components/theme-provider";
import { PlayerProvider } from "@/context/PlayerContext";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <PlayerProvider>
            <ThemeProvider defaultTheme="dark" storageKey="musify-ui-theme">
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/home" element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            } />
                            <Route path="/browse" element={
                                <ProtectedRoute>
                                    <Browse />
                                </ProtectedRoute>
                            } />
                            <Route path="/search" element={
                                <ProtectedRoute>
                                    <Search />
                                </ProtectedRoute>
                            } />
                            <Route path="/library" element={
                                <ProtectedRoute>
                                    <Library />
                                </ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            <Route path="/playlist/:id" element={
                                <ProtectedRoute>
                                    <PlaylistDetails />
                                </ProtectedRoute>
                            } />

                            {/* Admin Routes */}
                            <Route path="/admin" element={
                                <ProtectedRoute adminOnly>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/songs" element={
                                <ProtectedRoute adminOnly>
                                    <AdminSongsPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/artists" element={
                                <ProtectedRoute adminOnly>
                                    <AdminArtistsPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/users" element={
                                <ProtectedRoute adminOnly>
                                    <AdminUsersPage />
                                </ProtectedRoute>
                            } />

                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </ThemeProvider>
        </PlayerProvider>
    </QueryClientProvider>
);

export default App;
