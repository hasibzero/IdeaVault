import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Wallet, 
  ThumbsUp, 
  Bookmark, 
  MoreVertical,
  Plus
} from 'lucide-react';
import Image from 'next/image';
import { comment } from 'postcss';


export default async function IdeaDetailsPage({params}) {
    const { id } = await params;
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas/${id}`);
    const idea = await res.json();
    const {project, metadata,deep_dive} = idea;
      const primaryBadge = project.badges[0];
      const secondBadge = project.badges[1];

    const getBadgeColor = (badgeText) => {
        const text = badgeText?.toUpperCase() || "";
        if (text.includes("AI") || text.includes("EDTECH")) return "bg-green-100 text-green-700";
        if (text.includes("HEALTH")) return "bg-orange-100 text-orange-700";
        if (text.includes("FINTECH") || text.includes("SAAS")) return "bg-blue-100 text-blue-700";
        return "bg-gray-100 text-gray-700";
};
//   console.log("Fetched Idea:", idea); // Debugging line to check the fetched idea data
    const coverimg = idea?.project?.cover_image
  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white dark:bg-[#0a0a0a] min-h-screen">
      
       <Image 
       className="w-full h-48 md:h-72 lg:h-80 rounded-2xl md:rounded-3xl bg-gray-200 mb-8 md:mb-12 bg-cover bg-center shadow-sm border border-gray-100 dark:border-gray-800"
        src={coverimg }
        height={320}
        width={1280}
        alt={project?.title || "Idea Cover Image"}>

       </Image>
        


      <div className="mb-10">
        <div className="flex gap-2 mb-4">
            <span className={`text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider ${getBadgeColor(primaryBadge)}`}>
                {primaryBadge}
          
            </span>
            {secondBadge && (
            <span className={`text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider ${getBadgeColor(primaryBadge)}`}>
                {secondBadge}
          
            </span>
          )}
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">
            {project?.title || "Untitled Idea"}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed mb-8">
            {project?.tagline || "No tagline provided."}
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          <div className="flex items-center gap-3">
             <Image 
             src={project?.author?.avatar || "https://i.pravatar.cc/150?u=default"}
             height={40}
             width={40}
             alt={project?.author?.name || "Author Avatar"}
             className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700">


             </Image>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{project?.author?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{project?.author?.role} • {new Date(project.author.joined_at).toLocaleDateString('en-US', { month: 'short',day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
              <ThumbsUp className="w-4 h-4" /> {metadata.engagement.likes}
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
              <Bookmark className="w-4 h-4" /> Save ({metadata.engagement.bookmarks})
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-2 space-y-6">
          
          {/* The Problem */}
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">The Problem</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {deep_dive?.problem || "No problem description provided."}
            </p>
          </div>

          {/* The Solution */}
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">The Solution</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                {deep_dive?.solution || "No solution description provided."}
            </p>
            
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Target Audience</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {deep_dive?.target_audience || "No audience information provided."}
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Budget Required</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {deep_dive?.budget_range || "No budget information provided."}
              </p>
            </div>
          </div>

          <hr className="my-10 border-gray-200 dark:border-gray-800" />

          {/* Discussion Section */}
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Discussion ({idea?.discussion_summary.length})</h3>
            
            {/* Input Area */}
            <div className="flex gap-4 mb-8">
              <img src="https://i.pravatar.cc/150?img=47" alt="You" className="w-10 h-10 rounded-full border border-gray-200 hidden sm:block" />
              <div className="flex-1 flex flex-col items-end gap-3">
                <textarea 
                  placeholder="Add a comment or feedback..."
                  className="w-full bg-[#f8fafc] dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
                ></textarea>
                <button className="px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-sm">
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
  {idea.discussion_summary?.map((comment, index) => (
    <div key={index} className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex gap-4">
      <img 
        src={`https://i.pravatar.cc/150?u=${comment.user}`} 
        alt={comment.user} 
        className="w-10 h-10 rounded-full border border-gray-200" 
      />
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="font-bold text-sm text-gray-900 dark:text-white mr-2">
              {comment.user || "Anonymous"}
            </span>
            <span className="text-xs text-gray-400">
              {comment.time_ago || "Just now"}
            </span>
          </div>
          {/* <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-4 h-4" />
          </button> */}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          {comment.comment || "No comment text provided."}
        </p>
        {/* <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
          Reply
        </button> */}
      </div>
    </div>
  ))}
</div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar Metadata Cards */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Status */}
          <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Status</h4>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-base font-bold text-gray-900 dark:text-white"> {metadata.status} Phase</span>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="p-5 bg-[#f8fafc] dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <div className="mb-5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Category</h4>
              <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                 {metadata.category || "Uncategorized"}
               </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
  {idea?.metadata?.tags?.map((tag, index) => (
    <span 
      key={index} 
      className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full"
    >
      {tag}
    </span>
     ))}

    </div>
            </div>
          </div>

          {/* Collaborators */}
          <div className="p-5 bg-[#f8fafc] dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Active Collaborators</h4>
             <div className="flex -space-x-2">
                <Image 
                    src={project?.author?.avatar || "https://i.pravatar.cc/150?u=default"}
                    height={40}
                    width={40}
                    alt={project?.author?.name || "Author Avatar"}
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700">
                </Image>


                {/* <img src="https://i.pravatar.cc/150?u=collab2" alt="Collaborator" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 object-cover" />
                <img src="https://i.pravatar.cc/150?u=collab3" alt="Collaborator" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 object-cover" /> */}
                {/* <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 bg-white dark:bg-gray-800 z-10 transition-colors">
                  <Plus className="w-4 h-4" />
                </button> */}
             </div>
          </div>

        </div>

      </div>
    </main>
  );
}