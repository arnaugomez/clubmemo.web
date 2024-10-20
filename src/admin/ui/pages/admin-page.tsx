import { AdminGreeting } from "../components/admin-greeting";
import { AdminResourcesSection } from "../components/admin-resources-section";

/**
 * Main page of the admin panel
 */
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
