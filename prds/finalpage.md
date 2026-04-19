# Business Requirements Document (BRD) - DOSXM2 Website Final

## 1. Resumen Ejecutivo y Concepto Final

El sitio web final de DOSXM2 será una fusión estratégica de las tres versiones presentadas, diseñada para maximizar tanto el impacto visual como la conexión emocional. El concepto final se define como **"Elegancia Cinematográfica con Empatía Conversacional"**.

Este enfoque toma la estructura premium y los efectos visuales de alto impacto de la Versión 1 (V1), los combina con la paleta de colores cálida y editorial de la Versión 3 (V3), e integra las micro-interacciones humanas y conversacionales de la Versión 2 (V2). El objetivo es proyectar una imagen de exclusividad y profesionalismo sin perder la cercanía y el trato personal que define a los fundadores.

## 2. Design System (Sistema de Diseño)

El sistema de diseño debe transmitir sofisticación y calidez simultáneamente.

### 2.1. Paleta de Colores (Basada en V3)
La paleta se aleja de los colores corporativos tradicionales para adoptar un enfoque más natural y editorial.
- **Color Principal (Fondo):** Papel Cálido (`#FAF9F6`) - Proporciona una base suave y legible.
- **Color Secundario (Texto/Acentos oscuros):** Carbón Profundo (`#1C1C1C`) - Ofrece alto contraste sin la dureza del negro puro.
- **Color de Acento (Detalles/Botones):** Ocre Terroso (`#8B5A2B`) - Aporta calidez y un toque premium.

### 2.2. Tipografía (Híbrido V1/V3)
La dualidad del concepto se refleja en el uso de dos familias tipográficas contrastantes.
- **Títulos y Narrativa (Serif):** `Ogg` o `Canela` (o similar Serif expresiva y elegante). Se utilizará para titulares grandes y frases clave que cuenten la historia.
- **Cuerpo de Texto y Datos (Sans-Serif):** `Inter` o `Space Grotesk` (limpia y moderna). Se utilizará para descripciones, números y elementos de interfaz.

### 2.3. Estilo Fotográfico
- **Imágenes Reales:** Fotografías de alta calidad de las propiedades vendidas y de los fundadores.
- **Imágenes Aspiracionales:** Fotografías de estilo de vida (lifestyle) y detalles arquitectónicos de alta gama para secciones generales (Hero, Diferencial) donde no se requiera mostrar una propiedad específica.

## 3. Arquitectura de la Información y Navegación

El sitio funcionará principalmente como una experiencia *single-page* con anclas (smooth scroll) para facilitar la narrativa continua, pero incluirá un menú de navegación claro.

### 3.1. Menú de Navegación (Sticky Header)
- **Logo:** DOSXM2 (alineado a la izquierda).
- **Enlaces (alineados a la derecha):**
  - El Diferencial
  - Resultados (Métricas)
  - Historias (Propiedades Vendidas)
  - Reseñas
  - Valorador
- **Comportamiento:** Transparente en el Hero, cambia a fondo sólido (Papel Cálido) con sombra sutil al hacer scroll.

## 4. Especificaciones por Sección (UI/UX & Copy)

### 4.1. Hero Section (Inspirado en V1)
- **Diseño:** Split-screen 50/50.
- **Visual:** Videos en auto-movimiento (loop sutil) en ambos lados. Lado izquierdo: detalle arquitectónico aspiracional. Lado derecho: escena de estilo de vida cálida.
- **Interacción:** El cursor divide las imágenes (Split Reveal) como en V1.
- **Copy Principal:** "Detrás de cada casa hay una historia." (Slogan prominente en tipografía Serif).
- **Sub-copy:** "Vendemos tu casa como si fuese la nuestra. Doble compromiso, trato personal y resultados demostrables en Madrid."
- **CTA:** Botón "Valora tu propiedad" (Ancla a la sección Valorador).

### 4.2. El Diferencial (Inspirado en V2 y V3)
- **Diseño:** Layout asimétrico editorial (V3).
- **Visual:** Retratos de los dos fundadores de alta calidad.
- **Interacción:** Los retratos de los fundadores se desprenden sutilmente y se convierten en elementos flotantes (FAB - Floating Action Button) en la esquina inferior derecha al hacer scroll. Al hacer click en ellos, se abre directamente WhatsApp.
- **Copy:** "Por qué DOSXM2. En un sector donde la mayoría trabaja solo, nosotros somos un equipo. Dos visiones, un único objetivo: tu tranquilidad."

### 4.3. Métricas / Resultados (Inspirado en V1 corregido)
- **Diseño:** Números grandes y limpios (Sans-serif) sobre fondo Carbón Profundo.
- **Interacción:** Los números se animan (cuentan desde cero hasta el valor final) **solo una vez** cuando entran en el viewport. No deben volver a cero con el scroll.
- **Datos (Actualizar con reales):**
  - "30 Días" (Tiempo promedio de venta)
  - "100%" (Tasa de éxito)
  - "24/7" (Disponibilidad)

### 4.4. Historias Vendidas / Portfolio (Inspirado en V2 y V3)
- **Diseño:** Grid de tarjetas de tamaño moderado (no tan grandes como en V3 original).
- **Interacción:** "Flip Cards" (V2). Al hacer click (o hover en desktop), la tarjeta gira 3D para revelar la historia detrás de la venta.
- **Copy Frontal:** Foto de la propiedad + Título breve (ej. "El ático de Retiro").
- **Copy Trasero (Historia):** Texto narrativo breve sobre el desafío y cómo se resolvió.

### 4.5. Prueba Social / Reseñas (Inspirado en V2)
- **Diseño:** Estilo conversacional limpio.
- **Interacción:** "Typing Reviews". Las reseñas aparecen simulando que alguien está escribiendo (muestran los tres puntitos "..." antes de revelar el texto).
- **Copy:** Reseñas reales de clientes.

### 4.6. Valorador (Inspirado en V2)
- **Diseño:** Interfaz limpia y amigable, sin parecer un formulario corporativo aburrido.
- **Interacción:** Formulario conversacional paso a paso (estilo Typeform). Una pregunta a la vez.
- **Copy:** Tono empático. "Empecemos por conocer tu casa. ¿Dónde está ubicada?"

## 5. Requisitos Técnicos y Animaciones

- **Rendimiento:** Los videos del Hero deben estar optimizados (comprimidos, sin audio, formato WebM/MP4) para no afectar el tiempo de carga.
- **Responsiveness:** El efecto Split Reveal del Hero debe adaptarse a mobile (ej. usando el giroscopio o cambiando a un scroll vertical suave). Las Flip Cards deben funcionar con "tap" en dispositivos táctiles.
- **Integración WhatsApp:** El enlace de los retratos flotantes debe usar la API de WhatsApp (`wa.me`) con un mensaje predefinido (ej. "Hola DOSXM2, quiero información sobre...").
- **Animaciones:** Todas las transiciones (scroll, hover, flip) deben ser suaves (easing functions) para mantener la sensación premium y estética premium.
