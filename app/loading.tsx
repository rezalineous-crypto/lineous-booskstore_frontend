export default function Loading() {
  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    </div>
  );
}
