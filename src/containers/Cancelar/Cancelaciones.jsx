import React, { useContext, useEffect, useState } from 'react'
//Componentes
import FormDataPrestamo from '../../components/FormDataPrestamo/FormDataPrestamo'
import FormContainer from '../../components/FormContainer/FormContainer'
import FormCancelaciones from '../../components/FormCancelaciones/FormCancelaciones'
import Loading from '../../components/Modal/LoadingModal'
//Functions
import { useHistory } from 'react-router'
import { getPrestamoByCodigoPrestamo, getCancelacionesByCodigoPrestamo } from '../../Api/Api'

const Cancelaciones = (props) => {
    //Navegacion
    let history = useHistory();
    //Estados del formulario
    const [isLoading, setIsLoading] = useState(false);
    const [fechaDesembolsoPrestamo, setFechaDesembolsoPrestamo] = useState("");
    const [estadoPrestamo, setEstadoPrestamo] = useState("");
    const [prestamo, setPrestamo] = useState(null);
    const [cancelaciones, setCancelaciones] = useState([]);
    const elementId = props.match.params.id;

    const getPrestamoByCodigo = async () => {
        const [c_compania, c_prestamo] = elementId.split('-');
        const response = await getPrestamoByCodigoPrestamo({c_compania:c_compania, c_prestamo:c_prestamo});
        if(response.status === 200 && response.body && response.body.data) {
            setPrestamo(response.body.data);
        }
    }

    const getCancelaciones = async () => {
        const [c_compania, c_prestamo] = elementId.split('-');
        const response = await getCancelacionesByCodigoPrestamo({c_compania:c_compania, c_prestamo:c_prestamo});
        if(response && response.status === 200 && response.body.data) {
            setCancelaciones(response.body.data);
        }
    }

    const getData = async () => {
        await getPrestamoByCodigo();
        await getCancelaciones();
    };

    useEffect( async () => {
        await setIsLoading(true);
        await getData();
        setIsLoading(true);
    }, []);

    return (
        <>
            <FormContainer showButton={false} view={false} textButtonReturn="Ir Prestamos" goList={()=>history.push(`/prestamos`)}>
                <FormDataPrestamo setIsLoading={setIsLoading} prestamo={prestamo} elementId={elementId} setFechaDesembolsoPrestamo={setFechaDesembolsoPrestamo} setEstadoPrestamo={setEstadoPrestamo}/>
                <FormCancelaciones getData={getData} elementId={elementId} fechaDesembolsoPrestamo={fechaDesembolsoPrestamo} estadoPrestamo={estadoPrestamo} cancelaciones={cancelaciones}/>
            </FormContainer>
            {isLoading === true && <Loading/>}
        </>
    )
}

export default Cancelaciones