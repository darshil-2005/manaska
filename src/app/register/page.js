"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

import AuthLeftPanel from "../../components/AuthLeftPanel";
import AuthInput from "../../components/AuthInput";
import AuthCheckbox from "../../components/AuthCheckbox";
import AuthButton from "../../components/AuthButton";
import AuthSocial from "../../components/AuthSocial";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        email: formData.email,
        username: formData.username,
        name: formData.name,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: formData.agree,
      });

      console.log("Response:", response);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter px-4 sm:px-6 py-6">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Left Panel */}
        <AuthLeftPanel />

        {/* Right Panel */}
        <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-gray-900 tracking-tight text-center md:text-left">
            Create your account
          </h2>
          <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base text-center md:text-left">
            Join ManaskaAI to start mapping your ideas
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <AuthInput
              id="name"
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
            <AuthInput
              id="username"
              label="Username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
            <AuthInput
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            <AuthInput
              id="password"
              label="Password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            <AuthInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {/* Terms and Conditions */}
            <div className="flex items-start sm:items-center space-x-2 text-xs sm:text-sm text-gray-600 mt-1 leading-snug">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-0.5"
              />
              <span>
                I agree to the{" "}
                <a href="#" className="text-gray-900 font-medium hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-gray-900 font-medium hover:underline">
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* ✅ Changed here — use children instead of text prop */}
            <AuthButton>Create account</AuthButton>
          </form>

          <AuthSocial />

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
