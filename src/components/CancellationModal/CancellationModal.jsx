import React, { useEffect, useState } from 'react'
import InputComponent from '../../components/InputComponent/InputComponent'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import TextareaComponent from '../../components/TextareaComponent/TextareaComponent'
import Modal from '../Modal/ModalNotification'
import Alert from '../Alert/Alert'

const CancellationModal = (props) => {
    const {isOpen, onClose} = props;
    const notification = {title:"Hubo un problema", type:"alert-danger", message:"Favor de llenar los campos con valores válidos"};
    const [isAlert, setIsAlert] = useState(false);
    //Estados
    const [nLinea, setNLinea] = useState({value:"", isValid:null});
    const [fechaVencimiento, setFechaVencimiento] = useState({value:"", required:null});
    const [montoPrestamo, setMontoPrestamo] = useState({value:"0.0", isValid:true});
    const [montoIntereses, setMontoIntereses] = useState({value:"0.0", isValid:true});
    const [tipoCancelacion, setTipoCancelacion] = useState("");
    const [fechaCancelacion, setFechaCancelacion] = useState({value:"", required:null});
    const [diasTranscurridos, setDiasTranscurridos] = useState({value:"", required:null});
    const [montoInteresDiario, setMontoInteresDiario] = useState({value:"0.0", required:null});
    const [interesCancelar, setInteresCancelar] = useState({value:"0.0", required:null});
    const [montoComision, setMontoComision] = useState({value:"0.0", required:null});
    const [montoToalCancelar, setMontoToalCancelar] = useState({value:"0.0", required:null});
    const [observaciones, setObservaciones] = useState("");
    const [estado, setEstado] = useState("");
    //validate
    const validate = () => {
        //if() return false;
        return true;
    }
    const cleanCancellation = () => {
        
    }

    const prepareCancellation = () => {
        
    }

    const handleAddCancellation = () => {
        
    }

    const handleClose = () => {
        cleanCancellation();
        onClose();
        setIsAlert(false);
    }

    return (
        <Modal isOpen={isOpen} title="Cancelaciones" onClose={onClose} modal_class="Modal__container__form">
            <div className="modal-body row">
                <InputComponent
                    label="Línea"
                    state={nLinea}
                    setState={setNLinea}
                    type="text"
                    placeholder="Línea"
                    inputId="lineaId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="F. Vencimiento"
                    state={fechaVencimiento}
                    setState={setFechaVencimiento}
                    type="date"
                    placeholder="Fecha vencimiento"
                    inputId="fechaVencimientoId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Monto Préstamo"
                    state={montoPrestamo}
                    setState={setMontoPrestamo}
                    type="number"
                    placeholder="Monto Préstamo"
                    inputId="montoPrestamoId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Monto intereses"
                    state={montoIntereses}
                    setState={setMontoIntereses}
                    type="text"
                    placeholder="Tasa interés"
                    inputId="tasaInteresId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <SelectComponent
                    labelText="Estado"
                    defaultValue="Seleccione un estado"
                    items={[{value:"C", name:"CANCELACIÓN"}, {value:"A", name:"AMORTIZACIÓN"}, {value:"R", name:"RENOVACIÓN"}]}
                    selectId="estadoId"
                    valueField="value"
                    optionField="name"
                    valueSelected={tipoCancelacion}
                    handleChange={setTipoCancelacion}
                    classForm="col-12 col-lg-6"
                    disabledElement={false}
                />
                <InputComponent
                    label="F. Cancelaion"
                    state={fechaCancelacion}
                    setState={setFechaCancelacion}
                    type="date"
                    placeholder="Fecha cancelación"
                    inputId="fechaCancelaionId"
                    readOnly={false}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Días transcurridos"
                    state={diasTranscurridos}
                    setState={setDiasTranscurridos}
                    type="text"
                    placeholder="Días transcurridos"
                    inputId="plazoDiaId"
                    validation="number"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Mnt. interés Diario"
                    state={montoInteresDiario}
                    setState={setMontoInteresDiario}
                    type="text"
                    placeholder="Mnt. interés Diario"
                    inputId="montoInteresDiarioId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Mnt. Interes a Cancelar"
                    state={interesCancelar}
                    setState={setInteresCancelar}
                    type="text"
                    placeholder="Mnt. Interes a Cancelar"
                    inputId="montoInteresCancelarId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Mnto Prestamo a Cancelar"
                    state={interesCancelar}
                    setState={setInteresCancelar}
                    type="text"
                    placeholder="Mnto Prestamo a Cancelar"
                    inputId="montoPrestamoCancelarId"
                    readOnly={false}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Mnt. Comisión"
                    state={montoComision}
                    setState={setMontoComision}
                    type="text"
                    placeholder="Mnt. Comisión"
                    inputId="montoComisionId"
                    readOnly={false}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Mnto Total Cancelar"
                    state={montoToalCancelar}
                    setState={setMontoToalCancelar}
                    type="text"
                    placeholder="Mnt. Comisión"
                    inputId="Mnto Total Cancelar"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <TextareaComponent
                    inputId="observacionesId"
                    label="Observaciones"
                    placeholder="Observaciones"
                    value={observaciones}
                    setState={setObservaciones}
                    max={500}
                    classForm="col-12"
                    labelSpace={1}
                />
                <SelectComponent
                    labelText="Estado"
                    defaultValue="Seleccione un estado"
                    items={[{value:"PE", name:"PENDIENTE"}, {value:"CA", name:"CANCELADO"}, {value:"RE", name:"REMATE"}]}
                    selectId="estadoId"
                    valueField="value"
                    optionField="name"
                    valueSelected={estado}
                    handleChange={setEstado}
                    classForm="col-12 col-lg-6"
                    disabledElement={true}
                />
            </div>
            {/*Alerta*/}
            { isAlert === true && <Alert
                title={notification.title}
                type={notification.type}
                mainMessage={notification.message}
            /> }
            <div className="modal-footer justify-content-center">
                <button onClick={handleAddCancellation} className="btn btn-primary">
                    Agregar
                </button>
            </div>
        </Modal>
    )
}

export default CancellationModal
