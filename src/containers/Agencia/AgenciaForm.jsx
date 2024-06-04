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
import { getAgenciaByCodigoAgencia, registerAgencia, updateAgencia, listCompanias, listAllCompanias } from '../../Api/Api'

const AgenciaForm = (props) => {
    //Estados
    const [compania, setCompania] = useState("");
    const [agenciacodigo, setAgenciacodigo] = useState({value: "", isValid:null});
    const [descripcion, setDescripcion] = useState({value: "", isValid:null});
    const [estado, setEstado] = useState("A");
    const [companias, setCompanias] = useState([]);
    const [flagCU, setFlagCU] = useState("N");
    const [flagVTC, setFlagVTC] = useState("S");
    const [sufijoPrestamo, setSufijoPrestamo] = useState({value: ""});
    const [sufijoProducto, setSufijoProducto] = useState({value: ""});
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
        nuevoAgencia: {label:"Guardar", class:"btn btn-primary btn-form"},
        editarAgencia: {label:"Actualizar", class:"btn btn-warning btn-form"},
        visualizarAgencia: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    const readOnlyView = urlFragment === "visualizarAgencia" ? true : false;
    const readOnlyCode = urlFragment !== "nuevoAgencia" ? true : false;

    const formFunctions = {
        nuevoAgencia: ()=> handleRegister(),
        editarAgencia: ()=> handleUpdate()
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/agencias"});
        setOpenResponseModal(true);
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if(!compania || !agenciacodigo.isValid  || !descripcion.isValid) return false;
        return true;
    }

    const prepareData = () => {
        const data = {
            c_compania: compania,
            c_agencia: agenciacodigo.value,
            c_descripcion: descripcion.value,
            c_estado: estado,
            c_flagvalidacju: flagCU,
            validatransaccionconfirmada: flagVTC
        }
        return data;
    }

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_usuarioregistro = userLogedIn;
        const response = await registerAgencia(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito la agencia") : prepareNotificationDanger("Error al registrar", response.message);
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        const response = await updateAgencia(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito la agencia") : prepareNotificationDanger("Error al actualizar", response.message);
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarAgencia") {
            if(validate()) {
                setOpen(true);
                if(urlFragment === "nuevoAgencia") setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"});
                if(urlFragment === "editarAgencia") setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/agencias")
        }
    }

    const getData = async () => {
        const [c_compania, c_agencia] = elementId.split('-');
        const response = await getAgenciaByCodigoAgencia({c_compania:c_compania, c_agencia:c_agencia});
        if(response.status === 200) {
            const data = response.body.data;
            setCompania(data.c_compania);
            setAgenciacodigo({value:data.c_agencia, isValid: true});
            setDescripcion({value:data.c_descripcion, isValid: true});
            setEstado(data.c_estado);
            setFlagCU(data.c_flagvalidacju);
            setFlagVTC(data.validatransaccionconfirmada);
            setSufijoPrestamo({value:data.c_sufijoprestamo});
            setSufijoProducto({value:data.c_sufijoproducto});
        }else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    const getCompanias = async () => {
        const response = await listCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }

    useEffect(async () => {
        await setIsLoading(true);
        await getCompanias();
        setButtonAttributes(buttonTypes[urlFragment]);
        if(urlFragment !== "nuevoAgencia") await getData();
        setIsLoading(false);
    }, [])

    useEffect(() => {
        if(urlFragment === "nuevoAgencia" && companias.length !== 0) setCompania(companias[0].c_compania)
    }, [companias])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification}
            goList={()=>history.push("/agencias")} view={readOnlyView}>
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
                    label="Código de agencia"
                    state={agenciacodigo}
                    setState={setAgenciacodigo}
                    type="text"
                    placeholder="Código de agencia"
                    inputId="agenciacodigoId"
                    validation="numberAndTextWithRange"
                    min={1}
                    max={2}
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
                <SelectComponent
                    labelText="Flag Usuario"
                    defaultValue="Seleccione"
                    items={[{name: "Si", value:"S"}, {name: "No", value:"N"}]}
                    selectId="estadoId"
                    valueField="value"
                    optionField="name"
                    valueSelected={flagCU}
                    handleChange={setFlagCU}
                    disabledElement={readOnlyView}
                />
                <SelectComponent
                    labelText="Flag Valida Transac. Conf."
                    defaultValue="Seleccione"
                    items={[{name: "Si", value:"S"}, {name: "No", value:"N"}]}
                    selectId="estadoId"
                    valueField="value"
                    optionField="name"
                    valueSelected={flagVTC}
                    handleChange={setFlagVTC}
                    disabledElement={readOnlyView}
                />
                <InputComponent
                    label="Sufijo Préstamo"
                    state={sufijoPrestamo}
                    setState={setSufijoPrestamo}
                    type="text"
                    placeholder="Sufijo Préstamo"
                    inputId="sufijoPrestamoId"
                    readOnly={true}
                />
                <InputComponent
                    label="Sufijo Producto"
                    state={sufijoProducto}
                    setState={setSufijoProducto}
                    type="text"
                    placeholder="Sufijo Producto"
                    inputId="sufijoProductoId"
                    readOnly={true}
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

export default AgenciaForm