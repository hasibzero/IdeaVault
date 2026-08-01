import React from "react";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import IdeaCard from "@/components/IdeaCard";
import { Button } from "@/components/ui/button";

export default async function IdeasPage({ searchParams }) {
  const params = await searchParams;

  // const ideasAPI = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas`);
  // const ideasApi = await ideasAPI.json();

  // console.log("Ideas API Response:", ideasApi?.project);

  const search = params?.search || "";
  const category = params?.category || "All Categories";
  const time = params?.time || "Any Time";

  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (category) queryParams.append("category", category);
  if (time) queryParams.append("time", time);

  const [ideasRes, categoriesRes] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ideas?${queryParams.toString()}`,
      {
        cache: "no-store",
      },
    ),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      cache: "no-store",
    }),
  ]);
  const ideas = await ideasRes.json();
  const categoriesList = await categoriesRes.json();

  //   const ideas = mockIdeas;

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
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              name="search"
              defaultValue={search} // Keeps the text in the input after submit
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-800 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          {/* DYNAMIC Category Dropdown */}
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

          {/* Time Dropdown */}
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

          {/* Apply Filters Button */}
          <Button
            type="submit"
            className="w-full md:w-auto bg-[#0056d2] hover:bg-blue-800 text-white font-medium py-5 px-6 flex items-center justify-center gap-2 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            Apply Filters
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {ideas.map((idea, index) => (
          <IdeaCard key={index} idea={idea} />
        ))}
      </div>

      {ideas.length === 0 && (
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
