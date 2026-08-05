"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Mail,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const profileLinks = [
  { label: "My Ideas", href: "/my-ideas", icon: BookOpen },
  { label: "My Bookmarks", href: "/my-bookmarks", icon: Bookmark },
  { label: "Add New Idea", href: "/ideas/new", icon: ArrowRight },
];

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (isSaving) return;

    const nextName = name.trim();
    const nextImage = image.trim();

    if (!nextName) {
      toast.error("Name is required.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await authClient.updateUser({
        name: nextName,
        image: nextImage || null,
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully.");
      setIsEditOpen(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] dark:bg-[#0a0a0a] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 p-8 shadow-sm backdrop-blur">
          <div className="animate-pulse space-y-6">
            <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-8 w-56 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-80 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="h-28 rounded-2xl bg-gray-200 dark:bg-gray-800" />
              <div className="h-28 rounded-2xl bg-gray-200 dark:bg-gray-800" />
              <div className="h-28 rounded-2xl bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] dark:bg-[#0a0a0a] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 text-center shadow-sm">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0a1930] dark:text-white">
            Profile not available
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            You need to sign in before you can view your profile, ideas, and bookmarks.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/login">
              <Button className="w-full rounded-xl bg-blue-600 px-6 py-5 text-white hover:bg-blue-700 sm:w-auto">
                Go to Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                className="w-full rounded-xl border-gray-300 px-6 py-5 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900 sm:w-auto"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const user = session.user;
  const displayName = user?.name || "Anonymous User";
  const initial = displayName?.charAt(0)?.toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_30%),linear-gradient(to_bottom,#f8fafc,#ffffff)] dark:bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.20),transparent_28%),linear-gradient(to_bottom,#0a0a0a,#111827)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur dark:border-gray-800 dark:bg-gray-950">
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-r from-blue-50 via-cyan-50 to-indigo-50 dark:from-blue-950/70 dark:via-cyan-950/60 dark:to-indigo-950/70" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg ring-2 ring-blue-100">
                  <AvatarImage src={user?.image} alt={displayName} />
                  <AvatarFallback className="bg-blue-600 text-2xl font-bold text-white">
                    {initial}
                  </AvatarFallback>
                </Avatar>

                <div className="pt-2 sm:pt-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-400">
                    Profile
                  </p>
                  <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#081326] dark:text-white sm:text-4xl">
                    {displayName}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                    Manage your account, review your saved ideas, and jump back into the vault.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[#081326] dark:text-white">Account Details</h2>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-gray-300 px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                onClick={() => setIsEditOpen(true)}
              >
                Edit Details
              </Button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:col-span-2 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  Profile Image
                </div>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-white shadow-sm dark:border-gray-800">
                      <AvatarImage src={user?.image} alt={displayName} />
                      <AvatarFallback className="bg-blue-600 text-lg font-bold text-white">
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{displayName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Use Edit Details to update your image.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  Name
                </div>
                <p className="mt-3 text-base font-semibold text-gray-900 dark:text-white">{displayName}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="mt-3 break-all text-base font-semibold text-gray-900 dark:text-white">
                  {user?.email || "No email provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-lg font-bold text-[#081326] dark:text-white">Quick Actions</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Jump straight back to the parts of the app you use most.
            </p>

            <div className="mt-6 space-y-3">
              {profileLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{link.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Open this section</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#081326] dark:text-white">Edit Profile</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Only your name and profile image can be changed.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSaveProfile}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder="Your display name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Profile Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Paste a direct image URL here.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-gray-300 px-5 py-5 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-5 text-white hover:bg-blue-700"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
