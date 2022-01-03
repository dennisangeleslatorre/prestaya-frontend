import React, { useContext, useEffect, useState } from 'react'
//Componentes
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent'
import FormContainer from '../../components/FormContainer/FormContainer'
import InputComponent from '../../components/InputComponent/InputComponent'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import TextareaComponent from '../../components/TextareaComponent/TextareaComponent'
import WarrantyProductsForm from '../../components/WarrantyPodctsForm/WarrantyProductsForm'
import SearchModalCliente from '../../components/Modal/SearchModalCliente'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import UserContext from '../../context/UserContext/UserContext'
//Functions
import { useLocation, useHistory } from 'react-router'
import { listAllCompanias, listAllTiposDocumento, listAllPaises, listAllDepartamentos, listAllProvincias, listAllDistritos, listAgencias,
    getClienteByCodigoCliente, registerCliente, updateCliente, listParametrosByCompania } from '../../Api/Api'
import { addDaysToDate } from '../../utilities/Functions/AddDaysToDate';

const estados = [
    { name: 'PENDIENTE', value: 'PE' },
    { name: 'VIGENTE', value: 'VI' },
    { name: 'CANCELADO', value: 'CA' },
    { name: 'ENTREGADO', value: 'EN' },
    { name: 'REMATE', value: 'RE' },
    { name: 'ANULADO', value: 'AN' }
]

const monedas = [
    { name: 'LOCAL', value: 'L' },
    { name: 'EXTERIOR', value: 'E' }
]

const PrestamoForm = (props) => {
    //Estados
    const [compania, setCompania] = useState("");
    const [nPrestamo, setNPrestamo] = useState({value:"", isValid:null});
    const [agencia, setAgencia] = useState("");
    const [estado, setEstado] = useState("");
    const [codigoCliente, setCodigoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [numeroDocumento, setNumeroDocumento] = useState({value:"", isValid:null});
    const [direccion, setDireccion] = useState({value:"", isValid:null});
    const [paisCodigo, setPaisCodigo] = useState("");
    const [departamentoCodigo, setDepartamentoCodigo] = useState("");
    const [provinciaCodigo, setProvinciaCodigo] = useState("");
    const [distritoCodigo, setDistritoCodigo] = useState("");
    const [telefono, setTelefono] = useState({value:"", isValid:null});
    const [moneda, setMoneda] = useState("L");
    const [montoPrestamo, setMontoPrestamo] = useState({value:"0.0", isValid:true});
    const [tasaInteres, setTasaInteres] = useState({value:"14.98", isValid:true});
    const [montoIntereses, setMontoIntereses] = useState({value:"0.0", isValid:true});
    const [montoTotalPrestamo, setMontoTotalPrestamo] = useState({value:"0.0", isValid:true});
    const [fechaDesembolso, setFechaDesembolso] = useState({value:""});
    const [plazoDias, setPlazoDias] = useState({value: "30", isValid:true});
    const [fechaVencimiento, setFechaVencimiento] = useState({value:"", required:null});
    const [montoInteresDiario, setMontoInteresDiario] = useState({value:"0.0", required:null});
    const [observacionesRegistro, setObservacionesRegistro] = useState("");
    const [productos, setProductos] = useState([]);
    //Anular
    const [observacionesAnular, setObservacionesAnular] = useState("");
    //Vigencia
    const [observacionesVigencia, setObservacionesVigencia] = useState("");
    //Entrega
    const [observacionesEntrega, setObservacionesEntrega] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState({value:""});
    const [personaRecoge, setPersonaRecoge] = useState({value:"", isValid:null});
    const [tipoDocumentoEntrega, setTipoDocumentoEntrega] = useState("");
    const [tipoDocumentoSelected, setTipoDocumentoSelected] = useState({});
    const [numeroDocumentoEntrega, setNumeroDocumentoEntrega] = useState({value:"", isValid:null});
    const [telefonoEntrega, setTelefonoEntrega] = useState({value:"", isValid:null});
    //Remate
    const [fechaRemate, setFechaRemate] = useState({value:""});
    const [observacionesRemate, setObservacionesRemate] = useState("");
    //Listas
    const [companias, setCompanias] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [tiposDocumentos, setTiposDocumentos] = useState([]);
    //Estado del formulario
    const [firstLoad, setfirstLoad] = useState(true);
    const [buttonAttributes, setButtonAttributes] = useState({label:"", class:""});
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [modalAttributes, setModalAttributes] = useState({title:"", message:""});
    const [isAlert, setIsAlert] = useState(false);
    const [notification, setNotification] = useState({title:"", type:"", message:""})
    const [openSearchModal, setOpenSearchModal] = useState(false);
    //Contextos
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData().c_codigousuario;
    //Variables
    const elementId = props.match.params.id;
    const location = useLocation();
    let history = useHistory();
    const urlFragment = location.pathname.split('/')[1];
    const buttonTypes = {
        nuevoPrestamo: {label:"Guardar", class:"btn btn-primary btn-form"},
        editarPrestamo: {label:"Actualizar", class:"btn btn-warning btn-form"},
        visualizarPrestamo: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    const readOnlyView = urlFragment === "visualizarPrestamo" ? true : false;
    const readOnlyCode = urlFragment !== "nuevoPrestamo" ? true : false;

    const formFunctions = {
        nuevoPrestamo: ()=> handleRegister(),
        editarPrestamo: ()=> handleUpdate()
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/prestamos"});
        setOpenResponseModal(true);
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        return true;
    }

    const prepareData = () => {
        const data = {
        }
        return data;
    }

    const handleOpenSearchModal = async () => {
        setOpenSearchModal(true);
    }

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_usuarioregistro = userLogedIn;
        const response = await registerPrestamo(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito el prestamo") : prepareNotificationDanger("Error al registrar", response.message);
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        const response = await updatePrestamo(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el prestamo") : prepareNotificationDanger("Error al actualizar", response.message);
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarPrestamo") {
            if(validate()) {
                setOpen(true);
                if(urlFragment === "nuevoPrestamo") setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"});
                if(urlFragment === "editarPrestamo") setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/prestamos")
        }
    }

    const getData = async () => {
        const [c_compania, c_prestamo] = elementId.split('-');
        const response = await getPrestamoByCodigoPrestamo({c_compania:c_compania, c_prestamo:c_prestamo});
        if(response.status === 200) {
        }else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    const findClienteByCode = async () => {
        setIsLoading(true);
        if(codigoCliente) {
            const response = await getClienteByCodigoCliente({c_compania:compania, n_cliente:codigoCliente});
            if(response && response.status === 200 && response.body.data) {
                setClienteSeleccionado(response.body.data);
            } else {
                setResponseData({title:"Aviso", message:"No hay un cliente con ese código"});
                setCodigoCliente("");
                setOpenResponseModal(true);
            }
        }
        setIsLoading(false);
    }

    const getParameters = async () => {
        const response = await listParametrosByCompania(elementId);
        if(response && response.status === 200) {
            const data = response.body.data;
            const tasaInteres = data.find((item) => item.c_parametrocodigo === "PACO000001");
            const plazoDias = data.find((item) => item.c_parametrocodigo === "PACO000002");
            setTasaInteres({value:tasaInteres.n_valornumero, isValid:true});
            setPlazoDias({value:parseInt(plazoDias.n_valornumero), isValid:true});
        }
    }

    const getAgencias = async () => {
        const response = await listAgencias({c_compania: compania});
        if(response && response.status === 200) setAgencias(response.body.data);
    }

    const getCompanias = async () => {
        const response = await listAllCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }

    const getTiposDocumento = async () => {
        const response = await listAllTiposDocumento();
        if(response && response.status === 200) setTiposDocumentos(response.body.data);
    }

    const getPaises = async () => {
        const response = await listAllPaises();
        if(response && response.status === 200) setPaises(response.body.data);
    }

    const getDepartamentos = async () => {
        const response = await listAllDepartamentos();
        if(response && response.status === 200) setDepartamentos(response.body.data);
    }

    const getProvincias = async () => {
        const response = await listAllProvincias();
        if(response && response.status === 200) setProvincias(response.body.data);
    }

    const getDistritos = async () => {
        const response = await listAllDistritos();
        if(response && response.status === 200) setDistritos(response.body.data);
    }

    useEffect(() => {
        if(!firstLoad) setAgencia("");
        if(compania) getAgencias();
    }, [compania])

    useEffect(async () => {
        await setIsLoading(true);
        if(urlFragment === "nuevoPrestamo") await getParameters();
        await getCompanias();
        await getTiposDocumento();
        await getPaises();
        await getDepartamentos();
        await getProvincias();
        await getDistritos();
        setButtonAttributes(buttonTypes[urlFragment]);
        if(urlFragment !== "nuevoPrestamo") await getData();
        else setEstado("PE")
        setfirstLoad(false);
        setIsLoading(false);
    }, [])

    useEffect(() => {
        if(urlFragment === "nuevoPrestamo" && companias.length !== 0) setCompania(elementId)
        else {
            const [c_compania, c_prestamo] = elementId.split('-');
            setCompania(c_compania);
        }
    }, [companias])

    useEffect(() => {
        if(clienteSeleccionado) {
            setCodigoCliente(clienteSeleccionado.n_cliente);
            setNombreCliente(clienteSeleccionado.c_nombrescompleto);
            setNumeroDocumento({value: clienteSeleccionado.c_numerodocumento});
            setTelefono({value: clienteSeleccionado.c_telefono1});
            setTipoDocumento(clienteSeleccionado.c_tipodocumento);
            setPaisCodigo(clienteSeleccionado.c_paiscodigo);
            setDepartamentoCodigo(clienteSeleccionado.c_departamentocodigo);
            setProvinciaCodigo(clienteSeleccionado.c_provinciacodigo);
            setDistritoCodigo(clienteSeleccionado.c_distritocodigo);
            setDireccion({value: clienteSeleccionado.c_direccion});
        }
    }, [clienteSeleccionado])

    useEffect(() => {
        const calc = Number(montoPrestamo.value) * Number(tasaInteres.value) / 100;
        setMontoIntereses({value:calc})
        setMontoTotalPrestamo({value:Number(montoPrestamo.value) + calc})
    }, [montoPrestamo, tasaInteres])

    useEffect(() => {
        if(plazoDias.isValid && fechaDesembolso.value) {
            const fechaCalc = addDaysToDate(fechaDesembolso.value, plazoDias.value);
            setFechaVencimiento({value:fechaCalc});
        } else {

        }
    }, [plazoDias, fechaDesembolso])

    useEffect(() => {
        if( plazoDias.isValid && montoIntereses.value ) {
            setMontoInteresDiario({value: Number(montoIntereses.value)/Number(plazoDias.value)});
        }
    }, [montoIntereses, plazoDias])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification}
            goList={()=>history.push("/prestamos")} view={readOnlyView}>
                <div className="row">
                    <ReactSelect
                        inputId="companiaCodeId"
                        labelText="Compañía"
                        placeholder="Seleccione un compañía"
                        valueSelected={compania}
                        data={companias}
                        handleElementSelected={setCompania}
                        optionField="c_descripcion"
                        valueField="c_compania"
                        disabledElement={true}
                        classForm="col-12 col-lg-6"
                    />
                    { urlFragment !== 'nuevoPrestamo' && <InputComponent
                        label="N° Prestamo"
                        state={nPrestamo}
                        setState={setNPrestamo}
                        type="text"
                        placeholder="N° Prestamo"
                        inputId="prestamoCodigoId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />}
                    <ReactSelect
                        inputId="agenciaCodeId"
                        labelText="Agencia"
                        placeholder="Seleccione un agencia"
                        valueSelected={agencia}
                        data={agencias}
                        handleElementSelected={setAgencia}
                        optionField="c_descripcion"
                        valueField="c_agencia"
                        disabledElement={readOnlyCode}
                        classForm="col-12 col-lg-6"
                    />
                    <SelectComponent
                        labelText="Estado"
                        defaultValue="Seleccione un estado"
                        items={estados}
                        selectId="estadoId"
                        valueField="value"
                        optionField="name"
                        valueSelected={estado}
                        handleChange={setEstado}
                        classForm="col-12 col-lg-6"
                        disabledElement={true}
                    />
                    <SearcherComponent
                        placeholder="Nombre del cliente"
                        label="Cliente"
                        inputCodeId="clienteCodigoId"
                        stateCode={codigoCliente}
                        setStateCode={setCodigoCliente}
                        inputId="clienteNombreId"
                        stateName={nombreCliente}
                        setStateName={setNombreCliente}
                        onHandleClick={handleOpenSearchModal}
                        onHandleBlur={findClienteByCode}
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                        marginForm=""
                    />
                    <SelectComponent
                        labelText="Tipo documento"
                        defaultValue="Seleccione un tipo documento"
                        items={tiposDocumentos}
                        selectId="tipoDocId"
                        valueField="c_tipodocumento"
                        optionField="c_descripcion"
                        valueSelected={tipoDocumento}
                        handleChange={setTipoDocumento}
                        disabledElement={true}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="N° documento"
                        state={numeroDocumento}
                        setState={setNumeroDocumento}
                        type="text"
                        placeholder="N° documento"
                        inputId="numeroDocumentoId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Dirección"
                        state={direccion}
                        setState={setDireccion}
                        type="text"
                        placeholder="Dirección"
                        inputId="direccionId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />
                    <ReactSelect
                        inputId="paisCodeId"
                        labelText="País"
                        placeholder="Seleccione un país"
                        valueSelected={paisCodigo}
                        data={paises}
                        handleElementSelected={setPaisCodigo}
                        optionField="c_descripcion"
                        valueField="c_paiscodigo"
                        disabledElement={true}
                        classForm="col-12 col-lg-6"
                    />
                    <ReactSelect
                        inputId="departamentoCodeId"
                        labelText="Departamento"
                        placeholder="Seleccione un Departamento"
                        valueSelected={departamentoCodigo}
                        data={departamentos}
                        handleElementSelected={setDepartamentoCodigo}
                        optionField="c_descripcion"
                        valueField="c_departamentocodigo"
                        disabledElement={true}
                        classForm="col-12 col-lg-6"
                    />
                    <ReactSelect
                        inputId="provinciaCodeId"
                        labelText="Provincia"
                        placeholder="Seleccione una Provincia"
                        valueSelected={provinciaCodigo}
                        data={provincias}
                        handleElementSelected={setProvinciaCodigo}
                        optionField="c_descripcion"
                        valueField="c_provinciacodigo"
                        disabledElement={true}
                        classForm="col-12 col-lg-6"
                    />
                    <ReactSelect
                        inputId="distritocodigoId"
                        labelText="Distrito"
                        placeholder="Seleccione una Distrito"
                        valueSelected={distritoCodigo}
                        data={distritos}
                        handleElementSelected={setDistritoCodigo}
                        optionField="c_descripcion"
                        valueField="c_distritocodigo"
                        disabledElement={true}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Teléfono"
                        state={telefono}
                        setState={setTelefono}
                        type="text"
                        placeholder="Teléfono"
                        inputId="telefonoId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />
                    <SelectComponent
                        labelText="Moneda"
                        defaultValue="Seleccione un moneda"
                        items={monedas}
                        selectId="monedaId"
                        valueField="value"
                        optionField="name"
                        valueSelected={moneda}
                        handleChange={setMoneda}
                        disabledElement={readOnlyView}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Monto Préstamo"
                        state={montoPrestamo}
                        setState={setMontoPrestamo}
                        type="text"
                        placeholder="Monto Préstamo"
                        inputId="montoPrestamoId"
                        validation="decimalNumber"
                        readOnly={readOnlyView}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Tasa interés"
                        state={tasaInteres}
                        setState={setTasaInteres}
                        type="text"
                        placeholder="Tasa interés"
                        inputId="tasaInteresId"
                        validation="decimalNumber"
                        readOnly={readOnlyView}
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
                    <InputComponent
                        label="Mnt. Total P."
                        state={montoTotalPrestamo}
                        setState={setMontoTotalPrestamo}
                        type="text"
                        placeholder="Monto total préstamo"
                        inputId="montoTotalPrestamoId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="F. Desembolso"
                        state={fechaDesembolso}
                        setState={setFechaDesembolso}
                        type="date"
                        placeholder="Fecha desembolso"
                        inputId="fechaDesembolsoId"
                        readOnly={readOnlyView}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Plazo (días)"
                        state={plazoDias}
                        setState={setPlazoDias}
                        type="text"
                        placeholder="Plazo (días)"
                        inputId="plazoDiaId"
                        validation="number"
                        readOnly={readOnlyView}
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
                        label="Mnt. interés Diario"
                        state={montoInteresDiario}
                        setState={setMontoInteresDiario}
                        type="text"
                        placeholder="Mnt. interés Diario"
                        inputId="montoInteresDiarioId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />
                    <TextareaComponent
                        inputId="observacionCreacionId"
                        label="Observaciones"
                        placeholder="Observaciones"
                        value={observacionesRegistro}
                        setState={setObservacionesRegistro}
                        max={500}
                        readOnly={readOnlyView}
                        classForm="col-12"
                        labelSpace={1}
                    />
                    {/*ANULAR*/}
                    <TextareaComponent
                        inputId="observacionAnularId"
                        label="Observaciones Anular"
                        placeholder="Observaciones Anular"
                        value={observacionesAnular}
                        setState={setObservacionesAnular}
                        max={500}
                        readOnly={urlFragment!=="anularPrestamo" ? true : false}
                        classForm="col-12"
                        labelSpace={1}
                    />
                    {/*VIGENCIA*/}
                    <TextareaComponent
                        inputId="observacionVigenciaId"
                        label="Observaciones Vigencia"
                        placeholder="Observaciones Vigencia"
                        value={observacionesVigencia}
                        setState={setObservacionesVigencia}
                        max={500}
                        readOnly={urlFragment!=="vigenciaPrestamo" ? true : false}
                        classForm="col-12"
                        labelSpace={1}
                    />
                    {/*ENTREGA*/}
                    <InputComponent
                        label="Persona recoge"
                        state={personaRecoge}
                        setState={setPersonaRecoge}
                        type="text"
                        placeholder="Persona recoge"
                        inputId="nombresId"
                        max={180}
                        readOnly={urlFragment!=="entregaPrestamo" ? true : false}
                        classForm="col-12 col-lg-6"
                    />
                    <SelectComponent
                        labelText="Tipo documento"
                        defaultValue="Seleccione un tipo documento"
                        items={tiposDocumentos}
                        selectId="tipoDocId"
                        valueField="c_tipodocumento"
                        optionField="c_descripcion"
                        valueSelected={tipoDocumentoEntrega}
                        handleChange={setTipoDocumentoEntrega}
                        disabledElement={urlFragment!=="entregaPrestamo" ? true : false}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="N° documento"
                        state={numeroDocumentoEntrega}
                        setState={setNumeroDocumentoEntrega}
                        type="text"
                        placeholder="N° documento"
                        inputId="numeroDocumentoId"
                        validation={urlFragment==="entregaPrestamo" ? "textNumber" : null}
                        max={tipoDocumentoSelected.n_numerodigitos === 0 ? 250 : tipoDocumentoSelected.n_numerodigitos}
                        min={tipoDocumentoSelected.n_numerodigitos === 0 ? 1 : tipoDocumentoSelected.n_numerodigitos}
                        readOnly={urlFragment!=="entregaPrestamo" ? true : false}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Teléfono"
                        state={telefonoEntrega}
                        setState={setTelefonoEntrega}
                        type="text"
                        placeholder="Teléfono"
                        inputId="telefonoId"
                        validation={urlFragment==="entregaPrestamo" ? "phone" : null}
                        max={20}
                        readOnly={urlFragment!=="entregaPrestamo" ? true : false}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="F. Entrega"
                        state={fechaEntrega}
                        setState={setFechaEntrega}
                        type="date"
                        placeholder="Fecha entrega"
                        inputId="fechaEntregaId"
                        readOnly={urlFragment!=="entregaPrestamo" ? true : false}
                        classForm="col-12 col-lg-6"
                    />
                    <TextareaComponent
                        inputId="observacionEntregaId"
                        label="Observaciones Entrega"
                        placeholder="Observaciones Entrega"
                        value={observacionesEntrega}
                        setState={setObservacionesEntrega}
                        max={500}
                        readOnly={urlFragment!=="entregaPrestamo" ? true : false}
                        classForm="col-12"
                        labelSpace={1}
                    />
                    {/*REMATE*/}
                    <InputComponent
                        label="F. Remate"
                        state={fechaRemate}
                        setState={setFechaRemate}
                        type="date"
                        placeholder="Fecha remate"
                        inputId="fechaRemateId"
                        readOnly={urlFragment!=="rematePrestamo" ? true : false}
                        classForm="col-12 col-lg-6"
                    />
                    <TextareaComponent
                        inputId="observacionRemateId"
                        label="Observaciones Remate"
                        placeholder="Observaciones Remate"
                        value={observacionesRemate}
                        setState={setObservacionesRemate}
                        max={500}
                        readOnly={urlFragment!=="rematePrestamo" ? true : false}
                        classForm="col-12"
                        labelSpace={1}
                    />
                    {/*GARANTIA*/}
                    <WarrantyProductsForm
                        productos={productos}
                        setProductos={setProductos}
                        userLogedIn={userLogedIn}
                    />
                </div>
            </FormContainer>
            {isLoading === true && <Loading/>}
            <ConfirmationModal
                isOpen={open}
                onClose={()=>setOpen(false)}
                title={modalAttributes.title}
                message={modalAttributes.message}
                onHandleFunction={formFunctions[urlFragment]}
            />
            <ResponseModal
                isOpen={openResponseModal}
                title={responseData.title}
                onClose={()=>setOpenResponseModal(false)}
                message={responseData.message}
                buttonLink={responseData.url}
            />
            <SearchModalCliente
                isOpen={openSearchModal}
                onClose={()=>setOpenSearchModal(false)}
                setClienteObtained={setClienteSeleccionado}
            />
        </>
    )
}

export default PrestamoForm