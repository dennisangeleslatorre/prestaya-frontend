import React, { useEffect, useState, useContext } from 'react'
//Componentes
import DateRangeComponent from '../../components/DateRangeComponent/DateRangeComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import PeriodoRange from '../../components/PeriodoRange/PeriodoRange';
import ReactSelect from '../../components/ReactSelect/ReactSelect';
import ReportContainer from '../../components/ReportContainer/ReportContainer'
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent';
import SelectComponent from '../../components/SelectComponent/SelectComponent';
import LoadingModal from '../../components/Modal/LoadingModal';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import ResponseModal from '../../components/Modal/ResponseModal';
import SearchModalProducto from '../../components/Modal/SearchModalProducto';
import SearchModalCliente from '../../components/Modal/SearchModalCliente';
//Context
import PagesContext from '../../context/PagesContext/PagesContext'
import UserContext from '../../context/UserContext/UserContext'
//Servicios
import { useHistory } from 'react-router'
import { listAllCompanias, listAgencias, getClienteByCodigoCliente, getProductoDinamico, getTransaccionDinamico, updateTransaccionAnular } from '../../Api/Api';
//Librerias
import moment from 'moment';
import { Button, Space, Table, Tooltip } from 'antd';


const estados = [
    { name: 'TODOS', value: 'TO' },
    { name: 'REGISTRADO', value: 'RE' },
    { name: 'ANULADO', value: 'AN' }
]

const tipos = [{value:"NI", option:"Nota de ingreso"}, {value:"NS", option:"Nota de salido"}, {value:"TO", option:"Todos"}]

const columns = [
    {
        title: 'Agencia',
        dataIndex: 'c_agencia_desc',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        render: (c_agencia_desc, objeto) => (
            <div onClick={objeto.hendleFunction}>
                <Tooltip placement="topLeft" title={c_agencia_desc}>
                    {c_agencia_desc}
                </Tooltip>
            </div>
        ),
    },{
        title: 'Tipo',
        dataIndex: 'c_tipodocumento_desc',
        ellipsis: {
            showTitle: false,
        },
        width: 120,
        render: (field, objeto) => (
            <div onClick={objeto.hendleFunction}>
                {field}
            </div>
        ),
    },{
        title: 'Numero Doc.',
        dataIndex: 'c_numerodocumento',
        ellipsis: {
            showTitle: false,
        },
        width: 120,
        render: (field, objeto) => (
            <div onClick={objeto.hendleFunction}>
                {field}
            </div>
        ),
    },{
        title: 'Fecha Doc',
        dataIndex: 'd_fechadocumento_formato',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
        render: (field, objeto) => (
            <div onClick={objeto.hendleFunction}>
                {field}
            </div>
        ),
    },{
        title: 'Periodo',
        dataIndex: 'c_periodo',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
        render: (field, objeto) => (
            <div onClick={objeto.hendleFunction}>
                {field}
            </div>
        ),
    },{
        title: 'Producto',
        dataIndex: 'c_descripcionproducto',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
        render: (c_descripcionproducto, objeto) => (
            <div onClick={objeto.hendleFunction}>
                <Tooltip placement="topLeft" title={c_descripcionproducto}>
                    {c_descripcionproducto}
                </Tooltip>
            </div>
        ),
    },{
        title: '# Prestamo',
        dataIndex: 'c_prestamo',
        width: 140,
         ellipsis: {
            showTitle: false,
        },
        render: (field, objeto) => (
            <div onClick={objeto.hendleFunction}>
                {field}
            </div>
        ),
    },{
        title: 'Moneda',
        dataIndex: 'c_moneda_desc',
        width: 140,
         ellipsis: {
            showTitle: false,
        },
        render: (field, objeto) => (
            <div onClick={objeto.hendleFunction}>
                {field}
            </div>
        ),
    },{
        title: 'Monto Total',
        dataIndex: 'n_montototal',
        ellipsis: {
            showTitle: false,
        },
        width: 160,
        className: 'text-numbers-table',
        render: (field, objeto) => (
            <div onClick={objeto.hendleFunction}>
                {field}
            </div>
        ),
    },{
        title: 'Observacioens',
        dataIndex: 'c_observaciones',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        render: (c_observaciones, objeto) => (
            <div onClick={objeto.hendleFunction}>
                <Tooltip placement="topLeft" title={c_observaciones}>
                    {c_observaciones}
                </Tooltip>
            </div>
        ),
    },{
        title:() => <label className='text-audit-table'>Estado</label>,
        dataIndex: 'c_estado_desc',
        width: 140,
         ellipsis: {
            showTitle: false,
        },
        className: 'table-audit-column text-audit-table',
        render: (field, objeto) => (
            <div onClick={objeto.hendleFunction}>
                {field}
            </div>
        ),
    },{
        title: 'Producto',
        dataIndex: 'c_descripcionproducto',
        ellipsis: {
            showTitle: false,
        },
        width: 200,
        render: (c_descripcionproducto, objeto) => (
            <div onClick={objeto.hendleFunction}>
                <Tooltip placement="topLeft" title={c_descripcionproducto}>
                    {c_descripcionproducto}
                </Tooltip>
            </div>
        ),
    },{
        title:() => <label className='text-audit-table'>U. Registro</label>,
        dataIndex: 'c_usuarioregistro',
        ellipsis: {
            showTitle: false,
        },
        width: 155,
        className: 'table-audit-column text-audit-table',
        render: (field, objeto) => (
            <div onClick={objeto.hendleFunction}>
                {field}
            </div>
        ),
    },{
        title:() => <label className='text-audit-table'>F. Registro</label>,
        dataIndex: 'd_fecharegistro',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        className: 'table-audit-column text-audit-table',
        render: (field, objeto) => (
            <div onClick={objeto.hendleFunction}>
                {field}
            </div>
        ),
    },{
        title:() => <label className='text-audit-table'>U. Modificación</label>,
        dataIndex: 'c_ultimousuario',
        ellipsis: {
            showTitle: false,
        },
        width: 155,
        className: 'table-audit-column text-audit-table',
        render: (field, objeto) => (
            <div onClick={objeto.hendleFunction}>
                {field}
            </div>
        ),
    },{
        title:() => <label className='text-audit-table'>F. Modificación</label>,
        dataIndex: 'd_ultimafechamodificacion',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        className: 'table-audit-column text-audit-table',
        render: (field, objeto) => (
            <div onClick={objeto.hendleFunction}>
                {field}
            </div>
        ),
    }
]

const TransaccionesTienda = () => {
    //Navegacion
    let history = useHistory();
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
    const [dataTableTransacciones, setDataTableTransacciones] = useState([]);
    //Producto
    const [codigoProducto, setCodigoProducto] = useState("");
    const [nombreProducto, setNombreProducto] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    //Listas
    const [companias, setCompanias] = useState([]);
    const [agencias, setAgencias] = useState([]);
    //Form
    const [open, setOpen] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const [openSearchModalProducto, setOpenSearchModalProducto] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [elementSelected, setElementSelected] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    //Contexto
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData().c_codigousuario;
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "NUEVA TRANSACCIÓN" || item === "ANULAR TRANSACCIÓN" || item === "RECIBO VENTA TIENDA" || item === 'VISUALIZAR TRANSACCIÓN'
    })
    const registerPermission = userPermisssions.includes("NUEVA TRANSACCIÓN");
    const cancelPermission = userPermisssions.includes("ANULAR TRANSACCIÓN");
    const ticetPermission = userPermisssions.includes("RECIBO VENTA TIENDA");
    const viewPermission = userPermisssions.includes('VISUALIZAR TRANSACCIÓN');

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
            getDataForTable(data);
        }
        else {
            getDataForTable([])
            setResponseData({title:"Aviso", message:"No se encontraron transacciones"});
        };
    }

    const gotoView = (c_tipodocumento,c_numerodocumento) => {
        history.push(`/visualizarTransaccion/${compania}/${agencia}/${c_tipodocumento}/${c_numerodocumento}`);
    }

    const getDataForTable = (transacciones) => {
        const listAux = transacciones.map((item) => {
            item.key = `${item.c_compania}-${item.c_agencia}-${item.c_tipodocumento}-${item.c_numerodocumento}`;
            item.c_estado_desc = estados.find(estado => estado.value === item.c_estado)?.name;
            item.c_tipodocumento_desc = item.c_tipodocumento === 'NI' ? 'Nota de ingreso' : 'Nota de salida';
            item.d_fechadocumento_formato = moment(item.d_fechadocumento).format("DD/MM/yyyy");
            item.d_fecharegistro = moment(item.d_fecharegistro).format("DD/MM/yyyy HH:MM:ss");
            item.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy HH:MM:ss") : "";
            item.c_moneda_desc = item.c_moneda === "L" ? "LOCAL" : "EXTRANJERO";
            item.n_montototal = Number(item.n_montototal).toFixed(2);
            item.hendleFunction = viewPermission ? ()=>gotoView(item.c_tipodocumento,item.c_numerodocumento) : ()=>{};
            return item;
        });
        setDataTableTransacciones(listAux);
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

    const clickAnularTransaccion = () => {
        if(elementSelected.length > 0) {
            if(elementSelected[0].c_tipodocumento === "NS")
                setOpen(true);
            else {
                setResponseData({title:"Aviso", message:"Tienes que seleccionar una nota de salida"});
                setOpenResponseModal(true);
            }
        } else {
            setResponseData({title:"Aviso", message:"Favor de seleccionar un item de la tabla"});
            setOpenResponseModal(true);
        }
    }

    const handleClickGoToPrintTicket = () => {
        if(elementSelected.length > 0) {
            if(elementSelected[0].c_tipodocumento === "NS")
                history.push(`/ticketVentaTienda/${elementSelected[0].c_compania}-${elementSelected[0].c_agencia}-${elementSelected[0].c_tipodocumento}-${elementSelected[0].c_numerodocumento}`);
            else {
                setResponseData({title:"Aviso", message:"Tienes que seleccionar una nota de salida"});
                setOpenResponseModal(true);
            }
        } else {
            setResponseData({title:"Aviso", message:"Favor de seleccionar un item de la tabla"});
            setOpenResponseModal(true);
        }
    }

    const handleAnular = async () => {
        if(elementSelected.length > 0) {
            const response = await updateTransaccionAnular({c_compania: elementSelected[0].c_compania, c_agencia: elementSelected[0].c_agencia,
                c_tipodocumento: elementSelected[0].c_tipodocumento, c_numerodocumento: elementSelected[0].c_numerodocumento, c_ultimousuario: userLogedIn});
            if(response.status === 200 && response.body.message === "OK") {
                onHandleSearch();
                setResponseData({title:"Aviso", message:"Se anuló la transacción con éxito"});
            } else
                setResponseData({title:"Aviso", message:response.message ? response.message : "Ocurrió un error en el servicio"});
        } else {
            setResponseData({title:"Aviso", message:"Favor de seleccionar un item de la tabla"});
        }
        setOpen(false);
        setOpenResponseModal(true);
    }

    const rowSelection = {
        onChange: (selectedKeys, selectedRows) => {
            setElementSelected(selectedRows);
            setSelectedRowKeys(selectedKeys);
        }
    };

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
                    { registerPermission && <Button onClick={()=>history.push(`/nuevaTransaccion/${compania}/${agencia}`)}>NUEVO</Button> }
                    { cancelPermission && <Button onClick={clickAnularTransaccion}>ANULAR</Button> }
                    { ticetPermission && <Button onClick={handleClickGoToPrintTicket}>RECIBO VENTA TIENDA</Button> }
                </Space>
            </div>
            <div className="col-12" style={{ overflow: 'scroll' }}>
                <Table
                    classForm
                    rowSelection={{
                        type: "radio",
                        ...rowSelection,
                        selectedRowKeys,
                    }}
                    columns={columns}
                    dataSource={dataTableTransacciones}
                    pagination={{ pageSize: 50 }}
                />
            </div>
        </ReportContainer>
        {isLoading === true && <LoadingModal/>}
        <ConfirmationModal
            isOpen={open}
            onClose={()=>setOpen(false)}
            title={"Aviso de retorno"}
            message={"¿Seguro que desea anular la transacción."}
            onHandleFunction={()=>handleAnular()}
            buttonClass="btn-success"
        />
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

export default TransaccionesTienda