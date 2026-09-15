/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

// src/components/layout/Logo.tsx
import type { SVGProps } from 'react';
import { LOGO_LETTERS } from '@/lib/constants';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 40" // ViewBox adjusted for "VS" or similar short text
      width="50" // Default width, can be overridden
      height="40" // Default height, can be overridden
      aria-label={`${LOGO_LETTERS} Imports Logo`}
      {...props}
    >
      <defs>
        <linearGradient id="vsLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary-foreground))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <text
        x="50%" // Center horizontally
        y="32"
        fontFamily="var(--font-geist-sans), sans-serif"
        fontSize="30" // Adjusted font size for potentially variable letters
        fontWeight="bold"
        fill="url(#vsLogoGradient)"
        textAnchor="middle" // Ensure text is centered
      >
        {LOGO_LETTERS}
      </text>
    </svg>
  );
}
