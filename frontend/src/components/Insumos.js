import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';
import Componente from './componente.jsx';
import fondoImg from './assets/fondo.png';

const styles = {
  insumosContainer: {
    padding: '32px',
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'margin-left 0.3s ease'
  },
  contentWrapper: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  searchContainer: {
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#000',
    width: '20px',
    height: '20px',
    pointerEvents: 'none'
  },
  searchInput: {
    paddingLeft: '40px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    outline: 'none',
    width: '256px',
    transition: 'border-color 0.2s'
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 215, 15, 1)',
    color: '#000000',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  },
  addButtonContainer: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  tableContainer: {
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid rgba(30, 30, 30, 0.9)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
  },
  thead: {
    backgroundColor: 'rgba(25, 25, 25, 1.9)',
    borderBottom: '1px solid #fff1'
  },
  th: {
    textAlign: 'left',
    padding: '16px',
    color: '#fff',
    fontWeight: '600'
  },
  thCenter: {
    textAlign: 'center',
    padding: '16px',
    color: '#fff',
    fontWeight: '600'
  },
  tr: {
    borderBottom: '1px solid #fff1',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '16px',
    color: '#ffffff'
  },
  tdCenter: {
    padding: '16px',
    textAlign: 'center'
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px'
  },
  iconButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  modal: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    maxWidth: '448px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  closeButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    color: '#fff',
    marginBottom: '8px',
    fontWeight: '600'
  },
  input: {
    width: '100%',
    padding: '8px 16px',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  cancelButton: {
    flex: 1,
    padding: '8px 16px',
    backgroundColor: '#0009',
    color: '#ffffff',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  },
  submitButton: {
    flex: 1,
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 215, 15, 1)',
    color: '#000000',
    transition: 'opacity 0.2s'
  },
  emptyState: {
    textAlign: 'center',
    padding: '32px',
    color: '#9ca3af'
  },
  alert: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '16px 24px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 3000,
    minWidth: '300px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    animation: 'slideIn 0.3s ease-out'
  },
  alertSuccess: {
    backgroundColor: '#10b981',
    color: '#ffffff'
  },
  alertError: {
    backgroundColor: '#ef4444',
    color: '#ffffff'
  },
  alertText: {
    flex: 1,
    fontWeight: '500'
  },
  confirmModal: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: '12px',
    padding: '28px',
    width: '100%',
    maxWidth: '420px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  confirmHeader: {
    marginBottom: '20px'
  },
  confirmTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '12px'
  },
  confirmMessage: {
    color: '#d1d5db',
    fontSize: '15px',
    lineHeight: '1.5'
  },
  confirmActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  confirmCancelButton: {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#374151',
    color: '#ffffff',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s',
    fontSize: '14px'
  },
  confirmActionButton: {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s',
    fontSize: '14px'
  },
  confirmDeleteButton: {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s',
    fontSize: '14px'
  }
};

const styleSheet = `
  .hover-row:hover {
    background-color: #696969;
  }
  
  .hover-button:hover {
    opacity: 0.9;
  }
  
  .hover-icon:hover {
    background-color: #374151;
  }
  
  .search-input:focus {
    border-color: rgba(255, 215, 15, 1);
  }
  
  .form-input:focus {
    border-color: rgba(255, 215, 15, 1);
  }
  
  .hover-cancel:hover {
    background-color: #4b5563;
  }
  
  .hover-confirm-cancel:hover {
    background-color: #4b5563;
  }
  
  .hover-confirm-action:hover {
    background-color: #059669;
  }
  
  .hover-confirm-delete:hover {
    background-color: #dc2626;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

function Insumos() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [insumos, setInsumos] = useState([]);

  // Cargar insumos al montar el componente
  React.useEffect(() => {
    cargarInsumos();
  }, []);

  const cargarInsumos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/inventario/insumos/');
      const data = await response.json();
      setInsumos(data);
    } catch (error) {
      console.error('Error cargando insumos:', error);
      showAlert('Error al cargar los insumos', 'error');
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: '',
    unidad: '',
    precioUnitario: ''
  });
  const [alert, setAlert] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const filteredInsumos = insumos.filter(insumo => {
    const search = searchTerm.toLowerCase();
    return (
      insumo.Insumo_nombre?.toLowerCase().includes(search) ||
      insumo.Insumo_cantidad?.toString().includes(search) ||
      insumo.Insumo_unidad_medida?.toLowerCase().includes(search) ||
      insumo.Insumo_precio_unitario?.toString().includes(search)
    );
  });

  const handleOpenModal = (insumo = null) => {
    if (insumo) {
      setEditingInsumo(insumo);
      setFormData({
        nombre: insumo.Insumo_nombre,
        cantidad: insumo.Insumo_cantidad,
        unidad: insumo.Insumo_unidad_medida,
        precioUnitario: insumo.Insumo_precio_unitario
      });
    } else {
      setEditingInsumo(null);
      setFormData({ nombre: '', cantidad: '', unidad: '', precioUnitario: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInsumo(null);
    setFormData({ nombre: '', cantidad: '', unidad: '', precioUnitario: '' });
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.cantidad || !formData.unidad || !formData.precioUnitario) {
      showAlert('Por favor completa todos los campos', 'error');
      return;
    }
    
    if (editingInsumo) {
      setConfirmAction('edit');
      setConfirmData(formData);
      setShowConfirmModal(true);
    } else {
      setConfirmAction('add');
      setConfirmData(formData);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      const payload = {
        Insumo_nombre: confirmData.nombre,
        Insumo_cantidad: Number(confirmData.cantidad),
        Insumo_unidad_medida: confirmData.unidad,
        Insumo_precio_unitario: Number(confirmData.precioUnitario)
      };

      if (confirmAction === 'edit') {
        const response = await fetch(`http://localhost:8000/api/inventario/insumos/${editingInsumo.Insumo_ID}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
          } else {
            throw new Error(`Error ${response.status}: Verifica que la URL del API sea correcta`);
          }
        }

        await cargarInsumos();
        showAlert(`Insumo "${confirmData.nombre}" actualizado exitosamente`, 'success');
      } else {
        const response = await fetch('http://localhost:8000/api/inventario/insumos/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
          } else {
            throw new Error(`Error ${response.status}: Verifica que la URL del API sea correcta`);
          }
        }

        await cargarInsumos();
        showAlert(`Insumo "${confirmData.nombre}" agregado exitosamente`, 'success');
      }
      
      setShowConfirmModal(false);
      setConfirmAction(null);
      setConfirmData(null);
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar insumo:', error);
      showAlert('Error: ' + error.message, 'error');
    }
  };

  const handleDeleteClick = (insumo) => {
    setConfirmAction('delete');
    setConfirmData(insumo);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/inventario/insumos/${confirmData.Insumo_ID}/`, {
        method: 'DELETE'
      });

      if (!response.ok && response.status !== 204) {
        throw new Error('Error al eliminar el insumo');
      }

      await cargarInsumos();
      showAlert(`Insumo "${confirmData.Insumo_nombre}" eliminado exitosamente`, 'success');
      setShowConfirmModal(false);
      setConfirmAction(null);
      setConfirmData(null);
    } catch (error) {
      console.error('Error al eliminar insumo:', error);
      showAlert('Error al eliminar el insumo', 'error');
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmData(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'nombre' || name === 'unidad') {
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!regex.test(value)) {
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getConfirmModalContent = () => {
    if (confirmAction === 'add') {
      return {
        title: 'Agregar Insumo',
        message: '¿Está seguro que desea agregar este insumo al inventario?',
        buttonText: 'Agregar',
        buttonStyle: styles.confirmActionButton,
        buttonClass: 'hover-confirm-action',
        onConfirm: handleConfirmSubmit
      };
    } else if (confirmAction === 'edit') {
      return {
        title: 'Guardar Cambios',
        message: '¿Está seguro que desea guardar los cambios realizados?',
        buttonText: 'Guardar',
        buttonStyle: styles.confirmActionButton,
        buttonClass: 'hover-confirm-action',
        onConfirm: handleConfirmSubmit
      };
    } else if (confirmAction === 'delete') {
      return {
        title: 'Eliminar Insumo',
        message: `¿Estás seguro de que deseas eliminar el insumo "${confirmData?.Insumo_nombre}"? Esta acción no se puede deshacer.`,
        buttonText: 'Eliminar',
        buttonStyle: styles.confirmDeleteButton,
        buttonClass: 'hover-confirm-delete',
        onConfirm: handleConfirmDelete
      };
    }
    return null;
  };

  return (
    <>
      <style>{styleSheet}</style>
      
      <div>
        <Componente onToggle={setIsNavbarCollapsed} />
        
        <div style={{
          ...styles.insumosContainer,
          backgroundImage: `url(${fondoImg})`,
          marginLeft: isNavbarCollapsed ? '70px' : '250px'
        }}>
          <div style={styles.contentWrapper}>
            <div style={styles.header}>
              <h1 style={styles.title}>Insumos</h1>
              <div style={styles.headerActions}>
                <div style={styles.searchContainer}>
                  <Search style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                    className="search-input"
                  />
                </div>
              </div>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr>
                    <th style={styles.th}>Insumo</th>
                    <th style={styles.th}>Cantidad</th>
                    <th style={styles.th}>Unidad de medida</th>
                    <th style={styles.th}>Precio Unitario</th>
                    <th style={styles.th}>Precio total</th>
                    <th style={styles.thCenter}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInsumos.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={styles.emptyState}>
                        No se encontraron insumos
                      </td>
                    </tr>
                  ) : (
                    filteredInsumos.map((insumo) => (
                      <tr key={insumo.Insumo_ID} style={styles.tr} className="hover-row">
                        <td style={styles.td}>{insumo.Insumo_nombre}</td>
                        <td style={styles.td}>{insumo.Insumo_cantidad}</td>
                        <td style={styles.td}>{insumo.Insumo_unidad_medida}</td>
                        <td style={styles.td}>{insumo.Insumo_precio_unitario?.toFixed(2)}</td>
                        <td style={styles.td}>{insumo.Insumo_precio_total?.toFixed(2)}</td>
                        <td style={styles.tdCenter}>
                          <div style={styles.actionsContainer}>
                            <button
                              onClick={() => handleOpenModal(insumo)}
                              style={styles.iconButton}
                              className="hover-icon"
                            >
                              <Edit2 style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(insumo)}
                              style={styles.iconButton}
                              className="hover-icon"
                            >
                              <Trash2 style={{ width: '20px', height: '20px', color: '#f87171' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={styles.addButtonContainer}>
              <button
                onClick={() => handleOpenModal()}
                style={styles.addButton}
                className="hover-button"
              >
                <Plus style={{ width: '20px', height: '20px' }} />
                Agregar Insumo
              </button>
            </div>

            {showModal && (
              <div style={styles.modalOverlay} onClick={handleCloseModal}>
                <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>
                      {editingInsumo ? 'Editar Insumo' : 'Agregar Insumo'}
                    </h2>
                    <button
                      onClick={handleCloseModal}
                      style={styles.closeButton}
                      className="hover-icon"
                    >
                      <X style={{ width: '24px', height: '24px', color: '#9ca3af' }} />
                    </button>
                  </div>

                  <div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Nombre del Insumo</label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        style={styles.input}
                        className="form-input"
                        placeholder="Ej: Algodón Premium"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Cantidad</label>
                      <input
                        type="number"
                        name="cantidad"
                        value={formData.cantidad}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        style={styles.input}
                        className="form-input"
                        placeholder="0"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Unidad de Medida</label>
                      <input
                        type="text"
                        name="unidad"
                        value={formData.unidad}
                        onChange={handleInputChange}
                        style={styles.input}
                        className="form-input"
                        placeholder="Ej: KG, metros, unidades"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Precio Unitario</label>
                      <input
                        type="number"
                        name="precioUnitario"
                        value={formData.precioUnitario}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        style={styles.input}
                        className="form-input"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div style={styles.modalActions}>
                    <button
                      onClick={handleCloseModal}
                      style={styles.cancelButton}
                      className="hover-cancel"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      style={styles.submitButton}
                      className="hover-button"
                    >
                      {editingInsumo ? 'Guardar Cambios' : 'Agregar'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showConfirmModal && (() => {
              const content = getConfirmModalContent();
              return (
                <div style={styles.modalOverlay} onClick={handleCancelConfirm}>
                  <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
                    <div style={styles.confirmHeader}>
                      <h2 style={styles.confirmTitle}>{content.title}</h2>
                      <p style={styles.confirmMessage}>{content.message}</p>
                    </div>

                    <div style={styles.confirmActions}>
                      <button
                        onClick={handleCancelConfirm}
                        style={styles.confirmCancelButton}
                        className="hover-confirm-cancel"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={content.onConfirm}
                        style={content.buttonStyle}
                        className={content.buttonClass}
                      >
                        {content.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {alert && (
              <div style={{
                ...styles.alert,
                ...(alert.type === 'success' ? styles.alertSuccess : styles.alertError)
              }}>
                {alert.type === 'success' ? (
                  <CheckCircle style={{ width: '24px', height: '24px' }} />
                ) : (
                  <AlertCircle style={{ width: '24px', height: '24px' }} />
                )}
                <span style={styles.alertText}>{alert.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Insumos;