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
//PDF
import { PDFViewer  } from "@react-pdf/renderer"
import ReporteDetalladoPDFComponent from '../../components/ReporteDetalladoPDFComponent/ReporteDetalladoPDFComponent'
import moment from 'moment'

const columnsExportExcel = [
    {
        label: '# Prestamo',
        value: row => (row.c_prestamo || '')
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
        label: 'F. Desembolso',
        value: row => (row.d_fechadesembolso || '')
    },
    {
        label: 'Dias Plazo',
        value: row => (row.calc_diasplazototales || '')
    },
    {
        label: 'F. Vencimiento',
        value: row => (row.d_fechavencimiento || '')
    },
    {
        label: 'Moneda P.',
        value: row => (row.c_monedaprestamo || '')
    },
    {
        label: 'Monto Prestamo',
        value: row => (row.n_montoprestamo || '')
    },
    {
        label: '% Tasa Interes',
        value: row => (row.n_tasainteres || '')
    },
    {
        label: 'Monto Intereses',
        value: row => (row.n_montointereses || '')
    },
    {
        label: 'Monto Total P.',
        value: row => (row.n_montototalprestamo || '')
    },
    {
        label: 'Monto Valor Prod.',
        value: row => (row.calc_sumamontovalorproductos || '')
    },
    {
        label: 'Dias Plazo Totales',
        value: row => (row.calc_diasplazototales || '')
    },
    {
        label: 'F. Vcto. Reprog.',
        value: row => (row.d_fechavencimientoreprogramada || '')
    },
    {
        label: 'F. Cancelacion',
        value: row => (row.ultimafechacancelacionregistrada || '')
    },
    {
        label: 'Dias Vencido',
        value: row => (row.calc_diasvencido || '')
    },
    {
        label: 'Vencido',
        value: row => (row.esvencido || '')
    },
    {
        label: 'Interes Cancelado',
        value: row => (row.calc_sumainterescancelado || '')
    },
    {
        label: 'Monto Prest. Cancelado',
        value: row => (row.calc_sumamontoprestamocancelado || '')
    },
    {
        label: 'Mnto. Comision Canc.',
        value: row => (row.calc_sumamontocomisioncancelada || '')
    },
    {
        label: 'Mnto. Total Cancelado',
        value: row => (row.calc_sumamontotalcancelado || '')
    },
    {
        label: 'Estado',
        value: row => (row.c_estado || '')
    },
    {
        label: 'Distrito',
        value: row => (row.nombredistrito || '')
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
    const [excluiranulados, setExcluiranulados] = useState(false);
    const [solovalidos, setSolovalidos] = useState(false);
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
    const [elementPdf, setElementPdf] = useState(null);
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
        } else
            setNombreCliente("");
        setIsLoading(false);
    }

    const prepareBodyToSearch = () => {
        let body = {};
        if(compania) body.c_compania = compania;
        if(codigoCliente) body.n_cliente = codigoCliente;
        if(esVencido && esVencido !== 'T') body.esvencido = esVencido;
        if(paisCodigo) body.c_paiscodigo = paisCodigo;
        if(departamentoCodigo) body.c_despartamentocodigo = departamentoCodigo;
        if(provinciaCodigo) body.c_provinciacodigo = provinciaCodigo;
        if(distritoCodigo) body.c_distritocodigo = distritoCodigo;
        if(estado && estado !== "T") body.c_estado = estado;

        if(excluiranulados) body.excluiranulados = excluiranulados;
        if(solovalidos) body.solovalidos = solovalidos;

        if(fechaDesembolso.isValid && !enabledFechaDesembolso) {
            body.d_fechadesembolsoinicio = fechaDesembolso.fechaInicio;
            body.d_fechadesembolsofin = fechaDesembolso.fechaFin;
        }
        if(fechaCancelacion.isValid && !enabledFechaCancelacion) {
            body.d_fechacancelacioninicio = fechaCancelacion.fechaInicio;
            body.d_fechacancelacionfin = fechaCancelacion.fechaFin;
        }
        if(fechaVencimiento.isValid && !enabledFechaVencimiento) {
            body.d_fechavencimientoinicio = fechaVencimiento.fechaInicio;
            body.d_fechavencimientofin = fechaVencimiento.fechaFin;
        }
        if(enabledFechaVencimientoReprogramada.isValid && !enabledFechaVencimientoReprogramada) {
            body.d_fechavencimientoreprogramadainicio = enabledFechaVencimientoReprogramada.fechaInicio;
            body.d_fechavencimientoreprogramadafin = enabledFechaVencimientoReprogramada.fechaFin;
        }
        console.log('body', body)
        return body;
    }

    const getSumas = (datos) => {
        let element = {
            suma_montoprestamo: 0,
            suma_montointereses: 0,
            suma_montototalprestamo: 0,
            suma_montovalorproductos: 0,
            suma_interescancelado: 0,
            suma_montoprestamocancelado: 0,
            suma_montocomisioncancelado: 0,
            suma_montototalcancelado: 0
        };
        element.lineasReporte = datos;
        datos.forEach(item => {
            if(item.n_montoprestamo) element.suma_montoprestamo += Number(item.n_montoprestamo);
            if(item.n_montointereses) element.suma_montointereses += Number(item.n_montointereses);
            if(item.n_montototalprestamo) element.suma_montototalprestamo += Number(item.n_montototalprestamo);
            if(item.calc_sumamontovalorproductos) element.suma_montovalorproductos += Number(item.calc_sumamontovalorproductos);
            if(item.calc_sumainterescancelado) element.suma_interescancelado += Number(item.calc_sumainterescancelado);
            if(item.calc_sumamontoprestamocancelado) element.suma_montoprestamocancelado += Number(item.calc_sumamontoprestamocancelado);
            if(item.calc_sumamontocomisioncancelada) element.suma_montocomisioncancelado += Number(item.calc_sumamontocomisioncancelada);
            if(item.calc_sumamontotalcancelado) element.suma_montototalcancelado += Number(item.calc_sumamontotalcancelado);
        })
        return element;
    };

    const getDataForPDF = (datos) => {
        let element = {};
        const dataReportes = getSumas(datos);
        element = {...dataReportes};
        element.compania = companias.find(item => item.c_compania = compania).c_descripcion;
        setElementPdf(element);
    };

    const onHandleSearch = async () => {
        let parametros = prepareBodyToSearch();
        const response = await getDataReporteDetallado(parametros);
        if(response && response.status === 200 && response.body.data) {
            const data = response.body.data;
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
        getDataForPDF(datos);
        const listAux = datos.map((item) => {
            item.key = `${item.c_prestamo}-${item.c_compania}`;
            item.c_monedaprestamo = item.c_monedaprestamo === 'L' ? 'LOCAL' : 'EXTERIOR';
            item.c_estado = estados.find(estado => estado.value === item.c_estado).name;
            item.esVencido = item.esVencido === 'N' ? 'NO' : 'SI';
            item.d_fechadesembolso = item.d_fechadesembolso ? moment(item.d_fechadesembolso).format('DD/MM/yyyy') : "";
            item.d_fechavencimiento = item.d_fechavencimiento ? moment(item.d_fechavencimiento).format('DD/MM/yyyy') : "";
            item.d_fechavencimientoreprogramada = item.d_fechavencimientoreprogramada ? moment(item.d_fechavencimientoreprogramada).format('DD/MM/yyyy') : "";
            item.ultimafechacancelacionregistrada = item.ultimafechacancelacionregistrada ? moment(item.ultimafechacancelacionregistrada).format('DD/MM/yyyy') : "";
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
                    <SelectComponent
                        labelText="Excluir anulados"
                        defaultValue="Excluir anulados"
                        items={[{name:"SI", value:true},{name:"NO", value:false}]}
                        selectId="excluirAnuladosId"
                        valueField="value"
                        optionField="name"
                        valueSelected={excluiranulados}
                        handleChange={setExcluiranulados}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        labelSpace={3}
                    />
                    <SelectComponent
                        labelText="Solo válidos"
                        defaultValue="Solo válidos"
                        items={[{name:"SI", value:true},{name:"NO", value:false}]}
                        selectId="soloValidosId"
                        valueField="value"
                        optionField="name"
                        valueSelected={solovalidos}
                        handleChange={setSolovalidos}
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
                <div className="col-12">
                    {elementPdf ? <PDFViewer
                        className="col-12"
                        style={{height: "800px"}}
                        children={<ReporteDetalladoPDFComponent element={elementPdf}/>}
                    /> : <div className="text-center">
                        <h2>No se a realizado una búsqueda</h2>
                    </div>}
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
