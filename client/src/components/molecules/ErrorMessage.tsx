import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

interface Props {
  message: string;
  title?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, title = 'Something went wrong', onRetry, onDismiss }: Props) {
  return (
    <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <Icon name="alert" className="mt-0.5 shrink-0 text-red-600" />

      <div className="flex-1 space-y-1">
        <p className="font-semibold">{title}</p>
        <p>{message}</p>
        {onRetry && (
          <Button variant="danger" size="sm" onClick={onRetry} icon={<Icon name="refresh" size={16} />} className="mt-2">
            Try again
          </Button>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="h-7 w-7 shrink-0 rounded-md text-red-600 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-red-600"
        >
          <Icon name="close" size={16} className="mx-auto" />
        </button>
      )}
    </div>
  );
}
