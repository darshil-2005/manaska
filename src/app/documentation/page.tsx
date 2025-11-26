"use client";

import React, { useState,useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

import NodeFormatDocs from "./components/NodeFormat";
import MindmapTypesSection1 from "./components/templates";

export default function DocsLayout() {
    useEffect(() => {
      document.title = "Documentation";
    }, []);
  const [active, setActive] = useState("node-format");
  const [open, setOpen] = useState(false); // mobile sidebar toggle

  return (
    <div className="flex h-screen w-full bg-background text-foreground">

      {/* ===== MOBILE HEADER ===== */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-card">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">Documentation</h2>
      </header>

      {/* ===== MOBILE SIDEBAR ===== */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-72">

          {/* IMPORTANT FIX: Provider INSIDE Sheet */}
          <SidebarProvider>
            <Sidebar className="h-full">

              <SidebarHeader>
                <h2 className="px-4 py-4 text-xl font-semibold">Documentation</h2>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Sections</SidebarGroupLabel>

                  <SidebarGroupContent>
                    <SidebarMenu>

                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => {
                            setActive("node-format");
                            setOpen(false);
                          }}
                          className={`${active === "node-format"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-muted"
                          }`}
                        >
                          Node Format
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => {
                            setActive("mindmap-templates");
                            setOpen(false);
                          }}
                          className={`${active === "mindmap-templates"
                            ? "bg-blue-600 text-white"
                            : "hover:bg-muted"
                          }`}
                        >
                          Mindmap Templates
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                    </SidebarMenu>
                  </SidebarGroupContent>

                </SidebarGroup>
              </SidebarContent>

            </Sidebar>
          </SidebarProvider>

        </SheetContent>
      </Sheet>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:flex lg:w-72 border-r bg-card">

        {/* Provider ONLY for desktop sidebar */}
        <SidebarProvider>
          <Sidebar className="h-full">
            <SidebarHeader>
              <h2 className="px-4 py-4 text-xl font-semibold">Documentation</h2>
              <SidebarTrigger />
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Sections</SidebarGroupLabel>

                <SidebarGroupContent>
                  <SidebarMenu>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => setActive("node-format")}
                        className={`${active === "node-format"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "hover:bg-muted"
                        }`}
                      >
                        Node Format
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => setActive("mindmap-templates")}
                        className={`${active === "mindmap-templates"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "hover:bg-muted"
                        }`}
                      >
                        Mindmap Templates
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                  </SidebarMenu>
                </SidebarGroupContent>

              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4 sm:p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            {active === "node-format" && <NodeFormatDocs />}
            {active === "mindmap-templates" && <MindmapTypesSection1 />}
          </div>
        </ScrollArea>
      </main>

    </div>
  );
}
