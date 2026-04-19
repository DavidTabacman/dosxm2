/**
 * Real listings and sales from DOSXM2, sourced from the team's TikTok
 * captions at @dosxm2. Every `outcome` string below is drawn directly
 * from the public caption of the corresponding video — no process
 * claims are invented here. Narrative color belongs in the UI chrome,
 * not in data the site reads as factual.
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
      "Bajo en el centro de Getafe con reforma integral de menos de cuatro años, tratamiento antihumedad hecho por la comunidad y plaza de garaje a 300 m.",
    outcome: "A la venta por 227.000€",
  },
  {
    id: "getafe-garaje",
    title: "El piso con garaje doble",
    zona: "Getafe Centro",
    imageUrl: "/v4/properties/getafe-garaje.webp",
    alt: "Salón reformado de un piso de 74 m² en el centro de Getafe",
    story:
      "Piso de 74 m² totalmente reformado en el centro de Getafe. Tres habitaciones y una plaza de garaje espectacular —lugar para dos coches pequeños— incluida en el precio.",
    outcome: "A la venta en Getafe Centro — incluye plaza de garaje",
  },
  {
    id: "fuenlabrada-piso",
    title: "El ingreso de Fuenlabrada",
    zona: "Fuenlabrada",
    imageUrl: "/v4/properties/fuenlabrada-piso.webp",
    alt: "Balcón con vistas al barrio en un piso a reformar en Fuenlabrada",
    story:
      "Próximo ingreso en Fuenlabrada: piso de más de 70 m², tres habitaciones y un gran trastero, para reformar.",
    outcome: "A reformar — 208.000€",
  },
  {
    id: "fuenlabrada-local",
    title: "El local de Tomás y Valiente",
    zona: "Fuenlabrada",
    imageUrl: "/v4/properties/fuenlabrada-local.webp",
    alt: "Local comercial diáfano en la zona Tomás y Valiente de Fuenlabrada",
    story:
      "Local en la zona Tomás y Valiente de Fuenlabrada. 50 m² útiles, a 300 m de la estación La Serna y a 100 m de la Avenida de España.",
    outcome: "En venta por 67.000€",
  },
  {
    id: "viso-san-juan",
    title: "La casa de El Viso de San Juan",
    zona: "El Viso de San Juan",
    imageUrl: "/v4/properties/viso-san-juan.webp",
    alt: "Cocina con azulejos rojos y blancos en una vivienda de El Viso de San Juan",
    story:
      "Vivienda con personalidad en El Viso de San Juan, a pocos minutos de Madrid: cocina ajedrezada en rojo y blanco, biblioteca con alfombra persa y detalles que no aparecen en obra nueva.",
    outcome: "A la venta",
  },
  {
    id: "vendido-primer-dia",
    title: "Vendido en el primer día de visitas",
    zona: "Madrid",
    imageUrl: "/v4/properties/vendido-primer-dia.webp",
    alt: "Salón amplio con sofás azules y parqué en un piso a la venta en Madrid",
    story:
      "Uno de los últimos ingresos del equipo. Se firmó en la primera jornada de visitas.",
    outcome: "Vendido el primer día de visitas",
  },
];
