import React, { useContext, useEffect, useState } from 'react'
//Componentes
import FormDataPrestamo from '../../components/FormDataPrestamo/FormDataPrestamo'
import FormContainer from '../../components/FormContainer/FormContainer'
import FormCancelaciones from '../../components/FormCancelaciones/FormCancelaciones'
import Loading from '../../components/Modal/LoadingModal'
//Functions
import { useHistory } from 'react-router'

const Cancelaciones = (props) => {
    //Navegacion
    let history = useHistory();
    //Estados del formulario
    const [isLoading, setIsLoading] = useState(false);
    const [fechaDesembolsoPrestamo, setFechaDesembolsoPrestamo] = useState("");
    const elementId = props.match.params.id;
    return (
        <>
            <FormContainer showButton={false} view={false} textButtonReturn="Ir Prestamos" goList={()=>history.push("/prestamos")}>
                <FormDataPrestamo setIsLoading={setIsLoading} elementId={elementId} setFechaDesembolsoPrestamo={setFechaDesembolsoPrestamo}/>
                <FormCancelaciones elementId={elementId} fechaDesembolsoPrestamo={fechaDesembolsoPrestamo}/>
            </FormContainer>
            {isLoading === true && <Loading/>}
        </>
    )
}

export default Cancelaciones