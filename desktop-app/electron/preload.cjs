// preload.cjs — CommonJS obligatorio cuando el proyecto usa "type": "module"
// Este archivo corre en el contexto del renderer ANTES que React,
// pero con acceso a APIs de Node.js/Electron.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    /** Devuelve todas las reparaciones ordenadas por fecha de creación */
    getReparaciones: () => ipcRenderer.invoke('get-reparaciones'),

    /** Inserta una nueva reparación y devuelve el registro completo (con id y created_at) */
    addReparacion: (data) => ipcRenderer.invoke('add-reparacion', data),

    /** Actualiza campos de una reparación por id */
    updateReparacion: (id, data) => ipcRenderer.invoke('update-reparacion', id, data),

    /** Elimina una reparación por id */
    deleteReparacion: (id) => ipcRenderer.invoke('delete-reparacion', id),
});
