import { SVGProps } from 'react';

// Ícone inspirado no logo do Projeto Mistura: prato, faca e garfo.
export function MisturaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* prato */}
      <circle cx="12" cy="12" r="5.8" />
      {/* faca */}
      <path
        d="M4 3C5.6 4 5.8 7 5.8 11V21H3.6V11C3.6 7 3.7 4 4 3Z"
        fill="currentColor"
        strokeWidth={0.8}
      />
      {/* garfo */}
      <path d="M18 3v4c0 1.3.9 2 2 2s2-.7 2-2V3" strokeWidth={1.3} />
      <path d="M20 3v18" strokeWidth={1.5} />
    </svg>
  );
}
