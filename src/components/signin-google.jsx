
"use client"

import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import {Button} from "../components/ui/button.tsx"
 
export default function SignInGoogle() {
  return (
    <Button 
      onClick={() => signIn("google")}
      className="w-full"
    >
      <FcGoogle size={18} className="mr-2" />
      Continue with Google
    </Button>
  )
}
