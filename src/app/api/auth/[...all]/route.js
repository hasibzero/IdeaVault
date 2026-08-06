import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

const SESSION_DATA_COOKIE = "better-auth.session_data";

// The session_data cookie (cookieCache strategy "jwt") is an HS256 JWT signed
// with BETTER_AUTH_SECRET. The API backend verifies exactly this token, but it
// is HttpOnly so the browser can never send it. We expose it server-side as
// `token` on the get-session response so the client can forward it as a Bearer
// token without changing any call sites (they already read `session?.token`).
async function readSessionJwt() {
  const store = await cookies();
  const direct = store.get(SESSION_DATA_COOKIE)?.value;
  if (direct) return direct;

  // Large session payloads are chunked into better-auth.session_data.N cookies.
  const chunks = [];
  for (let i = 0; i < 50; i++) {
    const part = store.get(`${SESSION_DATA_COOKIE}.${i}`)?.value;
    if (part === undefined) break;
    chunks.push(part);
  }
  return chunks.length > 0 ? chunks.join("") : null;
}

async function injectToken(response) {
  try {
    if (!response) return response;
    const data = await response.clone().json();
    if (data?.session && data?.user && !data.token) {
      const token = await readSessionJwt();
      if (token) {
        const headers = new Headers(response.headers);
        headers.set("content-type", "application/json");
        return NextResponse.json(
          { ...data, token },
          { status: response.status, headers },
        );
      }
    }
  } catch {
    // Not JSON (e.g. redirect or error body) — pass through unchanged.
  }
  return response;
}

export async function GET(request, context) {
  const url = new URL(request.url);
  if (url.pathname.endsWith("/get-session")) {
    return injectToken(await handler.GET(request, context));
  }
  return handler.GET(request, context);
}

export async function POST(request, context) {
  return handler.POST(request, context);
}
