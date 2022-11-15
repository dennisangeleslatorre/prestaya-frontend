import React, { useEffect, useState } from 'react';
import ReportContainer from '../../components/ReportContainer/ReportContainer';
import Loading from '../../components/Modal/LoadingModal';
import CabeceraFormatoCancelaciones from '../../components/CabeceraFormatoCancelaciones/CabeceraFormatoCancelaciones';
import ButtonDownloadExcel from '../../components/ButtonDownloadExcel/ButtonDownloadExcel';
import { useParams, useHistory } from 'react-router';
import { getPrestamoByCodigoPrestamoParaTicket, getCancelacionesByCodigoPrestamo, getProductosByPrestamo } from '../../Api/Api';
import { PDFViewer } from '@react-pdf/renderer';
import moment from 'moment';
import CancelacionesPdfComponent from '../../components/CancelacionesPdfComponent/CancelacionesPdfComponent';

const estadosPrestamo = {
  'PE':'PENDIENTE',
  'VI':'VIGENTE',
  'CA':'CANCELADO',
  'EN':'ENTREGADO',
  'RE':'REMATE',
  'AN':'ANULADO'
}

const tipoCancelaciones = {
  'C': 'CANCELACIÓN',
  'A': 'AMORTIZACIÓN',
  'R': 'RENOVACIÓN'
}

const estadosCancelaciones = {
  'VI': 'VIGENTE',
  'CA': 'CANCELADO',
  'RE': 'REMATE'
}

const columnsExportExcel = [
  {
      label: 'Linea',
      value: row => (row.n_linea || '')
  },
  {
      label: 'Fecha Vencimiento',
      value: row => (row.d_fechavencimiento_format || '')
  },
  {
      label: 'Monto Prestamo',
      value: row => (row.n_montoprestamo || '')
  },
  {
      label: 'Mnt. Intereses',
      value: row => (row.n_montointereses || '')
  },
  {
      label: 'Tipo Cancelación',
      value: row => (row.c_tipocancelacion || '')
  },
  {
      label: 'Fecha Cancelación',
      value: row => (row.d_fechacancelacion_format || '')
  },
  {
      label: 'Días Transcurridos',
      value: row => (row.n_diastranscurridos || '')
  },
  {
      label: 'Mnt. Intereses Diario',
      value: row => (row.n_montointeresesdiario || '')
  },
  {
      label: 'Mnt. Intereses a Cancelar',
      value: row => (row.n_montointeresescancelar || '')
  },
  {
      label: 'Mnt. Prestamo a Cancelar',
      value: row => (row.n_montoprestamocancelar || '')
  },
  {
      label: 'Mnt. Comisión',
      value: row => (row.n_montocomisioncancelar || '')
  },
  {
      label: 'Mnt. Total Cancelar',
      value: row => (row.n_montototalcancelar || '')
  },
  {
      label: 'Observaciones',
      value: row => (row.c_observacionescancelar || '')
  },
  {
      label: 'Estado',
      value: row => (row.c_estado || '')
  }
]

const FormatoCancelaciones = () => {
  let history = useHistory();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  //Estados
  const [tableCancelaciones, setTableCancelaciones] = useState([]);
  const [prestamo, setPrestamo] = useState(null);
  const [productos, setProductos] = useState([]);

  const getPrestamoByCodigo = async () => {
    const [c_compania, c_prestamo] = id.split('-');
    const response = await getPrestamoByCodigoPrestamoParaTicket({c_compania:c_compania, c_prestamo:c_prestamo});
    if(response.status === 200 && response.body && response.body.data) {
        setPrestamo(response.body.data);
      }
  }

  const getCancelaciones = async () => {
      const [c_compania, c_prestamo] = id.split('-');
      const response = await getCancelacionesByCodigoPrestamo({c_compania:c_compania, c_prestamo:c_prestamo});
      if(response && response.status === 200 && response.body.data) {
          getDataForTable(response.body.data);
      }
  }

  const getProductos = async () => {
      const [c_compania, c_prestamo] = id.split('-');
      const responseProducts = await getProductosByPrestamo({c_compania:c_compania, c_prestamo:c_prestamo});
      if( responseProducts && responseProducts.status === 200 && responseProducts.body.data ) setProductos(responseProducts.body.data);
  }

  const getDataForTable = (cancelaciones) => {
    const listAux = cancelaciones.map((item, index) => {
      item.key = index;
      item.d_fechavencimiento_format = item.d_fechavencimiento ? moment(item.d_fechavencimiento).format('DD/MM/yyyy') : "";
      item.d_fechacancelacion_format = item.d_fechacancelacion ? moment(item.d_fechacancelacion).format('DD/MM/yyyy') : "";
      item.d_fecharegistro_format = moment(item.d_fecharegistro).format('DD/MM/yyyy HH:mm:ss');
      item.d_ultimafechamodificacion_format = moment(item.d_ultimafechamodificacion).format('DD/MM/yyyy HH:mm:ss');
      item.n_montoprestamo = item.n_montoprestamo ? Number(item.n_montoprestamo).toFixed(2) : "";
      item.n_montointereses = item.n_montointereses ? Number(item.n_montointereses).toFixed(2) : "";
      item.n_montointeresesdiario = item.n_montointeresesdiario ? Number(item.n_montointeresesdiario).toFixed(4) : "";
      item.n_montointeresescancelar = item.n_montointeresescancelar ? Number(item.n_montointeresescancelar).toFixed(2) : "";
      item.n_montoprestamocancelar = item.n_montoprestamocancelar ? Number(item.n_montoprestamocancelar).toFixed(2) : "";
      item.n_montocomisioncancelar = item.n_montocomisioncancelar ? Number(item.n_montocomisioncancelar).toFixed(2) : "";
      item.n_montototalcancelar = item.n_montototalcancelar ? Number(item.n_montototalcancelar).toFixed(2) : "";
      item.c_tipocancelacion = tipoCancelaciones[item.c_tipocancelacion];
      item.c_estado = estadosCancelaciones[item.c_estado];
      return item;
    })
    setTableCancelaciones(listAux);
  }

  const getData = async () => {
    await getPrestamoByCodigo();
    await getProductos();
    await getCancelaciones();
  };

  useEffect( async () => {
    await setIsLoading(true);
    await getData();
    setIsLoading(false);
  }, []);

  return (
    <>
      <ReportContainer>
        <CabeceraFormatoCancelaciones prestamo={prestamo} estados={estadosPrestamo}/>
        <ButtonDownloadExcel
          fileName="cancelaciones"
          sheet="reporte"
          columns={columnsExportExcel}
          content={tableCancelaciones}
        />
        <PDFViewer
          className="col-12"
          style={{height: "800px"}}
          children={<CancelacionesPdfComponent estadosPrestamo={estadosPrestamo} prestamo={prestamo} cancelaciones={tableCancelaciones} productos={productos} />}
        />
        <div className="col-12 text-center">
          <button onClick={()=>history.push(`/cancelaciones/${id}`)} className="btn btn-light btn-form ml-2">Regresar</button>
        </div>
      </ReportContainer>
      {isLoading === true && <Loading/>}
    </>
  )
}

export default FormatoCancelaciones