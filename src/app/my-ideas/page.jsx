"use client";
import React, { useEffect, useState } from "react";
import { Plus, Lightbulb, ArrowRight, PencilLine, Trash2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function MyIdeasDashboard() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingIdea, setEditingIdea] = useState(null);
  const [ideaToDelete, setIdeaToDelete] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    tagline: "",
    category: "",
    coverImage: "",
    tags: "",
    problem: "",
    solution: "",
    targetAudience: "",
    budget: "",
    details: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const currentUserId = session?.user?.id;

  // Helper: get JWT access token from better-auth jwtClient plugin
  const getToken = async () => {
    try {
      const result = await authClient.token();
      return result?.data?.token || "";
    } catch {
      return "";
    }
  };

  const openEditModal = (idea) => {
    setEditingIdea(idea);
    setEditForm({
      title: idea?.project?.title || "",
      tagline: idea?.project?.tagline || "",
      category: idea?.metadata?.category || "",
      coverImage: idea?.project?.cover_image || "",
      tags: Array.isArray(idea?.metadata?.tags) ? idea.metadata.tags.join(", ") : "",
      problem: idea?.deep_dive?.problem || "",
      solution: idea?.deep_dive?.solution || "",
      targetAudience: idea?.deep_dive?.target_audience || "",
      budget: idea?.deep_dive?.budget_range || "",
      details: idea?.deep_dive?.detailed_description || "",
    });
  };

  const closeEditModal = () => {
    setEditingIdea(null);
    setIsSavingEdit(false);
  };

  const openDeleteModal = (idea) => {
    setIdeaToDelete(idea);
  };

  const closeDeleteModal = () => {
    setIdeaToDelete(null);
  };

  useEffect(() => {
    async function getIdeas() {
      setIsLoading(true);
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/+$/, "");

      try {
        const res = await fetch(`${baseUrl}/ideas`, {
          cache: "no-store",
        });
        const data = await res.json();
        const normalizedIdeas = Array.isArray(data)
          ? data
          : data?.ideas ?? data?.project ?? data?.data ?? [];

        setIdeas(normalizedIdeas);
      } catch (error) {
        console.error("Failed to fetch ideas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isSessionPending) {
      if (currentUserId) {
        getIdeas();
      } else {
        setIsLoading(false);
      }
    }
  }, [currentUserId, isSessionPending]);

  // --- DELETE FUNCTION ---
  const handleDelete = async (ideaId) => {
    try {
      const token = await getToken();
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/+$/, "");

      const res = await fetch(`${baseUrl}/ideas/${ideaId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (res.ok) {
        setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea._id !== ideaId));
        toast.success("Idea deleted successfully.");
      } else {
        toast.error("Failed to delete the idea.");
      }
    } catch (error) {
      console.error("Error deleting idea:", error);
      toast.error("An error occurred while deleting.");
    }
  };

  const confirmDeleteIdea = async () => {
    if (!ideaToDelete) return;

    const ideaId = ideaToDelete._id;
    closeDeleteModal();
    await handleDelete(ideaId);
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    if (!editingIdea || isSavingEdit) return;

    const token = session?.accessToken ?? session?.token ?? "";
    const tagsArray = editForm.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = {
      project: {
        title: editForm.title.trim(),
        tagline: editForm.tagline.trim(),
        badges: tagsArray.slice(0, 2).map((tag) => tag.toUpperCase()),
        cover_image: editForm.coverImage.trim() || editingIdea?.project?.cover_image || "",
        author: editingIdea?.project?.author,
      },
      deep_dive: {
        problem: editForm.problem,
        solution: editForm.solution,
        target_audience: editForm.targetAudience,
        budget_range: editForm.budget,
        detailed_description: editForm.details,
      },
      metadata: {
        status: editingIdea?.metadata?.status || "Validation",
        category: editForm.category,
        tags: tagsArray,
        engagement: editingIdea?.metadata?.engagement || { likes: 0, bookmarks: 0 },
      },
      bookmarks: editingIdea?.bookmarks || [],
      discussion_summary: editingIdea?.discussion_summary || [],
      createdAt: editingIdea?.createdAt,
      updatedAt: new Date().toISOString(),
    };

    setIsSavingEdit(true);

    try {
      const token = await getToken();
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/+$/, "");

      const response = await fetch(`${baseUrl}/ideas/${editingIdea._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(errorText || "Failed to update idea");
      }

      const updatedIdeaResponse = await response.json().catch(() => null);
      const updatedIdea = updatedIdeaResponse?.idea || updatedIdeaResponse?.data || updatedIdeaResponse || {
        ...editingIdea,
        ...payload,
      };

      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) => (idea._id === editingIdea._id ? updatedIdea : idea)),
      );
      toast.success("Idea updated successfully.");
      closeEditModal();
    } catch (error) {
      console.error("Error updating idea:", error);
      toast.error("Failed to update the idea.");
    } finally {
      setIsSavingEdit(false);
    }
  };

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

  if (!currentUserId) {
    return (
      <main className="w-full max-w-7xl mx-auto px-6 py-24 bg-white dark:bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Please Log In</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          You need to sign in to manage and view your ideas.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors"
        >
          Sign In Now
        </Link>
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
        {myIdeas.map((idea) => (
          <div
            key={idea._id} 
            className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-2 flex-wrap">
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(idea)}
                    className="cursor-pointer text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/30 focus:outline-none"
                    title="Edit Idea"
                  >
                    <PencilLine className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openDeleteModal(idea)}
                    className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 focus:outline-none"
                    title="Delete Idea"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                  Submitted at {new Date(idea?.createdAt).toLocaleDateString()}
                </span>

                <div className="flex -space-x-2">
                  {idea?.project.author?.avatar ? (
                    <img
                      key={idea.project.author.avatar}
                      src={
                        idea.project.author.avatar.startsWith("data:") || idea.project.author.avatar.startsWith("blob:")
                          ? idea.project.author.avatar
                          : `${idea.project.author.avatar}${idea.project.author.avatar.includes("?") ? "&" : "?"}nocache=1`
                      }
                      alt={idea?.project.author.name}
                      className="w-8 h-8 rounded-full ring-2 ring-white object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                      {idea?.project?.author?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              </div>
              <Link
                href={`/ideas/${idea._id || "#"}`}
                className="text-sm font-semibold dark:text-blue-400 text-blue-600 dark:hover:text-white hover:text-blue-800 flex items-center transition-colors border-t border-gray-100 dark:border-gray-800 pt-4 mt-4"
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

      {editingIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#081326] dark:text-white">Edit Idea</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update the idea and save changes to the server.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-white"
                aria-label="Close edit modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSaveEdit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="B2B SaaS / Media">B2B SaaS / Media</option>
                    <option value="B2B SaaS / EdTech">B2B SaaS / EdTech</option>
                    <option value="Cleantech / AI">Cleantech / AI</option>
                    <option value="Health / Wearables">Health / Wearables</option>
                    <option value="Logistics / Mobility">Logistics / Mobility</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Tagline</label>
                <input
                  type="text"
                  value={editForm.tagline}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, tagline: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Cover Image URL</label>
                <input
                  type="url"
                  value={editForm.coverImage}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Tags / Badges</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, tags: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    placeholder="AI, SaaS"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Target Audience</label>
                  <input
                    type="text"
                    value={editForm.targetAudience}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, targetAudience: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    placeholder="Students, Small Businesses"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Estimated Budget</label>
                  <input
                    type="text"
                    value={editForm.budget}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, budget: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    placeholder="50,000 - 100,000"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Problem</label>
                  <input
                    type="text"
                    value={editForm.problem}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, problem: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Solution</label>
                <textarea
                  rows={4}
                  value={editForm.solution}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, solution: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">Detailed Description</label>
                <textarea
                  rows={5}
                  value={editForm.details}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, details: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-gray-300 px-5 py-5 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                  onClick={closeEditModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-5 text-white hover:bg-blue-700"
                  disabled={isSavingEdit}
                >
                  {isSavingEdit ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {ideaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-2xl font-bold text-[#081326] dark:text-white">
              Delete idea?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              This will permanently remove <span className="font-semibold text-gray-900 dark:text-white">{ideaToDelete?.project?.title || "this idea"}</span> from your dashboard.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-gray-300 px-5 py-5 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                onClick={closeDeleteModal}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-red-600 px-5 py-5 text-white hover:bg-red-700"
                onClick={confirmDeleteIdea}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}