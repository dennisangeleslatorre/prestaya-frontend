import React from 'react'
import InputComponentView from '../InputComponent/InputComponentView'
import SearcherComponent from '../SearcherComponent/SearcherComponent'

const CabeceraFormatoCancelaciones = ({prestamo, estados}) => {
  return (
    <>
        <div className="row">
            <InputComponentView
                label="Compañía"
                state={ prestamo ? prestamo.nombreCompania : ""}
                setState={()=>{}}
                type="text"
                placeholder="Compañía"
                inputId="compania"
                readOnly={true}
                classForm="col-12 col-lg-6"
            />
            <InputComponentView
                label="N° Prestamo"
                state={ prestamo ? prestamo.c_prestamo : ""}
                setState={()=>{}}
                type="text"
                placeholder="N° Prestamo"
                inputId="nprestamo"
                readOnly={true}
                classForm="col-12 col-lg-6"
            />
            <InputComponentView
                label="Estado"
                state={ prestamo ? estados[prestamo.c_estado] : ""}
                setState={()=>{}}
                type="text"
                placeholder="Estado"
                inputId="estado"
                readOnly={true}
                classForm="col-12 col-lg-6"
            />
            <SearcherComponent
                placeholder="Nombre del cliente"
                label="Cliente"
                inputCodeId="clienteCodigoId"
                stateCode={prestamo ? prestamo.n_cliente : ""}
                setStateCode={()=>{}}
                inputId="clienteNombreId"
                stateName={prestamo ? prestamo.c_nombrescompleto : ""}
                setStateName={()=>{}}
                readOnly={true}
                readOnlyCode={true}
                classForm="col-12 col-lg-6"
                marginForm=""
            />
            <InputComponentView
                label="Tipo documento"
                state={ prestamo ? prestamo.descripcionTipoDoc : ""}
                setState={()=>{}}
                type="text"
                placeholder="Tipo documento"
                inputId="estado"
                readOnly={true}
                classForm="col-12 col-lg-6"
            />
            <InputComponentView
                label="N° documento"
                state={ prestamo ? prestamo.c_numerodocumento : ""}
                setState={()=>{}}
                type="text"
                placeholder="N° documento"
                inputId="estado"
                readOnly={true}
                classForm="col-12 col-lg-6"
            />
        </div>
    </>
  )
}

export default CabeceraFormatoCancelaciones