import type { Category } from '../types/product';

// no product images, so each category gets its own gradient instead
const gradients: Record<Category, string> = {
  Electronics: 'from-sky-500 to-indigo-600',
  Fashion: 'from-pink-500 to-rose-600',
  'Home & Kitchen': 'from-amber-500 to-orange-600',
  'Beauty & Personal Care': 'from-fuchsia-500 to-purple-600',
  'Sports & Outdoors': 'from-emerald-500 to-teal-600',
  'Toys & Games': 'from-yellow-400 to-orange-500',
  Books: 'from-stone-500 to-stone-700',
  'Health & Wellness': 'from-lime-500 to-green-600',
  'Food & Beverage': 'from-red-500 to-orange-600',
  'Office Supplies': 'from-slate-500 to-slate-700',
  Other: 'from-brand-500 to-violet-600',
};

export const categoryGradient = (category?: Category) => gradients[category ?? 'Other'];
