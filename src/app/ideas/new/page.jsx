"use client";

import React from "react";
import {
  Info,
  FileText,
  LayoutTemplate,
  Link as LinkIcon,
  Send,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AddNewIdeaPage() {
  const { data: session, isPending } = authClient.useSession();
  // console.log("Session data:", session.user.id);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const rawTags = form.get("tags") || "";
    const tagsArray = rawTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const apiPayload = {
      project: {
        title: form.get("title"), // form.get looks at the name="title" attribute!
        tagline: form.get("shortDescription"),
        badges: tagsArray.slice(0, 2).map((tag) => tag.toUpperCase()),
        cover_image:
          form.get("coverImage") ||
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800",
        author: {
          name: session?.user?.name || "Anonymous",
          id: session?.user?.id || "anonymous",
          role: "Idea Creator",
          avatar: session?.user?.image || "https://i.pravatar.cc/150?u=default",
          joined_at: new Date().toISOString(),
        },
      },
      deep_dive: {
        problem: form.get("problem"),
        solution: form.get("solution"),
        target_audience: form.get("targetAudience"),
        budget_range: form.get("budget"),
        detailed_description: form.get("details"),
      },
      metadata: {
        status: "Validation",
        category: form.get("category"),
        tags: tagsArray,
        engagement: {
          likes: 0,
          bookmarks: 0,
        },
      },
      discussion_summary: [],
      createdAt: new Date().toISOString(),
    };

    try {
      // 5. Send the perfectly formatted payload to your Express backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      if (response.ok) {
        toast.success("Idea submitted successfully!");
        e.target.reset(); 
      } else {
        toast.error("Failed to submit idea.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while submitting.");
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0a] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Add New Idea
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Detail your vision below to share with the community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-blue-700 dark:text-blue-500">
              <Info className="w-5 h-5" />
              <h2 className="text-lg font-bold">Basic Information</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5">
                  Idea Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Enter a catchy title for your idea"
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select category...</option>
                    <option value="B2B SaaS / Media">B2B SaaS / Media</option>
                    <option value="B2B SaaS / EdTech">B2B SaaS / EdTech</option>
                    <option value="Cleantech / AI">Cleantech / AI</option>
                    <option value="Health / Wearables">
                      Health / Wearables
                    </option>
                    <option value="Logistics / Mobility">
                      Logistics / Mobility
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5">
                    Estimated Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      $
                    </span>
                    <input
                      type="text"
                      name="budget"
                      placeholder="e.g. 50,000 - 100,000"
                      className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  A one-sentence pitch summarizing the core value.
                </p>
                <input
                  type="text"
                  name="shortDescription"
                  required
                  placeholder="Briefly describe what your idea does..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-blue-700 dark:text-blue-500">
              <FileText className="w-5 h-5" />
              <h2 className="text-lg font-bold">Deep Dive</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5">
                  Problem Statement
                </label>
                <textarea
                  name="problem"
                  rows={4}
                  placeholder="What specific problem are you solving?"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5">
                  Proposed Solution
                </label>
                <textarea
                  name="solution"
                  rows={4}
                  placeholder="How does your idea solve this problem?"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  name="details"
                  rows={5}
                  placeholder="Provide any additional context, technical details, or long-term vision..."
                  className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-blue-700 dark:text-blue-500">
              <LayoutTemplate className="w-5 h-5" />
              <h2 className="text-lg font-bold">Metadata & Assets</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    name="targetAudience"
                    placeholder="e.g. Students, Small Businesses"
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="Comma separated (e.g. Analytics, SaaS)"
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1.5">
                  Cover Image URL
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      name="coverImage"
                      placeholder="https://example.com/image.jpg"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:px-8 sm:py-5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              By submitting, you agree to the{" "}
              <Link
                href="/guidelines"
                className="text-blue-600 hover:underline"
              >
                Guidelines
              </Link>
              .
            </p>
            <div className="flex w-full sm:w-auto gap-3">
              <button
                type="submit"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" /> Submit Your Vision
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
