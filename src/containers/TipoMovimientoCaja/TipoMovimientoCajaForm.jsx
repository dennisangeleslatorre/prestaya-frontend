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
import { getTipoMovimientoCajaByCodigoTipoMovimientoCaja, registerTipoMovimientoCaja, updateTipoMovimientoCaja, listAllTipoMovimientoCaja } from '../../Api/Api'

const TipoMovimientoCajaForm = (props) => {
    //Estados
    const [codigoTipoMovimientoCaja, setCodigoTipoMovimientoCaja] = useState({value: "", isValid:null});
    const [descripcion, setDescripcion] = useState({value: "", isValid:null});
    const [flagUsuario, setFlagUsuario] = useState("S");
    const [claseTipoMovimiento, setClaseTipoMovimiento] = useState("I");
    const [estado, setEstado] = useState("A");
    const [flagSinMonto, setFlagSinMonto] = useState("N");
    const [flagConfirmar, setFlagConfirmar] = useState("N");
    const [movimientoInverso, setMovimientoInverso] = useState("");
    const [tiposMovimientos, setTiposMovimientos] = useState([]);
    const [flagOtraAgencia, setFlagOtraAgencia] = useState("N");
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
        nuevoTipoMovimientoCaja: {label:"Guardar", class:"btn btn-primary btn-form"},
        editarTipoMovimientoCaja: {label:"Actualizar", class:"btn btn-warning btn-form"},
        visualizarTipoMovimientoCaja: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    const readOnlyView = urlFragment === "visualizarTipoMovimientoCaja" ? true : false;
    const readOnlyCode = urlFragment !== "nuevoTipoMovimientoCaja" ? true : false;

    const formFunctions = {
        nuevoTipoMovimientoCaja: ()=> handleRegister(),
        editarTipoMovimientoCaja: ()=> handleUpdate()
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/tiposMovimientosCaja"});
        setOpenResponseModal(true);
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if(!codigoTipoMovimientoCaja.isValid || !descripcion.isValid) return false;
        return true;
    }

    const prepareData = () => {
        const data = {
            c_tipomovimientocc: codigoTipoMovimientoCaja.value.toUpperCase(),
            c_descricpion: descripcion.value,
            c_clasetipomov: claseTipoMovimiento,
            c_flagusuario: flagUsuario,
            c_estado: estado,
            c_flagsinmonto: flagSinMonto,
            c_flagxconfirmar: flagConfirmar,
            c_tipomovimientoccinverso: movimientoInverso ? movimientoInverso : null,
            c_flagotraagencia: flagOtraAgencia
        }
        return data;
    }

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_usuarioregistro = userLogedIn;
        const response = await registerTipoMovimientoCaja(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito el tipo de movimiento de caja") : prepareNotificationDanger("Error al registrar", response.message);
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        const response = await updateTipoMovimientoCaja({body:data, id:elementId});
        (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el tipo de movimiento de caja") : prepareNotificationDanger("Error al actualizar", response.message);
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarTipoMovimientoCaja") {
            if(validate()) {
                setOpen(true);
                if(urlFragment === "nuevoTipoMovimientoCaja") setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"});
                if(urlFragment === "editarTipoMovimientoCaja") setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/tiposMovimientosCaja")
        }
    }

    const getData = async () => {
        const response = await getTipoMovimientoCajaByCodigoTipoMovimientoCaja(elementId);
        if(response.status === 200) {
            const data = response.body.data;
            setCodigoTipoMovimientoCaja({value:data.c_tipomovimientocc, isValid: true});
            setDescripcion({value:data.c_descricpion, isValid: true});
            setClaseTipoMovimiento(data.c_clasetipomov);
            setFlagUsuario(data.c_flagusuario);
            setEstado(data.c_estado);
            setFlagSinMonto(data.c_flagsinmonto);
            setFlagConfirmar(data.c_flagxconfirmar);
            setMovimientoInverso(data.c_tipomovimientoccinverso || "");
            setFlagOtraAgencia(data.c_flagotraagencia || "N");
        }else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    const getTiposMovimientosCaja = async () => {
        const response = await listAllTipoMovimientoCaja();
        if(response && response.status === 200 && response.body.data) setTiposMovimientos(response.body.data);
    }

    useEffect(async () => {
        await setIsLoading(true);
        getTiposMovimientosCaja();
        setButtonAttributes(buttonTypes[urlFragment]);
        if(urlFragment !== "nuevoTipoMovimientoCaja") await getData();
        setIsLoading(false);
    }, [])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification}
            goList={()=>history.push("/tiposMovimientosCaja")} view={readOnlyView}>
                <InputComponent
                    state={codigoTipoMovimientoCaja}
                    setState={setCodigoTipoMovimientoCaja}
                    type="text"
                    label="Tipo de Movimiento"
                    placeholder="Tipo de movimiento"
                    inputId="codigoTipoMovimientoInput"
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
                <SelectComponent
                    labelText="Clase"
                    defaultValue="Seleccione una clase"
                    items={[{name: "Ingreso", value:"I"}, {name: "Salida", value:"S"}]}
                    selectId="claseId"
                    valueField="value"
                    optionField="name"
                    valueSelected={claseTipoMovimiento}
                    handleChange={setClaseTipoMovimiento}
                    disabledElement={readOnlyView}
                />
                <SelectComponent
                    labelText="Flag"
                    defaultValue="Seleccione un flag usuario"
                    items={[{name: "SI", value:"S"}, {name: "NO", value:"N"}]}
                    selectId="flagId"
                    valueField="value"
                    optionField="name"
                    valueSelected={flagUsuario}
                    handleChange={setFlagUsuario}
                    disabledElement={readOnlyView}
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
                    labelText="Flag sin monto"
                    defaultValue="Seleccione"
                    items={[{name: "SI", value:"S"}, {name: "NO", value:"N"}]}
                    selectId="flagSinMontoId"
                    valueField="value"
                    optionField="name"
                    valueSelected={flagSinMonto}
                    handleChange={setFlagSinMonto}
                    disabledElement={readOnlyView}
                />
                <SelectComponent
                    labelText="Flag confirmar"
                    defaultValue="Seleccione"
                    items={[{name: "SI", value:"S"}, {name: "NO", value:"N"}]}
                    selectId="flagConfirmarId"
                    valueField="value"
                    optionField="name"
                    valueSelected={flagConfirmar}
                    handleChange={setFlagConfirmar}
                    disabledElement={readOnlyView}
                />
                <SelectComponent
                    labelText="Mov. Inverso"
                    defaultValue="Sin movimiento"
                    items={tiposMovimientos}
                    selectId="movInversoId"
                    valueField="c_tipomovimientocc"
                    optionField="c_descricpion"
                    valueSelected={movimientoInverso}
                    handleChange={setMovimientoInverso}
                    disabledElement={readOnlyView}
                    disableDefaultValue={false}
                />
                <SelectComponent
                    labelText="Flag otra agencia"
                    defaultValue="Selecciona una agencia"
                    items={[{value: "N", option: "NO"},{value: "S", option: "SI"}]}
                    selectId="flagOtraAgenciad"
                    valueField="value"
                    optionField="option"
                    valueSelected={flagOtraAgencia}
                    handleChange={setFlagOtraAgencia}
                    disabledElement={readOnlyView}
                    disableDefaultValue={true}
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

export default TipoMovimientoCajaForm