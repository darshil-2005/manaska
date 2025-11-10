import Image from "next/image";

export default function LeftPanel() {
  return (
    <div className="flex flex-col items-center justify-center bg-muted/40 p-8 sm:p-10 md:p-12">
      <div className="shadow-sm mb-5 sm:mb-6">
        <Image
          src="/logo/logo.png"
          alt="ManaskaAI Logo"
          width={100}
          height={100}
          className="object-contain rounded-lg"
        />
      </div>
      <h1 className="text-2xl font-semibold text-foreground">ManaskaAI</h1>
      <p className="text-muted-foreground mt-2 text-center text-sm sm:text-base max-w-xs leading-relaxed">
        AI-Powered Platform <br /> Transform ideas into intelligent visual maps
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-4 text-muted-foreground text-xs sm:text-sm font-medium">
        <span>● Intelligent</span>
        <span>● Adaptive</span>
        <span>● Efficient</span>
      </div>
    </div>
  );
}
