import React, { useEffect, useState } from 'react'
import { Table, Space } from 'antd'
import ReportContainer from '../../components/ReportContainer/ReportContainer'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent'
import DateRangeComponent from '../../components/DateRangeComponent/DateRangeComponent'
import SearchModalCliente from '../../components/Modal/SearchModalCliente'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
import ButtonDownloadExcel from '../../components/ButtonDownloadExcel/ButtonDownloadExcel'
import { listAllCompanias, getClienteByCodigoCliente, listAllPaises, listAllDepartamentos,
    listAllProvincias, listAllDistritos, getDataReporteDetallado} from '../../Api/Api'

const columns = [
    {
        title: '# Prestamo',
        dataIndex: 'c_prestamo'
    },
    {
        title: 'Cliente',
        dataIndex: 'n_cliente'
    },
    {
        title: 'Nombre Completo',
        dataIndex: 'c_nombrescompleto'
    },
    {
        title: 'F. Desembolso',
        dataIndex: 'd_fechadesembolso'
    },
    {
        title: 'Dias Plazo',
        dataIndex: 'n_diasplazo'
    },
    {
        title: 'F. Vencimiento',
        dataIndex: 'd_fechavencimiento'
    },
    {
        title: 'Moneda P.',
        dataIndex: 'c_monedaprestamo'
    },
    {
        title: 'Monto Prestamo',
        dataIndex: 'n_montoprestamo'
    },
    {
        title: '% Tasa Interes',
        dataIndex: 'n_tasainteres'
    },
    {
        title: 'Monto Intereses',
        dataIndex: 'n_montointereses'
    },
    {
        title: 'Monto Total P.',
        dataIndex: 'n_montototalprestamo'
    },
    {
        title: 'Monto Valor Prod.',
        dataIndex: 'calc_sumavalorproductos'
    },
    {
        title: 'Dias Plazo Totales',
        dataIndex: 'calc_diasplazostotales'
    },
    {
        title: 'F. Vcto. Reprog.',
        dataIndex: 'd_fechavencimientoreprogramada'
    },
    {
        title: 'F. Cancelacion',
        dataIndex: 'd_ultimafechacancelacion'
    },
    {
        title: 'Dias Vencido',
        dataIndex: 'calc_diasvencido'
    },
    {
        title: 'Vencido',
        dataIndex: 'esvencido'
    },
    {
        title: 'Interes Cancelado',
        dataIndex: 'calc_sumainterescancelado'
    },
    {
        title: 'Monto Prest. Cancelado',
        dataIndex: 'calc_sumamontoprestamocancelado'
    },
    {
        title: 'Mnto. Comision Canc.',
        dataIndex: 'calc_sumamontocomisioncancelada'
    },
    {
        title: 'Mnto. Total Cancelado',
        dataIndex: 'calc_sumamontotalcancelado'
    },
    {
        title: 'Estado',
        dataIndex: 'c_estado'
    },
    {
        title: 'Distrito',
        dataIndex: 'nombredistrito'
    },
]

const columnsExportExcel = [
    {
        label: 'Periodo',
        value: row => (row.c_periodo || '')
    },
    {
        label: 'Cliente',
        value: row => (row.n_cliente || '')
    },
    {
        label: 'Nombre Completo',
        value: row => (row.c_nombrescompleto || '')
    },
    {
        label: 'Moneda P.',
        value: row => (row.c_monedaprestamo || '')
    },
    {
        label: 'Monto Prestamo',
        value: row => (row.calc_sumamontoprestamo || '')
    },
    {
        label: 'Monto Intereses',
        value: row => (row.calc_sumamontointereses || '')
    },
    {
        label: 'Monto Total P.',
        value: row => (row.calc_sumamontototalprestamo || '')
    },
    {
        label: 'Monto Valor Prod.',
        value: row => (row.calc_sumamontovalorproductos || '')
    },
    {
        label: 'Interes Cancelado',
        value: row => (row.calc_sumainterecamcelado || '')
    },
    {
        label: 'Monto Prest. Cancelado',
        value: row => (row.calc_montoprestamocancelado || '')
    },
    {
        label: 'Mnto. Comision Canc.',
        value: row => (row.calc_sumacomisioncancelada || '')
    },
    {
        label: 'Mnto. Total Cancelado',
        value: row => (row.calc_sumamontototalcancelado || '')
    },
]

const estados = [
    { name: 'TODOS', value: 'T' },
    { name: 'PENDIENTE', value: 'PE' },
    { name: 'VIGENTE', value: 'VI' },
    { name: 'CANCELADO', value: 'CA' },
    { name: 'ENTREGADO', value: 'EN' },
    { name: 'REMATE', value: 'RE' },
    { name: 'ANULADO', value: 'AN' }
]

const ReporteDetallado = () => {
    const [compania, setCompania] = useState("");
    const [estado, setEstado] = useState("T");
    const [codigoCliente, setCodigoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [nPrestamo, setNPrestamo] = useState({value:""})
    const [esVencido, setEsVencido] = useState("T");
    const [paisCodigo, setPaisCodigo] = useState("");
    const [departamentoCodigo, setDepartamentoCodigo] = useState("");
    const [provinciaCodigo, setProvinciaCodigo] = useState("");
    const [distritoCodigo, setDistritoCodigo] = useState("");
    const [fechaDesembolso, setFechaDesembolso] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaDesembolso, setEnabledFechaDesembolso] = useState(true);
    const [fechaCancelacion, setFechaCancelacion] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaCancelacion, setEnabledFechaCancelacion] = useState(true);
    const [fechaVencimiento, setFechaVencimiento] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaVencimiento, setEnabledFechaVencimiento] = useState(true);
    const [fechaVencimientoReprogramada, setFechaVencimientoReprogramada] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaVencimientoReprogramada, setEnabledFechaVencimientoReprogramada] = useState(true);
    //Estados del formulario
    const [dataReportToTable, setDataReportToTable] = useState([]);
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal ] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    //Listas
    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState([]);
    const [provinciasFiltradas, setProvinciasFiltradas] = useState([]);
    const [distritosFiltrados, setDistritosFiltrados] = useState([]);
    const [companias, setCompanias] = useState([]);

    //Modales
    const handleOpenSearchModal = async () => {
        setOpenSearchModal(true);
    }

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
        }
        setIsLoading(false);
    }

    const prepareBodyToSearch = () => {
        let body = {};
        if(compania) body.c_compania = compania;
        if(codigoCliente) body.n_cliente = codigoCliente;
        return body;
    }

    const onHandleSearch = async () => {
        let parametros = prepareBodyToSearch();
        const response = await getDataReporteDetallado(parametros);
        if(response && response.status === 200 && response.body.data) {
            const data = response.body.data;
            console.log("HOla")
            getDataForTable(data);
        }
        else getDataForTable([]);
    }

    const onHandleClickSearch = async () => {
        await setIsLoading(true);
        await onHandleSearch();
        setIsLoading(false);
    }

    const getDataForTable = (datos) => {
        console.log("Crear tabla", datos)
        const listAux = datos.map((item) => {
            console.log("Item", item.c_prestamo)
            item.key = `${item.c_prestamo}-${item.c_compania}`;
            item.c_monedaprestamo = item.c_monedaprestamo === 'L' ? 'LOCAL' : 'EXTERIOR';
            item.c_estado = estados.find(estado => estado.value === item.c_estado).name;
            item.esVencido = item.esVencido === 'N' ? 'NO' : 'SI';
            return item;
        })
        setDataReportToTable(listAux);
    }

    //Funciones para obtener datos
    const getCompanias =  async () => {
        const response = await listAllCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
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

    //Efectos
    //Listas enlazadas
    useEffect(() => {
        setDepartamentoCodigo("");
        if(paisCodigo && departamentos.length !== 0) {
            const departamentosAux = departamentos.filter((item) => item.c_paiscodigo === paisCodigo);
            setDepartamentosFiltrados(departamentosAux);
        }
    }, [paisCodigo, departamentos])

    useEffect(() => {
        setProvinciaCodigo("");
        if(departamentoCodigo && provincias.length !== 0) {
            const provinciasAux = provincias.filter((item) => item.c_departamentocodigo === departamentoCodigo);
            setProvinciasFiltradas(provinciasAux);
        }
        if(!departamentoCodigo) {
            setProvinciasFiltradas([]);
        }
    }, [departamentoCodigo, provincias])

    useEffect(() => {
        setDistritoCodigo("");
        if(provinciaCodigo && distritos.length !== 0) {
            const distritosAux = distritos.filter((item) => item.c_provinciacodigo === provinciaCodigo);
            setDistritosFiltrados(distritosAux);
        }
        if(!provinciaCodigo) {
            setProvinciasFiltradas([]);
        }
    }, [provinciaCodigo, distritos])

    //Valor por defecto de la compañia
    useEffect(() => {
        if(companias.length !== 0) setCompania(companias[0].c_compania);
    }, [companias])

    //Cliente seleccionado
    useEffect(() => {
        if(clienteSeleccionado) {
            setCodigoCliente(clienteSeleccionado.n_cliente);
            setNombreCliente(clienteSeleccionado.c_nombrescompleto);
        }
    }, [clienteSeleccionado])

    useEffect( async () => {
        await setIsLoading(true);
        await getCompanias();
        await getPaises();
        await getDepartamentos();
        await getProvincias();
        await getDistritos();
        setIsLoading(false);
    }, []);

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
                        labelSpace={3}
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
                        labelSpace={3}
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
                        onHandleClick={handleOpenSearchModal}
                        onHandleBlur={findClienteByCode}
                        readOnly={true}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        labelSpace={3}
                    >
                    </SearcherComponent>
                    <InputComponent
                        state={nPrestamo}
                        setState={setNPrestamo}
                        type="text"
                        label="# Prestamo"
                        placeholder="# Prestamo"
                        inputId="nPrestamoInput"
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        labelSpace={3}
                    />
                    <SelectComponent
                        labelText="Vencido"
                        defaultValue="Seleccione"
                        items={[{ name: "AMBOS", value: "T" }, { name: "SI", value: "S" }, { name: "NO", value: "N" }]}
                        selectId="esVencidoId"
                        valueField="value"
                        optionField="name"
                        valueSelected={esVencido}
                        handleChange={setEsVencido}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        labelSpace={3}
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
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        labelSpace={3}
                        isClear={true}
                    />
                    <ReactSelect
                        inputId="departamentoCodeId"
                        labelText="Departamento"
                        placeholder="Seleccione un Departamento"
                        valueSelected={departamentoCodigo}
                        data={departamentosFiltrados}
                        handleElementSelected={setDepartamentoCodigo}
                        optionField="c_descripcion"
                        valueField="c_departamentocodigo"
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        labelSpace={3}
                    />
                    <ReactSelect
                        inputId="provinciaCodeId"
                        labelText="Provincia"
                        placeholder="Seleccione una Provincia"
                        valueSelected={provinciaCodigo}
                        data={provinciasFiltradas}
                        handleElementSelected={setProvinciaCodigo}
                        optionField="c_descripcion"
                        valueField="c_provinciacodigo"
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        labelSpace={3}
                    />
                    <ReactSelect
                        inputId="distritocodigoId"
                        labelText="Distrito"
                        placeholder="Seleccione una Distrito"
                        valueSelected={distritoCodigo}
                        data={distritosFiltrados}
                        handleElementSelected={setDistritoCodigo}
                        optionField="c_descripcion"
                        valueField="c_distritocodigo"
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        labelSpace={3}
                    />
                    <DateRangeComponent
                        inputId="fechaDesembolsoId"
                        labelText="Fecha de desembolso"
                        state={fechaDesembolso}
                        setState={setFechaDesembolso}
                        enabled={enabledFechaDesembolso}
                        setEnabled={setEnabledFechaDesembolso}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        labelSpace={3}
                    />
                    <DateRangeComponent
                        inputId="fechaCancelacionId"
                        labelText="Fecha de cancelación"
                        state={fechaCancelacion}
                        setState={setFechaCancelacion}
                        enabled={enabledFechaCancelacion}
                        setEnabled={setEnabledFechaCancelacion}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        labelSpace={3}
                    />
                    <DateRangeComponent
                        inputId="fechaVencimientoId"
                        labelText="Fecha de vencimiento"
                        state={fechaVencimiento}
                        setState={setFechaVencimiento}
                        enabled={enabledFechaVencimiento}
                        setEnabled={setEnabledFechaVencimiento}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        labelSpace={3}
                    />
                    <DateRangeComponent
                        inputId="fechaVencimientoId"
                        labelText="F. Vcto. Reprog."
                        state={fechaVencimientoReprogramada}
                        setState={setFechaVencimientoReprogramada}
                        enabled={enabledFechaVencimientoReprogramada}
                        setEnabled={setEnabledFechaVencimientoReprogramada}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        labelSpace={3}
                    />
                </div>
                <div className="col-12 col-md-12 mt-3 mb-3 text-center">
                    <button onClick={onHandleClickSearch} className='btn btn-light' style={{width: "200px"}}>Buscar</button>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Space style={{ marginBottom: 16 }}>
                            <ButtonDownloadExcel
                                fileName="reporteResumido"
                                sheet="reporte"
                                columns={columnsExportExcel}
                                content={dataReportToTable}
                            />
                        </Space>
                    </div>
                </div>
                <div className="row">
                    <div className="col" style={{ overflow: 'scroll' }}>
                        <Table
                            classForm
                            columns={columns}
                            dataSource={dataReportToTable}
                            pagination={{ pageSize: 50 }}
                        />
                    </div>
                </div>
            </ReportContainer>
            {isLoading === true && <Loading/>}
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
        </>
    )
};

export default ReporteDetallado;
