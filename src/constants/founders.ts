/**
 * Single source of truth for founder identity, contact, and bio copy.
 * Consumed by `/v4` (homepage strip + contact + FAB) and `/v4/conocenos`
 * (about-us page). Keep all client-supplied Spanish text here so a copy
 * change is a one-file edit.
 */

export interface Founder {
  name: string;
  portraitUrl: string;
  alt: string;
  /**
   * Optional cinemagraph loop. When set, V4Diferencial renders <video>
   * instead of <img> (suppressed under prefers-reduced-motion). The
   * <video> uses portraitUrl as its poster so first paint matches the
   * still asset. mp4 is required for browser coverage; webm is optional
   * (preferred when present so modern browsers get the smaller AV1/VP9).
   */
  loopVideo?: {
    webm?: string;
    mp4: string;
  };
}

/**
 * Visual badge that follows the intro line ("Yo soy …"). A string starting
 * with "/" is treated as an image src (used for Borja, where no Unicode
 * emoji renders bald + bearded across platforms); anything else is an
 * emoji character rendered as text.
 */
export type IntroBadge =
  | { kind: "emoji"; char: string }
  | { kind: "image"; src: string; alt: string };

export interface FounderBio {
  /** Text only — no emoji baked in. The badge is rendered separately. */
  introLine: string;
  introBadge: IntroBadge;
  paragraphs: ReadonlyArray<string>;
}

export const FOUNDER_PABLO: Founder = {
  name: "Pablo",
  portraitUrl: "/v4/founders/founder_pablo.webp",
  alt: "Retrato de Pablo, cofundador de DOSXM2",
  loopVideo: { mp4: "/v4/founders/founder_pablo.mp4" },
};

export const FOUNDER_BORJA: Founder = {
  name: "Borja",
  portraitUrl: "/v4/founders/founder_borja.webp",
  alt: "Retrato de Borja, cofundador de DOSXM2",
  loopVideo: { mp4: "/v4/founders/founder_borja.mp4" },
};

export const TOGETHER_IMAGE = {
  webp: "/v4/founders/together.webp",
  jpgFallback: "/v4/founders/together-1200.jpg",
  alt: "Pablo y Borja, los dos fundadores de DOSXM2",
} as const;

export const BORJA_PHONE = "34667006662";
export const PABLO_PHONE = "34674527410";

export const BORJA_EMAIL = "borja.gallego@dosxm2.com";
export const PABLO_EMAIL = "pablo.dupont@dosxm2.com";

export const FOUNDERS = [
  { name: "Borja", phone: BORJA_PHONE, email: BORJA_EMAIL },
  { name: "Pablo", phone: PABLO_PHONE, email: PABLO_EMAIL },
] as const;

export const WA_MESSAGE =
  "Hola DOSXM2, quiero información sobre cómo vender mi casa en Madrid.";

export const CONTACTO_FOUNDERS = {
  a: {
    name: FOUNDER_BORJA.name,
    phone: BORJA_PHONE,
    portraitUrl: FOUNDER_BORJA.portraitUrl,
    portraitAlt: FOUNDER_BORJA.alt,
  },
  b: {
    name: FOUNDER_PABLO.name,
    phone: PABLO_PHONE,
    portraitUrl: FOUNDER_PABLO.portraitUrl,
    portraitAlt: FOUNDER_PABLO.alt,
  },
  message: WA_MESSAGE,
} as const;

/**
 * Conócenos page — client-supplied bios. Each founder gets a small badge
 * after the intro line. Both badges are Twemoji-derived SVGs so the
 * artwork is byte-identical on every OS — Pablo's is the unmodified
 * "person raising hand: light skin tone, male" glyph, Borja's is the
 * same base modified for bald + Van Dyke (no Unicode emoji renders that
 * consistently across iOS and Android). Do NOT strip — the badges are
 * part of the founders' voice.
 */
export const FOUNDER_BIOS: Record<"pablo" | "borja", FounderBio> = {
  pablo: {
    introLine: "Yo soy Pablo",
    introBadge: {
      kind: "image",
      src: "/v4/founders/pablo-emoji.svg",
      alt: "",
    },
    paragraphs: [
      "Nací en Banfield, un barrio de la zona sur de Gran Buenos Aires, Argentina.",
      "Hace ya varios años decidí venir a vivir a Madrid, y aquí encontré no solo una oportunidad profesional, sino también mi lugar.",
      "Soy graduado de la Universidad de Ciencias Económicas de Buenos Aires (UBA) y durante más de 10 años he trabajado en empresas multinacionales dentro del sector servicios. Esa experiencia me ha dado algo clave: entender a las personas, saber escuchar y encontrar soluciones reales a lo que necesitan.",
      "Porque al final, esto no va de casas, va de personas. Y mi forma de trabajar siempre ha sido esa: cercanía, claridad y compromiso.",
    ],
  },
  borja: {
    introLine: "Yo soy Borja",
    introBadge: {
      kind: "image",
      src: "/v4/founders/borja-emoji.svg",
      alt: "",
    },
    paragraphs: [
      "He crecido en un barrio trabajador de Getafe, y eso me ha marcado.",
      "Desde pequeño, en casa me enseñaron algo muy simple: si das tu palabra, la cumples. Trabajo, sacrificio y honestidad no son solo valores, es la forma en la que entiendo tanto la vida como mi profesión.",
      "He pasado casi una década en el grupo Saint-Gobain, asumiendo responsabilidades importantes que me han dado una base muy sólida: organización, toma de decisiones y compromiso real con los resultados.",
      "Además, siempre he tenido mentalidad emprendedora, lo que me ha llevado a desarrollar mis propios proyectos empresariales.",
      "Hoy aplico todo eso al sector inmobiliario: hacer las cosas bien, sin rodeos y con responsabilidad.",
    ],
  },
};

export const JUNTOS_HEADING = "¿Por qué nos unimos?";

export const JUNTOS_PARAGRAPHS: ReadonlyArray<string> = [
  "DOSxM2 no nace de la casualidad, evidenciamos que juntos éramos realmente mejores.",
  "Nuestra experiencia en varias inmobiliarias ha demostrado la calidad de nuestro trabajo.",
  "La combinación de nuestras cualidades se traduce directamente en lo que hacemos: mayor implicación, más soluciones y, sobre todo, un mejor servicio para ti.",
  "¡Somos un equipo que funciona como uno solo!",
];
