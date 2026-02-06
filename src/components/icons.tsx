import type { SVGProps } from "react";

export function Kettlebell(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4.75 12.75h14.5" />
      <path d="M9 12.75v-2c0-2.5 4-2.5 4 0v2" />
      <path d="M6.5 12.75v3.25c0 4.5 7.5 4.5 7.5 0v-3.25" />
    </svg>
  );
}
