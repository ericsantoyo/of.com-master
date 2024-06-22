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
import { login } from "@/lib/auth-actions";
import SignInWithGoogle from "./SignInWithGoogle";

export function LoginForm() {
  return (
    
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
  );
}
