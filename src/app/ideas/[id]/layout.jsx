export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${baseUrl}/ideas/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.project?.title) {
        return {
          title: data.project.title,
          description: data.project.tagline || "View full details and discussions on IdeaVault.",
        };
      }
    }
  } catch (error) {}

  return {
    title: "Idea Details",
  };
}

export default function IdeaDetailLayout({ children }) {
  return children;
}
