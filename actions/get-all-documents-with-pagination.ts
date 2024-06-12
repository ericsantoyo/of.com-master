"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const getAllDocumentsWithPagination = async (searchParams: {
  [key: string]: string | string[] | undefined;
}) => {
  const supabase = createClient();

  // Get the current user's information
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // If there's an error fetching the user, or no user is logged in, return an error
  if (userError || !user) {
    console.error("User not authenticated or error fetching user details.");
    return { error: userError || "User not authenticated." };
  }

  const userId = user.id;

  // Fetch the user's role
  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (roleError || !roleData) {
    return { error: roleError || "User role not found." };
  }

  const isOwner = roleData.role === "owner";

  // Fetch total pages
  const { count } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true });

  // Pagination
  const limit = 12;
  const totalPages = count ? Math.ceil(count / limit) : 0;
  const page =
    typeof searchParams.page === "string" &&
    +searchParams.page > 1 &&
    +searchParams.page <= totalPages
      ? +searchParams.page
      : 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const query = supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!isOwner) {
      query.eq("user_id", userId); // Limit to documents owned by the user if not an owner
    }

    const { data, error } = await query;

    if (!data || error || !data.length) {
      throw new Error("No data found");
    }

    return { data, totalPages, page };
  } catch (error: any) {
    return error;
  }
};
