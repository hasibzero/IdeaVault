import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import IdeaCard from '@/components/IdeaCard';


export default async function IdeasPage() {
  

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas`);
  const ideas = await res.json();
  
//   const ideas = mockIdeas;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 bg-white dark:bg-[#0a0a0a] min-h-screen">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {ideas.map((idea, index) => (
          <IdeaCard key={index} idea={idea} />
        ))}
      </div>

     

    </div>
  );
}