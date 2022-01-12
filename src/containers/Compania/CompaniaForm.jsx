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
import { listPaises, listDepartamentos, listProvincias, listDistritos,
        getCompaniaByCodigoCompania, registerCompania, updateCompania } from '../../Api/Api'

const CompaniaForm = (props) => {
    //Estados
    const [compania, setCompania] = useState({value: "", isValid:null});
    const [descripcion, setDescripcion] = useState({value: "", isValid:null});
    const [ruc, setRuc] = useState({value: "", isValid:null});
    const [direccion, setDireccion] = useState({value: "", isValid:null});
    const [paisCodigo, setPaisCodigo] = useState("");
    const [departamentoCodigo, setDepartamentoCodigo] = useState("");
    const [provinciaCodigo, setProvinciaCodigo] = useState("");
    const [distritoCodigo, setDistritoCodigo] = useState("");
    const [estado, setEstado] = useState("A");
    //Listas
    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [provinciasFiltradas, setProvinciasFiltradas] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [distritosFiltrados, setDistritosFiltrados] = useState([]);
    //Estados del formulario
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
        nuevaCompania: {label:"Guardar", class:"btn btn-primary btn-form"},
        editarCompania: {label:"Actualizar", class:"btn btn-warning btn-form"},
        visualizarCompania: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    const readOnlyView = urlFragment === "visualizarCompania" ? true : false;
    const readOnlyCode = urlFragment !== "nuevaCompania" ? true : false;

    const formFunctions = {
        nuevaCompania: ()=> handleRegister(),
        editarCompania: ()=> handleUpdate()
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/companias"});
        setOpenResponseModal(true);
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if( !compania.isValid || !descripcion.isValid || !ruc.isValid || !direccion.isValid || !paisCodigo ||
            !departamentoCodigo || !provinciaCodigo || !distritoCodigo ) return false;
        return true;
    }

    const prepareData = () => {
        const data = {
            c_compania: compania.value.toUpperCase(),
            c_descripcion: descripcion.value.toUpperCase(),
            c_ruc: ruc.value,
            c_direccion: direccion.value,
            c_paiscodigo: paisCodigo,
            c_departamentocodigo:  departamentoCodigo,
            c_provinciacodigo: provinciaCodigo,
            c_distritocodigo: distritoCodigo,
            c_estado: estado
        }
        return data;
    }

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_usuarioregistro = userLogedIn;
        const response = await registerCompania(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito el usuario") : prepareNotificationDanger("Error al registrar", response.message);
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        const response = await updateCompania(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el usuario") : prepareNotificationDanger("Error al actualizar", response.message);
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarCompania") {
            if(validate()) {
                if( urlFragment === "nuevaCompania" ) {
                    setOpen(true);
                    setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"})
                }
                if(urlFragment === "editarCompania") {
                    setOpen(true);
                    setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
                }
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/companias")
        }
    }

    const getData = async () => {
        const response = await getCompaniaByCodigoCompania(elementId);
        if(response.status === 200) {
            const data = response.body.data;
            setCompania({value: data.c_compania, isValid:true});
            setDescripcion({value: data.c_descripcion, isValid:true});
            setRuc({value: data.c_ruc, isValid:true});
            setDireccion({value: data.c_direccion, isValid:true});
            setPaisCodigo(data.c_paiscodigo);
            setDepartamentoCodigo(data.c_departamentocodigo);
            setProvinciaCodigo(data.c_provinciacodigo);
            setDistritoCodigo(data.c_distritocodigo);
            setEstado(data.c_estado);
        }else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
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
        await getPaises();
        await getDepartamentos();
        await getProvincias();
        await getDistritos();
        setButtonAttributes(buttonTypes[urlFragment]);
        if(urlFragment !== "nuevaCompania") await getData();
        setfirstLoad(false);
        setIsLoading(false);
    }, [])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification}
            goList={()=>history.push("/companias")} view={readOnlyView}>
                <InputComponent
                    label="Código de compañía"
                    state={compania}
                    setState={setCompania}
                    type="text"
                    placeholder="Código de compañía"
                    inputId="companiaCodigoId"
                    validation="numberAndTextWithRange"
                    min={1}
                    max={8}
                    readOnly={readOnlyCode}
                />
                <InputComponent
                    label="Descripción"
                    state={descripcion}
                    setState={setDescripcion}
                    type="text"
                    placeholder="Descripción"
                    inputId="descripcionId"
                    validation="name"
                    mac={60}
                    readOnly={readOnlyView}
                />
                <InputComponent
                    label="RUC"
                    state={ruc}
                    setState={setRuc}
                    type="text"
                    placeholder="RUC"
                    inputId="rucId"
                    validation="numberWithRange"
                    min={11}
                    max={20}
                    readOnly={readOnlyCode}
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
                <SelectComponent
                    labelText="Estado"
                    defaultValue="Seleccione un estado"
                    items={[{name: "ACTIVO", value:"A"}, {name: "INACTIVO", value:"I"}]}
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

export default CompaniaForm