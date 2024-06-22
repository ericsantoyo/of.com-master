import DashboardNav from "./(components)/DashboardSidebar";
import DashboardNavMobile from "./(components)/DashboardNav";
import { ReactNode } from "react";
import { User } from "lucide-react";
import UserStatusBar from "./(components)/UserStatusBar";


export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {



  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] ">
      <DashboardNav />
      <div className="flex flex-col">
        
        <DashboardNavMobile />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
