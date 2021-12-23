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
import { getParametrosByCodigoParametros, registerParametro, updateParametro, listCompanias, listAllCompanias } from '../../Api/Api'

const ParametroForm = (props) => {
    const [compania, setCompania] = useState("");
    const [parametroCodigo, setParametroCodigo] = useState({value:"", isValid:null});
    const [descripcion, setDescripcion] = useState({value: "", isValid:null});
    const [tipoValor, setTipoValor] = useState("");
    const [valorNumero, setValorNumero] = useState({value: "", isValid:null});
    const [valorFecha, setValorFecha] = useState({value: "", isValid:null});
    const [valorTexto, setValorTexto] = useState("");
    const [estado, setEstado] = useState("A");
    const [companias, setCompanias] = useState([]);
    const tipoValorItem = {
        N: "n_valornumero",
        F: "d_valorfecha",
        T: "c_valortexto"
    }
    const tipoValorRespuesta = {
        N: valorNumero.value,
        F: valorFecha.value,
        T: valorTexto
    }
    const tipoValorEstablecer = {
        N: (numero) => setValorNumero({value:numero, isValid:true}),
        F: (fecha) => setValorFecha({value:fecha, isValid:true}),
        T: (texto) => setValorTexto(texto)
    }
    const tipoValorValidate = {
        N: !valorNumero.isValid,
        F: !valorFecha.isValid,
        T: !valorTexto
    }
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
        nuevoParametro: {label:"Guardar", class:"btn btn-primary btn-form"},
        editarParametro: {label:"Actualizar", class:"btn btn-warning btn-form"},
        visualizarParametro: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    const readOnlyView = urlFragment === "visualizarParametro" ? true : false;
    const readOnlyCode = urlFragment !== "nuevoParametro" ? true : false;

    const formFunctions = {
        nuevoParametro: ()=> handleRegister(),
        editarParametro: ()=> handleUpdate()
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/parametros"});
        setOpenResponseModal(true);
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if(!compania || !parametroCodigo.isValid  || !descripcion.value || !tipoValor || tipoValorValidate[tipoValor]) return false;
        return true;
    }

    const prepareData = () => {
        const data = {
            c_compania: compania,
            c_parametrocodigo: parametroCodigo.value,
            c_descripcion: descripcion.value,
            c_tipovalor: tipoValor,
            c_estado: estado
        }
        data[tipoValorItem[tipoValor]] = tipoValorRespuesta[tipoValor];
        console.log("data", data);
        return data;
    }

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_usuarioregistro = userLogedIn;
        const response = await registerParametro(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito el parámetro") : prepareNotificationDanger("Error al registrar", response.message);
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        const response = await updateParametro(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el parámetro") : prepareNotificationDanger("Error al actualizar", response.message);
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarParametro") {
            if(validate()) {
                setOpen(true);
                if(urlFragment === "nuevoParametro") setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"});
                if(urlFragment === "editarParametro") setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/parametros")
        }
    }

    const getData = async () => {
        const [c_compania, c_parametrocodigo] = elementId.split('-');
        const response = await getParametrosByCodigoParametros({c_compania:c_compania, c_parametrocodigo:c_parametrocodigo});
        if(response.status === 200) {
            const data = response.body.data;
            setCompania(data.c_compania);
            setParametroCodigo({value:data.c_parametrocodigo, isValid: true});
            setDescripcion({value:data.c_descripcion, isValid: true});
            setTipoValor(data.c_tipovalor);
            setEstado(data.c_estado);
            tipoValorEstablecer[data.c_tipovalor](data[tipoValorItem[data.c_tipovalor]]);
        }else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    const getCompanias = async () => {
        const response = urlFragment === "nuevoParametro" ? await listCompanias() : await listAllCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }

    useEffect(async () => {
        await setIsLoading(true);
        await getCompanias();
        setButtonAttributes(buttonTypes[urlFragment]);
        if(urlFragment !== "nuevoParametro") await getData();
        setIsLoading(false);
    }, [])

    useEffect(() => {
        if(urlFragment === "nuevoParametro" && companias.length !== 0) setCompania(companias[0].c_compania)
    }, [companias])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification}
            goList={()=>history.push("/parametros")} view={readOnlyView}>
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
                    label="Código parámetro"
                    state={parametroCodigo}
                    setState={setParametroCodigo}
                    type="text"
                    placeholder="Código parámetro"
                    inputId="parametrocodigoId"
                    validation="numberAndTextWithRange"
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
                    max={60}
                    readOnly={readOnlyView}
                />
                <SelectComponent
                    labelText="Tipo de valor"
                    defaultValue="Seleccione un tipo"
                    items={[{name: "NÚMERO", value:"N"}, {name: "FECHA", value:"F"}, {name: "TEXTO", value:"T"}]}
                    selectId="tipoValorId"
                    valueField="value"
                    optionField="name"
                    valueSelected={tipoValor}
                    handleChange={setTipoValor}
                    disabledElement={readOnlyView}
                />
                { tipoValor === "N" && <InputComponent
                    label="Valor numérico"
                    state={valorNumero}
                    setState={setValorNumero}
                    type="text"
                    placeholder="Valor numérico"
                    inputId="valorNumeroId"
                    validation="decimalNumber"
                    max={20}
                    readOnly={readOnlyView}
                /> }
                { tipoValor === "F" && <InputComponent
                    label="Valor fecha"
                    state={valorFecha}
                    setState={setValorFecha}
                    type="date"
                    placeholder="Valor fecha"
                    inputId="valorFechaId"
                    readOnly={readOnlyView}
                /> }
                { tipoValor === "T" && <TextareaComponent
                    inputId="valorTextoId"
                    label="Valor texto"
                    placeholder="Valor texto"
                    value={valorTexto}
                    setState={setValorTexto}
                    max={500}
                    readOnly={readOnlyView}
                /> }
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

export default ParametroForm