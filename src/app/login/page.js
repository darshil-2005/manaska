"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

import AuthLeftPanel from "../../components/AuthLeftPanel";
import AuthInput from "../../components/AuthInput";
import AuthCheckbox from "../../components/AuthCheckbox";
import AuthButton from "../../components/AuthButton";
import AuthSocial from "../../components/AuthSocial";

export default function Page() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log("Response: ", response);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 font-inter px-4 sm:px-6">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Section */}
        <AuthLeftPanel />

        {/* Right Section */}
        <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-gray-900 tracking-tight text-center md:text-left">
            Welcome back
          </h2>
          <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base text-center md:text-left">
            Log in to continue to ManaskaAI
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <AuthInput
              id="email"
              label="Email or username"
              placeholder="Enter your email or username"
              value={formData.email}
              onChange={handleChange}
            />
            <AuthInput
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
              <AuthCheckbox
                name="remember"
                label="Remember me"
                checked={formData.remember}
                onChange={handleChange}
              />
              <Link
              href="/forgotPassword"
              className="text-gray-500 hover:underline text-xs sm:text-sm">
                Forgot password?
              </Link>

            </div>

            {/* Changed to children-based AuthButton */}
            <AuthButton>Log in</AuthButton>
          </form>

          <AuthSocial />

          <div className="text-center text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-gray-900 font-medium hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
