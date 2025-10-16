import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Package, Plus, Trash2, X, Search, XCircle } from 'lucide-react';
import Componente from "./componente.jsx";
import fondoImg from './assets/fondo.png';

const styles = {
  container: {
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
  headerLeft: {
    flex: 1
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#d1d5db'
  },
  btnRealizarPedido: {
    backgroundColor: '#ffd70f',
    color: '#000',
    padding: '12px 30px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'all 0.2s'
  },
  searchContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: '1 1 200px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: '#fff',
    fontSize: '14px'
  },
  select: {
    flex: '1 1 150px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer'
  },
  btnBuscar: {
    padding: '10px 24px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  btnLimpiar: {
    padding: '10px 24px',
    backgroundColor: '#6b7280',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  tableContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    color: '#9ca3af',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  td: {
    padding: '16px',
    color: '#fff',
    fontSize: '14px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  btnVerDetalles: {
    padding: '6px 16px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500'
  },
  btnCancelar: {
    padding: '6px 16px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  estadoBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  },
  estadoPendiente: {
    backgroundColor: '#fbbf24',
    color: '#000'
  },
  estadoEnProceso: {
    backgroundColor: '#3b82f6',
    color: '#fff'
  },
  estadoCompletado: {
    backgroundColor: '#10b981',
    color: '#fff'
  },
  estadoCancelado: {
    backgroundColor: '#ef4444',
    color: '#fff'
  },
  btnEliminar: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#ef4444',
    padding: '4px'
  },
  actionsContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    overflowY: 'auto'
  },
  modalContent: {
    backgroundColor: 'rgba(20, 20, 20, 0.98)',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '1200px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '1px solid rgba(255, 215, 15, 0.3)',
    position: 'relative'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  modalTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffd70f'
  },
  btnClose: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '4px'
  },
  searchPrendaContainer: {
    position: 'relative',
    marginBottom: '24px'
  },
  searchPrendaInput: {
    width: '100%',
    padding: '14px 45px 14px 14px',
    borderRadius: '10px',
    border: '1px solid #4b5563',
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: '#fff',
    fontSize: '15px',
    boxSizing: 'border-box'
  },
  searchIcon: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af'
  },
  prendasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
    maxHeight: '500px',
    overflowY: 'auto',
    padding: '8px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '12px'
  },
  prendaCard: {
    backgroundColor: 'rgba(30,30,30,0.8)',
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  prendaCardSelected: {
    backgroundColor: 'rgba(255,215,15,0.15)',
    border: '2px solid #ffd70f',
    transform: 'scale(1.03)',
    boxShadow: '0 4px 12px rgba(255,215,15,0.3)'
  },
  prendaImage: {
    width: '100%',
    height: '140px',
    objectFit: 'cover'
  },
  prendaInfo: {
    padding: '12px',
    textAlign: 'center'
  },
  prendaNombre: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  prendaDetalle: {
    color: '#9ca3af',
    fontSize: '11px',
    marginBottom: '2px'
  },
  prendaPrecio: {
    color: '#ffd70f',
    fontSize: '13px',
    fontWeight: '700',
    marginTop: '6px'
  },
  formContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    alignItems: 'end'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    color: '#d1d5db',
    fontSize: '13px',
    fontWeight: '500'
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  selectTalle: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #4b5563',
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    boxSizing: 'border-box',
    width: '100%'
  },
  addBtn: {
    backgroundColor: '#ffd70f',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    color: '#000'
  },
  pedidosList: {
    marginTop: '20px'
  },
  pedidoCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: '14px 20px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white'
  },
  pedidoInfo: {
    flex: 1
  },
  pedidoNombre: {
    fontWeight: '600',
    fontSize: '14px'
  },
  pedidoDetalles: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '4px'
  },
  pedidoPrecio: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ffd70f',
    marginRight: '12px'
  },
  resultadoContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '20px',
    border: '1px solid rgba(255, 215, 15, 0.3)'
  },
  resultadoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
  },
  resultadoItem: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)',
    color: '#fff',
    textAlign: 'center'
  },
  resultadoLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '4px'
  },
  resultadoValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffd70f'
  },
  btnConfirmar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px 40px',
    backgroundColor: '#10b981',
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px'
  },
  alert: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '16px 24px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
    zIndex: 3000,
    minWidth: '350px',
    maxWidth: '500px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    whiteSpace: 'pre-line'
  },
  alertSuccess: { backgroundColor: '#10b981', color: '#fff' },
  alertError: { backgroundColor: '#ef4444', color: '#fff' },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#9ca3af'
  },
  infoBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px'
  },
  infoLabel: {
    fontSize: '12px',
    color: '#93c5fd',
    marginBottom: '4px'
  },
  infoValue: {
    fontSize: '16px',
    color: '#fff',
    fontWeight: '600'
  }
};

export default function PedidosView() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [prendas, setPrendas] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [selectedPrenda, setSelectedPrenda] = useState(null);
  const [searchPrenda, setSearchPrenda] = useState("");
  const [formData, setFormData] = useState({
    cantidad: 1,
    talle: "",
    recargoTalle: 10,
    porcentajeGanancia: 25
  });
  const [filtros, setFiltros] = useState({
    id: "",
    estado: "",
    fecha: ""
  });
  const [alert, setAlert] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);

  // 🔥 Función para obtener el estado del pedido
  const obtenerEstadoPedido = (pedido) => {
    // Si tu backend tiene un campo específico para estado, úsalo
    // Por ahora, asumimos que Pedido_estado puede ser:
    // "PENDIENTE", "EN_PROCESO", "COMPLETADO", "CANCELADO"
    // O si es booleano, lo mapeamos
    
    if (typeof pedido.Pedido_estado === 'string') {
      return pedido.Pedido_estado.toUpperCase();
    }
    
    // Si es booleano (legacy), mapear
    if (pedido.Pedido_estado === true) {
      return 'COMPLETADO';
    } else if (pedido.Pedido_estado === false) {
      return 'PENDIENTE';
    }
    
    return 'PENDIENTE';
  };

  // 🔥 Función para obtener texto y estilo del badge
  const obtenerEstiloEstado = (estado) => {
    switch(estado) {
      case 'PENDIENTE':
        return { texto: 'Pendiente', estilo: styles.estadoPendiente };
      case 'EN_PROCESO':
        return { texto: 'En Proceso', estilo: styles.estadoEnProceso };
      case 'COMPLETADO':
        return { texto: 'Completado', estilo: styles.estadoCompletado };
      case 'CANCELADO':
        return { texto: 'Cancelado', estilo: styles.estadoCancelado };
      default:
        return { texto: 'Pendiente', estilo: styles.estadoPendiente };
    }
  };

  // Cargar prendas
  useEffect(() => {
    const fetchPrendas = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/inventario/prendas/");
        const data = await res.json();
        setPrendas(data);
      } catch (err) {
        showAlert("Error al cargar prendas", "error");
      }
    };
    fetchPrendas();
  }, []);

  // 🔥 Cargar solo pedidos PENDIENTES por defecto
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        console.log("🔄 Intentando cargar pedidos...");
        const res = await fetch("http://localhost:8000/api/pedidos/");
        
        if (!res.ok) {
          console.error("❌ Error en la respuesta:", res.status, res.statusText);
          showAlert("Error al cargar pedidos", "error");
          return;
        }
        
        const data = await res.json();
        console.log("📦 Pedidos recibidos del servidor:", data);
        console.log("📦 Cantidad de pedidos:", data.length);
        
        if (data.length > 0) {
          console.log("📦 Primer pedido (ejemplo):", data[0]);
        }
        
        // 🔥 FILTRAR SOLO PEDIDOS PENDIENTES POR DEFECTO
        const pedidosPendientes = data.filter(p => {
          const estado = obtenerEstadoPedido(p);
          return estado === 'PENDIENTE';
        });
        console.log("📦 Pedidos pendientes filtrados:", pedidosPendientes.length);
        
        setPedidosFiltrados(pedidosPendientes);
        console.log("✅ Pedidos cargados en la tabla:", pedidosPendientes.length);
      } catch (err) {
        console.error("❌ Error al cargar pedidos:", err);
        showAlert("Error al cargar pedidos", "error");
      }
    };
    fetchPedidos();
  }, []);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const prendasFiltradas = prendas.filter(p =>
    p.Prenda_nombre.toLowerCase().includes(searchPrenda.toLowerCase()) ||
    p.Prenda_marca_nombre?.toLowerCase().includes(searchPrenda.toLowerCase()) ||
    p.Prenda_modelo_nombre?.toLowerCase().includes(searchPrenda.toLowerCase())
  );

  const agregarPrenda = () => {
    if (!selectedPrenda) {
      showAlert("Seleccioná una prenda", "error");
      return;
    }

    if (!formData.talle) {
      showAlert("Seleccioná un talle", "error");
      return;
    }

    const prendaBase = prendas.find(p => p.Prenda_ID === selectedPrenda.Prenda_ID);
    if (!prendaBase) return;

    const recargo = formData.talle.toUpperCase().includes("XL") ? formData.recargoTalle / 100 : 0;
    const precioBase = prendaBase.Prenda_precio_unitario;
    const precioFinal = precioBase * (1 + recargo);

    const nueva = {
      ...prendaBase,
      cantidad: parseInt(formData.cantidad),
      talle: formData.talle,
      precioUnitario: precioFinal
    };

    setPedido([...pedido, nueva]);
    setSelectedPrenda(null);
    setFormData({ ...formData, cantidad: 1, talle: "" });
  };

  const eliminarPrendaPedido = (index) => {
    setPedido(pedido.filter((_, i) => i !== index));
  };

  const calcularTotales = () => {
    if (pedido.length === 0) {
      showAlert("Agregá al menos una prenda", "error");
      return;
    }
    const subtotal = pedido.reduce((acc, p) => acc + p.precioUnitario * p.cantidad, 0);
    const ganancia = subtotal * (formData.porcentajeGanancia / 100);
    const total = subtotal + ganancia;
    setResultado({ subtotal, ganancia, total });
  };

  const confirmarPedido = async () => {
    try {
      const data = {
        usuario: 1,
        prendas: pedido.map(p => ({
          id_prenda: p.Prenda_ID,
          cantidad: p.cantidad,
          talle: p.talle,
          tipo: "LISA"
        }))
      };

      console.log("Enviando pedido:", data);

      const res = await fetch("http://localhost:8000/api/pedidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const responseData = await res.json();
      console.log("Respuesta del servidor:", responseData);

      if (!res.ok) {
        if (responseData.tipo === "stock_insuficiente") {
          const detallesHTML = responseData.mensajes.join('\n');
          showAlert(`❌ Stock Insuficiente:\n\n${detallesHTML}`, "error");
        } else if (responseData.tipo === "sin_prendas") {
          showAlert("⚠️ No se enviaron prendas en el pedido", "error");
        } else if (responseData.tipo === "prenda_no_encontrada") {
          showAlert(`⚠️ ${responseData.error}`, "error");
        } else {
          showAlert(`❌ Error: ${responseData.error || 'Error al realizar pedido'}`, "error");
        }
        return;
      }

      showAlert("✅ Pedido realizado correctamente", "success");

      // Recargar solo pedidos pendientes
      const resPedidos = await fetch("http://localhost:8000/api/pedidos/");
      const dataPedidos = await resPedidos.json();
      const pedidosPendientes = dataPedidos.filter(p => {
        const estado = obtenerEstadoPedido(p);
        return estado === 'PENDIENTE';
      });
      setPedidosFiltrados(pedidosPendientes);

      setPedido([]);
      setResultado(null);
      setModalOpen(false);
    } catch (err) {
      console.error("Error al confirmar pedido:", err);
      showAlert("❌ Error al conectar con el servidor", "error");
    }
  };

  // 🔥 Búsqueda con los 4 estados
  const buscarPedidos = async () => {
    try {
      console.log("🔍 Buscando con filtros:", filtros);
      const res = await fetch("http://localhost:8000/api/pedidos/");
      const data = await res.json();
      console.log("📦 Total de pedidos recibidos:", data.length);
      
      let filtrados = data;

      // Filtrar por ID
      if (filtros.id && filtros.id.trim() !== "") {
        console.log("Filtrando por ID:", filtros.id);
        filtrados = filtrados.filter(p => 
          p.Pedido_ID.toString().includes(filtros.id.trim())
        );
        console.log("Resultados después de filtrar por ID:", filtrados.length);
      }

      // 🔥 Filtrar por estado (4 opciones)
      if (filtros.estado && filtros.estado !== "") {
        console.log("Filtrando por estado:", filtros.estado);
        filtrados = filtrados.filter(p => {
          const estado = obtenerEstadoPedido(p);
          return estado === filtros.estado;
        });
        console.log("Resultados después de filtrar por estado:", filtrados.length);
      } else {
        // Si no se especifica estado, mostrar solo pendientes
        filtrados = filtrados.filter(p => {
          const estado = obtenerEstadoPedido(p);
          return estado === 'PENDIENTE';
        });
        console.log("Mostrando solo pendientes (por defecto):", filtrados.length);
      }

      // Filtrar por fecha
      if (filtros.fecha && filtros.fecha !== "") {
        console.log("Filtrando por fecha:", filtros.fecha);
        filtrados = filtrados.filter(p => {
          if (!p.Pedido_fecha) return false;
          const fechaPedido = p.Pedido_fecha.split('T')[0];
          return fechaPedido === filtros.fecha;
        });
        console.log("Resultados después de filtrar por fecha:", filtrados.length);
      }

      setPedidosFiltrados(filtrados);
      console.log("✅ Búsqueda completada, resultados finales:", filtrados.length);
      
      if (filtrados.length === 0) {
        showAlert("No se encontraron pedidos con los filtros aplicados", "error");
      }
    } catch (err) {
      console.error("Error en buscarPedidos:", err);
      showAlert("Error al buscar pedidos", "error");
    }
  };

  // Limpiar filtros
  const limpiarFiltros = async () => {
    setFiltros({ id: "", estado: "", fecha: "" });
    try {
      const res = await fetch("http://localhost:8000/api/pedidos/");
      const data = await res.json();
      const pedidosPendientes = data.filter(p => {
        const estado = obtenerEstadoPedido(p);
        return estado === 'PENDIENTE';
      });
      setPedidosFiltrados(pedidosPendientes);
      showAlert("Filtros limpiados - Mostrando pedidos pendientes", "success");
    } catch (err) {
      showAlert("Error al limpiar filtros", "error");
    }
  };

  // 🔥 Cancelar pedido (cambiar estado a CANCELADO)
  const cancelarPedido = async (id) => {
    if (!window.confirm("¿Estás seguro de cancelar este pedido?")) return;
    
    try {
      console.log(`🔄 Intentando cancelar pedido ${id}...`);
      
      // 🔥 PATCH para cambiar el estado a CANCELADO
      const res = await fetch(`http://localhost:8000/api/pedidos/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "CANCELADO" })
      });

      if (res.ok) {
        showAlert("✅ Pedido cancelado correctamente", "success");
        
        // Recargar solo pedidos pendientes
        const resPedidos = await fetch("http://localhost:8000/api/pedidos/");
        const dataPedidos = await resPedidos.json();
        const pedidosPendientes = dataPedidos.filter(p => {
          const estado = obtenerEstadoPedido(p);
          return estado === 'PENDIENTE';
        });
        setPedidosFiltrados(pedidosPendientes);
        console.log("✅ Lista de pedidos actualizada");
      } else {
        const errorData = await res.json();
        showAlert(`❌ Error al cancelar pedido: ${errorData.error || 'Error desconocido'}`, "error");
      }
    } catch (err) {
      console.error("❌ Error al cancelar el pedido:", err);
      showAlert("❌ Error al conectar con el servidor", "error");
    }
  };

  // Ver detalles
  const verDetallesPedido = async (pedido) => {
    try {
      console.log(`🔍 Cargando detalles del pedido ${pedido.Pedido_ID}...`);
      const res = await fetch(`http://localhost:8000/api/pedidos/${pedido.Pedido_ID}/`);
      
      if (!res.ok) {
        console.error("❌ Error al cargar detalles:", res.status);
        showAlert("❌ Error al cargar detalles del pedido", "error");
        return;
      }
      
      const data = await res.json();
      console.log("📋 Detalles del pedido recibidos:", data);
      console.log("📋 Cantidad de items en detalles:", data.detalles?.length || 0);
      
      if (!data.detalles || data.detalles.length === 0) {
        console.warn("⚠️ El pedido no tiene detalles o está vacío");
      }
      
      setPedidoSeleccionado(data);
      setModalDetallesOpen(true);
      console.log("✅ Modal de detalles abierto");
    } catch (err) {
      console.error("❌ Error al cargar detalles del pedido:", err);
      showAlert("❌ Error al cargar detalles del pedido", "error");
    }
  };

  const tallesDisponibles = selectedPrenda 
    ? (selectedPrenda.talles || [])
    : [];

  return (
    <>
      <Componente onToggle={setIsNavbarCollapsed} />
      <div
        style={{
          ...styles.container,
          backgroundImage: `url(${fondoImg})`,
          marginLeft: isNavbarCollapsed ? "70px" : "250px"
        }}
      >
        <div style={styles.contentWrapper}>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <h1 style={styles.title}>Pedidos</h1>
              <p style={styles.subtitle}>Gestión de pedidos - Por defecto se muestran pedidos pendientes</p>
            </div>
            <button 
              style={styles.btnRealizarPedido}
              onClick={() => setModalOpen(true)}
            >
              Realizar Pedido
            </button>
          </div>

          {/* 🔥 FILTROS CON 4 ESTADOS */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Buscar por ID..."
              value={filtros.id}
              onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
              style={styles.searchInput}
            />
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
              style={styles.select}
            >
              <option value="">Solo Pendientes</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROCESO">En Proceso</option>
              <option value="COMPLETADO">Completado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
            <input
              type="date"
              value={filtros.fecha}
              onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
              style={styles.searchInput}
            />
            <button style={styles.btnBuscar} onClick={buscarPedidos}>
              <Search size={18} /> Buscar
            </button>
            <button style={styles.btnLimpiar} onClick={limpiarFiltros}>
              <X size={18} /> Limpiar
            </button>
          </div>

          {pedidosFiltrados.length > 0 ? (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Pedido ID</th>
                    <th style={styles.th}>Detalles</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Fecha</th>
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((p) => {
                    const estado = obtenerEstadoPedido(p);
                    const { texto, estilo } = obtenerEstiloEstado(estado);
                    const puedeCancelar = estado === 'PENDIENTE' || estado === 'EN_PROCESO';
                    
                    return (
                      <tr key={p.Pedido_ID}>
                        <td style={styles.td}>PED{p.Pedido_ID.toString().padStart(3, '0')}</td>
                        <td style={styles.td}>
                          <button 
                            style={styles.btnVerDetalles}
                            onClick={() => verDetallesPedido(p)}
                          >
                            VER DETALLES
                          </button>
                        </td>
                        <td style={styles.td}>
                          <span style={{ ...styles.estadoBadge, ...estilo }}>
                            {texto}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {p.Pedido_fecha ? new Date(p.Pedido_fecha).toLocaleDateString('es-AR') : '-'}
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionsContainer}>
                            {puedeCancelar && (
                              <button 
                                style={styles.btnCancelar}
                                onClick={() => cancelarPedido(p.Pedido_ID)}
                                title="Cancelar pedido"
                              >
                                <XCircle size={16} />
                                Cancelar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <Package size={64} color="#4b5563" />
              <h3 style={{ marginTop: '16px', color: '#9ca3af' }}>
                No hay pedidos pendientes
              </h3>
              <p style={{ color: '#6b7280' }}>
                Usa el buscador para ver pedidos con otros estados o realiza uno nuevo
              </p>
            </div>
          )}
        </div>

        {/* MODAL REALIZAR PEDIDO */}
        {modalOpen && (
          <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Realizar Nuevo Pedido</h2>
                <button style={styles.btnClose} onClick={() => setModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div style={styles.searchPrendaContainer}>
                <input
                  type="text"
                  placeholder="🔍 Buscar prenda por nombre, marca o modelo..."
                  value={searchPrenda}
                  onChange={(e) => setSearchPrenda(e.target.value)}
                  style={styles.searchPrendaInput}
                />
                <Search style={styles.searchIcon} size={20} />
              </div>

              {searchPrenda.trim() !== "" && (
                <>
                  {prendasFiltradas.length > 0 ? (
                    <div style={styles.prendasGrid}>
                      {prendasFiltradas.map((prenda) => {
                        const imagenUrl = prenda.Prenda_imagen 
                          ? (prenda.Prenda_imagen.startsWith('http') 
                              ? prenda.Prenda_imagen 
                              : `http://localhost:8000${prenda.Prenda_imagen}`)
                          : 'https://via.placeholder.com/160x140?text=Sin+Imagen';
                        
                        return (
                          <div
                            key={prenda.Prenda_ID}
                            style={{
                              ...styles.prendaCard,
                              ...(selectedPrenda?.Prenda_ID === prenda.Prenda_ID ? styles.prendaCardSelected : {})
                            }}
                            onClick={() => setSelectedPrenda(prenda)}
                          >
                            <img
                              src={imagenUrl}
                              alt={prenda.Prenda_nombre}
                              style={styles.prendaImage}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/160x140?text=Sin+Imagen';
                              }}
                            />
                            <div style={styles.prendaInfo}>
                              <div style={styles.prendaNombre}>{prenda.Prenda_nombre}</div>
                              <div style={styles.prendaDetalle}>{prenda.Prenda_marca_nombre || 'Sin marca'}</div>
                              <div style={styles.prendaDetalle}>{prenda.Prenda_modelo_nombre || 'Sin modelo'}</div>
                              <div style={styles.prendaPrecio}>${prenda.Prenda_precio_unitario}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '40px 20px', 
                      color: '#9ca3af',
                      backgroundColor: 'rgba(30,30,30,0.6)',
                      borderRadius: '12px',
                      marginBottom: '24px'
                    }}>
                      <Package size={48} color="#4b5563" style={{ margin: '0 auto 12px' }} />
                      <p style={{ margin: 0 }}>No se encontraron prendas con "{searchPrenda}"</p>
                    </div>
                  )}
                </>
              )}

              {searchPrenda.trim() === "" && !selectedPrenda && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px', 
                  color: '#9ca3af',
                  backgroundColor: 'rgba(30,30,30,0.6)',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: '2px dashed rgba(255,255,255,0.1)'
                }}>
                  <Search size={64} color="#4b5563" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ color: '#d1d5db', marginBottom: '8px', fontSize: '18px' }}>
                    Comienza a buscar una prenda
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    Escribe el nombre, marca o modelo en el buscador
                  </p>
                </div>
              )}

              {selectedPrenda && (
                <div style={styles.formContainer}>
                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Talle</label>
                      <select
                        value={formData.talle}
                        onChange={(e) => setFormData({ ...formData, talle: e.target.value })}
                        style={styles.selectTalle}
                      >
                        <option value="">Seleccionar talle...</option>
                        {tallesDisponibles.map((talle, idx) => (
                          <option key={idx} value={talle}>
                            {talle}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.cantidad}
                        onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Recargo XL (%)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.recargoTalle}
                        onChange={(e) => setFormData({ ...formData, recargoTalle: e.target.value })}
                        style={styles.input}
                      />
                    </div>

                    <button onClick={agregarPrenda} style={styles.addBtn}>
                      <Plus size={18} /> Agregar
                    </button>
                  </div>
                </div>
              )}

              {pedido.length > 0 && (
                <div style={styles.pedidosList}>
                  <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '18px' }}>
                    Prendas en el pedido ({pedido.length})
                  </h3>
                  {pedido.map((p, index) => (
                    <div key={index} style={styles.pedidoCard}>
                      <div style={styles.pedidoInfo}>
                        <div style={styles.pedidoNombre}>{p.Prenda_nombre}</div>
                        <div style={styles.pedidoDetalles}>
                          Talle: {p.talle} | Cantidad: {p.cantidad} | Precio unit: ${p.precioUnitario.toFixed(2)}
                        </div>
                      </div>
                      <div style={styles.pedidoPrecio}>
                        ${(p.precioUnitario * p.cantidad).toFixed(2)}
                      </div>
                      <button onClick={() => eliminarPrendaPedido(index)} style={styles.btnEliminar}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}

                  <div style={{ marginTop: '20px' }}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Porcentaje de Ganancia (%)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.porcentajeGanancia}
                        onChange={(e) => setFormData({ ...formData, porcentajeGanancia: e.target.value })}
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <button onClick={calcularTotales} style={{ ...styles.addBtn, marginTop: '20px', width: '100%' }}>
                    <Package size={18} /> Calcular Totales
                  </button>

                  {resultado && (
                    <div style={styles.resultadoContainer}>
                      <div style={styles.resultadoGrid}>
                        <div style={styles.resultadoItem}>
                          <div style={styles.resultadoLabel}>Subtotal</div>
                          <div style={styles.resultadoValue}>${resultado.subtotal.toFixed(2)}</div>
                        </div>
                        <div style={styles.resultadoItem}>
                          <div style={styles.resultadoLabel}>Ganancia ({formData.porcentajeGanancia}%)</div>
                          <div style={styles.resultadoValue}>${resultado.ganancia.toFixed(2)}</div>
                        </div>
                        <div style={styles.resultadoItem}>
                          <div style={styles.resultadoLabel}>Total Final</div>
                          <div style={styles.resultadoValue}>${resultado.total.toFixed(2)}</div>
                        </div>
                      </div>

                      <button onClick={confirmarPedido} style={styles.btnConfirmar}>
                        <CheckCircle size={20} /> Confirmar Pedido
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL DETALLES DEL PEDIDO */}
        {modalDetallesOpen && pedidoSeleccionado && (
          <div style={styles.modalOverlay} onClick={() => setModalDetallesOpen(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  Detalles del Pedido #{pedidoSeleccionado.Pedido_ID.toString().padStart(3, '0')}
                </h2>
                <button style={styles.btnClose} onClick={() => setModalDetallesOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Usuario que realizó el pedido</div>
                <div style={styles.infoValue}>
                  Usuario #{pedidoSeleccionado.Pedido_usuario_id || pedidoSeleccionado.usuario || 'N/A'}
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(30, 30, 30, 0.6)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                      Estado
                    </div>
                    {(() => {
                      const estado = obtenerEstadoPedido(pedidoSeleccionado);
                      const { texto, estilo } = obtenerEstiloEstado(estado);
                      return (
                        <span style={{ ...styles.estadoBadge, ...estilo }}>
                          {texto}
                        </span>
                      );
                    })()}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                      Fecha
                    </div>
                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>
                      {pedidoSeleccionado.Pedido_fecha 
                        ? new Date(pedidoSeleccionado.Pedido_fecha).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                      Total de Items
                    </div>
                    <div style={{ color: '#ffd70f', fontSize: '20px', fontWeight: 'bold' }}>
                      {pedidoSeleccionado.detalles?.reduce((acc, d) => acc + d.cantidad, 0) || 0}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ 
                  color: '#fff', 
                  marginBottom: '16px', 
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Package size={20} />
                  Prendas del Pedido
                </h3>
                
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {pedidoSeleccionado.detalles && pedidoSeleccionado.detalles.length > 0 ? (
                    pedidoSeleccionado.detalles.map((detalle, index) => (
                      <div key={index} style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        padding: '16px',
                        borderRadius: '10px',
                        marginBottom: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '16px',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ 
                            color: '#fff', 
                            fontSize: '16px', 
                            fontWeight: '600',
                            marginBottom: '8px'
                          }}>
                            {detalle.prenda_nombre || 'Prenda sin nombre'}
                          </div>
                          <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                            gap: '12px',
                            fontSize: '13px',
                            color: '#9ca3af'
                          }}>
                            <div>
                              <span style={{ fontWeight: '500' }}>Talle:</span>{' '}
                              <span style={{ color: '#fff' }}>{detalle.talle || '-'}</span>
                            </div>
                            <div>
                              <span style={{ fontWeight: '500' }}>Cantidad:</span>{' '}
                              <span style={{ color: '#fff' }}>{detalle.cantidad}</span>
                            </div>
                            <div>
                              <span style={{ fontWeight: '500' }}>Tipo:</span>{' '}
                              <span style={{ color: '#fff' }}>{detalle.tipo || 'LISA'}</span>
                            </div>
                            {detalle.precio_unitario && (
                              <div>
                                <span style={{ fontWeight: '500' }}>Precio unit:</span>{' '}
                                <span style={{ color: '#ffd70f' }}>
                                  ${parseFloat(detalle.precio_unitario).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {detalle.precio_unitario && (
                          <div style={{
                            textAlign: 'right'
                          }}>
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#9ca3af',
                              marginBottom: '4px'
                            }}>
                              Subtotal
                            </div>
                            <div style={{ 
                              fontSize: '20px', 
                              fontWeight: 'bold',
                              color: '#ffd70f'
                            }}>
                              ${(parseFloat(detalle.precio_unitario) * detalle.cantidad).toFixed(2)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#9ca3af',
                      backgroundColor: 'rgba(30,30,30,0.6)',
                      borderRadius: '12px'
                    }}>
                      <AlertCircle size={48} style={{ margin: '0 auto 12px' }} />
                      <p>No hay detalles disponibles para este pedido</p>
                    </div>
                  )}
                </div>
              </div>

              {pedidoSeleccionado.detalles && pedidoSeleccionado.detalles.some(d => d.precio_unitario) && (
                <div style={{
                  backgroundColor: 'rgba(255, 215, 15, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginTop: '20px',
                  border: '1px solid rgba(255, 215, 15, 0.3)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ color: '#d1d5db', fontSize: '16px', fontWeight: '600' }}>
                      Total del Pedido
                    </div>
                    <div style={{ color: '#ffd70f', fontSize: '28px', fontWeight: 'bold' }}>
                      ${pedidoSeleccionado.detalles
                        .reduce((acc, d) => acc + (parseFloat(d.precio_unitario || 0) * d.cantidad), 0)
                        .toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {alert && (
          <div style={{
            ...styles.alert,
            ...(alert.type === "success" ? styles.alertSuccess : styles.alertError)
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
              {alert.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <div style={{ flex: 1, fontSize: '14px', lineHeight: '1.5' }}>
                {alert.message}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}