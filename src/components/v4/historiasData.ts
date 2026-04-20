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
    imageUrl: "/v4/properties/property1.jpg",
    alt: "Escalera de granito y salón abierto a la cocina en un bajo del centro de Getafe",
    story:
      "Bajo en el centro de Getafe con reforma integral de menos de cuatro años, tratamiento antihumedad hecho por la comunidad y plaza de garaje a 300 m.",
    outcome: "A la venta por 227.000€",
  },
  {
    id: "getafe-garaje",
    title: "El piso con garaje doble",
    zona: "Getafe Centro",
    imageUrl: "/v4/properties/property2.jpg",
    alt: "Salón-comedor con escalera metálica en un piso reformado del centro de Getafe",
    story:
      "Piso de 74 m² totalmente reformado en el centro de Getafe. Tres habitaciones y una plaza de garaje espectacular —lugar para dos coches pequeños— incluida en el precio.",
    outcome: "A la venta en Getafe Centro — incluye plaza de garaje",
  },
  {
    id: "fuenlabrada-piso",
    title: "El ingreso de Fuenlabrada",
    zona: "Fuenlabrada",
    imageUrl: "/v4/properties/property3.jpg",
    alt: "Salón con sofá naranja y comedor clásico con reloj de pie en un piso a reformar en Fuenlabrada",
    story:
      "Próximo ingreso en Fuenlabrada: piso de más de 70 m², tres habitaciones y un gran trastero, para reformar.",
    outcome: "A reformar — 208.000€",
  },
  {
    id: "fuenlabrada-local",
    title: "El local de Tomás y Valiente",
    zona: "Fuenlabrada",
    imageUrl: "/v4/properties/property4.jpg",
    alt: "Cocina con muebles de madera y azulejos azules de estilo tradicional en Fuenlabrada",
    story:
      "Local en la zona Tomás y Valiente de Fuenlabrada. 50 m² útiles, a 300 m de la estación La Serna y a 100 m de la Avenida de España.",
    outcome: "En venta por 67.000€",
  },
  {
    id: "viso-san-juan",
    title: "La casa de El Viso de San Juan",
    zona: "El Viso de San Juan",
    imageUrl: "/v4/properties/property5.jpg",
    alt: "Salón-comedor luminoso con mesa de cristal y sofá beige en una vivienda de El Viso de San Juan",
    story:
      "Vivienda con personalidad en El Viso de San Juan, a pocos minutos de Madrid: cocina ajedrezada en rojo y blanco, biblioteca con alfombra persa y detalles que no aparecen en obra nueva.",
    outcome: "A la venta",
  },
  {
    id: "vendido-primer-dia",
    title: "Vendido en el primer día de visitas",
    zona: "Madrid",
    imageUrl: "/v4/properties/property6.jpg",
    alt: "Salón clásico con sofás azules, parqué en espiga y lámpara de araña en un piso vendido en Madrid",
    story:
      "Uno de los últimos ingresos del equipo. Se firmó en la primera jornada de visitas.",
    outcome: "Vendido el primer día de visitas",
  },
];
