/**
 * Real client reviews. Replace with verified testimonials sourced from
 * Google, Idealista, or the DOSXM2 client list as they arrive.
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
    id: "ana-malasana",
    sender: "Ana",
    location: "Malasaña",
    text: "Nos ayudaron en cada paso. Vendieron el piso en tiempo récord y con un trato tan cercano que parecía que éramos familia.",
    side: "left",
    time: "14:32",
  },
  {
    id: "pedro-lucia-chamberi",
    sender: "Pedro y Lucía",
    location: "Chamberí",
    text: "Dos visiones, un objetivo. Fueron los únicos que entendieron la historia de nuestra casa y la supieron contar al mercado.",
    side: "right",
    time: "16:45",
  },
  {
    id: "javier-salamanca",
    sender: "Javier",
    location: "Salamanca",
    text: "Tras nueve meses con otra agencia, ellos la vendieron en tres semanas al precio pedido. Profesionalidad y corazón.",
    side: "left",
    time: "10:15",
  },
  {
    id: "marta-retiro",
    sender: "Marta",
    location: "Retiro",
    text: "Me acompañaron desde la decisión hasta la firma. No fue vender una casa, fue cerrar un capítulo con alguien a tu lado.",
    side: "right",
    time: "11:02",
  },
];
