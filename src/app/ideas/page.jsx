"use client";

import React, { useEffect, useState } from "react";
import { Filter, Search } from "lucide-react";
import IdeaCard from "@/components/IdeaCard";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";

export default function IdeasPage() {
  const searchParams = useSearchParams();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [ideas, setIdeas] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All Categories";
  const time = searchParams.get("time") || "Any Time";

  useEffect(() => {
    async function fetchData() {
      const token = session?.accessToken ?? session?.token ?? "";

      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (category && category !== "All Categories") {
        queryParams.append("category", category);
      }
      if (time && time !== "Any Time") {
        queryParams.append("time", time);
      }

      try {
        const [ideasRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas?${queryParams.toString()}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            cache: "no-store",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            cache: "no-store",
          }),
        ]);

        const ideasResponse = await ideasRes.json().catch(() => null);
        const categoriesResponse = await categoriesRes.json().catch(() => null);

        const normalizedIdeas = Array.isArray(ideasResponse)
          ? ideasResponse
          : ideasResponse?.ideas ?? ideasResponse?.project ?? ideasResponse?.data ?? [];

        const normalizedCategories = Array.isArray(categoriesResponse)
          ? categoriesResponse
          : categoriesResponse?.categories ?? categoriesResponse?.data ?? [];

        setIdeas(normalizedIdeas);
        setCategoriesList(normalizedCategories);
      } catch (error) {
        console.error("Failed to load ideas:", error);
        setIdeas([]);
        setCategoriesList([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isSessionPending) {
      fetchData();
    }
  }, [category, isSessionPending, search, session?.accessToken, session?.token, time]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 bg-white dark:bg-[#0a0a0a] min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a1930] dark:text-white mb-3 tracking-tight">
          Discover Next-Gen Ideas
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mb-8">
          Browse, filter, and find inspiration from a collective vault of
          forward-thinking concepts. Your next big venture starts here.
        </p>

        <form
          action="/ideas"
          method="GET"
          className="border border-gray-300 dark:border-gray-800 rounded-xl p-2 md:p-3 flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-gray-950 shadow-sm"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-800 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          <select
            name="category"
            defaultValue={category}
            className="w-full md:w-48 px-4 py-2.5 border border-gray-300 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer appearance-none transition-all"
          >
            <option value="All Categories">All Categories</option>
            {categoriesList.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            name="time"
            defaultValue={time}
            className="w-full md:w-40 px-4 py-2.5 border border-gray-300 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer appearance-none transition-all"
          >
            <option value="Any Time">Any Time</option>
            <option value="Past Week">Past Week</option>
            <option value="Past Month">Past Month</option>
            <option value="Past Year">Past Year</option>
          </select>

          <Button
            type="submit"
            className="w-full md:w-auto bg-[#0056d2] hover:bg-blue-800 text-white font-medium py-5 px-6 flex items-center justify-center gap-2 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Apply Filters
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="w-full py-16 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Loading ideas...
        </div>
      ) : ideas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {ideas.map((idea, index) => (
            <IdeaCard key={index} idea={idea} />
          ))}
        </div>
      ) : (
        <div className="w-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-2xl mb-16">
          <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No ideas found
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            We couldn't find any ideas matching your current filters. Try
            adjusting your search or category!
          </p>
        </div>
      )}
    </div>
  );
}
