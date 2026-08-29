import Link from "next/link";
import type { Metadata } from "next";

// ============================================================================
// THE LAST-RESORT 404 — and it depends on NOTHING.
//
// Every real miss is now caught by the per-group catch-alls
// (app/(hy)/[...rest], app/(en)/en/[...rest], app/(ru)/ru/[...rest]), which
// render inside a root layout and therefore get the fonts, the stylesheet and
// the site's own nav and footer. This file is what is left: the case Next
// renders OUTSIDE every root layout, because with three of them it cannot pick
// one.
//
// Measured, that context has no stylesheet link and no class on <html>. So an
// earlier version of this file that imported globals.css and the font classes
// produced a page in Times New Roman on bare white — it asked for a design
// system that had not been delivered to it. Everything here is therefore
// INLINE and self-contained: no CSS import, no custom properties, no font
// variables, no components that assume any of them. It should never be seen;
// if it is, it still reads like the product.
// ============================================================================

export const metadata: Metadata = {
  title: "ԿՆԻՔ — 404",
  robots: { index: false, follow: false },
};

const wrap: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  padding: "3rem 1.25rem",
  textAlign: "center",
  background: "#f3efe7",
  color: "#1c1a17",
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const seal: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "5.5rem",
  height: "5.5rem",
  borderRadius: "50%",
  background: "radial-gradient(circle at 38% 32%, #a2793f, #7b5c31 68%)",
  boxShadow: "0 10px 26px rgba(0,0,0,.22)",
  color: "#f3efe7",
  fontSize: "1.45rem",
  letterSpacing: "0.04em",
};

const btn: React.CSSProperties = {
  display: "inline-block",
  padding: "0.85rem 1.9rem",
  borderRadius: "999px",
  border: "1px solid #ddd5c5",
  background: "#1c1a17",
  color: "#f3efe7",
  textDecoration: "none",
  fontFamily: "system-ui, sans-serif",
  fontSize: "0.95rem",
};

const ghost: React.CSSProperties = { ...btn, background: "transparent", color: "#1c1a17" };

export default function GlobalNotFound() {
  return (
    <div style={wrap}>
      <div style={seal} aria-hidden="true">
        404
      </div>
      <h1 style={{ margin: 0, fontSize: "clamp(1.7rem, 6vw, 2.4rem)", fontWeight: 400, lineHeight: 1.15 }}>
        Այս էջը չկա
      </h1>
      <p style={{ margin: 0, maxWidth: "44ch", lineHeight: 1.6, color: "#4a453d", fontFamily: "system-ui, sans-serif", fontSize: "0.98rem" }}>
        Հղումը կարող է սխալ արտագրված կամ կիսատ պատճենված լինել։
        <br />
        The link may have been mistyped, or copied only half-way.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.7rem", justifyContent: "center", marginTop: "0.5rem" }}>
        <Link href="/" style={btn}>
          Գլխավոր էջ
        </Link>
        <Link href="/en" style={ghost}>
          English
        </Link>
      </div>
    </div>
  );
}
