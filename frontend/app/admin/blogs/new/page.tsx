// Create-article screen — renders the shared BlogForm in "new" mode
// (no initialData), which POSTs to the backend /blogs API on submit.
import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return <BlogForm isEdit={false} />;
}
