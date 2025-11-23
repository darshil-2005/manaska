"use client"

import {
  BookOpen,
  Cpu,
  Layers,
  Wrench,
  Code2,
  Workflow,
  HelpCircle,
  Map,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { id: "introduction", label: "Introduction", icon: BookOpen },
  { id: "how-system-works", label: "How System Works", icon: Cpu },
  { id: "features", label: "Features Overview", icon: Layers },
  { id: "how-to-use", label: "How to Use Tools", icon: Wrench },
  { id: "node-format", label: "Understanding Node Format", icon: Code2 },
  { id: "example-workflow", label: "Example Workflow", icon: Workflow },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "coming-soon", label: "Coming Soon", icon: Sparkles },
];

export function Sidebar({
  activeSection,
  setActiveSection,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] lg:h-auto
        w-64 bg-white border-r border-gray-200 lg:border-none
        p-6 overflow-y-auto z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-colors text-left
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
