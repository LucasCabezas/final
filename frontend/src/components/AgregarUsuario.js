import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, User } from 'lucide-react';
import Componente from './componente.jsx';
import fondoImg from './assets/fondo.png';

const styles = {
  usuariosContainer: {
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
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
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
    paddingRight: '36px',
    paddingTop: '8px',
    paddingBottom: '8px',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    outline: 'none',
    width: '256px',
    transition: 'border-color 0.2s',
    fontSize: '14px'
  },
  clearButton: {
    position: 'absolute',
    right: '8px',
    padding: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#999',
    transition: 'color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchCounter: {
    marginLeft: '0',
    padding: '6px 12px',
    backgroundColor: 'rgba(255, 215, 15, 0.2)',
    color: '#ffd70f',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 215, 15, 1)',
    color: '#000000',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  },
  tableContainer: {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid rgba(30, 30, 30, 0.9)',
    minHeight: '100px'
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
  rolBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600'
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
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto'
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
  select: {
    width: '100%',
    padding: '8px 16px',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    cursor: 'pointer'
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
  emptyState: {
    textAlign: 'center',
    padding: '32px',
    color: '#9ca3af',
    fontSize: '16px'
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
  },
  passwordRequirements: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: 'rgba(0,0,0,0.2)', // Tono oscuro para el modal
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  requirementItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    marginTop: '6px',
  },
  requirementMet: {
    color: '#22c55e', // Verde (éxito)
  },
  requirementNotMet: {
    color: '#9ca3af', // Gris (pendiente)
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
  
  .hover-clear:hover {
    color: #666 !important;
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

function GestionUsuarios() {
  const { authenticatedFetch } = useAuth();
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    password: '',
    rol_id: ''
  });
  const [alert, setAlert] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });

  useEffect(() => {
    // 🔥 CAMBIO: Solo se ejecuta si 'authenticatedFetch' está listo
    if (authenticatedFetch) { 
      cargarUsuarios();
      cargarRoles();
    }
  }, [authenticatedFetch]);

  const cargarUsuarios = async () => {
    try {
      // No necesitas añadir headers aquí, 'authenticatedFetch' lo hace por ti
      const response = await authenticatedFetch('http://localhost:8000/api/usuarios/usuarios/');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      // Si el token es inválido o expiró, authenticatedFetch debería manejarlo (ej. logout)
      // Mostramos un error genérico por si acaso
      if (error.message.includes('401')) {
          showAlert('Tu sesión expiró. Por favor, vuelve a ingresar.', 'error');
      } else {
          showAlert('Error al cargar los usuarios', 'error');
      }
    }
  };

  const cargarRoles = async () => {
    try {
      // No necesitas añadir headers aquí, 'authenticatedFetch' lo hace por ti
      const response = await authenticatedFetch('http://localhost:8000/api/usuarios/roles/');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error cargando roles:', error);
        if (error.message.includes('401')) {
          showAlert('Tu sesión expiró. Por favor, vuelve a ingresar.', 'error');
      } else {
        showAlert('Error al cargar los roles', 'error');
      }
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const filteredUsuarios = searchTerm.trim() === '' ? [] : usuarios.filter(usuario => {
    const search = searchTerm.toLowerCase();
    return (
      usuario.nombre?.toLowerCase().includes(search) ||
      usuario.apellido?.toLowerCase().includes(search) ||
      usuario.email?.toLowerCase().includes(search) ||
      usuario.dni?.toString().includes(search) ||
      usuario.rol?.toLowerCase().includes(search)
    );
  });

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingUsuario(usuario);
      setFormData({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        dni: usuario.dni || '',
        email: usuario.email,
        password: '',
        rol_id: usuario.rol_id || ''
      });
    } else {
      setEditingUsuario(null);
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        password: '',
        rol_id: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUsuario(null);
    setFormData({
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      password: '',
      rol_id: ''
    });

  setPasswordRequirements({
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
    });
  };

  const validatePasswordRequirements = (password) => {
    setPasswordRequirements({
      minLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'nombre' || name === 'apellido') {
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!regex.test(value)) {
        return;
      }
    }
    
    if (name === 'dni') {
      const regex = /^\d*$/;
      if (!regex.test(value) || value.length > 8) {
        return;
      }
    }
    
    // 🔥 CAMBIO: Llamar a la validación si es el input de contraseña
    if (name === 'password') {
      validatePasswordRequirements(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Si está editando, solo validar el rol
    if (editingUsuario) {
      if (!formData.rol_id) {
        showAlert('Debes seleccionar un rol', 'error');
        return;
      }
      setConfirmAction('edit');
      setConfirmData(formData);
      setShowConfirmModal(true);
      return;
    }

    // Validaciones para AGREGAR usuario
    if (!formData.nombre || !formData.apellido || !formData.email) {
      showAlert('Por favor completa los campos obligatorios', 'error');
      return;
    }

    if (!formData.dni) {
      showAlert('El DNI es obligatorio', 'error');
      return;
    }

    if (!formData.rol_id) {
      showAlert('Debes seleccionar un rol', 'error');
      return;
    }

    if (!formData.password) {
      showAlert('La contraseña es obligatoria para nuevos usuarios', 'error');
      return;
    }

    if (!passwordRequirements.minLength || !passwordRequirements.hasUpperCase || !passwordRequirements.hasLowerCase || !passwordRequirements.hasNumber) {
      showAlert('La contraseña no cumple con todos los requisitos', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert('Por favor ingresa un correo electrónico válido', 'error');
      return;
    }

    if (formData.dni.length !== 8) {
      showAlert('El DNI debe tener 8 dígitos', 'error');
      return;
    }

    setConfirmAction('add');
    setConfirmData(formData);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const payload = {
        nombre: confirmData.nombre,
        apellido: confirmData.apellido,
        dni: confirmData.dni || null,
        email: confirmData.email,
        rol_id: confirmData.rol_id || null
      };

      if (confirmData.password) {
        payload.password = confirmData.password;
      }

      if (confirmAction === 'edit') {
        const response = await authenticatedFetch(`http://localhost:8000/api/usuarios/usuarios/${editingUsuario.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al actualizar usuario');
        }

        await cargarUsuarios();
        showAlert(`Usuario "${payload.nombre} ${payload.apellido}" actualizado exitosamente`, 'success');
      } else {
        const response = await authenticatedFetch('http://localhost:8000/api/usuarios/usuarios/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al crear usuario');
        }

        await cargarUsuarios();
        showAlert(`Usuario "${payload.nombre} ${payload.apellido}" creado exitosamente`, 'success');
      }

      setShowConfirmModal(false);
      setConfirmAction(null);
      setConfirmData(null);
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      showAlert(error.message, 'error');
    }
  };

  const handleDeleteClick = (usuario) => {
    setConfirmAction('delete');
    setConfirmData(usuario);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await authenticatedFetch(`http://localhost:8000/api/usuarios/usuarios/${confirmData.id}/`, {
        method: 'DELETE'
      });

      if (!response.ok && response.status !== 204) {
        throw new Error('Error al eliminar el usuario');
      }

      await cargarUsuarios();
      showAlert(`Usuario "${confirmData.nombre} ${confirmData.apellido}" eliminado exitosamente`, 'success');
      setShowConfirmModal(false);
      setConfirmAction(null);
      setConfirmData(null);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      showAlert('Error al eliminar el usuario', 'error');
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmData(null);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const getRolBadgeColor = (rolNombre) => {
    const colores = {
      'Dueño': { bg: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' },
      'Costurero': { bg: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' },
      'Estampador': { bg: 'rgba(168, 85, 247, 0.2)', color: '#c4b5fd' },
      'Vendedor': { bg: 'rgba(34, 197, 94, 0.2)', color: '#86efac' }
    };
    return colores[rolNombre] || { bg: 'rgba(156, 163, 175, 0.2)', color: '#d1d5db' };
  };

  const getConfirmModalContent = () => {
    if (confirmAction === 'add') {
      return {
        title: 'Agregar Usuario',
        message: '¿Está seguro que desea agregar este usuario al sistema?',
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
        title: 'Eliminar Usuario',
        message: `¿Estás seguro de que deseas eliminar al usuario "${confirmData?.nombre} ${confirmData?.apellido}"? Esta acción no se puede deshacer.`,
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
          ...styles.usuariosContainer,
          backgroundImage: `url(${fondoImg})`,
          marginLeft: isNavbarCollapsed ? '70px' : '250px'
        }}>
          <div style={styles.contentWrapper}>
            {/* ... (Todo el JSX del header y la tabla se mantiene 100% igual) ... */}
            <div style={styles.header}>
              <h1 style={styles.title}>Gestión de Usuarios</h1>
              <div style={styles.headerActions}>
                <div style={styles.searchContainer}>
                  <Search style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                    className="search-input"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      onClick={handleClearSearch}
                      style={styles.clearButton}
                      className="hover-clear"
                      title="Limpiar búsqueda"
                    >
                      <X style={{ width: '18px', height: '18px' }} />
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <div style={styles.searchCounter}>
                    {filteredUsuarios.length} de {usuarios.length}
                  </div>
                )}
                <button
                  onClick={() => handleOpenModal()}
                  style={styles.addButton}
                  className="hover-button"
                >
                  <Plus style={{ width: '20px', height: '20px' }} />
                  Agregar Usuario
                </button>
              </div>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Apellido</th>
                    <th style={styles.th}>Rol</th>
                    <th style={styles.thCenter}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {searchTerm.trim() === '' ? (
                    <tr>
                      <td colSpan="4" style={styles.emptyState}>
                        Comienza a escribir en el buscador para ver los usuarios
                      </td>
                    </tr>
                  ) : filteredUsuarios.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={styles.emptyState}>
                        No se encontraron usuarios que coincidan con "{searchTerm}"
                      </td>
                    </tr>
                  ) : (
                    filteredUsuarios.map((usuario) => {
                      const badgeColor = getRolBadgeColor(usuario.rol);
                      return (
                        <tr key={usuario.id} style={styles.tr} className="hover-row">
                          <td style={styles.td}>{usuario.nombre}</td>
                          <td style={styles.td}>{usuario.apellido}</td>
                          <td style={styles.td}>
                            {usuario.rol ? (
                              <span style={{
                                ...styles.rolBadge,
                                backgroundColor: badgeColor.bg,
                                color: badgeColor.color
                              }}>
                                {usuario.rol}
                              </span>
                            ) : (
                              <span style={{
                                ...styles.rolBadge,
                                backgroundColor: 'rgba(156, 163, 175, 0.2)',
                                color: '#d1d5db'
                              }}>
                                Sin rol
                              </span>
                            )}
                          </td>
                          <td style={styles.tdCenter}>
                            <div style={styles.actionsContainer}>
                              <button
                                onClick={() => handleOpenModal(usuario)}
                                style={styles.iconButton}
                                className="hover-icon"
                              >
                                <Edit2 style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(usuario)}
                                style={styles.iconButton}
                                className="hover-icon"
                              >
                                <Trash2 style={{ width: '20px', height: '20px', color: '#f87171' }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* MODAL DE AGREGAR/EDITAR USUARIO */}
            {showModal && (
              <div style={styles.modalOverlay} onClick={handleCloseModal}>
                <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>
                      {editingUsuario ? 'Editar Usuario' : 'Agregar Usuario'}
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
                    {!editingUsuario ? (
                      <>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Nombre *</label>
                          <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            style={styles.input}
                            className="form-input"
                            placeholder="Nombre del usuario"
                            required
                            autoComplete='off'
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.label}>Apellido *</label>
                          <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleInputChange}
                            style={styles.input}
                            className="form-input"
                            placeholder="Apellido del usuario"
                            required
                            autoComplete='off'
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.label}>DNI *</label>
                          <input
                            type="text"
                            name="dni"
                            value={formData.dni}
                            onChange={handleInputChange}
                            style={styles.input}
                            className="form-input"
                            placeholder="12345678"
                            maxLength="8"
                            required
                            autoComplete='off'
                          />
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.label}>Correo Electrónico *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            style={styles.input}
                            className="form-input"
                            placeholder="usuario@ejemplo.com"
                            required
                            autoComplete='off'
                          />
                        </div>

                        {/* 🔥 CORRECCIÓN: El div de requisitos va DENTRO del formGroup de la contraseña */}
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Contraseña *</label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            style={styles.input}
                            className="form-input"
                            placeholder="Contraseña"
                            required
                            autoComplete='new-password'
                          />
                          
                          {/* Este bloque solo aparece si se empieza a escribir la contraseña */}
                          {formData.password && (
                            <div style={styles.passwordRequirements}>
                              <div style={{
                                ...styles.requirementItem,
                                ...(passwordRequirements.minLength ? styles.requirementMet : styles.requirementNotMet),
                              }}>
                                {passwordRequirements.minLength ? <CheckCircle size={14} /> : <X size={14} />}
                                <span>Mínimo 6 caracteres</span>
                              </div>
                              <div style={{
                                ...styles.requirementItem,
                                ...(passwordRequirements.hasUpperCase ? styles.requirementMet : styles.requirementNotMet),
                              }}>
                                {passwordRequirements.hasUpperCase ? <CheckCircle size={14} /> : <X size={14} />}
                                <span>Al menos una letra mayúscula</span>
                              </div>
                              <div style={{
                                ...styles.requirementItem,
                                ...(passwordRequirements.hasLowerCase ? styles.requirementMet : styles.requirementNotMet),
                              }}>
                                {passwordRequirements.hasLowerCase ? <CheckCircle size={14} /> : <X size={14} />}
                                <span>Al menos una letra minúscula</span>
                              </div>
                              <div style={{
                                ...styles.requirementItem,
                                ...(passwordRequirements.hasNumber ? styles.requirementMet : styles.requirementNotMet),
                              }}>
                                {passwordRequirements.hasNumber ? <CheckCircle size={14} /> : <X size={14} />}
                                <span>Al menos un número</span>
                              </div>
                            </div>
                          )}
                        </div> 
                      </>
                    ) : null}

                    {/* ESTE 'div' de formGroup estaba mal cerrado en tu archivo */}
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Rol *</label>
                      <select
                        name="rol_id"
                        value={formData.rol_id}
                        onChange={handleInputChange}
                        style={styles.select}
                        className="form-input"
                        required
                      >
                        <option value="">Seleccionar rol</option>
                        {roles.map(rol => (
                          <option key={rol.id} value={rol.id}>
                            {rol.nombre}
                          </option>
                        ))}
                      </select>
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
                      {editingUsuario ? 'Guardar Cambios' : 'Agregar Usuario'}
                    </button>
                  </div>
                </div>
              </div> // <-- 🔥 CORRECCIÓN: Faltaba este '</div>'
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

export default GestionUsuarios;