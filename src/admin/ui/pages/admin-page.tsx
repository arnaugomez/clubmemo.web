import { AdminGreeting } from "../components/admin-greeting";
import { AdminResourcesSection } from "../components/admin-resources-section";

export function AdminPage() {
  return (
    <main>
      <div className="h-20" />
      <AdminGreeting />

      <div className="h-8" />

      <AdminResourcesSection />
    </main>
  );
}
