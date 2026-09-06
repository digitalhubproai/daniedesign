// Create-project screen — renders the shared ProjectForm in "new" mode
// (no initialData), which POSTs to the backend /projects API on submit.
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return <ProjectForm isEdit={false} />;
}
