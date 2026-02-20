import { useState } from 'react';
import {
  Wrench,
  Laptop,
  X,
  Plus,
  User,
  Monitor,
  FileText,
  ChevronRight,
  ChevronLeft,
  Package,
} from 'lucide-react';
import './App.css';

const REPARACIONES_INICIALES = [
  {
    id: 1,
    modelo: 'HP Pavilion',
    dueño: 'Juan Pérez',
    sintoma: 'PC muy lenta, no enciende bien',
    observacion: 'Mucho polvo acumulado',
    tratamiento: 'Limpieza profunda, cambio pasta térmica',
    estado: 'recibida',
  },
  {
    id: 2,
    modelo: 'Dell Inspiron 15',
    dueño: 'María García',
    sintoma: 'No arranca Windows',
    observacion: 'Disco duro con sectores dañados',
    tratamiento: 'Instalación Windows 10, Office 2021',
    estado: 'progreso',
  },
  {
    id: 3,
    modelo: 'Lenovo ThinkPad T480',
    dueño: 'Carlos López',
    sintoma: 'Pantalla azul frecuente',
    observacion: 'RAM defectuosa',
    tratamiento: 'Reemplazo módulo RAM 8GB',
    estado: 'finalizada',
  },
];

const COLUMNAS = [
  { id: 'recibida', titulo: 'Recibida', cssClass: 'received' },
  { id: 'progreso', titulo: 'En Progreso', cssClass: 'progress' },
  { id: 'finalizada', titulo: 'Finalizada', cssClass: 'done' },
];

const ESTADO_ORDER = ['recibida', 'progreso', 'finalizada'];

const FORM_VACIO = {
  modelo: '',
  dueño: '',
  sintoma: '',
  observacion: '',
  tratamiento: '',
  estado: 'recibida',
};

function App() {
  const [reparaciones, setReparaciones] = useState(REPARACIONES_INICIALES);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState(FORM_VACIO);

  const eliminarReparacion = (id) => {
    setReparaciones((prev) => prev.filter((r) => r.id !== id));
  };

  const moverReparacion = (id, direccion) => {
    setReparaciones((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const idx = ESTADO_ORDER.indexOf(r.estado);
        const nuevoIdx = idx + direccion;
        if (nuevoIdx < 0 || nuevoIdx >= ESTADO_ORDER.length) return r;
        return { ...r, estado: ESTADO_ORDER[nuevoIdx] };
      })
    );
  };

  const agregarReparacion = (e) => {
    e.preventDefault();
    const nueva = {
      ...formData,
      id: Date.now(),
    };
    setReparaciones((prev) => [...prev, nueva]);
    setFormData(FORM_VACIO);
    setModalAbierto(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const totalEquipos = reparaciones.length;

  return (
    <div className="app-container">
      {/* ===== HEADER ===== */}
      <header className="app-header">
        <div className="header-left">
          <div className="header-icon">
            <Wrench size={24} />
          </div>
          <div>
            <h1 className="header-title">Gestión de Reparaciones</h1>
            <p className="header-subtitle">
              Panel de control para mantenimiento de computadoras
            </p>
          </div>
        </div>
        <div className="header-stats">
          {COLUMNAS.map((col) => {
            const count = reparaciones.filter((r) => r.estado === col.id).length;
            return (
              <div className="stat-item" key={col.id}>
                <div className="stat-value">{count}</div>
                <div className="stat-label">{col.titulo}</div>
              </div>
            );
          })}
          <div className="stat-item">
            <div className="stat-value">{totalEquipos}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </header>

      {/* ===== KANBAN BOARD ===== */}
      <main className="kanban-board">
        {COLUMNAS.map((col) => {
          const colReparaciones = reparaciones.filter(
            (r) => r.estado === col.id
          );
          const count = colReparaciones.length;
          const colIdx = ESTADO_ORDER.indexOf(col.id);

          return (
            <div key={col.id} className="kanban-column">
              {/* Column Header */}
              <div className={`column-header column-header--${col.cssClass}`}>
                <div className="column-title">{col.titulo}</div>
                <div className="column-count">
                  {count} {count === 1 ? 'equipo' : 'equipos'}
                </div>
              </div>

              {/* Column Body */}
              <div className="column-body">
                {colReparaciones.map((rep) => (
                  <div
                    key={rep.id}
                    className={`repair-card repair-card--${col.cssClass}`}
                  >
                    {/* Card Header */}
                    <div className="card-header">
                      <div className="card-model">
                        <Laptop size={18} className="card-model-icon" />
                        <span className="card-model-name">{rep.modelo}</span>
                      </div>
                      <div className="card-actions">
                        {colIdx > 0 && (
                          <button
                            className="card-btn card-btn--move"
                            onClick={() => moverReparacion(rep.id, -1)}
                            title="Mover atrás"
                          >
                            <ChevronLeft size={16} />
                          </button>
                        )}
                        {colIdx < ESTADO_ORDER.length - 1 && (
                          <button
                            className="card-btn card-btn--move"
                            onClick={() => moverReparacion(rep.id, 1)}
                            title="Mover adelante"
                          >
                            <ChevronRight size={16} />
                          </button>
                        )}
                        <button
                          className="card-btn card-btn--delete"
                          onClick={() => eliminarReparacion(rep.id)}
                          title="Eliminar equipo"
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-fields">
                      <div className="card-field">
                        <div className="card-field-label">
                          <User size={12} />
                          <span>Dueño</span>
                        </div>
                        <p className="card-field-value">{rep.dueño}</p>
                      </div>
                      <div className="card-field">
                        <div className="card-field-label">
                          <Monitor size={12} />
                          <span>Síntoma</span>
                        </div>
                        <p className="card-field-value">{rep.sintoma}</p>
                      </div>
                      <div className="card-field">
                        <div className="card-field-label">
                          <FileText size={12} />
                          <span>Observación</span>
                        </div>
                        <p className="card-field-value">{rep.observacion}</p>
                      </div>
                      <div className="card-field">
                        <div className="card-field-label">
                          <Wrench size={12} />
                          <span>Tratamiento</span>
                        </div>
                        <p className="card-field-value">{rep.tratamiento}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {count === 0 && (
                  <div className="empty-state">
                    <Package size={40} className="empty-state-icon" />
                    <p className="empty-state-text">Sin equipos</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* ===== FAB ===== */}
      <button
        className="fab"
        onClick={() => setModalAbierto(true)}
        title="Agregar nuevo equipo"
        id="add-pc-button"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      {/* ===== MODAL ===== */}
      {modalAbierto && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalAbierto(false);
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Agregar Nuevo Equipo</h2>
              <button
                className="modal-close"
                onClick={() => setModalAbierto(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={agregarReparacion}>
              <div className="form-group">
                <label className="form-label">Modelo</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Ej: HP Pavilion, Dell XPS..."
                  value={formData.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dueño</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Nombre del propietario"
                  value={formData.dueño}
                  onChange={(e) => handleInputChange('dueño', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Síntoma</label>
                <textarea
                  className="form-textarea"
                  placeholder="Descripción del problema..."
                  value={formData.sintoma}
                  onChange={(e) => handleInputChange('sintoma', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Observación</label>
                <textarea
                  className="form-textarea"
                  placeholder="Observaciones técnicas..."
                  value={formData.observacion}
                  onChange={(e) =>
                    handleInputChange('observacion', e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tratamiento</label>
                <textarea
                  className="form-textarea"
                  placeholder="Reparación a realizar..."
                  value={formData.tratamiento}
                  onChange={(e) =>
                    handleInputChange('tratamiento', e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estado Inicial</label>
                <select
                  className="form-select"
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                >
                  <option value="recibida">Recibida</option>
                  <option value="progreso">En Progreso</option>
                  <option value="finalizada">Finalizada</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={18} />
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
