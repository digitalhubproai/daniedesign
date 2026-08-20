import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import { blogPosts } from "@/data/blog";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Explore strategic insights on branding, full-service marketing, web development, and startup growth from Danie Design.",
};

export default function BlogPage() {
  return (
    <main className="bg-[#0e0e0e] text-ink">
      <PageHero
        eyebrow="Journal &amp; Insights"
        title="Perspectives on craft, code, and scale."
        intro="Direct thinking from the Danie Design studio — strategy breakdowns, technical teardowns, and market playbooks to grow modern brands."
        meta={[
          { label: "Published Articles", value: String(blogPosts.length) },
          { label: "Execution Squad", value: "100% In-House" },
        ]}
      />

      <BlogClient posts={blogPosts} />
    </main>
  );
}