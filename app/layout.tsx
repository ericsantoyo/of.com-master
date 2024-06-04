import type { Metadata } from "next";
import { Inter, Roboto, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import BottomMenu from "@/components/MobileMenu";
import Footer from "@/components/footer/Footer";

// import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Once Fantasy",
  description: "Toda la Ayuda con La Liga Futbol Fantasy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
    <body className={`${inter.className}`}>
      <Navbar />
      <main className="container max-w-6xl ">
        

        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem> */}
        {/* <ThemeRegistry options={{ key: "mui" }}> */}
        {children}
        {/* </ThemeRegistry> */}
        {/* </ThemeProvider> */}
        {/* <Analytics /> */}
      </main>
      <Footer />
      <BottomMenu />
    </body>
  </html>
  );
}
