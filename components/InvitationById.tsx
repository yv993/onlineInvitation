import { notFound } from "next/navigation";
import Card from "@/components/Card";
import TemplateView from "@/components/templates/TemplateView";
import { cleanGuest } from "@/lib/i18n";
import { decodeDraft, draftCouple } from "@/lib/draft";
import { findStyle } from "@/lib/styles";
import { findTemplate } from "@/lib/templates";
import { findLink } from "@/lib/server/store";
import { parseKidsTpl } from "@/lib/kids";
import KidsInvitation from "@/components/kids/KidsInvitation";
import { parseWTpl } from "@/lib/wcards";
import WInvitation from "@/components/wcards/WInvitation";
import { parseLiveTpl } from "@/lib/invitations/styles";
import { draftToInvitation } from "@/lib/invitations/fromDraft";
import TemplateRenderer from "@/components/invitations/TemplateRenderer";
import type { Lang } from "@/lib/content";

// ============================================================================
// /invitation/<id> — THE guest link. One route, three kinds of id:
//
//   • a catalog style   (kniq | luys | tuf)   → the envelope Card, sample or ?p=
//   • a template id     (wedding-1 … )        → the live template, sample or ?p=
//   • a short link      (6 chars, from the wizard's "Generate Web Link")
//                                             → the stored template + stored draft
//
// A short link is what a couple actually sends: /invitation/k7m2xq is short
// enough for a WhatsApp thread and carries no blob. The blob lives in
// data/links.jsonl (see lib/server/store.ts for the storage contract and its
// serverless caveat). Anything else is a 404, never a 500.
// ============================================================================

type Search = Record<string, string | string[] | undefined>;

export default async function InvitationById({ lang, id, sp }: { lang: Lang; id: string; sp: Search }) {
  const base = lang === "hy" ? "" : "/en";
  const guest = cleanGuest(sp.g);

  // 1. catalog style
  if (findStyle(id)) {
    const draft = decodeDraft(sp.p);
    return <Card lang={lang} guest={guest} inv={id} who={draft ? draftCouple(draft) : undefined} blob={typeof sp.p === "string" && draft ? sp.p : ""} />;
  }

  // 2. live template
  const tpl = findTemplate(id);
  if (tpl) {
    const draft = decodeDraft(sp.p) ?? undefined;
    return <TemplateView lang={lang} s={tpl} base={base} draft={draft} mapUrl={draft?.map} />;
  }

  // 3. a kids' card — kids-<card>-<variant>, sample or ?p=
  const kid = parseKidsTpl(id);
  if (kid) {
    const draft = decodeDraft(sp.p) ?? undefined;
    return <KidsInvitation lang={lang} card={kid.card} variant={kid.variant} draft={draft} blob={typeof sp.p === "string" && draft ? sp.p : undefined} />;
  }

  // 3b. a wedding card — wed-<design>-<colour>, sample or ?p= (+ ?g= for the envelope)
  const wed = parseWTpl(id);
  if (wed) {
    const draft = decodeDraft(sp.p) ?? undefined;
    return <WInvitation lang={lang} card={wed.card} variant={wed.variant} draft={draft} blob={typeof sp.p === "string" && draft ? sp.p : undefined} guest={guest || undefined} />;
  }

  // 3c. the engine — live-<style>, sample or ?p= (+ ?g=)
  const live = parseLiveTpl(id);
  if (live) {
    const draft = decodeDraft(sp.p) ?? undefined;
    return <TemplateRenderer data={draftToInvitation(draft, live.id)} lang={lang} guest={guest || undefined} blob={typeof sp.p === "string" && draft ? sp.p : undefined} />;
  }

  // 4. short link
  const link = await findLink(id);
  if (link) {
    const draft = decodeDraft(link.draft) ?? undefined;
    const st = findStyle(link.tpl);
    if (st) return <Card lang={lang} guest={guest} inv={link.tpl} who={draft ? draftCouple(draft) : undefined} blob={draft ? link.draft : ""} />;
    const lt = findTemplate(link.tpl);
    if (lt) return <TemplateView lang={lang} s={lt} base={base} draft={draft} mapUrl={draft?.map} eventId={id} />;
    const lk = parseKidsTpl(link.tpl);
    if (lk) return <KidsInvitation lang={lang} card={lk.card} variant={lk.variant} draft={draft} blob={draft ? link.draft : undefined} eventId={id} />;
    const lw = parseWTpl(link.tpl);
    if (lw) return <WInvitation lang={lang} card={lw.card} variant={lw.variant} draft={draft} blob={draft ? link.draft : undefined} guest={guest || undefined} eventId={id} />;
    const ll = parseLiveTpl(link.tpl);
    if (ll) return <TemplateRenderer data={draftToInvitation(draft, ll.id, undefined, id)} lang={lang} guest={guest || undefined} blob={draft ? link.draft : undefined} />;
  }

  notFound();
}
