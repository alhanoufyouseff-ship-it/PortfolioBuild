'use client';

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text'
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold text-slate-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[var(--primary-color)] transition"
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  action
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  action?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400">{label}</span>
        {action}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[var(--primary-color)] transition resize-none"
      />
    </div>
  );
}

export function SectionCard({
  title,
  icon,
  children
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-panel rounded-2xl border border-white/10 p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm shrink-0">
          <i className={`fa-solid ${icon}`} />
        </div>
        <h2 className="text-sm font-extrabold text-white tracking-wide">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-dashed border-white/20 py-2.5 text-xs font-bold text-slate-300 hover:border-[var(--primary-color)] hover:text-white transition flex items-center justify-center gap-2"
    >
      <i className="fa-solid fa-plus text-[10px]" />
      <span>{label}</span>
    </button>
  );
}

export function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
    >
      <i className="fa-solid fa-trash-can text-[10px]" />
      <span>حذف</span>
    </button>
  );
}
