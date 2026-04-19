/**
 * Real sold-property stories. Replace with live data as it arrives from
 * the DOSXM2 team. Each entry drives one flip card in V4Historias.
 */
export interface HistoriaItem {
  id: string;
  title: string;
  zona: string;
  imageUrl: string;
  alt: string;
  story: string;
  outcome?: string;
}

export const HISTORIAS: ReadonlyArray<HistoriaItem> = [
  {
    id: "retiro-atico",
    title: "El ático de Retiro",
    zona: "Retiro",
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&h=1100&fit=crop",
    alt: "Ático reformado con vistas a El Retiro en Madrid",
    story:
      "Una pareja joven que acababa de heredar quería vender sin perder la conexión emocional con la casa. En 22 días encontramos un comprador que valoró cada historia del ático.",
    outcome: "Vendido en 22 días — 4% por encima del precio pedido",
  },
  {
    id: "chamberi-clasico",
    title: "El clásico de Chamberí",
    zona: "Chamberí",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&h=1100&fit=crop",
    alt: "Piso clásico reformado en Chamberí con molduras originales",
    story:
      "Una finca histórica con molduras originales. Trabajamos con el equipo de estilistas para que cada foto contara la esencia del piso — y se vendió antes de publicarse en portales.",
    outcome: "Vendido off-market en 11 días",
  },
  {
    id: "salamanca-senorial",
    title: "El señorial de Salamanca",
    zona: "Salamanca",
    imageUrl:
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=900&h=1100&fit=crop",
    alt: "Piso señorial en el barrio de Salamanca, Madrid",
    story:
      "El propietario llevaba nueve meses intentando vender con otra agencia. Rediseñamos la narrativa y cambiamos el enfoque de la visita guiada. En tres semanas, firmado.",
    outcome: "Vendido al precio original tras 9 meses en el mercado",
  },
  {
    id: "malasana-loft",
    title: "El loft de Malasaña",
    zona: "Malasaña",
    imageUrl:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900&h=1100&fit=crop",
    alt: "Loft industrial con techos altos en el barrio de Malasaña",
    story:
      "Un loft con techos de seis metros y alma industrial. Lo presentamos en formato de tour cinematográfico y el comprador se enamoró antes de visitar la casa en persona.",
    outcome: "Vendido en 15 días — sin rebajas de precio",
  },
  {
    id: "lavapies-reformado",
    title: "El reformado de Lavapiés",
    zona: "Lavapiés",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&h=1100&fit=crop",
    alt: "Piso reformado contemporáneo en Lavapiés, Madrid",
    story:
      "Una reforma integral que había subido el valor de mercado un 40%. Nuestro trabajo fue contarle al mercado por qué — con visitas guiadas donde explicamos cada decisión.",
    outcome: "Vendido al precio de tasación alcista",
  },
  {
    id: "retiro-familiar",
    title: "El familiar de Retiro",
    zona: "Retiro",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=900&h=1100&fit=crop",
    alt: "Piso familiar con terraza en el barrio de Retiro",
    story:
      "Una familia que necesitaba vender rápido para mudarse a Valencia. Coordinamos todo — visitas, notaría, logística — para que solo se preocuparan por empezar su nueva vida.",
    outcome: "Vendido en 18 días — firma en notaría incluida",
  },
];
