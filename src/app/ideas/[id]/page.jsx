"use client";

import React, { useState, useEffect, use } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Users,
  Wallet,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast"; 
import { authClient } from "@/lib/auth-client"; 

// --- COMMENTS & INTERACTIONS---
function formatTimeAgo(dateString) {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (isNaN(date.getTime())) return "Just now";

  if (seconds > 7 * 86400) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  const intervals = {
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [key, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      if (key === "day") {
        if (count === 1) return "Yesterday";
        return `${count} days ago`;
      }
      return `${count} ${key}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}
//  ---

export default function IdeaDetailsPage({ params }) {

  const Params = use(params);
  const id = Params.id;


  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;


  const [idea, setIdea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- COMMENTS & INTERACTIONS  ---
  const [newComment, setNewComment] = useState("");
  // ------


  useEffect(() => {
    async function fetchIdea() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas/${id}`,{
          credentials: "include",
        });
        const data = await res.json();
        setIdea(data);
        setBookmarks(data?.bookmarks || []);
      } catch (error) {
        console.error("Error fetching idea:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) {
      fetchIdea();
    }
  }, [id]);

  const isBookmarked = currentUserId ? bookmarks.includes(currentUserId) : false;

  const handleBookmarkToggle = async () => {
    if (!currentUserId) {
      toast.error("Please log in to bookmark ideas!");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const updatedBookmarks = isBookmarked
      ? bookmarks.filter((userId) => userId !== currentUserId)
      : [...bookmarks, currentUserId];

    setBookmarks(updatedBookmarks);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ideas/${idea._id}/bookmark`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success(isBookmarked ? "Removed bookmark" : "Bookmarked idea!");
      } else {
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

  // --- COMMENTS & INTERACTIONS  ---
  const handlePostComment = async () => {
    if (!currentUserId) {
      toast.error("Please log in to post comments!");
      return;
    }
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ideas/${idea._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken ?? session?.token ?? ""}`,
          },
          body: JSON.stringify({ comment: newComment }),
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();

        setIdea((prev) => ({
          ...prev,
          discussion_summary: [ data.comment, ...(prev.discussion_summary || [])],
        }));
        setNewComment("");
        toast.success("Comment posted!");
      } else {
        toast.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Post comment error:", error);
      toast.error("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // -----

  const getBadgeColor = (badgeText) => {
    const text = badgeText?.toUpperCase() || "";
    if (text.includes("AI") || text.includes("EDTECH"))
      return "bg-green-100 text-green-700";
    if (text.includes("HEALTH")) return "bg-orange-100 text-orange-700";
    if (text.includes("FINTECH") || text.includes("SAAS"))
      return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };


  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Idea...</div>;
  }


  if (!idea) {
    return <div className="min-h-screen flex items-center justify-center">Idea not found.</div>;
  }

  const { project, metadata, deep_dive } = idea;
  const primaryBadge = project?.badges?.[0];
  const secondBadge = project?.badges?.[1];
  const coverimg = project?.cover_image;

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white dark:bg-[#0a0a0a] min-h-screen">
      <Image
        className="w-full h-48 md:h-72 lg:h-80 rounded-2xl md:rounded-3xl bg-gray-200 mb-8 md:mb-12 bg-cover bg-center shadow-sm border border-gray-100 dark:border-gray-800"
        src={coverimg || "https://placehold.co/1280x320/e2e8f0/1e293b?text=Cover+Image"}
        height={320}
        width={1280}
        alt={project?.title || "Idea Cover Image"}
      />

      <div className="mb-10">
        <div className="flex gap-2 mb-4">
          {primaryBadge && (
            <span
              className={`text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider ${getBadgeColor(primaryBadge)}`}
            >
              {primaryBadge}
            </span>
          )}
          {secondBadge && (
            <span
              className={`text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider ${getBadgeColor(secondBadge)}`}
            >
              {secondBadge}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">
          {project?.title || "Untitled Idea"}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed mb-8">
          {project?.tagline || "No tagline provided."}
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={project?.author?.avatar || "https://i.pravatar.cc/150?u=default"}
              height={40}
              width={40}
              alt={project?.author?.name || "Author Avatar"}
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700"
            />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {project?.author?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {project?.author?.role} •{" "}
                {project?.author?.joined_at ? new Date(project.author.joined_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Unknown Date"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                The Problem
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {deep_dive?.problem || "No problem description provided."}
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                The Solution
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              {deep_dive?.solution || "No solution description provided."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Target Audience
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {deep_dive?.target_audience || "No audience information provided."}
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Budget Required
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {deep_dive?.budget_range || "No budget information provided."}
              </p>
            </div>
          </div>

          <hr className="my-10 border-gray-200 dark:border-gray-800" />

          <div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">
              Discussion ({idea?.discussion_summary?.length || 0})
            </h3>

            <div className="flex gap-4 mb-8">
              {/* COMMENTING SYSTEM INTEGRATION: Updated to show user avatar or fallback */}
              <img
                src={session?.user?.image || "https://i.pravatar.cc/150?img=47"}
                alt="You"
                className="w-10 h-10 rounded-full border border-gray-200 hidden sm:block"
              />
              <div className="flex-1 flex flex-col items-end gap-3">
                <textarea
                  placeholder="Add a comment or feedback..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-[#f8fafc] dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
                ></textarea>
                <button
                  onClick={handlePostComment}
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {idea?.discussion_summary?.map((comment, index) => (
                <div
                  key={index}
                  className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex gap-4"
                >
                  {/* COMMENTING SYSTEM INTEGRATION: Uses actual avatar from comment if available */}
                  <img
                    src={comment.avatar || `https://i.pravatar.cc/150?u=${comment.user}`}
                    alt={comment.user}
                    className="w-10 h-10 rounded-full border border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-sm text-gray-900 dark:text-white mr-2">
                          {comment.user || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {comment.time_ago || formatTimeAgo(comment.createdAt) || "Just now"}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                      {comment.comment || "No comment text provided."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Status
            </h4>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-base font-bold text-gray-900 dark:text-white">
                {metadata?.status || "Unknown"} Phase
              </span>
            </div>
          </div>

          <div className="p-5 bg-[#f8fafc] dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <div className="mb-5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Category
              </h4>
              <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {metadata?.category || "Uncategorized"}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {metadata?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 bg-[#f8fafc] dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Active Collaborators
            </h4>
            <div className="flex -space-x-2">
              <Image
                src={project?.author?.avatar || "https://i.pravatar.cc/150?u=default"}
                height={40}
                width={40}
                alt={project?.author?.name || "Author Avatar"}
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}