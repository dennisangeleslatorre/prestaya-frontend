import React, { useEffect, useContext, useState } from 'react'
import Modal from '../Modal/ModalNotification'
import CajaContext from '../../context/CajaContext/CajaContext'
import ReactSelect from '../ReactSelect/ReactSelect';
import InputComponent from '../InputComponent/InputComponent';
import Alert from '../Alert/Alert'
import moment from 'moment'

const FlujoCajaClonarDetalleModal = (props) => {
    const { isOpen, onClose } = props;
    const { flujoCaja, detalleSeleccionado, setDetalleSeleccionado, detalles, setDetalles,
            eliminarDetalles, setEliminarDetalles  } = useContext(CajaContext);
    const [nuevaFecha, setNuevaFecha] = useState({value:"", isValid:false});
    const [borrarDetalle, setBorrarDetalle] = useState("S");
    const [isAlert, setIsAlert] = useState(false);

    const validDate = () => {
        let fechaInicio = moment(flujoCaja.general.d_fechaInicioMov);
        let fechaFin= moment(flujoCaja.general.d_fechaFinMov);
        let fechaMovMoment = moment(nuevaFecha.value);
        return fechaMovMoment.isBetween(fechaInicio, fechaFin, "days", "[]") && moment(detalleSeleccionado.general.d_fechamov) !== moment(nuevaFecha.value);
    }

    const findFechaRepetida = () => {
        return detalles.find(item => item.general.d_fechamov === nuevaFecha.value);
    }

    const handleClose = () => {
        onClose();
        setDetalleSeleccionado({general:{}, movimientos:[]});
        setIsAlert(false);
        setNuevaFecha({value:"", isValid:false });
    }

    const prepareDetalle = () => {
        let movimientos = JSON.parse(JSON.stringify(detalleSeleccionado.movimientos));
        return {
            general: {
                ...detalleSeleccionado.general,
                d_fechamov:nuevaFecha.value,
                c_usuarioregistro: "",
                d_fecharegistro: "",
                c_ultimousuario: "",
                d_ultimafechamodificacion: "",
            }, movimientos:movimientos.map(item => {
                item.d_fechamov = nuevaFecha.value;
                item.c_usuarioregistro = null;
                item.d_fecharegistro = null;
                return item;
            })
        }
    }

    const handleClonar = () => {
        if(validDate() && !findFechaRepetida()) {
            let nuevoDetalle = prepareDetalle();
            let detallesAux = JSON.parse(JSON.stringify(detalles));
            if(borrarDetalle === "S") {
                detallesAux = detallesAux.filter((item) => {
                    if(item.general.d_fechamov !== detalleSeleccionado.general.d_fechamov) {
                        return item;
                    } else {
                        if(item.general.d_fecharegistro) setEliminarDetalles([...eliminarDetalles, item.general]);
                    }
                });
            }
            setDetalles([...detallesAux, nuevoDetalle]);
            handleClose();
        } else {
            setIsAlert(true);
        }
    }

    const showMessageValidationDate = () => {
        let fechaInicio = moment(flujoCaja.general.d_fechaInicioMov);
        let fechaFin= moment(flujoCaja.general.d_fechaFinMov);
        if(nuevaFecha.value) {
            let message = "";
            if(!validDate()) message = `La fecha de movimiento debe estar en el rango: ${fechaInicio.format('DD/MM/yyyy')} - ${fechaFin.format('DD/MM/yyyy')}`;
            if(findFechaRepetida()) message = "La fecha no puede ser igual a una fecha de la lista de detalles";
            return (
                <div className='invalid__message__data'>
                    {message}
                </div>
            )
        } else {
            return <div className='invalid__message__data'>Debe llenar la fecha de movimiento</div>
        }
    }

    return (
        <Modal isOpen={isOpen}
            title={`Clonar la información del día - ${moment(detalleSeleccionado.general.d_fechamov).format("DD/MM/yyyy")}`}
            onClose={handleClose} modal_class="Modal__container__form"
        >
            <div className="modal-body row">
                <InputComponent
                    label="Fecha"
                    state={nuevaFecha}
                    setState={setNuevaFecha}
                    type="date"
                    placeholder="Nueva Fecha"
                    inputId="fechaMovId"
                    readOnly={false}
                    classForm="col-12 col-lg-6"
                >
                    {showMessageValidationDate()}
                </InputComponent>
                <ReactSelect
                    labelText="Tipo"
                    defaultValue="Seleccione"
                    data={[{option:"Solo clonar", value:"N"}, {option:"Clonar y borrar", value:"S"}]}
                    inputId="tipoId"
                    valueField="value"
                    optionField="option"
                    valueSelected={borrarDetalle}
                    handleElementSelected={setBorrarDetalle}
                    classForm="col-12 col-lg-6"
                />
            </div>
            <div className="modal-footer justify-content-center">
                <button onClick={handleClonar} className="btn btn-primary">
                    Clonar
                </button>
            </div>
            {/*Alerta*/}
            { isAlert === true && <Alert
                title="Hibo un problema"
                type="alert-danger"
                mainMessage="Debes seleccionar una fecha dentro del rango y no debe repetirse de la lista de detalles"
            /> }
        </Modal>
    )
}

export default FlujoCajaClonarDetalleModal