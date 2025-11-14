import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, Upload, Eye } from 'lucide-react';
import Componente from './componente.jsx';
import { useAuth } from '../context/AuthContext';
import fondoImg from './assets/fondo.png';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const styles = {
  prendasContainer: {
    padding: '32px',
    minHeight: '100vh',
    backgroundImage: `url(${fondoImg})`,
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
    gap: '16px',
    marginBottom: '24px'
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
    width: '300px',
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
  prendasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  prendaCard: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column'
  },
  prendaImageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  prendaImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  imagePlaceholder: {
    color: '#666',
    fontSize: '14px',
    textAlign: 'center'
  },
  prendaInfo: {
    padding: '16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  prendaTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px'
  },
  prendaDetail: {
    fontSize: '14px',
    color: '#cccccc',
    display: 'flex',
    justifyContent: 'space-between'
  },
  prendaDetailLabel: {
    color: '#999999'
  },
  prendaActions: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  actionButton: {
    flex: 1,
    padding: '8px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  btnVer: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    color: '#2196F3',
    border: '1px solid rgba(33, 150, 243, 0.4)'
  },
  btnEditar: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    color: '#FF9800',
    border: '1px solid rgba(255, 152, 0, 0.4)'
  },
  btnEliminar: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    color: '#f44336',
    border: '1px solid rgba(244, 67, 54, 0.4)'
  },
  cargarMasContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px'
  },
  cargarMasButton: {
    padding: '12px 32px',
    backgroundColor: 'rgba(33, 150, 243, 1)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  mensajeVacio: {
    textAlign: 'center',
    padding: '48px',
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  mensajeVacioTexto: {
    fontSize: '18px',
    color: '#999999',
    marginBottom: '16px'
  },
  mensajeInfo: {
    textAlign: 'center',
    padding: '32px',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(33, 150, 243, 0.3)',
    color: '#2196F3',
    fontSize: '16px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  modal: {
    backgroundColor: 'rgba(30, 30, 30, 0.98)',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  modalPequeño: {
    maxWidth: '500px'
  },
  modalDetalles: {
    maxWidth: '800px'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid rgba(255, 215, 15, 0.3)'
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
  formSection: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '2px solid rgba(255, 215, 15, 0.3)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    color: '#fff',
    marginBottom: '8px',
    fontWeight: '600',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontSize: '14px'
  },
  inputConBoton: {
    display: 'flex',
    gap: '10px'
  },
  selectFlex: {
    flex: 1
  },
  btnAgregarClasificacion: {
    backgroundColor: 'rgba(33, 150, 243, 1)',
    color: '#ffffff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  imagenActual: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    textAlign: 'center'
  },
  imagenActualPreview: {
    maxWidth: '200px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  btnAgregar: {
    backgroundColor: 'rgba(76, 175, 80, 1)',
    color: '#ffffff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  mensajeVacioSeccion: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    fontSize: '14px'
  },
  insumoItem: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr auto auto',
    gap: '12px',
    marginBottom: '12px',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  unidadMedida: {
    fontSize: '14px',
    color: '#cccccc',
    padding: '0 10px',
    whiteSpace: 'nowrap',
    fontWeight: '500'
  },
  btnEliminarItem: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    color: '#f44336',
    border: '1px solid rgba(244, 67, 54, 0.4)',
    borderRadius: '6px',
    width: '36px',
    height: '36px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s'
  },
  tallesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '12px'
  },
  talleCheckbox: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  talleCheckboxChecked: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: 'rgba(76, 175, 80, 1)'
  },
  talleCheckboxInput: {
    marginRight: '8px',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: 'rgba(76, 175, 80, 1)'
  },
  talleCheckboxLabel: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  formActions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: '24px'
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: 'rgba(120, 120, 120, 0.3)',
    color: '#ffffff',
    border: '1px solid rgba(120, 120, 120, 0.5)',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: 'rgba(76, 175, 80, 1)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  detallesContenido: {
    padding: '24px'
  },
  detallesImagenGrande: {
    width: '100%',
    height: '300px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  detallesImagenGrandeImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  detallesInfo: {
    color: '#ffffff'
  },
  detallesInfoTitulo: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '24px',
    paddingBottom: '12px',
    borderBottom: '2px solid rgba(255, 215, 15, 1)'
  },
  detalleItem: {
    marginBottom: '16px',
    fontSize: '16px',
    color: '#cccccc',
    display: 'flex',
    gap: '8px'
  },
  detalleItemLabel: {
    color: '#999999',
    minWidth: '180px'
  },
  detalleItemValue: {
    color: '#ffffff',
    fontWeight: '500'
  },
  detalleSeccion: {
    marginTop: '32px'
  },
  detalleSeccionTitulo: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
  },
  tablaInsumos: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  tablaInsumosHead: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  tablaInsumosTh: {
    padding: '12px',
    textAlign: 'left',
    color: '#ffffff',
    fontWeight: '600',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  tablaInsumosTd: {
    padding: '12px',
    color: '#cccccc',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  tallesLista: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '12px'
  },
  talleBadge: {
    backgroundColor: 'rgba(76, 175, 80, 1)',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  inputFull: {
    width: '100%',
    padding: '10px 16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#000',
    outline: 'none',
    boxSizing: 'border-box'
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: '24px'
  },
  alert: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    padding: '16px 24px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 3000,
    animation: 'slideInRight 0.3s ease',
    minWidth: '300px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },
  alertSuccess: {
    backgroundColor: 'rgba(76, 175, 80, 0.95)',
    border: '1px solid rgba(76, 175, 80, 1)'
  },
  alertError: {
    backgroundColor: 'rgba(244, 67, 54, 0.95)',
    border: '1px solid rgba(244, 67, 54, 1)'
  },
  alertText: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500'
  }
};

const Prendas = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Estados principales
  const [prendas, setPrendas] = useState([]);
  const [prendasMostradas, setPrendasMostradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Estados para el formulario
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [prendaSeleccionada, setPrendaSeleccionada] = useState(null);

  // Estados para el modal de detalles
  const [modalDetalles, setModalDetalles] = useState(false);
  const [prendaDetalles, setPrendaDetalles] = useState(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    Prenda_nombre: '',
    Prenda_marca: '',
    Prenda_modelo: '',
    Prenda_color: '',
    Prenda_precio_unitario: 0,
    Prenda_imagen: null
  });

  // Estados para insumos y talles
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);
  const [tallesSeleccionados, setTallesSeleccionados] = useState([]);

  // Datos de catálogos
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [colores, setColores] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [talles, setTalles] = useState([]);

  // Estados para agregar nuevas clasificaciones
  const [modalNuevaMarca, setModalNuevaMarca] = useState(false);
  const [modalNuevoColor, setModalNuevoColor] = useState(false);
  const [nuevaMarca, setNuevaMarca] = useState('');
  const [nuevoColor, setNuevoColor] = useState('');

  // Estados para filtros
  const [filtroTipo, setFiltroTipo] = useState('-');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(0);
  const ITEMS_POR_PAGINA = 12;

  // Función para mostrar alertas
  const mostrarAlerta = (mensaje, tipo = 'success') => {
    setAlert({ message: mensaje, type: tipo });
    setTimeout(() => setAlert(null), 3000);
  };

  // CARGAR DATOS INICIALES
  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    try {
      const [marcasRes, modelosRes, coloresRes, insumosRes, tallesRes] = await Promise.all([
        axios.get(`${API_URL}/api/clasificaciones/marcas/`),
        axios.get(`${API_URL}/api/clasificaciones/modelos/`),
        axios.get(`${API_URL}/api/clasificaciones/colores/`),
        axios.get(`${API_URL}/api/inventario/insumos/`),
        axios.get(`${API_URL}/api/clasificaciones/talles/`)
      ]);

      setMarcas(marcasRes.data);
      setModelos(modelosRes.data);
      setColores(coloresRes.data);
      setInsumos(insumosRes.data);
      setTalles(tallesRes.data);
    } catch (err) {
      console.error('Error cargando catálogos:', err);
      mostrarAlerta('Error al cargar los datos necesarios', 'error');
    }
  };

  // BUSCAR PRENDAS
  const buscarPrendas = async () => {
    if (filtroTipo === '-') {
      setPrendas([]);
      setPrendasMostradas([]);
      setPaginaActual(0);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/api/inventario/prendas/`);
      
      // Validar que la respuesta sea un array
      if (!Array.isArray(response.data)) {
        console.error('La respuesta no es un array:', response.data);
        mostrarAlerta('Error: formato de datos inválido', 'error');
        setPrendas([]);
        setPrendasMostradas([]);
        return;
      }

      let prendasFiltradas = response.data;

      // Aplicar filtro de búsqueda en tiempo real si hay texto
      if (filtroBusqueda.trim() !== '') {
        const busqueda = filtroBusqueda.toLowerCase();
        prendasFiltradas = prendasFiltradas.filter(prenda => {
          const nombre = (prenda.Prenda_nombre || '').toLowerCase();
          const marca = (prenda.Prenda_marca_nombre || '').toLowerCase();
          const modelo = (prenda.Prenda_modelo_nombre || '').toLowerCase();
          const color = (prenda.Prenda_color_nombre || '').toLowerCase();

          return nombre.includes(busqueda) ||
                 marca.includes(busqueda) ||
                 modelo.includes(busqueda) ||
                 color.includes(busqueda);
        });
      }

      setPrendas(prendasFiltradas);
      setPrendasMostradas(prendasFiltradas.slice(0, ITEMS_POR_PAGINA));
      setPaginaActual(0);
    } catch (err) {
      console.error('Error buscando prendas:', err);
      if (err.response) {
        console.error('Error del servidor:', err.response.data);
        mostrarAlerta(`Error del servidor: ${err.response.data.error || 'Error desconocido'}`, 'error');
      } else {
        mostrarAlerta('Error al buscar prendas', 'error');
      }
      setPrendas([]);
      setPrendasMostradas([]);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar búsqueda cuando cambian los filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      buscarPrendas();
    }, 300);

    return () => clearTimeout(timer);
  }, [filtroTipo, filtroBusqueda]);

  // CARGAR MÁS PRENDAS
  const cargarMasPrendas = () => {
    const nuevaPagina = paginaActual + 1;
    const inicio = 0;
    const fin = (nuevaPagina + 1) * ITEMS_POR_PAGINA;
    setPrendasMostradas(prendas.slice(inicio, fin));
    setPaginaActual(nuevaPagina);
  };

  const hayMasPrendas = () => {
    return prendas.length > (paginaActual + 1) * ITEMS_POR_PAGINA;
  };

  // ABRIR MODALES
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setPrendaSeleccionada(null);
    setFormData({
      Prenda_nombre: '',
      Prenda_marca: '',
      Prenda_modelo: '',
      Prenda_color: '',
      Prenda_precio_unitario: 0,
      Prenda_imagen: null
    });
    setInsumosSeleccionados([]);
    setTallesSeleccionados([]);
    setModalAbierto(true);
  };

  const abrirModalEditar = async (prenda) => {
    setModoEdicion(true);
    setPrendaSeleccionada(prenda);

    try {
      const response = await axios.get(`${API_URL}/api/inventario/prendas/${prenda.Prenda_ID}/`);
      const prendaCompleta = response.data;

      setFormData({
        Prenda_nombre: prendaCompleta.Prenda_nombre || '',
        Prenda_marca: prendaCompleta.Prenda_marca || '',
        Prenda_modelo: prendaCompleta.Prenda_modelo || '',
        Prenda_color: prendaCompleta.Prenda_color || '',
        Prenda_precio_unitario: prendaCompleta.Prenda_precio_unitario || 0,
        Prenda_imagen: null
      });

      const insumosConvertidos = (prendaCompleta.insumos_prendas || []).map(ip => ({
        insumo: ip.insumo,
        cantidad: ip.Insumo_prenda_cantidad_utilizada,
        unidad: ip.Insumo_prenda_unidad_medida
      }));
      setInsumosSeleccionados(insumosConvertidos);

      setTallesSeleccionados(prendaCompleta.talles || []);

      setModalAbierto(true);
    } catch (err) {
      console.error('Error cargando prenda:', err);
      mostrarAlerta('Error al cargar los datos de la prenda', 'error');
    }
  };

  const abrirModalDetalles = async (prenda) => {
    try {
      const response = await axios.get(`${API_URL}/api/inventario/prendas/${prenda.Prenda_ID}/`);
      setPrendaDetalles(response.data);
      setModalDetalles(true);
    } catch (err) {
      console.error('Error cargando detalles:', err);
      mostrarAlerta('Error al cargar los detalles de la prenda', 'error');
    }
  };

  // MANEJO DE FORMULARIO
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        Prenda_imagen: file
      }));
    }
  };

  // MANEJO DE INSUMOS
  const agregarInsumo = () => {
    setInsumosSeleccionados([
      ...insumosSeleccionados,
      { insumo: '', cantidad: 0, unidad: '' }
    ]);
  };

  const eliminarInsumo = (index) => {
    setInsumosSeleccionados(insumosSeleccionados.filter((_, i) => i !== index));
  };

  const handleInsumoChange = (index, campo, valor) => {
    const nuevosInsumos = [...insumosSeleccionados];

    if (campo === 'insumo') {
      nuevosInsumos[index].insumo = valor;
      const insumoEncontrado = insumos.find(i => i.Insumo_ID === parseInt(valor));
      if (insumoEncontrado) {
        nuevosInsumos[index].unidad = insumoEncontrado.unidad_medida_nombre || '';
      }
    } else if (campo === 'cantidad') {
      nuevosInsumos[index].cantidad = parseFloat(valor) || 0;
    }

    setInsumosSeleccionados(nuevosInsumos);
  };

  // MANEJO DE TALLES
  const toggleTalle = (codigoTalle) => {
    if (tallesSeleccionados.includes(codigoTalle)) {
      setTallesSeleccionados(tallesSeleccionados.filter(t => t !== codigoTalle));
    } else {
      setTallesSeleccionados([...tallesSeleccionados, codigoTalle]);
    }
  };

  // AGREGAR NUEVA MARCA
  const agregarNuevaMarca = async () => {
    if (!nuevaMarca.trim()) {
      mostrarAlerta('Por favor ingrese un nombre para la marca', 'error');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/clasificaciones/marcas/`, {
        Marca_nombre: nuevaMarca.trim()
      });

      setMarcas([...marcas, response.data]);
      setFormData(prev => ({ ...prev, Prenda_marca: response.data.Marca_ID }));
      setNuevaMarca('');
      setModalNuevaMarca(false);
      mostrarAlerta('Marca agregada correctamente');
    } catch (err) {
      console.error('Error agregando marca:', err);
      mostrarAlerta('Error al agregar la marca', 'error');
    }
  };

  // AGREGAR NUEVO COLOR
  const agregarNuevoColor = async () => {
    if (!nuevoColor.trim()) {
      mostrarAlerta('Por favor ingrese un nombre para el color', 'error');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/clasificaciones/colores/`, {
        Color_nombre: nuevoColor.trim()
      });

      setColores([...colores, response.data]);
      setFormData(prev => ({ ...prev, Prenda_color: response.data.Color_ID }));
      setNuevoColor('');
      setModalNuevoColor(false);
      mostrarAlerta('Color agregado correctamente');
    } catch (err) {
      console.error('Error agregando color:', err);
      mostrarAlerta('Error al agregar el color', 'error');
    }
  };

  // GUARDAR PRENDA
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.Prenda_nombre.trim()) {
      mostrarAlerta('Por favor ingrese el nombre de la prenda', 'error');
      return;
    }
    if (!formData.Prenda_marca) {
      mostrarAlerta('Por favor seleccione una marca', 'error');
      return;
    }
    if (!formData.Prenda_modelo) {
      mostrarAlerta('Por favor seleccione un modelo', 'error');
      return;
    }
    if (!formData.Prenda_color) {
      mostrarAlerta('Por favor seleccione un color', 'error');
      return;
    }
    if (insumosSeleccionados.length === 0) {
      mostrarAlerta('Por favor agregue al menos un insumo', 'error');
      return;
    }
    if (tallesSeleccionados.length === 0) {
      mostrarAlerta('Por favor seleccione al menos un talle', 'error');
      return;
    }

    for (let i = 0; i < insumosSeleccionados.length; i++) {
      const insumo = insumosSeleccionados[i];
      if (!insumo.insumo || insumo.cantidad <= 0) {
        mostrarAlerta(`Por favor complete todos los datos del insumo ${i + 1}`, 'error');
        return;
      }
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('Prenda_nombre', formData.Prenda_nombre.trim());
      formDataToSend.append('Prenda_marca', formData.Prenda_marca);
      formDataToSend.append('Prenda_modelo', formData.Prenda_modelo);
      formDataToSend.append('Prenda_color', formData.Prenda_color);
      formDataToSend.append('Prenda_precio_unitario', formData.Prenda_precio_unitario);

      if (formData.Prenda_imagen) {
        formDataToSend.append('Prenda_imagen', formData.Prenda_imagen);
      }

      formDataToSend.append('insumos_prendas', JSON.stringify(
        insumosSeleccionados.map(i => ({
          insumo: i.insumo,
          cantidad: i.cantidad
        }))
      ));

      formDataToSend.append('talles', JSON.stringify(tallesSeleccionados));

      if (modoEdicion) {
        await axios.put(
          `${API_URL}/api/inventario/prendas/${prendaSeleccionada.Prenda_ID}/`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        mostrarAlerta('Prenda actualizada correctamente');
      } else {
        await axios.post(
          `${API_URL}/api/inventario/prendas/`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        mostrarAlerta('Prenda creada correctamente');
      }

      setModalAbierto(false);
      buscarPrendas();
    } catch (err) {
      console.error('Error guardando prenda:', err);
      mostrarAlerta(err.response?.data?.error || 'Error al guardar la prenda', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ELIMINAR PRENDA
  const eliminarPrenda = async (prenda) => {
    if (!window.confirm(`¿Está seguro de eliminar la prenda "${prenda.Prenda_nombre}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/inventario/prendas/${prenda.Prenda_ID}/`);
      mostrarAlerta('Prenda eliminada correctamente');
      buscarPrendas();
    } catch (err) {
      console.error('Error eliminando prenda:', err);
      const mensaje = err.response?.data?.error || 'Error al eliminar la prenda';
      mostrarAlerta(mensaje, 'error');
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusqueda = () => {
    setFiltroBusqueda('');
  };

  return (
    <>
      <Componente onToggle={setIsCollapsed} />
      
      <div
        style={{
          ...styles.prendasContainer,
          marginLeft: isCollapsed ? '80px' : '250px'
        }}
      >
        <div style={styles.contentWrapper}>
          {/* HEADER */}
          <div style={styles.header}>
            <h1 style={styles.title}>Gestión de Prendas</h1>
            <button
              style={styles.addButton}
              onClick={abrirModalCrear}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Plus style={{ width: '20px', height: '20px' }} />
              Nueva Prenda
            </button>
          </div>

          {/* FILTROS */}
          <div style={styles.headerActions}>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              style={styles.select}
            >
              <option value="-">-</option>
              <option value="TODOS">TODOS</option>
            </select>

            <div style={styles.searchContainer}>
              <Search style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar por nombre, marca, modelo o color..."
                value={filtroBusqueda}
                onChange={(e) => setFiltroBusqueda(e.target.value)}
                style={styles.searchInput}
                disabled={filtroTipo === '-'}
              />
              {filtroBusqueda && (
                <button
                  style={styles.clearButton}
                  onClick={limpiarBusqueda}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#666')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              )}
            </div>

            {prendasMostradas.length > 0 && (
              <div style={styles.searchCounter}>
                {prendasMostradas.length} de {prendas.length} prendas
              </div>
            )}
          </div>

          {/* MENSAJES */}
          {!loading && prendasMostradas.length === 0 && filtroTipo !== '-' && (
            <div style={styles.mensajeVacio}>
              <p style={styles.mensajeVacioTexto}>
                {filtroBusqueda ? 'No se encontraron prendas con ese criterio' : 'No hay prendas disponibles'}
              </p>
            </div>
          )}

          {!loading && prendasMostradas.length === 0 && filtroTipo === '-' && (
            <div style={styles.mensajeInfo}>
              Seleccione "TODOS" en el filtro para ver todas las prendas
            </div>
          )}

          {/* GRID DE PRENDAS */}
          <div style={styles.prendasGrid}>
            {prendasMostradas.map((prenda) => (
              <div
                key={prenda.Prenda_ID}
                style={styles.prendaCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.prendaImageContainer}>
                  {prenda.Prenda_imagen_url ? (
                    <img
                      src={prenda.Prenda_imagen_url}
                      alt={prenda.Prenda_nombre}
                      style={styles.prendaImage}
                    />
                  ) : (
                    <div style={styles.imagePlaceholder}>Sin imagen</div>
                  )}
                </div>

                <div style={styles.prendaInfo}>
                  <h3 style={styles.prendaTitle}>{prenda.Prenda_nombre}</h3>
                  
                  <div style={styles.prendaDetail}>
                    <span style={styles.prendaDetailLabel}>Marca:</span>
                    <span>{prenda.Prenda_marca_nombre || 'N/A'}</span>
                  </div>
                  
                  <div style={styles.prendaDetail}>
                    <span style={styles.prendaDetailLabel}>Modelo:</span>
                    <span>{prenda.Prenda_modelo_nombre || 'N/A'}</span>
                  </div>
                  
                  <div style={styles.prendaDetail}>
                    <span style={styles.prendaDetailLabel}>Color:</span>
                    <span>{prenda.Prenda_color_nombre || 'N/A'}</span>
                  </div>
                  
                  <div style={styles.prendaDetail}>
                    <span style={styles.prendaDetailLabel}>Costo:</span>
                    <span>${prenda.Prenda_costo_total_produccion?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>

                <div style={styles.prendaActions}>
                  <button
                    style={{...styles.actionButton, ...styles.btnVer}}
                    onClick={() => abrirModalDetalles(prenda)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.2)';
                    }}
                  >
                    <Eye style={{ width: '16px', height: '16px' }} />
                    Ver
                  </button>
                  <button
                    style={{...styles.actionButton, ...styles.btnEditar}}
                    onClick={() => abrirModalEditar(prenda)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 152, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 152, 0, 0.2)';
                    }}
                  >
                    <Edit2 style={{ width: '16px', height: '16px' }} />
                    Editar
                  </button>
                  <button
                    style={{...styles.actionButton, ...styles.btnEliminar}}
                    onClick={() => eliminarPrenda(prenda)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(244, 67, 54, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(244, 67, 54, 0.2)';
                    }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* BOTÓN CARGAR MÁS */}
          {hayMasPrendas() && (
            <div style={styles.cargarMasContainer}>
              <button
                style={styles.cargarMasButton}
                onClick={cargarMasPrendas}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.9)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Cargar Más
              </button>
            </div>
          )}

          {/* MODAL FORMULARIO */}
          {modalAbierto && (
            <div style={styles.modalOverlay} onClick={() => setModalAbierto(false)}>
              <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>
                    {modoEdicion ? 'Editar Prenda' : 'Nueva Prenda'}
                  </h2>
                  <button
                    style={styles.closeButton}
                    onClick={() => setModalAbierto(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <X style={{ width: '24px', height: '24px', color: '#9ca3af' }} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* DATOS BÁSICOS */}
                  <div style={styles.formSection}>
                    <h3 style={styles.sectionTitle}>Datos Básicos</h3>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Nombre de la Prenda *</label>
                      <input
                        type="text"
                        name="Prenda_nombre"
                        value={formData.Prenda_nombre}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Marca *</label>
                      <div style={styles.inputConBoton}>
                        <select
                          name="Prenda_marca"
                          value={formData.Prenda_marca}
                          onChange={handleInputChange}
                          style={{...styles.input, ...styles.selectFlex}}
                          required
                        >
                          <option value="">Seleccionar...</option>
                          {marcas.map(marca => (
                            <option key={marca.Marca_ID} value={marca.Marca_ID}>
                              {marca.Marca_nombre}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          style={styles.btnAgregarClasificacion}
                          onClick={() => setModalNuevaMarca(true)}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.9)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 1)')}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Modelo *</label>
                      <select
                        name="Prenda_modelo"
                        value={formData.Prenda_modelo}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {modelos.map(modelo => (
                          <option key={modelo.Modelo_ID} value={modelo.Modelo_ID}>
                            {modelo.Modelo_nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Color *</label>
                      <div style={styles.inputConBoton}>
                        <select
                          name="Prenda_color"
                          value={formData.Prenda_color}
                          onChange={handleInputChange}
                          style={{...styles.input, ...styles.selectFlex}}
                          required
                        >
                          <option value="">Seleccionar...</option>
                          {colores.map(color => (
                            <option key={color.Color_ID} value={color.Color_ID}>
                              {color.Color_nombre}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          style={styles.btnAgregarClasificacion}
                          onClick={() => setModalNuevoColor(true)}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.9)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 1)')}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Costo de Producción (Mano de Obra) *</label>
                      <input
                        type="number"
                        name="Prenda_precio_unitario"
                        value={formData.Prenda_precio_unitario}
                        onChange={handleInputChange}
                        style={styles.input}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Imagen</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={styles.input}
                      />
                      {modoEdicion && prendaSeleccionada?.Prenda_imagen_url && !formData.Prenda_imagen && (
                        <div style={styles.imagenActual}>
                          <img
                            src={prendaSeleccionada.Prenda_imagen_url}
                            alt="Actual"
                            style={styles.imagenActualPreview}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* INSUMOS */}
                  <div style={styles.formSection}>
                    <div style={styles.sectionHeader}>
                      <h3 style={{...styles.sectionTitle, marginBottom: 0, paddingBottom: 0, borderBottom: 'none'}}>Insumos Utilizados *</h3>
                      <button
                        type="button"
                        style={styles.btnAgregar}
                        onClick={agregarInsumo}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.9)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 1)')}
                      >
                        + Agregar Insumo
                      </button>
                    </div>

                    {insumosSeleccionados.length === 0 && (
                      <p style={styles.mensajeVacioSeccion}>No hay insumos agregados</p>
                    )}

                    {insumosSeleccionados.map((insumo, index) => (
                      <div key={index} style={styles.insumoItem}>
                        <select
                          value={insumo.insumo}
                          onChange={(e) => handleInsumoChange(index, 'insumo', e.target.value)}
                          style={styles.input}
                          required
                        >
                          <option value="">Seleccionar insumo...</option>
                          {insumos.map(i => (
                            <option key={i.Insumo_ID} value={i.Insumo_ID}>
                              {i.Insumo_nombre}
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          placeholder="Cantidad"
                          value={insumo.cantidad}
                          onChange={(e) => handleInsumoChange(index, 'cantidad', e.target.value)}
                          style={styles.input}
                          min="0"
                          step="0.01"
                          required
                        />

                        <span style={styles.unidadMedida}>{insumo.unidad || '-'}</span>

                        <button
                          type="button"
                          style={styles.btnEliminarItem}
                          onClick={() => eliminarInsumo(index)}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(244, 67, 54, 0.3)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(244, 67, 54, 0.2)')}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* TALLES */}
                  <div style={styles.formSection}>
                    <h3 style={styles.sectionTitle}>Talles Disponibles *</h3>
                    <div style={styles.tallesGrid}>
                      {talles.map(talle => (
                        <label
                          key={talle.Talle_ID}
                          style={{
                            ...styles.talleCheckbox,
                            ...(tallesSeleccionados.includes(talle.Talle_codigo) && styles.talleCheckboxChecked)
                          }}
                          onMouseEnter={(e) => {
                            if (!tallesSeleccionados.includes(talle.Talle_codigo)) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!tallesSeleccionados.includes(talle.Talle_codigo)) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={tallesSeleccionados.includes(talle.Talle_codigo)}
                            onChange={() => toggleTalle(talle.Talle_codigo)}
                            style={styles.talleCheckboxInput}
                          />
                          <span style={styles.talleCheckboxLabel}>{talle.Talle_codigo}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* BOTONES */}
                  <div style={styles.formActions}>
                    <button
                      type="button"
                      style={styles.cancelButton}
                      onClick={() => setModalAbierto(false)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(120, 120, 120, 0.4)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(120, 120, 120, 0.3)')}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={styles.submitButton}
                      disabled={loading}
                      onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.9)')}
                      onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 1)')}
                    >
                      {loading ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL NUEVA MARCA */}
          {modalNuevaMarca && (
            <div style={styles.modalOverlay} onClick={() => setModalNuevaMarca(false)}>
              <div
                style={{...styles.modal, ...styles.modalPequeño}}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Agregar Nueva Marca</h2>
                  <button
                    style={styles.closeButton}
                    onClick={() => setModalNuevaMarca(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <X style={{ width: '24px', height: '24px', color: '#9ca3af' }} />
                  </button>
                </div>
                <div style={{ padding: '0 24px 24px' }}>
                  <input
                    type="text"
                    placeholder="Nombre de la marca"
                    value={nuevaMarca}
                    onChange={(e) => setNuevaMarca(e.target.value)}
                    style={styles.inputFull}
                  />
                </div>
                <div style={styles.modalFooter}>
                  <button
                    style={styles.cancelButton}
                    onClick={() => setModalNuevaMarca(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(120, 120, 120, 0.4)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(120, 120, 120, 0.3)')}
                  >
                    Cancelar
                  </button>
                  <button
                    style={styles.submitButton}
                    onClick={agregarNuevaMarca}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.9)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 1)')}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL NUEVO COLOR */}
          {modalNuevoColor && (
            <div style={styles.modalOverlay} onClick={() => setModalNuevoColor(false)}>
              <div
                style={{...styles.modal, ...styles.modalPequeño}}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Agregar Nuevo Color</h2>
                  <button
                    style={styles.closeButton}
                    onClick={() => setModalNuevoColor(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <X style={{ width: '24px', height: '24px', color: '#9ca3af' }} />
                  </button>
                </div>
                <div style={{ padding: '0 24px 24px' }}>
                  <input
                    type="text"
                    placeholder="Nombre del color"
                    value={nuevoColor}
                    onChange={(e) => setNuevoColor(e.target.value)}
                    style={styles.inputFull}
                  />
                </div>
                <div style={styles.modalFooter}>
                  <button
                    style={styles.cancelButton}
                    onClick={() => setModalNuevoColor(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(120, 120, 120, 0.4)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(120, 120, 120, 0.3)')}
                  >
                    Cancelar
                  </button>
                  <button
                    style={styles.submitButton}
                    onClick={agregarNuevoColor}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.9)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 1)')}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL DETALLES */}
          {modalDetalles && prendaDetalles && (
            <div style={styles.modalOverlay} onClick={() => setModalDetalles(false)}>
              <div
                style={{...styles.modal, ...styles.modalDetalles}}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Detalles de la Prenda</h2>
                  <button
                    style={styles.closeButton}
                    onClick={() => setModalDetalles(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <X style={{ width: '24px', height: '24px', color: '#9ca3af' }} />
                  </button>
                </div>

                <div style={styles.detallesContenido}>
                  <div style={styles.detallesImagenGrande}>
                    {prendaDetalles.Prenda_imagen_url ? (
                      <img
                        src={prendaDetalles.Prenda_imagen_url}
                        alt={prendaDetalles.Prenda_nombre}
                        style={styles.detallesImagenGrandeImg}
                      />
                    ) : (
                      <div style={styles.imagePlaceholder}>Sin imagen</div>
                    )}
                  </div>

                  <div style={styles.detallesInfo}>
                    <h3 style={styles.detallesInfoTitulo}>{prendaDetalles.Prenda_nombre}</h3>

                    <div style={styles.detalleItem}>
                      <span style={styles.detalleItemLabel}>Marca:</span>
                      <span style={styles.detalleItemValue}>
                        {prendaDetalles.Prenda_marca_nombre || 'N/A'}
                      </span>
                    </div>

                    <div style={styles.detalleItem}>
                      <span style={styles.detalleItemLabel}>Modelo:</span>
                      <span style={styles.detalleItemValue}>
                        {prendaDetalles.Prenda_modelo_nombre || 'N/A'}
                      </span>
                    </div>

                    <div style={styles.detalleItem}>
                      <span style={styles.detalleItemLabel}>Color:</span>
                      <span style={styles.detalleItemValue}>
                        {prendaDetalles.Prenda_color_nombre || 'N/A'}
                      </span>
                    </div>

                    <div style={styles.detalleItem}>
                      <span style={styles.detalleItemLabel}>Costo de Mano de Obra:</span>
                      <span style={styles.detalleItemValue}>
                        ${prendaDetalles.Prenda_precio_unitario?.toFixed(2) || '0.00'}
                      </span>
                    </div>

                    <div style={styles.detalleItem}>
                      <span style={styles.detalleItemLabel}>Costo Total de Producción:</span>
                      <span style={styles.detalleItemValue}>
                        ${prendaDetalles.Prenda_costo_total_produccion?.toFixed(2) || '0.00'}
                      </span>
                    </div>

                    <div style={styles.detalleSeccion}>
                      <h4 style={styles.detalleSeccionTitulo}>Insumos Utilizados:</h4>
                      {prendaDetalles.insumos_prendas?.length > 0 ? (
                        <table style={styles.tablaInsumos}>
                          <thead style={styles.tablaInsumosHead}>
                            <tr>
                              <th style={styles.tablaInsumosTh}>Insumo</th>
                              <th style={styles.tablaInsumosTh}>Cantidad</th>
                              <th style={styles.tablaInsumosTh}>Costo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prendaDetalles.insumos_prendas.map((ip, index) => (
                              <tr key={index}>
                                <td style={styles.tablaInsumosTd}>{ip.insumo_nombre}</td>
                                <td style={styles.tablaInsumosTd}>
                                  {ip.Insumo_prenda_cantidad_utilizada} {ip.Insumo_prenda_unidad_medida}
                                </td>
                                <td style={styles.tablaInsumosTd}>
                                  ${ip.Insumo_prenda_costo_total?.toFixed(2) || '0.00'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p style={{ color: '#999' }}>No hay insumos registrados</p>
                      )}
                    </div>

                    <div style={styles.detalleSeccion}>
                      <h4 style={styles.detalleSeccionTitulo}>Talles Disponibles:</h4>
                      {prendaDetalles.talles?.length > 0 ? (
                        <div style={styles.tallesLista}>
                          {prendaDetalles.talles.map((talle, index) => (
                            <span key={index} style={styles.talleBadge}>{talle}</span>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: '#999' }}>No hay talles disponibles</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ALERTA */}
          {alert && (
            <div
              style={{
                ...styles.alert,
                ...(alert.type === 'success' ? styles.alertSuccess : styles.alertError)
              }}
            >
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

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Prendas;