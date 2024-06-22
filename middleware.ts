import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Get the response and user role from updateSession
  const { response, role, user } = await updateSession(request);

  if (
    request.nextUrl.pathname.startsWith("/dashboard") &&
    role !== "admin" &&
    role !== "editor"
  ) {
    return NextResponse.redirect(new URL("/myteams", request.url));
  }

  // Redirect to / if user trays to access /login or /register while authenticated
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register"
  ) {
    if (user) {
      return NextResponse.redirect(new URL("/myteams", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
