

import { Profile } from "@/components/Profile";
import { Menu } from "lucide-react";
import { Dialog, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import AuthButton from "./AuthButton";
// import { ModeToggle } from "@/components/ModeToggle"

export default function DashboardNavMobile() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[55px] justify-between lg:justify-end  items-center gap-2 border-b px-3">
        <Dialog>
          <SheetTrigger className="min-[1024px]:hidden p-2 transition">
            <Menu size={24} />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>tsafi</SheetTitle>
              <SheetDescription>
                An opensource blog dashboard built using Nextjs, Supabase & TipTap
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-[1rem]">
              <DialogClose asChild>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    Dashboard
                  </Button>
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <Link href="/dashboard/documents">
                  <Button variant="outline" className="w-full">
                    My Documents
                  </Button>
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <Link href="/dashboard/publish">
                  <Button variant="outline" className="w-full">
                    Publish Article
                  </Button>
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <Link href="/dashboard/author">
                  <Button variant="outline" className="w-full">
                    Create Author
                  </Button>
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <Link href="/dashboard/category">
                  <Button variant="outline" className="w-full">
                    Create Category
                  </Button>
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <Link href="/dashboard/api">
                  <Button variant="outline" className="w-full">
                    API
                  </Button>
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <Link href="/dashboard/settings">
                  <Button variant="outline" className="w-full">
                    Settings
                  </Button>
                </Link>
              </DialogClose>
            </div>
          </SheetContent>
        </Dialog>
        <div className="flex gap-2">
        <AuthButton />
          {/* <Profile /> */}
          {/* <ModeToggle /> */}
        </div>
      </header>
    </div>
  );
}
