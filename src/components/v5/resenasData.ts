/**
 * Reseñas reales de clientes de DOSXM2 (texto verbatim de Google Reviews).
 * Los nombres y barrios del campo `sender`/`location` los facilitó el
 * cliente con consentimiento explícito; coinciden con los autores reales
 * de cada reseña.
 */
export interface ResenaItem {
  id: string;
  sender: string;
  location: string;
  text: string;
  side: "left" | "right";
  time: string;
}

export const RESENAS: ReadonlyArray<ResenaItem> = [
  {
    id: "cm-piso-familiar",
    sender: "Chus P",
    location: "Getafe",
    text: "Agradecer a Borja y a Pablo su excelente labor en la venta de un piso familiar. Destacar su profesionalidad y cercanía, trato amable y el compromiso que mostraron en todo momento. Muchísimas gracias por todo.",
    side: "left",
    time: "09:42",
  },
  {
    id: "l-getafe",
    sender: "Oscar Fernández",
    location: "Madrid",
    text: "Hemos tenido una gran experiencia en general y con el equipo de Dosxm2. Borja y Pablo han estado atentos en todo momento. Cualquier duda estaban disponibles 24/7. Nos han acompañado en todo lo que les hemos necesitado. Muy muy recomendables.",
    side: "right",
    time: "13:18",
  },
  {
    id: "rp-enquistada",
    sender: "Marco de la Rasilla",
    location: "Guadalajara",
    text: "Borja y Pablo del equipo dosxm2, han sido muy resolutivos con una operación que llevábamos bastante tiempo enquistada. Han sido unos profesionales muy amables y eficaces. Los recomendaremos siempre, gracias por vuestra ayuda.",
    side: "left",
    time: "17:05",
  },
  {
    id: "ja-no-facil",
    sender: "Adrian Sánchez",
    location: "Getafe",
    text: "Vendimos nuestra casa con el equipo de DoSxM2, Pablo y Borja, y la experiencia no pudo ser mejor. Nos despreocupamos de casi todo y vendieron nuestra casa bastante rápido, a pesar de no ser una venta fácil. Recomendado 100%, unos cracks.",
    side: "right",
    time: "20:34",
  },
];
