/**
 * Real listings and sales from DOSXM2, sourced from the team's TikTok
 * content. Each entry drives one flip card in V4Historias. Captions and
 * outcomes are paraphrased from the public TikTok posts at @dosxm2.
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
    id: "getafe-bajo-revista",
    title: "El bajo de revista en Getafe",
    zona: "Getafe Centro",
    imageUrl: "/v4/properties/getafe-bajo-revista.webp",
    alt: "Salón reformado con tonos cálidos en un bajo del centro de Getafe",
    story:
      "Un bajo con reforma integral, tratamiento antihumedad y plaza de garaje a 300 m. Rodamos la visita como si fuese un editorial, no un anuncio más, para que los compradores vieran la casa y no solo los metros.",
    outcome: "A la venta por 227.000€ — reforma integral de menos de 4 años",
  },
  {
    id: "getafe-garaje",
    title: "El piso con garaje doble",
    zona: "Getafe Centro",
    imageUrl: "/v4/properties/getafe-garaje.webp",
    alt: "Salón reformado de un piso de 74 m² en el centro de Getafe",
    story:
      "74 m² totalmente reformados, tres habitaciones, y una plaza de garaje espectacular con capacidad para dos coches pequeños incluida en el precio. Trabajamos el discurso para que el garaje —que era el gran diferencial— apareciese en la primera frase del anuncio.",
    outcome: "Piso + garaje vendido como paquete único",
  },
  {
    id: "fuenlabrada-piso",
    title: "El ingreso de Fuenlabrada",
    zona: "Fuenlabrada",
    imageUrl: "/v4/properties/fuenlabrada-piso.webp",
    alt: "Balcón con vistas al barrio en un piso a reformar en Fuenlabrada",
    story:
      "Piso de más de 70 m², tres habitaciones y un gran trastero. Entró como 'próximo ingreso' y lo presentamos con un tour en vivo desde la terraza antes de que llegaran los portales.",
    outcome: "A reformar — 208.000€",
  },
  {
    id: "fuenlabrada-local",
    title: "El local de Tomás y Valiente",
    zona: "Fuenlabrada",
    imageUrl: "/v4/properties/fuenlabrada-local.webp",
    alt: "Local comercial diáfano en la zona Tomás y Valiente de Fuenlabrada",
    story:
      "50 m² útiles a 100 m de la Avenida de España y a 300 m de La Serna. Para un local, el contexto vende más que el interior: rodamos desde la calle hacia dentro para que se viera el paso de gente antes del espacio vacío.",
    outcome: "En venta por 67.000€",
  },
  {
    id: "viso-san-juan",
    title: "La casa de El Viso de San Juan",
    zona: "El Viso de San Juan",
    imageUrl: "/v4/properties/viso-san-juan.webp",
    alt: "Cocina con azulejos rojos y blancos en una vivienda de El Viso de San Juan",
    story:
      "Una vivienda con personalidad —cocina ajedrezada, biblioteca con alfombra persa, detalles que no se dan en obra nueva— a pocos minutos de Madrid. La contamos como un hogar, no como un activo.",
    outcome: "En venta — tour completo publicado",
  },
  {
    id: "vendido-primer-dia",
    title: "Vendido en el primer día de visitas",
    zona: "Madrid Sur",
    imageUrl: "/v4/properties/vendido-primer-dia.webp",
    alt: "Salón amplio con sofás azules y parqué en un piso del sur de Madrid",
    story:
      "Uno de nuestros últimos ingresos. Preparamos el material, filtramos a los compradores por teléfono y abrimos la agenda del primer día con una lista corta —la casa se fue antes de cerrar la jornada.",
    outcome: "Vendido el primer día de visitas",
  },
];
