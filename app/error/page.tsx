"use client";

import { Button } from "@/components/ui/button";
import { CircleOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ErrorPage({ statusCode }: { statusCode: number }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 my-12">
      <div className="text-4xl text-red-500 font-bold">
        <CircleOff size={64} />
      </div>
      <h1 className="text-4xl font-bold">Error {statusCode}</h1>
      <h2 className="text-xl">An error occurred on the server.</h2>
      <Button onClick={() => router.back()} className="bg-blue-500 text-white">
        Go back
      </Button>
      <Link href="/">
        <p className="text-blue-500">Go to home</p>
      </Link>
    </div>
  );
}