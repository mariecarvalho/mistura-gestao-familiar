import { SVGProps } from 'react';

// Logo do Projeto Mistura em SVG: prato com o nome, faca e garfo.
// Usa currentColor: defina a cor com text-white, text-primary, etc.
export function MisturaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 260 200"
      role="img"
      aria-label="Projeto Mistura"
      {...props}
    >
      {/* faca */}
      <path
        d="M30 14C41 24 43 66 43 104V188H25V104C25 66 23 24 30 14Z"
        fill="currentColor"
      />
      {/* garfo */}
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M205 16v46c0 13 8 19 18 19s18-6 18-19V16" strokeWidth={9} />
        <path d="M223 16v172" strokeWidth={13} />
      </g>
      {/* prato */}
      <circle cx="124" cy="102" r="78" fill="none" stroke="currentColor" strokeWidth={5} />
      <g
        fill="currentColor"
        fontFamily="Poppins, system-ui, sans-serif"
        fontWeight={800}
        fontSize={27}
        letterSpacing={2}
        textAnchor="middle"
      >
        <text x="124" y="96">PROJETO</text>
        <text x="124" y="130">MISTURA</text>
      </g>
    </svg>
  );
}
