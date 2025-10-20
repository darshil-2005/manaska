"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleSignIn = () => {
    router.push("/signin"); // Link to existing signin page
  };

  const handleTryFree = () => {
    router.push("/signup"); // Link to existing signup page
  };

  return (
    <div className="bg-white text-gray-900">
      {/* Navbar */}
      <header className="flex justify-between items-center max-w-7xl mx-auto px-8 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-lg font-bold">
            M
          </div>
          <h1 className="font-semibold text-lg">Manaska</h1>
        </div>
        <nav className="hidden md:flex space-x-8 text-gray-600 font-medium">
          <a href="#features" className="hover:text-gray-900">Features</a>
          <a href="#how" className="hover:text-gray-900">How it works</a>
          <a href="#pricing" className="hover:text-gray-900">Pricing</a>
        </nav>
        <div className="space-x-4">
          <button
            className="text-gray-700 font-medium hover:text-black"
            onClick={handleSignIn}
          >
            Sign in
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800"
            onClick={handleTryFree}
          >
            Try free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Turn ideas into <br /> mind maps instantly
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Manaska transforms your thoughts, documents, and ideas into clear visual mind maps using AI. No manual work required.
        </p>
        <div className="mt-10 flex justify-center space-x-4">
          <button
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-800"
            onClick={handleTryFree}
          >
            <span>Try Manaska free</span> <span>→</span>
          </button>
          <button
            className="border border-gray-300 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100"
            onClick={() => setIsDemoOpen(true)}
          >
            <span>▶</span> <span>Watch demo</span>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-24 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
        <p className="text-gray-600 mb-12">
          Powerful features that make mind mapping effortless
        </p>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="flex flex-col items-center space-y-3">
            <div className="text-4xl">📤</div>
            <h3 className="text-xl font-semibold">Import anything</h3>
            <p className="text-gray-600 text-sm">
              Paste text, upload documents, or input any content. Works with PDFs, notes, and more.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="text-4xl">⚙️</div>
            <h3 className="text-xl font-semibold">Instant processing</h3>
            <p className="text-gray-600 text-sm">
              AI analyzes and structures your content instantly, identifying key concepts automatically.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="text-4xl">📦</div>
            <h3 className="text-xl font-semibold">Export everywhere</h3>
            <p className="text-gray-600 text-sm">
              Download in PNG, PDF, or editable formats to use in presentations or docs.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-24 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">How it works</h2>
        <p className="text-gray-600 mb-12">
          Three simple steps to transform your content into mind maps
        </p>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {["Input your content", "AI processes", "Get your mind map"].map(
            (title, idx) => (
              <div key={idx}>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">
                  {idx === 0 &&
                    "Paste text, upload documents, or type your ideas directly. Any format works."}
                  {idx === 1 &&
                    "Manaska analyzes your content to identify key concepts, themes, and relationships."}
                  {idx === 2 &&
                    "Receive a structured, shareable mind map ready to use or edit instantly."}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center bg-gray-50">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-gray-600 mb-8">
          Join thousands who’ve transformed their brainstorming with Manaska. Create your first mind map in seconds.
        </p>
        <button
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
          onClick={handleTryFree}
        >
          Try Manaska free
        </button>
        <p className="text-sm text-gray-500 mt-4">
          No credit card required · Free forever plan available
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-8 text-gray-600">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Manaska</h3>
            <p className="text-sm">Transform your thoughts and ideas into beautiful mind maps with AI.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Product</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Company</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-12">
          © {new Date().getFullYear()} Manaska. All rights reserved.
        </div>
      </footer>

      {/* Demo Modal */}
      {isDemoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 relative w-11/12 md:w-2/3 lg:w-1/2">
            <button
              className="absolute top-2 right-2 text-gray-500 font-bold"
              onClick={() => setIsDemoOpen(false)}
            >
              ✕
            </button>
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Demo Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
