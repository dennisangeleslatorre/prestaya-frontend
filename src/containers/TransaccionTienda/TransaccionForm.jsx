import React, { useContext, useEffect, useState } from 'react'
//Componentes
import FormContainer from '../../components/FormContainer/FormContainer'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import UserContext from '../../context/UserContext/UserContext'
//Functions
import { useLocation, useHistory, useParams } from 'react-router'

const TransaccionForm = () => {
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
  const { compania, agencia } = useParams();
  let history = useHistory();
  const location = useLocation();
  const urlFragment = location.pathname.split('/')[1];
  const buttonTypes = {
        nuevaTransaccion: {label:"Guardar", class:"btn btn-primary btn-form"},
        visualizarTransaccion: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    //const readOnlyView = urlFragment === "visualizarTransaccion" ? true : false;
    const formFunctions = {
      nuevaTransaccion: ()=> handleRegister()
    }
    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/transacionestienda"});
        setOpenResponseModal(true);
    }
    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    /*const validate = () => {
        if(!perfil.isValid || !codigo.isValid || paginas.length === 0) return false;
        return true;
    }*/

    /*const prepareData = () => {
        const data = {
            n_perfil: perfil.value,
            c_codigoperfil: codigo.value.toUpperCase(),
            c_paginas: paginas.reduce((value, cvv)=>cvv=`${value},${cvv}`),
            c_estado: estado
        }
        return data;
    }*/

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_usuarioregistro = userLogedIn;
        //const response = await registerPerfil(data);
        /*if (response && response.status === 200) {
            prepareNotificationSuccess("Se registró con éxito la transaccion");
            assignReportesToProfile();
        } else
            prepareNotificationDanger("Error al registrar", response.message)*/
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarTransaccion") {
            if(validate()) {
                setOpen(true);
                if(urlFragment === "nuevaTransaccion") setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"});
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/transacionestienda")
        }
    }

    const getData = async () => {
        /*await getPaginasByPerfilFunction();
        await getReportesByPerfilFunction();*/
    }

    useEffect(async () => {
        setButtonAttributes(buttonTypes[urlFragment]);
        /*await setIsLoading(true);
        await getReportesFunction()
        
        if(urlFragment !== "nuevoPerfil") await getData();
        setIsLoading(false);*/
    }, [])

  return (
    <>
      <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification} showButton={urlFragment !== 'visualizarPrestamo'}
              goList={()=>history.push(`/nuevaTransaccion`)} view={false}>
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

export default TransaccionForm