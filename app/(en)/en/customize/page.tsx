import type { Metadata } from "next";
import { pageMeta } from "@/components/Shell";
import CustomizePage from "@/components/CustomizePage";
import { decodeDraft } from "@/lib/draft";

export const metadata: Metadata = pageMeta("en", "/customize", { title: "KNIQ — Build your invitation" });

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  // ?a= ?b= ?date= are carried from the landing's card chapter, where the
  // couple already typed them once. Trimmed and length-capped here: they
  // come off a query string, which anyone can write.
  const str = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined);
  return (
    <CustomizePage
      lang="en"
      category={typeof sp.category === "string" ? sp.category : undefined}
      tpl={typeof sp.tpl === "string" ? sp.tpl : undefined}
      seed={(() => {
        // the detail window sends the WHOLE card as a ?p= blob; decodeDraft is
        // the hardened sanitiser every guest link already passes through, so
        // its output needs no second scrubbing. Bare a/b/date params (the
        // chapter's three boxes) remain the fallback.
        const d = decodeDraft(sp.p);
        if (d) {
          return {
            a: d.a || undefined, b: d.b || undefined, date: d.date || undefined,
            time: d.time || undefined, venue: d.venue, address: d.address,
            city: d.city || undefined, rsvpBy: d.rsvpBy, host: d.host, note: d.note,
          };
        }
        return {
          a: str(sp.a, 40),
          b: str(sp.b, 40),
          date: typeof sp.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : undefined,
        };
      })()}
    />
  );
}
