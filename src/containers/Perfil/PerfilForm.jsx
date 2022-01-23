import React, { useContext, useEffect, useState } from 'react'
//Componentes
import FormContainer from '../../components/FormContainer/FormContainer'
import InputComponent from '../../components/InputComponent/InputComponent'
import TreeSelectComponent from '../../components/TreeSelectComponent/TreeSelectComponent'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import UserContext from '../../context/UserContext/UserContext'
//Functions
import { useLocation, useHistory } from 'react-router'
import { registerPerfil, getRoleByNPerfil, updatePerfil } from '../../Api/Api'
//utilities
import { pagesArray } from '../../utilities/PageHierarchy/PageHierarchy'

const PerfilForm = (props) => {
    //Estados
    const [perfil, setPerfil] = useState({value: "", isValid:null});
    const [codigo, setCodigo] = useState({value: "", isValid:null});
    const [paginas, setPaginas] = useState(['INICIO']);
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
        nuevoPerfil: {label:"Guardar", class:"btn btn-primary btn-form"},
        editarPerfil: {label:"Actualizar", class:"btn btn-warning btn-form"},
        visualizarPerfil: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    const readOnlyView = urlFragment === "visualizarPerfil" ? true : false;
    const readOnlyCode = urlFragment === "editarPerfil" ? true : false;

    const formFunctions = {
        nuevoPerfil: ()=> handleRegister(),
        editarPerfil: ()=> handleUpdate()
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/perfiles"});
        setOpenResponseModal(true);
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if(!perfil.isValid || !codigo.isValid || paginas.length === 0) return false;
        return true;
    }

    const prepareData = () => {
        const data = {
            n_perfil: perfil.value,
            c_codigoperfil: codigo.value.toUpperCase(),
            c_paginas: paginas.reduce((value, cvv)=>cvv=`${value},${cvv}`),
            c_estado: estado
        }
        return data;
    }

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_usuarioregistro = userLogedIn;
        const response = await registerPerfil(data);
        (response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito el perfil") : prepareNotificationDanger("Error al registrar", response.message);
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        const response = await updatePerfil({body:data, id:elementId});
        (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el perfil") : prepareNotificationDanger("Error al actualizar", response.message);
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarPerfil") {
            if(validate()) {
                setOpen(true);
                if(urlFragment === "nuevoPerfil") setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"});
                if(urlFragment === "editarPerfil") setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/perfiles")
        }
    }

    const getData = async () => {
        const response = await getRoleByNPerfil(elementId);
        if(response.status === 200) {
            const data = response.body.data;
            setPerfil({value:data.n_perfil, isValid: true});
            setCodigo({value:data.c_codigoperfil, isValid: true});
            setPaginas(data.c_paginas.split(','));
            setEstado(data.c_estado);
        }else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    useEffect(async () => {
        await setIsLoading(true);
        setButtonAttributes(buttonTypes[urlFragment]);
        if(urlFragment !== "nuevoPerfil") await getData();
        setIsLoading(false);
    }, [])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification}
            goList={()=>history.push("/perfiles")} view={readOnlyView}>
                <InputComponent
                    state={perfil}
                    setState={setPerfil}
                    type="text"
                    label="N° de perfil"
                    placeholder="Número de perfil"
                    inputId="perfilInput"
                    validation="numberWithRange"
                    min={1}
                    max={20}
                    readOnly={readOnlyView || readOnlyCode}
                />
                <InputComponent
                    state={codigo}
                    setState={setCodigo}
                    type="text"
                    label="Código de perfil"
                    placeholder="Código de perfil"
                    inputId="codeInput"
                    validation="textNumber"
                    readOnly={readOnlyView}
                    max={10}
                />
                <TreeSelectComponent
                    data={pagesArray}
                    value={paginas}
                    handleOnChange={(value)=>setPaginas(value)}
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

export default PerfilForm