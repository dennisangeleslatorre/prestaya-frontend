import { useState } from "react";

const useCajaTienda = () => {
  const [flujoCajaTienda, setFlujoCajaTienda] = useState({
    general: {},
    firstArrival: true,
  });
  const [detalles, setDetalles] = useState([]);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState({
    general: {},
    movimientos: [],
  });
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState({
    general: {},
    action: "NEW",
  });
  const [auditoria, setAuditoria] = useState({
    c_usuarioregistro: "",
    d_fecharegistro: "",
    c_ultimousuario: "",
    d_ultimafechamodificacion: "",
  });
  const [eliminarDetalles, setEliminarDetalles] = useState([]);
  const [eliminarMovimientos, setEliminarMovimientos] = useState([]);

  return {
    flujoCajaTienda,
    setFlujoCajaTienda,
    detalleSeleccionado,
    setDetalleSeleccionado,
    movimientoSeleccionado,
    setMovimientoSeleccionado,
    detalles,
    setDetalles,
    auditoria,
    setAuditoria,
    eliminarDetalles,
    setEliminarDetalles,
    eliminarMovimientos,
    setEliminarMovimientos,
  };
};

export default useCajaTienda;
