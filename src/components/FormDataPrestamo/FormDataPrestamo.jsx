import React, { useEffect, useState } from 'react'
//Componentes
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
//Functions
import { listAllCompanias, listAllTiposDocumento, listAllPaises, listAllDepartamentos, listAllProvincias, listAllDistritos } from '../../Api/Api'

const estados = [
    { name: 'PENDIENTE', value: 'PE' },
    { name: 'VIGENTE', value: 'VI' },
    { name: 'CANCELADO', value: 'CA' },
    { name: 'ENTREGADO', value: 'EN' },
    { name: 'REMATE', value: 'RE' },
    { name: 'ANULADO', value: 'AN' }
]

const monedas = [
    { name: 'LOCAL', value: 'L' },
    { name: 'EXTERIOR', value: 'E' }
]

const FormDataPrestamo = ({setIsLoading}) => {
    const [compania, setCompania] = useState("");
    const [nPrestamo, setNPrestamo] = useState({value:"", isValid:null});
    const [estado, setEstado] = useState("");
    const [codigoCliente, setCodigoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [numeroDocumento, setNumeroDocumento] = useState({value:"", isValid:null});
    const [direccion, setDireccion] = useState({value:"", isValid:null});
    const [paisCodigo, setPaisCodigo] = useState("");
    const [departamentoCodigo, setDepartamentoCodigo] = useState("");
    const [provinciaCodigo, setProvinciaCodigo] = useState("");
    const [distritoCodigo, setDistritoCodigo] = useState("");
    const [telefono, setTelefono] = useState({value:"", isValid:null});
    const [moneda, setMoneda] = useState("L");
    const [montoPrestamo, setMontoPrestamo] = useState({value:"0.0", isValid:true});
    const [tasaInteres, setTasaInteres] = useState({value:"14.98", isValid:true});
    const [montoIntereses, setMontoIntereses] = useState({value:"0.0", isValid:true});
    const [montoTotalPrestamo, setMontoTotalPrestamo] = useState({value:"0.0", isValid:true});
    const [fechaDesembolso, setFechaDesembolso] = useState({value:""});
    const [plazoDias, setPlazoDias] = useState({value: "30", isValid:true});
    const [fechaVencimiento, setFechaVencimiento] = useState({value:"", required:null});
    const [montoInteresDiario, setMontoInteresDiario] = useState({value:"0.0", required:null});
    //Listas
    const [companias, setCompanias] = useState([]);
    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [tiposDocumentos, setTiposDocumentos] = useState([]);

    const getPrestamoByCodigo = async () => {
        //const response = await get
        /*if(response && response.status === 200) {

        };*/
    }

    const getCompanias = async () => {
        const response = await listAllCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }

    const getTiposDocumento = async () => {
        const response = await listAllTiposDocumento();
        if(response && response.status === 200) setTiposDocumentos(response.body.data);
    }

    const getPaises = async () => {
        const response = await listAllPaises();
        if(response && response.status === 200) setPaises(response.body.data);
    }

    const getDepartamentos = async () => {
        const response = await listAllDepartamentos();
        if(response && response.status === 200) setDepartamentos(response.body.data);
    }

    const getProvincias = async () => {
        const response = await listAllProvincias();
        if(response && response.status === 200) setProvincias(response.body.data);
    }

    const getDistritos = async () => {
        const response = await listAllDistritos();
        if(response && response.status === 200) setDistritos(response.body.data);
    }

    useEffect(async () => {
        await setIsLoading(true);
        await getPrestamoByCodigo();
        await getCompanias();
        await getTiposDocumento();
        await getPaises();
        await getDepartamentos();
        await getProvincias();
        await getDistritos();
        setIsLoading(false);
    }, [])

    return (
        <>
            <div className="row">
                <ReactSelect
                    inputId="companiaCodeId"
                    labelText="Compañía"
                    placeholder="Seleccione un compañía"
                    valueSelected={compania}
                    data={companias}
                    handleElementSelected={setCompania}
                    optionField="c_descripcion"
                    valueField="c_compania"
                    disabledElement={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="N° Prestamo"
                    state={nPrestamo}
                    setState={setNPrestamo}
                    type="text"
                    placeholder="N° Prestamo"
                    inputId="prestamoCodigoId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <SelectComponent
                    labelText="Estado"
                    defaultValue="Seleccione un estado"
                    items={estados}
                    selectId="estadoId"
                    valueField="value"
                    optionField="name"
                    valueSelected={estado}
                    handleChange={setEstado}
                    classForm="col-12 col-lg-6"
                    disabledElement={true}
                />
                <SearcherComponent
                    placeholder="Nombre del cliente"
                    label="Cliente"
                    inputCodeId="clienteCodigoId"
                    stateCode={codigoCliente}
                    setStateCode={setCodigoCliente}
                    inputId="clienteNombreId"
                    stateName={nombreCliente}
                    setStateName={setNombreCliente}
                    readOnly={true}
                    readOnlyCode={true}
                    classForm="col-12 col-lg-6"
                    marginForm=""
                />
                <SelectComponent
                    labelText="Tipo documento"
                    defaultValue="Seleccione un tipo documento"
                    items={tiposDocumentos}
                    selectId="tipoDocId"
                    valueField="c_tipodocumento"
                    optionField="c_descripcion"
                    valueSelected={tipoDocumento}
                    handleChange={setTipoDocumento}
                    disabledElement={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="N° documento"
                    state={numeroDocumento}
                    setState={setNumeroDocumento}
                    type="text"
                    placeholder="N° documento"
                    inputId="numeroDocumentoId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Dirección"
                    state={direccion}
                    setState={setDireccion}
                    type="text"
                    placeholder="Dirección"
                    inputId="direccionId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <ReactSelect
                    inputId="paisCodeId"
                    labelText="País"
                    placeholder="Seleccione un país"
                    valueSelected={paisCodigo}
                    data={paises}
                    handleElementSelected={setPaisCodigo}
                    optionField="c_descripcion"
                    valueField="c_paiscodigo"
                    disabledElement={true}
                    classForm="col-12 col-lg-6"
                />
                <ReactSelect
                    inputId="departamentoCodeId"
                    labelText="Departamento"
                    placeholder="Seleccione un Departamento"
                    valueSelected={departamentoCodigo}
                    data={departamentos}
                    handleElementSelected={setDepartamentoCodigo}
                    optionField="c_descripcion"
                    valueField="c_departamentocodigo"
                    disabledElement={true}
                    classForm="col-12 col-lg-6"
                />
                <ReactSelect
                    inputId="provinciaCodeId"
                    labelText="Provincia"
                    placeholder="Seleccione una Provincia"
                    valueSelected={provinciaCodigo}
                    data={provincias}
                    handleElementSelected={setProvinciaCodigo}
                    optionField="c_descripcion"
                    valueField="c_provinciacodigo"
                    disabledElement={true}
                    classForm="col-12 col-lg-6"
                />
                <ReactSelect
                    inputId="distritocodigoId"
                    labelText="Distrito"
                    placeholder="Seleccione una Distrito"
                    valueSelected={distritoCodigo}
                    data={distritos}
                    handleElementSelected={setDistritoCodigo}
                    optionField="c_descripcion"
                    valueField="c_distritocodigo"
                    disabledElement={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Teléfono"
                    state={telefono}
                    setState={setTelefono}
                    type="text"
                    placeholder="Teléfono"
                    inputId="telefonoId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <SelectComponent
                    labelText="Moneda"
                    defaultValue="Seleccione un moneda"
                    items={monedas}
                    selectId="monedaId"
                    valueField="value"
                    optionField="name"
                    valueSelected={moneda}
                    handleChange={setMoneda}
                    disabledElement={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Monto Préstamo"
                    state={montoPrestamo}
                    setState={setMontoPrestamo}
                    type="text"
                    placeholder="Monto Préstamo"
                    inputId="montoPrestamoId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Tasa interés"
                    state={tasaInteres}
                    setState={setTasaInteres}
                    type="text"
                    placeholder="Tasa interés"
                    inputId="tasaInteresId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Monto intereses"
                    state={montoIntereses}
                    setState={setMontoIntereses}
                    type="text"
                    placeholder="Tasa interés"
                    inputId="tasaInteresId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Mnt. Total P."
                    state={montoTotalPrestamo}
                    setState={setMontoTotalPrestamo}
                    type="text"
                    placeholder="Monto total préstamo"
                    inputId="montoTotalPrestamoId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="F. Desembolso"
                    state={fechaDesembolso}
                    setState={setFechaDesembolso}
                    type="date"
                    placeholder="Fecha desembolso"
                    inputId="fechaDesembolsoId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Plazo (días)"
                    state={plazoDias}
                    setState={setPlazoDias}
                    type="text"
                    placeholder="Plazo (días)"
                    inputId="plazoDiaId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="F. Vencimiento"
                    state={fechaVencimiento}
                    setState={setFechaVencimiento}
                    type="date"
                    placeholder="Fecha vencimiento"
                    inputId="fechaVencimientoId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Mnt. interés Diario"
                    state={montoInteresDiario}
                    setState={setMontoInteresDiario}
                    type="text"
                    placeholder="Mnt. interés Diario"
                    inputId="montoInteresDiarioId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
            </div>
        </>
    )
}

export default FormDataPrestamo
