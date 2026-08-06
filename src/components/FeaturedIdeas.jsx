"use client";

import React, { useEffect, useState } from 'react';
import IdeaCard from '@/components/IdeaCard';

export default function FeaturedIdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getFeaturedIdeas() {
      setIsLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      try {
        const response = await fetch(`${baseUrl}/featured`, {
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          const normalized = Array.isArray(data)
            ? data
            : data?.ideas ?? data?.featured ?? [];
          setIdeas(normalized);
        } else {
          setIdeas([]);
        }
      } catch (error) {
        console.error("Failed to fetch featured ideas:", error);
        setIdeas([]);
      } finally {
        setIsLoading(false);
      }
    }

    getFeaturedIdeas();
  }, []);

  return (
    <div className="w-full pt-10 pb-16">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded-md" />
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md" />
              </div>
              <div className="h-8 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </div>
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No featured ideas available right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {ideas.map((idea, index) => (
            <IdeaCard key={idea._id ?? index} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}

