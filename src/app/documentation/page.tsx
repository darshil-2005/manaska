"use client"

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import NodeFormatDocs from "./components/NodeFormat";
import MindmapTypesSection1 from "./components/templates";

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
  SidebarProvider
} from "@/components/ui/sidebar";

export default function DocsLayout() {
  // Track active selected menu
  const [active, setActive] = useState("node-format");

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background text-foreground">

        {/* Sidebar */}
        <aside className="hidden border-r bg-card md:flex md:w-64 lg:w-72">
          <Sidebar>
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
                        onClick={() => setActive("node-format")}
                        className={`
                          ${active === "node-format"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "hover:bg-muted"
                          }
                        `}
                      >
                        Node Format
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => setActive("mindmap-templates")}
                        className={`
                          ${active === "mindmap-templates"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "hover:bg-muted"
                          }
                        `}
                      >
                        Mindmap Templates
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </aside>

        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-6">

            {active === "node-format" && <NodeFormatDocs />}
            {active === "mindmap-templates" && <MindmapTypesSection1 />}

          </ScrollArea>
        </main>
      </div>
    </SidebarProvider>
  );
}
