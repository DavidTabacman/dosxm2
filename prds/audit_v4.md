###  Gaps y Problemas Identificados

#### 1. **El Diferencial - Retratos Flotantes (CRÍTICO)**
- **BRD Especifica:** Los retratos deben desprenderse y convertirse en FAB (Floating Action Button) en la esquina inferior derecha al hacer scroll, y al hacer click deben abrir WhatsApp.
- **Realidad:** Los retratos están en la sección pero se convierten en FAB flotante. Hay un botón "Hablemos por WhatsApp" separado.
- **Cambio Necesario:** Implementar que los retratos se conviertan en elementos flotantes al scroll y que sean clickeables para abrir WhatsApp.

#### 2. **Métricas - Animación (IMPORTANTE)**
- **BRD Especifica:** Los números deben animarse (contar) CADA VEZ cuando entran en viewport.
- **Realidad:** Los numeros no se animan.
- **Cambio Necesario:** Verificar que la animación ocurra una sola vez y que los números permanezcan fijos después.

#### 3. **Reseñas - Typing Animation (IMPORTANTE)**
- **BRD Especifica:** Las reseñas deben aparecer con "Typing Animation" (mostrar "..." antes de revelar el texto). Esto debe suceder cada vez que el usuario pase por esa seccion.
- **Realidad:** La animacion funciona solo la primera vez que el usuario pasa por la seccion.
- **Cambio Necesario:** Verificar si la sección de reseñas existe y si tiene la animación de typing.

#### 4. **Paleta de Colores (IMPORTANTE)**
- **BRD Especifica:** Papel Cálido (#FAF9F6), Carbón Profundo (#1C1C1C), Ocre Terroso (#8B5A2B).
- **Realidad:** El sitio usa colores similares pero la paleta parece más estándar. El ocre terroso no es evidente.
- **Cambio Necesario:** Ajustar la paleta para que sea más cálida y editorial, especialmente en acentos.

#### 5. **Tipografía (IMPORTANTE)**
- **BRD Especifica:** Serif expresiva (Ogg/Canela) para títulos + Sans limpia (Inter/Space Grotesk) para cuerpo.
- **Realidad:** La tipografía parece correcta pero requiere verificación de que sea exactamente la especificada.
- **Cambio Necesario:** Verificar que se use Serif expresiva en títulos principales.

