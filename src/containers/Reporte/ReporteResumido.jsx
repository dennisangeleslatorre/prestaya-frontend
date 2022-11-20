import React, { useEffect, useState } from 'react'
import ReportContainer from '../../components/ReportContainer/ReportContainer'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import PeriodoRange from '../../components/PeriodoRange/PeriodoRange'
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent'
import SearchModalCliente from '../../components/Modal/SearchModalCliente'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
import ButtonDownloadExcel from '../../components/ButtonDownloadExcel/ButtonDownloadExcel'
import moment from 'moment'
//Api
import { listAllCompanias, getDataReporteResumidos, getClienteByCodigoCliente } from '../../Api/Api'
//PDF
import { PDFViewer  } from "@react-pdf/renderer"
import ReporteResumidoPDFComponent from '../../components/ReporteResumidoPDFComponent/ReporteResumidoPDFComponent'

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

const ReporteResumido = () => {
    const [compania, setCompania] = useState("");
    const [codigoCliente, setCodigoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [periodo, setPeriodo] = useState({periodoInicio:"", periodoFin:"", isValid:null});
    const [dataReportToTable, setDataReportToTable] = useState([]);
    const [elementPdf, setElementPdf] = useState(null);
    //Estados del formulario
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal ] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    //Listas
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
        if(periodo.isValid) {
            body.periodo_inicio = periodo.periodoInicio.replace("-", "");
            body.periodo_fin = periodo.periodoFin.replace("-", "");
        }
        return body;
    }

    const prepareDataResumen = (data) => {
        let elements = {};
        data.forEach(item => {
            if( !elements[`${item.periodo}-${item.cliente}-${item.moneda}`]){
                elements[`${item.periodo}-${item.cliente}-${item.moneda}`] = {
                    c_periodo: item.periodo,
                    n_cliente: item.cliente,
                    c_nombrescompleto: item.clientenombre,
                    c_monedaprestamo: item.moneda === 'L' ? 'LOCAL' : 'EXTERIOR'
                }
            }
            if(item.d_fechadesembolso) {
                elements[`${item.periodo}-${item.cliente}-${item.moneda}`].calc_sumamontoprestamo = item.calc_sumamontoprestamo;
                elements[`${item.periodo}-${item.cliente}-${item.moneda}`].calc_sumamontointereses = item.calc_sumamontointereses;
                elements[`${item.periodo}-${item.cliente}-${item.moneda}`].calc_sumamontototalprestamo = item.calc_sumamontototalprestamo;
                elements[`${item.periodo}-${item.cliente}-${item.moneda}`].calc_sumamontovalorproductos = item.calc_sumamontovalorproductos;
            } else {
                elements[`${item.periodo}-${item.cliente}-${item.moneda}`].calc_sumainterecamcelado = item.calc_sumainterecamcelado;
                elements[`${item.periodo}-${item.cliente}-${item.moneda}`].calc_montoprestamocancelado = item.calc_montoprestamocancelado;
                elements[`${item.periodo}-${item.cliente}-${item.moneda}`].calc_sumacomisioncancelada = item.calc_sumacomisioncancelada;
                elements[`${item.periodo}-${item.cliente}-${item.moneda}`].calc_sumamontototalcancelado = item.calc_sumamontototalcancelado;
            }
        })
        return Object.values(elements);
    };

    const separateDataByPeriodo = (datos) => {
        let grupoPeriodo = {};
        datos.forEach(item => {
            if( !grupoPeriodo[item.c_periodo]){
                grupoPeriodo[item.c_periodo] = {
                    lineasReporte: [],
                    sumaxperiodo_montoprestamocancelado : 0,
                    sumaxperiodo_montocomisioncancelada : 0,
                    sumaxperiodo_montointerecamcelado : 0,
                    sumaxperiodo_montointereses : 0,
                    sumaxperiodo_montoprestamo : 0,
                    sumaxperiodo_montototalcancelado : 0,
                    sumaxperiodo_montototalprestamo : 0,
                    sumaxperiodo_montovalorproductos : 0,
                }
            }
            grupoPeriodo[item.c_periodo].lineasReporte.push(item);
            if(item.calc_montoprestamocancelado) grupoPeriodo[item.c_periodo].sumaxperiodo_montoprestamocancelado += Number(item.calc_montoprestamocancelado);
            if(item.calc_sumacomisioncancelada) grupoPeriodo[item.c_periodo].sumaxperiodo_montocomisioncancelada += Number(item.calc_sumacomisioncancelada);
            if(item.calc_sumainterecamcelado) grupoPeriodo[item.c_periodo].sumaxperiodo_montointerecamcelado += Number(item.calc_sumainterecamcelado);
            if(item.calc_sumamontointereses) grupoPeriodo[item.c_periodo].sumaxperiodo_montointereses += Number(item.calc_sumamontointereses);
            if(item.calc_sumamontoprestamo) grupoPeriodo[item.c_periodo].sumaxperiodo_montoprestamo += Number(item.calc_sumamontoprestamo);
            if(item.calc_sumamontototalcancelado) grupoPeriodo[item.c_periodo].sumaxperiodo_montototalcancelado += Number(item.calc_sumamontototalcancelado);
            if(item.calc_sumamontototalprestamo) grupoPeriodo[item.c_periodo].sumaxperiodo_montototalprestamo += Number(item.calc_sumamontototalprestamo);
            if(item.calc_sumamontovalorproductos) grupoPeriodo[item.c_periodo].sumaxperiodo_montovalorproductos += Number(item.calc_sumamontovalorproductos);
        })
        return grupoPeriodo;
    };

    const getDataForPDF = (datos) => {
        let element = {};
        const dataPorPeriodo = separateDataByPeriodo(datos);
        element.dataPorPeriodo = dataPorPeriodo;
        element.periodo = periodo;
        element.compania = companias.find(item => item.c_compania = compania).c_descripcion;
        setElementPdf(element);
    };

    const onHandleSearch = async () => {
        let parametros = prepareBodyToSearch();
        const response = await getDataReporteResumidos(parametros);
        if(response && response.status === 200 && response.body.data) {
            const data = response.body.data;
            const dataResumen = prepareDataResumen(data);
            getDataForTable(dataResumen);
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
            item.key = `${item.c_periodo}-${item.n_cliente}-${item.c_monedaprestamo}`;
            item.periodo = item.periodo || "";
            return item;
        })
        setDataReportToTable(listAux);
    }

    const getCompanias =  async () => {
        const response = await listAllCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }

    const getPeriodoDefualt = () => {
        const periodoAux = moment().format('yyyy-MM');
        setPeriodo({periodoInicio:periodoAux, periodoFin:periodoAux, isValid:true})
    };

    useEffect( async () => {
        await setIsLoading(true);
        await getCompanias();
        getPeriodoDefualt();
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if(companias.length !== 0) setCompania(companias[0].c_compania);
    }, [companias])

    useEffect(() => {
        if(clienteSeleccionado) {
            setCodigoCliente(clienteSeleccionado.n_cliente);
            setNombreCliente(clienteSeleccionado.c_nombrescompleto);
        }
    }, [clienteSeleccionado])

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
                    <PeriodoRange
                        inputId="periodoId"
                        labelText="Periodo"
                        state={periodo}
                        setState={setPeriodo}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                        labelSpace={3}
                    />
                </div>
                <div className="col-12 col-md-12 mt-3 mb-3 text-center">
                    <button onClick={onHandleClickSearch} className='btn btn-light' style={{width: "200px"}}>Buscar</button>
                </div>
                <ButtonDownloadExcel
                    fileName="reporteResumido"
                    sheet="reporte"
                    columns={columnsExportExcel}
                    content={dataReportToTable}
                />
                <div className="col-12">
                    {elementPdf ? <PDFViewer
                        className="col-12"
                        style={{height: "800px"}}
                        children={<ReporteResumidoPDFComponent element={elementPdf}/>}
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

export default ReporteResumido;
