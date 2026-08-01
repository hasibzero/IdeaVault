import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import IdeaCard from '@/components/IdeaCard';

export default async function FeaturedIdeasPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/featured`);
  const ideas = await res.json();
  console.log('Featured Ideas:', ideas);
  return (
    <div className="w-full pt-10 pb-16">
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ideas?.map((idea, index) => (
          <IdeaCard key={index} idea={idea} />
        ))}
      </div>

    </div>
  );
}