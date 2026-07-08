import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isAuthPage = path === "/login" || path === "/signup" || path === "/forgot-password" || path === "/reset-password";
  const isOnboarding = path === "/onboarding";
  const isApiPath = path.startsWith("/api/");
  const isPublicPath = isAuthPage || path.startsWith("/auth/") || path.startsWith("/api/");

  if (!user && !isPublicPath) {
    const redirect = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  if (user && (path === "/login" || path === "/signup")) {
    const redirect = NextResponse.redirect(new URL("/", request.url));
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  if (user && user.user_metadata.onboarding_completed !== true && !isOnboarding && !isApiPath && !path.startsWith("/auth/")) {
    const redirect = NextResponse.redirect(new URL("/onboarding", request.url));
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  if (user && user.user_metadata.onboarding_completed === true && isOnboarding) {
    const redirect = NextResponse.redirect(new URL("/", request.url));
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
