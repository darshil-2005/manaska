"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [showExamples, setShowExamples] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <header className="flex justify-between items-center max-w-7xl mx-auto px-8 py-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black text-white rounded-lg font-bold shadow-md flex items-center justify-center">
            M
          </div>
          <h1 className="font-semibold text-lg">ManaskaAI</h1>
        </div>

        <nav className="hidden md:flex space-x-8 text-gray-600 font-medium">
          <Link href="#features" className="hover:text-black transition">Features</Link>
          <Link href="#how" className="hover:text-black transition">How it Works</Link>
          <Link href="#use-cases" className="hover:text-black transition">Use Cases</Link>
        </nav>

        <div className="space-x-4 flex items-center">
          <Link href="/login" className="text-gray-600 hover:text-black transition px-4 py-2 rounded-md hover:bg-gray-100">
            Sign In
          </Link>
          <Link href="/register" className="bg-black text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition flex items-center gap-2">
            Try Free →
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-28 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Turn Ideas into Mind Maps Instantly
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          ManaskaAI transforms your thoughts, notes, and documents into intelligent visual mind maps using AI.
        </p>
        
        <div className="mt-10 flex justify-center space-x-4">
          <button 
            onClick={() => setShowExamples(!showExamples)}
            className="bg-gray-100 border border-gray-300 text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center gap-2"
          >
            See Examples
          </button>
          <button 
            onClick={() => setShowLearnMore(!showLearnMore)}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition flex items-center gap-2"
          >
            Learn More
          </button>
        </div>

        {/* Examples Modal */}
        {showExamples && (
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Example Mind Maps</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-300 rounded">
                <h4 className="font-semibold mb-2">Lecture Notes</h4>
                <p className="text-sm text-gray-600">Convert lecture transcripts into structured study guides</p>
              </div>
              <div className="p-4 border border-gray-300 rounded">
                <h4 className="font-semibold mb-2">Project Planning</h4>
                <p className="text-sm text-gray-600">Transform meeting notes into project timelines</p>
              </div>
              <div className="p-4 border border-gray-300 rounded">
                <h4 className="font-semibold mb-2">Book Summaries</h4>
                <p className="text-sm text-gray-600">Create visual summaries from book chapters</p>
              </div>
              <div className="p-4 border border-gray-300 rounded">
                <h4 className="font-semibold mb-2">Research Papers</h4>
                <p className="text-sm text-gray-600">Extract key concepts from academic papers</p>
              </div>
            </div>
            <button 
              onClick={() => setShowExamples(false)}
              className="mt-4 text-sm text-gray-500 hover:text-black"
            >
              Close Examples
            </button>
          </div>
        )}

        {/* Learn More Modal */}
        {showLearnMore && (
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold mb-4">About ManaskaAI</h3>
            <div className="space-y-4 text-left">
              <p>ManaskaAI uses advanced artificial intelligence to analyze your content and automatically generate organized mind maps.</p>
              
              <div>
                <h4 className="font-semibold mb-2">Key Benefits:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Save hours of manual mind mapping work</li>
                  <li>Improve information retention with visual learning</li>
                  <li>Collaborate and share mind maps with your team</li>
                  <li>Export to multiple formats for different use cases</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Perfect For:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Students organizing study materials</li>
                  <li>Professionals planning projects and meetings</li>
                  <li>Researchers analyzing complex information</li>
                  <li>Writers organizing thoughts and stories</li>
                </ul>
              </div>
            </div>
            <button 
              onClick={() => setShowLearnMore(false)}
              className="mt-4 text-sm text-gray-500 hover:text-black"
            >
              Close
            </button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20 px-6 sm:px-20 text-center">
        <h2 className="text-3xl font-semibold mb-12">Everything you need</h2>
        <div className="grid sm:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div>
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mx-auto mb-4 text-xl">📥</div>
            <h3 className="font-semibold mb-2 text-xl">Import anything</h3>
            <p className="text-gray-600">Paste text, upload documents, or input any content. Manaska works with PDFs, articles, notes, and more.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mx-auto mb-4 text-xl">⚡</div>
            <h3 className="font-semibold mb-2 text-xl">Instant processing</h3>
            <p className="text-gray-600">AI analyzes and structures your content in seconds, identifying key concepts and relationships automatically.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mx-auto mb-4 text-xl">📤</div>
            <h3 className="font-semibold mb-2 text-xl">Export everywhere</h3>
            <p className="text-gray-600">Download as PNG, PDF, or editable formats. Use your mind maps in presentations, documents, or other tools.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how" className="py-20 px-6 sm:px-20 text-center">
        <h2 className="text-3xl font-semibold mb-12">How it works</h2>
        <p className="text-gray-600 mb-12">Three simple steps to transform your content into mind maps</p>
        <div className="grid sm:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div>
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
            <h3 className="font-semibold mb-2 text-xl">Input your content</h3>
            <p className="text-gray-600">Paste text, upload documents, or type your ideas directly. Any format works.</p>
          </div>
          <div>
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
            <h3 className="font-semibold mb-2 text-xl">AI processes</h3>
            <p className="text-gray-600">Manaska analyzes your content and identifies key concepts, themes, and relationships.</p>
          </div>
          <div>
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
            <h3 className="font-semibold mb-2 text-xl">Get your mind map</h3>
            <p className="text-gray-600">Receive a beautiful, structured mind map ready to use, edit, or share.</p>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Security & Privacy First</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Your data is protected with enterprise-grade security measures
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Bank-Level Security</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• End-to-end encryption for all data</li>
                <li>• SOC 2 compliant infrastructure</li>
                <li>• Regular security audits</li>
                <li>• GDPR & CCPA compliant</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Your Data Stays Yours</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• We never sell or share your data</li>
                <li>• Delete your data anytime</li>
                <li>• Transparent privacy policy</li>
                <li>• No training on your content</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-24 px-6 text-center bg-gray-50">
        <h2 className="text-3xl font-bold mb-4">Who Uses ManaskaAI?</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Join thousands of professionals, students, and creatives
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-4">Students</h3>
            <p className="text-gray-600 text-sm">
              Summarize lectures and study more effectively with visual notes
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-semibold mb-4">Professionals</h3>
            <p className="text-gray-600 text-sm">
              Plan projects and organize meetings with clear visual plans
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-4">Creatives</h3>
            <p className="text-gray-600 text-sm">
              Develop stories and organize creative projects visually
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Everything you need to know about ManaskaAI
          </p>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center justify-between gap-4">
                How does the AI create mind maps?
                <span className="text-gray-400 flex-shrink-0">+</span>
              </h3>
              <p className="text-gray-600">
                Our AI analyzes your content to identify key concepts, relationships, and hierarchy, then automatically structures them into a visual mind map that makes sense.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center justify-between gap-4">
                What file formats can I import?
                <span className="text-gray-400 flex-shrink-0">+</span>
              </h3>
              <p className="text-gray-600">
                We support PDFs, Word documents, text files, and plain text input. You can also paste content directly from websites, emails, or notes.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center justify-between gap-4">
                Is there a free plan?
                <span className="text-gray-400 flex-shrink-0">+</span>
              </h3>
              <p className="text-gray-600">
                Yes! Our free plan includes 5 mind maps per month with basic export options. No credit card required to get started.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center justify-between gap-4">
                Can I collaborate with team members?
                <span className="text-gray-400 flex-shrink-0">+</span>
              </h3>
              <p className="text-gray-600">
                Team collaboration is available on our Pro and Business plans. Share mind maps, comment, and work together in real-time.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center justify-between gap-4">
                How secure is my data?
                <span className="text-gray-400 flex-shrink-0">+</span>
              </h3>
              <p className="text-gray-600">
                We use enterprise-grade encryption and comply with global privacy standards. Your data is never used to train our AI models without your explicit consent.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              Still have questions? <a href="/contact" className="text-black font-semibold hover:underline ml-1">Contact our team</a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center text-white bg-black">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <Link href="/register" className="bg-white text-black font-semibold px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition flex items-center gap-2 mx-auto w-fit">
          Start Free Now →
        </Link>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 text-center text-gray-500 border-t">
        <div className="max-w-7xl mx-auto px-8">
          <p>© 2025 ManaskaAI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}