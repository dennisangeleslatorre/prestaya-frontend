import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router';
import Loading from '../../components/Modal/LoadingModal';
import { PDFViewer, usePDF } from '@react-pdf/renderer';
import Spinner from '../../components/Spinner/Spinner';
import FormContainer from '../../components/FormContainer/FormContainer';
import TicketVentaTerceroPdfComponent from '../../components/TicketVentaTerceroPdfComponent/TicketVentaTerceroPdfComponent';
import { obtenerDatosTicketVentaTercero } from '../../Api/Api';
import ResponseModal from '../../components/Modal/ResponseModal';
const TicketVentaTercero = () => {
    let history = useHistory();
    const { id, clientes } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [dataTickets, setDataTickets] = useState([]);
    const [instance, updateInstance] = usePDF({ document: TicketVentaTerceroPdfComponent({dataTickets})});
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({title:"Aviso", message:""})

    const renderPDF = () => {
        if(instance.isLoading) return <Spinner/>;
        if(instance.error) return <center>{instance.error}</center>;
        return <PDFViewer
        className="col-12"
        style={{height: "800px"}}
        children={<TicketVentaTerceroPdfComponent dataTickets={dataTickets} />}
        />;
    }

    const convertDataToTicket = (datos) => {
      const recibosClientes = [];
      datos.forEach(item => {
        const { agencia_nombre, OPERACION, c_nombrescompleto, c_numerodocumento, c_ultimousuarioventa, compania_desc, compania_distrito,
          compania_ruc, compnaia_direccion, d_fecha_remate, d_fecha_remate_registrada, n_cliente,
          c_descripcionproducto, c_tipoproducto, n_cantidad, n_linea, n_montocap, n_montoint, n_montototal, tipo_producto_descripcion,
          c_prestamo
        } = item;

        const foundIndex = recibosClientes.findIndex(element => element.agencia_nombre === agencia_nombre && element.OPERACION === OPERACION
          && element.c_nombrescompleto === c_nombrescompleto && element.c_numerodocumento === c_numerodocumento && element.c_ultimousuarioventa === c_ultimousuarioventa
          && element.compania_desc === compania_desc && element.compania_distrito === compania_distrito && element.compania_ruc === compania_ruc
          && element.compnaia_direccion === compnaia_direccion && element.d_fecha_remate === d_fecha_remate && element.d_fecha_remate_registrada === d_fecha_remate_registrada
          && element.n_cliente === n_cliente && element.c_prestamo === c_prestamo );

          const producto = { c_descripcionproducto, c_tipoproducto, n_cantidad, n_linea, n_montocap, n_montoint, n_montototal, tipo_producto_descripcion }

          if (foundIndex === -1) {
            recibosClientes.push({agencia_nombre, OPERACION, c_nombrescompleto, c_numerodocumento, c_ultimousuarioventa, compania_desc, compania_distrito,
            compania_ruc, compnaia_direccion, d_fecha_remate, d_fecha_remate_registrada, n_cliente, productos:[producto], total: Number(n_montototal),
            c_prestamo
            });
          } else {
            recibosClientes[foundIndex].productos.push(producto);
            recibosClientes[foundIndex].total = recibosClientes[foundIndex].total +  Number(n_montototal);
          }
      });
      setDataTickets(recibosClientes);
    }

    const getDataForTicket = async () => {
      const [c_compania, c_prestamo] = id.split('-');
      const response = await obtenerDatosTicketVentaTercero({c_compania:c_compania, c_prestamo:c_prestamo, clientes:clientes});
      if(response.body && response.body.data) {
        convertDataToTicket(response.body.data);
      } else {
        setResponseData({title:"Aviso", message:response.message|"Error al obtener datos"});
        setOpenResponseModal(true);
      }
      setIsLoading(false);
    }

    useEffect(() => {
      setIsLoading(true);
      getDataForTicket();
    }, [])

  return (
    <>
      <FormContainer showButton={false} view={false} textButtonReturn="Regresar" goList={()=>history.push(`/visualizarPrestamo/${id}`)}>
      { renderPDF() }
      </FormContainer>
      {isLoading === true && <Loading/>}
      <ResponseModal
        isOpen={openResponseModal}
        title={responseData.title}
        onClose={()=>setOpenResponseModal(false)}
        message={responseData.message}
      >
      </ResponseModal>
    </>
  )
}

export default TicketVentaTercero