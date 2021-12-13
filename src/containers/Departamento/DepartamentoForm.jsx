import React, { useContext, useEffect, useState } from 'react'
//Componentes
import FormContainer from '../../components/FormContainer/FormContainer'
import InputComponent from '../../components/InputComponent/InputComponent'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import UserContext from '../../context/UserContext/UserContext'
//Functions
import { useLocation, useHistory } from 'react-router'
import { listPaises, listAllPaises, getDepartamentoByCodigoDepartamento, registerDepartamento, updateDepartamento } from '../../Api/Api'

const DepartamentoForm = (props) => {
    //Estados
    const [paisCodigo, setPaisCodigo] = useState("");
    const [departamentocodigo, setDepartamentocodigo] = useState({value: "", isValid:null});
    const [descripcion, setDescripcion] = useState({value: "", isValid:null});
    const [paises, setPaises] = useState([]);
    const [estado, setEstado] = useState("A");
    //Estados del formulario
    const [buttonAttributes, setButtonAttributes] = useState({label:"", class:""});
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
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
        nuevoDepartamento: {label:"Guardar", class:"btn btn-primary btn-form"},
        editarDepartamento: {label:"Actualizar", class:"btn btn-warning btn-form"},
        visualizarDepartamento: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    const readOnlyView = urlFragment === "visualizarDepartamento" ? true : false;
    const readOnlyCode = urlFragment === "editarDepartamento" ? true : false;

    const formFunctions = {
        nuevoDepartamento: ()=> handleRegister(),
        editarDepartamento: ()=> handleUpdate()
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if( !descripcion.isValid || !paisCodigo || !departamentocodigo.isValid ) return false;
        return true;
    }

    const prepareData = () => {
        const data = {
            c_paiscodigo: paisCodigo,
            c_departamentocodigo:  departamentocodigo.value.toUpperCase(),
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
        const response = await registerDepartamento(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito el usuario") : prepareNotificationDanger("Error al registrar", response.message);
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        const response = await updateDepartamento(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el usuario") : prepareNotificationDanger("Error al actualizar", response.message);
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarDepartamento") {
            if(validate()) {
                if( urlFragment === "nuevoDepartamento" ) {
                    setOpen(true);
                    setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"})
                }
                if(urlFragment === "editarDepartamento") {
                    setOpen(true);
                    setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
                }
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/departamentos")
        }
    }

    const getData = async () => {
        const [c_paiscodigo, c_departamentocodigo] = elementId.split('-');
        const response = await getDepartamentoByCodigoDepartamento({c_paiscodigo:c_paiscodigo, c_departamentocodigo:c_departamentocodigo});
        if(response.status === 200) {
            const data = response.body.data;
            setPaisCodigo(data.c_paiscodigo);
            setDepartamentocodigo({value: data.c_departamentocodigo, isValid:true});
            setDescripcion({value: data.c_descripcion, isValid:true});
            setEstado(data.c_estado);
        }else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    const getPaises = async () => {
        const response = urlFragment === "nuevoDepartamento" ? await listPaises() : await listAllPaises();
        if(response && response.status === 200) setPaises(response.body.data);
    }

    useEffect(async () => {
        await setIsLoading(true);
        await getPaises();
        setButtonAttributes(buttonTypes[urlFragment]);
        if(urlFragment !== "nuevoDepartamento") await getData();
        setIsLoading(false);
    }, [])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification}>
                <ReactSelect
                    inputId="paisCodeId"
                    labelText="País"
                    placeholder="Seleccione un país"
                    valueSelected={paisCodigo}
                    data={paises}
                    handleElementSelected={setPaisCodigo}
                    optionField="c_descripcion"
                    valueField="c_paiscodigo"
                    disabledElement={readOnlyView || readOnlyCode}
                />
                <InputComponent
                    label="Código de departamento"
                    state={departamentocodigo}
                    setState={setDepartamentocodigo}
                    type="text"
                    placeholder="Código de departamento"
                    inputId="departamentocodigoId"
                    validation="name"
                    readOnly={readOnlyView || readOnlyCode}
                />
                <InputComponent
                    label="Descripción"
                    state={descripcion}
                    setState={setDescripcion}
                    type="text"
                    placeholder="Descripción"
                    inputId="descripcionId"
                    validation="name"
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
        </>
    )
}

export default DepartamentoForm