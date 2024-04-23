import React, {useContext, useState, useEffect} from 'react'
import ReportContainer from '../../components/ReportContainer/ReportContainer'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import DateRangeComponent from '../../components/DateRangeComponent/DateRangeComponent'
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent'
import ButtonDownloadExcel from '../../components/ButtonDownloadExcel/ButtonDownloadExcel'
import { Space } from 'antd'
import ResponseModal from '../../components/Modal/ResponseModal'
import SearchModalCliente from '../../components/Modal/SearchModalCliente'
import SearchModalProducto from '../../components/Modal/SearchModalProducto'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import PeriodoRange from '../../components/PeriodoRange/PeriodoRange'
import LoadingModal from '../../components/Modal/LoadingModal';
import { listAllCompanias, listAgenciesByUserAndCompany, getClienteByCodigoCliente, getProductoDinamico, getReporteTransaccion } from '../../Api/Api';
import moment from 'moment';
import { formatPeriodo } from '../../utilities/Functions/FormatPeriodo'
import UserContext from '../../context/UserContext/UserContext'
//PDF
import { PDFViewer  } from "@react-pdf/renderer"
import ReporteTransaccionesPdfComponent from '../../components/ReporteTransaccionesPdfComponent/ReporteTransaccionesPdfComponent'

const estados = [
    { name: 'TODOS', value: 'TO' },
    { name: 'REGISTRADO', value: 'RE' },
    { name: 'ANULADO', value: 'AN' }
]

const tipos = [{value:"NI", option:"Nota de ingreso"}, {value:"NS", option:"Nota de salido"}, {value:"TO", option:"Todos"}]

const columnsExportExcel = [
    {
        label: 'Agencia',
        value: row => (row.c_agencia_desc || '')
    },
    {
        label: 'Tipo',
        value: row => (row.c_tipodocumento || '')
    },
    {
        label: 'Numero Doc.',
        value: row => (row.c_numerodocumento || '')
    },
    {
        label: 'Fecha Doc',
        value: row => (moment(row.d_fechadocumento).format('DD/MM/yyyy') || '')
    },
    {
        label: 'Periodo',
        value: row => (formatPeriodo(row.c_periodo) || '')
    },
    {
        label: 'Cliente',
        value: row => (row.c_nombrescompleto || '')
    },
    {
        label: 'Moneda',
        value: row => (row.c_moneda ? (row.c_moneda === 'L' ? 'LOCAL' : 'EXTRANJERO') : '')
    },
    {
        label: 'Observaciones Cab.',
        value: row => (row.c_obsv_cabecera || '')
    },
    {
        label: 'Linea',
        value: row => (row.n_linea || '')
    },
    {
        label: 'Producto',
        value: row => (row.c_descripcionproducto || '')
    },
    {
        label: 'Descripcion Producto',
        value: row => (row.c_item || '')
    },
    {
        label: 'Unidad M.',
        value: row => (row.c_unidadmedida || '')
    },
    {
        label: 'Cantidad',
        value: row => (row.n_cantidad || '')
    },
    {
        label: 'Precio',
        value: row => (row.n_precio || '')
    },
    {
        label: 'Monto total',
        value: row => (row.n_montototal || '')
    },
    {
        label: 'Observaciones Det.',
        value: row => (row.c_observacionesdet || '')
    }
]

const ReporteTransaccionesTienda = () => {
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData().c_codigousuario;
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
    const [disabledPeriodo, setDisabledPeriodo] = useState(false);
    const [estado, setEstado] = useState("RE");
    const [nPrestamo, setNPrestamo] = useState({value:""});
    //Listas obtenidas
    const [dataReportToTable, setDataReportToTable] = useState([]);
    const [elementPdf, setElementPdf] = useState(null);
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
    const [isLoading , setIsLoading ] = useState(false);

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
        if(agencia && agencia !== "T") body.c_agencia = agencia;
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
        body.c_codigousuario = userLogedIn;
        return body;
    }

    const prepareHeadPdf = () => {
        let head = {};
        head.company_name = companias.find(item => item.c_compania === compania)?.c_descripcion;
        if(fecha.isValid && !disabledFilterFecha) head.fecha_descripcion = `Fecha: del ${moment(fecha.fechaInicio).format('DD/MM/YYYY')} al ${moment(fecha.fechaFin).format('DD/MM/YYYY')}`;
        if(periodo.isValid && !disabledPeriodo) head.periodo_descripcion = `Periodo: del ${periodo.periodoInicio} al ${periodo.periodoInicio}`;
        head.tipo_descripcion = tipos.find(item => item.value === tipo)?.option;
        return head;
    }

    const prepareDataToPdf = (data=[], dataHeadPdf) => {
        const arregloAgrupado = data.reduce((acumulador, elemento) => {
            const grupo = `${elemento.c_compania}-${elemento.c_agencia}-${elemento.c_item}`;
            if (!acumulador[grupo]) {
                acumulador[grupo] = {};
                acumulador[grupo].key = grupo;
                acumulador[grupo].data = [];
                acumulador[grupo].sumaLocal = 0;
                acumulador[grupo].sumaExterior = 0;
                acumulador[grupo].cantidad = 0;
            }
            acumulador[grupo].data.push(elemento);
            if (elemento.c_moneda === "L") {
                if (elemento.c_tipodocumento === "NI") {
                    acumulador[grupo].sumaLocal = Number(Number(acumulador[grupo].sumaLocal) + Number(elemento.n_montototal)).toFixed(2);
                    acumulador[grupo].cantidad = Number(Number(acumulador[grupo].cantidad) + Number(elemento.n_cantidad)).toFixed(0);
                  } else if (elemento.c_tipodocumento === "NS") {
                    acumulador[grupo].sumaLocal = Number(Number(acumulador[grupo].sumaLocal) - Number(elemento.n_montototal)).toFixed(2);
                    acumulador[grupo].cantidad = Number(Number(acumulador[grupo].cantidad) - Number(elemento.n_cantidad)).toFixed(0);
                  }
            } else {
                if (elemento.c_tipodocumento === "NI") {
                    acumulador[grupo].sumaExterior = Number(Number(acumulador[grupo].sumaExterior) + Number(elemento.n_montototal)).toFixed(2);
                    acumulador[grupo].cantidad = Number(Number(acumulador[grupo].cantidad) + Number(elemento.n_cantidad)).toFixed(0);
                  } else if (elemento.c_tipodocumento === "NS") {
                    acumulador[grupo].sumaExterior = Number(Number(acumulador[grupo].sumaExterior) - Number(elemento.n_montototal)).toFixed(2);
                    acumulador[grupo].cantidad = Number(Number(acumulador[grupo].cantidad) - Number(elemento.n_cantidad)).toFixed(0);
                  }
            }
            return acumulador;
          }, {});
          setElementPdf({data: arregloAgrupado, dataHeadPdf: dataHeadPdf});
    }

    const onHandleSearch = async () => {
        let parametros =  prepareBodyToSearch();
        const response = await getReporteTransaccion(parametros);
        if(response && response.status === 200 && response.body.data) {
            const data = response.body.data;
            const dataHeadPdf = prepareHeadPdf();
            setDataReportToTable(data)
            prepareDataToPdf(data, dataHeadPdf);
        }
        else {
            setElementPdf(null);
            setDataReportToTable([]);
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
        const response = await listAgenciesByUserAndCompany({c_compania: companyCode, c_codigousuario: userLogedIn});
        if(response && response.status === 200 && response.body.data) setAgencias([{c_agencia: 'T', c_descripcion: 'TODOS'},...response.body.data]);
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
                        disabledElement={true}
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
                {<div className="col-12">
                    { elementPdf ? <PDFViewer
                        className="col-12"
                        style={{height: "800px"}}
                        children={<ReporteTransaccionesPdfComponent data={elementPdf.data} dataHeadPdf={elementPdf.dataHeadPdf}/>}
                    /> : <div className="text-center">
                        <h2>No se a realizado una búsqueda</h2>
                    </div> }
                </div>}
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