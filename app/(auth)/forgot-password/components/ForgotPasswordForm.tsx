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
import { forgotPassword, login } from "@/lib/auth-actions";

export function ForgotPasswordForm() {
  return (
    <Card className="mx-auto max-w-sm w-svw">
      <CardHeader>
        <CardTitle className="text-2xl text-center pb-4">
          Restablecer contraseña
        </CardTitle>
        <CardDescription className="">
          Ingrese su correo electrónico. Le enviaremos un enlace para restablecer su contraseña.
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

            <Button type="submit" formAction={forgotPassword} className="w-full">
              Confirmar
            </Button>
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
  );
}
