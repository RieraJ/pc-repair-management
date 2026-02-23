# Gestión de Reparaciones - Desktop App

## ¿En qué consiste la aplicación?
Es una aplicación **nativa de escritorio** diseñada para la **gestión de reparaciones de computadoras**. Permite a los técnicos y administradores llevar un registro organizado del estado de cada equipo ingresado al taller, funcionando 100% de manera local y offline (sin necesidad de internet).

A través de una interfaz interactiva tipo tablero Kanban, los usuarios pueden:
- Añadir nuevas computadoras al sistema de gestión.
- Cambiar el estado de la reparación (Recibido, En Progreso, Entregado, etc.).
- Mantener un control claro del flujo de trabajo de las reparaciones con una base de datos embebida robusta.

## Tecnologías Utilizadas
La aplicación fue migrada desde una arquitectura puramente web hacia una aplicación de escritorio multiplataforma utilizando:
- **Core de Escritorio**: [Electron.js](https://www.electronjs.org/) (empaqueta Chromium y Node.js para ejecutar la interfaz nativamente).
- **Frontend**: [React 19](https://react.dev/) y [Vite](https://vitejs.dev/) para un desarrollo extremadamente rápido.
- **Estilos e UI**: [Tailwind CSS v4](https://tailwindcss.com/) y la iconografía de [Lucide React](https://lucide.dev/).
- **Base de Datos (Local)**: [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (La implementación de SQLite más rápida en Node.js, almacenando los datos de forma segura dentro del sistema operativo del usuario eliminando la dependencia de servidores externos).
- **Generación de Instaladores**: [electron-builder](https://www.electron.build/) (para generar paquetes `.deb`, `.AppImage` y `.exe`).

---

## 💻 Desarrollo Local

Sigue estos pasos para examinar o modificar el código del proyecto:

1. **Requisitos Previos**:
   - [Node.js](https://nodejs.org/) (v18 o superior).
   - En Linux: Herramientas de compilación de C/C++ instaladas (ej. `sudo apt install build-essential python3`).

2. **Instalación de Dependencias**:
   Abre una terminal, navega a la carpeta _desktop-app_ (donde reside el proyecto) e instala los paquetes. El script `postinstall` se encargará de adaptar y compilar SQLite para Electron automáticamente:
   ```bash
   cd desktop-app
   npm install
   ```

3. **Ejecución en Modo Desarrollo**:
   ```bash
   npm run dev
   ```
   *Esto lanzará Vite (con hot-reload) y abrirá la ventana de Electron automáticamente. La base de datos se guardará dentro de la carpeta `%APPDATA%` (Windows) o `~/.config` (Linux) del sistema.*

---

## 📦 Empaquetado y Distribución (Linux y Windows)

La aplicación está lista para generar instaladores independientes que no requieren Node.js ni la terminal para el usuario final. 

Primero, asegúrate de estar dentro del directorio `desktop-app/` y tener todo instalado (`npm install`).

### 🐧 Generar instaladores para Linux (.deb / .AppImage)
Ejecuta el siguiente comando:
```bash
npm run package:linux
```
Los ejecutables quedarán generados en la carpeta `desktop-app/release/`.  

**Opciones de ejecución en Linux:**
- **AppImage**: Ejecutable portable. Dale permisos (`chmod +x "Gestión de Reparaciones-1.0.0.AppImage"`) y haz doble clic para usar, sin necesidad de instalación.
- **.deb**: Instalador estándar debian/ubuntu. Puedes instalarlo con `sudo dpkg -i release/pc-repair-desktop_1.0.0_amd64.deb`. Creará el ícono y el acceso directo automáticamente en tu menú de aplicaciones con perfecta compatibilidad para Wayland y X11.

### 🪟 Generar instalador para Windows (.exe)
*(Requiere estar en Windows, o en Linux tener el paquete `wine` debidamente configurado).*

Ejecuta:
```bash
npm run package:win
```
Esto creará un instalador NSIS `.exe` en la carpeta `desktop-app/release/` que puede ser distribuido e instalado en cualquier computadora con Windows con la apariencia típica del setup "Siguiente > Siguiente > Instalar".  