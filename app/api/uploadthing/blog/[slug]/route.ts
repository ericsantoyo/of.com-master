import { getArticleBySlugApi } from "@/actions/apiActions";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const authorization = headers().get("X-Auth-Key");
  const supabase = createClient();
  try {
    const { data: user, error: authError } = await supabase.auth.getUser(
      authorization!
    );

    if (authError || !user) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized",
        error: authError?.message || "User not found",
      });
    }

    const response = await getArticleBySlugApi(params?.slug!, user.user.id);

    if (response?.error) {
      return NextResponse.json({
        status: 400,
        message: "error",
        error: response?.error,
      });
    }
    return NextResponse.json({
      status: 200,
      message: "success",
      response,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 404,
      message: "failed",
      error: error?.errors?.[0]?.code,
    });
  }
}
