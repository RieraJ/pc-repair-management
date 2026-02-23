/**
 * api.js — Capa de acceso a datos para el Renderer (React).
 *
 * `window.api` es inyectado por electron/preload.cjs mediante contextBridge.
 * Si el código corre fuera de Electron (ej: abrir index.html en el navegador),
 * lanzará un error descriptivo para facilitar el debugging.
 */

if (!window.api) {
    throw new Error(
        '[api.js] window.api no está disponible. ' +
        'Asegúrate de correr la app dentro de Electron (npm run dev o npm start).'
    );
}

export const api = window.api;
