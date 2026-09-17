import type { ReactNode } from 'react';

export function AdminCard({ children }: { children: ReactNode }) {
  return <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">{children}</div>;
}

export function AdminPageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold text-white">{title}</h1>
      {action}
    </div>
  );
}

export function AdminButton({
  children,
  variant = 'primary',
  ...props
}: { children: ReactNode; variant?: 'primary' | 'danger' | 'ghost' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white',
    danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-900',
    ghost: 'bg-slate-800 hover:bg-slate-700 text-slate-200',
  };
  return (
    <button
      {...props}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${props.className ?? ''}`}
    >
      {children}
    </button>
  );
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className ?? ''}`}
    />
  );
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className ?? ''}`}
    />
  );
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className ?? ''}`}
    />
  );
}

export function AdminLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <label className={`text-xs uppercase tracking-wide text-slate-400 flex flex-col gap-1 ${className ?? ''}`}>{children}</label>;
}

export function AdminBadge({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' }) {
  const tones = {
    default: 'bg-slate-800 text-slate-300',
    success: 'bg-emerald-900/40 text-emerald-300',
    warning: 'bg-amber-900/40 text-amber-300',
    danger: 'bg-red-900/40 text-red-300',
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full ${tones[tone]}`}>{children}</span>;
}
