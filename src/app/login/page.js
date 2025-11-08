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

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
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
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      })
      console.log("Response:", response.data)
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 font-inter px-4 sm:px-6">
      <div className="w-full max-w-5xl bg-background shadow-lg rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Section */}
        <AuthLeftPanel />

        {/* Right Section */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center md:text-left p-0 mb-6">
              <CardTitle className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Welcome back
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Log in to continue to ManaskaAI
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email or username</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter your email or username"
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      name="remember"
                      checked={formData.remember}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, remember: checked }))
                      }
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/forgotPassword"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full mt-4">
                  Log in
                </Button>
              </form>

              <div className="my-6">
                <AuthSocial />
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Don’t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary hover:underline"
                >
                  Create account
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}