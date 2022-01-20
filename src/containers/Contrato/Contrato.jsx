import React, { useEffect, useState } from 'react'
import { PDFViewer  } from "@react-pdf/renderer"
import ContratoPDFComponent from '../../components/ContratoPDFComponent/ContratoPDFComponent'
import Loading from '../../components/Modal/LoadingModal'
import { obtenerDatosFormatoPrestamo, getProductosByFormato, listParametrosByCompania, getCompaniaByCodigoCompania } from '../../Api/Api'

const Contrato = (props) => {
    const elementId = props.match.params.id;
    const [c_compania, c_prestamo] = elementId.split('-');
    const [element, setElement] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const getData = async () => {
        let elementAux = {};
        const responseCompania = await getCompaniaByCodigoCompania(c_compania);
        if(responseCompania.status === 200) {
            const compania = responseCompania.body.data;
            elementAux.compania = compania;
        }
        const responsePrestamo = await obtenerDatosFormatoPrestamo({c_compania:c_compania, c_prestamo:c_prestamo});
        if(responsePrestamo.status === 200) {
            const prestamo = responsePrestamo.body.data;
            elementAux.prestamo = prestamo;

            const responseProductos = await getProductosByFormato({c_compania:c_compania, c_prestamo:c_prestamo});
            if(responseProductos.status === 200) {
                const productos = responseProductos.body.data;
                elementAux.productos = productos;
            } else elementAux.productos = [];
        }
        const responseParametros = await listParametrosByCompania(c_compania);
        if(responseParametros && responseParametros.status === 200) {
            const parametros = responseParametros.body.data;
            const diasDevolucionProducto = parametros.find((item) => item.c_parametrocodigo === "PACO000005");
            const montoPenalidadCancelacion = parametros.find((item) => item.c_parametrocodigo === "PACO000006");
            const diasCobroPenalidad = parametros.find((item) => item.c_parametrocodigo === "PACO000007");
            const diasRemate = parametros.find((item) => item.c_parametrocodigo === "PACO000008");
            elementAux.diasDevolucionProducto = diasDevolucionProducto.n_valornumero;
            elementAux.montoPenalidadCancelacion = montoPenalidadCancelacion.n_valornumero;
            elementAux.diasCobroPenalidad = diasCobroPenalidad.n_valornumero;
            elementAux.diasRemate = diasRemate.n_valornumero;
        }
        setElement(elementAux);
    }

    useEffect( async () => {
        await setIsLoading(true);
        await getData();
        setIsLoading(false);
    }, []);

    return (
        <>
            <div className="row">
                {element.prestamo && <PDFViewer
                    className="col-12"
                    style={{height: "800px"}}
                    children={<ContratoPDFComponent element={element}/>}
                />}
                {(!element.prestamo && !isLoading) && <h2>No se encontró el préstamo</h2>}
            </div>
            {isLoading === true && <Loading/>}
        </>
    )
}

export default Contrato
