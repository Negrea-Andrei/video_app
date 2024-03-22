import { ClerkLoaded, ClerkLoading, SignInButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function MeetingLoginPage() {
  return (
    <div className="mx-auto w-fit space-y-3">
      <h1 className="text-center text-2xl font-bold">Join meeting</h1>
      <ClerkLoaded>
        <SignInButton>
          <button className="flex w-44 items-center justify-center gap-2 rounded-full bg-blue-500 px-3 py-2 font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-600 disabled:bg-gray-200">
            Sign in
          </button>
        </SignInButton>
        <Link
          href="?guest=true"
          className="flex w-44 items-center justify-center gap-2 rounded-full bg-gray-400 px-3 py-2 font-semibold text-white transition-colors hover:bg-gray-500 active:bg-blue-600 disabled:bg-gray-200"
        >
          Continue as guest
        </Link>
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="mx-auto animate-spin" />
      </ClerkLoading>
    </div>
  );
}
