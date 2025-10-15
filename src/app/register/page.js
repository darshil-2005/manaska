"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter px-4 sm:px-6">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left section */}
        <div className="flex flex-col items-center justify-center bg-gray-50 p-8 sm:p-10 md:p-12">
          <div className="bg-white shadow-md rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6">
            <Image
              src="/logo.png"
              alt="ManaskaAI Logo"
              width={64}
              height={64}
              priority
              className="object-contain"
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

        {/* Right section */}
        <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-gray-900 tracking-tight text-center md:text-left">
            Create your account
          </h2>
          <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base text-center md:text-left">
            Join ManaskaAI to start mapping your ideas
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Full name */}
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-xs sm:text-sm text-gray-600 font-medium mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="h-11 sm:h-12 border border-gray-300 rounded-lg px-3 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col">
              <label
                htmlFor="username"
                className="text-xs sm:text-sm text-gray-600 font-medium mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className="h-11 sm:h-12 border border-gray-300 rounded-lg px-3 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-xs sm:text-sm text-gray-600 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="h-11 sm:h-12 border border-gray-300 rounded-lg px-3 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-xs sm:text-sm text-gray-600 font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="h-11 sm:h-12 border border-gray-300 rounded-lg px-3 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Confirm password */}
            <div className="flex flex-col">
              <label
                htmlFor="confirmPassword"
                className="text-xs sm:text-sm text-gray-600 font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-11 sm:h-12 border border-gray-300 rounded-lg px-3 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Checkbox */}
            <label className="flex items-start sm:items-center space-x-2 text-xs sm:text-sm text-gray-600 mt-2 leading-snug">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-0.5"
              />
              <span>
                I agree to the{" "}
                <a
                  href="#"
                  className="text-gray-900 font-medium hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-gray-900 font-medium hover:underline"
                >
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full h-11 sm:h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm sm:text-base font-medium transition mt-2"
            >
              Create account
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 sm:my-6 flex items-center justify-center">
            <span className="text-gray-400 text-xs sm:text-sm">
              Or sign up with
            </span>
          </div>

          {/* Social buttons */}
          <div className="space-y-2 sm:space-y-3">
            <button className="w-full flex items-center justify-center h-11 sm:h-12 border border-gray-300 rounded-lg hover:bg-gray-100 text-xs sm:text-sm font-medium transition">
              <FcGoogle size={18} className="mr-2" />
              Sign up with Google
            </button>
            <button className="w-full flex items-center justify-center h-11 sm:h-12 border border-gray-300 rounded-lg hover:bg-gray-100 text-xs sm:text-sm font-medium transition">
              <FaGithub size={18} className="mr-2" />
              Sign up with GitHub
            </button>
          </div>

          {/* Login link */}
          <div className="text-center text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-gray-900 font-medium hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
