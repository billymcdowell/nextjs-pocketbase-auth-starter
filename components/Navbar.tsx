import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "./ui/button";
import { getCurrentUser } from "@/actions/auth";
import AuthenticatedNavOptions from "./authenticated-nav-options";  

export default async function Navbar() {

  const user = await getCurrentUser();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b bg-background">
      <Link href="/" className="text-xl font-bold">
        Nextjs Pocketbase Auth Starter
      </Link>
      <div className="flex items-center gap-2">
        {user.success ? (
          <>
           <AuthenticatedNavOptions user={{
             name: user.data?.name,
             email: user.data?.email,
             avatar: user.data?.avatar || ""
           }} />
          </>
        ) : (
          <Button asChild>
            <Link
              href="/auth/signin"
            >
              Login
            </Link>
          </Button>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
} 