import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
          <Icon name="sparkles" size={22} />
        </div>
        <div>
          <Typography variant="title">AI Product Card Generator</Typography>
          <Typography variant="muted">
            Add a few product details and get a title, description, tags and tagline back.
          </Typography>
        </div>
      </div>
    </header>
  );
}
