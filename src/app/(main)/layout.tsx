import type { Metadata } from "next";
import "../globals.css";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner";
const Footer = dynamic(() => import("@/components/layout/footer/Footer"));
const Header = dynamic(() => import("@/components/layout/header/Header"));

export const metadata: Metadata = {
  title: "CollegePucho | Find the best colleges and courses for your future",
  description: "CollegePucho is a platform for students to find the best colleges and courses for their future.",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      {children}
      <Toaster />
      <Footer />
    </main>
  );
}
