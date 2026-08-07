"use client";

import React, { useEffect, useState } from "react";
import { BookmarkMinus, Loader2, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Link from "next/link";

// --- COMMENTS & INTERACTIONS ---
//  time formatter 
function formatTimeAgo(dateString) {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (isNaN(date.getTime())) return "Just now";

  // If older than 7 days, format as "Month Day, Year"
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
// --- end time set ---

export default function MyInteractions() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const [bookmarks, setBookmarks] = useState(null);
  const [comments, setComments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("comments"); // Tabs state: "comments" or "bookmarks"

  // Pagination for comments initially shows 3 comments)
  const [visibleComments, setVisibleComments] = useState(3);

  // Inline comment edit state
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  // Helper: get JWT access token from better-auth jwtClient plugin
  const getToken = async () => {
    try {
      const result = await authClient.token();
      return result?.data?.token || "";
    } catch {
      return "";
    }
  };

  // --- COMMENTS & INTERACTIONS ---
  // Fetch bookmarked ideas and comments on load
  useEffect(() => {
    async function fetchInteractions() {
      setIsLoading(true);
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/+$/, "");

      try {
        const token = await authClient.token().then(r => r?.data?.token || "").catch(() => "");

        const res = await fetch(
          `${baseUrl}/ideas/interactions/my`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          console.error("Interactions fetch failed:", res.status, await res.text().catch(() => ""));
          return;
        }

        const data = await res.json();
        setBookmarks(data?.bookmarks || []);
        setComments(data?.comments || []);
      } catch (error) {
        console.error("Failed to fetch interactions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isSessionPending) {
      if (currentUserId) {
        fetchInteractions();
      } else {
        setIsLoading(false);
      }
    }
  }, [currentUserId, isSessionPending]);


  // Remove a bookmarked idea
  const handleRemoveBookmark = async (ideaId) => {
    try {
      const token = await getToken();
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/+$/, "");

      const response = await fetch(
        `${baseUrl}/ideas/${ideaId}/bookmark`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ userId: currentUserId }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setBookmarks((prev) => prev.filter((item) => item._id !== ideaId));
        toast.success("Removed from bookmarks");
      } else {
        toast.error("Failed to remove bookmark");
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("An error occurred");
    }
  };

  // Open edit inputs inline
  const handleEditClick = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditText(comment.comment);
  };

  const handleSaveEdit = async (ideaId, commentId) => {
    if (!editText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const token = await getToken();
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/+$/, "");

      const response = await fetch(
        `${baseUrl}/ideas/${ideaId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ comment: editText }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setComments((prev) =>
          prev.map((c) =>
            c.commentId === commentId ? { ...c, comment: editText } : c
          )
        );
        setEditingCommentId(null);
        toast.success("Comment updated successfully");
      } else {
        toast.error("Failed to update comment");
      }
    } catch (error) {
      console.error("Error saving comment edit:", error);
      toast.error("An error occurred");
    }
  };

  // Delete comment 
  const handleDeleteComment = async (ideaId, commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const token = await getToken();
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/+$/, "");

      const response = await fetch(
        `${baseUrl}/ideas/${ideaId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setComments((prev) => prev.filter((c) => c.commentId !== commentId));
        toast.success("Comment deleted successfully");
      } else {
        toast.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("An error occurred");
    }
  };
  //  ---

  if (isSessionPending || isLoading || bookmarks === null || comments === null) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-24 min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Please Log In</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          You need to sign in to view your comments and bookmarked ideas.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 bg-white dark:bg-[#0a0a0a] min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[36px] font-extrabold text-[#081326] dark:text-white tracking-tight mb-3">
          My Interactions
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-[16px] max-w-2xl leading-relaxed">
          Track your engagements, discussions, and saved concepts within the IdeaVault ecosystem.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8">
        <button
          onClick={() => setActiveTab("comments")}
          className={`pb-4 px-4 font-semibold text-lg border-b-2 transition-all duration-200 ${
            activeTab === "comments"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          My Comments
        </button>
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`pb-4 px-4 font-semibold text-lg border-b-2 transition-all duration-200 ${
            activeTab === "bookmarks"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Bookmarked Ideas
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "comments" ? (
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments found yet.</p>
          ) : (
            <>
              <div className="space-y-6">
                {comments.slice(0, visibleComments).map((comment) => (
                  <div
                    key={comment.commentId}
                    className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-[#f8fafc] dark:bg-gray-900 flex flex-col gap-3 shadow-sm"
                  >
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5 font-medium">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span>Commented on</span>
                      </div>
                      <span>{formatTimeAgo(comment.createdAt)}</span>
                    </div>

                    <div className="flex justify-between items-start gap-4">
                      <Link
                        href={`/ideas/${comment.ideaId}`}
                        className="text-xl font-bold text-[#081326] dark:text-white hover:text-blue-600 transition-colors leading-snug"
                      >
                        {comment.ideaTitle}
                      </Link>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <button
                          onClick={() => handleEditClick(comment)}
                          className="hover:text-blue-600 p-1 transition-colors focus:outline-none"
                          title="Edit Comment"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.ideaId, comment.commentId)}
                          className="hover:text-red-500 p-1 transition-colors focus:outline-none"
                          title="Delete Comment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {editingCommentId === comment.commentId ? (
                      <div className="flex flex-col gap-2 mt-2 w-full">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                        />
                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(comment.ideaId, comment.commentId)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-l-4 border-blue-600 bg-white dark:bg-gray-950 p-4 rounded-r-lg text-gray-700 dark:text-gray-300 italic text-[15px] leading-relaxed">
                        "{comment.comment}"
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {comments.length > visibleComments && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setVisibleComments((prev) => prev + 3)}
                    className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-[#081326] dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-sm border-solid cursor-pointer"
                  >
                    Load More Interactions
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* Bookmarked Ideas Grid */
        bookmarks.length === 0 ? (
          <p className="text-gray-500 text-sm">No bookmarks found yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookmarks.map((idea) => (
              <div
                key={idea._id}
                className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-[#f8fafc] dark:bg-gray-900 flex flex-col h-full shadow-sm"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <Link
                    href={`/ideas/${idea._id}`}
                    className="text-xl font-bold text-[#081326] dark:text-white hover:text-blue-600 transition-colors leading-snug"
                  >
                    {idea?.project?.title}
                  </Link>

                  <button
                    onClick={() => handleRemoveBookmark(idea._id)}
                    className="text-blue-600 hover:text-red-500 transition-colors mt-1 focus:outline-none"
                    aria-label="Remove Bookmark"
                    title="Remove from Bookmarks"
                  >
                    <BookmarkMinus className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed mb-8 line-clamp-3">
                  {idea?.project?.tagline}
                </p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
