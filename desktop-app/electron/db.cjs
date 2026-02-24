'use strict';
const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

/**
 * Crea (o abre) la base de datos SQLite en la carpeta de datos del usuario.
 * Linux:   ~/.config/Gestión de Reparaciones/reparaciones.db
 * Windows: %APPDATA%\Gestión de Reparaciones\reparaciones.db
 */
function setupDatabase() {
    const dbPath = path.join(app.getPath('userData'), 'reparaciones.db');
    const db = new Database(dbPath);

    db.pragma('journal_mode = WAL');

    db.exec(`
        CREATE TABLE IF NOT EXISTS reparaciones (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            modelo      TEXT    NOT NULL,
            duenio      TEXT    NOT NULL,
            telefono    TEXT    DEFAULT '',
            sintoma     TEXT    NOT NULL,
            observacion TEXT    DEFAULT '',
            tratamiento TEXT    DEFAULT '',
            estado      TEXT    DEFAULT 'recibida',
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
            fecha_entregado DATETIME DEFAULT NULL
        )
    `);

    // Migración sencilla para DBs existentes
    try {
        db.exec("ALTER TABLE reparaciones ADD COLUMN telefono TEXT DEFAULT ''");
    } catch (e) { }

    try {
        db.exec("ALTER TABLE reparaciones ADD COLUMN fecha_entregado DATETIME DEFAULT NULL");
    } catch (e) { }

    return db;
}

module.exports = { setupDatabase };
