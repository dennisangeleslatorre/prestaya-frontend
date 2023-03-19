import React from 'react'

const estados = [
    { name: 'TODOS', value: 'TO' },
    { name: 'REGISTRADO', value: 'RE' },
    { name: 'ANULADO', value: 'AN' }
]

const tipos = [{value:"NI", option:"Nota de ingreso"}, {value:"NS", option:"Nota de salido"}, {value:"TO", option:"Todos"}]

const columnsExportExcel = [
    {
        label: 'NRO',
        value: row => (row.n_correlativo || '')
    },
    {
        label: 'FECHA',
        value: row => (moment(row.d_fechamov_format).format('DD/MM/yyyy') || '')
    },
    {
        label: 'OOBSERVACIONES',
        value: row => (row.diaobservacion || '')
    },
    {
        label: 'ESTADO',
        value: row => (row.diaestado || '')
    },
    {
        label: 'SEC.',
        value: row => (row.n_secuencia || '')
    },
    {
        label: 'TIPO MOVIMIENTO',
        value: row => (row.c_tipomovimientocc_desc || '')
    },
    {
        label: 'USUARIO MOV.',
        value: row => (row.usuariomov || '')
    },
    {
        label: 'OBSERVACIONES',
        value: row => (row.movobservacion || '')
    },
    {
        label: 'MNTO. INTERES A CANCELAR',
        value: row => (row.n_montointeresescancelar || '')
    },
    {
        label: 'MNTO. PRESTAMO A CANCELAR',
        value: row => (row.n_montoprestamocancelar || '')
    },
    {
        label: 'MNTO. COMISION',
        value: row => (row.n_montocomisioncancelar || '')
    },
    {
        label: 'MNT TOTAL',
        value: row => (row.n_montototalcancelar || '')
    },
    {
        label: 'FUENTE',
        value: row => (row.c_fuente || '')
    }
]

const ReporteTransaccionesTienda = () => {
    //Estados
    const [compania, setCompania] = useState("");
    const [agencia, setAgencia] = useState("T");
    const [codigoCliente, setCodigoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [fecha, setFecha] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [disabledFilterFecha, setDisabledFilterFecha] = useState(true);
    const [tipo, setTipo] = useState("TO");
    const [numeroDocumento, setNumeroDocumento] = useState({value: "", isValid:null});
    const [periodo, setPeriodo] = useState({periodoInicio:"", periodoFin:"", isValid:null});
    const [disabledPeriodo, setDisabledPeriodo] = useState(true);
    const [estado, setEstado] = useState("TO");
    const [nPrestamo, setNPrestamo] = useState({value:""});
    //Listas obtenidas
    const [dataReportToTable, setDataReportToTable] = useState([]);
    //Producto
    const [codigoProducto, setCodigoProducto] = useState("");
    const [nombreProducto, setNombreProducto] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    //Listas
    const [companias, setCompanias] = useState([]);
    const [agencias, setAgencias] = useState([]);
    //Form
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const [openSearchModalProducto, setOpenSearchModalProducto] = useState(false);

    const findClienteByCode = async () => {
        setIsLoading(true);
        if(codigoCliente) {
            const response = await getClienteByCodigoCliente({c_compania:compania, n_cliente:codigoCliente});
            if(response && response.status === 200 && response.body.data) {
                setNombreCliente(response.body.data.c_nombrescompleto);
            } else {
                setResponseData({title:"Aviso", message:"No hay un cliente con ese código"});
                setCodigoCliente("");
                setNombreCliente("");
                setClienteSeleccionado({});
                setOpenResponseModal(true);
            }
        } else
            setNombreCliente("");
        setIsLoading(false);
    }

    const handleSeleccionarCompania = (value) => {
        setCompania(value);
        //Deberia buscar las agencias de la compañía
        getAgenciasByCompany(value);
    }

    const prepareBodyToSearch = () => {
        let body = {};
        if(compania) body.c_compania = compania;
        if(agencia) body.c_agencia = agencia;
        if(fecha.isValid && !disabledFilterFecha) {
            body.d_fechadocumentoInicio = fecha.fechaInicio;
            body.d_fechadocumentoFin = fecha.fechaFin;
        }
        if(codigoCliente) body.n_cliente = codigoCliente;
        if(tipo && tipo !== "TO" ) body.c_tipodocumento = tipo;
        if(numeroDocumento.value) body.c_numerodocumento = numeroDocumento.value;
        if(periodo.isValid && !disabledPeriodo) {
            body.periodo_inicio = periodo.periodoInicio.replace("-", "");
            body.periodo_fin = periodo.periodoFin.replace("-", "");
        }
        if(codigoProducto) body.c_item = codigoProducto;
        if(estado && estado !== "TO") body.c_estado = estado;
        if(nPrestamo.value) body.c_prestamo = nPrestamo.value;
        return body;
    }

    const onHandleSearch = async () => {
        let parametros =  prepareBodyToSearch();
        const response = await getTransaccionDinamico(parametros);
        if(response && response.status === 200 && response.body.data) {
            const data = response.body.data;
            //getDataForTable(data);
        }
        else {
            //getDataForTable([])
            setResponseData({title:"Aviso", message:"No se encontraron transacciones"});
        };
    }

    const onHandleClickSearch = async () => {
        await setIsLoading(true);
        await onHandleSearch();
        setIsLoading(false);
    }

    const getPeriodoDefualt = () => {
        const periodoAux = moment().format('yyyy-MM');
        setPeriodo({periodoInicio:periodoAux, periodoFin:periodoAux, isValid:true})
    };

    const findProductoByCode = async () => {
        setIsLoading(true);
        if(codigoProducto) {
            const response = await getProductoDinamico({ c_compania:compania, c_agencia:agencia, c_item:codigoProducto });
            if(response && response.status === 200 && response.body.data) {
                setNombreProducto(response.body.data[0].c_descripcionproducto);
            } else {
                setResponseData({title:"Aviso", message:"No hay un producto con ese código"});
                setCodigoProducto("");
                setNombreProducto("");
                setProductoSeleccionado({});
                setOpenResponseModal(true);
            }
        } else
        setNombreProducto("");
        setIsLoading(false);
    }

    //Listas
    const getCompanias =  async () => {
        const response = await listAllCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }
    const getAgenciasByCompany = async (companyCode) => {
        const response = await listAgencias({c_compania: companyCode});
        if(response && response.status === 200 && response.body.data) setAgencias(response.body.data);
    }

    useEffect(() => {
        if(productoSeleccionado) {
            setCodigoProducto(productoSeleccionado.c_item);
            setNombreProducto(productoSeleccionado.c_descripcionproducto);
        }
    }, [productoSeleccionado])

    useEffect(() => {
        if(clienteSeleccionado) {
            setCodigoCliente(clienteSeleccionado.n_cliente);
            setNombreCliente(clienteSeleccionado.c_nombrescompleto);
        }
    }, [clienteSeleccionado])

    useEffect(() => {
        if(companias.length !== 0) {
            handleSeleccionarCompania(companias[0].c_compania);
            setAgencia("T");
        };
    }, [companias])

    useEffect(() => {
        if(agencias.length !== 0) {
            setAgencia(agencias[0].c_agencia);
        };
    }, [agencias])

    useEffect(async() => {
        await setIsLoading(true);
        await getCompanias();
        getPeriodoDefualt();
        setIsLoading(false);
    }, [])

    return (
        <>
            <ReportContainer>
                <div className="row col-12 col-md-12">
                    <ReactSelect
                        inputId="companiaCodeId"
                        labelText="Compañía"
                        placeholder="Seleccione un compañía"
                        valueSelected={compania}
                        data={companias}
                        handleElementSelected={setCompania}
                        optionField="c_descripcion"
                        valueField="c_compania"
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <ReactSelect
                        inputId="agenciaCodeId"
                        labelText="Agencia"
                        placeholder="Seleccione una agencia"
                        valueSelected={agencia}
                        data={agencias}
                        handleElementSelected={setAgencia}
                        optionField="c_descripcion"
                        valueField="c_agencia"
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <DateRangeComponent
                        inputId="fechaId"
                        labelText="Fecha"
                        state={fecha}
                        setState={setFecha}
                        enabled={disabledFilterFecha}
                        setEnabled={setDisabledFilterFecha}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
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
                        onHandleClick={()=>setOpenSearchModal(true)}
                        onHandleBlur={findClienteByCode}
                        readOnly={true}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <SelectComponent
                        labelText="Tipo"
                        defaultValue="Seleccione un tipo"
                        items={tipos}
                        selectId="tipoId"
                        valueField="value"
                        optionField="option"
                        valueSelected={tipo}
                        handleChange={setTipo}
                        marginForm="ml-0"
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="N° documento"
                        state={numeroDocumento}
                        setState={setNumeroDocumento}
                        type="text"
                        placeholder="N° documento"
                        inputId="numeroDocumentoId"
                        marginForm="ml-0"
                        classForm="col-12 col-lg-6"
                    />
                    <PeriodoRange
                        inputId="periodoId"
                        labelText="Periodo"
                        state={periodo}
                        setState={setPeriodo}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        disabledPeriodo={disabledPeriodo}
                        setDisabledPeriodo={setDisabledPeriodo}
                    />
                    <SearcherComponent
                        placeholder="Nombre del producto"
                        label="Producto"
                        inputCodeId="productoCodigoId"
                        stateCode={codigoProducto}
                        setStateCode={setCodigoProducto}
                        inputId="productoNombreId"
                        stateName={nombreProducto}
                        setStateName={setNombreProducto}
                        onHandleClick={()=>setOpenSearchModalProducto(true)}
                        onHandleBlur={findProductoByCode}
                        readOnly={true}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
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
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <InputComponent
                        state={nPrestamo}
                        setState={setNPrestamo}
                        type="text"
                        label="# Prestamo"
                        placeholder="# Prestamo"
                        inputId="nPrestamoInput"
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                </div>
                <div className="col-12 col-md-12 mt-3 mb-3 text-center">
                    <button onClick={onHandleClickSearch} className='btn btn-light' style={{width: "200px"}}>Buscar</button>
                </div>
                <div className="col-12">
                    <Space size={[10, 3]} wrap style={{ marginBottom: 16 }}>
                    <ButtonDownloadExcel
                        fileName="reporteFlujoCaja"
                        sheet="reporte"
                        columns={columnsExportExcel}
                        content={dataReportToTable}
                    />
                    </Space>
                </div>
                {/*<div className="col-12">
                    { elementPdf ? <PDFViewer
                        className="col-12"
                        style={{height: "800px"}}
                        children={<ReporteFlujoCajaPDFComponent general={elementPdf} movsFlujoCaja={movsFlujoCaja} movsPxC={movsPxC}
                                    totalesPxC={totalesPxC} totalesFC={totalesFC}/>}
                    /> : <div className="text-center">
                        <h2>No se a realizado una búsqueda</h2>
                    </div> }
                </div>*/}
            </ReportContainer>
            {isLoading === true && <LoadingModal/>}
            <ResponseModal
                isOpen={openResponseModal}
                title={responseData.title}
                onClose={()=>setOpenResponseModal(false)}
                message={responseData.message}
            />
            <SearchModalCliente
                isOpen={openSearchModal}
                onClose={()=>setOpenSearchModal(false)}
                setClienteObtained={setClienteSeleccionado}
                compania={compania}
            />
            <SearchModalProducto
                isOpen={openSearchModalProducto}
                onClose={()=>setOpenSearchModalProducto(false)}
                setProductoObtained={setProductoSeleccionado}
                compania={compania}
                agencia={agencia}
            />
        </>
    )
}

export default ReporteTransaccionesTienda