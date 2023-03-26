import React, { useEffect, useState } from 'react'
import { PDFViewer  } from "@react-pdf/renderer"
import FormatoActaEntregaPDF from '../../components/FormatoActaEntregaPDF/FormatoActaEntregaPDF'
import Loading from '../../components/Modal/LoadingModal'
import { getProductosByFormato, obtenerDatosActaEntrega } from '../../Api/Api'
import { Link } from 'react-router-dom'

const FormatoActaEntrega = (props) => {
    const elementId = props.match.params.id;
    const [c_compania, c_prestamo] = elementId.split('-');
    const [element, setElement] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const getData = async () => {
      let elementAux = {};
      const responsePrestamo = await obtenerDatosActaEntrega({c_compania:c_compania, c_prestamo:c_prestamo});
      if(responsePrestamo.status === 200) {
          const prestamo = responsePrestamo.body.data;
          elementAux = prestamo;
          const responseProductos = await getProductosByFormato({c_compania:c_compania, c_prestamo:c_prestamo});
          if(responseProductos.status === 200) {
              const productos = responseProductos.body.data;
              elementAux.productos = productos;
              let weight = false;
              let pesonetototal = 0;
              let pesobrutototal = 0;
              productos.forEach(item => {
                  pesonetototal += Number(item.n_pesoneto);
                  pesobrutototal += Number(item.n_pesobruto);
                  if(Number(item.n_pesobruto) > 0 || Number(item.n_pesoneto) > 0) {
                      weight = true;
                  }
              });
              elementAux.thereWeight = weight ? true : false;
              elementAux.pesonetototal = pesonetototal;
              elementAux.pesobrutototal = pesobrutototal;
          } else {
              elementAux.productos = [];
              elementAux.thereWeight = false;
          }
      }
      console.log("elementAux",elementAux);
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
                <div className="col-12 text-center mb-3">
                    <Link to='/prestamos' className={`btn btn-info mr-4`}>
                        Ir a Préstamos
                    </Link>
                </div>
                {Object.values(element).length > 0 && <PDFViewer
                    className="col-12"
                    style={{height: "800px"}}
                    children={<FormatoActaEntregaPDF prestamo={element}/>}
                />}
                {(!Object.values(element).length > 0 && !isLoading) && <div className='w-100 text-center'>
                  <h2 className='text-center'>No se encontró el préstamo</h2>
                </div>}
            </div>
            {isLoading === true && <Loading/>}
      </>
    )
}

export default FormatoActaEntrega