"use client"

import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa"
import { Button } from "../components/ui/button.tsx"
 
export default function SignInGitHub() {
  return <Button onClick={() => signIn("github")} className="w-full">
    <FaGithub size={18} className="mr-2" />
    Continue with GitHub
  </Button>
}
