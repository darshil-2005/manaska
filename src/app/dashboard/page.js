"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
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
    } catch {}
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

  const refreshParam = searchParams.get("refresh");
  useEffect(() => {
    if (refreshParam) {
      fetchMaps();
      router.replace("/dashboard");
    }
  }, [refreshParam, fetchMaps, router]);

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
        className="flex flex-col border border-black/[0.05] dark:border-white/[0.05] shadow-sm rounded-2xl backdrop-blur-sm"
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              {editingId === map.id ? (
                <input
                  className="text-base font-semibold bg-transparent border-b border-muted-foreground focus:outline-none"
                  value={editValue}
                  autoFocus
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => saveRename(map)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveRename(map);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <CardTitle className="text-base font-semibold">
                  {map.title || "Untitled mind map"}
                </CardTitle>
              )}

              {map.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {map.description}
                </p>
              )}
            </div>

            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleRenameMap(map)}
                disabled={renamingId === map.id}
              >
                {renamingId === map.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Edit3 className="w-4 h-4" />
                )}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleTogglePin(map.id)}
                disabled={pendingPinId === map.id}
              >
                {pendingPinId === map.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : map.pinned ? (
                  <PinOff className="w-4 h-4" />
                ) : (
                  <Pin className="w-4 h-4" />
                )}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDeleteMap(map.id)}
                disabled={pendingDeleteId === map.id}
              >
                {pendingDeleteId === map.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-auto text-xs text-muted-foreground flex justify-between">
          <span>{timestamp ? `Updated ${timestamp}` : "No activity"}</span>
          {map.pinned && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
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

      <div className="relative max-w-[1500px] mx-auto px-8 py-12">
        <div className="flex justify-between mb-16">
          <div className="flex gap-6 items-start">
            <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-xl mt-1.5">
              <Brain className="w-8 h-8 text-white dark:text-black" />
            </div>

            <div className="pt-1.5">
              <h1 className="text-5xl font-semibold tracking-tight">Manaska</h1>
              <p className="text-lg text-muted-foreground mt-1">
                Manage and organize all of your mind maps in one place.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="scale-125">
              <ModeToggle />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative rounded-full w-14 h-14 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black shadow-xl transition-transform hover:scale-105">
                  {profile?.image ? (
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={profile.image} />
                      <AvatarFallback className="text-lg">
                        {(profile?.name || "U").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="w-7 h-7" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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

        <div className="flex flex-wrap gap-4 mb-12 items-center">
          <div className="relative flex-1 min-w-[260px]">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search mind maps…"
              className="w-full h-14 pl-14 rounded-full border bg-white dark:bg-black/20 shadow-md"
            />
          </div>

          <Button
            variant="outline"
            className="h-14 px-7 rounded-full"
            onClick={fetchMaps}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </>
            )}
          </Button>

          <Button
            className="h-14 px-8 rounded-full"
            onClick={handleCreate}
            disabled={navigatingToCanvas}
          >
            {navigatingToCanvas ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Opening…
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" /> Create mind map
              </>
            )}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-3xl">
          <Card className="rounded-2xl shadow-sm border border-black/10 dark:border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pinned</CardTitle>
              <Star className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pinnedMaps.length}</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border border-black/10 dark:border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Total Mind Maps</CardTitle>
              <Brain className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {pinnedMaps.length + regularMaps.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading mind maps…
          </div>
        ) : filteredMaps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="p-12 rounded-3xl bg-white dark:bg-black/20 border shadow-sm mb-8">
              <Brain className="w-20 h-20 text-muted-foreground" />
            </div>
            <p className="text-xl text-muted-foreground">
              {searchTerm
                ? "No mind maps match your search."
                : "You have not created any mind maps yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {pinnedMaps.map(renderCard)}
            {regularMaps.map(renderCard)}
          </div>
        )}
      </div>
    </div>
  );
}
