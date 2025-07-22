"use client";

import React from "react";
import Link from "next/link";
import { isAuthenticated as isAuthenticatedAction, logout } from "@/actions/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "./ui/button";
import { useAuth } from "@/components/AuthProvider";
import { LogOutIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated, refreshAuth } = useAuth();

  const handleLogout = async () => {
    await logout();
    refreshAuth();
    redirect('/auth/signin')
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b bg-background">
      <Link href="/" className="text-xl font-bold">
        Nextjs Pocketbase Auth Starter
      </Link>
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <Button
            onClick={() => handleLogout()}
            variant="outline"
            size="icon"
          >
            <LogOutIcon className="w-4 h-4" />
          </Button>
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