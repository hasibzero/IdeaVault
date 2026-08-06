import React from 'react';
import IdeaCard from '@/components/IdeaCard';

const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
  return url?.replace(/\/+$/, "") || null;
};

const fetchFeaturedIdeas = async () => {
  const baseUrl = getApiUrl();
  if (!baseUrl) {
    console.error(
      "NEXT_PUBLIC_API_URL is not configured. Set it in your Vercel project env vars (e.g. https://your-backend.vercel.app)."
    );
    return [];
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${baseUrl}/featured`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`API /featured failed with status ${response.status}`);
      return [];
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error("API /featured returned non-JSON content");
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("API /featured request failed:", error.message);
    return [];
  }
};

export default async function FeaturedIdeasPage() {
  const ideas = await fetchFeaturedIdeas();

  return (
    <div className="w-full pt-10 pb-16">
      {ideas.length === 0 ? (
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
