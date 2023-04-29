import React, { useContext, useEffect, useState } from 'react'
//Componentes
import FormContainer from '../../components/FormContainer/FormContainer'
import InputComponent from '../../components/InputComponent/InputComponent'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import UserContext from '../../context/UserContext/UserContext'
//Functions
import { useLocation, useHistory } from 'react-router'
import { listAgencias, listCompanias, getAgenciaUbicacionByCodigo, updateUbicacion, registerUbicacion  } from '../../Api/Api'

const UbicacionForm = (props) => {
    const [compania, setCompania] = useState("");
    const [companiaDesc, setCompaniaDesc] = useState({value:''});
    const [agencia, setAgencia] = useState("");
    const [agenciaDesc, setAgenciaDesc] = useState({value:''});
    const [ubicacion, setUbicacion] = useState({value: "", isValid:null});
    const [descripcion, setDescripcion] = useState({value: "", isValid:null});
    const [companias, setCompanias] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [estado, setEstado] = useState("A");
    //Formulario
    const [buttonAttributes, setButtonAttributes] = useState({label:"", class:""});
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [modalAttributes, setModalAttributes] = useState({title:"", message:""});
    const [isAlert, setIsAlert] = useState(false);
    const [notification, setNotification] = useState({title:"", type:"", message:""});
    //Contextos
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData().c_codigousuario;
    //Variables
    const elementId = props.match.params.id;
    const location = useLocation();
    let history = useHistory();
    const urlFragment = location.pathname.split('/')[1];
    const buttonTypes = {
        nuevaUbicacion: {label:"Guardar", class:"btn btn-primary btn-form"},
        editarUbicacion: {label:"Actualizar", class:"btn btn-warning btn-form"},
        visualizarUbicacion: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    const readOnlyView = urlFragment === "visualizarUbicacion" ? true : false;
    const readOnlyCode = urlFragment !== "nuevaUbicacion" ? true : false;

    const formFunctions = {
        nuevaUbicacion: ()=> handleRegister(),
        editarUbicacion: ()=> handleUpdate()
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/ubicaciones"});
        setOpenResponseModal(true);
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if( !descripcion.isValid || !agencia || !compania || !ubicacion.isValid ) return false;
        return true;
    }

    const prepareData = () => {
        const data = {
            c_compania: compania,
            c_agencia:  agencia,
            c_ubicacion: ubicacion.value.toUpperCase(),
            c_descripcion: descripcion.value.toUpperCase(),
            c_estado: estado
        }
        return data;
    }

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_usuarioregistro = userLogedIn;
        const response = await registerUbicacion(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito la ubicación") : prepareNotificationDanger("Error al registrar", response.message);
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        const response = await updateUbicacion(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito la ubicación") : prepareNotificationDanger("Error al actualizar", response.message);
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarUbicacion") {
            if(validate()) {
                if( urlFragment === "nuevaUbicacion" ) {
                    setOpen(true);
                    setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"})
                }
                if(urlFragment === "editarUbicacion") {
                    setOpen(true);
                    setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
                }
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/ubicaciones")
        }
    }

    const getData = async () => {
        const [c_compania, c_agencia, c_ubicacion] = elementId.split('-');
        const response = await getAgenciaUbicacionByCodigo({c_compania:c_compania, c_agencia:c_agencia, c_ubicacion:c_ubicacion});
        if(response.status === 200) {
            const data = response.body.data[0];
            setCompania(data.c_compania);
            setAgencia(data.c_agencia);
            setCompaniaDesc({value: data.compania_desc});
            setAgenciaDesc({value: data.agencia_desc});
            setUbicacion({value: data.c_ubicacion, isValid:true});
            setDescripcion({value: data.c_descripcion, isValid:true});
            setEstado(data.c_estado);
        }else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    const handleSeleccionarCompania = (value) => {
        setCompania(value);
        getAgenciasByCompany(value);
    }

    const getCompanias = async () => {
        const response = await listCompanias();
        if(response && response.status === 200) {
            const companiasAux = response.body.data;
            setCompanias(companiasAux);
            if(companiasAux.length > 0 && urlFragment === "nuevaUbicacion") handleSeleccionarCompania(companiasAux[0].c_compania);
        };
    }

    const getAgenciasByCompany = async (companyCode) => {
        const response = await listAgencias({c_compania: companyCode});
        if(response && response.status === 200 && response.body.data) {
            const agenciaAux = response.body.data;
            setAgencias(agenciaAux);
            if(agenciaAux.length > 0) setAgencia(agenciaAux[0].c_agencia);
        }
    }

    useEffect(async () => {
        await setIsLoading(true);
        if(urlFragment === "nuevaUbicacion") await getCompanias();
        setButtonAttributes(buttonTypes[urlFragment]);
        if(urlFragment !== "nuevaUbicacion") await getData();
        setIsLoading(false);
    }, [])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification}
            goList={()=>history.push("/ubicaciones")} view={readOnlyView}>
                {urlFragment === "nuevaUbicacion" ? <ReactSelect
                    inputId="companiaId"
                    labelText="Compañía"
                    placeholder="Seleccione una compañía"
                    valueSelected={compania}
                    data={companias}
                    handleElementSelected={handleSeleccionarCompania}
                    optionField="c_descripcion"
                    valueField="c_compania"
                    disabledElement={readOnlyCode}
                /> : <InputComponent
                    label="Compañía"
                    state={companiaDesc}
                    setState={setCompaniaDesc}
                    type="text"
                    placeholder="Compañía"
                    inputId="companiaId"
                    readOnly={true}
                />}
                {urlFragment === "nuevaUbicacion" ? <ReactSelect
                    inputId="agenciaId"
                    labelText="Agencia"
                    placeholder="Seleccione una agencia"
                    valueSelected={agencia}
                    data={agencias}
                    handleElementSelected={setAgencia}
                    optionField="c_descripcion"
                    valueField="c_agencia"
                    disabledElement={readOnlyCode}
                /> : <InputComponent
                    label="Agencia"
                    state={agenciaDesc}
                    setState={setAgenciaDesc}
                    type="text"
                    placeholder="Agencia"
                    inputId="agenciaId"
                    readOnly={true}
                />}
                <InputComponent
                    label="Ubicación"
                    state={ubicacion}
                    setState={setUbicacion}
                    type="text"
                    placeholder="Ubicación"
                    inputId="ubicacionId"
                    validation="alphanumericRange"
                    min={1}
                    max={10}
                    readOnly={readOnlyCode}
                />
                <InputComponent
                    label="Descripción"
                    state={descripcion}
                    setState={setDescripcion}
                    type="text"
                    placeholder="Descripción"
                    inputId="descripcionId"
                    validation="alphanumericRange"
                    min={1}
                    max={60}
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
        </>
    )
}

export default UbicacionForm