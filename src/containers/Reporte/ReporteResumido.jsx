import React, { useEffect, useState } from 'react'
import { Table, Divider, Space, Button } from 'antd'
import ReportContainer from '../../components/ReportContainer/ReportContainer'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import PeriodoRange from '../../components/PeriodoRange/PeriodoRange'
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent'
import SearchModalCliente from '../../components/Modal/SearchModalCliente'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
import ButtonDownloadExcel from '../../components/ButtonDownloadExcel/ButtonDownloadExcel'
import { listAllCompanias, getDataReporteResumidos } from '../../Api/Api'


const columns = [
    {
        title: 'Periodo',
        dataIndex: 'c_periodo'
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
        title: 'Moneda P.',
        dataIndex: 'c_monedaprestamo'
    },
    {
        title: 'Monto Prestamo',
        dataIndex: 'calc_sumamontoprestamo'
    },
    {
        title: 'Monto Intereses',
        dataIndex: 'calc_sumamontointereses'
    },
    {
        title: 'Monto Total P.',
        dataIndex: 'calc_sumamontototalprestamo'
    },
    {
        title: 'Monto Valor Prod.',
        dataIndex: 'calc_sumamontovalorproductos'
    },
    {
        title: 'Interes Cancelado',
        dataIndex: 'calc_sumainterecamcelado'
    },
    {
        title: 'Monto Prest. Cancelado',
        dataIndex: 'calc_montoprestamocancelado'
    },
    {
        title: 'Mnto. Comision Canc.',
        dataIndex: 'calc_sumacomisioncancelada'
    },
    {
        title: 'Mnto. Total Cancelado',
        dataIndex: 'calc_sumamontototalcancelado'
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

const ReporteResumido = () => {
    const [compania, setCompania] = useState("");
    const [codigoCliente, setCodigoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [periodo, setPeriodo] = useState({periodoInicio:"", periodoFin:"", isValid:null});
    const [dataReportToTable, setDataReportToTable] = useState([]);
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
                setOpenResponseModal(true);
            }
        }
        setIsLoading(false);
    }

    const prepareBodyToSearch = () => {
        let body = {};
        if(compania) body.c_compania = compania;
        if(codigoCliente) body.n_cliente = codigoCliente;
        if(periodo.isValid) {
            body.periodoInicio = periodo.periodoInicio;
            body.periodoFin = periodo.periodoFin;
        }
        return body;
    }

    const onHandleSearch = async () => {
        let parametros = prepareBodyToSearch();
        const response = await getDataReporteResumidos(parametros);
        if(response && response.status === 200 && response.body.data) getDataForTable(response.body.data);
        else getDataForTable([]);
    }

    const onHandleClickSearch = async () => {
        await setIsLoading(true);
        await onHandleSearch();
        setIsLoading(false);
    }

    const getDataForTable = (datos) => {
        const listAux = datos.map((item) => {
            item.key = `${item.n_cliente}-${item.c_monedaprestamo}`;
            item.periodo = item.periodo || "";
            return item;
        })
        setDataReportToTable(listAux);
    }

    const getCompanias =  async () => {
        const response = await listAllCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }

    useEffect( async () => {
        await setIsLoading(true);
        await getCompanias();
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

export default ReporteResumido;
