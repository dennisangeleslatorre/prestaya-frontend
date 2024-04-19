import React, { useContext, useEffect, useState } from 'react'
import InputComponent from '../../components/InputComponent/InputComponent'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import TextareaComponent from '../../components/TextareaComponent/TextareaComponent'
import Modal from '../Modal/ModalNotification'
import Alert from '../Alert/Alert'
//Api
import moment from 'moment'
//Contexto
import UserContext from '../../context/UserContext/UserContext'
import PagesContext from '../../context/PagesContext/PagesContext'
import ReactSelect from '../ReactSelect/ReactSelect'
import InputComponentView from '../InputComponent/InputComponentView'

const SimulationModal = (props) => {
    const {isOpen, onClose, ultimaCancelacion, fechaDesembolsoCancelacion, diasComisionParametros,
            montoComisionParametros, usuarios} = props;
    //Usuario
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData().c_codigousuario;
    //Estados
    const [nLinea, setNLinea] = useState({value:"", isValid:null});
    const [fechaVencimiento, setFechaVencimiento] = useState({value:"", isValid:null});
    const [montoPrestamo, setMontoPrestamo] = useState({value:"0.0", isValid:true});
    const [montoIntereses, setMontoIntereses] = useState({value:"0.0", isValid:true});
    const [tipoCancelacion, setTipoCancelacion] = useState("");
    const [fechaCancelacion, setFechaCancelacion] = useState({value:"", isValid:null});
    const [diasTranscurridos, setDiasTranscurridos] = useState({value:"", isValid:null});
    const [montoInteresDiario, setMontoInteresDiario] = useState({value:"0.0", isValid:null});
    const [interesCancelar, setInteresCancelar] = useState({value:"0.0", isValid:null});
    const [montoPrestamoCancelar, setMontoPrestamoCancelar] = useState({value:"0.0", isValid:null});
    const [montoComision, setMontoComision] = useState({value:"0.0", isValid:null});
    const [montoTotalCancelar, setMontoTotalCancelar] = useState({value:"0.0", isValid:null});
    const [observaciones, setObservaciones] = useState("");
    const [usuarioOperacion, setUsuarioOperacion] = useState(userLogedIn);
    //Permiso
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "MODIFICA USUARIO OPERACIÓN" })
    const modificaOperacionPermission = userPermisssions.includes("MODIFICA USUARIO OPERACIÓN");


    const cleanCancellation = () => {
        setNLinea({value:"", isValid:null});
        setFechaVencimiento({value:"", isValid:null});
        setMontoPrestamo({value:"0.0", isValid:true});
        setMontoIntereses({value:"0.0", isValid:true});
        setTipoCancelacion("");
        setFechaCancelacion({value:"", isValid:null});
        setDiasTranscurridos({value:"", isValid:null});
        setMontoInteresDiario({value:"0.0", isValid:null});
        setInteresCancelar({value:"0.0", isValid:null});
        setMontoPrestamoCancelar({value:"0.0", isValid:null});
        setMontoComision({value:"0.0", isValid:null});
        setMontoTotalCancelar({value:"0.0", isValid:null});
        setObservaciones("");
    }

    const handleClose = () => {
        cleanCancellation();
        onClose();
    }

    useEffect(() => {
        if(isOpen && ultimaCancelacion) {
            setNLinea({value:ultimaCancelacion.n_linea, isValid:null});
            setFechaVencimiento({value:moment(ultimaCancelacion.d_fechavencimiento).format('yyyy-MM-DD')});
            setMontoPrestamo({value:ultimaCancelacion.n_montoprestamo, isValid:true});
            setMontoIntereses({value:ultimaCancelacion.n_montointereses, isValid:true});
            setMontoInteresDiario({value:ultimaCancelacion.n_montointeresesdiario, isValid:null});
        }
    }, [isOpen])

    useEffect(() => {
        if(fechaDesembolsoCancelacion && fechaCancelacion.value) {
            const diferenciaDias = moment(fechaCancelacion.value).diff(moment(fechaDesembolsoCancelacion), 'days');
            setDiasTranscurridos({value:diferenciaDias});
        }
    }, [fechaCancelacion])

    useEffect(() => {
        if(diasTranscurridos.value && Number(diasTranscurridos.value) > 0) {
            const montoInteresACancelar = Number(diasTranscurridos.value)*Number(montoInteresDiario.value)
            setInteresCancelar({value:Number(montoInteresACancelar).toFixed(2)});
        }
        if(diasTranscurridos.value && Number(diasTranscurridos.value) <= Number(diasComisionParametros)) {
            if(tipoCancelacion === "C") setMontoComision({value:montoComisionParametros})
            else setMontoComision({value:"0.0"})
        }
    }, [diasTranscurridos, tipoCancelacion])

    useEffect(() => {
        const total = Number(interesCancelar.value) + Number(montoPrestamoCancelar.value) + Number(montoComision.value);
        setMontoTotalCancelar({value: total.toFixed(2)})
    }, [interesCancelar, montoPrestamoCancelar, montoComision])

    return (
        <>
            <Modal isOpen={isOpen} title="Simulación" onClose={handleClose} modal_class="Modal__container__form__cancellation">
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
                    type="number"
                    placeholder="Tasa interés"
                    inputId="tasaInteresId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <SelectComponent
                    labelText="Tipo de cancelación"
                    defaultValue="Seleccione un tipo"
                    items={[{value:"C", name:"CANCELACIÓN"}, {value:"A", name:"AMORTIZACIÓN"}, {value:"R", name:"RENOVACIÓN"}]}
                    selectId="tipoCancelaciónId"
                    valueField="value"
                    optionField="name"
                    valueSelected={tipoCancelacion}
                    handleChange={setTipoCancelacion}
                    classForm="col-12 col-lg-6"
                    disabledElement={false}
                />
                <InputComponent
                    label="F. Cancelación"
                    state={fechaCancelacion}
                    setState={setFechaCancelacion}
                    type="date"
                    placeholder="Fecha cancelación"
                    inputId="fechaCancelacionId"
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
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Mnt. interés Diario"
                    state={montoInteresDiario}
                    setState={setMontoInteresDiario}
                    type="number"
                    placeholder="Mnt. interés Diario"
                    inputId="montoInteresDiarioId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Mnt. Interes a Cancelar"
                    state={interesCancelar}
                    setState={setInteresCancelar}
                    type="number"
                    placeholder="Mnt. Interes a Cancelar"
                    inputId="montoInteresCancelarId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Mnto Prestamo a Cancelar"
                    state={montoPrestamoCancelar}
                    setState={setMontoPrestamoCancelar}
                    type="number"
                    placeholder="Mnto Prestamo a Cancelar"
                    inputId="montoPrestamoCancelarId"
                    readOnly={false}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Mnt. Comisión"
                    state={montoComision}
                    setState={setMontoComision}
                    type="number"
                    placeholder="Mnt. Comisión"
                    inputId="montoComisionId"
                    readOnly={false}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Mnto Total Cancelar"
                    state={montoTotalCancelar}
                    setState={setMontoTotalCancelar}
                    type="number"
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
                {modificaOperacionPermission ? <div className='col-12 m-0 p-0'>
                    <ReactSelect
                        inputId="usuarioOperacionId"
                        labelText="Usuario Operación"
                        placeholder="Seleccione un Usuario"
                        valueSelected={usuarioOperacion}
                        data={usuarios}
                        handleElementSelected={setUsuarioOperacion}
                        optionField="c_nombres"
                        valueField="c_codigousuario"
                        classForm="col-12 col-lg-6"
                    />
                </div>
                : <div className='col-12 m-0 p-0'>
                    <InputComponentView
                        label="Usuario Operación"
                        state={usuarioOperacion}
                        type="text"
                        placeholder="Usuario Operación"
                        inputId="nrccu"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />
                </div>}
            </div>
        </Modal>
        </>
    )
}

export default SimulationModal