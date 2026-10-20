import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combines class names and resolves conflicting Tailwind classes
// (e.g. cn('px-2', 'px-4') -> 'px-4'). Used by the shadcn/ui components.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
