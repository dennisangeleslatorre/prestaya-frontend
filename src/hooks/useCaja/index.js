import { useState } from "react";

const useCaja = () => {
    const [flujoCaja, setFlujoCaja] = useState({general:{}, firstArrival:true});
    const [detalles, setDetalles] = useState([]);
    const [detalleSeleccionado, setDetalleSeleccionado] = useState({general:{}, movimientos:[]});
    const [movimientoSeleccionado, setMovimientoSeleccionado] = useState({general:{}, action:"NEW"});
    const [auditoria, setAuditoria] = useState({
        c_usuarioregistro: "",
        d_fecharegistro: "",
        c_ultimousuario: "",
        d_ultimafechamodificacion: ""
    });
    const [eliminarDetalles, setEliminarDetalles] = useState([]);
    const [eliminarMovimientos, setEliminarMovimientos] = useState([]);

    return {
        flujoCaja, setFlujoCaja, detalleSeleccionado, setDetalleSeleccionado, movimientoSeleccionado, setMovimientoSeleccionado,
        detalles, setDetalles, auditoria, setAuditoria, eliminarDetalles, setEliminarDetalles, eliminarMovimientos, setEliminarMovimientos
    }
}

export default useCaja;