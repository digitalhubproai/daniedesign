// Portfolio case-study list — fetches all projects from the backend, with
// category/search filtering, public preview links, edit and delete actions.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Trash2, Edit3, ExternalLink, Star, Loader2, ArrowUpRight } from "lucide-react";
import { getProjects, deleteProject } from "@/lib/api";
import { Project } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  // Load the project list from the backend /projects API.
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Delete flow: native confirm(), DELETE by slug, then drop it from local
  // state; deletingSlug shows a spinner on the in-flight card.
  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project "${title}"?`)) return;
    setDeletingSlug(slug);
    try {
      await deleteProject(slug);
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    } finally {
      setDeletingSlug(null);
    }
  };

  const categories = ["All", "Branding", "UI/UX", "Web", "Mobile", "Marketing"];

  // Combine the active category chip with the free-text search (client-side).
  const filtered = projects.filter((p) => {
    const matchesCat = selectedCat === "All" || p.category === selectedCat;
    const matchesSearch =
      search.trim() === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#9a968e] mb-3 flex items-center gap-2">
            <span className="h-px w-6 bg-[#ff4d1f]" />
            Portfolio Management
          </p>
          <h1
            className="text-3xl font-bold leading-[1.06] tracking-tight text-[#f4f2ee] md:text-4xl"
            style={{ fontFamily: "var(--font-sora, sans-serif)" }}
          >
            Case Studies <span className="text-[#ff4d1f]">({projects.length})</span>
          </h1>
        </div>

        <Link href="/admin/projects/new">
          <Button variant="default" size="default" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Create New Case Study</span>
          </Button>
        </Link>
      </div>

      {/* ── FILTERS & SEARCH ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="pl-10 h-10 rounded-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                selectedCat === cat
                  ? "bg-[#ff4d1f] text-[#0e0e0e] font-bold shadow-[0_4px_16px_rgba(255,77,31,0.35)]"
                  : "bg-white/[0.04] text-[#9a968e] hover:text-[#f4f2ee] border border-white/[0.07]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── PROJECTS GRID ── */}
      {loading ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-20 text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#ff4d1f] mb-3" />
          <p className="font-mono text-xs text-[#9a968e] uppercase tracking-widest">
            Loading case studies...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-16 text-center">
          <p className="text-base font-semibold text-[#f4f2ee]">No projects found</p>
          <p className="font-mono text-xs text-[#9a968e] mt-1">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((proj) => (
            <div
              key={proj.slug}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#111111] overflow-hidden hover:border-[#ff4d1f]/40 transition-all duration-300 shadow-sm"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-widest bg-black/80 backdrop-blur-md text-[#ff4d1f] px-2.5 py-1 rounded-full border border-white/10">
                      {proj.category}
                    </span>
                    {proj.featured && (
                      <span className="font-mono text-[9px] uppercase tracking-widest bg-amber-500/20 backdrop-blur-md text-amber-300 px-2 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-3 right-3 font-mono text-[10px] bg-black/80 px-2 py-0.5 rounded text-white/70">
                    {proj.year}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3
                    className="text-base font-bold text-[#f4f2ee] group-hover:text-[#ff4d1f] transition-colors leading-tight"
                    style={{ fontFamily: "var(--font-sora, sans-serif)" }}
                  >
                    {proj.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-[#9a968e] mt-2 leading-relaxed">
                    {proj.description}
                  </p>

                  {proj.services && proj.services.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {proj.services.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="font-mono text-[9px] uppercase tracking-wider text-white/50 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.06] p-4 bg-[#141414]/50">
                <Link
                  href={`/work/${proj.slug}`}
                  target="_blank"
                  className="font-mono text-[10px] uppercase tracking-wider text-[#9a968e] hover:text-[#ff4d1f] flex items-center gap-1 transition-colors"
                >
                  <span>Preview</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/projects/edit/${proj.slug}`}>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] px-3 gap-1">
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDelete(proj.slug, proj.title)}
                    disabled={deletingSlug === proj.slug}
                    className="h-7 w-7 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all cursor-pointer"
                    title="Delete project"
                  >
                    {deletingSlug === proj.slug ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
