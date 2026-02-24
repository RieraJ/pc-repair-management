import { useState, useEffect } from 'react';
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
  Loader2,
  AlertCircle,
  Pencil,
  Save,
  Phone,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { api } from './utils/api';
import './App.css';

const COLUMNAS = [
  { id: 'recibida', titulo: 'Recibida', cssClass: 'received' },
  { id: 'progreso', titulo: 'En Progreso', cssClass: 'progress' },
  { id: 'finalizada', titulo: 'Finalizada', cssClass: 'done' },
  { id: 'entregado', titulo: 'Entregado', cssClass: 'delivered' },
];

const ESTADO_ORDER = ['recibida', 'progreso', 'finalizada', 'entregado'];

const FORM_VACIO = {
  modelo: '',
  duenio: '',
  telefono: '',
  sintoma: '',
  observacion: '',
  tratamiento: '',
  estado: 'recibida',
  fecha_entregado: '',
};

const fromDB = (row) => ({
  id: row.id,
  modelo: row.modelo,
  duenio: row.duenio,
  telefono: row.telefono || '',
  sintoma: row.sintoma,
  observacion: row.observacion || '',
  tratamiento: row.tratamiento || '',
  estado: row.estado,
  created_at: row.created_at,
  fecha_entregado: row.fecha_entregado,
});

function App() {
  const [reparaciones, setReparaciones] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Cargar reparaciones al montar ──
  useEffect(() => {
    const fetchReparaciones = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getReparaciones();
        setReparaciones(data.map(fromDB));
      } catch (err) {
        setError('Error al cargar reparaciones: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReparaciones();
  }, []);

  // ── Eliminar ──
  const eliminarReparacion = async (id) => {
    const prev = reparaciones;
    setReparaciones((r) => r.filter((rep) => rep.id !== id));

    try {
      await api.deleteReparacion(id);
    } catch (err) {
      console.error('Error al eliminar:', err);
      setReparaciones(prev); // rollback
    }
  };

  // ── Mover (cambiar estado) ──
  const moverReparacion = async (id, direccion) => {
    const rep = reparaciones.find((r) => r.id === id);
    if (!rep) return;

    const idx = ESTADO_ORDER.indexOf(rep.estado);
    const nuevoIdx = idx + direccion;
    if (nuevoIdx < 0 || nuevoIdx >= ESTADO_ORDER.length) return;

    const nuevoEstado = ESTADO_ORDER[nuevoIdx];
    const isNowEntregado = nuevoEstado === 'entregado' && rep.estado !== 'entregado';
    // Si pasa a entregado, guarda la fecha actual (ISO) o de lo contrario mantén la que tenía. 
    // Si la mueven de regreso, quizás quieras mantener la fecha o borrarla, según te convenga. Por ahora solo guardamos si entra.
    const newFechaEntregado = isNowEntregado ? new Date().toISOString() : rep.fecha_entregado;

    const prev = reparaciones;

    setReparaciones((r) =>
      r.map((item) =>
        item.id === id ? { ...item, estado: nuevoEstado, fecha_entregado: newFechaEntregado } : item
      )
    );

    try {
      await api.updateReparacion(id, { estado: nuevoEstado, fecha_entregado: newFechaEntregado });
    } catch (err) {
      console.error('Error al mover:', err);
      setReparaciones(prev); // rollback
    }
  };

  // ── Agregar ──
  const agregarReparacion = async (e) => {
    e.preventDefault();

    const nuevo = {
      modelo: formData.modelo,
      duenio: formData.duenio,
      telefono: formData.telefono,
      sintoma: formData.sintoma,
      observacion: formData.observacion,
      tratamiento: formData.tratamiento,
      estado: formData.estado,
      fecha_entregado: formData.estado === 'entregado' ? new Date().toISOString() : null,
    };

    setFormData(FORM_VACIO);
    setModalAbierto(false);

    try {
      const data = await api.addReparacion(nuevo);
      setReparaciones((prev) => [...prev, fromDB(data)]);
    } catch (err) {
      console.error('Error al agregar:', err);
      setError('Error al agregar equipo: ' + err.message);
    }
  };

  // ── Abrir modal en modo edición ──
  const abrirEdicion = (rep) => {
    setEditandoId(rep.id);
    setFormData({
      modelo: rep.modelo,
      duenio: rep.duenio,
      telefono: rep.telefono,
      sintoma: rep.sintoma,
      observacion: rep.observacion,
      tratamiento: rep.tratamiento,
      estado: rep.estado,
      // Convertir a 'yyyy-MM-dd' para el input type="date"
      fecha_entregado: rep.fecha_entregado ? rep.fecha_entregado.split('T')[0] : '',
    });
    setModalAbierto(true);
  };

  // ── Guardar edición ──
  const guardarEdicion = async (e) => {
    e.preventDefault();

    const isNowEntregado = formData.estado === 'entregado';
    let saveFechaEntregado = formData.fecha_entregado;

    // Si está entregado y no seleccionó fecha manual en el datepicker, forzamos HOY.
    // Si la pasa a otro estado, podríamos borrar la fecha_entregado pasándola a null.
    if (!isNowEntregado) {
      saveFechaEntregado = null;
    } else if (isNowEntregado && !saveFechaEntregado) {
      saveFechaEntregado = new Date().toISOString();
    } else if (saveFechaEntregado && !saveFechaEntregado.includes('T')) {
      // El input de tipo "date" devuelve 'YYYY-MM-DD'. Hay que agregarle la T de ISO para SQLite
      saveFechaEntregado = `${saveFechaEntregado}T00:00:00.000Z`;
    }

    const campos = {
      modelo: formData.modelo,
      duenio: formData.duenio,
      telefono: formData.telefono,
      sintoma: formData.sintoma,
      observacion: formData.observacion,
      tratamiento: formData.tratamiento,
      estado: formData.estado,
      fecha_entregado: saveFechaEntregado
    };

    const prev = reparaciones;
    setReparaciones((r) =>
      r.map((item) =>
        item.id === editandoId ? { ...item, ...campos } : item
      )
    );
    setFormData(FORM_VACIO);
    setEditandoId(null);
    setModalAbierto(false);

    try {
      await api.updateReparacion(editandoId, campos);
    } catch (err) {
      console.error('Error al editar:', err);
      setError('Error al editar equipo: ' + err.message);
      setReparaciones(prev); // rollback
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditandoId(null);
    setFormData(FORM_VACIO);
  };

  const totalEquipos = reparaciones.length;

  return (
    <div className="app-container">
      {/* ===== ERROR BANNER ===== */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button className="error-dismiss" onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

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

      {/* ===== LOADING STATE ===== */}
      {loading && (
        <div className="loading-state">
          <Loader2 size={40} className="loading-spinner" />
          <p>Cargando reparaciones...</p>
        </div>
      )}

      {/* ===== KANBAN BOARD ===== */}
      {!loading && <main className="kanban-board">
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
                          className="card-btn card-btn--edit"
                          onClick={() => abrirEdicion(rep)}
                          title="Editar equipo"
                        >
                          <Pencil size={14} />
                        </button>
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
                        <p className="card-field-value">{rep.duenio}</p>
                      </div>
                      {rep.telefono && (
                        <div className="card-field">
                          <div className="card-field-label">
                            <Phone size={12} />
                            <span>Teléfono</span>
                          </div>
                          <p className="card-field-value">{rep.telefono}</p>
                        </div>
                      )}
                      <div className="card-field">
                        <div className="card-field-label">
                          <Calendar size={12} />
                          <span>Fecha de Ingreso</span>
                        </div>
                        <p className="card-field-value">
                          {rep.created_at ? new Date(rep.created_at + 'Z').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </p>
                      </div>

                      {rep.estado === 'entregado' && (
                        <div className="card-field">
                          <div className="card-field-label">
                            <CheckCircle2 size={12} />
                            <span>Fecha Entrega</span>
                          </div>
                          <p className="card-field-value">
                            {rep.fecha_entregado
                              ? new Date(rep.fecha_entregado.endsWith('Z') ? rep.fecha_entregado : rep.fecha_entregado + 'Z').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                              : '-'}
                          </p>
                        </div>
                      )}

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
      </main>}

      {/* ===== FAB ===== */}
      <button
        className="fab"
        onClick={() => {
          setEditandoId(null);
          setFormData(FORM_VACIO);
          setModalAbierto(true);
        }}
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
            if (e.target === e.currentTarget) cerrarModal();
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {editandoId ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}
              </h2>
              <button
                className="modal-close"
                onClick={cerrarModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={editandoId ? guardarEdicion : agregarReparacion}>
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
                  value={formData.duenio}
                  onChange={(e) => handleInputChange('duenio', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Ej: +54 11 1234-5678"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
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
                <label className="form-label">
                  {editandoId ? 'Estado' : 'Estado Inicial'}
                </label>
                <select
                  className="form-select"
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                >
                  <option value="recibida">Recibida</option>
                  <option value="progreso">En Progreso</option>
                  <option value="finalizada">Finalizada</option>
                  <option value="entregado">Entregado</option>
                </select>
              </div>

              {formData.estado === 'entregado' && (
                <div className="form-group">
                  <label className="form-label">Fecha de Entrega (Opcional)</label>
                  <input
                    className="form-input"
                    type="date"
                    value={formData.fecha_entregado}
                    onChange={(e) => handleInputChange('fecha_entregado', e.target.value)}
                  />
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editandoId ? (
                    <><Save size={18} /> Guardar</>
                  ) : (
                    <><Plus size={18} /> Agregar</>
                  )}
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
