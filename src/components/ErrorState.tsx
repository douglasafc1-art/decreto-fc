import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Não foi possível carregar as informações.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-4">
      <AlertTriangle className="text-decreto-gold" size={32} aria-hidden="true" />
      <p className="text-decreto-white/70">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary text-sm">
          Tentar novamente
        </button>
      )}
    </div>
  );
}
