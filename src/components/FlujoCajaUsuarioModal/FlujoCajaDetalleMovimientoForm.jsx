import React, { useEffect, useContext, useState } from 'react'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import TextareaComponent from '../TextareaComponent/TextareaComponent'
import InputComponent from '../InputComponent/InputComponent'
import InputComponentView from '../InputComponent/InputComponentView'
import Alert from '../Alert/Alert'
import Modal from '../Modal/ModalNotification'
import CajaContext from '../../context/CajaContext/CajaContext'
import PagesContext from '../../context/PagesContext/PagesContext'
import { listAgencias, listUsers, getCajaUsuarioByAgenciaAndUsuario } from '../../Api/Api'

const FlujoCajaDetalleMovimientoForm = (props) => {
    const { isOpen, onClose, tiposMovimientos=[], setMovimientos, movimientos=[], compania, tipoCaja, agenciaCaja } = props;
    const { movimientoSeleccionado, setMovimientoSeleccionado } = useContext(CajaContext);
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "USUARIO PUEDE REALIZAR INGRESOS CAJA" || item === "USUARIO PUEDE REALIZAR SALIDAS CAJA" || item === "USUARIO ACCESO TOTAL CAJA"
    });
    const realizaIngresosPermiso = userPermisssions.includes("USUARIO PUEDE REALIZAR INGRESOS CAJA");
    const realizaSalidasPermiso = userPermisssions.includes("USUARIO PUEDE REALIZAR SALIDAS CAJA");
    const usuarioAccesoTotalCajaPermiso = userPermisssions.includes("USUARIO ACCESO TOTAL CAJA");
    const [correlativo, setCorrelativo] = useState("");
    const [tipoMovimiento, setTipoMovimiento] = useState("");
    const [flagUsuario, setFlagUsuario] = useState("S");
    const [flagAgencia, setFlagAgencia] = useState("N");
    const [usuarioMov, setUsuarioMov] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [montoxMov, setMontoxMov] = useState({value:"0.0"});
    const [esPermitido, setEsPermitido] = useState(false);
    const [flagConfirmar, setFlagConfirmar] = useState("");
    const [otraAgencia, setOtraAgencia] = useState("");
    const [flagSinMonto, setFlagSinMonto] = useState("");
    const [flagListaAdmin, setFlagListaAdmin] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [notification, setNotification]= useState({title:"Hubo un problema", type:"alert-danger", message:"Favor de llenar los campos con valores válidos"});
    const [isAlert, setIsAlert] = useState(false);

    const handleClose = () => {
        onClose();
        setIsAlert(false);
        setMovimientoSeleccionado({general:{}});
    }

    const validateData = () => {
        if(tipoMovimiento && observaciones) return true;
        return false;
    }

    const validateUser = () => {
        return flagUsuario === "S" ? usuarioMov : true;
    }

    const validateOtherAgency = async () => {
        if(flagAgencia === "S") {
            const body = {
                c_compania: compania,
                c_agencia: otraAgencia,
                c_usuariofcu: usuarioMov
            }
            const responseValidate = await getCajaUsuarioByAgenciaAndUsuario(body);
            if(responseValidate && responseValidate.status === 200 && responseValidate.body && responseValidate.body.data?.length > 0) {
                return true;
            }
            return false;
        }
        return true;
    }

    const validateFlagListaAdmin = () => {
        console.log("usuarioAccesoTotalCajaPermiso", usuarioAccesoTotalCajaPermiso);
        console.log("flagListaAdmin", flagListaAdmin);
        if(flagListaAdmin === "N") return true;
        else if(flagListaAdmin === "S" && usuarioAccesoTotalCajaPermiso) return true;
        return false;
    }

    const validateFlagAgencia = () => {
        if(flagAgencia === "N" && otraAgencia) {
            return "El movimiento no requiere agencia";
        } else if(flagAgencia === "S" && !otraAgencia) {
            return "El movimiento rquiere agencia";
        } else if(flagAgencia === "S" && otraAgencia && tipoCaja !== "B") {
            return "La agencia de origen debe ser de tipo bóveda";
        }
        return "OK";
    }

    const validateMonto = () => {
        if(flagSinMonto === "N") {
            console.log(montoxMov.value);
            if(!isNaN(montoxMov.value) && Number(montoxMov.value) > 0) {
                return "OK";
            }
            return "El valor del monto debe ser mayor a 0";
        } else {
            if(Number(montoxMov.value) === 0.00) {
                return "OK";
            }
            return "El valor del monto debe ser 0";
        }
    }

    const handleAddMovimiento = async () => {
        if(validateData()) {
            if(validateUser()) {
                if(validateFlagListaAdmin()) {
                    const messageValidateFlagAgencia = validateFlagAgencia();
                    if(messageValidateFlagAgencia === "OK") {
                        if( await validateOtherAgency()) {
                            const messageValidate = validateMonto();
                            if(messageValidate === "OK") {
                                if(esPermitido) {
                                    //movimientos
                                    const movimiento = {
                                        ...movimientoSeleccionado.general,
                                        c_tipomovimientocc: tipoMovimiento,
                                        c_usuariomovimiento: usuarioMov,
                                        c_observaciones: observaciones,
                                        n_montoxdiamov: montoxMov.value ? montoxMov.value : 0.00,
                                        c_flagxconfirmar: flagConfirmar,
                                        c_agenciaotra: otraAgencia
                                    }
                                    setMovimientos([...movimientos, movimiento]);
                                    handleClose();
                                } else {
                                    setNotification({title:"Hubo un problema", type:"alert-danger", message:"El usuario no tiene permisos para realizar esta clase de movimientos."});
                                    setIsAlert(true);
                                }
                            } else {
                                setNotification({title:"Hubo un problema", type:"alert-danger", message:messageValidate});
                                setIsAlert(true);
                            }
                        } else {
                            setNotification({title:"Hubo un problema", type:"alert-danger", message:"No se encontró una caja de tipo bóveda para la combinación de usuario, agencia y compañía que este activa"});
                            setIsAlert(true);
                        }
                    } else {
                        setNotification({title:"Hubo un problema", type:"alert-danger", message:messageValidateFlagAgencia});
                        setIsAlert(true);
                    }
                } else {
                    setNotification({title:"Hubo un problema", type:"alert-danger", message:"El usuario necesita un permiso de administrador para realizar la operación"});
                    setIsAlert(true);
                }
            } else {
                setNotification({title:"Hubo un problema", type:"alert-danger", message:"El usuario es obligatorio para este tipo"});
                setIsAlert(true);
            }
        } else {
            setNotification({title:"Hubo un problema", type:"alert-danger", message:"Favor de llenar los campos con valores válidos"});
            setIsAlert(true);
        }
    }

    const handleUpdateMovimiento = async () => {
        if(validateData()) {
            if(validateUser()) {
                if(validateFlagListaAdmin()) {
                    const messageValidateFlagAgencia = validateFlagAgencia();
                    if(messageValidateFlagAgencia === "OK") {
                        if( await validateOtherAgency()) {
                            const messageValidate = validateMonto();
                            if(messageValidate === "OK") {
                                if(esPermitido) {
                                    const movimientosAux = [...movimientos];
                                    //movimientos
                                    const movimiento = {
                                        ...movimientoSeleccionado.general,
                                        c_tipomovimientocc: tipoMovimiento,
                                        c_usuariomovimiento: usuarioMov,
                                        c_observaciones: observaciones,
                                        n_montoxdiamov: montoxMov.value ? montoxMov.value : 0.00,
                                        c_flagxconfirmar: flagConfirmar,
                                        c_agenciaotra: otraAgencia,
                                        is_updated: true
                                    }
                                    movimientosAux[Number(movimientoSeleccionado.general.key)-1] = movimiento;
                                    setMovimientos(movimientosAux);
                                    handleClose();
                                } else {
                                    setNotification({title:"Hubo un problema", type:"alert-danger", message:"El usuario no tiene permisos para realizar esta clase de movimientos."});
                                    setIsAlert(true);
                                }
                            } else {
                                setNotification({title:"Hubo un problema", type:"alert-danger", message:messageValidate});
                                setIsAlert(true);
                            }
                        } else {
                            setNotification({title:"Hubo un problema", type:"alert-danger", message:"No se encontró una caja de tipo bóveda para la combinación de usuario, agencia y compañía que este activa"});
                            setIsAlert(true);
                        }
                    } else {
                        setNotification({title:"Hubo un problema", type:"alert-danger", message:messageValidateFlagAgencia});
                        setIsAlert(true);
                    }
                } else {
                    setNotification({title:"Hubo un problema", type:"alert-danger", message:"El usuario necesita un permiso de administrador para realizar la operación"});
                    setIsAlert(true);
                }
            } else{
                setNotification({title:"Hubo un problema", type:"alert-danger", message:"El usuario es obligatorio para este tipo"});
                setIsAlert(true);
            }
        } else {
            setNotification({title:"Hubo un problema", type:"alert-danger", message:"Favor de llenar los campos con valores válidos"});
            setIsAlert(true);
        }
    }

    const getUsuarios = async () => {
        const response = await listUsers();
        if(response && response.status === 200) {
            setUsuarios([{c_codigousuario:"", c_nombres:"Seleccionar usuario"}, ...response.body.data]);
        };
    }

    const getAgencia = async () => {
        const response = await listAgencias({c_compania: compania});
        if(response && response.status === 200 && response.body?.data.length > 0) {
            setAgencias([{c_agencia:"", c_descripcion:"Seleccionar agencia"}, ...response.body.data.filter(a => a.c_agencia !== agenciaCaja)]);
        };
    }

    const getData = () => {
        setCorrelativo(movimientoSeleccionado.general.key);
        if(movimientoSeleccionado.action !=="ADD") {
            setTipoMovimiento(movimientoSeleccionado.general.c_tipomovimientocc);
            setMontoxMov({value:movimientoSeleccionado.general.n_montoxdiamov});
            setUsuarioMov(movimientoSeleccionado.general.c_usuariomovimiento);
            setObservaciones(movimientoSeleccionado.general.c_observaciones);
            setOtraAgencia(movimientoSeleccionado.general.c_agenciaotra)
        }
    }

    useEffect(() => {
        if(tipoMovimiento) {
            const tipoMov = tiposMovimientos.find(tipo => tipo.c_tipomovimientocc === tipoMovimiento);
            setFlagConfirmar(tipoMov.c_flagxconfirmar);
            setFlagSinMonto(tipoMov.c_flagsinmonto);
            setFlagUsuario(tipoMov.c_flagusuario);
            setFlagAgencia(tipoMov.c_flagotraagencia);
            setFlagListaAdmin(tipoMov.c_flaglistaadmin);
            if((tipoMov.c_clasetipomov === "I" && realizaIngresosPermiso) || (tipoMov.c_clasetipomov === "S" && realizaSalidasPermiso)) {
                setEsPermitido(true);
            } else
                setEsPermitido(false);
        };
    }, [tipoMovimiento])

    useEffect(() => {
        getData();
    }, [movimientoSeleccionado])

    useEffect(async () => {
        await getUsuarios();
        await getAgencia();
    },[])

    return (
        <Modal isOpen={isOpen}
            title={movimientoSeleccionado.action==="ADD" ? `Agregar Movimiento`: `Actualizar Movimiento`}
            onClose={handleClose} modal_class="Modal__container__form"
        >
            <div className="modal-body row">
                <InputComponentView
                    label="Correlativo"
                    state={correlativo}
                    setState={setCorrelativo}
                    type="text"
                    placeholder="Correlativo"
                    inputId="correlativoId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <ReactSelect
                    labelText="Tipos"
                    defaultValue="Seleccione un tipo"
                    data={tiposMovimientos}
                    inputId="tipoId"
                    valueField="c_tipomovimientocc"
                    optionField="c_descricpion"
                    valueSelected={tipoMovimiento}
                    handleElementSelected={setTipoMovimiento}
                    classForm="col-12 col-lg-6"
                    disabledElement={(movimientoSeleccionado.general.c_prestamo || movimientoSeleccionado.general.c_flagconfirmado === 'S') ? true : false}
                />
                <InputComponent
                    label="Monto x Mov."
                    state={montoxMov}
                    setState={setMontoxMov}
                    type="number"
                    placeholder="Monto x Movimiento"
                    inputId="montoxValorId"
                    classForm="col-12 col-lg-6"
                    readOnly={(movimientoSeleccionado.general.c_prestamo || movimientoSeleccionado.general.c_flagconfirmado === 'S') ? true : false}
                />
                <ReactSelect
                    inputId="usuarioId"
                    labelText="Usuario Mov."
                    placeholder="Seleccione un usuario"
                    valueSelected={usuarioMov}
                    data={usuarios}
                    handleElementSelected={setUsuarioMov}
                    optionField="c_nombres"
                    valueField="c_codigousuario"
                    classForm="col-12 col-lg-6"
                    disabledElement={(movimientoSeleccionado.general.c_prestamo || movimientoSeleccionado.general.c_flagconfirmado === 'S') ? true : false}
                />
                <TextareaComponent
                    inputId="observacionesId"
                    label="Observaciones"
                    placeholder="Observaciones"
                    value={observaciones}
                    setState={setObservaciones}
                    max={500}
                    classForm="col-12"
                    labelSpace={0}
                    labelLine={true}
                    marginForm="mt-0"
                />
                <ReactSelect
                    inputId="otraAgenciaId"
                    labelText="Otra agencia"
                    placeholder="Seleccione una agencia"
                    valueSelected={otraAgencia}
                    data={agencias}
                    handleElementSelected={setOtraAgencia}
                    optionField="c_descripcion"
                    valueField="c_agencia"
                    classForm="col-12 col-lg-6"
                    disabledElement={(movimientoSeleccionado.general.c_prestamo || movimientoSeleccionado.general.c_flagconfirmado === 'S') ? true : false}
                />
            </div>
            {/*Alerta*/}
            { isAlert === true && <Alert
                title={notification.title}
                type={notification.type}
                mainMessage={notification.message}
            /> }
            <div className="modal-footer justify-content-center">
                { movimientoSeleccionado.action==="ADD" ? <button onClick={handleAddMovimiento} className="btn btn-primary">
                    Agregar
                </button> : <button onClick={handleUpdateMovimiento} className="btn btn-warning">
                    Actualizar
                </button>}
            </div>
        </Modal>
    )
}

export default FlujoCajaDetalleMovimientoForm