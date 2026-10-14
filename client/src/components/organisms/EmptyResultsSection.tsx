import { EmptyState } from '../atoms/EmptyState';
import { Icon } from '../atoms/Icon';

export function EmptyResultsSection() {
  return (
    <EmptyState
      icon={<Icon name="box" size={24} />}
      title="Nothing here yet"
      description="Fill in the form and hit Generate - your product cards will show up here."
    />
  );
}
