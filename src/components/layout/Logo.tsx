// src/components/layout/Logo.tsx
import type { SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 40" // ViewBox adjusted for "VS"
      width="50" // Default width, can be overridden
      height="40" // Default height, can be overridden
      aria-label="VS Imports Brasil Logo" // Accessibility
      {...props} // Spread remaining props like className, fill, etc.
    >
      <defs>
        <linearGradient id="vsLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary-foreground))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <text
        x="2" // Slightly offset for better visual centering
        y="32" // Adjusted y for vertical alignment within 40px height viewbox for a 35px font
        fontFamily="var(--font-geist-sans), sans-serif"
        fontSize="35"
        fontWeight="bold"
        fill="url(#vsLogoGradient)"
      >
        VS
      </text>
    </svg>
  );
}
