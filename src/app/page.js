"use client";

import { useState } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/themeToggle.jsx";

export default function HomePage() {
  const [showExamples, setShowExamples] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Navbar - Fully Responsive */}
      <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold shadow-md flex items-center justify-center text-sm sm:text-base lg:text-lg">
              M
            </div>
            <h1 className="font-semibold text-sm sm:text-base lg:text-lg">Manaska</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8 text-gray-600 dark:text-gray-400 font-medium text-sm">
            <Link href="#features" className="hover:text-black dark:hover:text-white transition">Features</Link>
            <Link href="#how" className="hover:text-black dark:hover:text-white transition">How it Works</Link>
            <Link href="#use-cases" className="hover:text-black dark:hover:text-white transition">Use Cases</Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-4">
            <ModeToggle />
            <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition px-3 lg:px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-xs sm:text-sm lg:text-base">
              Sign In
            </Link>
            <Link href="/register" className="bg-black dark:bg-white text-white dark:text-black px-3 sm:px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition text-xs sm:text-sm lg:text-base whitespace-nowrap">
              Try Free →
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <nav className="flex flex-col px-4 py-3 space-y-3">
              <Link
                href="#features"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition py-2 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition py-2 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link
                href="#use-cases"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition py-2 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Use Cases
              </Link>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
                <div className="flex justify-center mb-2">
                  <ModeToggle />
                </div>
                <Link
                  href="/login"
                  className="block text-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block text-center bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-semibold shadow-lg text-sm"
                >
                  Try Free →
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section - Fully Responsive */}
      <section className="text-center py-10 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight px-2">
          Turn Ideas into Mind Maps Instantly
        </h1>
        <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
          ManaskaAI transforms your thoughts, notes, and documents into intelligent visual mind maps using AI.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm sm:text-base w-full sm:w-auto"
          >
            See Examples
          </button>
          <button
            onClick={() => setShowLearnMore(!showLearnMore)}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition text-sm sm:text-base w-full sm:w-auto"
          >
            Learn More
          </button>
        </div>

        {/* Examples Modal - Responsive */}
        {showExamples && (
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Example Mind Maps</h3>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Lecture Notes</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Convert lecture transcripts into structured study guides</p>
              </div>
              <div className="p-3 sm:p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Project Planning</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Transform meeting notes into project timelines</p>
              </div>
              <div className="p-3 sm:p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Book Summaries</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Create visual summaries from book chapters</p>
              </div>
              <div className="p-3 sm:p-4 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Research Papers</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Extract key concepts from academic papers</p>
              </div>
            </div>
            <button
              onClick={() => setShowExamples(false)}
              className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              Close Examples
            </button>
          </div>
        )}

        {/* Learn More Modal - Responsive */}
        {showLearnMore && (
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-4">About ManaskaAI</h3>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">ManaskaAI uses advanced artificial intelligence to analyze your content and automatically generate organized mind maps.</p>

              <div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Key Benefits:</h4>
                <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Save hours of manual mind mapping work</li>
                  <li>Improve information retention with visual learning</li>
                  <li>Collaborate and share mind maps with your team</li>
                  <li>Export to multiple formats for different use cases</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Perfect For:</h4>
                <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Students organizing study materials</li>
                  <li>Professionals planning projects and meetings</li>
                  <li>Researchers analyzing complex information</li>
                  <li>Writers organizing thoughts and stories</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowLearnMore(false)}
              className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              Close
            </button>
          </div>
        )}
      </section>

      {/* Features Section - Fully Responsive */}
      <section id="features" className="bg-gray-50 dark:bg-gray-900 py-10 sm:py-14 lg:py-20 px-4 sm:px-6 lg:px-8 text-center scroll-mt-20">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-10 lg:mb-12">Everything you need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div className="px-2 sm:px-4">
            <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 text-xl">📥</div>
            <h3 className="font-semibold mb-2 text-base sm:text-lg lg:text-xl">Import anything</h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">Paste text, upload documents, or input any content. Manaska works with PDFs, articles, notes, and more.</p>
          </div>
          <div className="px-2 sm:px-4">
            <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 text-xl">⚡</div>
            <h3 className="font-semibold mb-2 text-base sm:text-lg lg:text-xl">Instant processing</h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">AI analyzes and structures your content in seconds, identifying key concepts and relationships automatically.</p>
          </div>
          <div className="px-2 sm:px-4 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 text-xl">📤</div>
            <h3 className="font-semibold mb-2 text-base sm:text-lg lg:text-xl">Export everywhere</h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">Download as PNG, PDF, or editable formats. Use your mind maps in presentations, documents, or other tools.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section - Fully Responsive */}
      <section id="how" className="py-10 sm:py-14 lg:py-20 px-4 sm:px-6 lg:px-8 text-center scroll-mt-20">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4 lg:mb-6">How it works</h2>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-10 lg:mb-12 px-2">Three simple steps to transform your content into mind maps</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div className="px-2 sm:px-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl lg:text-2xl font-bold">1</div>
            <h3 className="font-semibold mb-2 text-base sm:text-lg lg:text-xl">Input your content</h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">Paste text, upload documents, or type your ideas directly. Any format works.</p>
          </div>
          <div className="px-2 sm:px-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl lg:text-2xl font-bold">2</div>
            <h3 className="font-semibold mb-2 text-base sm:text-lg lg:text-xl">AI processes</h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">Manaska analyzes your content and identifies key concepts, themes, and relationships.</p>
          </div>
          <div className="px-2 sm:px-4 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl lg:text-2xl font-bold">3</div>
            <h3 className="font-semibold mb-2 text-base sm:text-lg lg:text-xl">Get your mind map</h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400">Receive a beautiful, structured mind map ready to use, edit, or share.</p>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section - Responsive */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Security & Privacy First</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Your data is protected with enterprise-grade security measures
          </p>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 text-left">
            <div className="bg-gray-50 dark:bg-gray-900 p-5 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Bank-Level Security</h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>• End-to-end encryption for all data</li>
                <li>• SOC 2 compliant infrastructure</li>
                <li>• Regular security audits</li>
                <li>• GDPR & CCPA compliant</li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-5 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Your Data Stays Yours</h3>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>• We never sell or share your data</li>
                <li>• Delete your data anytime</li>
                <li>• Transparent privacy policy</li>
                <li>• No training on your content</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section - Fully Responsive */}
      <section id="use-cases" className="py-10 sm:py-14 lg:py-24 px-4 sm:px-6 text-center bg-gray-50 dark:bg-gray-900 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4">Who Uses ManaskaAI?</h2>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-10 lg:mb-12 max-w-2xl mx-auto px-2">
          Join thousands of professionals, students, and creatives
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg sm:rounded-xl lg:rounded-2xl p-5 sm:p-6 lg:p-8 text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 lg:mb-4">🎓</div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4">Students</h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Summarize lectures and study more effectively with visual notes
            </p>
          </div>

          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg sm:rounded-xl lg:rounded-2xl p-5 sm:p-6 lg:p-8 text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 lg:mb-4">💼</div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4">Professionals</h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Plan projects and organize meetings with clear visual plans
            </p>
          </div>

          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg sm:rounded-xl lg:rounded-2xl p-5 sm:p-6 lg:p-8 text-center sm:col-span-2 lg:col-span-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 lg:mb-4">🎨</div>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4">Creatives</h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Develop stories and organize creative projects visually
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section - Responsive */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white dark:bg-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4">Frequently Asked Questions</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Everything you need to know about ManaskaAI
          </p>

          <div className="space-y-4 sm:space-y-6">
            {/* FAQ Item 1 */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 flex items-center justify-between gap-4">
                How does the AI create mind maps?
                <span className="text-gray-400 shrink-0 text-xl sm:text-2xl">+</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Our AI analyzes your content to identify key concepts, relationships, and hierarchy, then automatically structures them into a visual mind map that makes sense.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 flex items-center justify-between gap-4">
                What file formats can I import?
                <span className="text-gray-400 shrink-0 text-xl sm:text-2xl">+</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                We support PDFs, Word documents, text files, and plain text input. You can also paste content directly from websites, emails, or notes.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 flex items-center justify-between gap-4">
                Is there a free plan?
                <span className="text-gray-400 shrink-0 text-xl sm:text-2xl">+</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Yes! Our free plan includes 5 mind maps per month with basic export options. No credit card required to get started.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 flex items-center justify-between gap-4">
                Can I collaborate with team members?
                <span className="text-gray-400 shrink-0 text-xl sm:text-2xl">+</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Team collaboration is available on our Pro and Business plans. Share mind maps, comment, and work together in real-time.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 flex items-center justify-between gap-4">
                How secure is my data?
                <span className="text-gray-400 shrink-0 text-xl sm:text-2xl">+</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                We use enterprise-grade encryption and comply with global privacy standards. Your data is never used to train our AI models without your explicit consent.
              </p>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12 px-4">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Still have questions? <a href="/contact" className="text-black dark:text-white font-semibold hover:underline ml-1">Contact our team</a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section - Responsive */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 text-center bg-black dark:bg-[#0a0a0a] text-white dark:text-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to Get Started?</h2>
        <Link href="/register" className="bg-white dark:bg-black text-black dark:text-white font-semibold px-6 sm:px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition inline-flex items-center gap-2 text-sm sm:text-base">
          Start Free Now →
        </Link>
      </section>


      {/* Simple Footer - Responsive */}
      <footer className="py-6 sm:py-8 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs sm:text-sm">© 2025 ManaskaAI. All rights reserved.</p>

        </div>
      </footer>
    </main>
  );
}