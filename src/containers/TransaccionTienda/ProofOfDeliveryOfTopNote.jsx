import React, { useState } from "react";
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import ProofOfDeliveryOfTopNotePdf from "../../components/ReactPDF/ProofOfDeliveryOfTopNotePdf";
import { PDFViewer } from "@react-pdf/renderer";

const ProofOfDeliveryOfTopNote = () => {
  const { c_compania, c_agencia, c_tipodocumento, c_numerodocumento } = useParams();
  const [element, setElement] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className="row">
        <div className="col-12 text-center mb-3">
          <Link to="/transacionestienda" className={`btn btn-info mr-4`}>
            Ir a Transacciones
          </Link>
        </div>
        <PDFViewer
          className="col-12"
          style={{ height: "800px" }}
          children={<ProofOfDeliveryOfTopNotePdf element={element} />}
        />
      </div>
    </>
  );
};

export default ProofOfDeliveryOfTopNote;
