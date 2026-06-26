export function AdminPage({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black uppercase tracking-tight">{title}</h1>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto border border-zinc-200 bg-white">
      <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">{children}</table>
    </div>
  );
}
