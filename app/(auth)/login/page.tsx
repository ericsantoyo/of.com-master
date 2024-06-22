
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
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
import SignInWithGoogle from "./components/SignInWithGoogle";
import { redirect } from "next/navigation";




export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
 
  //LOGIN SERVER FUNCTION 
  const login = async (formData: FormData) => {
    'use server';
    const supabase = createClient();
  
    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
  
    const { error } = await supabase.auth.signInWithPassword(data);
  
    if (error) {
      return redirect('/login?message=Could not authenticate user');
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
  
  return (
    <div className="flex my-12 items-center">
       <Card className="mx-auto max-w-sm w-svw">
      <CardHeader>
        <CardTitle className="text-2xl text-center pb-4">Iniciar sesión</CardTitle>
        {/* <CardDescription className="">
          Inicia sesión con tu correo electrónico y contraseña
        </CardDescription> */}
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
            <div className="grid gap-2 pb-4">
              <div className="flex items-center">
                <Label htmlFor="password">
                  Contraseña <span className="text-red-500">*</span>
                </Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Olvidé mi contraseña
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" formAction={login} className="w-full">
              Iniciar sesión
            </Button>
            <SignInWithGoogle />
            {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link href="/signup" className="underline">
            Regístrate
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};
