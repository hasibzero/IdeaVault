"use client";

import React, { useState } from "react";
import { Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client"; // Adjust path if needed

const getBadgeColor = (badgeText) => {
  const text = badgeText?.toUpperCase() || "";
  if (text.includes("AI") || text.includes("EDTECH"))
    return "bg-green-100 text-green-700";
  if (text.includes("HEALTH")) return "bg-orange-100 text-orange-700";
  if (text.includes("FINTECH") || text.includes("SAAS"))
    return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
};

export default function IdeaCard({ idea }) {
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const project = idea?.project || {};
  const metadata = idea?.metadata || {};

  const title = project?.title || idea?.title || "Untitled Idea";
  const tagline =
    project?.tagline ||
    idea?.tagline ||
    idea?.shortDescription ||
    idea?.description ||
    "";
  const badges = project?.badges || idea?.badges || [];
  const primaryBadge = badges[0] || "GENERAL";
  const tags = metadata?.tags || idea?.tags || [];
  const author = project?.author || idea?.author || {};

  const [bookmarks, setBookmarks] = useState(idea?.bookmarks || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBookmarked = currentUserId
    ? bookmarks.includes(currentUserId)
    : false;

  const handleBookmarkToggle = async () => {
    if (!currentUserId) {
      toast.error("Please log in to bookmark ideas!");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const updatedBookmarks = isBookmarked
      ? bookmarks.filter((id) => id !== currentUserId)
      : [...bookmarks, currentUserId];

    setBookmarks(updatedBookmarks);

    try {
      // Get JWT access token from better-auth jwtClient plugin
      let token = "";
      try {
        const result = await authClient.token();
        token = result?.data?.token || "";
      } catch {}

      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/+$/, "");

      const response = await fetch(
        `${baseUrl}/ideas/${idea._id}/bookmark`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ userId: currentUserId }),
          credentials: "include",
        },
      );

      if (response.ok) {
        toast.success(isBookmarked ? "Removed bookmark" : "Bookmarked idea!");
      } else {
        const text = await response.text().catch(() => null);
        console.error("Bookmark failed:", response.status, text);
        setBookmarks(bookmarks);
        toast.error("Failed to update bookmark.");
      }
    } catch (error) {
      setBookmarks(bookmarks);
      console.error("Bookmark error:", error);
      toast.error("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span
          className={`text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider ${getBadgeColor(
            primaryBadge,
          )}`}
        >
          {primaryBadge}
        </span>

        <button
          onClick={handleBookmarkToggle}
          disabled={isSubmitting}
          className="text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
          title={isBookmarked ? "Remove Bookmark" : "Bookmark Idea"}
        >
          <Bookmark
            className={`w-5 h-5 transition-colors ${
              isBookmarked
                ? "fill-blue-600 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          />
        </button>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">
        {title}
      </h3>
      <p className="text-sm dark:text-gray-200 mb-5 line-clamp-3 leading-relaxed">
        {tagline}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags?.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400 px-2.5 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div className="flex -space-x-2">
          {author?.avatar ? (
            <img
              key={author.avatar}
              src={
                author.avatar.startsWith("data:") || author.avatar.startsWith("blob:")
                  ? author.avatar
                  : `${author.avatar}${author.avatar.includes("?") ? "&" : "?"}nocache=1`
              }
              alt={author?.name || "Author"}
              className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-gray-900">
              {author?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>

        <Link
          href={`/ideas/${idea._id || "#"}`}
          className="text-sm font-semibold dark:text-blue-400 text-blue-600 dark:hover:text-white hover:text-blue-800 flex items-center transition-colors"
        >
          View Details <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
