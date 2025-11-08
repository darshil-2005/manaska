"use client"

import React, { useState } from "react"
import Link from "next/link"
import axios from "axios"

import AuthLeftPanel from "@/components/LeftPanel"
import AuthSocial from "@/components/Social"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("/api/auth/register", {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: formData.agree,
      })

      console.log("Response:", response.data)
    } catch (error) {
      console.error("Registration error:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 font-inter px-4 sm:px-6 py-6">
      <div className="w-full max-w-5xl bg-background shadow-lg rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Panel */}
        <AuthLeftPanel />

        {/* Right Panel */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center md:text-left p-0 mb-6">
              <CardTitle className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Create your account
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Join ManaskaAI to start mapping your ideas
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start sm:items-center space-x-2 text-sm mt-3">
                  <Checkbox
                    id="agree"
                    name="agree"
                    checked={formData.agree}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agree: checked }))
                    }
                  />
                  <Label
                    htmlFor="agree"
                    className="text-muted-foreground leading-snug"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-primary font-medium hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-primary font-medium hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <Button type="submit" className="w-full mt-4">
                  Create account
                </Button>
              </form>

              <div className="my-6">
                <AuthSocial />
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Log in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}