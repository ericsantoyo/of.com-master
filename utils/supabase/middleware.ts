import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  let role = null;

  if (user) {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (error) {
      // Handle error as needed
      console.error("Error fetching user role in Middleware:", error);
    } else {
      role = data?.role;
    }
  }

  // Redirect to /login if trying to access /dashboard without proper role
  // if (request.nextUrl.pathname.startsWith("/dashboard")) {
  //   if (userError || !user || (role !== "admin" && role !== "editor")) {
  //     return NextResponse.redirect(new URL("/myteams", request.url));
  //   }
  // }

  // Redirect to /dashboard if the user is an admin or editor
  // if (request.nextUrl.pathname === "/" && (role === "admin" || role === "editor")) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return response;
};