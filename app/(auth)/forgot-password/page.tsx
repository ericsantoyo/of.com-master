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

const confirmReset = async (formData: FormData) => {
  "use server";

  const origin = headers().get("origin");
  const email = formData.get("email") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    return redirect("/forgot-password?message=Could not authenticate user");
  }

  return redirect(
    "/forgot-password?message=Password Reset link has been sent to your email address"
  );
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  
  return (
    <div className="flex my-12 items-center">
      <Card className="mx-auto max-w-sm w-svw">
        <CardHeader>
          <CardTitle className="text-2xl text-center pb-4">
            Restablecer contraseña
          </CardTitle>
          <CardDescription className="">
            Ingrese su correo electrónico. Le enviaremos un enlace para
            restablecer su contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="">
            <div className="grid gap-4">
              <div className="grid gap-2">
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
              </div>

              <Button
                type="submit"
                formAction={confirmReset}
                className="w-full"
              >
                Confirmar
              </Button>
              {searchParams?.message && (
                <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                  {searchParams.message}
                </p>
              )}
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Recuerda su contraseña?{" "}
            <Link href="/login" className="underline">
              Iniciar sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
