/*export default function Home() {
  return (
    <div>
      Manaska
    </div>
  );
}*/
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-6 sm:px-20">
        <div className="text-xl font-bold">Manaska</div>
        <nav className="flex gap-6">
          <a href="#features" className="hover:underline">Features</a>
          <a href="#how-it-works" className="hover:underline">How it works</a>
          <a href="#pricing" className="hover:underline">Pricing</a>
        </nav>
        <div className="flex gap-4">
          <a href="/login" className="px-4 py-2 border rounded hover:bg-gray-100">Sign in</a>
          <a href="#" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Try free</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 sm:px-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Turn ideas into mind maps instantly</h1>
        <p className="text-gray-600 mb-8">
          Manaska transforms your thoughts, documents, and ideas into clear visual mind maps using AI. No manual work required.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#" className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800">Try Manaska free</a>
          <a href="#" className="px-6 py-3 border rounded hover:bg-gray-100">Watch demo</a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20 px-6 sm:px-20 text-center">
        <h2 className="text-3xl font-semibold mb-12">Everything you need</h2>
        <div className="grid sm:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div>
            <Image src="/import.svg" alt="Import anything" width={48} height={48} className="mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Import anything</h3>
            <p className="text-gray-600">Paste text, upload documents, or input any content. Manaska works with PDFs, articles, notes, and more.</p>
          </div>
          <div>
            <Image src="/ai.svg" alt="Instant processing" width={48} height={48} className="mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Instant processing</h3>
            <p className="text-gray-600">AI analyzes and structures your content in seconds, identifying key concepts and relationships automatically.</p>
          </div>
          <div>
            <Image src="/export.svg" alt="Export everywhere" width={48} height={48} className="mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Export everywhere</h3>
            <p className="text-gray-600">Download as PNG, PDF, or editable formats. Use your mind maps in presentations, documents, or other tools.</p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 px-6 sm:px-20 text-center">
        <h2 className="text-3xl font-semibold mb-12">How it works</h2>
        <p className="text-gray-600 mb-12">Three simple steps to transform your content into mind maps</p>
        <div className="grid sm:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4">1</div>
            <h3 className="font-semibold mb-2">Input your content</h3>
            <p className="text-gray-600">Paste text, upload documents, or type your ideas directly. Any format works.</p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4">2</div>
            <h3 className="font-semibold mb-2">AI processes</h3>
            <p className="text-gray-600">Manaska analyzes your content and identifies key concepts, themes, and relationships.</p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-4">3</div>
            <h3 className="font-semibold mb-2">Get your mind map</h3>
            <p className="text-gray-600">Receive a beautiful, structured mind map ready to use, edit, or share.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 sm:px-20 text-center">
        <h2 className="text-3xl font-semibold mb-6">Ready to get started?</h2>
        <p className="text-gray-600 mb-8">Join thousands who've transformed their brainstorming with Manaska. Create your first mind map in seconds.</p>
        <a href="#" className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800">Try Manaska free</a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12 px-6 sm:px-20 text-center">
        <div className="mb-6 font-bold">Manaska</div>
        <div className="flex justify-center gap-8 mb-6">
          <a href="#features" className="hover:underline">Features</a>
          <a href="#pricing" className="hover:underline">Pricing</a>
          <a href="#about" className="hover:underline">API</a>
        </div>
        <div className="flex justify-center gap-8 text-gray-600">
          <a href="#">Help Center</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </footer>
    </div>
  );
}



