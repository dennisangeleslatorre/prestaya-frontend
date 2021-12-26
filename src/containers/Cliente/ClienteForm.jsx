import React, { useContext, useEffect, useState } from 'react'
//Componentes
import FormContainer from '../../components/FormContainer/FormContainer'
import InputComponent from '../../components/InputComponent/InputComponent'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import TextareaComponent from '../../components/TextareaComponent/TextareaComponent'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import UserContext from '../../context/UserContext/UserContext'
//Functions
import { useLocation, useHistory } from 'react-router'
import { listCompanias, listTiposDocumento, listPaises, listDepartamentos, listProvincias, listDistritos } from '../../Api/Api'

const ClienteForm = (props) => {
    //Estados
    const [compania, setCompania] = useState("");
    const [nCliente, setNCliente] = useState({value: "", isValid:null});
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [tipoDocumentoSelected, setTipoDocumentoSelected] = useState({});
    const [numeroDocumento, setNumeroDocumento] = useState({value:"", isValid:null});
    const [apellidoPaterno, setApellidoPaterno] = useState({value:"", isValid:null});
    const [apellidoMaterno, setApellidoMaterno] = useState({value:"", isValid:null});
    const [nombres, setNombres] = useState({value:"", isValid:null});
    const [direccion, setDireccion] = useState({value:"", isValid:null});
    const [paisCodigo, setPaisCodigo] = useState("");
    const [departamentoCodigo, setDepartamentoCodigo] = useState("");
    const [provinciaCodigo, setProvinciaCodigo] = useState("");
    const [distritoCodigo, setDistritoCodigo] = useState("");
    const [telefono, setTelefono] = useState({value:"", isValid:null});
    const [telefono2, setTelefono2] = useState({value:"", isValid:true});
    const [correoElectronico, setCorreoElectronico] = useState({value:"", isValid:null});
    const [estado, setEstado] = useState("A");
    const [fechaRegistro, setFechaRegistro] = useState({value:"", isValid:null});
    const [fechaInicioOperaciones, setFechaInicioOperaciones] = useState({value:"", isValid:null});
    const [fechaInactivación, setFechaInactivación] = useState({value:"", isValid:null});
    const [motivoInactivación, setMotivoInactivación] = useState("");
    //Listas
    const [companias, setCompanias] = useState([]);
    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [provinciasFiltradas, setProvinciasFiltradas] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [distritosFiltrados, setDistritosFiltrados] = useState([]);
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
    //Contextos
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData().c_codigousuario;
     //Variables
     const elementId = props.match.params.id;
     const location = useLocation();
     let history = useHistory();
     const urlFragment = location.pathname.split('/')[1];
     const buttonTypes = {
         nuevoCliente: {label:"Guardar", class:"btn btn-primary btn-form"},
         editarCliente: {label:"Actualizar", class:"btn btn-warning btn-form"},
         visualizarCliente: {label:"Ir a lista", class:"btn btn-info btn-form"}
     }
     const readOnlyView = urlFragment === "visualizarCliente" ? true : false;
     const readOnlyCode = urlFragment !== "nuevoCliente" ? true : false;

     const formFunctions = {
         nuevoCliente: ()=> handleRegister(),
         editarCliente: ()=> handleUpdate()
     }

     const prepareNotificationSuccess = (message) => {
         setIsAlert(true);
         setNotification({title:"Operación exitosa", type:"alert-success", message:message});
         setResponseData({message: message, title: "Operación exitosa", url:"/clientes"});
         setOpenResponseModal(true);
     }

     const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if( !compania || !nCliente.value || !apellidoPaterno.value || !apellidoMaterno.value || !nombres.value || !direccion.value || !paisCodigo ||
            !departamentoCodigo || !provinciaCodigo || !distritoCodigo || !telefono.isValid || !telefono2.isValid || !correoElectronico.isValid ||
            !numeroDocumento.isValid ) return false;
        return true;
    }

    const prepareData = () => {
        const data = {
            c_compania: compania,
            n_cliente: nCliente.value,
            c_apellidospaterno: apellidoPaterno.value,
            c_apellidosmaterno: apellidoMaterno.value,
            c_nombres: nombres.value,
            c_nombrescompleto: `${nombres.value} ${apellidoPaterno.value} ${apellidoMaterno.value}`,
            c_tipodocumento: tipoDocumento,
            c_numerodocumento: numeroDocumento.value,
            c_direccion: direccion.value,
            c_paiscodigo: paisCodigo,
            c_despartamentocodigo: departamentoCodigo,
            c_provinciacodigo: provinciaCodigo,
            c_distritocodigo: distritoCodigo,
            c_telefono1: telefono.value,
            c_correo: correoElectronico.value,
            c_estado: estado
        };
        if(telefono2.value) data.c_telefono2 = telefono2.value;
        if(fechaInicioOperaciones.value) data.d_fechaInicioOperaciones = fechaInicioOperaciones.value;
        if(estado === "I") {
            data.c_motivoinactivacion = motivoInactivación;
        }
        return data;
    }

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_usuarioregistro = userLogedIn;
        //const response = await registerCliente(data);
        //(response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito el cliente") : prepareNotificationDanger("Error al registrar", response.message);
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        //const response = await updateCliente(data);
        //(response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el cliente") : prepareNotificationDanger("Error al actualizar", response.message);
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarCliente") {
            if(validate()) {
                setOpen(true);
                if(urlFragment === "nuevoCliente") setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"});
                if(urlFragment === "editarCliente") setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/clientes")
        }
    }

    const getData = async () => {
        const [c_compania, n_cliente] = elementId.split('-');
        const response = await getClienteByCodigoCliente({c_compania:c_compania, n_cliente:n_cliente});
        if(response.status === 200) {
            const data = response.body.data;
            
        }else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    const getCompanias = async () => {
        const response = await listCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }

    const getTiposDocumento = async () => {
        const response = await listTiposDocumento();
        if(response && response.status === 200) setTiposDocumentos(response.body.data);
    }

    const getPaises = async () => {
        const response = await listPaises();
        if(response && response.status === 200) setPaises(response.body.data);
    }

    const getDepartamentos = async () => {
        const response = await listDepartamentos();
        if(response && response.status === 200) setDepartamentos(response.body.data);
    }

    const getProvincias = async () => {
        const response = await listProvincias();
        if(response && response.status === 200) setProvincias(response.body.data);
    }

    const getDistritos = async () => {
        const response = await listDistritos();
        if(response && response.status === 200) setDistritos(response.body.data);
    }

    useEffect(() => {
        if(!firstLoad) setDepartamentoCodigo("");
        if(paisCodigo && departamentos.length !== 0) {
            const departamentosAux = departamentos.filter((item) => item.c_paiscodigo === paisCodigo);
            setDepartamentosFiltrados(departamentosAux);
        }
    }, [paisCodigo, departamentos])

    useEffect(() => {
        if(!firstLoad) setProvinciaCodigo("");
        if(departamentoCodigo && provincias.length !== 0) {
            const provinciasAux = provincias.filter((item) => item.c_departamentocodigo === departamentoCodigo);
            setProvinciasFiltradas(provinciasAux);
        }
        if(!departamentoCodigo) {
            setProvinciasFiltradas([]);
        }
    }, [departamentoCodigo, provincias])

    useEffect(() => {
        if(!firstLoad) setDistritoCodigo("");
        if(provinciaCodigo && distritos.length !== 0) {
            const distritosAux = distritos.filter((item) => item.c_provinciacodigo === provinciaCodigo);
            setDistritosFiltrados(distritosAux);
        }
        if(!provinciaCodigo) {
            setProvinciasFiltradas([]);
        }
    }, [provinciaCodigo, distritos])

    useEffect(async () => {
        await setIsLoading(true);
        await getCompanias();
        await getTiposDocumento();
        await getPaises();
        await getDepartamentos();
        await getProvincias();
        await getDistritos();
        setButtonAttributes(buttonTypes[urlFragment]);
        if(urlFragment !== "nuevoCliente") await getData();
        setfirstLoad(false);
        setIsLoading(false);
    }, [])

    useEffect(() => {
        if(urlFragment === "nuevoCliente" && companias.length !== 0) setCompania(companias[0].c_compania)
    }, [companias])

    useEffect(() => {
        if(urlFragment === "nuevoCliente" && tiposDocumentos.length !== 0) setTipoDocumento(tiposDocumentos[0].c_tipodocumento)
    }, [tiposDocumentos])

    useEffect(() => {
        if(!firstLoad) setNumeroDocumento({value: "", isValid: null});
        if(tipoDocumento) {
            const aux = tiposDocumentos.find((item) => item.c_tipodocumento === tipoDocumento);
            setTipoDocumentoSelected(aux);
        }
    }, [tipoDocumento])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification}
            goList={()=>history.push("/clientes")} view={readOnlyView}>
                <ReactSelect
                    inputId="companiaCodeId"
                    labelText="Compañía"
                    placeholder="Seleccione un compañía"
                    valueSelected={compania}
                    data={companias}
                    handleElementSelected={setCompania}
                    optionField="c_descripcion"
                    valueField="c_compania"
                    disabledElement={readOnlyCode}
                />
                <InputComponent
                    label="Código del cliente"
                    state={nCliente}
                    setState={setNCliente}
                    type="text"
                    placeholder="Código del cliente"
                    inputId="clienteCodigoId"
                    validation="number"
                    readOnly={readOnlyCode}
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
                    readOnly={readOnlyView}
                />
                <InputComponent
                    label="N° documento"
                    state={numeroDocumento}
                    setState={setNumeroDocumento}
                    type="text"
                    placeholder="N° documento"
                    inputId="numeroDocumentoId"
                    validation="documentNumber"
                    max={tipoDocumentoSelected.n_numerodigitos}
                    min={tipoDocumentoSelected.n_numerodigitos}
                    readOnly={readOnlyView}
                />
                <InputComponent
                    label="Apellido Paterno"
                    state={apellidoPaterno}
                    setState={setApellidoPaterno}
                    type="text"
                    placeholder="Apellido Paterno"
                    inputId="apellidoPaternoId"
                    max={60}
                    readOnly={readOnlyView}
                />
                <InputComponent
                    label="Apellido Materno"
                    state={apellidoMaterno}
                    setState={setApellidoMaterno}
                    type="text"
                    placeholder="Apellido Materno"
                    inputId="apellidoMaternoId"
                    max={60}
                    readOnly={readOnlyView}
                />
                <InputComponent
                    label="Nombres"
                    state={nombres}
                    setState={setNombres}
                    type="text"
                    placeholder="Nombres"
                    inputId="nombresId"
                    max={60}
                    readOnly={readOnlyView}
                />
                <InputComponent
                    label="Nombre completo"
                    state={{value: `${nombres.value} ${apellidoPaterno.value} ${apellidoMaterno.value}`}}
                    type="text"
                    placeholder="Nombre completo"
                    inputId="nombreCompletoId"
                    max={180}
                    readOnly={true}
                />
                <InputComponent
                    label="Dirección"
                    state={direccion}
                    setState={setDireccion}
                    type="text"
                    placeholder="Dirección"
                    inputId="direccionId"
                    validation="alphanumericRange"
                    min={1}
                    max={150}
                    readOnly={readOnlyView}
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
                    disabledElement={readOnlyView}
                />
                <ReactSelect
                    inputId="departamentoCodeId"
                    labelText="Departamento"
                    placeholder="Seleccione un Departamento"
                    valueSelected={departamentoCodigo}
                    data={departamentosFiltrados}
                    handleElementSelected={setDepartamentoCodigo}
                    optionField="c_descripcion"
                    valueField="c_departamentocodigo"
                    disabledElement={readOnlyView}
                />
                <ReactSelect
                    inputId="provinciaCodeId"
                    labelText="Provincia"
                    placeholder="Seleccione una Provincia"
                    valueSelected={provinciaCodigo}
                    data={provinciasFiltradas}
                    handleElementSelected={setProvinciaCodigo}
                    optionField="c_descripcion"
                    valueField="c_provinciacodigo"
                    disabledElement={readOnlyView}
                />
                <ReactSelect
                    inputId="distritocodigoId"
                    labelText="Distrito"
                    placeholder="Seleccione una Distrito"
                    valueSelected={distritoCodigo}
                    data={distritosFiltrados}
                    handleElementSelected={setDistritoCodigo}
                    optionField="c_descripcion"
                    valueField="c_distritocodigo"
                    disabledElement={readOnlyView}
                />
                <InputComponent
                    label="Teléfono"
                    state={telefono}
                    setState={setTelefono}
                    type="text"
                    placeholder="Teléfono"
                    inputId="telefonoId"
                    validation="phone"
                    max={20}
                    readOnly={readOnlyView}
                />
                <InputComponent
                    label="Teléfono 2"
                    state={telefono2}
                    setState={setTelefono2}
                    type="text"
                    placeholder="Teléfono 2"
                    inputId="telefono2Id"
                    validation="phone"
                    max={20}
                    required={false}
                    readOnly={readOnlyView}
                />
                <InputComponent
                    label="Correo"
                    state={correoElectronico}
                    setState={setCorreoElectronico}
                    type="text"
                    placeholder="Correo"
                    inputId="correoId"
                    validation="email"
                    max={60}
                    readOnly={readOnlyView}
                />
                <InputComponent
                    label="Inicio Operaciones"
                    state={fechaInicioOperaciones}
                    setState={setFechaInicioOperaciones}
                    type="date"
                    placeholder="Fecha inicio de operaciones"
                    inputId="fechaOperacionesId"
                    readOnly={readOnlyView}
                />
                <SelectComponent
                    labelText="Estado"
                    defaultValue="Seleccione un estado"
                    items={[{name: "Activo", value:"A"}, {name: "Inactivo", value:"I"}]}
                    selectId="estadoId"
                    valueField="value"
                    optionField="name"
                    valueSelected={estado}
                    handleChange={setEstado}
                    disabledElement={readOnlyView}
                />
                { urlFragment !== "nuevoCliente" && <InputComponent
                    label="Fecha registro"
                    type="text"
                    placeholder="Fecha registro"
                    inputId="fechaRegistroId"
                    state={fechaRegistro}
                    readOnly={readOnlyView}
                />}
                { estado === "I" && (
                    <>
                        <InputComponent
                            label="Fecha Inactivación"
                            state={fechaInactivación}
                            setState={setFechaInactivación}
                            type="date"
                            placeholder="Fecha Inactivación"
                            inputId="fechaInactivacionId"
                            readOnly={readOnlyView}
                        />
                        <TextareaComponent
                            inputId="motivoInactivacionId"
                            label="Motivo inactivación"
                            placeholder="Motivo inactivación"
                            value={motivoInactivación}
                            setState={setMotivoInactivación}
                            max={60}
                            readOnly={readOnlyView}
                        />
                    </>
                )}
            </FormContainer>
        </>
    )
}

export default ClienteForm