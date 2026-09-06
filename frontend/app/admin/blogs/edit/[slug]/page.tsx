// Edit-article screen — server component that resolves the [slug] route
// param, fetches the existing post, and hands it to BlogForm in edit mode.
import { getBlogPostBySlug } from "@/lib/api";
import BlogForm from "@/components/admin/BlogForm";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditBlogPage({ params }: Props) {
  // params is a Promise in this Next.js version; await it to read the slug.
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  // Unknown slug -> render the 404 page.
  if (!post) {
    notFound();
  }

  return <BlogForm initialData={post} isEdit={true} />;
}
