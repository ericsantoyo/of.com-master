import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { message: string; code: string; error: string };
}) {
  const resetPassword = async (formData: FormData) => {
    "use server";

    const password = formData.get("password") as string;
    const supabase = createClient();

    if (searchParams.code) {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(
        searchParams.code
      );

      if (error) {
        return redirect(
          `/reset-password?message=Unable to reset Password. Link expired!`
        );
      }
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.log(error);
      return redirect(
        `/reset-password?message=Unable to reset Password. Try again!`
      );
    }

    redirect(
      `/reset-password?message=Your Password has been reset successfully. Sign in.`
    );
  };



  return (
    <div className="flex my-12 items-center">
      <Card className="mx-auto max-w-sm w-svw">
        <CardHeader>
          <CardTitle className="text-2xl text-center pb-4">
            Restablecer contraseña
          </CardTitle>
          {/* <CardDescription className="">
          Inicia sesión con tu correo electrónico y contraseña
        </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form action="">
            <div className="grid gap-4">
              {/* <div className="grid gap-2">
                <Label htmlFor="email">
                  Correo electrónico <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div> */}
              <div className="grid gap-2 pb-4">
                <div className="flex items-center">
                  <Label htmlFor="password">
                    Contraseña Nueva <span className="text-red-500">*</span>
                  </Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="grid gap-2 pb-4">
                <div className="flex items-center">
                  <Label htmlFor="password">
                    Confirmar Contraseña Nueva{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                </div>
                <Input
                  id="password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button
                type="submit"

                formAction={resetPassword}
                className="w-full"
              >
                Restablecer Contraseña
              </Button>
              {searchParams?.message && (
                <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                  {searchParams.message}
                </p>
              )}

              
            </div>
          </form>
          {/* <div className="mt-4 text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link href="/signup" className="underline">
            Regístrate
          </Link>
        </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
