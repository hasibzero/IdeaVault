import React from 'react';
import IdeaCard from '@/components/IdeaCard';
import { fetchFromApi } from '@/lib/api';

export default async function FeaturedIdeasPage() {
  const ideas = (await fetchFromApi('/featured')) ?? [];

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