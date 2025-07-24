"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ProfileUpdateFormProps {
  user: {
    name?: string;
    email?: string;
    avatar?: string;
    [key: string]: unknown;
  };
  onSuccess?: () => void;
}

export default function ProfileUpdateForm({ user, onSuccess }: ProfileUpdateFormProps) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    avatar: user.avatar || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function updateProfileAction(formData: FormData) {
    setSaving(true);
    setError("");
    try {
      // Call the server action
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
      } else {
        if (onSuccess) onSuccess();
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={updateProfileAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="avatar">Avatar URL</Label>
        <Input
          id="avatar"
          name="avatar"
          value={form.avatar}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" disabled={saving} className="w-full">
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
} 