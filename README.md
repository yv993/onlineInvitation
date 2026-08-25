# ԿՆԻՔ — KNIQ

A digital-invitation **service**: couples choose a style, send their day, and
hand their guests one link. Armenian first, English second, opened on a phone.

```bash
npm install
npm run dev      # http://localhost:4100
```

| Route | What it is |
|---|---|
| `/` · `/en` | The service — nav, tilt hero, categories, showcase, the three-step order flow, features, pricing, gallery feed, footer |
| `/wedding-live` (+ `?style=`) | **The web-invitation engine** — one schema, nine template styles (A «Classic Floral», B «Modern Cinematic», C «Destination Ticket», D «Pearls», E «Dusty Blue Reveal» + engagement / baptism / birthday / gala); a phone-frame showcase in the wedding part, every style bound live to the wizard |
| `/wedding-cards` (+ `?style=` `?collection=`) · `/wedding-cards/<design>` | **Wedding cards, in an envelope** — 40 original designs, the Greenvelope anatomy: catalogue facets, design page, Customize + envelope/liner/stamp/seal/backdrop, the open animation |
| `/kids` (+ `?theme=`) · `/kids/<card>` | **Kids' birthday cards** — 44 original designs, 27 themes; the studio turns a card into the invitation as the parent types |
| `/customize` (+ `?category=` `?tpl=`) | **The wizard** — five steps; step 1 is the EXAMPLES panel (web templates · engine styles · wedding cards, each with features and its price, Preview + Choose); live previews, Live Demo, Generate Web Link |
| `/invitation/<id>` | **The guest link** — a style id, a template id, a kids card id (`kids-…`), a wedding card id (`wed-<design>-<colour>`, + `?g=` for the addressed envelope), an engine style (`live-<style>`, + `?g=` for the greeting), all take `?p=`; or a 6-character short id |
| `/order` (+ `?style=&occasion=&p=`) | The order flow on its own route — `?p=` prefills it from the wizard |
| `/templates/kniq` · `/templates/luys` · `/templates/tuf` | One style at length, with a live phone preview |
| `/i/kniq` · `/i/luys` · `/i/tuf` (+ `/en/…`) | The catalog as LIVE invitations — the same verified card in three measured styles |
| `/invitations/<category>-<n>` | The fifteen live templates (SSG) |
| `/guests?key=…` | The couple's dashboard — totals, the list, Excel export, dietary roll-up, the nudge |
| `/api/rsvp` · `/api/order` · `/api/ics` (`?t=` or `?p=`) · `/api/rsvp/export` · `/api/link` · `/api/photo/<id>` | The working endpoints behind all of it |

**Sample content.** Nare and Hayk do not exist; dates, addresses and prices are
illustrative, and both footers say so.

## The web-invitation engine — /wedding-live, /invitation/live-<style>

The «send it as a web page» way, rebuilt as an ENGINE rather than a set of
pages: one typed data object, nine template styles that all render it, and the
wizard's state bound to every one of them at once. Two references were measured
for the structure (never the art): **Invito W121** (invito.am/en/product/
wedding-invitation-w121 — the classic centered card: gate, monogram, names,
countdown, families line, timeline with map buttons, dress code, gallery, RSVP,
music) and **iStudio 1046** (istudio.am/templates/1046 — the cinematic one:
full-screen video hero with mute, day numeral, glass timeline cards, RSVP in a
modal, «days left»). Both live in the wedding part; the four extended
templates reuse the same sections for the other occasions.

**The schema — `types/invitation.ts`.** `InvitationData` = `identity` (hosts,
kicker, subtitle, families line, blurb, date/end, city, monogram) · `assets`
(hero media — image or video with poster and a `synthesized` flag, palette,
font, audio, gallery, ambient overlay) · `schedule` (blocks with icon · time ·
title · venue · address · mapUrl · note, connector style) · `features`
(countdown `days|dhms|age`, calendar, maps provider + directions, dress-code
swatches, gallery layout + lightbox, RSVP config — deadline, side, guest count,
diet, allergy, message, export `excel|sheets|both`, inline or modal — ics,
share, music, gate, epigraph, details) · `extras` (godparents, born, message
board, speakers, agenda, channel, wishes, hotel, destination) · `meta` (sample flag, footer line). Nine typed mock
objects in `lib/invitations/mock.ts` (wedding classic, cinematic, ticket, pearls, dusty blue,
engagement, baptism, birthday, gala); the style registry with each style's
measured section order in `lib/invitations/styles.ts`; and the adapter
`lib/invitations/fromDraft.ts` that lays a wizard `Draft` over a mock — names,
families line, date, stops → schedule blocks with icons guessed from the stop
name, dress swatches, RSVP-by, map provider, godparents, born, video toggle,
music URL — so a wizard state IS an `InvitationData`.

**The renderer — `components/invitations/`.** `sections.tsx` holds the reusable
parts — `<HeroHeader/>` (centered · cinematic video with mute/unmute · strip ·
neon · clouds; monogram, kicker, names, date or day numeral), `<CountdownTimer/>`,
`<MonthCalendar/>`, `<ProgramTimeline/>` (cards · glass · tabs · compact, an
IntersectionObserver marks each stop as it enters) with `<VenueMapButton/>`
(the block's map link, or Google directions to the venue), `<DressCodeSwatches/>`,
`<PhotoGallery/>` (grid · masonry · strip · pair, with the lightbox),
`<IntroBlurb/>`, `<Epigraph/>`, `<DetailsNote/>`, `<IcsLink/>`,
`<GodparentsCard/>`, `<SpeakersRow/>`; `RsvpModal.tsx` is the RSVP form (yes/no,
side, guest stepper, diet chips, allergy, message) inline or in a portalled
modal, posting to `/api/rsvp` tagged with the style's event so the sample
deadline never touches it; `TemplateRenderer.tsx` composes them per style —
`ClassicFloral`, `ModernCinematic`, `EngagementStd`, `BaptismKunk`,
`BirthdayAnniv`, `GalaCorporate` — under a `.iv` root that carries the palette
as `--iv-*` tokens, the gate (tap → audio autoplays, Motion mounts, the hero
rises), the floral/particle ambient, the audio dock, the footer, and a `compact`
mode for previews.

**Three more wedding styles (C · D · E)** — measured from two AreOne
screenshots and a Pinterest reveal video, added to the same engine:

- **C · Destination Ticket** (after AreOne «Wedding Ticket — a destination to
  remember», Lake Como → Lake Sevan): navy ground, cream perforated tickets
  (`.iv-tk`, radial-gradient punch holes Ø12 at 16px pitch); the boarding pass
  IS the gate («Board now») and the page's head — «WEDDING TICKET», plane, line
  globe, names with a script «and», the 2×2 table (flight & date · class ·
  destination · wedding location), a round stamp with the names on a text
  path, postmark waves, «Boarding for love», a vertical «Departure»; then
  «Dear friends and family» + photo + the dashed flight path (`<FlightPath/>`),
  «We are waiting for you» + the month calendar in a cream card with the day
  in red + «Save the date 14.11.2026» ♥ + the days countdown, the luggage tag
  (`extras.destination`), the VENUE ticket («How to get there», the photo, the
  city stamp), the dotted timeline with times on the right, labelled dress-code
  swatches (`dressCode.labels`), Women · Men plates, RSVP on cream.
- **D · Pearls** (after AreOne «Pearls»): ivory paper, pearl strings, the
  top bar (logo · «14 11 26»), names stacked huge in the geometric sans, a
  script «Our wedding day!», a B&W photo; «Dear friends! — You're invited» as
  a white note card with a paper clip on a kraft envelope with the monogram
  (`<NoteOnEnvelope/>`); the three-day strip with a pearl pendant
  (`calendar.mode: "strip"`, `<DayStrip/>`); VENUE on a silver tray —
  ceremony · banquet, «View on map» (`<TrayVenues/>`); PROGRAM of the day on
  a taupe band with the hours alternating along a string of pearls
  (`ProgramTimeline layout="pearls"` + `<PearlString/>`, beads placed along a
  cubic bezier deterministically); fabric dress-code circles + «View
  examples»; «Our channel — Telegram» (`extras.channel`, the Join link is set
  at order time); «Wishes» (`extras.wishes`); RSVP.
- **E · Dusty Blue Reveal** (after the Ewedlab «Dusty Blue» animated
  envelope-reveal video on Pinterest — the Etsy/Canva register, read frame by
  frame): the gate is an embossed dusty-blue GATEFOLD envelope whose two
  flaps swing open on the tap (`gate.variant: "gatefold"`, the relief = the
  wedding motif symbols drawn thrice with light/shade offsets); then card 1 —
  butterfly, «WE'RE GETTING MARRIED», script names; card 2 — the arched photo
  with four diamonds and the date block (month · weekday DAY at time · year ·
  «reception to follow», `<DateBlock/>`); card 3 — a sprig, script «timeline»,
  the centred list with thin rules (`layout="centered"`); card 4 — «THE
  details»: a QR of this very page (`features.qr`, lib/qr), the dress-code
  hearts (`dressCode.shape: "heart"`), the recommended hotel
  (`extras.hotel`); «please RSVP by <date>» over the form (`<RsvpHead/>`); a
  navy end card with an ornate oval frame around the script names.

**«Կնիք և ժապավեն» — the wax-seal invitation (wedding-2, reworked).** The
second wedding template was rebuilt after priglasi.pro's wax-seal invitation
(pinterest.com/pin/1014576622302916830), measured, never copied: a sheet of
cream paper HANGING over a plaster ground and cut to a pennant point, carrying
the monogram over a hairline, the date in letterspaced caps and the names in a
handwriting script — and a wax seal poured over the point with a floral relief
pressed into it. The paper is a gradient plus drawn grain, the wax is a
deterministic wobbled disc (twelve fixed radii, smoothed — the server and the
browser pour the same seal), the relief and the sprigs are line art:
`components/templates/SealBanner.tsx`, no asset and no licence. Two new block
flags carry it — `sealBanner` and `hashtag` (the reference's «wedding hashtag»
band: a script title over a caps paragraph). The palette was MEASURED before it
was used: ink on the plaster ground 9.01:1, ink on the cream paper 15.59:1, the
soft grey 7.08:1 on paper — and the copper #B87333 is 3.45:1, so it is wax and
ornament only, never a word; the darker #8A5324 (5.72:1) carries the words. The
countdown wears the reference's four hairline-divided cells and the dress code
its three big dots (ivory · black · copper foil). The seal lives OUTSIDE the
pennant in the DOM: the paper is clipped to its point, and a clip-path clips its
children too — a seal inside it loses exactly the half that should overhang.

**«Հեքիաթի հովիտ» — the scene invitation (birthday-4).** A fourth birthday
template, built after three animated scene invitations the client sent
(pinterest.com/pin/1020206121835971536 — an illustrated wedding scene;
953496552376593884 and 76561262410085706 — two 10-second valley flythroughs;
a fourth link, 1283558124836454, is dead, so nothing came from it). What was
measured off them, frame by frame: the picture is A STACK OF FLAT LAYERS with
real depth; the camera DOLLIES THROUGH A FOREGROUND ARCH while the far range
barely moves; a scalloped ornament band HANGS FROM THE TOP EDGE over
everything; the title RESOLVES OUT OF A BLUR; and small things keep drifting
across the air. Here THE SCROLL IS THE CAMERA
(`components/templates/SceneHero.tsx`, `Motion.tsx` → `data-scene`): nine
layers each carry a `data-depth`, the parallax is scrubbed against it, and the
arch — a balloon arch, because this is a birthday — grows past the reader and
out of frame as they scroll in; on arrival the stack assembles back to front,
the way the illustrated reference pulls out of its foliage.
Since then the diorama gained a REAL lens: the stage carries CSS
`perspective`, and every layer sits at a true `translateZ`, pre-scaled by
(P − z)/P about the frame's centre — the compensation is exact because each
layer is oversized symmetrically, so the projected at-rest frame IS the flat
no-JS page, pixel for pixel. The scroll dollies the layers toward the lens (z
only — the growth comes from the perspective itself), a fine pointer tilts
the whole box a few degrees under the cursor while the type counter-tilts in
front of it (true parallax: the planes really sit apart in z), the canopy
swings from its rail, the arch sides sway with their own
`transformPerspective`, and the balloons bob. The mirrored arch side is
rotated on the INNER svg, never on the `scaleX(-1)` wrapper — GSAP reads
that matrix back as a 180° rotation and turns the sway inside out. Everything is
DRAWN: the range, the far spires, the treelines, the pond and its flattened
reflection, the poplars, the lit garland, the flower meadow, the leaves and the
balloons — paths and gradients plus one integer-only pseudo-random for the
scatter, so the server and the browser draw the same valley (no asset, no
licence, no third-party request). The foreground is anchored by CSS rather than
sliced with the landscape layers: a sliced viewBox keeps only its middle third
at 390px, and the frame is exactly what a foreground has to hug. The palette
was MEASURED off the references before it was used: ink #3F2E22 is 10.53:1 on
the parchment and 8.84:1 on the palest measured sky, so the title needs no
plate under it; the soft brown 5.49:1; the amber #D79854 is 2.01:1 — canopy,
balloons and hairlines only, never a word — and #8C5A24 (4.75:1) carries the
age. Parked in JS only: with no JavaScript, or under reduced motion, the
valley is simply finished.

**«Ամրոցի հովիտ» — the scene whose camera never stops (birthday-5).** A fifth
birthday template, measured from ONE animated scene invitation
(pinterest.com/pin/76561262410085706): a fairytale village under a snow
massif, a GOLDEN autumn forest, a teal pond with the range lying in it, a
watermill at its edge, a flock crossing the sky — and, the grabbed thing, a
camera that pushes forward for the whole clip and never rests. It rides the
same lens and layer contract as Storybook Valley
(`components/templates/CastleScene.tsx`, block flag `castleScene`, the same
`data-scene` verb), plus what is its own: a `.kn-sc__drift` wrapper Motion
breathes forward in z BY TIME — a true dolly, since the planes keep their
depths under it — on its own wrapper so the pointer tilt never fights it; the
mill wheel turns (its geometry symmetric about the hub, so the bbox centre IS
the axle — no transform on the class element, the placement lives on a static
parent group); the flock crosses the sky and comes round; the motes are
falling golden leaves. The full-bleed hero rule is now keyed on the scene
itself (`.kn-tp__hero:has(.kn-sc)`), not on a template id — the trap that put
this valley into the split two-column hero on its first render. The palette
was MEASURED before use: ink #33291C 12.00:1 on the autumn cream, the shared
scene inks 7.90:1 / 10.21:1 on the deepest and palest sky, gold #C9A245
2.02:1 — forest and ornament only, never a word. Parked in JS only: no-JS and
reduced motion get the finished valley, wheel still, flock mid-sky.

**The vocabulary grew — the whole page moves, not just the hero.** Four new
verbs in `Motion.tsx`, applied through the shared blocks so every template
page benefits at once: `data-reveal` now takes a DIRECTION (`up` — the old
default — `left`, `right`, `iris`), and the gallery alternates them so its
plates read as pages turning, not a grid stamping in; `data-ink` wipes a
title on left-to-right like a pen stroke (every `.kn-tb__label` carries it —
elements mounted later, like the RSVP modal's, are simply never parked);
`data-count` climbs a numeral to its authored value (the scene heroes' age,
and any birthday template whose second «name» is a number — the DOM ships
the finished figure, so no-JS reads it as written, with an aria-label
pinning the real value while the text ticks); `data-hover-tilt` leans a
card a few degrees toward a fine pointer (the map card, every gallery
plate) — a hover state, so nothing is parked and touch never meets it. The
countdown cells and dress-code swatches pop in down the row (`data-pop`).
And THE HELD SHOT: a `data-scene` hero now PINS for 85% of a viewport while
the scroll walks the camera through it — the reference clips play in place,
and now so does the dolly — with a «Scroll» hint that bobs at the foot and
bows out in the first twelfth. Under reduced motion the pin never
constructs, so the page keeps its exact static height; live thumbnails are
excluded wholesale (`.kn-ex__live` joined the live-preview list), so the
home grid's miniature pages stay finished and inert.

**The web templates' RSVP asks the guest's side.** The side question
(«Ու՞մ կողմից եք» — the bride's / the groom's) already lived in the base
card, the engine's modal and the wedding cards; the one form that never
asked was `TemplateRsvp` in the shared blocks, so every RSVP from a wedding
web template landed as "both". Now it asks — two chips between the guest
count and the yes/no, on weddings AND engagements (the site's own
`occasionHasSides` rule), and OPTIONAL by design: tapping the pressed chip
clears it, and a guest of both families answers with neither, which the API
records as "both" — the same default the engine uses. No API or store
change was needed: `/api/rsvp` already validated `side`, `data/rsvp.jsonl`
already carried it, and the guests admin already had the column — proven
end-to-end by driving the real wedding-2 form (bride chip pressed → stored
row `"side":"bride"` → test row removed). The examples' anatomy lines now
say «RSVP … — with the guest's side» on wedding and engagement templates.

**The competitor's premium list, closed.** The client sent a rival's
crown-tier feature table; the audit found six of its nine already real
(music, dresscode, env-gated email confirmations, the guest-list admin,
bilingual, personalised invitations, and the «Custom» pricing tier). The
three gaps were closed, honestly:

· **Telegram** — /api/rsvp now carries a third transport: with
  `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` set, every confirmation lands
  in the couple's own chat via the Bot API. Every configured transport
  (webhook · Resend email · Telegram) is tried; `delivered` is true only
  when at least one actually accepted — the same honesty contract as
  before. TODO(owner): create the bot, set the two envs.

· **A real Excel workbook** — `/api/rsvp/export?fmt=xlsx` returns a true
  .xlsx with TWO worksheets («Պատասխաններ» — every answer; «Ամփոփում» —
  totals, the yes/no split, how the sides balance, per-event counts),
  built by `lib/server/xlsx.ts`: a store-method ZIP written by hand
  (CRC-32 and all) around minimal OOXML with inline strings, ZERO
  dependencies, Armenian intact. Verified by unzipping the served file
  with a strict extractor and reading the parts. The CSV survives beside
  it; the guests admin offers both buttons.

· **Trilingual** — `Lang` gained `ru`; `T.ru` is OPTIONAL and t() falls
  back ru → en, so nothing can vanish. The (ru) route group serves the
  GUEST surface (/ru/invitation/<id>, /ru/invitations/<slug>) — the
  marketing site stays hy/en by design. Translated: the blocks' full label
  set, both RSVP forms, the day route, weekday and month names everywhere
  (the wax seal's caps genitive included), the base card's calendar week,
  the kids' sample names, and all thirteen template kickers — so a real
  couple's /ru guest page reads Russian end to end (their own words fill
  both required slots and pass through untouched). The template chrome
  offers the other two languages; the wizard's link panel mints the SAME
  link under all three prefixes, a copy chip each. The API accepts
  lang: ru and answers its validation errors in Russian.

The pricing copy now says three languages where it said two, and the
features band gained the Telegram and Excel rows — nothing is claimed
that the code does not do.

**The order part is now a catalogue, not a swatch box** (after the client
sent istudio.am/orderlook: pick a design, fill your details, get the
invitation and its price). Step 1 of `OrderFlow` used to offer only the
three abstract wardrobes — every real invitation the project owns was
reachable from the wizard but NOT from /#order, and a template could only
arrive there by being carried in from elsewhere. Now step 1 asks the
occasion, then shows EVERY invitation that occasion can be ordered as, as
a grid of live cards: each one is the invitation's own first screen
(`ExampleThumb`) already wearing the couple's names as they type them,
with its kind badge, its tier and ITS PRICE. Kind filters (web page ·
engine · card in an envelope) narrow the list; the popular cards sit
inline and the rest are one link away, where the envelope and the
colourway are chosen. Choosing sets the `tpl` the rest of the flow already
understood, so the phone preview becomes that invitation with the couple's
own data, the total becomes its price, and the order payload carries it.
The three plain wardrobes survive, folded away, as the fallback when
nothing is picked.

The kids' cards joined the registry to make «all the examples» true: a
`kids-<card>-<variant>` example is minted the same way the wedding cards
are, so the birthday catalogue now offers sixteen invitations (five
templates, an engine style, ten kids' cards) and `findExample` resolves
any of the 44 colourways a studio link can mint. Switching occasion drops
a pick that no longer exists rather than pricing something unreachable.
Counts, verified live: wedding 18 · birthday 16 · baptism 4 · corporate 4
· engagement 2.

**The couple's own photographs, wearing the template's effects.** Uploads
used to be object URLs held in the wizard: instant in its own previews and
meaningless anywhere else — an iframe cannot load its parent's blob:
handle, no other machine can load it at all, so the guest link fell back
to the template's stock plates and the real pictures reached the studio by
hand. Now a picked photograph is downscaled in a canvas (longest side ≤
1600px, JPEG 0.82 — a 12 MP phone photograph becomes ~300 kB before a byte
leaves the device) and POSTed to `/api/photo`, which answers with a plain
same-origin path. `Draft.photos` carries those paths, so they ride the
blob into the live preview, the short link and the guest's browser.

They land in THE TEMPLATE'S OWN PLATE SLOTS — the first becomes the cover,
all of them become the gallery — which is the whole trick: nothing new was
animated. The cover already had the Ken Burns settle and the parallax
drift, the gallery already had the alternating curtain reveal, the hover
tilt and the lightbox, so an uploaded photograph inherits every one of
them by arriving in the right slot. `Plate`, `Gallery` and `Lightbox` widen
to take a path as well as a build-time import (an upload has no blur
placeholder to sit under and no intrinsic size, so it fills its frame
instead). The picker is shared by /order's step 2 and the wizard.

Nothing is trusted on the way in: only a JPEG data URL is accepted, the
magic bytes are checked (a renamed .exe is refused with 422), the size is
capped, the write is rate-limited, and the id is the link alphabet — so
`/api/photo/<id>`, which validates that alphabet, is the only path that
can be produced. A read-only disk answers 503 and the row says the
photograph was not saved, rather than showing a thumbnail that will 404
for every guest.

**The phone answers the first keystroke, and the photographs know where
they land.** Two follow-ups to the order flow.

The preview used to wait for BOTH names and a date before it would draw
anything: you could type a name, then the other name, and still be looking
at «Fill in the names and the date». The order itself still needs all
three — but the phone should not. It runs on its own lenient draft now:
the moment anything is typed (or a photograph picked) it shows the chosen
invitation wearing ITS OWN sample words for whatever is still blank, and
each field replaces one of them as it is filled. Type «Anna» into a wedding
and the phone reads Anna & Hayk on the sample date; type the date and it
becomes yours. The strict draft still gates the submit, and the STRICT one
is what is sent to the studio — never the sample-filled stand-in.

And the photographs are placed, not just uploaded. The order of the list
IS the placement — the first is the template's cover, the rest fill its
gallery in order (which is also where the fold-out templates take their
two faces from) — so every tile now SAYS where it lands («Cover», «Gallery
1», «Gallery 2») and carries the moves that put it elsewhere: earlier,
later, or straight to the front with «make it the cover». Every move
rewrites the blob, so the phone re-renders with the new arrangement
immediately.

**Why the uploads did not reach the demo, and dragging them into place.**
The photographs were wired into the web templates only. The ENGINE — every
`live-*` style, which is what the wizard's Live Demo frames for half the
catalogue — never read `draft.photos` at all, and `PhotoGallery` carried a
filter, `typeof m.src !== "string"`, that silently DISCARDED exactly the
kind of source an upload produces. Two more of the same filter sat in the
AreOne ticket's venue photograph and the Pearls stacked hero. So a couple
could add pictures, see them in the picker, and watch the demo show stock
plates.

Now `fromDraft` lays their photographs into the engine's own asset slots —
the first is the hero (a style whose hero is an ambient FILM keeps the film
and takes their picture as its poster), all of them are the gallery — and
every one of those filters accepts a path as well as a build-time import.
The wizard's own row thumbnails and the order catalogue's cards take them
through the same `face` object that already carried the typed names, so
the pictures appear everywhere the invitation is drawn, not just on the
guest page.

And the tiles are DRAGGABLE: pick one up and drop it where it should sit —
the held tile dims, the target rings in gold, and the list, the slot labels
and the phone all follow. The arrows and «make it the cover» remain for the
keyboard. The held index lives in a REF as well as in state: a handler
closing over state reads whatever React last rendered, which is stale when
the drop lands before a re-render — the ref is always right, and the drag
payload is carried as a fallback besides.

**A version's row shows the whole invitation, not its first screen.** The
wizard's preview list rendered an engine style as EVERY section (the
`embed` render) but a web template as `TemplateHeroThumb` — the hero plus
at most two blocks. Measured on «Կնիք և ժապավեն»: the pane held two
sections where the page has six, so the programme, the dress code, the
photographs and the RSVP could not be scrolled to at all, and the
fixed-390px thumbnail overflowed its frame sideways once the pane's own
scrollbar took the width (the clipped countdown). The row frames the REAL
guest page now — the same URL the Live Demo and the detail window open,
carrying the wizard's blob — so it is the invitation with its own scroll,
its own motion and the couple's own photographs, and every part is
reachable. Verified with real wheel events: the pane scrolls its full
2795px to the RSVP and the footer.

**The row is the same React tree as the form, so it answers every
keystroke.** Framing the real page fixed the scrolling but broke the
liveness: the wizard's blob is derived on every keystroke, the iframe
carried it in its `src`, and its `key` changed with it — so each typed
letter reloaded a whole page. A preview that reloads is not a preview.

`TemplateView` gained an `embed` mode instead — the same contract the
engine's `embed` render already follows: no Motion (Lenis would seize the
host's scroll), no viewport-fixed ambient (it would paint over the
wizard), no chrome, no music dock, the parked states pinned visible, and
the 100svh minimums dropped. Rendered INLINE in the row it is the same
React tree as the form, so a letter or a dropped photograph lands on the
next paint, with every section still there to scroll.

And `applyDraft` now falls back per FIELD rather than per draft: a name,
a date, a venue the couple has not typed yet keeps the template's own
sample. Nothing ever goes blank — before the first keystroke the row
shows the sample invitation whole, and each field replaces one part of it
as it is filled. Verified letter by letter: «A» → the hero reads A;
«Anna»/«Aram» → Anna · Aram; the venue lands in the map card; two
photographs land as the cover and the gallery — all without a reload.

**The catalogue shows the designs; the preview shows the couple.** The
picker's cards had been personalising too — eighteen offers all wearing
the same half-typed name is not a catalogue, it is a hall of mirrors. The
cards (in the wizard and in /order) render each design as ITS DESIGNER
MADE IT, sample words and sample plates; the couple's own names and
photographs appear in the preview column alone, which is the one place
they are asked «what will MINE look like».

**A session outlives its files.** The picked paths are remembered — the
wizard in sessionStorage, an order in its blob — but the photographs live
on the server's disk, which can be pruned, redeployed or read-only. A path
that no longer resolves rendered as a broken box captioned «Your
photograph». The picker now asks for every remembered path on mount and
drops the dead ones, silently: the couple never chose to lose them, and an
error about a file they cannot restore helps nobody. The check reads its
callback and its list through REFS — `onChange` is an inline arrow at
every call site, so depending on it re-ran the effect each render and the
cleanup cancelled the check before its answers came back, which is exactly
how the first attempt failed silently.

**Two ways to see it bigger.** A pinned bar rides the top-right of every
open preview: TALLER grows the pane from 600 to ~966px and keeps the form
beside it, so a couple can still type while they look; FULLSCREEN hands
the whole screen to the invitation (the existing Live Demo modal — the
real guest URL, «open in a new tab», Esc to close). The bar is a
ZERO-HEIGHT sticky element placed FIRST in the pane: a sticky bar after
the page sits at the end of four thousand pixels of invitation, which is
where the first attempt put it. And the Demo button no longer waits for
the names and the date — the preview falls back to the design's own sample
words, so there is always something worth showing full size.

**The wedding examples are a deck.** Eighteen invitations fanned into a
pile — one at the front, the rest behind it — turned by dragging. The
anatomy is the client's reference, measured off it and rebuilt without it:
that carousel runs on Motion and this site carries five runtime
dependencies, none of them Motion. The numbers are the reference's own —
x 170 · y 40 · 12° · −12% scale per card of offset (tighter under 1024 and
640px), a drag that moves the pile by −dx/sensitivity, a release worth
distance ÷ 200 + velocity ÷ 800 rounded and clamped to three cards, and a
spring of stiffness 200, damping 30, mass 1, integrated by hand in
components/ui/StackDeck.tsx.

Two things are deliberately NOT the reference's, and both for the same
reason — it is a carousel of pictures and this is a shop. It laid a
transparent surface over the pile and made every card pointer-inert; here
the front card must stay clickable, so the drag lives on the stage and a
click is swallowed only when the pointer actually travelled six pixels. And
the cards behind carry buttons nobody can see: they are `inert` — out of
the tab order and the accessibility tree as well as out of the mouse's
reach — under one honest button each, «show this one».

The picture on a card is THE INVITATION, rendered live at phone width, so
the pile is the catalogue and not a photograph of it. The reference's card
is a dark photograph and ours is cream paper, so the caption's ground was
re-poured until it measured: white on it is 13.6:1 at the mean and 9.15:1
at its brightest pixel. Below 640px the card keeps the name and the price
and hands the line and the feature chips to the bar underneath, which has
room for them. The two verbs never ride the card: a button that fades out
with its card is a button that cannot be trusted.

Before it mounts — and for a browser with JavaScript off — the stage is a
plain horizontal scroller: all eighteen, in order, named and priced.

**The kids' catalogue is a field of stills.** Forty-four cards in two
columns, and each one rises from below tipped forward and out of focus,
settles square and sharp as it crosses the middle of the screen, then
tilts away over the top edge — scrubbed to the scroll, so it is
reversible and never half-played. The reference for it runs on Motion,
which this site does not carry, so it is one verb — `data-focus` in
components/Motion.tsx — on the scroll engine that was already here, with
the reference's own numbers kept: 900px of perspective, a 70° tilt, ±100%
of travel, 300px of depth, ±40% sideways, 5° of roll, 20° of skew, 8px of
blur, its ease pair (cubic-bezier(0.22, 1, 0.36, 1) in, ease-out back
out), its 1.8 → 1 counter-stretch, and its mirror — the verb's L / R value
leans the two columns away from each other.

One number is deliberately not the reference's. It fades its stills to
BLACK, because its page is black; this page is paper and has a dark theme
as well, so the ends fade on OPACITY instead — the same disappearance on
either ground, and never a card face turned into a black rectangle.

NOTHING came off the card to make room for it. The moved layer is the
item's own first child, so the whole tile travels as one still: the
envelope, the card face wearing the name a parent typed upstairs, the
POPULAR / NEW badge, the name, the maker, and the colourway dots — which
still repaint the card and still rewrite the link into the studio while
the thing they sit on is mid-tilt. The parked poses are written in JS and
nowhere else, so a browser without JavaScript, and anyone who asked for
reduced motion, gets the same forty-four cards standing still.

**A blank page that had nothing to do with the tilt.** Building it
surfaced a layout bug older than it: below 900px the catalogue stacks the
facet rail above the grid in one grid track, and that track had no
`minmax(0, …)`, so it took the width of its widest content — the facet
chip rows, which are `nowrap` scrollers about 1.4k pixels wide. The page
ran to ~1900px on a phone; body's `overflow-x: hidden` hid the scrollbar,
so nothing looked wrong while the grid still began at the left edge. A
grid centred with `margin-inline: auto` inside that blown-out track does
not begin at the left edge: it centres on 1900px and lands entirely off
the right of the screen. A phone got a working nav above an empty page.

**The landing, from the ground.** The nine-section front page is retired
whole into ServiceHomeFull.tsx (this repo has no git; that file IS the
history), and the new one walks the five moves the leading invitation
services walk a visitor through: a full-viewport HERO that says what the
app is for in one paragraph, beside the sealed envelope with the sample
card floating over it; the WEDDING DECK on scroll — eighteen versions
fanned, dragged, priced, each with its live window and CHOOSE into the
wizard; THREE STEPS (choose · write · receive); the RESULT — the real
wedding-1 page scrollable in a phone-sized pane beside what the link does
(three languages, RSVP by side, guest list + Excel, calendar, music);
and the ORDER form last, where every button above was quietly pointing.
Proof before the ask. The nav and the footer follow the new sections;
categories, kids' strips, the template gallery, the showcase, features,
pricing tiers, the feed and the FAQ left the landing but kept their
routes.

**The landing on a phone — composed, not shrunk.** The desktop hero is a
promise beside an artefact; stacked whole it ran to 1.7 viewports and the
first screen ended mid-photograph. Now the first screen is the whole
promise: type, both verbs, and the envelope PEEKING past the fold — the
4/5 mat cropped to 4/3 so the wax seals stay in frame, the peek itself
the scroll affordance (the hint hides; it would sit below the fold
telling nobody anything). Once the hero is gone, the page's two verbs —
Examples · Create — follow the thumb in a pinned glass bar on the bottom
edge, safe-area aware, that bows out when the order form (which has its
own verbs) arrives. Two IntersectionObservers, no scroll listener; a
no-JS visitor loses a shortcut, never a capability.

The result section reseats itself: on a desktop the phone stands beside
the words, on a phone it lands BETWEEN the claim and the bullet points —
on the device the proof is the size of, it comes right after the claim
it proves. Which surfaced a copy bug: the lead said «on the right is the
real page», a direction only desktops have. It now points at the thing.
The deck grows to 12×18rem below 640px, and on any coarse pointer its
arrows and dots grow to a finger's size; a horizontal touch turns the
pile, a vertical one scrolls the page, verified with real touch events.

**The hero turns; the cards ride a wheel.** The reference photographer's
site (avagyanphoto.com) was measured before borrowing: a whisper of a
header, and then the page IS the photographs — proof living inside the
content. Two of the client's reference components carry that idea here,
both rebuilt without the packages they came on. THE DRUM (was
framer-motion) is the landing hero's stage now: eight real invitation
covers on a cylinder — rotateY(i·360/n) translateZ(r), the reference's
1800px cylinder, 1100 under 640px — drifting a ninety-second lap until a
hand lands, spun by dragging, every face a real link into the wizard with
that example preselected. The drift is a TICKER, not a tween: a resumed
tween snaps back onto its recorded range and eats the drag. The throw is
clamped to half a turn — the reference's spring damped flicks implicitly;
an eased glide must say so, or one trackpad flick buys thirty laps.

THE WHEEL (was @gsap/react) opens /wedding-cards: the ten most-chosen
designs standing like spokes on a great buried circle — radius 550, 230
on phones, 45% above ground — turned a full lap by the scroll while the
section is pinned. The hover grammar (one lifts, the rest step back) is
CSS alone, :hover + :has, fine pointers only. Reduced motion and no-JS
get the standing wheel with its top arc of cards; the entrance is parked
only inside the no-preference block. And the old hero's envelope did not
die — it was already retired whole with the rest of the first landing.

**Four reference strips became four templates.** The client sent six
phone-strip invitations; two already lived in the engine (the boarding
pass, the pearls), and the other four are now web templates wedding-4
through wedding-7 — the torn-blue programme (monogram over the
photograph, three-cell date, the scripture, the entourage, the colour
guide, the hashtag, the QR), the hydrangea night (drawn bloom heads,
petals coming down, the guests'-chat card), the velvet roses (layered
blooms, the hand-sketched guest table, a synthesized string bed) and the
eucalyptus vow (hairline frame, arched photograph, the invitation
sentence, reserved seats, the adults-only line). All the flora is
deterministic SVG painting with the template's own tokens; every palette
was measured first, and the two colours that failed as text (the rose
red at 3.48:1, the sage at 2.40:1) are ornament only.

Phone-first by construction — the references are phone strips, so the
single column IS the design. Every new block speaks all three guest
languages; the guests'-chat and seating-plan chips are deliberately
inert, because a sample invitation invents no destinations. The wizard
dresses all four with a couple's own names, date and photographs through
the same applyDraft seam as every other template, the deck grew to 22,
the hero drum to twelve faces, and the build to 252 pages.

**The day, as a line that draws itself.** Every wedding invitation now carries
THE ROUTE (`components/invitations/DayRoute.tsx`): one line down the page that
draws with the scroll and spots each place and hour — where the guest is
expected, at what time, what happens there, and the way to it. The line is
generated, not drawn: the component measures every pin's centre and lays a
smooth Catmull-Rom curve through them, so the route always passes exactly
through its spots however long the addresses run (re-measured on resize and
after the fonts swap, since Armenian metrics move every row). `Motion.tsx`
scrubs it (`data-route`): the stroke draws from the first stop to the last, a
traveller rides the curve (`getPointAtLength` — plain SVG, no plugin), and each
spot lights up as the line reaches it. Five variants keep each style's
identity — a gold hairline through paper cards (A), a lit line and glass cards
(B), the flight path with red pins on navy (C), the pearl string on the taupe
band (D), a thin navy line with centred cards (E) — and the same route serves
the fifteen web templates and the wedding cards' guest page, wearing whichever
token world it lands in (`--iv-*` · `--tp-*` · the site's). Parked in JS only:
with no JavaScript, or under reduced motion, it is a printed itinerary.

**The motion vocabulary (every wedding example).** `Motion.tsx` grew from one
verb (`data-rise`) to a vocabulary the markup speaks, all parked states set in
JS so a no-JS or reduced-motion visitor gets the finished page:
`data-reveal` (an image frame wipes in from the bottom while the picture
settles 1.12 → 1 — hero photos, the venue ticket, the arched photo, every
gallery frame, the templates' covers), `data-kenburns` (the slow 18s breath of
a hero picture), `data-letters` / `data-words` (type arrives in pieces from
under a soft blur — the names in every hero, the greeting, the scripture, the
RSVP head; split at runtime, `aria-label` keeps the whole name readable),
`data-track` (a letterspaced kicker settles from wide), `data-float`
(ornaments breathe — the globe, the butterfly, the hearts, the pendant, the
bow), `data-pop` (children pop in one after another — the pearls down their
string, the calendar days, the swatches, the hearts), `data-stamp` (stamped
down, big → seated — the ticket and venue stamps, the luggage tag, the note
card, the tray card, the end frame), `data-dash` (the flight path marches).
Continuous CSS ornaments besides: the butterfly's wings, the countdown digits
ticking over, the classic timeline cards stepping in, the floral corners
breathing, the pearl strings swaying, the postmark drifting. The templates'
blocks rise as a band and their galleries reveal; the card pages mount Motion
below the envelope. The live previews (compact, embed, the cards' faces) are
excluded from every scroll-driven verb — their triggers would sit in frames
the window never scrolls.

The flourishes set in **Great Vibes** (OFL, latin subset, self-hosted as
`--f-script`; Armenian falls to the serif — no Armenian script face exists in
this register). Six new plates (Sevanavank, Lake Sevan, a wing over clouds,
two pearl strands, a suit with a rose — Unsplash, no faces). The wizard's
examples list grew to 18 for a wedding (8 web pages · 10 cards); the filter
groups templates and engine styles together as «Web page», the badge on
each example still says which.

**The binding.** The styles are TEMPLATES in the wizard
(`live-<style>` in `CATEGORY_TEMPLATES` — two for weddings, one for each other
occasion) with their own chips (cover, palette dots, «engine» badge); the
previews column renders ALL six compact, from the wizard's current state, on
every keystroke (`components/customizer/previews/EnginePreviews.tsx` — Pick /
Demo per style); Live Demo opens `/invitation/live-<style>?p=`; Generate Web
Link stores it as a short id; `/order` accepts the id. `/wedding-live` is the
showcase in the wedding part: the three-ways strip (card → `/wedding-cards`,
web = this, video = next), the six styles as tabs, the chosen one in a phone
frame (the real page in an iframe), its measured section order, «Open full
page» and «Customize in the wizard» (`/customize?category=…&tpl=live-<style>`).

**Verified** (browser + headless Edge 1440 / 390, light + dark): the wizard
opens with the engine chip preselected from `?tpl=`, typing names/date
re-renders all six previews at once, Live Demo shows the cinematic page with the
draft, Generate Web Link → `/invitation/dnsxt6` renders `iv--modern-cinematic`
with the typed names and date; the six sample pages open (Style A: gate → song →
monogram, names, calendar with the day marked, 5-stop timeline with directions,
4 swatches, inline RSVP with side + diet, epigraph; Style B: video hero playing
muted with the unmute control, glass cards, RSVP modal storing `diet` and
`event: live-wedding-cinematic`, 87-day countdown), `?g=` greets, `?p=` binds
across all six, an unknown style 404s, no parked (`opacity: 0`) element is left
after a full scroll, no console errors; production build 221 pages. Fixed on
the way: hero copy and the RSVP / epigraph / godparents sections stayed parked
at opacity 0 (Motion's per-band reveal only knew `section, footer` DESCENDANTS —
it now takes a band that carries `data-rise` itself, and the engine hero plays
on arrival; Motion mounts after the gate, not behind it), the compact previews
are pinned visible (a preview must never wait for a scroll trigger), and the
first-screen collision of the hero mute button with the audio dock.

## Wedding cards — /wedding-cards (the «send it as a card» way)

Three ways to invite now sit side by side: **as a card in an envelope** (this
layer), **as a web invitation** (the templates and the wizard) and — next —
**as a video animation**. The reference for the card way was Greenvelope's
wedding designs page (greenvelope.com/designs/wedding-invitations), measured,
not copied:

- **the facets** — 11 styles (beach, classic, destination, floral, *indian →
  here ARMENIAN*, modern, romantic, rustic, simple, vintage, watercolor), 18
  colours incl. gold / silver / rose gold / copper / champagne foil as swatches,
  photo count (all / 1 / 2 / 3+ / none), shape, features (backside supported ·
  matching components · colour change), designer collections, search, a
  result count, colour variants per design in the URL (`?v=`);
- **the tile** — front, and the BACK on hover when the design has one;
- **the design page** — name · studio line · **Start Customizing** · **Preview
  Animation** · description · **Matching components** (save the date, thank-you
  note, details, RSVP card — the same design, the words swapped) · «other
  designs you may like»;
- **the open sequence** the product is named for — the envelope FRONT
  addressed to the guest with a stamp and postmark, the turn to the back, the
  wax seal breaking, the flap lifting over the liner, the card sliding out of
  the mouth, the envelope sinking and fading around it, a tap turning the card
  over. `components/wcards/EnvelopeScene.tsx`: CSS 3D + one GSAP timeline,
  a portrait envelope for portrait cards, layering by `translateZ` (z-index is
  ignored inside preserve-3d), backfaces hidden on every 3D child, reduced
  motion → the card simply shown;
- **the personalisation** the reference lists — envelope paper (10), liner
  (13: foils, marble, botanical print, damask, pomegranate print, night sky…),
  stamp (6), wax seal (7 — monogram, gold, pomegranate, eternity sign, heart,
  leaf, none), backdrop (7), music, and the GUEST'S NAME on the envelope
  (`?g=`, the same parameter the envelope card has always taken).

**40 original designs** in `lib/wcards.ts` from a second symbol library
(`components/wcards/WMotifs.tsx` — botanical, floral, ornament, foil, landscape,
and Armenian: pomegranate, split pomegranate, eternity sign, khachkar lace,
duduk, Ararat, Sevan, Tatev, Noravank, apricot blossom, vine and grapes) with
SVG filters for watercolour edges, deckled paper, letterpress and speckle; one
renderer (`WCardFace.tsx`) draws the front, the back (monogram, greeting,
programme, place, RSVP) and the matching components. Five collections: KNIQ
Signature, **Ararat Collection**, **Armenian Landscapes**, Foil & Shimmer,
Botanical. Type: Cormorant / Jost / Noto; foil names by background-clip.

```
/wedding-cards            WCatalog — facet rail (styles · colour swatches · photos · shape · features · collections), search,
                          «preview with your names» (every tile re-renders), tiles that turn on hover, colour dots
/wedding-cards/<design>   WStudio  — stage (Card · Back · Envelope · Animation), colourways, name/studio/styles/desc,
                          Start Customizing → the form: couple, families line, when, where, map, programme (back),
                          note, RSVP-by, photos; THE ENVELOPE: paper, liner, stamp, seal, backdrop, guest name, music;
                          Preview Animation → the real guest link full-screen; Generate Web Link; Order; matching
                          components; you may like
/invitation/wed-<design>-<colour>?p=…&g=…  or  /invitation/<short id>?g=…
                          WInvitation — EnvelopeScene → card (turnable) → When (+countdown, .ics), programme, map,
                          invited-by, RSVP by side with plus-one/diet, share; music dock if a track was set
```

The Draft grew five envelope fields (`envCover envLiner envStamp envSeal
envBack`); everything else — blob, short link, ICS, order, RSVP — already
understood a wedding draft. Template and kids RSVPs now tag their `event`, so
the sample couple's deadline never touches them.

**Verified** (headless Edge 1440 + 390): 40 tiles / 80 faces / 194 motif
uses; hover turns a tile (matrix3d); the studio re-renders the pomegranate
card as the couple types («Լիլիթ և Տիգրան» in foil, families line, spelled
date, Էջմիածին, RSVP-by); the Animation tab plays on the stage; Generate Web
Link → `/invitation/hvzs3u?g=…` — front addressed «Հարգելի՛ Անի և Արամ /
ԼԻԼԻԹ ԵՒ ՏԻԳՐԱՆ», stamp + postmark → back with the «ԼՏ» wax seal → flap over
the pomegranate liner → card out → settled → turned to the back with the
programme; When/countdown/programme/map/invited-by/RSVP/share below; an RSVP
tagged `wed-pomegranate` stores; ICS DTSTART 09:00Z = 13:00 Yerevan for the
first stop; `/en/` too; unknown design → 404; mobile no overflow. Fixed on
the way: a class collision (`.kn-wc` was already the christening watercolour
frame — the catalogue is `.kn-wcat`), the mirrored-through backfaces and the
z-fighting of coplanar 3D faces, a timeline that restarted on every parent
render (the settled callback lives in a ref now), the card fading with its
envelope (only the envelope's PARTS fade), and `color-mix()` percentages that
summed below 100% and made the envelope faintly transparent.

## Kids' birthday cards — /kids

The reference for this pass was Paperless Post's kids' birthday category
(paperlesspost.com/cards/category/kids-birthday-invitations). What was
absorbed is its ANATOMY, measured, not its art:

- **the facets** — all 27 «shop by theme» varieties (animals, arts and
  crafts, balloons and confetti, cake and sweets, cars and trucks, dance and
  music, dinosaurs, farm, gaming, gymnastics, jump, jungle and safari, magic,
  mermaid, movie night, neon and glow, ninjas, photo, pool party, characters,
  princess and fairy, rainbows, sleepovers, space, sports, superheroes,
  unicorns), the four «explore» rows (girl / boy / teen / joint), the milestone
  row (1st, 13, sweet 16, 18) and a card-shape filter — as chips in
  `lib/kids.ts`, translated;
- **the tile** — a card leaning on an open, LINED envelope, colourway dots,
  the design's name and studio line;
- **the front's copy pattern** — «JAMIE IS TURNING 6 · & we're having a party ·
  Saturday, July 8th at noon · the residence»: name, age, date, place ON the
  card (`kidsWords`, with a proper Armenian article — Արենը / Մարիան — and a
  spelled date line);
- **the card page** — card + envelope on the design's own backdrop, a
  Card · Envelope · Guest-view carousel, colourways, and Customize as the
  primary action — except that here Customize is not behind a login: it is the
  right rail, and every keystroke re-renders the card;
- **the product bullets** it sells — guest questions, **child v. adult
  headcounts**, allergies, tracking, «when to send» guidance.

Every one of the **44 designs** is original — a small SVG symbol library
(`components/kids/Motifs.tsx`, ~100 two-tone flat motifs drawn for this) placed
by data (position, size, rotation, palette slot) over a pattern, a border and a
text block, in one renderer (`components/kids/KidsCardFace.tsx`) that is the
catalogue tile, the studio's live card and the guest's phone-wide invitation.
Colourways are palettes (110 in all); shapes are clip paths (portrait,
landscape, square, scalloped, wavy, arch, ticket). «Popular characters» — a
licensed-IP row on the reference — became original friendly monsters here on
purpose. Type: Fredoka + Noto Sans Armenian, self-hosted (OFL) next to the
serif.

```
/kids            KidsCatalog — facet rail, search, «preview with your child's name» (every tile re-renders), tiles + dots
/kids/<card>     KidsStudio  — stage (card / envelope / guest iframe), rail: name, themes, colourways, CUSTOMIZE form,
                              photo upload, RSVP-question toggles, Live Demo, Generate Web Link, Order, «you might also like»
/invitation/kids-<card>-<colourway>?p=…  or  /invitation/<short id>
                 KidsInvitation — the card rises out of its envelope, then When (+ countdown, .ics), Where (+ map),
                              the parents' line, the RSVP the parent configured, share
```

The draft is the same `lib/draft.ts` blob everything else speaks (occasion
`birthday`, `tpl kids-…`, plus `age / note / host / ask / photo`), so the guest
link, the ICS, the order and the short link needed no new machinery.
**Photos**: a photo card's upload shows instantly (object URL); when the parent
generates the link the studio downscales it in a canvas (≤1200px JPEG) and
sends it with the same POST — `/api/link` checks the JPEG magic bytes, writes
`data/photos/<id>.jpg`, and the stored draft points at `/api/photo/<id>`, the
only photo path `decodeDraft` accepts. **RSVP**: `/api/rsvp` now takes
`event`, `deadline`, `adults`, `kids`, `allergy`; answers land in the same
guest book and the Excel export grew four columns. Fixed on the way: every
template and kids RSVP would have gone dark on the SAMPLE couple's deadline —
an event-tagged answer now enforces its own deadline (or none).

**Verified** (headless Edge 1440 + 390, light + dark): 44 tiles, 450 motif
`<use>`s from one sprite, «preview with a name» re-renders every tile;
`?v=orange` lands on the orange colourway; typing name/age/date/place/note/
host/RSVP-by re-renders the studio card («Արեգը դառնում է 7 · Կիրակի, 14 մարտի,
ժ. 15:00 · Play Park, Կոմիտաս 12, Երևան · Պատասխանել մինչև 1 մարտի · Աննա և
Արամ»); Generate Web Link → `/invitation/nqfbkx` renders the same card, When/
Where/Parents blocks, adults+children steppers and the allergy field; the RSVP
posts `adults:2 kids:1 allergy:ընկույզ event:kids-dino-roar` and the CSV shows
them; a past deadline → 409; the ICS carries the child's day; a JPEG upload is
served from `/api/photo/<id>` and drawn in the card, a PNG-in-disguise is
refused, a traversal id is 404; mobile: no horizontal overflow, facet groups
become swipeable chip rows.

**Also fixed this pass, site-wide:** the font classes were on `<body>` while
the `--f-display/--f-body` stacks were declared on `:root` — a custom property
resolves where it is DECLARED, so on `:root` the `--font-*` references were
undefined, the stacks invalid, and every element had fallen to the browser
default (measured: computed `font-family` was «Times New Roman» everywhere;
the Armenian looked plausible in Sylfaen). The classes are on `<html>` now and
Cormorant / Jost / Noto / Fredoka actually load.

## The wizard — /customize

The onboarding the brief asked for: **five steps** (occasion & template → who
& when → where → extras → preview & share) on the left, **five live previews**
on the right — one per occasion, the couple's own first — every one of them
re-rendering on every keystroke. Side by side on a desk, tabbed «Լրացնել /
Նախադիտում» on a phone.

```
components/customizer/
  WizardContext.tsx      one React Context: the Draft + tpl + photos (object URLs) + lang;
                         sessionStorage persistence (photos excluded — they never left the device);
                         blob = encodeDraft(state), memoised, shared by previews/modal/link;
                         isValidTpl / canonTpl — a wedding may be built on a card (`wed-…`) too
  EventWizard.tsx        the steps, the stepper, ShareBar, DemoModal (portalled), LinkGenerator + QR
  ExamplePicker.tsx      step 1's EXAMPLES — see below
  previews/PreviewList.tsx  THE RIGHT COLUMN — one row per version (see below)
  previews/PreviewCard.tsx  a web template's preview in its palette (any template via `tplId`), or an occasion's
  previews/CardPreview.tsx  a card in an envelope, drawn live (WCardFace)
```

### The live previews — one separate row per version

The right column is a LIST, not a stack: **one row per version** the occasion
offers — every web template, every engine style, every card (18 for a
wedding) — each with its own live preview drawn from the wizard's state, each
expandable on its own. The row shows the thumbnail, the name, the kind (and
the engine's style letter), the price, and two verbs — **Pick** (makes it the
template) and **Demo** (the Live Demo of that version). The chosen version is
open and first and follows the pick (a pick from the grid or from a row opens
its row and scrolls it into view); the others sit collapsed under it, so a
couple compares versions one at a time. The previews are the real renders: a
web template's `PreviewCard` in that template's palette (`tplId`), an engine
style's `TemplateRenderer` compact, a card's `WCardFace` — all bound to the
same state, all updating on every keystroke. **Every open row scrolls in its
own frame** — a phone-height window (`.kn-pl__view`, 64svh/600px, its own thin
scrollbar, overscroll contained), so the column never grows with a page and
two versions can be compared side by side by scrolling each. Engine versions
render the WHOLE page there (`TemplateRenderer embed` — every section, no
gate, no Motion (Lenis would take the host's scroll), no viewport-fixed
ambient, no audio dock, no chrome, no QR of the host URL; parked states pinned
by CSS). «In another occasion's style» (the engagement · baptism · birthday ·
corporate previews) kept their place as a collapsed group at the end, each in
its own frame too. On a phone the «Preview» tab shows the same list. The
frames, the previews pane, the detail window's body and the catalogue rails
carry `data-lenis-prevent`: Lenis owns the wheel on this site (Motion.tsx),
and a nested scroll pane that does not opt out sends the wheel to the page
instead of itself — the cursor over a frame now scrolls that frame.

### The examples — pick one, see the price

Step 1's second half is a separate panel: **every example the occasion can be
built on**, as one list with a kind filter (`All · Web page · Engine · Card in
an envelope`). The list is `lib/examples.ts`, built from what already exists —
the web templates (`lib/templates.ts`), the engine styles
(`lib/invitations/styles.ts`) and, for a wedding, the ten most-chosen cards
(`lib/wcards.ts`, `popular`) — each shown as what it is (its cover, or the
card's own face drawn from the wizard's state), what the page does (feature
chips: film, music, RSVP, guest list + Excel, gallery, timeline, map,
countdown, dress code, envelope animation, personalised link, calendar) and
**what it costs**. Two verbs per example: **Preview** opens the real guest page
in the Live Demo frame — with the couple's names once typed, the sample before
— and **Choose** makes it the wizard's template; the pick is echoed under the
grid, again in step 5 with its price and a «Change» link, and on `/order` as
«You are ordering — <name> · <price>» with the total before the submit button
(the plain-style chips only show when no example arrived).

**Every card shows the invitation itself.** No card anywhere on the site shows
a stock photo any more — the landing's «Live examples» grid, the engine
showcase's style tabs, the wizard's example grid and its preview rows all
draw the same live thumbnail. The picture is the example's FIRST SCREEN,
rendered live at phone width
and scaled into a portrait frame (`components/customizer/ExampleThumb.tsx`)
— a web template draws its real hero (the arched cover plate, the kicker,
the names in the template's face and palette, the date) and the first blocks
under it; an engine style draws its compact render (hero · greeting ·
countdown · first block); a card in an envelope draws its face. The wizard's
typed names land in every thumbnail. Motion skips the thumbnails on purpose
(their parked states are pinned), so they are the finished first screen,
instantly; the media is a `role="button"` div, not a `<button>`, because the
thumbnail carries the invitation's own buttons — the same reason the showcase
tab and the preview row are `role`-ed divs, and why the landing card (an
`<a>`) renders its hero without the blocks under it.

**Each example has its own window.** Every card carries **View details**
(the card's image is the same button): a portalled detail window
(`components/customizer/ExampleDetail.tsx`) opens WITHOUT leaving the page —
left, the real guest page in a phone frame (`/invitation/<id>`, with the
wizard's draft when there is one, the sample before); right, the kind and
style letter, the name, the tagline, what it was measured against, the price
line, everything it includes, the **section order top to bottom** (the
engine's measured anatomy; a template's read off its block flags; a card's
envelope sequence), the sample couple, and the verbs — **Choose this example**
(in the wizard), **Open full page**, **Order with this example**, **Open in
the card studio** (cards). ‹ › and the arrow keys walk the grid, Esc closes,
focus lands on ✕ and returns, the page behind stops scrolling, the backdrop
closes it. The same cards and the same window also live on **`/wedding-live`**
as «Wedding examples — every option, each in its own window»
(`components/invitations/WeddingExamples.tsx`): all 18 wedding examples with
the kind filter, where Choose / «Build on it in the wizard» hand the example to
`/customize?category=wedding&tpl=…`. One card component
(`ExampleCard.tsx`), two homes.

**Prices are not invented per example.** They are the site's two published
tiers (`svc.pricing` in `lib/content.ts` — Basic 19 900 ֏ · Premium 24 900 ֏,
`TODO(owner)` confirms them), assigned by capability: an engine style, or a web
template with film or music → Premium; everything else → Basic; one payment,
both languages, exactly as the pricing band states. A card colourway that does
not exist (`wed-<design>-<colour>` typed by hand) resolves to the design's
first colourway once, in the provider (`canonTpl`), so the pick, the previews
and every link agree.

The previews are not mock-ups. Each wears the palette of the template it would
open as and is composed from the SAME blocks the real templates use —
`Countdown`, `Timeline`, `MapCard`, `Godparents`, `DressCode`, `ToastBoard`, the
particle systems, `TiltCard`, the music dock (`inline`) — so what a preview
shows is what the guest link renders, smaller:

| Preview | What it carries |
|---|---|
| Wedding | gold-foil names, rose-petal canvas, countdown, map card (their pasted pin), dress palette |
| Engagement | sparkle canvas, the couple's first uploaded photo (or the ring box) as a hero with names over it, timeline, **Save the date** (`/api/ics?p=`) |
| Baptism | cloud canvas, a tilt frame with wreath + cross + the child's name, godparents card, ceremony order, meal chips → «Try the RSVP» opens the Live Demo |
| Birthday | neon names, confetti canvas, age countdown (`born`), inline music dock with waveform (their URL or the bright bed), guest wall |
| Corporate | grid canvas, countdown, agenda tabs |

Two things leave the page. **Live Demo** is a fullscreen modal framing
`/invitation/<template>?p=<blob>` — the very URL a guest opens, envelope and
all. **Generate Web Link** POSTs to `/api/link`, which re-sanitises the blob,
mints a 6-character id (no 0/o/1/l/i, so it reads aloud), appends
`data/links.jsonl`, and returns `/invitation/<id>`; the wizard shows the
absolute URL, a copy button, WhatsApp/Telegram intents, a QR (lib/qr.ts), and
— folded away — the long stateless `?p=` link that needs no server. If the
disk write fails the response says `stored:false` and the UI shows the long
link instead of pretending. **Order this** carries the same blob into
`/order`, which prefills from `?p=` and keeps the extras (venue, palette, map,
music, template) in the order's blob.

The Draft grew for this: `venue, address, map (https, host allow-listed:
Google/Yandex/Apple), rsvpBy, dress[] (≤5 #RRGGBB), music (https), video,
godA/godB, born (1900–2030), tpl`. Older blobs decode unchanged. A birthday
or corporate draft may carry a single name; two-people occasions still need
two. `TemplateView` lays a draft over any template's sample event; the video
toggle picks the category's ambient loop; a pasted music URL replaces the bed
(foreign hosts play without the analyser — a non-CORS MediaElementSource
outputs silence, so the wave falls back to the CSS pulse instead of lying).

The landing's five category cards now carry photographs (rings on a bouquet,
the ring box, the christening jars, the gold cake, the stage) and land in the
wizard with the occasion preselected; the hero and nav CTA go to `/customize`.

**Verified** (headless Edge, 1440×900 and 390×844, light and dark): typing
updates all five previews (names, date, tags «նմուշ» → «ձերը», map href,
timeline, godparents, «Դառնում է 31», dress swatches); previews reorder on
category change; the modal's iframe renders the couple's names, focus lands
on ✕, Esc closes and restores scroll; `/api/link` → `/invitation/k7m2xq`
renders names + venue + map + palette + video layer, `/en/…` too, unknown id
→ 404; hostile blob (script in a name, `javascript:` map, 9 stops, bad hex,
year 1800) → letters only, pin dropped, capped, ignored; ICS from a draft has
the right DTSTART/SUMMARY/LOCATION; sessionStorage restores after reload with
photos empty; mobile tabs swap panes with no horizontal overflow; dark theme
fields readable (the surface tokens are now re-declared on the dark block —
`/order` had the same invisible-field bug). Two fixes this pass: the modal is
portalled to `<body>` (the main column is a stacking context under the nav),
and CSP moved from `frame-ancestors 'none'` / `X-Frame-Options: DENY` to
`'self'` / `SAMEORIGIN`, without which the Live Demo (and the showcase's
live frame) would have been blank in production; `media-src` allows https:
for a couple's own track.

**Verified, the examples pass** (browser + headless 1440/390, light + dark):
`/en/customize?category=wedding` lists 15 examples (3 web · 2 engine · 10
cards) with prices; the kind chips filter (10/10 cards); Preview on «Modern
Cinematic» frames `/en/invitation/live-modern-cinematic` before any name is
typed; Choose on «Gilded Botanical» → tpl `wed-gilded-botanical-blue`, the
pick line reads «19 900 ֏ · one payment · both languages», the previews column
leads with the card face carrying the typed «Լիլիթ & Տիգրան», step 5 shows
the pick with «Basic», Live Demo / Generate Web Link (`/en/invitation/dw5xgt`
renders the envelope scene with the names) / Order all carry the card id;
`/order?style=wed-…&p=` shows the ordered card, the «Change in the wizard»
link and «Total 19 900 ֏»; `?tpl=wed-linework-florals-green` (no such
colourway) opens with `wed-linework-florals-white` chosen and shown first;
mobile is a two-column grid; production build 221 pages. Fixed on the way:
the compact engine previews painted their viewport-fixed ambient layer
(petals, sparkles) over the whole wizard — the ambient now renders only on
the full page.

## Thirteen live templates + the UI/UX upgrade

`/invitations/<category>-<n>` — three live, animated invitations for each of
four ceremonies, all rendered by ONE component from ONE registry:

```
lib/templates.ts                the "mock JSON": 12 specs — tags, theme, cover,
                                gallery, video, audio, fx, event, feature flags
components/templates/
  TemplateView.tsx              composes a spec → page (theme → CSS vars,
                                ambient layer, chrome, hero variant, blocks, dock)
  blocks/Blocks.tsx             Countdown/age · MapCard · Timeline (order/
                                parallax/tabs) · Gallery+Lightbox (grid/masonry)
                                · TemplateRsvp (inline/modal/guests/meal/team) ·
                                ToastBoard · Godparents · ParentsNote · Speakers
                                · QrCheckin · IcsButton · Registry · DressCode ·
                                PinDrop · ProductTilt(flip) · ReelNote
components/ui/3d/
  TiltCard.tsx                  pointer tilt + GYROSCOPE (iOS permission gate)
                                + optional flip; children data-depth in Z
  Particles.tsx                 one canvas, 7 systems: petals · gold · sparkles ·
                                clouds · cyber grid · 3D confetti · leaves —
                                paused off-screen / hidden tab, DPR-capped
  FoldCard.tsx                  tri-fold that opens on entry (GSAP, hinged)
components/ui/
  VideoBg.tsx                   muted/loop/playsInline, poster ALWAYS under it,
                                plays on intersection, never under reduced motion
  MusicDock.tsx                 floating player; REAL waveform (AnalyserNode)
  Lightbox.tsx                  ← → Esc + pointer SWIPE (40px threshold)
  ThemeToggle.tsx               light/dark, pre-painted from localStorage
components/TemplateGrid.tsx     home gallery: tabs All/Wedding/Birthday/
                                Christening/Corporate + instant search
lib/qr.ts                       compact QR encoder (byte, EC-M, v1–10)
public/video/ambient-*.mp4      SYNTHESIZED ambient loops (ffmpeg gradients)
public/audio/pad-*.mp3          SYNTHESIZED beds (detuned sines, tremolo)
```

| Wedding | Birthday | Christening | Corporate |
|---|---|---|---|
| **1 Classic Royal** — foil type, petals, harp-like bed, countdown, Maps | **1 Neon Night** — neon glow, 3D confetti, bed, age countdown | **1 Angelic Cloud** — pastel, clouds, sky video, godparents, order | **1 Tech Summit** — cyber grid, speaker cards, .ics, VIP QR + code |
| **2 Minimalist Luxe** — mono, tri-fold intro, masonry + lightbox, RSVP modal | **2 Golden Jubilee** — foil, gold video reel, guest count, wall of toasts | **2 Eucharist Gold Leaf** — cream, cross sheen, directions, meal RSVP | **2 Product Launch** — 3D product tilt/flip, glass, countdown, register |
| **3 Boho Garden** — watercolour frame, ambient video, parallax timeline, dress palette | **3 Kids Superhero** — springy pin-drop, parents' note, confetti | **3 Floral Blessing** — turning wreath, acoustic bed, registry chips | **3 Anniversary** — slate & gold, agenda tabs, map, team RSVP |

**Honesty, stated:** the ambient videos are synthesized light, not footage;
the music beds are synthesized pads a couple replaces with their own track;
"Spotify integration" is a self-hosted player (a Spotify embed would be a
third-party request the CSP forbids and Meta-style tracking on a private
card); the registry chips are disabled until real links exist; the QR encoder
was verified by construction, not by a physical scanner (the check-in card
prints the human-readable code beside it); the "3D" is 2D-canvas with a hand
projection — a WebGL scene for a few hundred sprites is a 600 KB dependency
for the same pixels.

**UI/UX upgrade:** glass surfaces (`backdrop-filter: blur(12–14px)`) with a
masked gradient-border utility, two shadow tokens, **light/dark theme** for
the service pages (persisted, pre-painted, OS-preference default; the
invitations themselves are NOT re-themed — a couple chose their palette),
fluid `clamp()` type throughout, sticky glass nav with active-section
highlighting, template search/filter, GPU-composited micro-interactions,
swipe in the lightbox and scroll-snap strips on phones, lazy plates/iframes/
canvases (particles pause when off-screen).

## The blueprint — folder structure, component hierarchy, motion wrappers

The landing mirrors the nine-section blueprint (istudio.am/weblink's vertical
stack) in exactly this order; the invitation, the order flow and the template
pages are their own routes.

```
app/
  (hy)/                     Armenian root layout  → <html lang="hy-AM">
    page.tsx                /              the landing (ServiceHome)
    order/page.tsx          /order         the three-step flow, ?style=&occasion=
    templates/[id]/page.tsx /templates/luys  one style at length (SSG ×3)
    i/[style]/page.tsx      /i/luys        the LIVE invitation (+ ?p= draft, ?g= guest)
    guests/page.tsx         /guests?key=   the couple's dashboard
  (en)/en/…                 the same five, English
  api/  rsvp · rsvp/export · order · ics
  next.config.mjs           rewrites  /invitation/:slug → /i/:slug (both langs)

components/
  ServiceHome.tsx           § 1–9 in order:
    SiteNav.tsx               1  sticky glass bar · 5 links · lang · CTA · burger →
                                 drawer (dialog, Escape, veil, focus return) ·
                                 active link via IntersectionObserver
    TiltCard.tsx              2  hero: pointer-tilt stage; children carry data-depth
                                 (the photograph at 0, the sample card at 1)
    ─ category grid           3  five occasions → /order?occasion=
    StyleCard.tsx             4  showcase card: hover, LIVE PREVIEW TOGGLE (iframe
                                 of /i/<style>, mounted on demand), DETAIL MODAL
      StyleDetail.tsx            (shared with /templates/[id])
    OrderFlow.tsx             5  stepper (computed from completeness) → style +
                                 occasion → your day (timed stops) → preview +
                                 contact + send · sticky phone frame · /api/order
    ─ features grid + how     6  nine cards with Icon.tsx glyphs · the stamp plate
    ─ pricing tiers           7  Basic / Premium / Custom + the terms, plainly
    ─ gallery feed            8  scroll-snap strip of the site's photography
    SiteFooter.tsx            9  quick links · contact (renders only what is set) ·
                                 socials (only real hrefs) · ©
  Card.tsx  Gate.tsx  Countdown.tsx  Rsvp.tsx  Share.tsx  Chrome.tsx  Sketch.tsx
                                 the invitation itself
  Plate.tsx                   every photograph: blur, fixed frame, drift/zoom/hover
  Motion.tsx                  GSAP + Lenis; reads data-rise / data-drift / data-zoom
  Icon.tsx                    16 inline glyphs in Lucide's grammar
  Nudge.tsx  OrderPage.tsx  TemplatePage.tsx

lib/
  content.ts   every word, both languages (svc.* = the service; occasions ×5)
  styles.ts    the catalog: 3 styles, measured facts, includes, price
  draft.ts     a couple's draft ↔ ?p= blob (hostile-input rules)
  photos.ts    typed static imports + alt text
  i18n.ts  date.ts  server/store.ts
```

**Motion wrappers — the Framer Motion mapping.** The brief names Framer
primitives; KNIQ ships the same behaviours through GSAP so the project stays
at five runtime dependencies (next, react, react-dom, gsap, lenis):

| Framer Motion | KNIQ |
|---|---|
| `<motion.div initial whileInView>` fade-up | `data-rise` on any element (Motion.tsx, staggered per band) |
| `whileHover={{ scale }}` | `.kn-plate--hover`, `.kn-cat:hover`, `.kn-svc__cat:hover` (CSS, hover+no-preference gated) |
| `useMotionValue` + `useTransform` tilt | `TiltCard.tsx` — `gsap.quickTo(rotationX/Y)`, children `data-depth` translate in Z |
| scroll parallax `useScroll` | `data-drift` on a Plate (scrubbed ScrollTrigger; mover oversized so edges never show) |
| `AnimatePresence` for drawer/modal | mount/unmount + a CSS keyframe (`kn-drawer-in`, `kn-modal-in`) |
| smooth scroll anchors | Lenis, published on `window.__lenis`; SiteNav calls `scrollTo` with the nav offset |
| Lucide icons | `Icon.tsx` — 24-box, 1.8 stroke, round caps, currentColor |

Everything is gated on `prefers-reduced-motion: no-preference`; without it,
every section is a well-set static document.

**Geometry per the brief, applied to the service pages (`.kn-svc`):** 1280px
container · 16 / 24px card radii · 64–96px band padding · two shadow tokens ·
soft rose `#E9CFC8` as a fill accent (1.29:1 — never a word) and rose-ink
`#8F4B45` for rose text (5.62:1). The invitation keeps its own letterpress
geometry — that is the product's design, not the marketing site's.

**Honesty, unchanged:** the "testimonials" slot is a gallery of the site's own
photography, captioned with what is in each frame — the service has served no
couple yet and an invented quote is the one thing this site must never carry.
The footer prints only contact details that exist; today that is "through the
order form".

## The working service

Measured off `istudio.am/weblink` (fixed nav → hero with a "from" price →
"every template includes" checklist → add-on price list → sticky occasion
filter → card grid → **policy block**: one payment / unlimited sends · ready in
4 days · link live 6 months · mix or bring your own) and cross-checked against
Greenvelope, Zola and Joy. What a couple can now DO here:

- **See their invitation before buying — the builder.** Names, date, city,
  occasion, a timed programme; the REAL card renders their draft live in a
  phone frame beside the form (a new tab on phones). Not a mock — the same
  `/i/<style>` route a guest would open, carrying a compact `?p=` blob. The
  couple can copy that URL and send it to their mother before paying a dram,
  which is the moment a sale is made. Neither Armenian reference has this;
  iStudio sells from JPEG thumbnails.
- **Four occasions** — wedding, engagement, baptism, birthday — as a chip row
  and a builder setting; the kicker and the calendar summary change with it.
- **A structured programme** — timed stops with what / where / address, up to
  five, sorted by time — instead of a free-text box.
- **The terms, plainly** — one payment & unlimited sends · 1–2 working days ·
  the link stays live 12 months · changes are free and need no re-send · both
  languages included · a private guest-list page.
- **RSVP grows dietary needs and plus-one names** (asked only of guests who
  are coming), through to the dashboard, the CSV and the order email; the
  dashboard adds a dietary roll-up for the caterer.
- **A reminder for non-responders** — Greenvelope's auto-nudge in the register
  this market uses: a ready message with the date, the deadline and the link,
  one tap to copy into the family WhatsApp thread.
- **Sticky nav** with the CTA "Build mine".

The draft blob is treated as hostile: names letters-only, times validated to
HH:MM, dates parsed, lengths capped, rendered only as text nodes; a malformed
blob opens the sample couple at 200, never a 500. Verified with a `<script>`
name (falls back, never echoed) and `<b>Ani</b>` (→ `bAnib`). The order route
re-decodes and re-encodes the blob so what is stored is the sanitised one.

Form primitives read **surface tokens** (`--fg` / `--bg` / `--fg-accent`,
ink-on-paper by default, flipped by any dark band) — the first builder
rendered paper-on-paper because inputs had been written for the ink RSVP band.

## The three styles

One codebase, one verified card, three wardrobes — a style is a `[data-inv]`
attribute swapping the custom-property palette; structure, motion and all the
behaviour never fork. Every palette was measured before use:

| | ground | text | accent rule |
|---|---|---|---|
| **ԿՆԻՔ** ivory | `#F3EFE7` | ink 15.14:1 | gold 2.70:1 = ornament only; `--gold-ink` 5.07:1 speaks |
| **ԼՈՒՅՍ** night | `#14120F` | bone 16.30:1 | candle gold 9.44:1 — on night the accent may speak |
| **ՏՈՒՖ** stone | `#F4E9DC` | basalt 12.50:1 | terracotta 3.52:1 = ornament; terra-ink 5.33:1 speaks; apricot belongs to the dark band (7.31:1) |

The RSVP band always "turns the card over": ink on the light styles, **bone on
the night style** — the move survives inversion because the roles are tokens.

Three traps this uncovered, kept for the next themed project:
- **Inherited `color` does not re-resolve.** `body { color: var(--ink) }`
  computes OUTSIDE the wrapper and children inherit the resolved value. One
  rule (`[data-inv] .kn-main { color: var(--ink) }`) re-anchors it inside.
- **Ground and ornament must not share an opacity.** The theme's page colour
  briefly lived on the same fixed element as the 5%-opacity corner sprigs —
  and the night ground rendered at five percent. `getComputedStyle` reported
  the un-multiplied colour throughout; only rendered pixels showed it.
- **A flipping band may contain no colour literals.** The dark band's labels
  and borders were literal bone — invisible the day the band flipped to bone.
  They derive from `var(--paper)` via `color-mix` now.

---

## What this is competing with

Two Armenian products were measured before anything was written.

**naiva.am** — Tailwind + **AOS.js**. 7,849 px on desktop, 7,466 px on a phone,
ten bands: envelope gate → hero → invitation text → month grid → *Օրվա
ծրագիրը* (three stops, each a Yandex **link**) → gallery → RSVP deadline →
countdown → RSVP form (guest count, whose side, yes/no) → footer. One `.mp3`,
17 images, no video, no embedded map.

**istudio.am** — a React SPA, bilingual `am`/`en`, a 2.7-second vertical film
as the opening, `Pour-La-Femme.mp3`.

Both open with a **sealed envelope you have to tap** — iStudio a forest-green
embossed one under a gold wax seal, NAIVA ivory flaps folded into an X under a
seal carrying the couple's own initials. So does every premium platform
worldwide (Greenvelope, Paperless Post, Bliss & Bone, InviteDrop). It is the
one interaction nobody in this category skips.

**The gap:** the market leader animates with AOS — a single fade-and-slide
fired by an IntersectionObserver, the most basic scroll library there is.

---

## What this has that neither reference does

| | KNIQ | naiva | iStudio |
|---|---|---|---|
| Envelope ceremony | ✅ real gate — scroll-locked, `inert`, Escape-dismissable, focus managed | ✅ | ✅ (a video) |
| Language | ✅ **two server-rendered routes**, works with JS off | ❌ Armenian only | ⚠️ client-side toggle, no URL |
| Add to calendar | ✅ real `.ics`, hand-built, with a reminder | ❌ | ❌ |
| Per-guest link | ✅ `/?g=Անի` greets them by name | ❌ | ❌ |
| Dress code / gifts / children / parking | ✅ | ❌ | ❌ |
| Motion | GSAP + Lenis | AOS | AOS |
| Works with JavaScript off | ✅ entirely | ❌ | ❌ |
| Third-party requests | **zero** | — | — |

### And what was absorbed *from* them (second measuring pass)

The full geometry of both cards was extracted — every text node's size, face,
colour and position — and the parts worth having were rebuilt in this register:

- **The families line** (iStudio): the invitation is issued by the two
  families, which is the traditional Armenian form; a card without it reads as
  a translated template to the older half of the guest list.
- **The epigraph** (iStudio): Mark 10:9 closes the invitation band like a
  blessing — scripture, not copied copy.
- **The fourth stop** (iStudio): ՔԿԱԳ, the civil registry ceremony, held at
  the hall before the banquet. An Armenian wedding day genuinely has it.
- **Վայրերը** (iStudio's best band): each destination venue as an illustrated
  card. Theirs are pencil sketches; ours are original SVG line drawings — a
  generic Armenian church and an arched pavilion, deliberately portraits of no
  real building — that **draw themselves** on entry (`pathLength="1"` strokes,
  dashoffset 1 → 0 under GSAP). Their map buttons' shimmer sweep is here too,
  existing only inside `prefers-reduced-motion: no-preference`.
- **The fixed backdrop** (NAIVA's structure): the whole card scrolls over one
  fixed layer — two faint corner sprigs at opacity 0.05, below every measured
  contrast threshold.
- **The arch-framed photograph** (both open on photography): the
  hands-and-rings plate in a semicircular-top mat inside the invitation band.
- **The marked calendar day is a step larger** (NAIVA sets its 30px against
  the month's 24px; ours is 1.12em inside the disc) — the third signal after
  the fill and the ring.
- **Iconed yes/no chips** (NAIVA uses 🥂/🕊️): inline SVG coupes and dove in
  `currentColor`, so the drawing is ours on every platform.

---

## The shape of it

```
lib/content.ts     EVERY word, in both languages. The only file to edit.
lib/date.ts        month grid, countdown, .ics — all read one date constant
lib/photos.ts      six static imports, honest alt text
lib/i18n.ts        t(), route helpers, guest-name sanitiser

app/(hy)/          "/"    Armenian   ─┐ two root layouts, so <html lang> is
app/(en)/en/       "/en"  English    ─┘ correct in the SERVER response
app/api/ics/       the calendar file
app/api/rsvp/      zero-dep endpoint, env-gated delivery

components/Gate.tsx        the envelope
components/Card.tsx        nine bands, server-rendered
components/Countdown.tsx   ticks
components/Rsvp.tsx        posts
components/Chrome.tsx      language + music
components/Motion.tsx      GSAP/Lenis, gated
```

**Five runtime dependencies:** next, react, react-dom, gsap, lenis.

### Band order, and why it is not the reference's

hero → invitation → **countdown** → calendar → programme → gallery → RSVP →
details → footer.

NAIVA puts its countdown immediately above the RSVP form, where it counts down
to the reply deadline and reads as a demand. Here it sits third, counting to
the wedding, where "54 days" is a happy number. The reply deadline is stated in
words beside the form, which is where a deadline belongs.

---

## The rules this build keeps

**The palette was measured before any CSS was written.**

| on paper `#F3EFE7` | ratio | |
|---|---|---|
| ink `#1C1A17` | 15.14:1 | every word |
| gold `#B08D57` | **2.70:1** | ornament only — fails even the 3:1 non-text bar |
| sage `#8C9A82` | **2.59:1** | ornament only |
| gold-ink `#7E6034` | 5.07:1 | coloured text that must be read |
| gold on ink | 5.62:1 | gold *is* legible on the dark band |

So gold never carries a word or a focus ring on paper. The marked calendar day
is a gold disc with **ink** on it (15.14:1 preserved) plus a ring, so it is
never identified by colour alone.

**Two layers, and the plain one is complete.** Everything works with no
JavaScript, on a 320 px phone, with motion switched off. `html.js` is written
before first paint so parked states only ever apply where something exists to
unpark them. If `Motion.tsx` throws, the card is still a well-set document.

**The gate is applied imperatively, never in server markup.** If `inert` and
the scroll lock were server-rendered, a visitor with JavaScript off would get a
permanently inert, permanently unscrollable page behind a hidden envelope.

**Nothing claims to have been sent unless it was.** `/api/rsvp` returns
`delivered: false` when no transport is configured, and the form says so in
plain words instead of showing a tick over nothing.

**No identifiable faces in the gallery.** These are photographs of real people
and the card names a couple who do not exist. Detail frames and distant figures
say everything a wedding gallery needs and claim nothing about anybody. A real
couple brings their own photographs and the constraint disappears.

---

## Making it real

Edit `lib/content.ts`. Nothing else.

1. `couple` — names, monogram, `date`, `end`, `rsvpBy`. The calendar grid and
   the countdown are computed from `date`; move the wedding and both move.
2. `couple.sample = false` — removes the footer's sample notice.
3. `programme.stops` — times, places, addresses, Yandex links.
4. `details.items` — dress code, gifts, children, parking.
5. Replace `assets/photos/*.webp` and the alt text in `lib/photos.ts`.
6. `music` — drop a track in `public/audio/` and name it. The control, the
   autoplay-policy handling and the reduced-motion gate already exist. It ships
   silent because the licence for a commercial recording is the couple's to
   hold, not something to bundle into a demo.

**Per-guest links:** send `/?g=Անի` and the card opens *Հարգելի Անի,* and
pre-fills the RSVP name. Letters, marks, spaces, hyphens and apostrophes only,
40 characters, always a text node.

**RSVP delivery** — copy `.env.example` to `.env.local` and set *either*
`RESEND_API_KEY` + `RSVP_TO`, *or* `RSVP_WEBHOOK` (a Google Apps Script bound
to a Sheet is usually what a couple actually wants — a sortable guest list, not
an inbox).

---

## Verified

Measured on a 430×932 phone at 2× and at 1440×900.

- Sealed: gate present, `role="dialog"`, `html.kn-locked`, `#card` inert, focus
  on the seal, four flaps. Opened: all released, focus lands on the `<h1>`.
- Nine bands, 6,982 px on a phone. **0 of 33** rise elements left invisible.
- Zero console errors. Production build green — 5 routes, 163 kB First Load JS.
- `.ics`: CRLF throughout, commas escaped, `DTSTART:20261010T083000Z` = 12:30
  Yerevan. Folded at 75 **octets**, so no two-byte Armenian character is ever
  split — the trap in every hand-written .ics generator.
- RSVP: valid → 200; honeypot → fake-accept; sub-2s → fake-accept; empty →
  422 with per-field errors; `"Ani\r\nBcc: evil@x.com"` → collapsed to one
  line; `"Sasun Ter-Petrosyan"` → intact.

The last two are there because the sanitiser was **broken twice** and both
failures were invisible in review. The regex reached disk with its escapes
collapsed — the character class became a literal `-`, the whitespace class a
literal `s`. It stripped no control characters *and* mangled ordinary names.
Only posting the hostile string at the running server and reading the log
found it. It is written with `codePointAt` now, with no escape sequence in it
that anything can collapse.

---

## The product layer

iStudio's price list told us what this market actually sells: templates from
13,900֏ *per language*, and a 5,000֏ add-on for «RSVP answers auto-saved to an
Excel sheet». Globally, RSVP *tracking* is the paid core of every platform.
All of it is built in here:

- **The guest book** — every answer is appended to `data/rsvp.jsonl` before
  any transport runs, so a mail failure can never lose an answer. Honest
  limit, stated: this persists anywhere with a real disk; on serverless the
  filesystem is ephemeral, so set `RSVP_WEBHOOK` or Resend there too. The API
  reports `stored` truthfully and the form only warns when an answer reached
  *neither* the book nor a transport.
- **`/guests`** — the couple's dashboard: answers, guests coming, total
  headcount, declines, the full table newest-first. Gated on
  `RSVP_ADMIN_KEY` (constant-time compare); without the right key the list is
  never in the HTML. Dev key: `kniq-dev-2026`.
- **CSV export Excel opens cleanly** — `/api/rsvp/export` starts with the
  UTF-8 BOM (without it Excel renders every Armenian name as mojibake),
  quotes per RFC 4180, CRLF line ends.
- **The share row** — WhatsApp / Telegram / copy-link in the footer, because
  an Armenian invitation travels through family threads. Plain `wa.me` and
  `t.me/share` URLs: no SDK, neither platform ever loads on this page. The
  shared link deliberately drops the personalised `?g=`.
- **Change the answer** — the done screen offers it; a revised answer is a
  newer row in the book. Plans change; locked forms collect stale data.
- **The film slot** — «Վիդեո» is on iStudio's included list; the band exists
  with its full contract and renders when `film` in content.ts names a file.
  Ships null: wedding film belongs to the couple and their videographer.
- **Both languages included** — iStudio charges per language; here `/` and
  `/en` are two server-rendered routes in the same build.

**Fonts are fully self-hosted** after a build failure worth remembering:
`next/font/google` pins exact `fonts.gstatic.com` URLs inside the installed
Next release, and Google rotated them — the pinned Noto Serif Armenian URL
began returning a real 404, so any cold build was dead. The face now lives in
`assets/fonts/` as one 34 KB variable woff2 (it carries the whole weight
axis), where no third party can rot it.

## Still open

- The music track on the envelope card (deliberate — see above); the templates and the wizard take a URL.
- `data/links.jsonl` shares the guest book's serverless caveat — on Vercel a minted short link evaporates on redeploy; the long `?p=` link never does.
- Wizard photos stay on the device (object URLs) — the guest link uses the template's plates until the studio places the real ones at order time; the KIDS studio does upload its one photo at link time (see above).
- Kids' short links share the guest book's disk; `data/photos/` too.
- Yandex links point at Yerevan generally, not at pinned coordinates; a real
  build drops real pins.
- `/guests` key travels as a query parameter — right for this tier, but say
  it plainly: anyone with the link has the list. A couple who wants more gets
  a session cookie, which is a small step from here.
- **Production CSP (fixed 2026-08-19, and worth knowing).** `script-src
  'self'` alone blanked EVERY page under `next start`: the App Router ships
  its RSC payload and the pre-paint scripts as inline `<script>`s, the CSP
  blocked them, React never received the Flight stream («Connection closed»)
  and the tree unmounted to a bare ground — `next build` passing never
  exercised it. `script-src` now allows `'unsafe-inline'` (everything else
  stays strict); the strict upgrade is a per-request nonce from middleware
  (`'strict-dynamic'`), which costs the static prerendering. **Always check a
  build with `next start`, not just `next build`.**
- The engine's RSVP export is Excel today (`/api/rsvp/export`); `export:
  "sheets"` is in the schema and the RSVP config, but the Google Sheets push
  needs a service account and a sheet id from the owner before it can be wired.
- The engine's video hero and audio are the site's synthesized ambient loops
  (labelled so); the couple's own film and song replace them at order time, as
  with the templates.
- «Invitations as a video animation» is the announced third way; the strip
  says COMING NEXT and nothing pretends otherwise.

## Telegram notifications — 2-minute setup (owner)

Orders and RSVPs are always **stored on the server** (`data/orders.jsonl`,
`data/rsvp.jsonl`, both readable at `/guests` with your admin key). To ALSO
receive each one as a Telegram message:

1. Open Telegram, talk to **@BotFather** → `/newbot` → pick any name — it
   replies with a **bot token** like `123456789:AA…`.
2. Send any message to your new bot (it cannot message you first).
3. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser — the
   reply contains `"chat":{"id":123456789,…}` — that number is your
   **chat id**.
4. Put both in `.env.local` (never committed):

   ```
   TELEGRAM_BOT_TOKEN=123456789:AA…
   TELEGRAM_CHAT_ID=123456789
   ```

5. Restart the server. Every order and RSVP now arrives as a message; the
   site's own copy switches from «recorded on this server» to delivered.
