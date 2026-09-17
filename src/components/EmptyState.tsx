import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center px-4">
      {icon && <div className="text-decreto-cyan/60 mb-2">{icon}</div>}
      <p className="font-display text-xl uppercase text-decreto-white/80">{title}</p>
      {description && <p className="text-sm text-decreto-white/50 max-w-sm">{description}</p>}
    </div>
  );
}
