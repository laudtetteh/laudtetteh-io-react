/**
 * Shared Tailwind class strings for the admin panel, matching the
 * /redesign design system's tokens (Inter font, teal accent, slate palette)
 * so admin no longer looks like a different, unstyled site.
 */

export const inputClasses =
  'w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/30';

export const labelClasses = 'mb-1.5 block text-sm font-medium text-slate-900';

export const primaryButtonClasses =
  'inline-flex items-center justify-center rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60';

export const secondaryButtonClasses =
  'inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60';

export const dangerButtonClasses =
  'inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60';

export const cardClasses = 'rounded-xl border border-slate-200 bg-white shadow-sm';
