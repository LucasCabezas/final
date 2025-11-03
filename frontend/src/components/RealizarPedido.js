import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Package, Plus, Trash2, X, Search, XCircle } from 'lucide-react';
import Componente from "./componente.jsx";
import fondoImg from './assets/fondo.png';
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Usaremos useAuth para obtener el rol/ID

// Componente RealizarPedido (Código antiguo, no se toca)
const RealizarPedido = () => {
    // ... (Tu código de RealizarPedido con Axios)
};

// =================================================================
// 🔥 COMPONENTE PRINCIPAL DE GESTIÓN DE PEDIDOS (PedidosView)
// =================================================================

const styles = {
    // ... (Mantener todos los estilos CSS proporcionados) ...
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
    const { user, loading } = useAuth(); // 🔥 OBTENER USUARIO Y ROL
    
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

    // 🔥 Determinar si el usuario es VENDEDOR
    const isVendedor = user && user.rol === 'Vendedor';

    // 🔥 Función para obtener el estado del pedido
    const obtenerEstadoPedido = (pedido) => {
        // Usamos el campo 'estado' si existe, sino caemos en Pedido_estado
        const estadoRaw = pedido.estado || pedido.Pedido_estado;

        if (typeof estadoRaw === 'string') {
            return estadoRaw.toUpperCase();
        }
        
        // Si es booleano (legacy), mapear
        if (estadoRaw === true) {
            return 'COMPLETADO';
        } else if (estadoRaw === false) {
            return 'PENDIENTE_DUENO'; // Lo tratamos como pendiente de dueño por defecto
        }
        
        return 'PENDIENTE_DUENO';
    };

    // 🔥 Función para obtener texto y estilo del badge
    const obtenerEstiloEstado = (estado) => {
        switch(estado) {
            case 'PENDIENTE_DUENO':
                return { texto: 'Pend. Dueño', estilo: styles.estadoPendiente };
            case 'APROBADO_DUENO':
                return { texto: 'Aprobado - En Costura', estilo: styles.estadoEnProceso };
            case 'PENDIENTE_ESTAMPADO':
                return { texto: 'Pend. Estampado', estilo: styles.estadoEnProceso };
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

    // Cargar prendas (SIN CAMBIOS)
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

    // 🔥 Cargar pedidos, filtrando por el usuario actual si es VENDEDOR
  useEffect(() => {
  if (loading || !user) return; // Esperar a que el usuario cargue

  const fetchPedidos = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/pedidos/");

      if (!res.ok) {
        console.error("❌ Error en la respuesta:", res.status, res.statusText);
        showAlert("Error al cargar pedidos", "error");
        return;
      }

      const data = await res.json();

      // 🧩 Normalizar detalles antes de filtrar
      const pedidosNormalizados = data.map((pedido) => ({
        ...pedido,
        detalles: pedido.detalles.map((d) => ({
          ...d,
          // 🧠 Si el talle vino como número, mostrar "-"
          // Si vino como string (ej. "XL"), mantenerlo
          talle:
            typeof d.talle === "number"
              ? "-"
              : d.talle?.toUpperCase() || "-",
          // Asegurar que tipo esté capitalizado correctamente
          tipo:
            typeof d.tipo === "string"
              ? d.tipo.charAt(0).toUpperCase() + d.tipo.slice(1).toLowerCase()
              : d.tipo,
        })),
      }));

      // 👇 Usar los normalizados, no los sin procesar
      let pedidosFiltrados = pedidosNormalizados;

      // 🔥 FILTRO POR ROL: Si es vendedor, solo ve sus pedidos
      if (isVendedor) {
        pedidosFiltrados = pedidosFiltrados.filter(
          (p) => p.usuario === user.id || p.Pedido_usuario_id === user.id
        );
      } else {
        // Para otros roles, mostrar solo pendientes de dueño por defecto
        pedidosFiltrados = pedidosFiltrados.filter((p) => {
          const estado = obtenerEstadoPedido(p);
          return estado === "PENDIENTE_DUENO" || estado === "PENDIENTE";
        });
      }

      // 💾 Guardar pedidos ya normalizados
      setPedidosFiltrados(pedidosFiltrados);
    } catch (err) {
      console.error("❌ Error al cargar pedidos:", err);
      showAlert("Error al cargar pedidos", "error");
    }
  };

  fetchPedidos();
}, [user, loading, isVendedor]);


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

        // 🔥 Lógica de costos: solo se aplica si NO es vendedor
        let precioFinal = prendaBase.Prenda_precio_unitario;

        if (!isVendedor) {
            const recargo = formData.talle.toUpperCase().includes("XL") ? formData.recargoTalle / 100 : 0;
            const precioBase = prendaBase.Prenda_precio_unitario;
            precioFinal = precioBase * (1 + recargo);
        }


        const nueva = {
            ...prendaBase,
            cantidad: parseInt(formData.cantidad),
            talle: formData.talle,
            precioUnitario: selectedPrenda.Prenda_costo_total_produccion || selectedPrenda.Prenda_precio_unitario || 0,// Usamos precio base si es vendedor, o el precio final si no lo es
        };

        setPedido([...pedido, nueva]);
        setSelectedPrenda(null);
        setFormData({ ...formData, cantidad: 1, talle: "" });
    };

    const eliminarPrendaPedido = (index) => {
        setPedido(pedido.filter((_, i) => i !== index));
    };

    // 🔥 Función de cálculo: solo visible/útil si NO es vendedor
    const calcularTotales = () => {
  try {
    if (!pedido || pedido.length === 0) {
      showAlert("No hay prendas en el pedido", "error");
      return;
    }

    // 🧮 1️⃣ Calcular subtotal usando costo_total_produccion
    const subtotal = pedido.reduce((acc, p) => {
      const precioBase =
        p.Prenda_costo_total_produccion || p.precioUnitario || 0;
      return acc + precioBase * Number(p.cantidad);
    }, 0);

    // 🧮 2️⃣ Calcular ganancia
    const porcentaje = Number(formData.porcentajeGanancia) || 0;
    const ganancia = (subtotal * porcentaje) / 100;

    // 🧮 3️⃣ Calcular total final
    const total = subtotal + ganancia;

    // 💾 Guardar resultados en el estado
    setResultado({ subtotal, ganancia, total });

    // 🎉 Notificación
    showAlert("Totales calculados correctamente", "success");
  } catch (error) {
    console.error("Error al calcular totales:", error);
    showAlert("Error al calcular totales", "error");
  }
};

// ==========================
// 🧠 Verificación de stock
// ==========================
const verificarStockAntesDeConfirmar = async () => {
  try {
    const prendasConCantidades = pedido.map(p => ({
      id_prenda: p.Prenda_ID,
      cantidad: p.cantidad
    }));

    const res = await fetch("http://localhost:8000/api/inventario/verificar-stock/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prendas: prendasConCantidades })
    });

    const data = await res.json();

    if (!res.ok || data.insumos_insuficientes?.length > 0) {
      const mensajes = data.insumos_insuficientes
        .map(i => `• ${i.nombre}: faltan ${i.faltante} ${i.unidad}`)
        .join("\n");
      showAlert(`❌ Stock insuficiente:\n\n${mensajes}`, "error");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verificando stock:", error);
    showAlert("Error al verificar stock con el servidor", "error");
    return false;
  }
};

// ==========================
// ✅ Confirmar Pedido
// ==========================
const confirmarPedido = async () => {
  if (loading || !user || !user.id) {
    showAlert("Error: Usuario no autenticado o no cargado.", "error");
    return;
  }

  // 🧠 Verificar stock antes de enviar el pedido
  const stockOk = await verificarStockAntesDeConfirmar();
  if (!stockOk) return; // 🚫 Si no hay stock, no continúa

  try {
    const data = {
      usuario: user.id,
      estado: "PENDIENTE_DUENO",
      prendas: pedido.map(p => ({
        id_prenda: p.Prenda_ID,
        cantidad: p.cantidad,
        talle: p.talle,
        tipo: "LISA"
      }))
    };

    if (!isVendedor) {
      data.porcentaje_ganancia = formData.porcentajeGanancia;
    }

    const res = await fetch("http://localhost:8000/api/pedidos/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const responseData = await res.json();

    if (!res.ok) {
      if (responseData.tipo === "stock_insuficiente") {
        const detallesHTML = responseData.mensajes.join('\n');
        showAlert(`❌ Stock insuficiente:\n\n${detallesHTML}`, "error");
      } else if (responseData.tipo === "sin_prendas") {
        showAlert("⚠️ No se enviaron prendas en el pedido", "error");
      } else if (responseData.tipo === "prenda_no_encontrada") {
        showAlert(`⚠️ ${responseData.error}`, "error");
      } else {
        showAlert(`❌ Error: ${responseData.error || 'Error al realizar pedido'}`, "error");
      }
      return;
    }

    showAlert("✅ Pedido realizado correctamente y enviado para aprobación", "success");

    // 🔄 Recargar pedidos, limpiar estados, cerrar modal
    const resPedidos = await fetch("http://localhost:8000/api/pedidos/");
    const dataPedidos = await resPedidos.json();
    setPedidosFiltrados(dataPedidos);
    setPedido([]);
    setResultado(null);
    setModalOpen(false);

  } catch (err) {
    console.error("Error al confirmar pedido:", err);
    showAlert("❌ Error al conectar con el servidor", "error");
  }
};


    // Búsqueda con los 4 estados, limitada por usuario si es VENDEDOR
    const buscarPedidos = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/pedidos/");
            const data = await res.json();
            
            let filtrados = data;

            // 🔥 FILTRO POR ROL: Si es vendedor, solo busca en sus pedidos
            if (isVendedor) {
                filtrados = filtrados.filter(p => 
                    p.usuario === user.id || p.Pedido_usuario_id === user.id
                );
            }
            
            // Filtrar por ID (aplica a todos)
            if (filtros.id && filtros.id.trim() !== "") {
                filtrados = filtrados.filter(p => 
                    p.Pedido_ID.toString().includes(filtros.id.trim())
                );
            }

            // Filtra por estado (aplica a todos)
            if (filtros.estado && filtros.estado !== "") {
                filtrados = filtrados.filter(p => {
                    const estado = obtenerEstadoPedido(p);
                    return estado === filtros.estado;
                });
            } else if (!isVendedor) {
                // Si no se especifica estado y NO es vendedor, mostrar solo pendientes de dueño
                filtrados = filtrados.filter(p => {
                    const estado = obtenerEstadoPedido(p);
                    return estado === 'PENDIENTE_DUENO' || estado === 'PENDIENTE';
                });
            }
            // Si es vendedor y no selecciona estado, se muestran todos sus pedidos.

            // Filtrar por fecha (aplica a todos)
            if (filtros.fecha && filtros.fecha !== "") {
                filtrados = filtrados.filter(p => {
                    if (!p.Pedido_fecha) return false;
                    const fechaPedido = p.Pedido_fecha.split('T')[0];
                    return fechaPedido === filtros.fecha;
                });
            }

            setPedidosFiltrados(filtrados);
            if (filtrados.length === 0) {
                showAlert("No se encontraron pedidos con los filtros aplicados", "error");
            }
        } catch (err) {
            console.error("Error en buscarPedidos:", err);
            showAlert("Error al buscar pedidos", "error");
        }
    };

    // Limpiar filtros y recargar por defecto según el rol
    const limpiarFiltros = async () => {
        setFiltros({ id: "", estado: "", fecha: "" });
        try {
            const res = await fetch("http://localhost:8000/api/pedidos/");
            const data = await res.json();
            
            let pedidosRecargados = data;
            
            if (isVendedor) {
                pedidosRecargados = pedidosRecargados.filter(p => 
                    p.usuario === user.id || p.Pedido_usuario_id === user.id
                );
                showAlert("Filtros limpiados - Mostrando todos tus pedidos", "success");
            } else {
                pedidosRecargados = pedidosRecargados.filter(p => {
                    const estado = obtenerEstadoPedido(p);
                    return estado === 'PENDIENTE_DUENO';
                });
                showAlert("Filtros limpiados - Mostrando pedidos pendientes de Dueño", "success");
            }
            
            setPedidosFiltrados(pedidosRecargados);

        } catch (err) {
            showAlert("Error al limpiar filtros", "error");
        }
    };

    // Cancelar pedido (cambiar estado a CANCELADO) (SIN CAMBIOS)
    const cancelarPedido = async (id) => {
        if (!window.confirm("¿Estás seguro de cancelar este pedido?")) return;
        
        try {
            const res = await fetch(`http://localhost:8000/api/pedidos/${id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: "CANCELADO" })
            });

            if (res.ok) {
                showAlert("✅ Pedido cancelado correctamente", "success");
                
                // Recargar pedidos después de la cancelación
                const resPedidos = await fetch("http://localhost:8000/api/pedidos/");
                const dataPedidos = await resPedidos.json();
                
                let pedidosActualizados;
                if (isVendedor) {
                    pedidosActualizados = dataPedidos.filter(p => 
                        p.usuario === user.id || p.Pedido_usuario_id === user.id
                    );
                } else {
                    pedidosActualizados = dataPedidos.filter(p => {
                        const estado = obtenerEstadoPedido(p);
                        return estado === 'PENDIENTE_DUENO';
                    });
                }
                setPedidosFiltrados(pedidosActualizados);
            } else {
                const errorData = await res.json();
                showAlert(`❌ Error al cancelar pedido: ${errorData.error || 'Error desconocido'}`, "error");
            }
        } catch (err) {
            console.error("❌ Error al cancelar el pedido:", err);
            showAlert("❌ Error al conectar con el servidor", "error");
        }
    };
    // 🔥 Actualizar estado del pedido (Dueño / Costura / Estampado)
    const actualizarEstadoPedido = async (id, nuevoEstado) => {
    try {
        const res = await fetch(`http://localhost:8000/api/pedidos/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
        });

        const data = await res.json();

        if (!res.ok) {
        showAlert(`❌ Error al actualizar estado: ${data.error || "Error desconocido"}`, "error");
        return;
        }

        showAlert(`✅ Estado actualizado a "${nuevoEstado.replace("_", " ")}"`, "success");

        // 🔄 Refrescar lista de pedidos
        const resPedidos = await fetch("http://localhost:8000/api/pedidos/");
        const pedidosActualizados = await resPedidos.json();
        setPedidosFiltrados(pedidosActualizados);

    } catch (err) {
        console.error("❌ Error al actualizar estado:", err);
        showAlert("Error al conectar con el servidor", "error");
    }
    };

    // Ver detalles (SIN CAMBIOS)
    const verDetallesPedido = async (pedido) => {
        try {
            const res = await fetch(`http://localhost:8000/api/pedidos/${pedido.Pedido_ID}/`);
            
            if (!res.ok) {
                console.error("❌ Error al cargar detalles:", res.status);
                showAlert("❌ Error al cargar detalles del pedido", "error");
                return;
            }
            
            const data = await res.json();
            
            setPedidoSeleccionado(data);
            setModalDetallesOpen(true);
        } catch (err) {
            console.error("❌ Error al cargar detalles del pedido:", err);
            showAlert("❌ Error al cargar detalles del pedido", "error");
        }
    };

    const tallesDisponibles = selectedPrenda 
        ? (selectedPrenda.talles || [])
        : [];

    if (loading) {
        return <div style={{ color: 'white', padding: '50px' }}>Cargando usuario y permisos...</div>;
    }
    
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
                {/* ... (Tu JSX para la vista principal, sin cambios estructurales) ... */}
                <div style={styles.contentWrapper}>
                    <div style={styles.header}>
                        <div style={styles.headerLeft}>
                            <h1 style={styles.title}>Pedidos</h1>

                            <p style={styles.subtitle}>
                                Gestión de pedidos - {isVendedor ? 'Mostrando solo tus pedidos' : 'Por defecto se muestran pedidos pendientes'}
                            </p>
                        </div>
                        <button 
                            style={styles.btnRealizarPedido}
                            onClick={() => setModalOpen(true)}
                        >
                            Realizar Pedido
                        </button>
                    </div>

                    {/* 🔥 FILTROS CON ESTADOS */}
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
                            <option value="">
                                {isVendedor ? 'Todos mis pedidos' : 'Solo Pendientes'}
                            </option>
                            <option value="PENDIENTE_DUENO">Pendiente Dueño</option>
                            <option value="APROBADO_DUENO">En Costura</option>
                            <option value="PENDIENTE_ESTAMPADO">Pendiente Estampado</option>
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
                                        // Solo el vendedor puede cancelar un pedido que él hizo y que esté pendiente de Dueño
                                        const puedeCancelar = (isVendedor && (p.usuario === user.id || p.Pedido_usuario_id === user.id) && estado === 'PENDIENTE_DUENO') || (!isVendedor && (estado === 'PENDIENTE_DUENO' || estado === 'APROBADO_DUENO'));
                                        
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
                                                {/* 🔹 BOTÓN DE ESTADO (solo visible si no está completado ni cancelado) */}
                                                {estado !== "COMPLETADO" && estado !== "CANCELADO" && (
                                                    <select
                                                    value={estado}
                                                    onChange={(e) => actualizarEstadoPedido(p.Pedido_ID, e.target.value)}
                                                    style={{
                                                        ...styles.select,
                                                        width: "180px",
                                                        padding: "6px 10px",
                                                        backgroundColor: "rgba(0,0,0,0.4)",
                                                        color: "#fff",
                                                        fontSize: "13px",
                                                    }}
                                                    >
                                                    <option value="PENDIENTE_DUENO">Pendiente Dueño</option>
                                                    <option value="APROBADO_DUENO">En Costura</option>
                                                    <option value="PENDIENTE_ESTAMPADO">Pendiente Estampado</option>
                                                    <option value="COMPLETADO">Completado</option>
                                                    <option value="CANCELADO">Cancelado</option>
                                                    </select>
                                                )}

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
                                No hay pedidos 
                            </h3>
                            <p style={{ color: '#6b7280' }}>
                                {isVendedor 
                                    ? 'Aún no has realizado ningún pedido. Usa el botón "Realizar Pedido".'
                                    : 'Usa el buscador para ver pedidos con otros estados o realiza uno nuevo.'
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* MODAL REALIZAR PEDIDO (JSX sin cambios estructurales, solo condicionales) */}
                {modalOpen && (
                    <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
                        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div style={styles.modalHeader}>
                                <h2 style={styles.modalTitle}>Realizar Nuevo Pedido</h2>
                                <button style={styles.btnClose} onClick={() => setModalOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                            
                            {/* Búsqueda y Grid de Prendas (Sin cambios) */}
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
                                    {/* ... (JSX del grid de prendas, sin cambios) ... */}
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
                                                            <div style={styles.prendaPrecio}>${prenda.Prenda_costo_total_produccion}</div>
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

                                        {/* 🔥 OCULTAR RECARGO XL SI ES VENDEDOR */}
                                        {!isVendedor && (
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
                                        )}

                                        <button onClick={agregarPrenda} style={{...styles.addBtn, gridColumn: isVendedor ? 'span 1' : 'auto'}}>
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
                                                    Talle: {p.talle} | Cantidad: {p.cantidad} 
                                                    {!isVendedor && ` | Precio unit: $${p.precioUnitario.toFixed(2)}`}
                                                </div>
                                            </div>
                                            
                                            {/* Si no es vendedor, mostramos el precio total */}
                                            {!isVendedor && (
                                                <div style={styles.pedidoPrecio}>
                                                    ${(p.precioUnitario * p.cantidad).toFixed(2)}
                                                </div>
                                            )}
                                            
                                            <button onClick={() => eliminarPrendaPedido(index)} style={styles.btnEliminar}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* 🔥 OCULTAR PORCENTAJE DE GANANCIA SI ES VENDEDOR */}
                                    {!isVendedor && (
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
                                    )}

                                    {/* 🔥 OCULTAR BOTÓN CALCULAR TOTALES SI ES VENDEDOR */}
                                    {!isVendedor && (
                                        <button onClick={calcularTotales} style={{ ...styles.addBtn, marginTop: '20px', width: '100%' }}>
                                            <Package size={18} /> Calcular Totales
                                        </button>
                                    )}

                                    {/* 🔥 OCULTAR RESULTADO Y CONFIRMAR SOLO SI ES VENDEDOR Y NO SE CALCULARON TOTALES */}
                                    {(!isVendedor && resultado) || isVendedor ? (
                                        <div style={styles.resultadoContainer}>
                                            {!isVendedor && resultado && (
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
                                            )}
                                            
                                            {/* Si es vendedor, el botón de confirmar aparece inmediatamente (asumiendo que los cálculos los hace el backend) */}
                                            {(!isVendedor && resultado) || isVendedor ? (
                                                <button onClick={confirmarPedido} style={styles.btnConfirmar}>
                                                    <CheckCircle size={20} /> Confirmar Pedido
                                                </button>
                                            ) : (
                                                <p style={{ color: '#9ca3af', textAlign: 'center' }}>
                                                    Calcula los totales para confirmar el pedido.
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        // Mensaje para el vendedor que no necesita calcular totales
                                        isVendedor && (
                                            <div style={styles.resultadoContainer}>
                                                <p style={{ color: '#d1d5db', textAlign: 'center', marginBottom: '16px' }}>
                                                    El precio final se calculará automáticamente en el sistema central.
                                                </p>
                                                <button onClick={confirmarPedido} style={styles.btnConfirmar}>
                                                    <CheckCircle size={20} /> Confirmar Pedido
                                                </button>
                                            </div>
                                        )
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
      {/* CABECERA */}
      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>
          Detalles del Pedido #{pedidoSeleccionado.Pedido_ID.toString().padStart(3, "0")}
        </h2>
        <button style={styles.btnClose} onClick={() => setModalDetallesOpen(false)}>
          <X size={24} />
        </button>
      </div>

      {/* DATOS DEL USUARIO */}
      <div style={styles.infoBox}>
        <div style={styles.infoLabel}>Usuario que realizó el pedido</div>
        <div style={styles.infoValue}>{pedidoSeleccionado.usuario || "Dueño"}</div>
      </div>

      {/* INFO GENERAL */}
      <div
        style={{
          backgroundColor: "rgba(30, 30, 30, 0.6)",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Estado</div>
            {(() => {
              const estado = obtenerEstadoPedido(pedidoSeleccionado);
              const { texto, estilo } = obtenerEstiloEstado(estado);
              return <span style={{ ...styles.estadoBadge, ...estilo }}>{texto}</span>;
            })()}
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>Fecha</div>
            <div style={{ color: "#fff", fontSize: "16px", fontWeight: "600" }}>
              {pedidoSeleccionado.Pedido_fecha
                ? new Date(pedidoSeleccionado.Pedido_fecha).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>
              Total de Items
            </div>
            <div style={{ color: "#ffd70f", fontSize: "20px", fontWeight: "bold" }}>
              {pedidoSeleccionado.detalles?.reduce((acc, d) => acc + d.cantidad, 0) || 0}
            </div>
          </div>
        </div>
      </div>

      {/* PRENDAS DEL PEDIDO */}
      <h3
        style={{
          color: "#fff",
          marginBottom: "16px",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Package size={20} />
        Prendas del Pedido
      </h3>

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {pedidoSeleccionado.detalles && pedidoSeleccionado.detalles.length > 0 ? (
          pedidoSeleccionado.detalles.map((detalle, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              {/* 🖼️ Miniatura */}
              <img
                src={
                  detalle.prenda_imagen
                    ? detalle.prenda_imagen.startsWith("http")
                      ? detalle.prenda_imagen
                      : `http://localhost:8000${detalle.prenda_imagen}`
                    : "https://via.placeholder.com/100x100?text=Sin+Imagen"
                }
                alt={detalle.prenda_nombre}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/100x100?text=Sin+Imagen";
                }}
              />

              {/* 🧾 Info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  {detalle.prenda_nombre}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                    gap: "8px",
                    fontSize: "13px",
                    color: "#9ca3af",
                  }}
                >
                  <div>Marca: {detalle.prenda_marca || "-"}</div>
                    <div>Modelo: {detalle.prenda_modelo || "-"}</div>
                    <div>Color: {detalle.prenda_color || "-"}</div>
                    <div>Talle: {detalle.talle || "-"}</div>
                    <div>Cantidad: {detalle.cantidad}</div>
            
                </div>
              </div>

             
              {/* 💰 Precio */}
                {detalle.precio_total !== undefined && (
                <div style={{ textAlign: "right", minWidth: "80px" }}>
                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>Subtotal</div>
                    <div
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#ffd70f",
                        marginTop: "4px",
                    }}
                    >
                    ${parseFloat(detalle.precio_total || 0).toFixed(2)}
                    </div>
                </div>
                )}

              
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#9ca3af",
              backgroundColor: "rgba(30,30,30,0.6)",
              borderRadius: "12px",
            }}
          >
            <AlertCircle size={48} style={{ margin: "0 auto 12px" }} />
            <p>No hay detalles disponibles para este pedido</p>
          </div>
        )}
      </div>

      {/* 🔹 TOTAL FINAL */}
      {pedidoSeleccionado.detalles &&
        pedidoSeleccionado.detalles.some((d) => d.precio_unitario) && (
          <div
            style={{
              backgroundColor: "rgba(255, 215, 15, 0.1)",
              borderRadius: "12px",
              padding: "20px",
              marginTop: "20px",
              border: "1px solid rgba(255, 215, 15, 0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ color: "#d1d5db", fontSize: "16px", fontWeight: "600" }}>
                Total del Pedido
              </div>
              <div style={{ color: "#ffd70f", fontSize: "28px", fontWeight: "bold" }}>
                $
                {pedidoSeleccionado.detalles
                  .reduce(
                    (acc, d) =>
                      acc + parseFloat(d.precio_total || 0),

                    0
                  )
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
