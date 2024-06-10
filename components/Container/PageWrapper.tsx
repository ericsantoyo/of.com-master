import React from "react";

import Navbar from "@/components/navbar/Navbar";
import BottomMenu from "@/components/MobileMenu";
import Footer from "@/components/footer/Footer";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Navbar /> */}
      <main className="flex min-w-screen flex-col items-center justify-between pb-[4rem]">
        {children}
      </main>
      {/* <Footer /> */}
      {/* <BottomMenu /> */}
    </>
  );
}
