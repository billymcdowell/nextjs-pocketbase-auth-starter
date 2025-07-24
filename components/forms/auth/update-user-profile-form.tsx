'use client'

import { updateProfile } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState, useEffect } from "react";
import { redirect } from "next/navigation";

const initialState = {
    success: false,
    error: '',
    message: ''
}

export default function UpdateUserProfileForm({ user }: { user: { success: boolean; data?: { id: string; name: string; email: string }; error?: string } }) {
    const [state, formAction, isPending] = useActionState(updateProfile, initialState)
    const [name, setName] = useState(user.data?.name || "");
    const [email, setEmail] = useState(user.data?.email || "");
    useEffect(() => {
        setName(user.data?.name || "");
        setEmail(user.data?.email || "");
    }, [user]);
    if (!user.data) {
        return <div className="text-red-600">No user data found.</div>;
    }

    if (state.success) {
        redirect('/auth/profile')
    }

    if (state.error) {
        console.log(state.error)
    }

    return (
        <form action={formAction}>
            <div className="space-y-8">
                <Input id="userId" type="hidden" value={user.data.id} name="userId" />
                {/* Profile section */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Changes"}</Button>
                </div>
            </div>
        </form>
    );
}
