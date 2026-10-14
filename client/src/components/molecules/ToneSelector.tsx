import { TONES } from '../../types/product';
import type { Tone } from '../../types/product';

const hints: Record<Tone, string> = {
  Professional: 'Clear and to the point',
  Friendly: 'Warm and casual',
  Premium: 'Polished and classy',
  Persuasive: 'Sells the benefits',
};

interface Props {
  value: Tone;
  onChange: (value: Tone) => void;
}

// styled radio buttons rather than a dropdown so all four options are visible at once
export function ToneSelector({ value, onChange }: Props) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-slate-700">Tone</legend>
      <div className="grid grid-cols-2 gap-2">
        {TONES.map((tone) => {
          const selected = tone === value;
          return (
            <label
              key={tone}
              className={`flex cursor-pointer flex-col rounded-lg border px-3 py-2 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600 ${
                selected
                  ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              <input
                type="radio"
                name="tone"
                value={tone}
                checked={selected}
                onChange={() => onChange(tone)}
                className="sr-only"
              />
              <span className="font-medium">{tone}</span>
              <span className={`text-xs ${selected ? 'text-brand-600' : 'text-slate-500'}`}>{hints[tone]}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
