import { Sidebar } from "@/components/layout/Sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-bg-main">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border-subtle bg-white flex items-center px-8">
            {/* Breadcrumbs or search would go here */}
            <div className="text-sm font-medium text-slate-500">
              Internal Dashboard
            </div>
          </header>
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
