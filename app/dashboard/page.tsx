import AuthButton from "@/app/dashboard/(components)/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <p className="font-bold text-lg">Admin Panel</p>
            <AuthButton />
          </div>
        </nav>
      </div>

     

      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
   
      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">

        <p></p>
      </footer>
    </div>
  );
}
