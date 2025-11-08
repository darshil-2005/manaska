"use client";
import React from "react";
import Image from "next/image";

export default function AuthLeftPanel() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 p-8 sm:p-10 md:p-12">
      <div className="shadow-md mb-5 sm:mb-6">
        <Image
          src="/logo/logo.png"
          alt="ManaskaAI Logo"
          className="object-contain rounded-lg"
          width={100}
          height={100}
        />
      </div>
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight">
        ManaskaAI
      </h1>
      <p className="text-gray-500 mt-2 text-center text-sm sm:text-base max-w-xs leading-relaxed">
        AI-Powered Platform <br />
        Transform ideas into intelligent visual maps
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-4 sm:mt-6 text-gray-500 text-xs sm:text-sm font-medium">
        <span>● Intelligent</span>
        <span>● Adaptive</span>
        <span>● Efficient</span>
      </div>
    </div>
  );
}
