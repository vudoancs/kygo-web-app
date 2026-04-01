export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 px-6 py-4">
        <p className="text-sm font-medium text-slate-400">Khu vực quản trị</p>
      </header>
      <div className="p-6">{children}</div>
    </div>
  );
}
