"use client";

import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";
import SmoothScroll from "./SmoothScroll";
import PageTransition from "./PageTransition";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main className="min-h-screen bg-[#0a0a0c]">{children}</main>;
  }

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <CustomCursor />
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <Footer />
    </MotionConfig>
  );
}