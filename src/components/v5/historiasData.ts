/**
 * Real sales by DOSXM2 — source of truth: "Historias vendidas" PDF
 * supplied by the team. Each entry pairs the property address with the
 * seller-buyer narrative captured in the PDF, verbatim.
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
    id: "castilla-vieja-21",
    title: "Castilla la Vieja 21",
    zona: "Fuenlabrada",
    imageUrl: "/v4/properties/castilla-vieja-21.jpg",
    alt: "Salón luminoso con sofá rosa, cojines azules y ventanal corrido con vistas al cielo",
    story:
      "Víctor y Estefanía solicitaron nuestros servicios porque necesitaban un cambio, una vivienda más grande, pero sobre todo que tuviera un garaje donde él pudiera “jugar” con sus coches. Olga y José fueron los compradores ideales, ya que también vendieron su casa con nosotros y esta SÍ tenía ese ascensor tan deseado. Ambos están felices en sus nuevas vidas!!",
    outcome: "Vendido",
  },
  {
    id: "paular-2",
    title: "Paular 2",
    zona: "Getafe",
    imageUrl: "/v4/properties/paular-2.jpg",
    alt: "Cocina reformada con frigorífico americano, microondas empotrado y muebles blancos",
    story:
      "Adrián y Estela llevaban unos meses intentando vender su casa, un bajo precioso en el centro de Getafe, para poder comprar una casa más grande en Valdemoro. Raquel buscaba un piso en esa misma zona, ya que trabajaba a unas calles de allí, así podría escaparse a comer a su casa en el break del trabajo, y no tener que viajar mucho. Más céntrico imposible!!",
    outcome: "Vendido",
  },
  {
    id: "travesia-espana",
    title: "Travesía de España 10",
    zona: "El Viso de San Juan",
    imageUrl: "/v4/properties/travesia-espana.jpg",
    alt: "Recibidor con escalera de granito y vista a la cocina abierta con muebles de madera",
    story:
      "Vero y Jose nos pidieron que vendiéramos su propiedad, la cual compraron con mucha ilusión y esfuerzo hace más de una década, tras hacerle unos pequeños cambios, llegaron Lorena y Javier una parejita joven con muchas ganas de darle de nuevo esa vida de primera vivienda, ENHORABUENA!!!",
    outcome: "Vendido",
  },
  {
    id: "alberdi-40",
    title: "Alberdi 40",
    zona: "Madrid",
    imageUrl: "/v4/properties/alberdi-40.jpg",
    alt: "Estudio diáfano con suelo de parqué y cocina americana integrada al fondo",
    story:
      "Mari estuvo alquilando este estudio durante muchos años, y tomó la decisión de desprenderse de él, pero la inmobiliaria que lo tuvo en un inicio, no pudo venderlo durante 6 meses, antes de que trabajase con nosotros. Enric, de unos veintitantos años, se mudaba a Madrid desde Barcelona, y estaba buscando comprar su primera vivienda cerca de su nuevo trabajo. Ole tu!!",
    outcome: "Vendido",
  },
  {
    id: "pico-almanzor-10",
    title: "Pico de Almanzor 10",
    zona: "Madrid",
    imageUrl: "/v4/properties/pico-almanzor-10.jpg",
    alt: "Salón amplio con sofá marrón, cuadro panorámico del puente de Brooklyn y comedor al fondo",
    story:
      "Estos tres hermanos necesitaban vender el piso donde habían crecido y los recuerdos de la casa eran una carga difícil. Sergio, que estaba en Cádiz, interrumpió sus vacaciones específicamente para venir a ver el piso, que luego termino siendo suyo. Inteligente Compra!!",
    outcome: "Vendido",
  },
  {
    id: "paseo-chile-6",
    title: "Paseo de Chile 6",
    zona: "Fuenlabrada",
    imageUrl: "/v4/properties/paseo-chile-6.jpg",
    alt: "Salón con paredes verde menta, sofá gris con cojines azules y suelo ajedrezado",
    story:
      "José y Olga vivieron 48 años en este piso, pero con el paso de los años la necesidad de un ascensor fue cada vez más grande, y resulta que se enamoraron de un piso, que estábamos vendiendo, también en Fuenlabrada. Fran y Sara, estaban viviendo en Málaga, pero en búsqueda activa de piso para volver a Madrid, y no dejaron pasar la oportunidad, lo reservaron durante la visita. No hay distancia que los separe!!",
    outcome: "Vendido",
  },
  {
    id: "gerona-2",
    title: "Gerona 2",
    zona: "Fuenlabrada",
    imageUrl: "/v4/properties/gerona-2.jpg",
    alt: "Local comercial diáfano con suelo de barro cocido, barra de obra y techos con vigas de madera",
    story:
      "Virginia y Esther tenían un local comercial, que pertenecía a su madre, el cual no se utilizaba desde la pandemia y querían venderlo para cancelar una deuda que venía adherida al mismo. Alfonso y Jamie buscaban un local así, para reformarlo y alquilarlo como espacio diáfano para la implementación de un negocio. Audaces compradores!!",
    outcome: "Vendido",
  },
  {
    id: "aranjuez-3",
    title: "Aranjuez 3",
    zona: "Torrejón de la Calzada",
    imageUrl: "/v4/properties/aranjuez-3.jpg",
    alt: "Salón-comedor con escalera abierta al fondo, sofá beige y mantel de ganchillo amarillo",
    story:
      "Esta pareja, necesitaba vender su propiedad para separar sus caminos y así empezar de nuevo sus vidas. Pero fíjate como es el destino, sin ellos saberlo, se encontraron con que uno de los compradores era una compañera de trabajo de él. Esta pareja esperaba estrenar su primera casa con mucha ilusión e ideas nuevas de mejora. Os deseamos lo mejor!!",
    outcome: "Vendido",
  },
  {
    id: "rufino-blanco-4",
    title: "Rufino Blanco 4",
    zona: "Guadalajara",
    imageUrl: "/v4/properties/rufino-blanco-4.jpg",
    alt: "Despacho clásico con biblioteca repleta de libros, escritorio de madera y alfombra persa",
    story:
      "Marco nos pidió ayuda con la venta de la casa de su madre, ya que al necesitar mayores cuidados tuvo de mudarse a una residencia. Esta propiedad la compraron Paloma y Antonio una pareja maravillosa, que necesitaba una propiedad en el barrio ya que tenían su lugar de trabajo “Bar el Pechón” a escasos metros de su nueva residencia. Seguimos teniendo contacto con ellos y están encantados con su nuevo hogar!!",
    outcome: "Vendido",
  },
  {
    id: "avenida-espana-12",
    title: "Avenida de España 12",
    zona: "Getafe",
    imageUrl: "/v4/properties/avenida-espana-12.jpg",
    alt: "Salón con sofá naranja, suelo de mármol veteado y mueble bajo de madera clara con televisor",
    story:
      "Estas hermanas que son un encanto, nos pidieron ayuda porque su papá llevaba tiempo en la residencia y tomaron la decisión de cerrar ese capítulo tan bonito y tan largo de su vida, vendiendo el piso donde crecieron y fueron una familia feliz junto a su mamá. Los compradores buscaban una vivienda como inversión justo en la misma zona. Laura y Óscar fueron la pareja ideal!!",
    outcome: "Vendido",
  },
];
