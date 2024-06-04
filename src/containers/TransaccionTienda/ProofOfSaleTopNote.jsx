import React, { useState, useEffect } from "react";
import { useParams, useHistory } from 'react-router';
import ProofOfSaleTopNotePdf from "../../components/ReactPDF/ProofOfSaleTopNotePdf";
import { PDFViewer, usePDF } from '@react-pdf/renderer';
import { getTransaccionCabecera, getTransaccionDetalle } from '../../Api/Comercial/transacciones.service';
import ResponseModal from '../../components/Modal/ResponseModal';
import FormContainer from '../../components/FormContainer/FormContainer';
import Spinner from '../../components/Spinner/Spinner';
import Loading from '../../components/Modal/LoadingModal';

const ProofOfSaleTopNote = () => {
  let history = useHistory();
  const { c_compania, c_agencia, c_tipodocumento, c_numerodocumento } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [cabecera, setCabecera] = useState({});
  const [detalles, setDetalles] = useState([]);
  const [instance, updateInstance] = usePDF({
    document: ProofOfSaleTopNotePdf({ cabecera, detalles }),
  });
  const [openResponseModal, setOpenResponseModal] = useState(false);
  const [responseData, setResponseData] = useState({
    title: "Aviso",
    message: "",
  });

  const renderPDF = () => {
    if (instance.isLoading) return <Spinner />;
    if (instance.error) return <center>{instance.error}</center>;
    return (
      <PDFViewer
        className="col-12"
        style={{ height: "800px" }}
        children={
          <ProofOfSaleTopNotePdf
            cabecera={cabecera}
            detalles={detalles}
          />
        }
      />
    );
  };

  const getDetalles = async () => {
    const response = await getTransaccionDetalle({
      c_compania: c_compania,
      c_agencia: c_agencia,
      c_tipodocumento: c_tipodocumento,
      c_numerodocumento: c_numerodocumento,
    });
    if (
      response.status == 200 &&
      response.body &&
      response.body.data &&
      response.body.data.length > 0
    ) {
      setDetalles(response.body.data);
    } else {
      setResponseData({
        title: "Aviso",
        message: response.message ? response.message : "Error al obtener datos",
      });
      setOpenResponseModal(true);
    }
    setIsLoading(false);
  };

  const getDataCabecera = async () => {
    const response = await getTransaccionCabecera({
      c_compania: c_compania,
      c_agencia: c_agencia,
      c_tipodocumento: c_tipodocumento,
      c_numerodocumento: c_numerodocumento,
    });
    if (response.status == 200 && response.body && response.body.data) {
      setCabecera(response.body.data);
      getDetalles();
    } else {
      setResponseData({
        title: "Aviso",
        message: response.message ? response.message : "Error al obtener datos",
      });
      setOpenResponseModal(true);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getDataCabecera();
  }, []);

  return (
    <>
      <FormContainer
        showButton={false}
        view={false}
        textButtonReturn="Regresar"
        goList={() => history.push(`/transacionestienda`)}
      >
        {renderPDF()}
      </FormContainer>
      {isLoading === true && <Loading />}
      <ResponseModal
        isOpen={openResponseModal}
        title={responseData.title}
        onClose={() => setOpenResponseModal(false)}
        message={responseData.message}
        buttonLinkView={"/transacionestienda"}
      ></ResponseModal>
    </>
  );
};

export default ProofOfSaleTopNote;
