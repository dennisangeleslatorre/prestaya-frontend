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
import { listPaises, listDepartamentos, getProvinciaByCodigoProvincia,
         registerProvincia, updateProvincia } from '../../Api/Api'

const ProvinciaForm = (props) => {
    //Estados
    const [paisCodigo, setPaisCodigo] = useState("");
    const [departamentoCodigo, setDepartamentoCodigo] = useState("");
    const [provinciaCodigo, setProvinciaCodigo] = useState({value: "", isValid:null});
    const [descripcion, setDescripcion] = useState({value: "", isValid:null});
    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState([]);
    const [estado, setEstado] = useState("A");
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
        nuevaProvincia: {label:"Guardar", class:"btn btn-primary btn-form"},
        editarProvincia: {label:"Actualizar", class:"btn btn-warning btn-form"},
        visualizarProvincia: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    const readOnlyView = urlFragment === "visualizarProvincia" ? true : false;
    const readOnlyCode = urlFragment !== "nuevaProvincia" ? true : false;

    const formFunctions = {
        nuevaProvincia: ()=> handleRegister(),
        editarProvincia: ()=> handleUpdate()
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/provincias"});
        setOpenResponseModal(true);
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if( !descripcion.isValid || !paisCodigo || !departamentoCodigo || !provinciaCodigo.isValid ) return false;
        return true;
    }

    const prepareData = () => {
        const data = {
            c_paiscodigo: paisCodigo,
            c_departamentocodigo:  departamentoCodigo,
            c_provinciacodigo: provinciaCodigo.value.toUpperCase(),
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
        const response = await registerProvincia(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito la provincia") : prepareNotificationDanger("Error al registrar", response.message);
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        const response = await updateProvincia(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito la provincia") : prepareNotificationDanger("Error al actualizar", response.message);
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarProvincia") {
            if(validate()) {
                if( urlFragment === "nuevaProvincia" ) {
                    setOpen(true);
                    setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"})
                }
                if(urlFragment === "editarProvincia") {
                    setOpen(true);
                    setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
                }
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/provincias")
        }
    }

    const getData = async () => {
        const [c_paiscodigo, c_departamentocodigo, c_provinciacodigo] = elementId.split('-');
        const response = await getProvinciaByCodigoProvincia({c_paiscodigo:c_paiscodigo, c_departamentocodigo:c_departamentocodigo, c_provinciacodigo:c_provinciacodigo});
        if(response.status === 200) {
            const data = response.body.data;
            setPaisCodigo(data.c_paiscodigo);
            setDepartamentoCodigo(data.c_departamentocodigo);
            setProvinciaCodigo({value: data.c_provinciacodigo, isValid:true});
            setDescripcion({value: data.c_descripcion, isValid:true});
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
        const response = await listDepartamentos()
        if(response && response.status === 200) setDepartamentos(response.body.data);
    }

    useEffect(() => {
        if(!firstLoad) setDepartamentoCodigo("");
        if(paisCodigo && departamentos.length !== 0) {
            const departamentosAux = departamentos.filter((item) => item.c_paiscodigo === paisCodigo);
            setDepartamentosFiltrados(departamentosAux);
        }
    }, [paisCodigo, departamentos])

    useEffect(async () => {
        await setIsLoading(true);
        await getPaises();
        await getDepartamentos();
        setButtonAttributes(buttonTypes[urlFragment]);
        if(urlFragment !== "nuevaProvincia") await getData();
        setfirstLoad(false);
        setIsLoading(false);
    }, [])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification}
            goList={()=>history.push("/provincias")} view={readOnlyView}>
                <ReactSelect
                    inputId="paisCodeId"
                    labelText="País"
                    placeholder="Seleccione un país"
                    valueSelected={paisCodigo}
                    data={paises}
                    handleElementSelected={setPaisCodigo}
                    optionField="c_descripcion"
                    valueField="c_paiscodigo"
                    disabledElement={readOnlyCode}
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
                    disabledElement={readOnlyCode}
                />
                <InputComponent
                    label="Código de provincia"
                    state={provinciaCodigo}
                    setState={setProvinciaCodigo}
                    type="text"
                    placeholder="Código de provincia"
                    inputId="provinciacodigoId"
                    validation="textWithRange"
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
                    validation="name"
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

export default ProvinciaForm