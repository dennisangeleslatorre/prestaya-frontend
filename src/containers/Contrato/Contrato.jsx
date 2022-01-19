import React, { useEffect, useState } from 'react'
import { PDFViewer  } from "@react-pdf/renderer"
import ContratoPDFComponent from '../../components/ContratoPDFComponent/ContratoPDFComponent'
import Loading from '../../components/Modal/LoadingModal'
import {} from '../../Api/Api'

const Contrato = (props) => {
    const elementId = props.match.params.id;
    const [c_compania, c_prestamo] = elementId.split('-');
    const [isLoading, setIsLoading] = useState(false);
    return (
        <>
            <div className="row">
                <PDFViewer
                    className="col-12"
                    style={{height: "800px"}}
                    children={<ContratoPDFComponent />}
                />
            </div>
            {isLoading === true && <Loading/>}
        </>
    )
}

export default Contrato
