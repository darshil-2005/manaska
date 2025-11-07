"use client";
import React from "react";

export default function AuthCheckbox({ name, checked, onChange, label }) {
  return (
    <label className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
