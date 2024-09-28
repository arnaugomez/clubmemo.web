import { AdminGreeting } from "../components/admin-greeting";
import { AdminResourcesSection } from "../components/admin-resources-section";

export function AdminPage() {
  return (
    <main>
      <div className="h-24" />
      <AdminGreeting />

      <div className="h-10" />

      <AdminResourcesSection />
    </main>
  );
}
