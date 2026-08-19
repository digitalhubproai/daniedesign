"use client";

import { MotionConfig } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";
import SmoothScroll from "./SmoothScroll";
import PageTransition from "./PageTransition";

export default function SiteShell({ children }: { children: React.ReactNode }) {
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