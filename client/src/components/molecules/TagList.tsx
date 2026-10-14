import { Badge } from '../atoms/Badge';

interface Props {
  tags: string[];
  label?: string;
  className?: string;
}

export function TagList({ tags, label = 'Tags', className = '' }: Props) {
  if (!tags.length) return null;

  return (
    <ul aria-label={label} className={`flex flex-wrap gap-1.5 ${className}`}>
      {/* tags are de-duped on the server, so the text works as a key */}
      {tags.map((tag) => (
        <li key={tag}>
          <Badge color="brand">{tag}</Badge>
        </li>
      ))}
    </ul>
  );
}
