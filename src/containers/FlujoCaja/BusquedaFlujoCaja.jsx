import React, { useContext, useEffect, useState } from 'react'
import { Table, Space, Button, Tooltip } from 'antd'
//Componentes
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import DateRangeComponent from '../../components/DateRangeComponent/DateRangeComponent'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
import FlujoCajaDetalleModal from '../../components/FlujoCajaUsuarioModal/FlujoCajaDetalleModal'
import FlujoCajaDetalleMovimientosModal from '../../components/FlujoCajaUsuarioModal/FlujoCajaDetalleMovimientosModal'
//Context
import PagesContext from '../../context/PagesContext/PagesContext'
import CajaContext from '../../context/CajaContext/CajaContext'
//Funciones
import { useHistory } from 'react-router'
import { listCompanias, listAgencias, listUsers, getFlujoCajaDinamico } from '../../Api/Api'
import moment from 'moment'
import { separator } from '../../utilities/Functions/FormatNumber';

const columns = [
    {
        title: 'Compañía',
        dataIndex: 'c_companiadesc',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
        render: (c_companiadesc, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {c_companiadesc}
            </div>
        ),
    },{
        title: 'Nro. CCU',
        dataIndex: 'n_correlativo',
        ellipsis: {
            showTitle: false,
        },
        width: 130,
        render: (n_correlativo, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {n_correlativo}
            </div>
        ),
    },{
        title: 'Agencia',
        dataIndex: 'c_agenciadesc',
        ellipsis: {
            showTitle: false,
        },
        width: 200,
        render: (c_agenciadesc, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {c_agenciadesc}
            </div>
        ),
    },{
        title: 'Tipo Caja',
        dataIndex: 'c_tipofcu',
        ellipsis: {
            showTitle: false,
        },
        width: 160,
        render: (c_tipofcu, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {c_tipofcu}
            </div>
        ),
    },{
        title: 'Usuario CC',
        dataIndex: 'c_usuariofcu',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        render: (c_usuariofcu, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {c_usuariofcu}
            </div>
        ),
    },{
        title: 'F. Inicio',
        dataIndex: 'd_fechaInicioMov',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
        render: (d_fechaInicioMov, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {d_fechaInicioMov}
            </div>
        ),
    },{
        title: 'F. Fin',
        dataIndex: 'd_fechaFinMov',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
        render: (d_fechaFinMov, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {d_fechaFinMov}
            </div>
        ),
    },{
        title: 'Estado',
        dataIndex: 'c_estado',
        ellipsis: {
            showTitle: false,
        },
        width: 130,
        render: (c_estado, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {c_estado}
            </div>
        ),
    },{
        title: 'Moneda',
        dataIndex: 'c_monedafcu',
        ellipsis: {
            showTitle: false,
        },
        width: 130,
        render: (c_monedafcu, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {c_monedafcu}
            </div>
        ),
    },{
        title: 'Mnto Ingresos',
        dataIndex: 'n_montoingresos',
        ellipsis: {
            showTitle: false,
        },
        width: 160,
        className: 'text-numbers-table',
        render: (n_montoingresos, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {n_montoingresos}
            </div>
        ),
    },{
        title: 'Mnto Salidas',
        dataIndex: 'n_montosalidas',
        ellipsis: {
            showTitle: false,
        },
        width: 160,
        className: 'text-numbers-table',
        render: (n_montosalidas, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {n_montosalidas}
            </div>
        ),
    },{
        title: 'Mnto. Saldo',
        dataIndex: 'n_saldo',
        ellipsis: {
            showTitle: false,
        },
        width: 160,
        className: 'text-numbers-table',
        render: (n_saldo, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {n_saldo}
            </div>
        ),
    },{
        title: 'Observaciones',
        dataIndex: 'c_observaciones',
        ellipsis: {
            showTitle: true,
        },
        width: 180,
        render: (c_observaciones, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
                <Tooltip placement="topLeft" title={c_observaciones}>
                    {c_observaciones}
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
        render: (c_usuarioregistro, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {c_usuarioregistro}
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
        render: (d_fecharegistro, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {d_fecharegistro}
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
        render: (c_ultimousuario, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {c_ultimousuario}
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
        render: (d_ultimafechamodificacion, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {d_ultimafechamodificacion}
            </div>
        ),
    }
]

const tiposCajaUsuario = [
    { name: 'TODOS', value: 'T' },
    { name: 'BOVEDA', value: 'B' },
    { name: 'PERSONAL', value: 'P' }
]

const estadosCajaUsuario = [
    { name: 'TODOS', value: 'T' },
    { name: 'ACTIVO', value: 'A' },
    { name: 'INACTIVO', value: 'I' }
]

const BusquedaFlujoCaja = () => {
    let history = useHistory();
    const { setFlujoCaja, setDetalles, setEliminarDetalles, setEliminarMovimientos } = useContext(CajaContext);
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === 'NUEVA CAJA CHICA USUARIO' || item === 'MODIFICAR CAJA CHICA USUARIO' || item === 'MOVIMIENTOS CAJA USUARIO POR CONFIRMAR'
    });
    const registerPermission = userPermisssions.includes("NUEVA CAJA CHICA USUARIO");
    const updatePermission = userPermisssions.includes("MODIFICAR CAJA CHICA USUARIO");
    const confirmationPermissions = userPermisssions.includes("MOVIMIENTOS CAJA USUARIO POR CONFIRMAR");
    //Estados del form
    const [compania, setCompania] = useState("");
    const [agencia, setAgencia] = useState("T");
    const [estado, setEstado] = useState("T");
    const [tipoCajaUsuario, setTipoCajaUsuario] = useState("T");
    const [usuarioFlujoCaja, setUsuarioFlujoCaja] = useState("T");
    const [fechaRegistro, setFechaRegistro] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaRegistro, setEnabledFechaRegistro] = useState(true);
    const [fechaMovimiento, setFechaMovimiento] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaMovimiento, setEnabledFechaMovimiento] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal ] = useState(false);
    const [openModalDetalleFlujoCaja, setOpenModalDetalleFlujoCaja] = useState(false);
    const [openModalDetalleFlujoCajaMovimientos, setOpenModalDetalleFlujoCajaMovimientos] = useState(false);
    const [elementSelected, setElementSelected] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [itemFlujoCajaSelected, setItemFlujoCajaSelected] = useState({c_compania:"", n_correlativo:""});
    const [itemFlujoCajaDetalleSelected, setItemFlujoCajaDetalleSelected] = useState({c_compania:"", n_correlativo:"", d_fechamov:""});
    //Estados de las listas
    const [companias, setCompanias] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    //Estadostablas
    const [flujosCajaTabla, setFlujosCajaTabla] = useState([]);
    //Atributos de la tabla
    const rowSelection = {
        onChange: (selectedKeys, selectedRows) => {
            setElementSelected(selectedRows);
            setSelectedRowKeys(selectedKeys);
        }
    };
    //Funciones de selecion
    const handleSeleccionarCompania = (value) => {
        setCompania(value);
        //Deberia buscar las agencias de la compañía
        getAgenciasByCompany(value);
    }
    const prepareBodyToSearch = () => {
        let body = {};
        if(compania) body.c_compania = compania;
        if(agencia && agencia !== "T") body.c_agencia = agencia;
        if(estado && estado !== "T") body.c_estado = estado;
        if(tipoCajaUsuario && tipoCajaUsuario !== "T") body.c_tipofcu = tipoCajaUsuario;
        if(usuarioFlujoCaja && usuarioFlujoCaja !== "T") body.c_usuariofcu = usuarioFlujoCaja;
        if(fechaRegistro.isValid && !enabledFechaRegistro) {
            body.d_fecharegistroinicio = fechaRegistro.fechaInicio;
            body.d_fecharegistrofin = fechaRegistro.fechaFin;
        }
        if(fechaMovimiento.isValid && !enabledFechaMovimiento) {
            body.d_fechamovimientoinicio = fechaMovimiento.fechaInicio;
            body.d_fechamovimientofin = fechaMovimiento.fechaFin;
        }
        return body;
    }
    //Funciones de los botones
    const onHandleClickBuscar = async () => {
        await setIsLoading(true);
        let parametros = prepareBodyToSearch();
        const response = await getFlujoCajaDinamico(parametros);
        if(response && response.status === 200 ) {
            setDataFlujoCajaTable(response.body.data);
        } else {
            setDataFlujoCajaTable([]);
        }
        setElementSelected([]);
        setSelectedRowKeys([]);
        setIsLoading(false);
    }
    const handleSelectNuevo = () => {
        if(compania)
            {
                setFlujoCaja({general:{}, firstArrival:true});
                setDetalles([]);
                setEliminarDetalles([]);
                setEliminarMovimientos([]);
                history.push(`/nuevaCajaChicaUsuario/${compania}`);
            }
    }
    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setResponseData({title:title, message:message})
        setOpenResponseModal(true);
    }
    const handleSelectActualizar = () => {
        if(elementSelected[0]) {
            setFlujoCaja({general:{}, firstArrival:true});
            history.push(`/actualizarCajaChicaUsuario/${elementSelected[0].c_compania}/${elementSelected[0].n_correlativo}`);
        } else {
            prepareNotificationDanger("Aviso", "Selecciona un item de la tabla.");
        }
    }
    const handleIrConfirmarMovimientos = () => {
        history.push('movimientosCUxConfirmar');
    }
    const handleMostrarDetalleCaja = (c_compania, n_correlativo) => {
        setOpenModalDetalleFlujoCaja(true);
        setItemFlujoCajaSelected({c_compania:c_compania, n_correlativo:n_correlativo});
    }
    const handleMostrarDetalleCajaMovimiento = (c_compania, n_correlativo, d_fechamov) => {
        setOpenModalDetalleFlujoCajaMovimientos(true);
        setItemFlujoCajaDetalleSelected({c_compania:c_compania, n_correlativo:n_correlativo, d_fechamov:d_fechamov});
    }
    //Datos de la tabla
    const setDataFlujoCajaTable = (flujosCajaTable) => {
        const listAux = JSON.parse(JSON.stringify(flujosCajaTable)).map((item) => {
            let aux = {};
            aux.key = `${item.c_compania}-${item.n_correlativo}`;
            aux.c_compania = item.c_compania;
            aux.c_companiadesc = item.c_companiadesc;
            aux.n_correlativo = item.n_correlativo;
            aux.c_agenciadesc = item.c_agenciadesc;
            aux.c_tipofcu = item.c_tipofcu === "P" ? "PERSONAL" : "BOVEDA";
            aux.c_usuariofcu = item.c_usuariofcu;
            aux.d_fechaInicioMov = item.d_fechaInicioMov ? moment(item.d_fechaInicioMov).local().format('DD/MM/yyyy') : "";
            aux.d_fechaFinMov = item.d_fechaFinMov ? moment(item.d_fechaFinMov).local().format('DD/MM/yyyy') : "";
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.c_monedafcu = item.c_monedafcu === "L" ? "LOCAL" : "EXTRANJERO";
            aux.n_montoingresos = item.n_montoingresos ? separator(Number(item.n_montoingresos).toFixed(2)) : "0.00";
            aux.n_montosalidas = item.n_montosalidas ? separator(Number(item.n_montosalidas).toFixed(2)) : "0.00";
            aux.n_saldo = separator(Number(item.n_montoingresos - item.n_montosalidas).toFixed(2));
            aux.c_observaciones = item.c_observaciones;
            aux.c_usuarioregistro = item.c_usuarioregistro;
            aux.d_fecharegistro = item.d_fecharegistro ? moment(item.d_fecharegistro).format('DD/MM/yyyy HH:mm:ss') : "";
            aux.c_ultimousuario = item.c_ultimousuario;
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format('DD/MM/yyyy HH:mm:ss') : "";
            aux.handleMostrarDetalleCajaRow = () => handleMostrarDetalleCaja(item.c_compania, item.n_correlativo);
            return aux;
        });
        setFlujosCajaTabla(listAux);
    }

    //Funciones con servicios de lista
    const getCompanias =  async () => {
        const response = await listCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }
    const getAgenciasByCompany = async (companyCode) => {
        const response = await listAgencias({c_compania: companyCode});
        if(response && response.status === 200 && response.body.data) setAgencias([{c_agencia:"T", c_descripcion:"TODAS"}, ...response.body.data]);
    }
    const getUsuarios = async () => {
        const response = await listUsers();
        if(response && response.status === 200) setUsuarios([{c_codigousuario: "T", c_nombres: "TODOS"}, ...response.body.data]);
    }

    useEffect(() => {
        if(companias.length !== 0) {
            handleSeleccionarCompania(companias[0].c_compania);
            setAgencia("");
        };
    }, [companias])

    useEffect(async () => {
        await setIsLoading(true);
        await getCompanias();
        await getUsuarios();
        setIsLoading(false);
    }, [])

    return (
        <>
            <div className="container-fluid pt-2 pb-2 pl-2 pr-2" style={{ background: '#FFFFFF' }}>
                <div className="row" >
                    <div className="col">
                        <div className="card pr-3 pl-3">
                            <div className="card-body">
                                <div className="row">
                                    <div className="row col-12 col-md-12">
                                        <ReactSelect
                                            inputId="companiaCodeId"
                                            labelText="Compañía"
                                            placeholder="Seleccione un compañía"
                                            valueSelected={compania}
                                            data={companias}
                                            handleElementSelected={handleSeleccionarCompania}
                                            optionField="c_descripcion"
                                            valueField="c_compania"
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
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
                                            labelSpace={3}
                                        />
                                        <SelectComponent
                                            labelText="Estados"
                                            defaultValue="Seleccione un estado"
                                            items={estadosCajaUsuario}
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
                                            labelText="Tipo Caja Usuario"
                                            defaultValue="Seleccione un tipo"
                                            items={tiposCajaUsuario}
                                            selectId="tipoCajaId"
                                            valueField="value"
                                            optionField="name"
                                            valueSelected={tipoCajaUsuario}
                                            handleChange={setTipoCajaUsuario}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <ReactSelect
                                            inputId="usuarioCodeId"
                                            labelText="Usuario"
                                            placeholder="Seleccione un Usuario"
                                            valueSelected={usuarioFlujoCaja}
                                            data={usuarios}
                                            handleElementSelected={setUsuarioFlujoCaja}
                                            optionField="c_nombres"
                                            valueField="c_codigousuario"
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                         <DateRangeComponent
                                            inputId="fechaRegistroId"
                                            labelText="Fecha de registro"
                                            state={fechaRegistro}
                                            setState={setFechaRegistro}
                                            enabled={enabledFechaRegistro}
                                            setEnabled={setEnabledFechaRegistro}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <DateRangeComponent
                                            inputId="fechaMovimientoId"
                                            labelText="Fecha de movimiento"
                                            state={fechaMovimiento}
                                            setState={setFechaMovimiento}
                                            enabled={enabledFechaMovimiento}
                                            setEnabled={setEnabledFechaMovimiento}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                    </div>
                                    <div className="col-12 col-md-12 mt-3 mb-3 text-center">
                                        <button onClick={onHandleClickBuscar} className='btn btn-light' style={{width: "200px"}}>Buscar</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <Space size={[10, 3]} wrap style={{ marginBottom: 16 }}>
                                            { registerPermission && <Button onClick={handleSelectNuevo}>NUEVO</Button> }
                                            { updatePermission && <Button onClick={handleSelectActualizar}>MODIFICAR</Button> }
                                            { confirmationPermissions && <Button onClick={handleIrConfirmarMovimientos}>CONFIRMAR MOVIMIENTOS</Button> }
                                        </Space>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col" style={{ overflow: 'scroll' }}>
                                        <Table
                                            classForm
                                            rowSelection={{
                                                type: "radio",
                                                ...rowSelection,
                                                selectedRowKeys,
                                            }}
                                            columns={columns}
                                            dataSource={flujosCajaTabla}
                                            pagination={{ pageSize: 50 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading === true && <Loading/>}
            <ResponseModal
                isOpen={openResponseModal}
                title={responseData.title}
                onClose={()=>setOpenResponseModal(false)}
                message={responseData.message}
            />
            <FlujoCajaDetalleModal
                isOpen={openModalDetalleFlujoCaja}
                onClose={(()=>setOpenModalDetalleFlujoCaja(false))}
                c_compania={itemFlujoCajaSelected.c_compania }
                n_correlativo={itemFlujoCajaSelected.n_correlativo}
                handleMostrarDetalleCajaMovimiento={handleMostrarDetalleCajaMovimiento}
            />
            <FlujoCajaDetalleMovimientosModal
                isOpen={openModalDetalleFlujoCajaMovimientos}
                onClose={(()=>setOpenModalDetalleFlujoCajaMovimientos(false))}
                c_compania={itemFlujoCajaDetalleSelected.c_compania }
                n_correlativo={itemFlujoCajaDetalleSelected.n_correlativo}
                d_fechamov={itemFlujoCajaDetalleSelected.d_fechamov}
            />
        </>
    )
}

export default BusquedaFlujoCaja