import React, { useEffect, useContext, useState } from 'react'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import TextareaComponent from '../TextareaComponent/TextareaComponent'
import InputComponent from '../InputComponent/InputComponent'
import InputComponentView from '../InputComponent/InputComponentView'
import Alert from '../Alert/Alert'
import Modal from '../Modal/ModalNotification'
import CajaContext from '../../context/CajaContext/CajaContext'
import { listUsers } from '../../Api/Api'

const FlujoCajaDetalleMovimientoForm = (props) => {
    const { isOpen, onClose, tiposMovimientos=[], setMovimientos, movimientos=[] } = props;
    const { movimientoSeleccionado, setMovimientoSeleccionado } = useContext(CajaContext);
    const [correlativo, setCorrelativo] = useState("");
    const [tipoMovimiento, setTipoMovimiento] = useState("");
    const [flagUsuario, setFlagUsuario] = useState("S");
    const [usuarioMov, setUsuarioMov] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [montoxMov, setMontoxMov] = useState({value:""});
    const [usuarios, setUsuarios] = useState([]);
    const [notification, setNotification]= useState({title:"Hubo un problema", type:"alert-danger", message:"Favor de llenar los campos con valores válidos"});
    const [isAlert, setIsAlert] = useState(false);

    const handleClose = () => {
        onClose();
        setIsAlert(false);
        setMovimientoSeleccionado({general:{}});
    }

    const validateData = () => {
        if(tipoMovimiento && observaciones && montoxMov.value) return true;
        return false;
    }

    const validateUser = () => {
        return flagUsuario === "S" ? usuarioMov : true;
    }

    const handleAddMovimiento = () => {
        if(validateData()) {
            if(validateUser()) {
                //movimientos
                const movimiento = {
                    ...movimientoSeleccionado.general,
                    c_tipomovimientocc: tipoMovimiento,
                    c_usuariomovimiento: usuarioMov,
                    c_observaciones: observaciones,
                    n_montoxdiamov: montoxMov.value,
                }
                setMovimientos([...movimientos, movimiento]);
                handleClose();
            } else {
                setNotification({title:"Hubo un problema", type:"alert-danger", message:"El usuario es obligatorio para este tipo"});
                setIsAlert(true);
            }
        } else {
            setNotification({title:"Hubo un problema", type:"alert-danger", message:"Favor de llenar los campos con valores válidos"});
            setIsAlert(true);
        }
    }

    const handleUpdateMovimiento = () => {
        if(validateData()) {
            if(validateUser()) {
                const movimientosAux = [...movimientos];
                //movimientos
                const movimiento = {
                    ...movimientoSeleccionado.general,
                    c_tipomovimientocc: tipoMovimiento,
                    c_usuariomovimiento: usuarioMov,
                    c_observaciones: observaciones,
                    n_montoxdiamov: montoxMov.value,
                }
                movimientosAux[Number(movimientoSeleccionado.general.key)-1] = movimiento;
                setMovimientos(movimientosAux);
                handleClose();
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

    const getData = () => {
        console.log("Hola", movimientoSeleccionado);
        setCorrelativo(movimientoSeleccionado.general.key);
        if(movimientoSeleccionado.action !=="ADD") {
            setTipoMovimiento(movimientoSeleccionado.general.c_tipomovimientocc);
            setMontoxMov({value:movimientoSeleccionado.general.n_montoxdiamov});
            setUsuarioMov(movimientoSeleccionado.general.c_usuariomovimiento);
            setObservaciones(movimientoSeleccionado.general.c_observaciones);
        }
    }

    const handleSelectTipo = (value) => {
        setTipoMovimiento(value);
        setFlagUsuario(tiposMovimientos.find(item => item.c_tipomovimientocc === value).c_flagusuario);
    }

    useEffect(() => {
        getData();
    }, [movimientoSeleccionado])

    useEffect(async () => {
        await getUsuarios();
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
                    handleElementSelected={handleSelectTipo}
                    classForm="col-12 col-lg-6"
                    disabledElement={movimientoSeleccionado.general.c_prestamo ? true : false}
                />
                <InputComponent
                    label="Monto x Mov."
                    state={montoxMov}
                    setState={setMontoxMov}
                    type="number"
                    placeholder="Monto x Movimiento"
                    inputId="montoxValorId"
                    classForm="col-12 col-lg-6"
                    readOnly={movimientoSeleccionado.general.c_prestamo ? true : false}
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
                    disabledElement={movimientoSeleccionado.general.c_prestamo ? true : false}
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