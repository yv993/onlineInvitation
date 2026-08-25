"use client";

// A CTA that scrolls to a section of the same page. With Lenis driving the
// scroll, a bare anchor JUMPS (the browser moves, Lenis snaps back on the
// next frame) — so this rides the published instance, the same way SiteNav's
// links do, and falls back to native smooth scroll before Motion has mounted
// or under reduced motion. Still an <a href="#id">: no JS, no problem.
export default function ScrollLink({ to, className, children }: {
  to: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className={className}
      href={`#${to}`}
      onClick={(e) => {
        const el = document.getElementById(to);
        if (!el) return;
        e.preventDefault();
        const l = window.__lenis;
        if (l) l.scrollTo(`#${to}`, { offset: -66 });
        else el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${to}`);
      }}
    >
      {children}
    </a>
  );
}
