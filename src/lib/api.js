export function getApiUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  return url || null;
}

export async function fetchFromApi(path, options = {}) {
  const baseUrl = getApiUrl();
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_URL is not configured");
    return null;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  try {
    const response = await fetch(`${baseUrl}${normalizedPath}`, {
      cache: "no-store",
      ...options,
    });

    if (!response.ok) {
      console.error(`API ${normalizedPath} failed with status ${response.status}`);
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error(`API ${normalizedPath} returned non-JSON content`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API ${normalizedPath} request failed:`, error.message);
    return null;
  }
}
