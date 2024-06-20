"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  const user = await supabase.auth.getUser();
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user?.data.user?.id)
    .single();

  if (roleError) {
    console.error("Error fetching user role in login function:", roleError);
    return redirect("/error");
  }

  const role = roleData?.role;

  if (role === "admin" || role === "editor") {
    return redirect("/dashboard");
  } else {
    return redirect("/myteams");
  }
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("OAuth sign-in error:", error);
    redirect("/error");
  }

  // Redirect to the OAuth URL
  if (data.url) {
    redirect(data.url);
  }
}

// export async function signInWithGoogle() {
//   const supabase = createClient();
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       queryParams: {
//         access_type: "offline",
//         prompt: "consent",
//       },
//     },
//   });

//   if (error) {
//     console.error("OAuth sign-in error:", error);
//     return redirect("/error");
//   }

//   // Redirect to the OAuth URL if provided
//   if (data.url) {
//     return redirect(data.url);
//   }

//   // Wait for the OAuth process to complete and then fetch the user and their role
//   const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

//   if (sessionError) {
//     console.error("Error fetching session:", sessionError);
//     return redirect("/error");
//   }

//   const user = sessionData?.session?.user;

//   if (!user) {
//     console.error("No user found after OAuth sign-in");
//     return redirect("/error");
//   }

//   const { data: roleData, error: roleError } = await supabase
//     .from("user_roles")
//     .select("role")
//     .eq("user_id", user.id)
//     .single();

//   if (roleError) {
//     console.error("Error fetching user role:", roleError);
//     return redirect("/error");
//   }

//   const role = roleData?.role;

//   if (role === "admin" || role === "editor") {
//     return redirect("/dashboard");
//   } else {
//     return redirect("/myteams");
//   }
// }

export async function signup(formData: FormData) {
  const supabase = createClient();

  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    console.error("Signup error:", error);
    redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/");
}
