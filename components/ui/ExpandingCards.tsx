import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import ScheduleGlyph from "@/components/invitations/icons";
import type { ScheduleIcon } from "@/types/invitation";

// ============================================================================
// THE EXPANDING CARDS — the wedding examples as a row of slats: every design
// standing on its edge, the one under the hand opening to five times the
// width of the others while its neighbours give way.
//
// The reference is a React component that keeps an `activeIndex` in state, a
// `resize` listener to learn whether it is on a desktop, and a memoised
// `gridTemplateColumns` string rebuilt on every hover. This is the same
// anatomy with NONE of that: the state is the CSS `:hover`/`:focus-visible`
// the browser already tracks, and the open/closed value rides ONE registered
// custom property, `--kn-open`, which every part of the slat reads:
//
//     flex-grow    1 → 5      the slat opens
//     filter       grey → colour
//     scale        1.08 → 1   the picture settles as it opens
//     the rail     1 → 0      the sideways title fades out
//     the body     0 → 1      the icon, name, line and verb fade in
//
// One transition on `--kn-open` therefore moves all five together, and the
// component ships ZERO JavaScript — so it is finished for a no-JS visitor and
// its motion is a hover state, never a parked one.
//
// The first slat stands open until a pointer or the keyboard chooses another
// (the reference's `defaultActiveIndex`), and on a phone the row becomes a
// snap-scrolling strip of phone-shaped cards, every one already open — the
// device the invitation is actually opened on gets the examples at the size
// it will show them.
// ============================================================================

export type ExpandCard = {
  id: string;
  title: string;
  desc: string;
  img: StaticImageData;
  icon: ScheduleIcon;
  href: string;
  /** the page's FULL-LENGTH mobile capture — on hover the slat TOURS it,
   *  panning top to bottom; at rest its top is the first screen */
  strip?: StaticImageData;
};

export default function ExpandingCards({ items, label, open, className = "" }: { items: ExpandCard[]; label: string; open: string; className?: string }) {
  return (
    <ul className={`kn-xc ${className}`} aria-label={label}>
      {items.map((it, i) => (
        <li className="kn-xc__it" key={it.id}>
          <Link className="kn-xc__a" href={it.href}>
            {it.strip ? (
              <span className="kn-xc__tour" aria-hidden="true">
                <Image className="kn-xc__strip" src={it.strip} alt="" sizes="(max-width: 899px) 64vw, 360px" priority={i === 0} draggable={false} />
              </span>
            ) : (
              <Image className="kn-xc__img" src={it.img} alt="" fill sizes="(max-width: 899px) 76vw, 42vw" priority={i === 0} draggable={false} />
            )}
            <span className="kn-xc__scrim" aria-hidden="true" />
            {/* the sideways title, for a slat that is standing closed */}
            <span className="kn-xc__rail" aria-hidden="true">{it.title}</span>
            <span className="kn-xc__body">
              <span className="kn-xc__ic" aria-hidden="true"><ScheduleGlyph icon={it.icon} size={24} /></span>
              <b className="kn-xc__t">{it.title}</b>
              <span className="kn-xc__d">{it.desc}</span>
              <span className="kn-xc__go">{open}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
