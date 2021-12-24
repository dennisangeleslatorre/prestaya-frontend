import React, { useContext, useEffect, useState } from 'react'
//Componentes
import FormContainer from '../../components/FormContainer/FormContainer'
import InputComponent from '../../components/InputComponent/InputComponent'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import UserContext from '../../context/UserContext/UserContext'
//Functions
import { useLocation, useHistory } from 'react-router'
import { getTipoDocumentoByCodigoTipoDocumento, registerTipoDocumento, updateTipoDocumento } from '../../Api/Api'

const TipoDocumentoForm = (props) => {
    //Estados
    const [codigoTipoDocumento, setCodigoTipoDocumento] = useState({value: "", isValid:null});
    const [descripcion, setDescripcion] = useState({value: "", isValid:null});
    const [numeroDigitos, setNumeroDigitos] = useState({value: "0", isValid:true});
    const [estado, setEstado] = useState("A");
    //Estados del formulario
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
        nuevoTipoDocumento: {label:"Guardar", class:"btn btn-primary btn-form"},
        editarTipoDocumento: {label:"Actualizar", class:"btn btn-warning btn-form"},
        visualizarTipoDocumento: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    const readOnlyView = urlFragment === "visualizarDepartamento" ? true : false;
    const readOnlyCode = urlFragment !== "nuevoTipoDocumento" ? true : false;

    const formFunctions = {
        nuevoTipoDocumento: ()=> handleRegister(),
        editarTipoDocumento: ()=> handleUpdate()
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/tiposDocumento"});
        setOpenResponseModal(true);
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if(!codigoTipoDocumento.isValid || !descripcion.isValid || !numeroDigitos.isValid) return false;
        return true;
    }

    const prepareData = () => {
        const data = {
            c_tipodocumento: codigoTipoDocumento.value.toUpperCase(),
            c_descripcion: descripcion.value,
            n_numerodigitos: numeroDigitos.value,
            c_estado: estado
        }
        return data;
    }

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_usuarioregistro = userLogedIn;
        const response = await registerTipoDocumento(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito el perfil") : prepareNotificationDanger("Error al registrar", response.message);
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        const response = await updateTipoDocumento({body:data, id:elementId});
        (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el perfil") : prepareNotificationDanger("Error al actualizar", response.message);
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarTipoDocumento") {
            if(validate()) {
                setOpen(true);
                if(urlFragment === "nuevoTipoDocumento") setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"});
                if(urlFragment === "editarTipoDocumento") setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/tiposDocumento")
        }
    }

    const getData = async () => {
        const response = await getTipoDocumentoByCodigoTipoDocumento(elementId);
        if(response.status === 200) {
            const data = response.body.data;
            setCodigoTipoDocumento({value:data.c_tipodocumento, isValid: true});
            setDescripcion({value:data.c_descripcion, isValid: true});
            setNumeroDigitos({value:data.n_numerodigitos, isValid: true});
            setEstado(data.c_estado);
        }else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    useEffect(async () => {
        await setIsLoading(true);
        setButtonAttributes(buttonTypes[urlFragment]);
        if(urlFragment !== "nuevoTipoDocumento") await getData();
        setIsLoading(false);
    }, [])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification}
            goList={()=>history.push("/tiposDocumento")} view={readOnlyView}>
                <InputComponent
                    state={codigoTipoDocumento}
                    setState={setCodigoTipoDocumento}
                    type="text"
                    label="Tipo de documento"
                    placeholder="Tipo de documento"
                    inputId="codigoTipoDocumentoInput"
                    validation="numberAndTextWithRange"
                    min={1}
                    max={3}
                    readOnly={readOnlyCode}
                />
                <InputComponent
                    state={descripcion}
                    setState={setDescripcion}
                    type="text"
                    label="Descripción"
                    placeholder="Descripción"
                    inputId="numeroDigitosInput"
                    validation="name"
                    max={60}
                    readOnly={readOnlyView}
                />
                <InputComponent
                    state={numeroDigitos}
                    setState={setNumeroDigitos}
                    type="text"
                    label="N° de dígitos"
                    placeholder="N° de dígitos"
                    inputId="numeroDigitosInput"
                    validation="number"
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

export default TipoDocumentoForm