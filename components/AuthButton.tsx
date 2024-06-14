import { createClient } from "@/utils/supabase/server";
import { LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signout } from "@/lib/auth-actions";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex">Hola, {user.email}!</div>
      <form action={signout}>
        <Button
          variant="outline"
          className="hidden md:flex justify-center items-center gap-2 whitespace-nowrap"
        >
          <LogOut size={16} />
          <span className="">Cerrar sesión</span>
        </Button>
        <Button
          variant="outline"
          className="md:hidden flex justify-center items-center gap-2 whitespace-nowrap"
        >
          <LogOut size={16} />
          <span className="">Salir</span>
        </Button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex justify-center items-center gap-2 whitespace-nowrap rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      <LogIn size={16} />
      <span className=""></span>
    </Link>
  );
}
