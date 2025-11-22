import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Componente from './componente.jsx';
import { useAuth } from '../context/AuthContext';
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
    width: '285px',
    transition: 'border-color 0.2s',
    fontSize: '14px'
  },
  select: {
    padding: '8px 12px',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    outline: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    height: '42px',
    boxSizing: 'border-box'
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
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.1)'
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
  toggleContainer: {
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px'
  },
  toggleLabel: {
    color: '#fff',
    fontWeight: '600',
    flex: 1
  },
  toggleSwitch: {
    position: 'relative',
    width: '50px',
    height: '28px',
    backgroundColor: '#4b5563',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    border: 'none',
    padding: 0
  },
  toggleSwitchActive: {
    backgroundColor: 'rgba(255, 215, 15, 1)'
  },
  toggleIndicator: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '24px',
    height: '24px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    transition: 'left 0.3s',
    pointerEvents: 'none'
  },
  toggleIndicatorActive: {
    left: '24px'
  },
  quantityInfo: {
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    color: '#93c5fd'
  },
  quantityInfoText: {
    fontSize: '14px',
    margin: '0'
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
  },
  alertasContainer: {
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid #ef4444',
    borderRadius: '8px'
  },
  alertasHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  alertasTitle: {
    color: '#fca5a5',
    fontWeight: '600',
    fontSize: '16px'
  },
  alertasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '12px'
  },
  alertCard: {
    padding: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '6px',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  },
  alertCardName: {
    margin: '0 0 8px 0',
    color: '#fca5a5',
    fontWeight: '600'
  },
  alertCardStock: {
    margin: '0',
    color: '#fecaca',
    fontSize: '14px'
  },
  prendasList: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    maxHeight: '200px',
    overflowY: 'auto'
  },
  prendaItem: {
    padding: '8px',
    marginBottom: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '6px',
    borderLeft: '3px solid #ef4444'
  },
  prendaItemName: {
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: '4px'
  },
  prendaItemDetail: {
    color: '#9ca3af',
    fontSize: '13px'
  },
  warningBox: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    border: '1px solid rgba(251, 191, 36, 0.3)',
    borderRadius: '8px'
  },
  warningTitle: {
    color: '#fbbf24',
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  warningList: {
    color: '#fde68a',
    fontSize: '13px',
    margin: '0',
    paddingLeft: '20px'
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '16px',
    color: '#9ca3af',
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderTop: '1px solid #fff1',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    marginTop: '-1px',
  },
  paginationButton: {
    background: '#374151',
    border: 'none',
    color: '#fff',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 4px',
    transition: 'background-color 0.2s',
  },
  paginationDisabled: {
    background: '#1f2937',
    color: '#6b7280',
    cursor: 'not-allowed',
  },
  paginationInfo: {
    fontSize: '14px',
    margin: '0 16px',
    fontWeight: '500'
  },
  mensajeInfo: {
    textAlign: 'center',
    padding: '48px',
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '24px',
    color: '#2196F3',
    fontSize: '16px'
  },
  mensajeVacio: {
    textAlign: 'center',
    padding: '48px',
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '24px'
  },
  mensajeVacioTexto: {
    fontSize: '18px',
    color: '#999999',
    marginBottom: '16px',
    margin: 0
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

function Insumos() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [insumos, setInsumos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [tipos, setTipos] = useState([]);

  const { user } = useAuth();
  const userRole = user?.rol;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState(''); 
  const [filterMode, setFilterMode] = useState('-'); 

  const canEdit = () => {
    return userRole === 'Dueño';
  };

  useEffect(() => {
    cargarInsumos();
    cargarAlertas();
    cargarUnidades();
    cargarTipos();
    const interval = setInterval(cargarAlertas, 300000);
    return () => clearInterval(interval);
  }, [userRole]);

  const cargarUnidades = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/inventario/unidades/');
      const data = await res.json();
      setUnidades(data);
    } catch (error) {
      console.error('Error cargando unidades:', error);
    }
  };

  const cargarTipos = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/inventario/tipos/');
      const data = await res.json();
      setTipos(data);
    } catch (error) {
      console.error('Error cargando tipos:', error);
    }
  };

  const cargarInsumos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/inventario/insumos/');
      const data = await response.json();
      
      let insumosFiltrados = data;
      
      if (userRole === 'Costurero') {
        insumosFiltrados = data.filter(item => item.tipo_insumo === 1);
      } else if (userRole === 'Estampador') {
        insumosFiltrados = data.filter(item => item.tipo_insumo === 2);
      }
      
      setInsumos(insumosFiltrados);
    } catch (error) {
      console.error('Error cargando insumos:', error);
      showAlert('Error al cargar los insumos', 'error');
    }
  };

  const cargarAlertas = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/inventario/alertas-stock/');
      const data = await response.json();
      setAlertas(data);
    } catch (error) {
      console.error('Error cargando alertas:', error);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: '',
    unidad: '',
    tipo: '',
    precioUnitario: '',
    cantidadMinima: ''
  });
  
  const [isAddMode, setIsAddMode] = useState(false);
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

  const filteredInsumos = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (filterMode === '-' && search === '') {
      return [];
    }

    let listToFilter = insumos;

    if (search !== '' || filterMode === 'TODOS') {
      if (search !== '') {
        listToFilter = listToFilter.filter(insumo => {
          const nombre = (insumo.Insumo_nombre || '').toLowerCase();
          const unidad = (insumo.Insumo_unidad_medida || insumo.unidad_medida_nombre || '').toLowerCase(); 
          const cantidad = (insumo.Insumo_cantidad || '').toString();
          const precio = (insumo.Insumo_precio_unitario || '').toString();

          return (
            nombre.includes(search) ||
            cantidad.includes(search) ||
            unidad.includes(search) ||
            precio.includes(search)
          );
        });
      }
    }

    return listToFilter;
  }, [searchTerm, insumos, filterMode]); 

  const totalPages = Math.ceil(filteredInsumos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInsumos = filteredInsumos.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterMode]);

  const handleOpenModal = (insumo = null) => {
    if (insumo) {
      setEditingInsumo(insumo);

      setFormData({
        nombre: insumo.Insumo_nombre,
        cantidad: insumo.Insumo_cantidad,
        unidad: insumo.unidad_medida || insumo.unidad_medida_id || '',
        tipo: insumo.tipo_insumo || insumo.tipo_insumo_id || '',
        precioUnitario: insumo.Insumo_precio_unitario,
        cantidadMinima: insumo.Insumo_cantidad_minima || ''
      });

      setIsAddMode(false);
    } else {
      setEditingInsumo(null);
      setFormData({
        nombre: '',
        cantidad: '',
        unidad: '',
        tipo: '',
        precioUnitario: '',
        cantidadMinima: ''
      });
      setIsAddMode(false);
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInsumo(null);
    setFormData({ nombre: '', cantidad: '', unidad: '', precioUnitario: '' });
    setIsAddMode(false);
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.cantidad || !formData.unidad || !formData.precioUnitario) {
      showAlert('Por favor completa todos los campos', 'error');
      return;
    }
    
    const nombreNormalizado = formData.nombre.trim().toLowerCase();
    const nombreExistente = insumos.find(insumo => {
      if (editingInsumo && insumo.Insumo_ID === editingInsumo.Insumo_ID) {
        return false;
      }
      return insumo.Insumo_nombre.trim().toLowerCase() === nombreNormalizado;
    });
    
    if (nombreExistente) {
      showAlert(`Ya existe un insumo con el nombre "${formData.nombre}". Por favor usa un nombre diferente.`, 'error');
      return;
    }
    
    if (editingInsumo) {
      const cambioNombre = formData.nombre !== editingInsumo.Insumo_nombre;
      const cambioUnidad = formData.unidad !== editingInsumo.Insumo_unidad_medida;
      
      if (cambioNombre || cambioUnidad) {
        try {
          const response = await fetch(`http://localhost:8000/api/inventario/insumos/${editingInsumo.Insumo_ID}/verificar-uso/`);
          const data = await response.json();
          
          if (data.en_uso) {
            setConfirmAction('edit_with_impact');
            setConfirmData({
              insumo: editingInsumo,
              prendas: data.prendas,
              total: data.total_prendas,
              cambios: {
                nombre: cambioNombre,
                unidad: cambioUnidad,
                nombreNuevo: formData.nombre,
                unidadNueva: formData.unidad
              },
              formData: formData
            });
            setShowConfirmModal(true);
            return;
          }
        } catch (error) {
          console.error('Error verificando uso:', error);
        }
      }
      
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
      let finalQuantity = Number(confirmData.cantidad || formData.cantidad);

      if (isAddMode && editingInsumo) {
        finalQuantity = editingInsumo.Insumo_cantidad + Number(confirmData.cantidad || formData.cantidad);
      }

      const precioUnitario = Number(confirmData.precioUnitario || formData.precioUnitario);
      const cantidad = Number(finalQuantity);
      const precioTotal = precioUnitario * cantidad;

      const payload = {
        Insumo_nombre: confirmData.nombre || formData.nombre,
        Insumo_cantidad: cantidad,
        unidad_medida: confirmData.unidad || formData.unidad,
        tipo_insumo: confirmData.tipo || formData.tipo,
        Insumo_precio_unitario: precioUnitario,
        Insumo_precio_total: precioTotal,
        Insumo_cantidad_minima: Number(confirmData.cantidadMinima || formData.cantidadMinima) || 0
      };

      if (confirmAction === 'edit' || confirmAction === 'edit_with_impact') {
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
        await cargarAlertas();
        
        if (confirmAction === 'edit_with_impact') {
          showAlert(`Insumo "${payload.Insumo_nombre}" actualizado. Los cambios se aplicaron a todas las prendas.`, 'success');
        } else {
          showAlert(`Insumo "${payload.Insumo_nombre}" actualizado exitosamente`, 'success');
        }
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
        await cargarAlertas();
        showAlert(`Insumo "${payload.Insumo_nombre}" agregado exitosamente`, 'success');
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

  const handleDeleteClick = async (insumo) => {
    try {
      const response = await fetch(`http://localhost:8000/api/inventario/insumos/${insumo.Insumo_ID}/verificar-uso/`);
      const data = await response.json();

      if (data.en_uso) {
        setConfirmAction('delete_blocked');
        setConfirmData({
          insumo: insumo,
          prendas: data.prendas,
          total: data.total_prendas
        });
        setShowConfirmModal(true);
      } else {
        setConfirmAction('delete');
        setConfirmData(insumo);
        setShowConfirmModal(true);
      }
    } catch (error) {
      console.error('Error verificando uso del insumo:', error);
      showAlert('Error al verificar el uso del insumo', 'error');
    }
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
      await cargarAlertas();
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

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'nombre') {
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!regex.test(value)) {
        return;
      }
    }

    // Validación para cantidad y cantidadMinima: solo números enteros
    if (name === 'cantidad' || name === 'cantidadMinima') {
      // Permitir solo números enteros (sin decimales)
      if (value !== '' && !/^\d+$/.test(value)) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
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
        message: isAddMode 
          ? `¿Está seguro que desea agregar ${confirmData.cantidad} unidades? (Total: ${editingInsumo.Insumo_cantidad + Number(confirmData.cantidad)})`
          : '¿Está seguro que desea guardar los cambios realizados?',
        buttonText: 'Guardar',
        buttonStyle: styles.confirmActionButton,
        buttonClass: 'hover-confirm-action',
        onConfirm: handleConfirmSubmit
      };
    } else if (confirmAction === 'edit_with_impact') {
      const cambiosTexto = [];
      if (confirmData.cambios.nombre) {
        cambiosTexto.push(`nombre a "${confirmData.cambios.nombreNuevo}"`);
      }
      if (confirmData.cambios.unidad) {
        cambiosTexto.push(`unidad de medida a "${confirmData.cambios.unidadNueva}"`);
      }

      return {
        title: '⚠️ Confirmar cambios importantes',
        message: `Estás a punto de cambiar el ${cambiosTexto.join(' y el ')} del insumo "${confirmData.insumo.Insumo_nombre}".`,
        messageExtra: `Este cambio afectará automáticamente a ${confirmData.total} ${confirmData.total === 1 ? 'prenda que usa' : 'prendas que usan'} este insumo:`,
        buttonText: 'Confirmar cambios',
        buttonStyle: styles.confirmActionButton,
        buttonClass: 'hover-confirm-action',
        onConfirm: handleConfirmSubmit,
        showPrendas: true,
        showWarning: true
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
    } else if (confirmAction === 'delete_blocked') {
      return {
        title: '⚠️ No se puede eliminar',
        message: `El insumo "${confirmData.insumo.Insumo_nombre}" está siendo usado por ${confirmData.total} ${confirmData.total === 1 ? 'prenda' : 'prendas'}.`,
        messageExtra: 'Para eliminarlo, primero debes eliminar o modificar estas prendas:',
        buttonText: 'Entendido',
        buttonStyle: styles.confirmActionButton,
        buttonClass: 'hover-confirm-action',
        onConfirm: handleCancelConfirm,
        hideCancel: true,
        showPrendas: true
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
            {alertas.length > 0 && (
              <div style={styles.alertasContainer}>
                <div style={styles.alertasHeader}>
                  <AlertCircle style={{ width: '24px', height: '24px', color: '#ef4444' }} />
                  <span style={styles.alertasTitle}>
                    ⚠️ {alertas.length} {alertas.length === 1 ? 'insumo' : 'insumos'} con bajo stock
                  </span>
                </div>
                <div style={styles.alertasGrid}>
                  {alertas.map((alerta) => (
                    <div key={alerta.id} style={styles.alertCard}>
                      <p style={styles.alertCardName}>{alerta.insumo_nombre}</p>
                      <p style={styles.alertCardStock}>Stock: {alerta.cantidad_actual} / Mínimo: {alerta.cantidad_minima}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={styles.header}>
              <h1 style={styles.title}>Gestión de Insumos</h1>
              <div style={styles.headerActions}>
                <div style={styles.searchContainer}>
                  <Search style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, cantidad, unidad o precio" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                    className="search-input"
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
                
                <select 
                  value={filterMode} 
                  onChange={(e) => setFilterMode(e.target.value)} 
                  style={styles.select}
                >
                  <option value="-">-</option>
                  <option value="TODOS">TODOS</option>
                </select>

                {filteredInsumos.length > 0 && (
                  <div style={styles.searchCounter}>
                    {filteredInsumos.length} de {insumos.length} insumos
                  </div>
                )}
                
                {canEdit() && (
                  <button
                    onClick={() => handleOpenModal()}
                    style={styles.addButton}
                    className="hover-button"
                  >
                    <Plus style={{ width: '20px', height: '20px' }} />
                    Agregar Insumo
                  </button>
                )}
              </div>
            </div>

            {filteredInsumos.length === 0 && filterMode === '-' && searchTerm.trim() === '' && (
              <div style={styles.mensajeInfo}>
                Selecciona "TODOS" en el filtro para ver todos los insumos
              </div>
            )}

            {filteredInsumos.length === 0 && (filterMode === 'TODOS' || searchTerm.trim() !== '') && (
              <div style={styles.mensajeVacio}>
                <p style={styles.mensajeVacioTexto}>
                  {searchTerm.trim() !== '' 
                    ? `No se encontraron insumos que coincidan con "${searchTerm}"` 
                    : 'No hay insumos disponibles'}
                </p>
              </div>
            )}

            {filteredInsumos.length > 0 && (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      <th style={styles.th}>Insumo</th>
                      <th style={styles.th}>Cantidad</th>
                      <th style={styles.th}>Unidad de medida</th>
                      {canEdit() && <th style={styles.th}>Precio Unitario</th>}
                      {canEdit() && <th style={styles.th}>Precio total</th>}
                      {canEdit() && <th style={styles.thCenter}>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {currentInsumos.map((insumo) => (
                      <tr key={insumo.Insumo_ID} style={styles.tr} className="hover-row">
                        <td style={styles.td}>{insumo.Insumo_nombre}</td>
                        <td style={styles.td}>{insumo.Insumo_cantidad}</td>
                        <td style={styles.td}>{insumo.unidad_medida_nombre}</td>
                        {canEdit() && <td style={styles.td}>{insumo.Insumo_precio_unitario?.toFixed(2)}</td>}
                        {canEdit() && <td style={styles.td}>{insumo.Insumo_precio_total?.toFixed(2)}</td>}
                        {canEdit() && (
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
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredInsumos.length > itemsPerPage && (
              <div style={styles.paginationContainer}>
                <span style={styles.paginationInfo}>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  style={{
                    ...styles.paginationButton,
                    ...(currentPage === 1 && styles.paginationDisabled)
                  }}
                  className="hover-icon"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  style={{
                    ...styles.paginationButton,
                    ...(currentPage === totalPages && styles.paginationDisabled)
                  }}
                  className="hover-icon"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

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

                    {editingInsumo && (
                      <div style={styles.toggleContainer}>
                        <label style={styles.toggleLabel}>Agregar más cantidad</label>
                        <button
                          onClick={() => {
                            setIsAddMode(!isAddMode);
                            setFormData(prev => ({ ...prev, cantidad: '' }));
                          }}
                          style={{
                            ...styles.toggleSwitch,
                            ...(isAddMode && styles.toggleSwitchActive)
                          }}
                        >
                          <div
                            style={{
                              ...styles.toggleIndicator,
                              ...(isAddMode && styles.toggleIndicatorActive)
                            }}
                          />
                        </button>
                      </div>
                    )}

                    {editingInsumo && isAddMode && (
                      <div style={styles.quantityInfo}>
                        <p style={styles.quantityInfoText}>
                          Cantidad actual: <strong>{editingInsumo.Insumo_cantidad}</strong>
                        </p>
                      </div>
                    )}

                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        {isAddMode && editingInsumo
                          ? 'Cantidad a agregar'
                          : 'Cantidad disponible'}
                      </label>
                      <input
                        type="number"
                        name="cantidad"
                        value={formData.cantidad}
                        onChange={handleInputChange}
                        min="0"
                        step="1"
                        style={styles.input}
                        className="form-input"
                        placeholder="0"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Unidad de Medida</label>
                      <select
                        name="unidad"
                        value={formData.unidad}
                        onChange={handleInputChange}
                        style={styles.input}
                      >
                        <option value="">Seleccione unidad...</option>
                        {unidades.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Tipo de Insumo</label>
                      <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        style={styles.input}
                      >
                        <option value="">Seleccione tipo...</option>
                        {tipos.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nombre}
                          </option>
                        ))}
                      </select>
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

                    {formData.precioUnitario && formData.cantidad && (
                      <div style={{
                        marginTop: '8px',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px'
                      }}>
                        Precio total estimado: <strong>${(formData.precioUnitario * formData.cantidad).toFixed(2)}</strong>
                      </div>
                    )}

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Cantidad Mínima</label>
                      <input
                        type="number"
                        name="cantidadMinima"
                        value={formData.cantidadMinima || ''}
                        onChange={handleInputChange}
                        min="0"
                        step="1"
                        style={styles.input}
                        className="form-input"
                        placeholder="Ej: 10"
                      />
                      <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>
                        Se generará una alerta cuando el stock sea menor o igual a esta cantidad.
                      </p>
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
                      {content.messageExtra && (
                        <p style={{...styles.confirmMessage, marginTop: '12px'}}>
                          {content.messageExtra}
                        </p>
                      )}
                      
                      {content.showWarning && (
                        <div style={styles.warningBox}>
                          <div style={styles.warningTitle}>
                            <AlertCircle style={{ width: '16px', height: '16px' }} />
                            Cambios que se aplicarán:
                          </div>
                          <ul style={styles.warningList}>
                            {confirmData.cambios.nombre && (
                              <li>El nombre se actualizará en el inventario</li>
                            )}
                            {confirmData.cambios.unidad && (
                              <li>La unidad de medida se actualizará en todas las prendas relacionadas</li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {content.showPrendas && confirmData.prendas && (
                        <div style={styles.prendasList}>
                          {confirmData.prendas.map((prenda) => (
                            <div key={prenda.id} style={styles.prendaItem}>
                              <div style={styles.prendaItemName}>{prenda.nombre}</div>
                              <div style={styles.prendaItemDetail}>
                                Usa {prenda.cantidad_usada} {prenda.unidad}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={styles.confirmActions}>
                      {!content.hideCancel && (
                        <button
                          onClick={handleCancelConfirm}
                          style={styles.confirmCancelButton}
                          className="hover-confirm-cancel"
                        >
                          Cancelar
                        </button>
                      )}
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