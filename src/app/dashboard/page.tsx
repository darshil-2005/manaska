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
  Search,
  Settings,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/themeToggle.jsx";

interface MindMap {
  id: string;
  title?: string | null;
  description?: string | null;
  pinned?: boolean | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}

interface UserProfile {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

function formatTimestamp(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString();
}

export default function DashboardPage() {
  const router = useRouter();
  const [maps, setMaps] = useState<MindMap[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pendingPinId, setPendingPinId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const fetchMaps = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/canvas");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      const fetchedMaps = Array.isArray(data?.maps) ? data.maps : [];
      setMaps(fetchedMaps);
    } catch (err) {
      console.error("Failed to load maps:", err);
      setError("Unable to load your mind maps. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data?.profile ?? null);
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  }, [router]);

  useEffect(() => {
    fetchMaps();
    fetchProfile();
  }, [fetchMaps, fetchProfile]);

  const filteredMaps = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const sorted = [...maps].sort((a, b) => {
      const pinnedScore = (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      if (pinnedScore !== 0) return pinnedScore;
      const aDate = new Date(a.updatedAt ?? a.createdAt ?? "").getTime();
      const bDate = new Date(b.updatedAt ?? b.createdAt ?? "").getTime();
      return (Number.isNaN(bDate) ? 0 : bDate) - (Number.isNaN(aDate) ? 0 : aDate);
    });

    if (!term) {
      return sorted;
    }

    return sorted.filter((map) => {
      const title = map.title?.toLowerCase() ?? "";
      const description = map.description?.toLowerCase() ?? "";
      return title.includes(term) || description.includes(term);
    });
  }, [maps, searchTerm]);

  const pinnedMaps = useMemo(
    () => filteredMaps.filter((map) => !!map.pinned),
    [filteredMaps]
  );

  const regularMaps = useMemo(
    () => filteredMaps.filter((map) => !map.pinned),
    [filteredMaps]
  );

  const handleTogglePin = useCallback(
    async (mapId: string) => {
      setPendingPinId(mapId);
      try {
        const res = await fetch("/api/user/pin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mapId }),
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || "Failed to update pin state.");
        }

        await fetchMaps();
      } catch (err) {
        console.error("Failed to toggle pin:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update pin state. Please try again."
        );
      } finally {
        setPendingPinId(null);
      }
    },
    [fetchMaps, router]
  );

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to log out");
      }
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      alert(err instanceof Error ? err.message : "Failed to log out");
    } finally {
      setLoggingOut(false);
    }
  }, [router]);

  const renderMapCard = (map: MindMap) => {
    const timestamp = formatTimestamp(map.updatedAt ?? map.createdAt ?? null);

    return (
      <Card key={map.id} className="flex h-full flex-col">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold">
                {map.title?.trim() || "Untitled mind map"}
              </CardTitle>
              {map.description?.trim() && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {map.description}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleTogglePin(map.id)}
              disabled={pendingPinId === map.id}
              aria-label={map.pinned ? "Unpin mind map" : "Pin mind map"}
            >
              {pendingPinId === map.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : map.pinned ? (
                <PinOff className="h-4 w-4" />
              ) : (
                <Pin className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>{timestamp ? `Updated ${timestamp}` : "No activity recorded"}</span>
          {map.pinned && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Pinned
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  };

  const handleCreateMap = useCallback(() => {
    router.push("/canvas");
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center gap-10 px-6 py-10">
        <header className="flex w-full flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <Brain className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Mind maps</h1>
              <p className="text-sm text-muted-foreground">
                Manage and organize all of your mind maps in one place.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    {profile?.image ? (
                      <AvatarImage
                        src={profile.image}
                        alt={profile.name ?? "User avatar"}
                      />
                    ) : (
                      <AvatarFallback>
                        {(profile?.name || "U")
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} disabled={loggingOut}>
                  {loggingOut ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex w-full flex-1 flex-col items-center gap-6">
          <div className="flex w-full flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search mind maps..."
                className="w-full pl-9"
              />
            </div>
            <Button variant="outline" onClick={fetchMaps} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Refresh"
              )}
            </Button>
            <Button onClick={handleCreateMap} className="md:ml-2">
              <Plus className="mr-2 h-4 w-4" />
              Create mind map
            </Button>
          </div>

          {error && (
            <div className="w-full max-w-2xl rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex w-full justify-center py-20 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading your mind maps...
            </div>
          ) : filteredMaps.length === 0 ? (
            <Card className="w-full max-w-2xl">
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                {searchTerm
                  ? "No mind maps match your search."
                  : "You have not created any mind maps yet."}
              </CardContent>
            </Card>
          ) : (
            <div className="w-full space-y-8">
              <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-2 ">

             
              {pinnedMaps.length > 0 && (

                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pinned</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pinnedMaps.length}</div>
                </CardContent>
              </Card>

                // <section className="space-y-3">
                //   <div className="flex flex-col items-center justify-between gap-2 text-center md:flex-row md:text-left">
                //     <h2 className="text-lg font-semibold">Pinned mind maps</h2>
                //     <span className="text-sm text-muted-foreground">
                //       {pinnedMaps.length} item{pinnedMaps.length > 1 ? "s" : ""}
                //     </span>
                //   </div>
                //   <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
                //     {pinnedMaps.map((map) => renderMapCard(map))}
                //   </div>
                // </section>
              )}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Mind Maps</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{regularMaps.length + pinnedMaps.length}</div>
                </CardContent>
              </Card>

               </div>

              {regularMaps.length + pinnedMaps.length === 0 ? (
                  <Card className="w-full">
                    <CardContent className="py-12 text-center text-sm text-muted-foreground">
                      No mind maps found.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {pinnedMaps.map((map) => renderMapCard(map))}
                    {regularMaps.map((map) => renderMapCard(map))}
                  </div>
                )}

              {/* <section className="space-y-3">
                <div className="flex flex-col items-center justify-between gap-2 text-center md:flex-row md:text-left">
                  <h2 className="text-lgankha font-semibold">All mind maps</h2>
                  <span className="text-sm text-muted-foreground">
                    {regularMaps.length + pinnedMaps.length} total
                  </span>
                </div>
                {regularMaps.length === 0 ? (
                  <Card className="w-full">
                    <CardContent className="py-12 text-center text-sm text-muted-foreground">
                      All of your mind maps are pinned.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {regularMaps.map((map) => renderMapCard(map))}
                  </div>
                )}
              </section> */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
