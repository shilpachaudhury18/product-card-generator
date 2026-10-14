import type { ReactNode } from 'react';

interface Props {
  header: ReactNode;
  form: ReactNode;
  results: ReactNode;
}

// form on the left and results on the right on big screens, stacked on mobile
export function ProductGeneratorLayout({ header, form, results }: Props) {
  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>

      {header}

      <main id="main" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[5fr_7fr] lg:gap-8">
          <div className="lg:sticky lg:top-6">{form}</div>
          <div className="min-w-0">{results}</div>
        </div>
      </main>
    </div>
  );
}
