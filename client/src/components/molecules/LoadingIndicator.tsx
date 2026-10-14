import { Spinner } from '../atoms/Spinner';

export function LoadingIndicator({ message = 'Writing your product copy...' }: { message?: string }) {
  return (
    <div role="status" className="flex items-center gap-3 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">
      <Spinner />
      <span>{message}</span>
    </div>
  );
}
