"use client"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { Loader2 } from "lucide-react"
import {Button} from "../components/ui/button.tsx"
 
export default function SignInGoogle({ onSocialClick, isGoogleLoading, isAnyLoading }) {
 
  const handleGoogleClick = () => {
    onSocialClick('google');
    signIn("google");
  };


  return (
    <Button
      onClick={handleGoogleClick}
      className="w-full"
      disabled={isAnyLoading}
    >
      {/* isGoogleLoading for the spinner/text */}
      {isGoogleLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting...
        </>
      ) : (
        <>
          <FcGoogle size={18} className="mr-2" />
          Continue with Google
        </>
      )}
    </Button>
  )
}
