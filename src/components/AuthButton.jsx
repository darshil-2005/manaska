"use client";
import React from "react";

export default function AuthButton({ children, type = "submit", onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full h-11 sm:h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm sm:text-base font-medium transition"
    >
      {children}
    </button>
  );
}

