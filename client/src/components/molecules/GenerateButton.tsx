import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

export function GenerateButton({ loading }: { loading: boolean }) {
  return (
    <Button type="submit" size="lg" fullWidth loading={loading} icon={<Icon name="sparkles" />} className="sm:flex-1">
      {loading ? 'Generating...' : 'Generate Product Content'}
    </Button>
  );
}
