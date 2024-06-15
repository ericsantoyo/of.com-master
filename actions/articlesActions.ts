"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const fetchAllDocuments = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("documents").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};




//CREATE DOCUMENT
export const createDocument = async (title: string) => {
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

  try {
    const { data, error } = await supabase
      .from("documents")
      .insert([{ title, user_id: userId }])
      .select();

    if (error?.code) return error;
    revalidatePath("/dashboard/documents");
    return data;
  } catch (error: any) {
    return error;
  }
};

//DELETE DOCUMENT
export const deleteDocument = async (documentId: string) => {
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

  try {
    // Check if the document belongs to the user before attempting to delete
    const { data: docData, error: docError } = await supabase
      .from("documents")
      .select("user_id")
      .eq("document_id", documentId)
      .single();

    if (docError || !docData) {
      console.error("Document not found or error fetching document.");
      return { error: docError || "Document not found." };
    }

    // Verify the document belongs to the current user
    if (docData.user_id !== userId) {
      console.error("Attempt to delete a document not owned by the user.");
      return { error: "You do not have permission to delete this document." };
    }

    // Proceed to delete the document
    const { data: deleteData, error: deleteError } = await supabase
      .from("documents")
      .delete()
      .match({ document_id: documentId });

    if (deleteError) {
      console.error("Error deleting the document.");
      return { error: deleteError };
    }

    // Revalidate the path if necessary, to update frontend state
    revalidatePath("/dashboard/documents");

    return deleteData;
  } catch (error: any) {
    console.error("Error in deleting document:", error);
    return { error };
  }
};

//GET ALL DOCUMENTS
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
