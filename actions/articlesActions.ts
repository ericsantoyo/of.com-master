"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

//CREATE DOCUMENT
export const createDocument = async (title: string) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("User not authenticated");
  }
  const userEmail = user?.email;

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("user_id")
    .eq("email", userEmail)
    .single();

  if (userError || !userData) {
    return { error: userError?.message || "User not found" };
  }

  try {
    const { data, error } = await supabase
      .from("documents")
      .insert([{ title, user_id: userData.user_id }])
      .select();

    if (error?.code) return error;
    revalidatePath("/dashboard/documents");
    return data;
  } catch (error: any) {
    return error;
  }
};

//DELETE DOCUMENT
export const deleteDocument = async (id: string) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("documents")
      .delete()
      .eq("document_id", id)
      .select();

    if (error?.code) return error;

    revalidatePath("/dashboard/documents");

    return data;
  } catch (error: any) {
    return error;
  }
};

export const getAllDocuments = async () => {
  const supabase = createClient();
  try {
    //all docs that are published
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};

//GET ALL DOCUMENTS (isolated)
export const getAllDocumentsWithPagination = async (searchParams: {
  [key: string]: string | string[] | undefined;
}) => {
  const supabase = createClient();
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
    //all docs that are published
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to)
      .returns<news[]>();

    if (!data || error || !data.length) {
      throw new Error("No data found");
    }
    return { data, totalPages, page };
  } catch (error: any) {
    return error;
  }
};

//GET DOCUMENT BY ID
export const getDocumentById = async (id: string) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("document_id", id);
    // .eq("user_id", userId);

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};

//STORE DOCUMENT
export const storeDocument = async (
  title: string,
  blog: string,
  id: string
) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("User not authenticated");
  }
  const userEmail = user?.email;

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("user_id")
    .eq("email", userEmail)
    .single();

  if (userError || !userData) {
    return { error: userError?.message || "User not found" };
  }

  try {
    const { data, error } = await supabase
      .from("documents")
      .update([{ title, document: blog }])
      .eq("document_id", id)
      .eq("user_id", userData.user_id)
      .select();

    if (error?.code) return error;

    revalidatePath("/dashboard/documents");

    return data;
  } catch (error: any) {
    return error;
  }
};

//GET ALL ARTICLES
export const getAllArticles = async () => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("blog")
      .select("*, category(*), author(*)")
      .order("created_at", { ascending: false });

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};

//STORE ARTICLE
export const storeArticles = async (
  title: string,
  subtitle: string,
  slug: string,
  blog: string,
  author_id: string,
  category_id: string,
  keywords: string,
  image: string,
  image_alt: string
) => {
  const supabase = createClient();
  const keywordArray = keywords?.split(",");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated");
  }
  const userID = user?.id;

  try {
    const { data, error } = await supabase
      .from("blog")
      .insert([
        {
          title,
          subtitle,
          slug,
          blog_html: blog,
          category_id,
          author_id,
          keywords: keywordArray,
          image,
          image_alt,
          user_id: userID,
        },
      ])
      .select();

    if (error?.code) return error;

    revalidatePath("/dashboard");

    return data;
  } catch (error: any) {
    return error;
  }
};

//UPDATE ARTICLE
export const updateArticle = async (slug: string, blog: string) => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("blog")
      .update([
        {
          blog_html: blog,
        },
      ])
      // .eq("user_id", userId)
      .eq("slug", slug)
      .select();

    if (error?.code) return error;

    revalidatePath("/dashboard");

    return data;
  } catch (error: any) {
    return error;
  }
};

//GET ARTICLE BY SLUG
export const getAllArticleBySlug = async (slug: string) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("blog")
      .select(
        `*,
      author (*),
      category (*)
      `
      )
      .eq("slug", slug);
    // .eq("user_id", userId);

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};

//READ PUBLIC ARTICLE
export const readPublicArticle = async (id: string) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("blog")
      .select(
        `*,
      author (*),
      category (*)
      `
      )
      .eq("id", id)
      .eq("shareable", true);

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};

//SHARE ARTICLE
export const shareArticle = async (slug: string, shareable: boolean) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("blog")
      .update([
        {
          shareable,
        },
      ])
      // .eq("user_id", userId)
      .eq("slug", slug)
      .select();

    if (error?.code) return error;

    revalidatePath("/dashboard");

    return data;
  } catch (error: any) {
    return error;
  }
};

//GET ALL AUTHORS
export const getAllAuthors = async () => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("author").select("*");
    // .eq("user_id", userId);

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};

//GET ALL CATEGORIES
export const getAllCategories = async () => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("category").select("*");
    // .eq("user_id", userId);

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    return error;
  }
};
