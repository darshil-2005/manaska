import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import SignInGoogle from "@/components/signin-google";
import SignInGitHub from "@/components/signin-github";

export default function Social() {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 h-11 sm:h-12"
        asChild
      >
        <SignInGoogle>
          <FcGoogle size={20} />
          Continue with Google
        </SignInGoogle>
      </Button>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 h-11 sm:h-12"
        asChild
      >
        <SignInGitHub>
          <FaGithub size={18} />
          Continue with GitHub
        </SignInGitHub>
      </Button>
    </div>
  );
}
