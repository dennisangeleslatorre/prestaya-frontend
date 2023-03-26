import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router';
import Loading from '../../components/Modal/LoadingModal';
import { PDFViewer, usePDF } from '@react-pdf/renderer';
import Spinner from '../../components/Spinner/Spinner';
import FormContainer from '../../components/FormContainer/FormContainer';
import TicketVentaTiendaPdfComponent from '../../components/TicketVentaTiendaPdfComponent/TicketVentaTiendaPdfComponent';
import { getTransaccionCabecera, getTransaccionDetalle } from '../../Api/Api';
import ResponseModal from '../../components/Modal/ResponseModal';

const TicketVentaTienda = () => {
    let history = useHistory();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [cabecera, setCabecera] = useState({});
    const [detalles, setDetalles] = useState([])
    const [instance, updateInstance] = usePDF({ document: TicketVentaTiendaPdfComponent({cabecera, detalles})});
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({title:"Aviso", message:""})

    const renderPDF = () => {
        if(instance.isLoading) return <Spinner/>;
        if(instance.error) return <center>{instance.error}</center>;
        return <PDFViewer
        className="col-12"
        style={{height: "800px"}}
        children={<TicketVentaTiendaPdfComponent cabecera={cabecera} detalles={detalles} />}
        />;
    }

    const getDetalles = async () => {
      const [compania, agencia, tipodocumento, numerodocumento] = id.split('-');
      const response = await getTransaccionDetalle({ c_compania:compania, c_agencia:agencia, c_tipodocumento:tipodocumento, c_numerodocumento:numerodocumento });
      if( response.status == 200 && response.body && response.body.data && response.body.data.length > 0) {
        setDetalles(response.body.data);
      } else {
        setResponseData({title:"Aviso", message:response.message?response.message:"Error al obtener datos"});
        setOpenResponseModal(true);
      }
      setIsLoading(false);
    }

    const getDataCabecera = async () => {
      const [compania, agencia, tipodocumento, numerodocumento] = id.split('-');
      const response = await getTransaccionCabecera({ c_compania:compania, c_agencia:agencia, c_tipodocumento:tipodocumento, c_numerodocumento:numerodocumento });
      if( response.status == 200 && response.body && response.body.data ) {
        setCabecera(response.body.data);
        getDetalles();
      } else {
        setResponseData({title:"Aviso", message:response.message?response.message:"Error al obtener datos"});
        setOpenResponseModal(true);
      }
    }

    useEffect(() => {
      setIsLoading(true);
      getDataCabecera();
    }, [])

  return (
    <>
      <FormContainer showButton={false} view={false} textButtonReturn="Regresar" goList={()=>history.push(`/transacionestienda/`)}>
      { renderPDF() }
      </FormContainer>
      {isLoading === true && <Loading/>}
      <ResponseModal
        isOpen={openResponseModal}
        title={responseData.title}
        onClose={()=>setOpenResponseModal(false)}
        message={responseData.message}
        buttonLinkView={'/transacionestienda/'}
      >
      </ResponseModal>
    </>
  )
}

export default TicketVentaTienda