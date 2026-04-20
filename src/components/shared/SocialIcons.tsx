interface IconProps {
  className?: string;
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.5 3h-2.75v12.25a2.75 2.75 0 1 1-2.75-2.75c.27 0 .53.04.78.11V9.77a5.75 5.75 0 1 0 4.72 5.66V9.1a7.3 7.3 0 0 0 4.25 1.37V7.7A4.55 4.55 0 0 1 16.5 3Z" />
    </svg>
  );
}
