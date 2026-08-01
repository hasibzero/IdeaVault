import React from 'react';
import { Bookmark, ArrowRight } from 'lucide-react';
import Link from 'next/link';

//  assign badge colors based on category
const getBadgeColor = (badgeText) => {
  const text = badgeText?.toUpperCase() || "";
  if (text.includes("AI") || text.includes("EDTECH")) return "bg-green-100 text-green-700";
  if (text.includes("HEALTH")) return "bg-orange-100 text-orange-700";
  if (text.includes("FINTECH") || text.includes("SAAS")) return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
};

export default function IdeaCard({ idea }) {
  const { project, metadata } = idea;
  const primaryBadge = project.badges[0];

  return (
    <div className="bg-white dark:bg-black border border-gray-200 rounded-2xl p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider ${getBadgeColor(primaryBadge)}`}>
          {primaryBadge}
        </span>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">
        {project.title}
      </h3>
      <p className="text-sm dark:text-gray-200 mb-5 line-clamp-3 leading-relaxed">
        {project.tagline}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {metadata.tags.slice(0, 3).map((tag, index) => (
          <span 
            key={index} 
            className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex -space-x-2">
          {project.author?.avatar ? (
            <img 
              src={project.author.avatar} 
              alt={project.author.name} 
              className="w-8 h-8 rounded-full ring-2 ring-white object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
              {project.author.name.charAt(0)}
            </div>
          )}
        </div>

        <Link 
          href={`/ideas/${idea._id || '#'}`} 
          className="text-sm font-semibold dark:text-blue-400 text-blue-600 dark:hover:text-white hover:text-blue-800 flex items-center transition-colors"
        >
          View Details <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

    </div>
  );
}