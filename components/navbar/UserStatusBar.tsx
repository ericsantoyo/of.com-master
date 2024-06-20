//create a user status bar component for supabase user

import { LayoutDashboard, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import { signout } from "@/lib/auth-actions";
import Link from "next/link";

export default async function UserStatusBar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role = null;

  if (user) {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (error) {
      // Handle error as needed
      console.error("Error fetching user role in UserBar:", error);
    } else {
      role = data?.role;
    }
  }

  return user ? (
    <div className="container max-w-6xl flex justify-between items-center pb-2">
      {/* <pre>{JSON.stringify(role, null, 2)}</pre> */}
      <Link
        href="/dashboard"
        className="py-2 px-3 flex justify-center items-center  whitespace-nowrap rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        <Button
          variant="blue"
          className="hidden md:flex justify-center items-center gap-2 whitespace-nowrap"
        >
          <LayoutDashboard size={16} />
          <span className="">Dashboard</span>
        </Button>
        <Button
          variant="blue"
          className="md:hidden flex justify-center items-center whitespace-nowrap"
        >
          <LayoutDashboard size={16} />
        </Button>
      </Link>
      <div className="flex flex-col justify-center items-center">
        <p className="text-center font-semibold text-sm">{user.email}</p>
        <span className="text-muted-foreground text-xs">({role})</span>
      </div>
      <form action={signout}>
        <Button
          variant="red"
          className="hidden md:flex justify-center items-center gap-2 whitespace-nowrap"
        >
          <LogOut size={16} />
          <span className="">Cerrar sesión</span>
        </Button>
        <Button
          variant="red"
          className="md:hidden flex justify-center items-center  whitespace-nowrap"
        >
          <LogOut size={16} />
        </Button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex justify-center items-center  whitespace-nowrap rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      <Button
        variant="green"
        className="hidden md:flex justify-center items-center  whitespace-nowrap"
      >
        <LogOut size={16} />
        <span className="">Iniciar sesión</span>
      </Button>
      <Button
        variant="green"
        className="md:hidden flex justify-center items-center  whitespace-nowrap"
      >
        <LogIn size={16} />
        <span className="">Entrar</span>
      </Button>
      <span className=""></span>
    </Link>
  );
}
