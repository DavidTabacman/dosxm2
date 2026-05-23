# Alta de DOSXM2 en Google (Google Business Profile)

Esta guía es para que el cliente dé de alta el negocio en Google. La web
V4 ya enlaza directamente al perfil de Maps con un short-link
(`maps.app.goo.gl/z3LKpvaQvq4kDCZf9`), así que el botón "Ver más reseñas
y deja la tuya en Google" funciona desde ya. Esta guía sigue siendo
relevante para completar la verificación oficial y conseguir el Place ID
si en algún momento se quiere abrir directamente el formulario de
escribir reseña sin pasar por Maps.

---

## 1. Crear el perfil

1. Entra en **[business.google.com](https://business.google.com)** con la
   cuenta de Google de DOSXM2 (la misma que se usa para Gmail / YouTube
   / etc.). Si no hay una cuenta dedicada al negocio, crea una primero —
   es preferible separar la del negocio de la personal.
2. Pulsa **"Añadir tu empresa a Google"** o **"Gestionar ahora"**.
3. Introduce los datos básicos:
   - **Nombre de la empresa:** `DOSXM2`
   - **Categoría principal:** `Agencia inmobiliaria`
   - **¿Tu empresa tiene una ubicación física a la que pueden ir los
     clientes?** Si trabajáis sin oficina abierta al público (zona de
     servicio), elige **No** — Google os pedirá entonces las áreas de
     servicio en lugar de una dirección visible.
   - **Áreas de servicio:** Madrid (capital), Getafe, Fuenlabrada, El
     Viso de San Juan y cualquier otra zona habitual.
4. **Datos de contacto:**
   - Teléfono: el número operativo del equipo (Borja o Pablo).
   - Web: `https://dosxm2.com` (o el dominio definitivo cuando esté).

---

## 2. Verificación

Google pide confirmar que el negocio existe. Las opciones cambian según
la categoría y el país, pero suelen ser:

- **Postal:** llega un código en una tarjeta a la dirección registrada
  (5–14 días). Es lo más común para inmobiliarias.
- **Vídeo en directo:** Google os pide grabar un vídeo enseñando la
  oficina, los materiales con el logo, una factura, etc. Más rápido si
  tienes oficina visible.
- **Teléfono / email:** disponible solo para algunas categorías —
  raramente sale para inmobiliarias.

Hasta que la verificación se complete, el perfil **no aparece en
búsquedas ni acepta reseñas**. Después de verificar, tarda unas horas
en propagarse.

---

## 3. Completar el perfil

Cuanto más completo, mejor posicionamiento:

- **Foto de portada y logo** (usar los activos oficiales de DOSXM2).
- **Horario** de atención.
- **Descripción** corta del negocio (máx. 750 caracteres).
- **Productos o servicios:** "Venta de viviendas", "Tasación", "Asesoría
  inmobiliaria", etc.
- **Atributos:** "Atención personalizada", "Idiomas: español"…

---

## 4. Conseguir el Place ID y enviármelo

El Place ID es el identificador único del negocio en Google Maps —
necesito ese string para activar el botón "Deja tu reseña en Google" de
la web.

Dos formas fáciles de obtenerlo:

**Opción A — desde el panel de Google Business Profile**
1. Entra en `business.google.com`.
2. Ve a "Tu perfil de empresa" → "Editar perfil" → "Información".
3. Baja hasta "Identificadores" — el **Place ID** aparece como una
   cadena tipo `ChIJN1t_tDeuEmsRUsoyG83frY4`.

**Opción B — usando la herramienta oficial de Google**
1. Abre **[Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)**.
2. En el mapa que aparece arriba, busca tu negocio por nombre (`DOSXM2`).
3. Pulsa en el pin que aparece — el Place ID se muestra en el infobox.

**Una vez lo tengas**, pásamelo por mensaje. El botón actual de la web
apunta al short-link de Maps (`maps.app.goo.gl/z3LKpvaQvq4kDCZf9`), que
abre el listado y desde ahí el usuario puede pulsar "Escribir una
reseña". Con el Place ID puedo swappear el `href` en
[src/components/v4/V4Resenas.tsx](src/components/v4/V4Resenas.tsx) para
que abra directamente el formulario de reseña sin pasar por el listado:

```
https://search.google.com/local/writereview?placeid={TU_PLACE_ID}
```

Esa URL maximiza la conversión porque elimina un click intermedio.

---

## 5. (Opcional) QR para físicos

Cuando tengas el Place ID, podemos también:
- Generar un QR que apunte a la misma URL — útil para tarjetas o
  cartelería.
- Añadir un enlace abreviado tipo `g.page/dosxm2/review` (Google lo
  ofrece automáticamente desde el perfil verificado).

Avísame cuando quieras y lo preparo.
