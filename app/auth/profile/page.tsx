import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/actions/auth";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, MailIcon, PencilIcon, UserIcon } from "lucide-react";


export default async function ProfilePage() {
  const user = await getCurrentUser();
  const userData = user?.data || {};
  const userName = (userData.name || "").split(" ");
  const avatar = userData.avatar || "";
  const email = userData.email || "";
  const updated = userData.updated || "";
  return (
    <div className="container max-w-2xl mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-10">
      <div className="flex justify-between items-center mb-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your profile information and settings. </p>
        </div>
        <Button variant="outline"><Link href="/auth/profile/edit" className="flex items-center gap-2"><PencilIcon className="w-4 h-4 mr-2" />Edit Profile</Link></Button>
      </div>
      <Card className="flex flex-col gap-12 w-full">
        <CardContent className="flex items-center gap-12">
          <Avatar className="size-32">
            {avatar ? (
              <AvatarImage src={avatar} alt={userName.join(" ") || email || "Avatar"} className="object-cover" />
            ) : (
              <AvatarFallback className="text-4xl text-muted-foreground">{userName[0]?.[0] || "U"}{userName[1]?.[0] || ""}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 mr-2" />
              <div>
                <p className="text-muted-foreground text-sm">Name</p>
                <div className="text-2xl font-bold">{userData.name || "Unknown"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="w-4 h-4 mr-2" />
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <div className="text-muted-foreground">{email || "Unknown"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <div>
                <p className="text-muted-foreground text-sm">Last updated</p>
                <div className="text-muted-foreground">{updated ? updated.split("T")[0] : "Unknown"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
