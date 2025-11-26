"use client";

import React, { useState } from "react";
import Link from "next/link"
import { ModeToggle } from "@/components/themeToggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import PrivacyPolicy from "./components/privacypolicy";
import TermsAndConditions from "./components/termsandconditions";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

import NodeFormatDocs from "./components/NodeFormat";
import MindmapTypesSection1 from "./components/templates";

export default function DocsLayout() {
  const [active, setActive] = useState("node-format");
  const [open, setOpen] = useState(false);

  const menuItem = (id: string, label: string) => (
    <button
      key={id}
      onClick={() => {
        setActive(id);
        setOpen(false);
      }}
      className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
        active === id ? "bg-blue-600 text-white" : "text-foreground hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground">

      {/* HEADER */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="text-lg font-semibold select-none">Documentation</h1>
        </div>

        <div />
        <NavLink href="/dashboard">Dashboard</NavLink>
        <ModeToggle />
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="
            p-0 
            w-[min(20rem,90vw)] 
            bg-card/95 
            backdrop-blur-sm 
            border-r 
            border-border 
            shadow-lg 
            [&>button]:hidden
          "
        >
          <SheetHeader className="flex items-center justify-between px-4 py-3 border-b">
            <SheetTitle className="text-lg font-medium">Documentation</SheetTitle>

            {/* ONLY close button */}
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </SheetHeader>

          <nav className="px-3 py-4 space-y-2">
            <div className="px-2 text-xs text-muted-foreground uppercase tracking-wide">
              Sections
            </div>

            {menuItem("node-format", "Node Format")}
            {menuItem("mindmap-templates", "Mindmap Templates")}
            {menuItem("privacy-policy", "Privacy Policy")}
            {menuItem("terms-and-conditions", "Terms And Conditions")}
          </nav>
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4 sm:p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            {active === "node-format" && <NodeFormatDocs />}
            {active === "mindmap-templates" && <MindmapTypesSection1 />}
            {active === "privacy-policy" && <PrivacyPolicy/>}
            {active === "terms-and-conditions" && <TermsAndConditions/>}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
}