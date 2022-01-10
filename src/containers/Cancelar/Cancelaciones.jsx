import React, { useContext, useEffect, useState } from 'react'
//Componentes
import FormDataPrestamo from '../../components/FormDataPrestamo/FormDataPrestamo'
import FormContainer from '../../components/FormContainer/FormContainer'
import FormCancelaciones from '../../components/FormCancelaciones/FormCancelaciones'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import UserContext from '../../context/UserContext/UserContext'
//Functions
import { useLocation, useHistory } from 'react-router'
import { addDaysToDate } from '../../utilities/Functions/AddDaysToDate';

const Cancelaciones = (props) => {
    //Estados del formulario
    const [isLoading, setIsLoading] = useState(false);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});

    return (
        <>
            <FormContainer showButton={false} view={false} textButtonReturn="Ir Prestamos" goList={()=>history.push("/prestamos")}>
                <FormDataPrestamo setIsLoading={setIsLoading}/>
                <FormCancelaciones/>
            </FormContainer>
            {isLoading === true && <Loading/>}
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

export default Cancelaciones