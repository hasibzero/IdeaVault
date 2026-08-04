"use client";
import React, { useEffect, useState } from "react";
import { Plus, Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";
import IdeaCard from "@/components/IdeaCard"; // Adjust path if needed
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function MyIdeasDashboard() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getIdeas() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setIdeas(data);
        }
      } catch (error) {
        console.error("Failed to fetch ideas:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getIdeas();
  }, []);
  const currentUserId = session?.user?.id;

  const myIdeas = ideas.filter(
    (idea) => idea?.project?.author?.id === currentUserId,
  );

  if (isSessionPending || isLoading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-6 py-12 bg-white dark:bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm font-medium">
          Loading your ideas...
        </div>
      </main>
    );
  }
  return (
    <main className="w-full max-w-7xl mx-auto px-6 py-12 bg-white dark:bg-[#0a0a0a] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a1930] dark:text-white tracking-tight">
            My Ideas Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mt-1">
            Manage and refine your private vault of concepts.
          </p>
        </div>

        <Link href="/ideas/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-5 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> New Idea
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
              Total Ideas
            </p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {myIdeas.length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Lightbulb className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myIdeas.map((idea, index) => (
          <div
            key={index}
            className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 ">
                <div className="flex gap-2 mb-4">
                  {idea?.project?.badges?.[0] && (
                    <span className="px-3 py-1.5 bg-blue-100/70 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-medium">
                      {idea.project.badges[0]}
                    </span>
                  )}

                  {idea?.project?.badges?.[1] && (
                    <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium uppercase tracking-wider">
                      {idea.project.badges[1]}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-[#0a1930] dark:text-white mb-3 tracking-tight">
                {idea.project.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                {idea.project.tagline}
              </p>
            </div>

            <div>
              {/* <hr className="border-gray-100 dark:border-gray-800 mb-4" /> */}

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                  Submitted at {new Date(idea?.createdAt).toLocaleDateString()}
                </span>

                <div className="flex -space-x-2">
                  {idea?.project.author?.avatar ? (
                    <img
                      src={idea?.project.author.avatar}
                      alt={idea?.project.author.name}
                      className="w-8 h-8 rounded-full ring-2 ring-white object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                      {idea?.project.author.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              <Link
                href={`/ideas/${idea._id || "#"}`}
                className="text-sm font-semibold dark:text-blue-400 text-blue-600 dark:hover:text-white hover:text-blue-800 flex items-center transition-colors border-t-1 border-gray-100 dark:border-gray-800 pt-4 mt-4"
              >
                View Details <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        ))}

        <Link
          href="/ideas/new"
          className="border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            Draft New Idea
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px]">
            Capture your next big spark.
          </p>
        </Link>
      </div>
    </main>
  );
}
