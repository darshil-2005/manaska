"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
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
    console.log("Login data:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter px-4 sm:px-6">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Section */}
        <div className="flex flex-col items-center justify-center bg-gray-50 p-8 sm:p-10 md:p-12">
          <div className="bg-white shadow-md rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6">
            <img
              src="https://via.placeholder.com/64"
              alt="ManaskaAI Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
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

        {/* Right Section */}
        <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-gray-900 tracking-tight text-center md:text-left">
            Welcome back
          </h2>
          <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base text-center md:text-left">
            Log in to continue to ManaskaAI
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-xs sm:text-sm text-gray-600 font-medium mb-1"
              >
                Email or phone
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email or phone"
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="h-11 sm:h-12 border border-gray-300 rounded-lg px-3 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-gray-600 gap-2 sm:gap-0">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-gray-500 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-11 sm:h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm sm:text-base font-medium transition"
            >
              Log in
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 sm:my-6 flex items-center justify-center">
            <span className="text-gray-400 text-xs sm:text-sm">
              Or continue with
            </span>
          </div>

          {/* Social Buttons */}
          <div className="space-y-2 sm:space-y-3">
            <button className="w-full flex items-center justify-center h-11 sm:h-12 border border-gray-300 rounded-lg hover:bg-gray-100 text-xs sm:text-sm font-medium transition">
              <FcGoogle size={18} className="mr-2" />
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center h-11 sm:h-12 border border-gray-300 rounded-lg hover:bg-gray-100 text-xs sm:text-sm font-medium transition">
              <FaFacebook size={18} className="text-blue-600 mr-2" />
              Continue with Facebook
            </button>
            <button className="w-full flex items-center justify-center h-11 sm:h-12 border border-gray-300 rounded-lg hover:bg-gray-100 text-xs sm:text-sm font-medium transition">
              <FaApple size={18} className="mr-2" />
              Continue with Apple
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-gray-900 font-medium hover:underline"
            >
              Create account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}