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
import { getPeriodosByCodigoPeriodos, registerPeriodo, updatePeriodo, listCompanias } from '../../Api/Api'

const PeriodoForm = (props) => {
    const [compania, setCompania] = useState("");
    const [tipoPeriodo, setTipoPeriodo] = useState("PECO000001");
    const [periodo, setPeriodo] = useState({value:"", isValid:null});
    const [estado, setEstado] = useState("A");
    const [companias, setCompanias] = useState([]);
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
        nuevoPeriodo: {label:"Guardar", class:"btn btn-primary btn-form"},
        editarPeriodo: {label:"Actualizar", class:"btn btn-warning btn-form"},
        visualizarPeriodo: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    const readOnlyView = urlFragment === "visualizarPeriodo" ? true : false;
    const readOnlyCode = urlFragment !== "nuevoPeriodo" ? true : false;

    const formFunctions = {
        nuevoPeriodo: ()=> handleRegister(),
        editarPeriodo: ()=> handleUpdate()
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/periodos"});
        setOpenResponseModal(true);
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if(!compania || !tipoPeriodo  || !periodo.isValid) return false;
        return true;
    }

    const prepareData = () => {
        const data = {
            c_compania: compania,
            c_tipoperiodo: tipoPeriodo,
            c_periodo: periodo.value,
            c_estado: estado
        }
        return data;
    }

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_usuarioregistro = userLogedIn;
        const response = await registerPeriodo(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito el período") : prepareNotificationDanger("Error al registrar", response.message);
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        const response = await updatePeriodo(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el período") : prepareNotificationDanger("Error al actualizar", response.message);
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarPeriodo") {
            if(validate()) {
                setOpen(true);
                if(urlFragment === "nuevoPeriodo") setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"});
                if(urlFragment === "editarPeriodo") setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/periodos")
        }
    }

    const getData = async () => {
        const [c_compania, c_tipoperiodo] = elementId.split('-');
        const response = await getPeriodosByCodigoPeriodos({c_compania:c_compania, c_tipoperiodo:c_tipoperiodo});
        if(response.status === 200) {
            const data = response.body.data;
            setCompania(data.c_compania);
            setTipoPeriodo(data.c_tipoperiodo);
            setPeriodo({value:data.c_periodo, isValid: true});
            setEstado(data.c_estado);
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
        if(urlFragment !== "nuevoPeriodo") await getData();
        setIsLoading(false);
    }, [])

    useEffect(() => {
        if(urlFragment === "nuevoPeriodo" && companias.length !== 0) setCompania(companias[0].c_compania)
    }, [companias])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification}
            goList={()=>history.push("/periodos")} view={readOnlyView}>
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
                <SelectComponent
                    labelText="Tipo de período"
                    defaultValue="Seleccione un tipo"
                    items={[{name: "Periodo para controlar los cierres de mes", value:"PECO000001"}]}
                    selectId="tipoId"
                    valueField="value"
                    optionField="name"
                    valueSelected={tipoPeriodo}
                    handleChange={setTipoPeriodo}
                    disabledElement={readOnlyCode}
                />
                <InputComponent
                    label="Período"
                    state={periodo}
                    setState={setPeriodo}
                    type="text"
                    placeholder="Período"
                    inputId="periodoId"
                    validation="number"
                    max={6}
                    readOnly={readOnlyCode}
                />
                <SelectComponent
                    labelText="Estado"
                    defaultValue="Seleccione un estado"
                    items={[{name: "Abierto", value:"A"}, {name: "Cerrado", value:"C"}]}
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

export default PeriodoForm