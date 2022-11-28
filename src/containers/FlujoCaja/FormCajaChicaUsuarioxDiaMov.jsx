import React, { useContext, useEffect, useState } from 'react'
import { Table, Space, Button, Tooltip } from 'antd'
//Componentes
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import InputComponentView from '../../components/InputComponent/InputComponentView'
import TextareaComponent from '../../components/TextareaComponent/TextareaComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import HeaderForm from '../../components/HeaderForm/HeaderForm'
import FlujoCajaDetalleMovimientoForm from '../../components/FlujoCajaUsuarioModal/FlujoCajaDetalleMovimientoForm'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import CajaContext from '../../context/CajaContext/CajaContext'
import PagesContext from '../../context/PagesContext/PagesContext'
//Librerias
import { useHistory, useLocation } from 'react-router'
import { listTipoMovimientoCaja } from '../../Api/Api'
import moment from 'moment'
import { separator } from '../../utilities/Functions/FormatNumber';

const columns = [
    {
        title: '#',
        dataIndex: 'key',
        ellipsis: {
            showTitle: false,
        },
        width: 130,
    },{
        title: 'Tipo Movimiento',
        dataIndex: 'tipoMovimiento',
        ellipsis: {
            showTitle: false,
        },
        width: 240,
        render: c_observaciones => (
            <Tooltip placement="topLeft" title={c_observaciones}>
            {c_observaciones}
            </Tooltip>
        )
    },{
        title: 'Usuario Mov.',
        dataIndex: 'c_usuariomovimiento',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
    },{
        title: 'Observaciones',
        dataIndex: 'c_observaciones',
        ellipsis: {
            showTitle: false,
        },
        width: 260,
        render: c_observaciones => (
            <Tooltip placement="topLeft" title={c_observaciones}>
            {c_observaciones}
            </Tooltip>
        )
    },{
        title: 'Monto x Mov.',
        dataIndex: 'n_montoxdiamov_format',
        ellipsis: {
            showTitle: false,
        },
        width: 160,
        className: 'text-numbers-table'
    },{
        title:() => <label className='text-audit-table'>U. Registro</label>,
        dataIndex: 'c_usuarioregistro',
        ellipsis: {
            showTitle: false,
        },
        width: 155,
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>F. Registro</label>,
        dataIndex: 'd_fecharegistro_format',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>U. Modificación</label>,
        dataIndex: 'c_ultimousuario',
        ellipsis: {
            showTitle: false,
        },
        width: 155,
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>F. Modificación</label>,
        dataIndex: 'd_ultimafechamodificacion_format',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>Secuencia</label>,
        dataIndex: 'n_secuencia',
        ellipsis: {
            showTitle: false,
        },
        width: 100,
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>Préstamo</label>,
        dataIndex: 'c_prestamo',
        ellipsis: {
            showTitle: false,
        },
        width: 120,
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>Linea</label>,
        dataIndex: 'n_linea',
        ellipsis: {
            showTitle: false,
        },
        width: 100,
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>Flag por confirmar</label>,
        dataIndex: 'flagConfirmar',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>Flag confirmado</label>,
        dataIndex: 'c_flagconfirmado_desc',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>U. Confirmado</label>,
        dataIndex: 'c_usuarioconfirmado',
        ellipsis: {
            showTitle: false,
        },
        width: 155,
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>F. Confirmado</label>,
        dataIndex: 'd_fechaconfirmado_format',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        className: 'table-audit-column text-audit-table',
    }
]

const estados = [
    {value:"A" , name:"ABIERTO" }, {value:"C" , name:"CERRADO" }
]

const FormCajaChicaUsuarioxDiaMov = () => {
    let history = useHistory();
    let location = useLocation();
    const urlFragment = location.pathname.split('/')[1];
    const { flujoCaja, setFlujoCaja, detalleSeleccionado, setDetalleSeleccionado, setMovimientoSeleccionado, detalles, setDetalles,
            eliminarMovimientos, setEliminarMovimientos } = useContext(CajaContext);
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "USUARIO ACCESO TOTAL CAJA"
    });
    const usuarioAccesoTotalCajaPermiso = userPermisssions.includes("USUARIO ACCESO TOTAL CAJA");
    //Estados del form
    const [compania, setCompania] = useState("");
    const [nroCorrelativo, setNroCorrelativo] = useState("");
    const [fechaMov, setFechaMov] = useState({value:"", isValid:false});
    const [estado, setEstado] = useState("A");
    const [observaciones, setObservaciones] = useState("");
    const [usuarioRegistro, setUsuarioRegistro] = useState("");
    const [fechaRegistro, setFechaRegistro] = useState("");
    const [usuarioModiciacion, setUsuarioModiciacion] = useState("");
    const [fechaModiciacion, setFechaModiciacion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal ] = useState(false);
    const [openMovimientoModal, setOpenMovimientoModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [tiposMovimientos, setTiposMovimientos] = useState([]);
    const [movimientos, setMovimientos] = useState([]);
    const [elementSelectedRows, setElementSelectedRows] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const validDate = () => {
        let fechaInicio = moment(flujoCaja.general.d_fechaInicioMov);
        let fechaFin= moment(flujoCaja.general.d_fechaFinMov);
        let fechaMovMoment = moment(fechaMov.value);
        return fechaMovMoment.isBetween(fechaInicio, fechaFin, "days", "[]");
    }
    //Validaciones
    const showMessageValidationDate = () => {
        let fechaInicio = moment(flujoCaja.general.d_fechaInicioMov);
        let fechaFin= moment(flujoCaja.general.d_fechaFinMov);
        if(fechaMov.value) {
            if(!validDate())
            return (
                <div className='invalid__message__data'>
                    La fecha de movimiento debe estar en el rango: {fechaInicio.format('DD/MM/yyyy')} - {fechaFin.format('DD/MM/yyyy')}
                </div>
            )
        } else{
            return <div className='invalid__message__data'>Debe llenar la fecha de movimiento</div>
        }
    }
    //Estados tablas
    const [movimientosCajaTabla, setMovimientosCajaTabla] = useState([]);
    //Atributos de la tabla
    const rowSelection = {
        onChange: (selectedKeys, selectedRows) => {
            setElementSelectedRows(selectedRows);
            setSelectedRowKeys(selectedKeys);
        }
    };

    const prepareDetalle = () => {
        return {
            general: {
                ...detalleSeleccionado.general,
                d_fechamov:fechaMov.value,
                c_estado:estado,
                c_observaciones:observaciones
            }, movimientos:movimientos.map(item => {item.d_fechamov = fechaMov.value; return item;})
        }
    }

    const validateSaldoMovimientos = () => {
        if(flujoCaja.general.c_flagsaldoxdia === 'S') {
            let saldo = 0.00;
            JSON.parse(JSON.stringify(movimientos)).forEach(mov => {
                saldo = saldo + ( ( tiposMovimientos.find(tipo => tipo.c_tipomovimientocc === mov.c_tipomovimientocc).c_clasetipomov === "S" ? -1 : 1 ) * Number(mov.n_montoxdiamov) );
            });

            if( saldo >= 0 ) {
                return true;
            }
                return false;
        } else {
            return true;
        }
    }

    //Funciones de selecion
    const handleAgregarDetalle = () => {
        //Valida antes
        if(fechaMov.value && validDate() && observaciones && movimientos.length !== 0) {
            const validateFechaRegistrada = detalles.find(item => item.general.d_fechamov === fechaMov.value);
            if(!validateFechaRegistrada) {
                const isValidsaldo = validateSaldoMovimientos();
                if(isValidsaldo) {
                    const detalleAux = prepareDetalle();
                    //Establece los valores
                    setFlujoCaja({...flujoCaja, firstArrival:false});
                    setDetalles([...detalles, detalleAux]);
                    setDetalleSeleccionado({general:{}, movimientos:[]});
                    history.goBack();
                } else {
                    setResponseData({title:"Aviso", message:"El saldo calculado por día es negativo."})
                    setOpenResponseModal(true);
                }
            } else {
                setResponseData({title:"Aviso", message:"Hay un detalle registrado con esa fecha"})
                setOpenResponseModal(true);
            }
        } else {
            setResponseData({title:"Aviso", message:"Debe llenar el formulario superior y tener algún movimiento"})
            setOpenResponseModal(true);
        }
    }

    const handleActualizarDetalle = () => {
        //Valida antes
        if(fechaMov.value && validDate() && observaciones && movimientos.length !== 0) {
            const validateFechaRegistrada = detalles.find((item, index) => item.general.d_fechamov === fechaMov.value && index !== detalleSeleccionado.index);
            if(!validateFechaRegistrada) {
                const isValidsaldo = validateSaldoMovimientos();
                if(isValidsaldo) {
                    const detalleAux = prepareDetalle();
                    let detallesAux = [...detalles];
                    detallesAux[Number(detalleSeleccionado.index)] = detalleAux;
                    //Establece los valores
                    setFlujoCaja({...flujoCaja, firstArrival:false});
                    setDetalles(detallesAux);
                    setDetalleSeleccionado({general:{}, movimientos:[]});
                    history.goBack();
                } else {
                    setResponseData({title:"Aviso", message:"El saldo calculado por día es negativo."})
                    setOpenResponseModal(true);
                }
            } else {
                setResponseData({title:"Aviso", message:"Hay un detalle registrado con esa fecha"})
                setOpenResponseModal(true);
            }

        } else {
            setResponseData({title:"Aviso", message:"Debe llenar el formulario superior y tener algún movimiento"})
            setOpenResponseModal(true);
        }
    }

    const handleCancelar = () => {
        setFlujoCaja({...flujoCaja, firstArrival:false});
        setDetalleSeleccionado({general:{}, movimientos:[]});
        history.goBack();
    }
    const handleSelectNuevo = () => {
        if(fechaMov.value) {
            setOpenMovimientoModal(true);
            setMovimientoSeleccionado({general:
                {   c_compania: detalleSeleccionado.general.c_compania,
                    key:movimientos.length+1
                }, action:"ADD"})
        } else {
            setOpenResponseModal(true);
            setResponseData({title:"Aviso", message:"Debe seleccionar una fecha"});
        }
    }
    const handleSelectActualizar = () => {
        if(selectedRowKeys.length > 0) {
            setMovimientoSeleccionado({
                general:{
                    ...elementSelectedRows[0]
                },
                action:"UPDATE"
            });
            setOpenMovimientoModal(true);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }

    const handleSelectDelete = () => {
        if(selectedRowKeys.length > 0) {
            if(elementSelectedRows[0].c_prestamo || elementSelectedRows[0].c_flagconfirmado === 'S') {
                setResponseData({title:"Aviso", message:"No puedes eliminar un movimiento generado en el flujo de prestamos."})
                setOpenResponseModal(true);
            } else {
                setOpenConfirmationModal(true);
            }
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }

    const handleEliminar = () => {
        setOpenConfirmationModal(false);
        const movimientosAux = JSON.parse(JSON.stringify(movimientos))
        .filter((item, index) => {
            if(index !== elementSelectedRows[0].key-1) {
                return item;
            } else {
                if(item.d_fecharegistro) setEliminarMovimientos([...eliminarMovimientos, {n_secuencia: item.n_secuencia, d_fechamov: fechaMov.value}]);
            }
        });
        setMovimientos(movimientosAux);
    }

    const getTiposMovimientoCaja = async () => {
        const response = await listTipoMovimientoCaja();
        if(response && response.status === 200) {
            let responseList = response.body.data.sort((a, b) => {
                if(a.c_clasetipomov > b.c_clasetipomov) return 1;
                else if(a.c_clasetipomov < b.c_clasetipomov) return -1;
                else {
                    if(a.c_descricpion > b.c_descricpion) return 1;
                    else if(a.c_descricpion < b.c_descricpion) return -1;
                    return 0;
                }
            })
            setTiposMovimientos(responseList)
        };
    }

    const refreshList = () => {
        const tableData = JSON.parse(JSON.stringify(movimientos)).map((item, index) => {
            let aux = item;
            aux.key = index+1;
            aux.tipoMovimiento = tiposMovimientos.find(tipo => tipo.c_tipomovimientocc === item.c_tipomovimientocc).c_descricpion;
            aux.n_secuencia = item.n_secuencia;
            aux.n_montoxdiamov_format = item.n_montoxdiamov ? separator(Number(item.n_montoxdiamov).toFixed(2)) : "";
            aux.flagConfirmar = item.c_flagxconfirmar === "S" ? "SI" : "NO";
            aux.c_flagconfirmado_desc = item.c_flagconfirmado === "S" ? "SI" : "NO";
            aux.d_fechaconfirmado_format = item.d_fechaconfirmado ? moment(item.d_fechaconfirmado).format("DD/MM/yyyy") : "";
            aux.d_fecharegistro_format = item.d_fecharegistro ? moment(item.d_fecharegistro).format("DD/MM/yyyy") : "";
            aux.d_ultimafechamodificacion_format = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy") : "";
            return aux;
        });
        setMovimientosCajaTabla(tableData);
    }

    const getData = () => {
        setCompania(flujoCaja.general.companiaName);
        setNroCorrelativo(flujoCaja.general.n_correlativo);
        detalleSeleccionado.general.d_fechamov && setFechaMov({value: detalleSeleccionado.general.d_fechamov});
        detalleSeleccionado.general.c_estado && setEstado(detalleSeleccionado.general.c_estado);
        detalleSeleccionado.general.c_observaciones && setObservaciones(detalleSeleccionado.general.c_observaciones);
        setMovimientos(detalleSeleccionado.movimientos);
        if(detalleSeleccionado.general.c_usuarioregistro) {
            setUsuarioRegistro(detalleSeleccionado.general.c_usuarioregistro);
            setFechaRegistro(moment(detalleSeleccionado.general.d_fecharegistro).format("DD/MM/yyyy HH:mm:ss"));
            setUsuarioModiciacion(detalleSeleccionado.general.c_ultimousuario);
            setFechaModiciacion(moment(detalleSeleccionado.general.d_ultimafechamodificacion).format("DD/MM/yyyy HH:mm:ss"));
        }
    }

    useEffect(() => {
        if(tiposMovimientos.length > 0) {
            refreshList();
        }
    }, [tiposMovimientos, movimientos])

    useEffect(async () => {
        await setIsLoading(true);
        await getTiposMovimientoCaja();
        await getData();
        setIsLoading(false);
    },[])

    return (
      <>
        <div className="container-fluid pt-2 pb-2 pl-2 pr-2" style={{ background: '#FFFFFF' }}>
            <div className="row" >
                <div className="col">
                    <div className="card pr-3 pl-3">
                        <div className="card-body">
                            <div className="row">
                                <div className="row col-12 col-md-12">
                                    <InputComponentView
                                        label="Compañía"
                                        state={compania}
                                        setState={setCompania}
                                        type="text"
                                        placeholder="Compañía"
                                        inputId="companiaCodeId"
                                        readOnly={true}
                                        classForm="col-12 col-lg-6"
                                    />
                                    <InputComponentView
                                        label="Nro CCU"
                                        state={nroCorrelativo}
                                        setState={setNroCorrelativo}
                                        type="text"
                                        placeholder="Nro. Correlativo"
                                        inputId="nroCorrelativoId"
                                        readOnly={true}
                                        classForm="col-12 col-lg-6"
                                    />
                                    <InputComponent
                                        label="Fecha"
                                        state={fechaMov}
                                        setState={setFechaMov}
                                        type="date"
                                        placeholder="Fecha desembolso"
                                        inputId="fechaMovId"
                                        readOnly={urlFragment === "actualizarCUxDiaMovimiento" ? true : false}
                                        classForm="col-12 col-lg-6"
                                    >
                                        {showMessageValidationDate()}
                                    </InputComponent>
                                    <SelectComponent
                                        labelText="Estados"
                                        defaultValue="Seleccione un estado"
                                        items={estados}
                                        selectId="estadoId"
                                        valueField="value"
                                        optionField="name"
                                        valueSelected={estado}
                                        handleChange={setEstado}
                                        classForm="col-12 col-lg-6"
                                        disabledElement={!usuarioAccesoTotalCajaPermiso}
                                    />
                                    <TextareaComponent
                                        inputId="observacionCreacionId"
                                        label="Observaciones"
                                        placeholder="Observaciones"
                                        value={observaciones}
                                        setState={setObservaciones}
                                        max={500}
                                        readOnly={false}
                                        classForm="col-12"
                                        labelLine={true}
                                    />
                                </div>
                                <div className="col-12 mb-3 text-center">
                                    <button onClick={urlFragment === "nuevaCUxDiaMovimiento" ? handleAgregarDetalle : handleActualizarDetalle} className="btn btn-light btn-form">Aceptar</button>
                                    <button onClick={handleCancelar} className="btn btn-light btn-form ml-md-3">Cancelar</button>
                                </div>
                                <HeaderForm title="Datos de auditoria"/>
                                <div className="col-12 table-responsive">
                                <table className="table b-table table-bordered b-table-fixed">
                                    <tbody>
                                    <tr>
                                        <td className='header-data'>Usuario Registro</td>
                                        <td className='header-label'>{usuarioRegistro}</td>
                                        <td className='header-data'>Fecha Registro</td>
                                        <td className='header-data'>{fechaRegistro}</td>
                                    </tr>
                                    <tr>
                                        <td className='header-data'>Último Usuario</td>
                                        <td className='header-label'>{usuarioModiciacion}</td>
                                        <td className='header-data'>Fecha Modificación</td>
                                        <td className='header-data'>{fechaModiciacion}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <Space size={[10, 3]} wrap style={{ marginBottom: 16 }}>
                                        {estado === "A" && <>
                                            <Button onClick={handleSelectNuevo}>NUEVO</Button>
                                            <Button onClick={handleSelectActualizar}>MODIFICAR</Button>
                                            <Button onClick={handleSelectDelete}>ELIMINAR</Button>
                                        </>}
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
                                        dataSource={movimientosCajaTabla}
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
        <FlujoCajaDetalleMovimientoForm
            isOpen={openMovimientoModal}
            onClose={()=>setOpenMovimientoModal(false)}
            tiposMovimientos={tiposMovimientos}
            setMovimientos={setMovimientos}
            movimientos={movimientos}
        />
        <ConfirmationModal
            isOpen={openConfirmationModal}
            onClose={()=>setOpenConfirmationModal(false)}
            title={"Aviso de eliminación"}
            message={"¿Seguro que desea eliminar este elemento?. Una vez eliminado no podrás recuperarlo."}
            onHandleFunction={()=>handleEliminar()}
            buttonClass="btn-danger"
        />
    </>
    )
}

export default FormCajaChicaUsuarioxDiaMov