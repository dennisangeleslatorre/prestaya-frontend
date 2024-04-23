import React, {useState, useEffect, useContext} from 'react'
import { Table, Space, Button, Tooltip } from 'antd'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import { listCompanias, listUsers, getMovimientosCajaUsuarioxConfirmar, confirmarMovimiento,
    listAgenciesByUserAndCompany, getValidarMontoMaximoConfirMov } from '../../Api/Api'
import moment from 'moment'
import Loading from '../../components/Modal/LoadingModal'
import { separator } from '../../utilities/Functions/FormatNumber';
import { useHistory } from 'react-router'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import { debounce } from 'lodash';
//Context
import UserContext from '../../context/UserContext/UserContext'
import PagesContext from '../../context/PagesContext/PagesContext'

const columns = [
    {
        title: 'Compañía',
        dataIndex: 'companiadesc',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
    },{
        title: 'Nro. CCU',
        dataIndex: 'n_correlativo',
        ellipsis: {
            showTitle: false,
        },
        width: 130,
    },{
        title: 'Agencia',
        dataIndex: 'agenciadesc',
        ellipsis: {
            showTitle: false,
        },
        width: 200,
    },{
        title: 'Tipo Caja',
        dataIndex: 'tipofcudesc',
        ellipsis: {
            showTitle: false,
        },
        width: 220,
    },{
        title: 'Usuario CC.',
        dataIndex: 'c_usuariofcu',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
    },{
        title: 'Moneda',
        dataIndex: 'monedafcudesc',
        ellipsis: {
            showTitle: false,
        },
        width: 130,
    },{
        title: 'Fecha',
        dataIndex: 'd_fechamov_format',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
    },{
        title: 'Estado',
        dataIndex: 'estadodia',
        ellipsis: {
            showTitle: false,
        },
        width: 130,
    },{
        title: 'Tipo Movimiento',
        dataIndex: 'tipomovdesc',
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
        title: 'Otra agencia',
        dataIndex: 'agenciaotradesc',
        ellipsis: {
            showTitle: false,
        },
        width: 200
    }
]

const FormMovimientoCUxConfirmar = () => {
    let history = useHistory();
    //Estados
    const [compania, setCompania] = useState("");
    const [usuarioFCMovimiento, setUsuarioFCMovimiento] = useState("T");
    const [agenciaOrigen, setAgenciaOrigen] = useState("T")
    const [agenciaDestino, setAgenciaDestino] = useState("T");
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal ] = useState(false);
    const [elementSelected, setElementSelected] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [modalAttributes, setModalAttributes] = useState({title:"", message:""});
    const [open, setOpen] = useState(false);
    const [openAlertConfirmationModal, setOpenAlertConfirmationModal] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);
    //Estados de las listas
    const [companias, setCompanias] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [movimientos, setMovimientos] = useState([]);
     //Contextos
     const { getUserData } = useContext(UserContext);
     const userLogedIn = getUserData().c_codigousuario;
     const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "USUARIO ACCESO TOTAL CAJA"
    });
    const usuarioAccesoTotalCajaPermiso = userPermisssions.includes("USUARIO ACCESO TOTAL CAJA");
     //Atributos de la tabla
     const rowSelection = {
        onChange: (selectedKeys, selectedRows) => {
            setElementSelected(selectedRows);
            setSelectedRowKeys(selectedKeys);
        }
    };

    const prepareNotification = (title, message) => {
        setResponseData({title:title, message:message})
        setOpenResponseModal(true);
    }

    const prepareBodyToSearch = () => {
        let body = {};
        if(compania) body.c_compania = compania;
        if(usuarioFCMovimiento && usuarioFCMovimiento !== "T") body.c_usuariofcu = usuarioFCMovimiento;
        if(agenciaOrigen && agenciaOrigen !== "T") body.c_agencia = agenciaOrigen;
        if(agenciaDestino && agenciaDestino !== "T") body.c_agenciaotra = agenciaDestino;
        body.c_codigousuario = userLogedIn;
        return body;
    }

    const onHandleClickBuscar = async () => {
        await setIsLoading(true);
        await refresListTable();
        setIsLoading(false);
    }

    const refresListTable = async () => {
        let parametros = prepareBodyToSearch();
        const response = await getMovimientosCajaUsuarioxConfirmar(parametros);
        if(response && response.status === 200 ) {
            setDataFlujoCajaTable(response.body.data);
        } else {
            setDataFlujoCajaTable([]);
        }
        setElementSelected([]);
        setSelectedRowKeys([]);
    }

    const handleOpenConfirmMovModal = () => {
        if(elementSelected[0]) {
            if( elementSelected[0].c_usuariomovimiento === userLogedIn || usuarioAccesoTotalCajaPermiso ) {
                setModalAttributes({title:"Aviso de confirmación", message:`Una vez realizada la operación no lo podrá revertir ni modificar. Confirmación de caja usuario ${elementSelected[0].c_usuariomovimiento}.`});
                setOpen(true);
            } else {
                prepareNotification("Aviso", "El usuario no tiene permiso para confirmar este movimiento.");
            }
        } else {
            prepareNotification("Aviso", "Selecciona un item de la tabla.");
        }
    }

    const prepareBody = (movAux) => {
        return {
            c_compania: movAux.c_compania,
            n_correlativo: movAux.n_correlativo,
            d_fechamov: moment(movAux.d_fechamov).format('yyyy-MM-DD'),
            n_secuencia: movAux.n_secuencia,
            c_agencia: movAux.c_agenciaotra ? movAux.c_agenciaotra : movAux.c_agencia,
            usuario_confirma: userLogedIn,
            c_usuariofcu: movAux.c_usuariofcu,
            c_usuariomovimiento: movAux.c_usuariomovimiento,
            n_montoxdiamov: movAux.n_montoxdiamov,
            c_tipomovimientoccinverso: movAux.c_tipomovimientoccinverso,
            c_observacionesmov: movAux.c_observaciones,
            c_agenciaotra: movAux.c_agenciaotra ? movAux.c_agencia : null
        }
    }

    const confirMov = debounce(async () => {
        return new Promise(async (resolve, reject) => {
            try {
              setDisabledButton(true);
              const movAux = movimientos.find(
                (item) =>
                  item.c_compania === elementSelected[0].c_compania &&
                  item.n_correlativo === elementSelected[0].n_correlativo &&
                  item.d_fechamov === elementSelected[0].d_fechamov &&
                  item.n_secuencia === elementSelected[0].n_secuencia
              );
              setOpenAlertConfirmationModal(false);
              const body = prepareBody(movAux);
              const response = await confirmarMovimiento(body);
              if (response && response.status === 200 && response.body.message === 'OK') {
                await refresListTable();
                setResponseData({ title: 'Operación exitosa', message: 'Se confirmo con éxito.' });
              } else {
                setResponseData({ title: 'Error al confirmar', message: response.body.message });
              }
              setOpenResponseModal(true);
              setTimeout(() => {
                setDisabledButton(false);
              }, 2000);
              setIsLoading(false);
              resolve();
            } catch (error) {
              reject(error);
              setIsLoading(false)
            }
        });
    }, 2000);

    const handleConfirmMov = async () => {
        try {
            await setIsLoading(true);
            const movAux = movimientos
            .find( item => item.c_compania === elementSelected[0].c_compania && item.n_correlativo === elementSelected[0].n_correlativo
                && item.d_fechamov === elementSelected[0].d_fechamov && item.n_secuencia === elementSelected[0].n_secuencia )
            await setOpen(false);

            const responseValida = await getValidarMontoMaximoConfirMov({
                c_compania: movAux.c_compania,
                c_agencia: movAux.c_agenciaotra ? movAux.c_agenciaotra : movAux.c_agencia,
                d_fechamov: moment(movAux.d_fechamov).format('yyyy-MM-DD'),
                n_montocons: movAux.n_montoxdiamov,
                c_usuariooperacion: movAux.c_usuariomovimiento
            });
            if(responseValida && responseValida.status === 200) {
                if(responseValida.body.message?.respuesta === "OK") await confirMov();
                else if(responseValida.body.message?.respuesta === "SE HA EXCEDIDO EL MONTO MAXIMO DESEA CONTINUAR") setOpenAlertConfirmationModal(true);
                else if(responseValida.body.message?.respuesta === "NO SE PUEDE EXCEDER EL MONTO MAXIMO") {
                    setResponseData({title:"Error", message:"El monto máximo de la caja es restrictivo y se ha excedido"});
                    setOpenResponseModal(true);
                    setIsLoading(false);
                } else {
                    setResponseData({title:"Error", message: responseValida.body.message || "Error en el servicio"});
                    setOpenResponseModal(true);
                    setIsLoading(false);
                }
            } else {
                setResponseData({title:"Error", message:"Fallo la validación"});
                setOpenResponseModal(true);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    const handleSeleccionarCompania = (value) => {
        setCompania(value);
        setAgenciaOrigen("T");
        setAgenciaDestino("T");
        getAgencias(value);
    }

    const setDataFlujoCajaTable = (movimientosxConfirmar) => {
        const listAux = JSON.parse(JSON.stringify(movimientosxConfirmar)).map((item) => {
            let aux = item;
            aux.key = `${item.c_compania}-${item.n_correlativo}-${item.d_fechamov}-${item.n_secuencia}`;
            aux.d_fechamov_format = item.d_fechamov ? moment(item.d_fechamov).format("DD/MM/yyyy") : "";
            aux.n_montoxdiamov_format = item.n_montoxdiamov ? separator(Number(item.n_montoxdiamov).toFixed(2)) : "";
            return aux;
        });
        setMovimientos(listAux);
    }

    const getCompanias =  async () => {
        const response = await listCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }

    const getUsuarios = async () => {
        const response = await listUsers();
        if(response && response.status === 200) setUsuarios([{c_codigousuario: "T", c_nombres: "TODOS"}, ...response.body.data]);
    }

    const getAgencias = async (companyCode) => {
        const response = await listAgenciesByUserAndCompany({c_compania: companyCode, c_codigousuario: userLogedIn});
        if(response && response.status === 200 && response.body.data) setAgencias([{c_agencia: "T", c_descripcion: "TODOS"}, ...response.body.data]);
    }

    useEffect(() => {
        if(companias.length !== 0) {
            handleSeleccionarCompania(companias[0].c_compania);
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
                                        />
                                        <ReactSelect
                                            inputId="usuarioCodeId"
                                            labelText="Usuario Flujo Caja Mov."
                                            placeholder="Seleccione un Usuario"
                                            valueSelected={usuarioFCMovimiento}
                                            data={usuarios}
                                            handleElementSelected={setUsuarioFCMovimiento}
                                            optionField="c_nombres"
                                            valueField="c_codigousuario"
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                        />
                                        <ReactSelect
                                            inputId="agenciaOrigenCodeId"
                                            labelText="Agencia Origen"
                                            placeholder="Seleccione una agencia"
                                            valueSelected={agenciaOrigen}
                                            data={agencias}
                                            handleElementSelected={setAgenciaOrigen}
                                            optionField="c_descripcion"
                                            valueField="c_agencia"
                                            classForm="col-12 col-lg-6"
                                            marginForm="ml-0"
                                        />
                                        <ReactSelect
                                            inputId="agenciaDestinoCodeId"
                                            labelText="Agencia Destino"
                                            placeholder="Seleccione una agencia"
                                            valueSelected={agenciaDestino}
                                            data={agencias}
                                            handleElementSelected={setAgenciaDestino}
                                            optionField="c_descripcion"
                                            valueField="c_agencia"
                                            classForm="col-12 col-lg-6"
                                            marginForm="ml-0"
                                        />
                                    </div>
                                    <div className="col-12 col-md-12 mt-3 mb-3 text-center">
                                        <button onClick={onHandleClickBuscar} className='btn btn-light' style={{width: "200px"}}>Buscar</button>
                                        <button onClick={()=>history.push(`/flujousuarios`)} className="btn btn-light btn-form ml-2">Regresar</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <Space size={[10, 3]} wrap style={{ marginBottom: 16 }}>
                                            <Button onClick={handleOpenConfirmMovModal}>CONFIRMAR</Button>
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
                                            dataSource={movimientos}
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
            <ConfirmationModal
                isOpen={open}
                onClose={()=>setOpen(false)}
                title={modalAttributes.title}
                message={modalAttributes.message}
                onHandleFunction={()=>handleConfirmMov()}
                disabledButton={disabledButton}
            />
            <ResponseModal
                isOpen={openResponseModal}
                title={responseData.title}
                onClose={()=>setOpenResponseModal(false)}
                message={responseData.message}
            />
            <ConfirmationModal
                isOpen={openAlertConfirmationModal}
                onClose={()=>setOpenAlertConfirmationModal(false)}
                title={"Aviso de operación"}
                message={"¿Seguro que desea continuar con esta operación?. Se ha excedido el monto maximo del dia."}
                onHandleFunction={() => confirMov()}
                buttonClass="btn-danger"
            />
        </>
    )
}

export default FormMovimientoCUxConfirmar