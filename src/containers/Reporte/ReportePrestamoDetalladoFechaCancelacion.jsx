import React, { useContext, useEffect, useState } from 'react'
import LoadingModal from '../../components/Modal/LoadingModal';
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import ResponseModal from '../../components/Modal/ResponseModal';
import ReportContainer from '../../components/ReportContainer/ReportContainer';
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent';
import moment from 'moment';
import SelectComponent from '../../components/SelectComponent/SelectComponent';
import SearchModalCliente from '../../components/Modal/SearchModalCliente';
import DateRangeComponent from '../../components/DateRangeComponent/DateRangeComponent';
import NumberRangeComponent from '../../components/NumberRangeComponent/NumberRangeComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import ButtonDownloadExcel from '../../components/ButtonDownloadExcel/ButtonDownloadExcel';
import { listAllCompanias, listAgenciesByUserAndCompany, getClienteByCodigoCliente, getPrestamosDetalladoPeriodo, listAllPaises,
    listAllDepartamentos, listAllProvincias, listAllDistritos } from '../../Api/Api';
import { PDFViewer  } from "@react-pdf/renderer";
import ReportePrestamoDetalladoFCancelacionPdfComponent from '../../components/ReportePrestamoDetalladoFCancelacionPdfComponent/ReportePrestamoDetalladoFCancelacionPdfComponent';
import UserContext from '../../context/UserContext/UserContext'

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
        value: row => (row.d_fechadesembolso ? moment(row.d_fechadesembolso).format("DD/MM/yyyy") : "")
    },
    {
        label: 'F. Vencimiento',
        value: row => (row.d_fechavencimientoprestamo ? moment(row.d_fechavencimientoprestamo).format("DD/MM/yyyy") : '')
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
        label: 'Monto Intereses',
        value: row => (row.n_montointereses || '')
    },
    {
        label: 'Monto Total P.',
        value: row => (row.n_montototalprestamopres || '')
    },
    {
        label: 'Dias Plazo Totales',
        value: row => (row.n_diastranscurridos || '')
    },
    {
        label: 'F. Vcto. Reprog.',
        value: row => (row.d_fechavencimiento_reprog ? moment(row.d_fechavencimiento_reprog).format('DD/MM/yyyy'): '')
    },
    {
        label: 'F. Cancelacion',
        value: row => (row.d_d_fechacancelacionmaxdet ? moment(row.d_d_fechacancelacionmaxdet).format('DD/MM/yyyy'): '')
    },
    {
        label: 'Dias Vencido',
        value: row => (row.DIAS_VENCIDOS || '')
    },
    {
        label: 'Vencido',
        value: row => (row.VENCIDOS || '')
    },
    {
        label: 'Tipo de cancelación',
        value: row => (row.c_tipocancelacion || '')
    },
    {
        label: 'F. cancelación detalle',
        value: row => (row.d_fechacancelaciondet ? moment(row.d_fechacancelaciondet).format('DD/MM/yyyy') : '')
    },
    {
        label: 'Interes cancelado',
        value: row => (row.n_montointeresescancelar || '')
    },
    {
        label: 'Monto P.Can',
        value: row => (row.n_montoprestamocancelar || '')
    },
    {
        label: 'M. Comi. Can',
        value: row => (row.n_montocomisioncancelar || '')
    },
    {
        label: 'Monto Total Ca.',
        value: row => (row.n_montototalcancelar || '')
    },
    {
        label: 'Estado',
        value: row => (row.estado_prestamo || '')
    },
    {
        label: 'Agencia',
        value: row => (row.c_agenciadesc || '')
    },
    {
        label: 'Producto',
        value: row => (row.c_descripcionproducto || '')
    },
]

const estados = [
    { name: 'TODOS', value: 'T' },
    { name: 'VIGENTE', value: 'VI' },
    { name: 'CANCELADO', value: 'CA' },
    { name: 'ENTREGADO', value: 'EN' },
    { name: 'REMATE', value: 'RE' }
]


const ReportePrestamoDetalladoFechaCancelacion = () => {
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData().c_codigousuario;
    //Filtros
    const [compania, setCompania] = useState("");
    const [agencia, setAgencia] = useState("T");
    const [estado, setEstado] = useState("T");
    const [codigoCliente, setCodigoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [fechaDesembolso, setFechaDesembolso] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [disabledFilterFechaDesembolso, setDisabledFilterFechaDesembolso] = useState(true);
    const [fechaCancelacion, setFechaCancelacion] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [disabledFilterFechaCancelacion, setDisabledFilterFechaCancelacion] = useState(true);
    const [nPrestamo, setNPrestamo] = useState({value:""});
    const [esVencido, setEsVencido] = useState("T");
    const [diasVencido, setDiasVencido] = useState({inicio:0, fin:0, isValid: false});
    const [disabledFilterDiasVencido, setDisabledFilterDiasVencido] = useState(true);
    const [fechaVencimiento, setFechaVencimiento] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [disabledFilterFechaVencimiento, setDisabledFilterFechaVencimiento] = useState(true);
    const [fechaVencimientoReprogramada, setFechaVencimientoReprogramada] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [disabledFilterFechaVencimientoReprogramada, setDisabledFilterFechaVencimientoReprogramada] = useState(true);
    const [fechaCancelacionDetalle, setFechaCancelacionDetalle] =
        useState({fechaInicio: moment().startOf('month').format('YYYY-MM-DD'), fechaFin: moment().endOf('month').format('YYYY-MM-DD'), isValid: false});
    const [disabledFilterFechaCancelacionDetalle, setDisabledFilterFechaCancelacionDetalle] = useState(false);
    const [paisCodigo, setPaisCodigo] = useState("");
    const [departamentoCodigo, setDepartamentoCodigo] = useState("");
    const [provinciaCodigo, setProvinciaCodigo] = useState("");
    const [distritoCodigo, setDistritoCodigo] = useState("");
    const [fechaActual, setFechaActual] = useState({value:moment().format("yyyy-MM-DD")});
    //Listas
    const [companias, setCompanias] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState([]);
    const [provinciasFiltradas, setProvinciasFiltradas] = useState([]);
    const [distritosFiltrados, setDistritosFiltrados] = useState([]);
    //Form
    const [dataReportToTable, setDataReportToTable] = useState([]);
    const [elementPdf, setElementPdf] = useState(null);
    const [general, setGeneral] = useState({esVencido:"", fechaActual:"", estado:""});
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
        let filters = {};
        if(compania) body.c_compania = compania;
        if(agencia && agencia !== "T") body.c_agencia = agencia;
        if(nPrestamo.value) body.c_prestamo = nPrestamo.value;
        if(estado && estado !== "T") body.c_estado = estado;
        filters.estado = estados.find(e => e.value === estado).name;
        if(codigoCliente) body.n_cliente = codigoCliente;
        if(diasVencido.isValid && !disabledFilterDiasVencido) {
            body.n_diasvencido_inicio = diasVencido.inicio;
            body.n_diasvencido_fin = diasVencido.fin;
        }
        if(esVencido && esVencido !== "T") {
            body.c_vencido = esVencido === "S" ? "SI" : "NO";
            filters.esVencido = esVencido === "S" ? "SI" : "NO";
        } else {
            filters.esVencido = "AMBOS";
            filters.c_vencido = "AMBOS";
        }
        if(paisCodigo) body.c_paiscodigo = paisCodigo;
        if(departamentoCodigo) body.c_despartamentocodigo = departamentoCodigo;
        if(provinciaCodigo) body.c_provinciacodigo = provinciaCodigo;
        if(distritoCodigo) body.c_distritocodigo = distritoCodigo;

        if(fechaCancelacion.isValid && !disabledFilterFechaCancelacion) {
            body.d_fechacancelacioninicio = fechaCancelacion.fechaInicio;
            body.d_fechacancelacionfin = fechaCancelacion.fechaFin;
        }
        if(fechaDesembolso.isValid && !disabledFilterFechaDesembolso) {
            body.d_fechadesembolsoinicio = fechaDesembolso.fechaInicio;
            body.d_fechadesembolsofin = fechaDesembolso.fechaFin;
        }
        if(fechaVencimiento.isValid && !disabledFilterFechaVencimiento) {
            body.d_fechavencimientoinicio = fechaVencimiento.fechaInicio;
            body.d_fechavencimientofin = fechaVencimiento.fechaFin;
        }
        if(fechaVencimientoReprogramada.isValid && !disabledFilterFechaVencimientoReprogramada) {
            body.d_fvencimientoreproinicio = fechaVencimientoReprogramada.fechaInicio;
            body.d_fvencimientoreprofin = fechaVencimientoReprogramada.fechaFin;
        }
        if(fechaActual.value) {
            body.d_fechaactual = fechaActual.value;
            filters.fechaActual = fechaActual.value;
        };
        if(fechaCancelacionDetalle.isValid && !disabledFilterFechaCancelacionDetalle) {
            body.d_fechacancelaciondetinicio = fechaCancelacionDetalle.fechaInicio;
            body.d_fechacancelaciondetfin = fechaCancelacionDetalle.fechaFin;
        }
        body.c_codigousuario = userLogedIn;
        setGeneral(filters);
        return body;
    }

    const onHandleSearch = async () => {
        let parametros =  prepareBodyToSearch();
        const response = await getPrestamosDetalladoPeriodo(parametros);
        if(response && response.status === 200 && response.body.data) {
            const data = response.body.data;
            getDataForTable(data);
            getDataForPDF(data);
        }
        else {
            getDataForTable([]);
            getDataForPDF([]);
        };
    }

    const getLineasReportes = (datos) => {
        let element = {
            suma_montointerescancelar: 0,
            suma_montoprestamocancelar: 0,
            suma_montocomisioncancelar: 0,
            suma_montototalcancelar: 0
        };

        datos.forEach((obj) => {
            element.suma_montointerescancelar = (Number(element.suma_montointerescancelar) + Number(obj.n_montointeresescancelar)).toFixed(2);
            element.suma_montoprestamocancelar = (Number(element.suma_montoprestamocancelar) + Number(obj.n_montoprestamocancelar)).toFixed(2);
            element.suma_montocomisioncancelar = (Number(element.suma_montocomisioncancelar) + Number(obj.n_montocomisioncancelar)).toFixed(2);
            element.suma_montototalcancelar = (Number(element.suma_montototalcancelar) + Number(obj.n_montototalcancelar)).toFixed(2);
        });
        element.lineasReporte = datos;
        return element;
    }

    const getDataForPDF = (datos) => {
        let element = {};
       const dataReportes = getLineasReportes(datos);
       element = {...dataReportes};
       element.compania = companias.find(item => item.c_compania = compania).c_descripcion;
       setElementPdf(element);
    };

    const getDataForTable = (datos) => {
        setDataReportToTable(datos);
    }

    const onHandleClickSearch = async () => {
        await setIsLoading(true);
        await onHandleSearch();
        setIsLoading(false);
    }

    //Listas
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
    const getAgenciasByCompany = async (companyCode) => {
        const response = await listAgenciesByUserAndCompany({c_compania: companyCode, c_codigousuario: userLogedIn});
        if(response && response.status === 200 && response.body.data) setAgencias([{c_agencia:"T", c_descripcion:"TODAS"}, ...response.body.data]);
    }

    useEffect(() => {
        if(clienteSeleccionado) {
            setCodigoCliente(clienteSeleccionado.n_cliente);
            setNombreCliente(clienteSeleccionado.c_nombrescompleto);
        }
    }, [clienteSeleccionado])

    //Listas enlazadas
    useEffect(() => {
        setDepartamentoCodigo("");
        setDepartamentosFiltrados([]);
        if(paisCodigo && departamentos.length !== 0) {
            const departamentosAux = departamentos.filter((item) => item.c_paiscodigo === paisCodigo);
            setDepartamentosFiltrados(departamentosAux);
        }
    }, [paisCodigo, departamentos])

    useEffect(() => {
        setProvinciaCodigo("");
        setProvinciasFiltradas([]);
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
        setDistritosFiltrados([]);
        if(provinciaCodigo && distritos.length !== 0) {
            const distritosAux = distritos.filter((item) => item.c_provinciacodigo === provinciaCodigo);
            setDistritosFiltrados(distritosAux);
        }
        if(!provinciaCodigo) {
            setProvinciasFiltradas([]);
        }
    }, [provinciaCodigo, distritos])

    useEffect(() => {
        if(companias.length !== 0) {
            handleSeleccionarCompania(companias[0].c_compania);
            setAgencia("T");
        };
    }, [companias])

    useEffect(async () => {
        await setIsLoading(true);
        await getCompanias();
        await getPaises();
        await getDepartamentos();
        await getProvincias();
        await getDistritos();
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
                    >
                    </SearcherComponent>
                    <DateRangeComponent
                        inputId="fechaDesembolsoId"
                        labelText="Fecha de desembolso"
                        state={fechaDesembolso}
                        setState={setFechaDesembolso}
                        enabled={disabledFilterFechaDesembolso}
                        setEnabled={setDisabledFilterFechaDesembolso}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <DateRangeComponent
                        inputId="fechaCancelacionId"
                        labelText="Fecha de cancelación"
                        state={fechaCancelacion}
                        setState={setFechaCancelacion}
                        enabled={disabledFilterFechaCancelacion}
                        setEnabled={setDisabledFilterFechaCancelacion}
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
                    />
                    <NumberRangeComponent
                        inputId="diasVencidoId"
                        labelText="Días Vencido"
                        state={diasVencido}
                        setState={setDiasVencido}
                        checked={disabledFilterDiasVencido}
                        setChecked={setDisabledFilterDiasVencido}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <DateRangeComponent
                        inputId="fechaVencimientoId"
                        labelText="Fecha de vencimiento"
                        state={fechaVencimiento}
                        setState={setFechaVencimiento}
                        enabled={disabledFilterFechaVencimiento}
                        setEnabled={setDisabledFilterFechaVencimiento}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <DateRangeComponent
                        inputId="fechaVencimientoReproId"
                        labelText="F. Vcto. Reprog."
                        state={fechaVencimientoReprogramada}
                        setState={setFechaVencimientoReprogramada}
                        enabled={disabledFilterFechaVencimientoReprogramada}
                        setEnabled={setDisabledFilterFechaVencimientoReprogramada}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
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
                    />
                    <InputComponent
                        label="Fecha Actual"
                        state={fechaActual}
                        setState={setFechaActual}
                        type="date"
                        placeholder="Fecha Actual"
                        inputId="fechaActualId"
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <DateRangeComponent
                        inputId="fechaCancelacionDetalleId"
                        labelText="F. cancelación detalle"
                        state={fechaCancelacionDetalle}
                        setState={setFechaCancelacionDetalle}
                        enabled={disabledFilterFechaCancelacionDetalle}
                        setEnabled={setDisabledFilterFechaCancelacionDetalle}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                </div>
                <div className="col-12 col-md-12 mt-3 mb-3 text-center">
                    <button onClick={onHandleClickSearch} className='btn btn-light' style={{width: "200px"}}>Buscar</button>
                </div>
                <ButtonDownloadExcel
                    fileName="reporteDetalladoFechaCancelacion"
                    sheet="reporte"
                    columns={columnsExportExcel}
                    content={dataReportToTable}
                />
                <div className="col-12">
                    {elementPdf ? <PDFViewer
                        className="col-12"
                        style={{height: "800px"}}
                        children={<ReportePrestamoDetalladoFCancelacionPdfComponent element={elementPdf} general={general}/>}
                    /> : <div className="text-center">
                        <h2>No se a realizado una búsqueda</h2>
                    </div>}
                </div>
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
        </>
    )
}

export default ReportePrestamoDetalladoFechaCancelacion