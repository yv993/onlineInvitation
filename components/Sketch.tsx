// ============================================================================
// The venue drawings — original line art, in code.
//
// The reference's venue band is built on hand-drawn pencil sketches of its two
// buildings, and that is what makes it the best thing on their card. We cannot
// hand-draw someone's church, but a line drawing lives happily as SVG paths —
// and paths can DRAW THEMSELVES: every stroke here carries pathLength="1", so
// the motion layer parks them at stroke-dashoffset 1 and pulls them to 0 when
// the band arrives. Reduced motion and no-JS simply see the finished drawing,
// because the parked state is applied by JS and never by CSS.
//
// The church is the generic anatomy of an Armenian church — cruciform gable,
// octagonal drum, conical dome, cross — deliberately NOT a portrait of any
// real building (Surb Astvatsatsin is a fictional venue; drawing a real one
// would claim the wedding is somewhere it is not). The hall is an arched
// garden pavilion between two cypresses. Both are drawn on 200×170.
//
// Stroke is --gold, and that is allowed: this is ornament, not text — the 3:1
// bar these fail on paper applies to meaning carried ONLY by the graphic, and
// each drawing sits beside the venue's name, address and map link in ink.
// ============================================================================

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
  pathLength: 1,
};

function Church() {
  return (
    <svg className="kn-sketch" viewBox="0 0 200 170" role="img" aria-hidden="true" focusable="false">
      {/* ground */}
      <path {...S} d="M 14 158 H 186" />
      {/* nave */}
      <path {...S} d="M 58 158 V 98 L 100 76 L 142 98 V 158" />
      {/* west door — arched */}
      <path {...S} d="M 91 158 V 132 Q 91 121 100 121 Q 109 121 109 132 V 158" />
      {/* gable window */}
      <path {...S} d="M 96 104 V 96 Q 96 91 100 91 Q 104 91 104 96 V 104" />
      {/* side wings */}
      <path {...S} d="M 58 122 H 30 V 158" />
      <path {...S} d="M 142 122 H 170 V 158" />
      <path {...S} d="M 38 158 V 140 Q 38 133 44 133 Q 50 133 50 140 V 158" />
      <path {...S} d="M 150 158 V 140 Q 150 133 156 133 Q 162 133 162 140 V 158" />
      {/* drum */}
      <path {...S} d="M 84 76 V 56 H 116 V 76" />
      <path {...S} d="M 90 56 V 66 M 100 56 V 68 M 110 56 V 66" />
      {/* the cone */}
      <path {...S} d="M 80 56 L 100 24 L 120 56" />
      {/* cross */}
      <path {...S} d="M 100 24 V 10 M 94 15 H 106" />
    </svg>
  );
}

function Hall() {
  return (
    <svg className="kn-sketch" viewBox="0 0 200 170" role="img" aria-hidden="true" focusable="false">
      {/* ground */}
      <path {...S} d="M 12 158 H 188" />
      {/* steps */}
      <path {...S} d="M 34 158 V 151 H 166 V 158" />
      <path {...S} d="M 42 151 V 145 H 158 V 151" />
      {/* colonnade — three arches */}
      <path {...S} d="M 50 145 V 114 Q 50 100 66 100 Q 82 100 82 114 V 145" />
      <path {...S} d="M 84 145 V 114 Q 84 100 100 100 Q 116 100 116 114 V 145" />
      <path {...S} d="M 118 145 V 114 Q 118 100 134 100 Q 150 100 150 114 V 145" />
      {/* entablature */}
      <path {...S} d="M 44 100 V 92 H 156 V 100" />
      {/* pediment */}
      <path {...S} d="M 44 92 L 100 66 L 156 92" />
      {/* finial */}
      <path {...S} d="M 100 66 V 58 M 96 60 Q 100 54 104 60" />
      {/* cypresses */}
      <path {...S} d="M 24 158 C 17 132 17 110 24 92 C 31 110 31 132 24 158" />
      <path {...S} d="M 176 158 C 169 132 169 110 176 92 C 183 110 183 132 176 158" />
    </svg>
  );
}

export default function Sketch({ kind }: { kind: "church" | "hall" }) {
  return kind === "church" ? <Church /> : <Hall />;
}
