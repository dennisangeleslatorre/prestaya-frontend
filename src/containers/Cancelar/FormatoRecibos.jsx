import React, { useState, useEffect } from 'react'
import FormContainer from '../../components/FormContainer/FormContainer';
import FormDataPrestamo from '../../components/FormDataPrestamo/FormDataPrestamo';
import { useParams, useHistory } from 'react-router';
import { getPrestamoByCodigoPrestamoParaTicket, getCancelacionesByNLinea } from '../../Api/Api';
import { getProductosByPrestamo } from '../../Api/Comercial/prestamoProducto.service';
import TicketPdfComponent from '../../components/TicketPdfComponent/TicketPdfComponent';
import Loading from '../../components/Modal/LoadingModal';
import { PDFViewer, usePDF } from '@react-pdf/renderer';
import Spinner from '../../components/Spinner/Spinner';

const FormatoRecibos = () => {
    let history = useHistory();
    const { id, nLineas } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [prestamo, setPrestamo] = useState(null);
    const [cancelaciones, setCancelaciones] = useState([]);
    const [productos, setProductos] = useState([]);
    const [nLineasFormatos, setNLineasFormatos] = useState([]);
    const [instance, updateInstance] = usePDF({ document: TicketPdfComponent({cancelaciones, prestamo, productos}) });

    const getPrestamoByCodigo = async () => {
        const [c_compania, c_prestamo] = id.split('-');
        const response = await getPrestamoByCodigoPrestamoParaTicket({c_compania:c_compania, c_prestamo:c_prestamo});
        if(response.status === 200 && response.body && response.body.data) {
            setPrestamo(response.body.data);
        }
    }

    const getCancelaciones = async () => {
        const [c_compania, c_prestamo] = id.split('-');
        const response = await getCancelacionesByNLinea({c_compania:c_compania, c_prestamo:c_prestamo});
        if(response && response.status === 200 && response.body.data) {
            setCancelaciones(response.body.data);
            setNLineasFormatos(nLineas.split(',').map(item => Number(item)));
        }
    }

    const getProductos = async () => {
        const [c_compania, c_prestamo] = id.split('-');
        const responseProducts = await getProductosByPrestamo({c_compania:c_compania, c_prestamo:c_prestamo});
        if( responseProducts && responseProducts.status === 200 && responseProducts.body.data ) setProductos(responseProducts.body.data);
    }

    const getData = async () => {
        await getPrestamoByCodigo();
        await getProductos();
        await getCancelaciones();
    };

    const renderPDF = () => {
        if(instance.isLoading) return <Spinner/>;
        if(instance.error) return <center>{instance.error}</center>;
        return <PDFViewer
        className="col-12"
        style={{height: "800px"}}
        children={<TicketPdfComponent prestamo={prestamo} cancelaciones={cancelaciones} productos={productos} nLineasFormatos={nLineasFormatos} />}
        />;
    }

    useEffect( async () => {
        await setIsLoading(true);
        await getData();
    }, []);

    return (
        <>
            <FormContainer showButton={false} view={false} textButtonReturn="Regresar" goList={()=>history.push(`/cancelaciones/${id}`)}>
                <FormDataPrestamo setIsLoading={setIsLoading} prestamo={prestamo} elementId={id} setFechaDesembolsoPrestamo={()=>{}} setEstadoPrestamo={()=>{}}/>
                { renderPDF() }
            </FormContainer>
            {isLoading === true && <Loading/>}
        </>
    )
}

export default FormatoRecibos