import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function NavBar() {
  return (
    <header className="shadow">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between p-3 font-medium">
        <a href="/">New meeting</a>
        <SignedIn>
          <div className="flex items-center gap-5">
            <Link href="/meetings">My meetings</Link>
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}
