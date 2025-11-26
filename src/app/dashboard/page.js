"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Loader2,
  LogOut,
  Pin,
  PinOff,
  Plus,
  Search as SearchIcon,
  Settings,
  Star,
  Trash2,
  RefreshCw,
  User,
  Edit3,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/themeToggle.jsx";

function formatTimestamp(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleString();
}

export default function DashboardPage() {
  const router = useRouter();
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingPinId, setPendingPinId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [profile, setProfile] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [navigatingToCanvas, setNavigatingToCanvas] = useState(false);

  useEffect(() => {

    async function fetchUser() {
      try {

        const response = await axios.get("/api/auth/me");

        if (response.status != 200 || response.data.ok != true) {
          router.push("/login");
        }
        

        setUser(response.data);

      } catch (error) {
        toast.error("Error Authenticating!!");
        router.push("/login")
      }
    }

    
    async function loadUser() {
      await fetchUser();
    }
    loadUser();

  }, []);

  useEffect(() => {
    const warmUpCanvas = async () => {
      try {
        await Promise.all([
          import("@/components/editor.jsx"),
          import("@/wrapper/excalidraw.js"),
        ]);
      } catch (err) {
        console.warn("Canvas preloading failed:", err);
      }
    };
    warmUpCanvas();
  }, []);

  const fetchMaps = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/canvas?ts=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch maps");
      }

      const data = await res.json();
      setMaps(
        Array.isArray(data?.maps)
          ? data.maps.map((m) => ({
            ...m,
            pinned: m.pinned === true || m.pinned === "true" || m.pinned === 1,
          }))
          : []
      );
    } catch (err) {
      console.error(err);
      setError("Unable to load your mind maps. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data?.profile ?? null);
    } catch { }
  }, []);

  useEffect(() => {
    fetchMaps();
    fetchProfile();
  }, [fetchMaps, fetchProfile]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibility = () => {
      if (!document.hidden) {
        fetchMaps();
      }
    };

    window.addEventListener("focus", handleVisibility);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleVisibility);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchMaps]);
  /*
    const refreshParam = searchParams.get("refresh");
    useEffect(() => {
      if (refreshParam) {
        fetchMaps();
        router.replace("/dashboard");
      }
    }, [refreshParam, fetchMaps, router]);
    */

  const filteredMaps = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const sorted = [...maps].sort((a, b) => {
      const pinScore = (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      if (pinScore !== 0) return pinScore;
      return (
        new Date(b.updatedAt ?? b.createdAt ?? "").getTime() -
        new Date(a.updatedAt ?? a.createdAt ?? "").getTime()
      );
    });

    return term
      ? sorted.filter(
        (m) =>
          (m.title || "").toLowerCase().includes(term) ||
          (m.description || "").toLowerCase().includes(term)
      )
      : sorted;
  }, [maps, searchTerm]);

  const pinnedMaps = filteredMaps.filter((m) => m.pinned);
  const regularMaps = filteredMaps.filter((m) => !m.pinned);

  const handleTogglePin = async (id) => {
    setPendingPinId(id);
    try {
      const res = await fetch("/api/user/pin", {
        method: "POST",
        body: JSON.stringify({ mapId: id }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error();

      const data = await res.json();

      setMaps((prev) => {
        const pinState =
          data?.map?.pinned === true ||
          data?.map?.pinned === "true" ||
          data?.map?.pinned === 1;

        return prev.map((m) => {
          if (m.id === id) {
            return {
              ...m,
              pinned: pinState,
              updatedAt: data?.map?.updatedAt ?? m.updatedAt,
            };
          }

          return pinState ? { ...m, pinned: false } : m;
        });
      });
    } catch {
      toast.error("Failed to update pin.");
    } finally {
      setPendingPinId(null);
    }
  };

  const handleRenameMap = async (map) => {
    setEditingId(map.id);
    setEditValue(map.title || "Untitled mind map");
  };

  const saveRename = async (map) => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === map.title) {
      setEditingId(null);
      return;
    }

    setRenamingId(map.id);

    try {
      const res = await fetch(`/api/mindmap/${map.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setMaps((prev) =>
        prev.map((m) =>
          m.id === map.id
            ? { ...m, title: data.map.title, updatedAt: data.map.updatedAt }
            : m
        )
      );
      toast.success("Mind map renamed.");
    } catch {
      toast.error("Unable to rename mind map.");
    } finally {
      setRenamingId(null);
      setEditingId(null);
    }
  };

  const handleDeleteMap = async (id) => {
    setPendingDeleteId(id);
    try {
      const res = await fetch(`/api/mindmap/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setMaps((prev) => prev.filter((m) => m.id !== id));
      toast.success("Mind map deleted.");
    } catch {
      toast.error("Failed to delete mind map.");
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      router.push("/login");
    } catch {
      toast.error("Failed to log out.");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleCreate = async () => {
    setNavigatingToCanvas(true);
    try {
      const res = await fetch("/api/mindmap/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled mind map" }),
      });

      if (res.status === 401) {
        router.push("/login");
        setNavigatingToCanvas(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to create mind map");
      }

      const data = await res.json();
      if (!data?.map?.id) {
        throw new Error("Invalid response from server");
      }

      setMaps((prev) => [data.map, ...prev]);
      router.push(`/canvas/${data.map.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Unable to create a new mind map. Please try again.");
      setNavigatingToCanvas(false);
    }
  };

  const renderCard = (map) => {
    const timestamp = formatTimestamp(map.updatedAt ?? map.createdAt);
    return (
      <Card
        key={map.id}
        className="flex flex-col border border-black/5 dark:border-white/5 shadow-sm rounded-xl sm:rounded-2xl backdrop-blur-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => router.push(`/canvas/${map.id}`)}
      >
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              {editingId === map.id ? (
                <input
                  className="text-sm sm:text-base font-semibold bg-transparent border-b border-muted-foreground focus:outline-none w-full"
                  value={editValue}
                  autoFocus
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => saveRename(map)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveRename(map);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <CardTitle className="text-sm sm:text-base font-semibold truncate">
                  {map.title || "Untitled mind map"}
                </CardTitle>
              )}

              {map.description && (
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                  {map.description}
                </p>
              )}
            </div>

            <div className="flex gap-0.5 sm:gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <Button
                id={`rename-map-${map.id}`}
                size="icon"
                variant="ghost"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRenameMap(map);
                }}
                disabled={renamingId === map.id}
              >
                {renamingId === map.id ? (
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </Button>

              <Button
                id={`toggle-pin-${map.id}`}
                size="icon"
                variant="ghost"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePin(map.id);
                }}
                disabled={pendingPinId === map.id}
              >
                {pendingPinId === map.id ? (
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                ) : map.pinned ? (
                  <PinOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Pin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </Button>

              <Button
                id={`delete-map-${map.id}`}
                size="icon"
                variant="ghost"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMap(map.id);
                }}
                disabled={pendingDeleteId === map.id}
              >
                {pendingDeleteId === map.id ? (
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-auto pt-0 text-xs text-muted-foreground flex justify-between items-center">
          <span className="truncate">{timestamp ? `Updated ${timestamp}` : "No activity"}</span>
          {map.pinned && (
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs shrink-0 ml-2">
              Pinned
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ToastContainer theme="dark" />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[5%] w-[700px] h-[700px] rounded-full blur-[140px] bg-black/5 dark:bg-white/5" />
        <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] rounded-full blur-[140px] bg-black/5 dark:bg-white/5" />
      </div>

      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header Section - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 sm:mb-12 lg:mb-16">
          {/* Logo and Title */}
          <div className="flex gap-4 sm:gap-6 items-center sm:items-start w-full sm:w-auto">
            {/* <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-xl shrink-0">
              <Brain className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white dark:text-black" />
            </div> */}

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight truncate">
                Manaska
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-0.5 sm:mt-1 line-clamp-2">
                Manage and organize all of your mind maps in one place.
              </p>
            </div>
          </div>

          {/* Actions - Theme Toggle and User Menu */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 self-end sm:self-auto">
            <div className="scale-110 sm:scale-125">
              <ModeToggle />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  id="user-menu-button"
                  className="relative rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black shadow-xl transition-transform hover:scale-105 active:scale-95"
                >
                  {profile?.image ? (
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                      <AvatarImage src={profile.image} />
                      <AvatarFallback className="text-base sm:text-lg">
                        {(profile?.name || "U").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="w-6 h-6 sm:w-7 sm:h-7" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="w-5 h-5 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  {loggingOut ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="w-5 h-5 mr-2" />
                  )}
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search and Actions Bar - Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12">
          {/* Search Input */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search mind maps…"
              className="w-full h-12 sm:h-14 pl-12 sm:pl-14 pr-4 rounded-full border bg-white dark:bg-black/20 shadow-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 sm:gap-4">
            <Button
              id="refresh-maps-button"
              variant="outline"
              className="h-12 sm:h-14 px-5 sm:px-7 rounded-full flex-1 sm:flex-none"
              onClick={fetchMaps}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" />
                  <span className="hidden sm:inline">Loading...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Refresh</span>
                </>
              )}
            </Button>

            <Button
              id="create-map-button"
              className="h-12 sm:h-14 px-5 sm:px-8 rounded-full flex-1 sm:flex-none"
              onClick={handleCreate}
              disabled={navigatingToCanvas}
            >
              {navigatingToCanvas ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2 animate-spin" />
                  <span className="hidden sm:inline">Opening…</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                  <span className="sm:hidden">Create</span>
                  <span className="hidden sm:inline">Create mind map</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12 max-w-3xl">
          <Card className="rounded-xl sm:rounded-2xl shadow-sm border border-black/10 dark:border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-4">
              <CardTitle className="text-sm sm:text-base">Pinned</CardTitle>
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{pinnedMaps.length}</div>
            </CardContent>
          </Card>

          <Card className="rounded-xl sm:rounded-2xl shadow-sm border border-black/10 dark:border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-4">
              <CardTitle className="text-sm sm:text-base">Total Maps</CardTitle>
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">
                {pinnedMaps.length + regularMaps.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mind Maps Grid - Responsive */}
        {loading ? (
          <div className="flex justify-center py-16 sm:py-20 text-muted-foreground">
            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mr-2" />
            <span className="text-sm sm:text-base">Loading mind maps…</span>
          </div>
        ) : filteredMaps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center px-4">
            <div className="p-8 sm:p-12 rounded-2xl sm:rounded-3xl bg-white dark:bg-black/20 border shadow-sm mb-6 sm:mb-8">
              <Brain className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground" />
            </div>
            <p className="text-base sm:text-xl text-muted-foreground max-w-md">
              {searchTerm
                ? "No mind maps match your search."
                : "You have not created any mind maps yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {pinnedMaps.map(renderCard)}
            {regularMaps.map(renderCard)}
          </div>
        )}
      </div>
    </div>
  );
}
