# Cómo actualizar y subir cambios — Guía rápida

Esta guía está pensada para que NO tengas que abrir terminal ni acordarte de comandos.
Todo se hace desde VS Code en 3 clicks.

---

## El flujo de cada día (3 clicks + 1 mensaje)

Cada vez que terminás de hacer un cambio en el código:

### 1. Abrí el panel de Git en VS Code

Apretá `Ctrl + Shift + G` (en Windows) o hacé click en el ícono que parece una bifurcación de ramas en la barra izquierda de VS Code.

Vas a ver una lista con todos los archivos que cambiaste, marcados con letras:
- `M` = modificado (Modified)
- `A` = nuevo agregado (Added)
- `D` = borrado (Deleted)
- `U` = sin trackear todavía (Untracked)

### 2. Escribí un mensaje describiendo qué cambiaste

Arriba del panel hay una caja de texto que dice "Message". Escribí qué hiciste, en español, claro.

**Ejemplos buenos:**
- `Cambio el título principal a más grande`
- `Arreglo el botón de WhatsApp que estaba mal alineado`
- `Agrego foto nueva de la cocina`
- `Corrijo error en la galería en celular`

**Ejemplos malos:**
- `cambios` (¿qué cambios?)
- `asdf` (te vas a arrepentir en una semana)
- `actualización` (vacío)

> 💡 **Regla**: Si dentro de un mes te preguntan "¿qué hiciste en este commit?", el mensaje tiene que responderlo solo.

### 3. Click en "Commit" (el botón azul con el ✓)

Esto guarda los cambios localmente en tu computadora.
**Atajo de teclado**: `Ctrl + Enter`

### 4. Click en "Sync Changes"

Ese botón aparece después de hacer commit. Súbelo a GitHub.
**Atajo de teclado**: hacer click en "Sync Changes" en la barra de estado (abajo).

---

## Listo. Eso es todo.

Cuando hagas eso, en menos de 1 minuto tu cambio:
- Está guardado en GitHub (red de seguridad).
- Si tenés Netlify conectado: el sitio en vivo se actualiza solo.

---

## Situaciones comunes

### "Hice un cambio y me arrepiento, ¿cómo lo deshago antes de commit?"

En el panel de Git, al lado del archivo cambiado hay un ícono de flecha curva ↶ (Discard Changes). Click ahí. **Cuidado**: esto borra tu cambio para siempre.

### "Hice commit pero me equivoqué en el mensaje"

Tres puntos `...` arriba del panel de Git → **Commit** → **Amend Last Commit**. Cambiá el mensaje, hacé commit de nuevo. **Solo funciona si todavía no hiciste Sync**.

### "Quiero ver qué cambié en un archivo"

En el panel de Git, click sobre el nombre del archivo. Se abre una pantalla dividida: izquierda = como estaba antes, derecha = como está ahora.

### "Quiero ver el historial de cambios del proyecto"

Tres puntos `...` arriba del panel → **View History**. O abrí GitHub.com y mirá ahí.

### "Estoy viendo un montón de archivos extraños que no agregué yo"

Probablemente sean archivos del sistema o backups que el `.gitignore` no está cubriendo. Pasámelo a Claude para que los agregue al `.gitignore`.

---

## Convenciones para nombres de commits (opcional pero pro)

Si querés escribir mensajes que parezcan "de empresa":

| Prefijo | Cuándo usarlo | Ejemplo |
|---|---|---|
| `feat:` | Cuando agregás algo nuevo | `feat: agregar widget de WhatsApp flotante` |
| `fix:` | Cuando arreglás un bug | `fix: corregir tamaño del título en celular` |
| `style:` | Cambios solo de diseño/CSS | `style: cambiar paleta a tonos más cálidos` |
| `docs:` | Solo documentación | `docs: actualizar README con link al sitio` |
| `refactor:` | Reorganizar código sin cambiar lo que hace | `refactor: separar estilos en archivos` |

Esta convención se llama **Conventional Commits**. La usan muchas empresas.

---

## Pull (traer cambios) — para más adelante

Si en algún momento editás el proyecto desde otra computadora, o alguien más colabora, antes de empezar a trabajar conviene "traer" los últimos cambios:

- Panel de Git → tres puntos `...` → **Pull**

Esto baja a tu compu lo último que esté en GitHub. Si no pulleás antes de trabajar, podés tener conflictos. (Por ahora trabajás solo, no es urgente).

---

## Si algo se rompe

No te vuelvas loco intentando arreglarlo solo. Pegale screenshot del error a Claude y te ayuda. Git tiene fama de complicado por algo — incluso devs con años de experiencia siguen googleando.
