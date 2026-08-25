import type { T } from "@/lib/content";
import type { EventType, TemplateStyle } from "@/types/invitation";

// ============================================================================
// THE STYLE REGISTRY — the six render styles the engine ships, what each was
// measured against, and which wizard occasion it belongs to. The ids double
// as template ids everywhere else: `live-<style>` is a valid tpl in a Draft,
// a short link, an order, and /invitation/live-<style>?p=… is its guest link.
// ============================================================================

export type StyleSpec = {
  id: TemplateStyle;
  name: T;
  tagline: T;
  after: T; // the reference it mirrors
  occasion: EventType;
  /** the section order, in the reference's words — shown on the showcase */
  anatomy: T[];
  dark: boolean;
};

export const engineStyles: StyleSpec[] = [
  {
    id: "classic-floral",
    name: { hy: "Դասական ծաղկային", en: "Classic Floral Elegance" },
    tagline: { hy: "Կենտրոնացված սերիֆ, մոնոգրամ, երաժշտություն, ժամանակացույց՝ ուղղություններով։", en: "Centred serif, monogram, music, a timeline with directions." },
    after: { hy: "Invito W121-ի կառուցվածքով", en: "After the structure of Invito W121" },
    occasion: "wedding",
    anatomy: [
      { hy: "Դարպաս «Save the date» — երաժշտությունը սկսվում է հպումով", en: "Gate «Save the date» — music starts on tap" },
      { hy: "Հերոս՝ անուններ, ամսաթիվ, մոնոգրամ, ծաղկային շերտ", en: "Hero — names, date, monogram, floral overlay" },
      { hy: "Ողջույնի պարբերություն", en: "Greeting paragraph" },
      { hy: "Հաշվարկ 54 : 14 : 27 : 46", en: "Countdown 54 : 14 : 27 : 46" },
      { hy: "Ամսվա օրացույց", en: "Month calendar" },
      { hy: "Ժամանակացույց՝ պատկերակ, ժամ, վայր, «Ուղղություն» կոճակ", en: "Timeline — icon, time badge, venue, directions button" },
      { hy: "Նկարներ, հագուստի գույներ, մանրամասներ", en: "Photos, dress-code swatches, details" },
      { hy: "RSVP՝ այո/ոչ, կողմ, քանակ, սնունդ", en: "RSVP — yes/no, side, count, meal" },
    ],
    dark: false,
  },
  {
    id: "modern-cinematic",
    name: { hy: "Ժամանակակից կինեմատիկ", en: "Modern Cinematic" },
    tagline: { hy: "Ամբողջ էկրանով վիդեո հերոս, ձայնի կոճակ, ապակե քարտեր, RSVP մոդալ։", en: "Full-screen video hero, mute control, glass cards, RSVP modal." },
    after: { hy: "iStudio 1046-ի կառուցվածքով", en: "After the structure of iStudio 1046" },
    occasion: "wedding",
    anatomy: [
      { hy: "Դարպաս «Save the date · անուններ · օր · Բացել»", en: "Gate «Save the date · names · date · View»" },
      { hy: "Վիդեո հերոս 100svh՝ ձայն/անձայն, օրվա թիվը, ամիսը", en: "Video hero 100svh — mute/unmute, the day numeral, the month" },
      { hy: "Ընտանիքների տող և ողջույն", en: "Families line and greeting" },
      { hy: "«Պահ» — նկար", en: "«Moment» — a photo" },
      { hy: "Ամսվա օրացույց", en: "Month calendar" },
      { hy: "Ապակե քարտ՝ ընդունելություն, ժամ, վայր, «Քարտեզ»", en: "Glass card — reception, time, venue, «View map»" },
      { hy: "Հագուստի կոդ, RSVP մոդալ (քանակ, սնունդ)", en: "Dress code, RSVP modal (count, meal)" },
      { hy: "«27 օր մնաց», սուրբգրային տող, ստորագիր", en: "«27 days left», scripture, footer" },
    ],
    dark: true,
  },
  {
    id: "boarding-pass",
    name: { hy: "Հարսանեկան տոմս", en: "Destination Ticket" },
    tagline: { hy: "Թագույն ֆոն, կրեմ ծակոտկեն տոմսեր, թռիչքի գիծ, ուղեբեռի պիտակ, կնիք, «Նստեցում՝ հանուն սիրո»։", en: "Navy ground, cream perforated tickets, the flight path, a luggage tag, a stamp, «Boarding for love»." },
    after: { hy: "AreOne «Wedding Ticket»-ի կառուցվածքով", en: "After the structure of AreOne «Wedding Ticket»" },
    occasion: "wedding",
    anatomy: [
      { hy: "Տոմս-դարպաս՝ «WEDDING TICKET», գլոբուս, անուններ, աղյուսակ (թռիչք և օր · դաս · ուղղություն · վայր), կլոր կնիք, «Նստեցում»", en: "Ticket gate — «WEDDING TICKET», globe, names, the table (flight & date · class · destination · location), round stamp, «Board now»" },
      { hy: "«Սիրելի՛ ընկերներ և հարազատներ» + նկար, թռիչքի կետագիծ", en: "«Dear friends and family» + photo, the dashed flight path" },
      { hy: "«Սպասում ենք Ձեզ» + ամսվա օրացույց, «Save the date», հաշվարկ", en: "«We are waiting for you» + month calendar, «Save the date», countdown" },
      { hy: "Ուղեբեռի պիտակ՝ ուղղություն", en: "Luggage tag — destination" },
      { hy: "VENUE տոմս՝ վայր, հասցե, «Ինչպես հասնել», նկար, կնիք", en: "VENUE ticket — venue, address, «How to get there», photo, stamp" },
      { hy: "Ժամանակացույց՝ կետեր, ժամերն աջից, թռիչքի գիծ", en: "Timeline — dots, times on the right, the flight path" },
      { hy: "Հագուստի կոդ՝ անվանված նմուշներ (փղոսկր · կրեմ · թաուպ · թագույն · սև), Կանայք · Տղամարդիկ", en: "Dress code — labelled swatches (ivory · cream · taupe · navy · black), Women · Men" },
      { hy: "RSVP, .ics, կիսվել, ստորագիր", en: "RSVP, .ics, share, footer" },
    ],
    dark: true,
  },
  {
    id: "pearl-editorial",
    name: { hy: "Մարգարիտներ", en: "Pearls" },
    tagline: { hy: "Փղոսկրյա թուղթ, մարգարտաշարեր, մեծ անուններ, գրություն ծրարի վրա, ծրագիրը մարգարիտների երկայնքով։", en: "Ivory paper, pearl strings, huge stacked names, a note on an envelope, the programme along a string of pearls." },
    after: { hy: "AreOne «Pearls»-ի կառուցվածքով", en: "After the structure of AreOne «Pearls»" },
    occasion: "wedding",
    anatomy: [
      { hy: "Վերնագոտի՝ լոգո, օրը «14 08 26»", en: "Top bar — logo, the date «14 08 26»" },
      { hy: "Հերոս՝ անունները իրար վրա, «Մեր հարսանիքի օրը», սև-սպիտակ նկար", en: "Hero — names stacked, «Our wedding day!», B&W photo" },
      { hy: "«Սիրելի՛ ընկերներ» — գրություն ծրարի վրա, թղթի ամրակ", en: "«Dear friends!» — a note card on the envelope, paper clip" },
      { hy: "Երեք օրվա շերտ՝ նախորդ · ՕՐԸ · հաջորդ, մարգարտե կախազարդ", en: "Three-day strip — the day before · THE day · the day after, a pearl pendant" },
      { hy: "VENUE սկուտեղի վրա՝ արարողություն + խնջույք, «Դիտել քարտեզում»", en: "VENUE on a tray — ceremony + banquet, «View on map»" },
      { hy: "Օրվա ծրագիրը՝ թաուպ գոտի, ժամերը մարգարտաշարի երկայնքով", en: "Program of the day — taupe band, the hours along a pearl string" },
      { hy: "Հագուստի կոդ՝ գործվածքի շրջաններ, «Դիտել օրինակները»", en: "Dress code — fabric circles, «View examples»" },
      { hy: "«Մեր ալիքը» (Telegram), «Ցանկություններ», RSVP", en: "«Our channel» (Telegram), «Wishes», RSVP" },
    ],
    dark: false,
  },
  {
    id: "dusty-blue",
    name: { hy: "Փոշե-կապույտ բացում", en: "Dusty Blue Reveal" },
    tagline: { hy: "Դաջված ծրարը բացվում է երկու փեղկով. թիթեռ, գրված անուններ, կամարով նկար, ժամանակացույց, մանրամասներ, RSVP, շրջանակված ավարտ։", en: "An embossed gatefold envelope opens: butterfly, script names, arched photo, timeline, details, RSVP, a framed end card." },
    after: { hy: "Ewedlab «Dusty Blue» վիդեո-հրավերի կառուցվածքով", en: "After the Ewedlab «Dusty Blue» envelope-reveal video" },
    occasion: "wedding",
    anatomy: [
      { hy: "Դարպաս՝ փոշե-կապույտ դաջված ծրար, երկու փեղկերը բացվում են", en: "Gate — the dusty-blue embossed envelope, two flaps swing open" },
      { hy: "Քարտ 1՝ թիթեռ, «Մենք ամուսնանում ենք», գրված անուններ", en: "Card 1 — butterfly, «We're getting married», script names" },
      { hy: "Քարտ 2՝ կամարով նկար, ամիս · շաբաթ ՕՐ ժամ · տարի, «հանդիսությունը հետո»", en: "Card 2 — arched photo, month · weekday DAY time · year, «reception to follow»" },
      { hy: "Քարտ 3՝ ծաղկաճյուղ, «timeline», կենտրոնացված ցուցակ", en: "Card 3 — floral sprig, «timeline», centred list" },
      { hy: "Քարտ 4՝ «THE details» — QR, հագուստի կոդ (սրտեր), հյուրանոց", en: "Card 4 — «THE details»: QR, dress code (hearts), hotel" },
      { hy: "Քարտ 5՝ «please RSVP» մինչև օրը, նշում", en: "Card 5 — «please RSVP» by the date, the note" },
      { hy: "Ավարտ՝ թագույն քարտ, ձվաձև զարդաշրջանակ, անունները", en: "End — navy card, ornate oval frame, the names" },
    ],
    dark: false,
  },
  {
    id: "engagement-save-the-date",
    name: { hy: "Նշանադրություն · Save the date", en: "Engagement · Save the Date" },
    tagline: { hy: "Մատանիների նկարների հերոս, երեկոյի ընթացքը, հաշվարկ, օրացույց մեկ հպումով։", en: "Ring photo hero gallery, the evening's timeline, countdown, one-tap calendar." },
    after: { hy: "Ինքնաբերաբար՝ նույն սխեմայից", en: "Generated from the same schema" },
    occasion: "engagement",
    anatomy: [{ hy: "Հերոս՝ նկարների ժապավեն", en: "Hero — photo strip" }, { hy: "Հաշվարկ + .ics", en: "Countdown + .ics" }, { hy: "Երեկոյի ընթացքը", en: "The evening" }, { hy: "Նկարներ, RSVP", en: "Photos, RSVP" }],
    dark: false,
  },
  {
    id: "baptism-kunk",
    name: { hy: "Կնունք", en: "Baptism · Kunk" },
    tagline: { hy: "Ամպային մասնիկներ, կնքահոր և կնքամոր նվիրում, եկեղեցու ուղղություններ։", en: "Cloud particles, godparents' dedication, church directions." },
    after: { hy: "Ինքնաբերաբար՝ նույն սխեմայից", en: "Generated from the same schema" },
    occasion: "baptism",
    anatomy: [{ hy: "Հերոս՝ ամպեր", en: "Hero — clouds" }, { hy: "Կնքահայր և կնքամայր", en: "Godparents" }, { hy: "Օրվա կարգը՝ եկեղեցի, ուղղություն", en: "The order — church, directions" }, { hy: "RSVP՝ սնունդ", en: "RSVP — meal" }],
    dark: false,
  },
  {
    id: "birthday-anniversary",
    name: { hy: "Ծնունդ · Տարեդարձ", en: "Birthday · Anniversary" },
    tagline: { hy: "Կենդանի կոնֆետի/նեոն կտավ, տարիքի հաշվարկ, հյուրերի բարեմաղթանքների պատ։", en: "Live confetti/neon canvas, age counter, guest message board." },
    after: { hy: "Ինքնաբերաբար՝ նույն սխեմայից", en: "Generated from the same schema" },
    occasion: "birthday",
    anatomy: [{ hy: "Նեոն հերոս", en: "Neon hero" }, { hy: "Տարիքի հաշվարկ", en: "Age counter" }, { hy: "Երեկոն", en: "The night" }, { hy: "Բարեմաղթանքների պատ, RSVP մոդալ", en: "Message board, RSVP modal" }],
    dark: true,
  },
  {
    id: "gala-corporate",
    name: { hy: "Գալա · Կորպորատիվ", en: "Gala · Corporate" },
    tagline: { hy: "Վիդեո հերոս, օրակարգ, բանախոսներ, գրանցում։", en: "Video hero, agenda, speakers, registration." },
    after: { hy: "Ինքնաբերաբար՝ նույն սխեմայից", en: "Generated from the same schema" },
    occasion: "gala",
    anatomy: [{ hy: "Վիդեո հերոս", en: "Video hero" }, { hy: "Օրակարգ", en: "Agenda" }, { hy: "Բանախոսներ", en: "Speakers" }, { hy: "Գրանցում (մոդալ)", en: "Registration (modal)" }],
    dark: true,
  },
];

export const findStyle = (id: string | undefined | null): StyleSpec | undefined => engineStyles.find((s) => s.id === id);

/** "live-<style>" ⇄ style */
export function parseLiveTpl(tpl: string | undefined | null): StyleSpec | null {
  if (!tpl || !tpl.startsWith("live-")) return null;
  return findStyle(tpl.slice(5)) ?? null;
}
export const liveTpl = (style: TemplateStyle) => `live-${style}`;

/** which styles the wizard shows for an occasion (own first, the rest after) */
export function stylesFor(occasion: EventType | "corporate"): StyleSpec[] {
  const occ = occasion === "corporate" ? "gala" : occasion;
  return [...engineStyles.filter((s) => s.occasion === occ), ...engineStyles.filter((s) => s.occasion !== occ)];
}
