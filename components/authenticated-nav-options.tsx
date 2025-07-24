"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, UserIcon } from "lucide-react";
import { logout } from "@/actions/auth";
import { redirect } from "next/navigation";

export default function AuthenticatedNavOptions({ user }: { user: { name: string; email: string; avatar: string } }) {
console.log(user)

  const handleLogout = async () => {
    await logout();
    redirect('/auth/signin')
  };
    return (
        <>
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" asChild className="mr-2">
                        <Link href="/auth/profile">
                            <UserIcon className="w-4 h-4" />
                        </Link>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="min-w-[12rem]"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="rounded-lg">{user.name.split(" ")[0][0]}{user.name.split(" ")[1][0]}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href="/auth/profile">
                                <UserIcon />
                                Account
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        <LogOut />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}