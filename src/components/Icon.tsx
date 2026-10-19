type IconName =
  | 'phone'
  | 'route'
  | 'arrow'
  | 'arrow-down'
  | 'reset'
  | 'external'
  | 'menu'
  | 'close'
  | 'map'
  | 'tag'
  | 'brush'
  | 'facebook'
  | 'check';

const paths: Record<IconName, JSX.Element> = {
  tag: (
    <>
      <path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1l7.9 7.9a1.4 1.4 0 0 1 0 2l-6.1 6.1a1.4 1.4 0 0 1-2 0Z" />
      <circle cx="8.2" cy="8.2" r="1.6" />
    </>
  ),
  brush: (
    <>
      <path d="M14.5 4.5 19.5 9.5 11 18l-5-5Z" />
      <path d="M6 13c-2 0-2.5 2-2.5 3.5S3 20.5 3 20.5s3 .5 4.5-1S9 16 8.5 15.5" />
    </>
  ),
  facebook: (
    <path d="M14.5 3.5H13A3.5 3.5 0 0 0 9.5 7v3H7v3.5h2.5v7h3.5v-7h2.5l.5-3.5h-3V7.5a1 1 0 0 1 1-1h1.5Z" />
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  phone: (
    <path d="M6.6 3.5h2.6l1.3 4-1.9 1.3a12 12 0 0 0 6.6 6.6l1.3-1.9 4 1.3v2.6a2 2 0 0 1-2.1 2A16.6 16.6 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1Z" />
  ),
  route: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  map: (
    <>
      <path d="m3.5 6.5 5.5-2.5 6 2.5 5.5-2.5v13.5l-5.5 2.5-6-2.5-5.5 2.5Z" />
      <path d="M9 4v13.5M15 6.5V20" />
    </>
  ),
  arrow: <path d="M4.5 12h15m-5.5-5.5L19.5 12 14 17.5" />,
  'arrow-down': <path d="M12 4.5v15m-5.5-5.5L12 19.5l5.5-5.5" />,
  reset: (
    <>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4.5 4.5v4.2h4.2" />
    </>
  ),
  external: (
    <>
      <path d="M13.5 4.5h6v6" />
      <path d="M19.5 4.5 11 13" />
      <path d="M18 14v5.5H4.5V6H10" />
    </>
  ),
  menu: <path d="M4 8h16M4 16h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
