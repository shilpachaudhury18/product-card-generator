const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
};

// decorative - whatever shows the spinner should also show some text for screen readers
export function Spinner({ size = 'md' }: { size?: keyof typeof sizes }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 animate-spin rounded-full border-current border-r-transparent ${sizes[size]}`}
    />
  );
}
