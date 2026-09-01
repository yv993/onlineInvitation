import Icon from "@/components/Icon";
import { t } from "@/lib/i18n";
import type { Lang, T } from "@/lib/content";

/** the copy the two venue cards own */
const L = {
  blessing: { hy: "Որտեղ կկատարվի պսակադրությունը", en: "Where the blessing will happen", ru: "Где состоится венчание" } as T,
  ceremony: { hy: "Պսակադրություն", en: "Ceremony", ru: "Венчание" } as T,
  celebrate: { hy: "Որտեղ կտոնենք", en: "Where we celebrate", ru: "Где мы празднуем" } as T,
  reception: { hy: "Խնջույք և ընթրիք", en: "Reception & dinner", ru: "Банкет и ужин" } as T,
  map: { hy: "Բացել քարտեզում", en: "Open map", ru: "Открыть карту" } as T,
};

/** The ARMENIAN CHURCH (the client's own drawing, 2026-08-31, ported path
 *  for path): conical stone cupola over the drum, arched windows, the
 *  transept gables and the arched portal. */
export const ArmenianChurchSketch = () => (
  <svg viewBox="0 0 200 220" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* the cross */}
    <line x1="100" y1="12" x2="100" y2="30" />
    <line x1="94" y1="18" x2="106" y2="18" />
    {/* the conical roof */}
    <path d="M100 28 L72 75 L128 75 Z" />
    <line x1="100" y1="28" x2="100" y2="75" strokeDasharray="2 2" strokeWidth="0.8" />
    <line x1="100" y1="28" x2="86" y2="75" strokeWidth="0.8" />
    <line x1="100" y1="28" x2="114" y2="75" strokeWidth="0.8" />
    {/* the drum, with its arched windows */}
    <rect x="74" y="75" width="52" height="28" />
    <path d="M84 94 V84 Q88 80 92 84 V94" />
    <path d="M108 94 V84 Q112 80 116 84 V94" />
    {/* the body and the transept gables */}
    <path d="M50 120 L74 103 L126 103 L150 120 V205 H50 Z" />
    <path d="M70 125 L100 106 L130 125 V205 H70 Z" />
    {/* the masonry courses */}
    <line x1="50" y1="145" x2="70" y2="145" strokeWidth="0.7" />
    <line x1="130" y1="145" x2="150" y2="145" strokeWidth="0.7" />
    <line x1="50" y1="175" x2="70" y2="175" strokeWidth="0.7" />
    <line x1="130" y1="175" x2="150" y2="175" strokeWidth="0.7" />
    {/* the portal */}
    <path d="M86 205 V165 Q100 150 114 165 V205" strokeWidth="1.6" />
    <path d="M91 205 V170 Q100 158 109 170 V205" strokeWidth="1" />
    <path d="M96 142 V132 Q100 128 104 132 V142 Z" strokeWidth="1" />
    {/* the steps */}
    <line x1="38" y1="205" x2="162" y2="205" strokeWidth="1.5" />
    <line x1="30" y1="211" x2="170" y2="211" strokeWidth="1.2" />
  </svg>
);

/** The RESTAURANT (the client's own drawing, 2026-08-31, ported path for
 *  path): the classical pediment, the colonnade, festoon lights, the
 *  balustrade, stone steps and the potted topiaries. */
export const RestaurantSketch = () => (
  <svg viewBox="0 0 320 220" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* the foliage behind */}
    <g strokeWidth="0.8" opacity="0.65" strokeDasharray="1 2">
      <path d="M25 150 Q20 110 35 90 Q50 70 65 95 Q80 115 75 150" />
      <path d="M245 150 Q240 100 260 80 Q285 60 300 90 Q310 120 295 150" />
      <path d="M270 90 Q290 65 305 75" />
    </g>
    {/* the pediment */}
    <polygon points="160,28 50,75 270,75" strokeWidth="1.5" />
    <polygon points="160,35 65,75 255,75" strokeWidth="0.8" />
    <line x1="160" y1="35" x2="160" y2="75" strokeWidth="0.6" />
    <line x1="130" y1="48" x2="130" y2="75" strokeWidth="0.6" />
    <line x1="100" y1="61" x2="100" y2="75" strokeWidth="0.6" />
    <line x1="190" y1="48" x2="190" y2="75" strokeWidth="0.6" />
    <line x1="220" y1="61" x2="220" y2="75" strokeWidth="0.6" />
    {/* the tympanum medallion */}
    <circle cx="160" cy="58" r="8" strokeWidth="1" />
    <circle cx="160" cy="58" r="5" strokeWidth="0.6" strokeDasharray="1 1" />
    {/* the entablature */}
    <rect x="52" y="75" width="216" height="12" strokeWidth="1.2" />
    <line x1="52" y1="81" x2="268" y2="81" strokeWidth="0.6" />
    {/* the festoon lights */}
    <path d="M60 87 Q85 102 110 87 Q135 102 160 87 Q185 102 210 87 Q235 102 260 87" strokeWidth="0.9" />
    <g strokeWidth="0.6" opacity="0.85">
      <circle cx="85" cy="98" r="1.5" fill="currentColor" />
      <circle cx="135" cy="98" r="1.5" fill="currentColor" />
      <circle cx="185" cy="98" r="1.5" fill="currentColor" />
      <circle cx="235" cy="98" r="1.5" fill="currentColor" />
    </g>
    {/* the colonnade */}
    <line x1="65" y1="87" x2="65" y2="165" strokeWidth="1.6" />
    <line x1="71" y1="87" x2="71" y2="165" strokeWidth="0.8" />
    <line x1="110" y1="87" x2="110" y2="165" strokeWidth="1.4" />
    <line x1="115" y1="87" x2="115" y2="165" strokeWidth="0.7" />
    <line x1="155" y1="87" x2="155" y2="165" strokeWidth="1.4" />
    <line x1="165" y1="87" x2="165" y2="165" strokeWidth="1.4" />
    <line x1="205" y1="87" x2="205" y2="165" strokeWidth="0.7" />
    <line x1="210" y1="87" x2="210" y2="165" strokeWidth="1.4" />
    <line x1="249" y1="87" x2="249" y2="165" strokeWidth="0.8" />
    <line x1="255" y1="87" x2="255" y2="165" strokeWidth="1.6" />
    {/* the doors and arched windows */}
    <path d="M80 140 V105 Q92 95 104 105 V140" strokeWidth="0.9" />
    <path d="M142 165 V110 Q160 98 178 110 V165" strokeWidth="1.1" />
    <line x1="160" y1="104" x2="160" y2="165" strokeWidth="0.8" />
    <path d="M216 140 V105 Q228 95 240 105 V140" strokeWidth="0.9" />
    {/* the balustrade */}
    <line x1="58" y1="138" x2="262" y2="138" strokeWidth="1.2" />
    <line x1="58" y1="148" x2="262" y2="148" strokeWidth="1" />
    {[75, 85, 95, 125, 135, 145, 175, 185, 195, 225, 235, 245].map((pos) => (
      <line key={pos} x1={pos} y1="138" x2={pos} y2="148" strokeWidth="0.8" />
    ))}
    {/* the plinth and the stone steps */}
    <rect x="48" y="165" width="224" height="10" strokeWidth="1.4" />
    <polygon points="40,175 280,175 288,183 32,183" strokeWidth="1.2" />
    <polygon points="28,183 292,183 300,192 20,192" strokeWidth="1.4" />
    <line x1="45" y1="179" x2="275" y2="179" strokeWidth="0.5" strokeDasharray="3 3" />
    <line x1="35" y1="187" x2="285" y2="187" strokeWidth="0.5" strokeDasharray="3 3" />
    {/* the topiaries */}
    <ellipse cx="38" cy="165" rx="8" ry="12" strokeWidth="1" />
    <path d="M33 177 L35 188 L41 188 L43 177" strokeWidth="1" />
    <ellipse cx="282" cy="165" rx="8" ry="12" strokeWidth="1" />
    <path d="M277 177 L279 188 L285 188 L287 177" strokeWidth="1" />
    {/* the cobbles */}
    <path d="M80 198 Q100 196 120 198" strokeWidth="0.7" />
    <path d="M140 202 Q160 200 180 202" strokeWidth="0.7" />
    <path d="M200 197 Q220 195 240 197" strokeWidth="0.7" />
    <path d="M110 208 Q130 206 150 208" strokeWidth="0.6" strokeDasharray="2 2" />
    <path d="M170 210 Q190 208 210 210" strokeWidth="0.6" strokeDasharray="2 2" />
  </svg>
);

/** one venue card: the drawing, the name, the address, and the map link */
function VenueCard({ lang, head, tag, art, name, address, url, id }: {
  lang: Lang; head: T; tag: T; art: React.ReactNode; name: string; address: string; url?: string; id?: string;
}) {
  const href = url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([name, address].filter(Boolean).join(", "))}`;
  return (
    <div className="kn-tb kn-vn" id={id} data-rise data-reveal>
      <p className="kn-vn__head">{t(lang, head)}</p>
      <p className="kn-vn__tag">{t(lang, tag)}</p>
      <div className="kn-vn__art">{art}</div>
      <h3 className="kn-vn__name">{name}</h3>
      {address && <p className="kn-vn__addr">{address}</p>}
      <a className="kn-vn__btn" href={href} target="_blank" rel="noopener noreferrer">
        <Icon name="map" size={14} /> {t(lang, L.map)}
      </a>
    </div>
  );
}

/** THE TWO VENUES (wedding-12, the client's 2026-08-31 drawings): the
 *  church the blessing happens in, and the restaurant the evening moves
 *  to — each with its own drawing and its own map link. The reception
 *  falls back to the day plan's last stop when the couple has not named
 *  one, so nothing here is ever invented. */
export default function TwoVenues({ lang, church, churchAddress, city, reception, receptionAddress, mapUrl }: {
  lang: Lang;
  church: string;
  churchAddress: string;
  city: string;
  reception?: string;
  receptionAddress?: string;
  mapUrl?: string;
}) {
  const churchLine = churchAddress || city;
  return (
    <>
      <VenueCard
        lang={lang} id="where" head={L.blessing} tag={L.ceremony}
        art={<ArmenianChurchSketch />} name={church} address={churchLine} url={mapUrl}
      />
      {reception && (
        <VenueCard
          lang={lang} head={L.celebrate} tag={L.reception}
          art={<RestaurantSketch />} name={reception}
          address={receptionAddress && receptionAddress !== reception ? receptionAddress : city}
        />
      )}
    </>
  );
}
