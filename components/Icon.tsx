// ============================================================================
// ICONS — the role Lucide plays in the blueprint, as inline paths.
//
// Ported, not installed: the site uses a couple of dozen glyphs, and a package
// that ships a thousand of them (plus a React wrapper) is a poor trade for a
// project this deliberate about dependencies. These are drawn in Lucide's own
// grammar — 24-box, 1.8 stroke, round caps and joins, currentColor — so they
// sit beside the type at exactly the weight a Lucide icon would.
// ============================================================================

const PATHS: Record<string, React.ReactNode> = {
  check: <path d="M4 12.5 9.5 18 20 6.5" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  map: (
    <>
      <path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.2" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="19" r="2.2" />
      <circle cx="18" cy="5" r="2.2" />
      <path d="M8 19h6a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.5a3.2 3.2 0 0 1 0 6.4M21.5 20a6.5 6.5 0 0 0-4.5-6.2" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6l11-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.3 10.9 7.4-4.3M8.3 13.1l7.4 4.3" />
    </>
  ),
  seal: (
    <>
      <path d="M12 3.5c1.6 0 2.4 1.3 3.7 1.5s2.6-.5 3.7.6.4 2.4.6 3.7 1.5 2.1 1.5 3.7-1.3 2.4-1.5 3.7.5 2.6-.6 3.7-2.4.4-3.7.6-2.1 1.5-3.7 1.5-2.4-1.3-3.7-1.5-2.6.5-3.7-.6-.4-2.4-.6-3.7S2.5 13.6 2.5 12s1.3-2.4 1.5-3.7-.5-2.6.6-3.7 2.4-.4 3.7-.6S10.4 3.5 12 3.5z" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  heart: <path d="M12 20s-7.2-4.7-9.1-9.1A4.9 4.9 0 0 1 12 8.3 4.9 4.9 0 0 1 21.1 10.9C19.2 15.3 12 20 12 20z" />,
  bubble: <path d="M20 5H4v11h4l4 4 4-4h4zM8 10.5h8" />,
  gift: (
    <>
      <path d="M4 10h16v10H4zM3 6h18v4H3zM12 6v14" />
      <path d="M12 6c-2.8 0-4.6-1.1-4.6-2.4C7.4 2.3 8.8 1.9 9.9 2.6 11.2 3.4 12 6 12 6zm0 0c2.8 0 4.6-1.1 4.6-2.4C16.6 2.3 15.2 1.9 14.1 2.6 12.8 3.4 12 6 12 6z" />
    </>
  ),
  reset: <path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v4.3h-4.3" />,
  gear: (
    <>
      <path d="M4 7h9m5 0h2M4 12h3m5 0h8M4 17h9m5 0h2" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="15" cy="17" r="2" />
    </>
  ),
  bulb: <path d="M9 18h6m-4.5 3h3M12 3a5.6 5.6 0 0 0-3.7 9.8c.7.6 1.2 1.4 1.2 2.2h5c0-.8.5-1.6 1.2-2.2A5.6 5.6 0 0 0 12 3z" />,
  image: (
    <>
      <path d="M3 5h18v14H3z" />
      <path d="m3 16 5-5 4 4 3-3 6 6" />
      <circle cx="8.5" cy="9" r="1.4" />
    </>
  ),
  pencil: <path d="M4 20h4L20 8l-4-4L4 16v4zM14 6l4 4" />,
  eye: (
    <>
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  arrow: <path d="M7 17 17 7M9 7h8v8" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  film: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  // The theme pair. The toggle used to wear `globe` for light — one seat away
  // from the LANGUAGE chip, which is also a globe — so the bar carried two
  // globes meaning two different things. A sun and a moon say it without a
  // tooltip, in any language.
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </>
  ),
  // one path, so the crescent is a real cut-out rather than two stacked discs
  // that would show the ground through them on a tinted chip
  moon: <path d="M12.5 3.2A7.6 7.6 0 0 0 20.8 14 9 9 0 1 1 12.5 3.2Z" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  telegram: <path d="M21 4 3.5 11l5.6 2 2.2 6.5 3.1-3.9 5 3.7L21 4zM9.1 13l8.4-6.3" />,
  whatsapp: (
    <>
      <path d="M4 20l1.3-4A8.5 8.5 0 1 1 8.4 19L4 20z" />
      <path d="M9.4 8.8c.2 2.6 2.4 4.9 5.2 5.4l1.1-1.3-1.9-.9-.8.9a4.7 4.7 0 0 1-2.2-2.2l.9-.8-.9-1.9-1.4.8z" />
    </>
  ),
};

export default function Icon({
  name,
  size = 20,
  className,
}: {
  name: keyof typeof PATHS | string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {PATHS[name] ?? PATHS.check}
    </svg>
  );
}
