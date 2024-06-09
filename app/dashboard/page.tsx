import { getUserEmail } from "@/actions/actions";
import AuthButton from "@/app/dashboard/(components)/AuthButton";
import { getUserRole } from "@/actions/actions";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const email = await getUserEmail(); // Await the email retrieval if asynchronous

  if (!email) {
    return redirect("/login");
  }

  const { error, role } = await getUserRole();

  if (error) {
    console.error("Error fetching role:", error);
    return redirect("/login");
  }

  if (role !== "owner" && role !== "manager") {
    return redirect("/myteams");
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

      <div className="flex-1 flex flex-col gap-2 max-w-4xl px-3">
        <h2 className="font-bold text-4xl mb-4 text-center">email: {email}</h2>
        <h2 className="font-bold text-4xl mb-4 text-center">Role: {role}</h2>
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p></p>
      </footer>
    </div>
  );
}
