interface LoadingProps {
  label?: string;
}

export function Loading({ label = 'Carregando...' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status" aria-live="polite">
      <div className="h-10 w-10 rounded-full border-2 border-decreto-cyan/30 border-t-decreto-cyan animate-spin" />
      <span className="text-sm text-decreto-white/60">{label}</span>
    </div>
  );
}
