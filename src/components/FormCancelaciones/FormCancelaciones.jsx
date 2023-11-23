import React, { useContext, useEffect, useState } from 'react'
import HeaderForm from '../HeaderForm/HeaderForm'
import { Table, Space, Button } from 'antd'
import CancellationModal from '../CancellationModal/CancellationModal'
import SimulationModal from '../CancellationModal/SimulationModal'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import PagesContext from '../../context/PagesContext/PagesContext'
import { useHistory } from 'react-router'
//Api
import { anularCancelacion, listParametrosByCompania, retornarEntrega, retornarRemate, listUsers } from '../../Api/Api'
import moment from 'moment'

const columns = [
    {
        title: 'Línea',
        dataIndex: 'n_linea'
    },{
        title: 'Fecha Vencimiento',
        dataIndex: 'd_fechavencimiento_format'
    },{
        title: 'Monto Prestamo',
        dataIndex: 'n_montoprestamo'
    },{
        title: 'Mnt. Intereses',
        dataIndex: 'n_montointereses'
    },{
        title: 'Tipo Cancelación',
        dataIndex: 'c_tipocancelacion'
    },{
        title: 'Fecha Cancelación',
        dataIndex: 'd_fechacancelacion_format'
    },{
        title: 'Dias Transcurridos',
        dataIndex: 'n_diastranscurridos'
    },{
        title: 'Mnt. Interes Diario',
        dataIndex: 'n_montointeresesdiario'
    },{
        title: 'Mnt. Interes a Cancelar',
        dataIndex: 'n_montointeresescancelar'
    },{
        title: 'Mnt. Prestamo a Cancelar',
        dataIndex: 'n_montoprestamocancelar'
    },{
        title: 'Mnt.. Comisión',
        dataIndex: 'n_montocomisioncancelar'
    },{
        title: 'Mnt. Total Cancelar',
        dataIndex: 'n_montototalcancelar'
    },{
        title: 'Observaciones',
        dataIndex: 'c_observacionescancelar'
    },{
        title: 'Estado',
        dataIndex: 'c_estado'
    },{
        title: 'U. Registro',
        dataIndex: 'c_usuarioregistro'
    },{
        title: 'F, Registro',
        dataIndex: 'd_fecharegistro_format'
    },{
        title: 'U. Usuario',
        dataIndex: 'c_usuariocanceremat'
    },{
        title: 'U. Fecha Modificación',
        dataIndex: 'd_ultimafechamodificacion_format'
    },{
        title: 'U. Operación',
        dataIndex: 'c_usuariooperacion'
    }
]

const tipoCancelaciones = {
    'C': 'CANCELACIÓN',
    'A': 'AMORTIZACIÓN',
    'R': 'RENOVACIÓN'
}

const estados = {
    'VI': 'VIGENTE',
    'CA': 'CANCELADO',
    'RE': 'REMATE'
}

const FormCancelaciones = (props) => {
    //Navegacion
    let history = useHistory();
    const { elementId, fechaDesembolsoPrestamo, estadoPrestamo, cancelaciones, getData } = props;
    //Estados
    const [tableCancelaciones, setTableCancelaciones] = useState([]);
    const [openCancellationModal, setOpenCancellationModal] = useState(false);
    const [openSimulationModal, setOpenSimulationModal] = useState(false);
    const [ultimaCancelacion, setUltimaCancelacion] = useState(null);
    const [fechaDesembolsoCancelacion, setfechaDesembolsoCancelacion] = useState("");
    const [diasComisionParametros, setDiasComisionParametros] = useState(0);
    const [montoComisionParametros, setMontoComisionParametros] = useState(0);
    //Estados del forulario
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal ] = useState(false);
    const [openRegresarEntrega, setOpenRegresarEntrega] = useState(false);
    const [openRegresarRemate, setOpenRegresarRemate] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedNLineas, setSelectedNLineas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "SIMULAR" || item === "CANCELAR" || item === "ANULAR CANCELACIÓN" || item === "REGRESAR DE ENTREGA" || item === "REGRESAR DE REMATE"
        || item == "FORMATO RECIBOS CANCELACIONES" || item == "FORMATO CANCELACIONES" || item == "FORMATO ACTA ENTREGA" || item === "ENTREGAR"
    })
    const cancelarPermission = userPermisssions.includes("CANCELAR");
    const simulationPermission = userPermisssions.includes("SIMULAR");
    const anularCancelacionPermission = userPermisssions.includes("ANULAR CANCELACIÓN");
    const regresarEntregaPermission = userPermisssions.includes("REGRESAR DE ENTREGA");
    //const regresarRematePermission = userPermisssions.includes("REGRESAR DE REMATE");
    const formatoRecibosCancelaciones = userPermisssions.includes("FORMATO RECIBOS CANCELACIONES");
    const formatoCancelaciones = userPermisssions.includes("FORMATO CANCELACIONES");
    const formatoActaEntrega = userPermisssions.includes("FORMATO ACTA ENTREGA");
    const entregarPermission = userPermisssions.includes("ENTREGAR");

    const getParameters = async () => {
        const [c_compania, c_prestamo] = elementId.split('-');
        const response = await listParametrosByCompania(c_compania);
        if(response && response.status === 200) {
            const data = response.body.data;
            const dias = data.find((item) => item.c_parametrocodigo === "PACO000004");
            const montos = data.find((item) => item.c_parametrocodigo === "PACO000009");
            setDiasComisionParametros(parseInt(dias.n_valornumero));
            setMontoComisionParametros(parseInt(montos.n_valornumero));
        }
    }

    const getCancelaciones = () => {
        const nLineaPosition = cancelaciones.length-1;
        setUltimaCancelacion(cancelaciones[nLineaPosition]);
        getDataForTable(cancelaciones);
    }

    const getDataForTable = (cancelaciones) => {
        const listAux = cancelaciones.map((item, index) => {
            item.key = index;
            item.d_fechavencimiento_format = item.d_fechavencimiento ? moment(item.d_fechavencimiento).format('DD/MM/yyyy') : "";
            item.d_fechacancelacion_format = item.d_fechacancelacion ? moment(item.d_fechacancelacion).format('DD/MM/yyyy') : "";
            item.d_fecharegistro_format = moment(item.d_fecharegistro).format('DD/MM/yyyy HH:mm:ss');
            item.d_ultimafechamodificacion_format = item.d_fechacanceremat ? moment(item.d_fechacanceremat).format('DD/MM/yyyy HH:mm:ss') : "";
            item.n_montoprestamo = item.n_montoprestamo ? Number(item.n_montoprestamo).toFixed(2) : "";
            item.n_montointereses = item.n_montointereses ? Number(item.n_montointereses).toFixed(2) : "";
            item.n_montointeresesdiario = item.n_montointeresesdiario ? Number(item.n_montointeresesdiario).toFixed(4) : "";
            item.n_montointeresescancelar = item.n_montointeresescancelar ? Number(item.n_montointeresescancelar).toFixed(2) : "";
            item.n_montoprestamocancelar = item.n_montoprestamocancelar ? Number(item.n_montoprestamocancelar).toFixed(2) : "";
            item.n_montocomisioncancelar = item.n_montocomisioncancelar ? Number(item.n_montocomisioncancelar).toFixed(2) : "";
            item.n_montototalcancelar = item.n_montototalcancelar ? Number(item.n_montototalcancelar).toFixed(2) : "";
            item.c_tipocancelacion = tipoCancelaciones[item.c_tipocancelacion];
            item.c_estado = estados[item.c_estado];
            return item;
        })
        setTableCancelaciones(listAux);
    }

    const handleAddCancelacion = () => {
        if(ultimaCancelacion.c_tipocancelacion !== 'C') {
            const nLineaPosition = tableCancelaciones.length-1;
            if(nLineaPosition > 0) {
                setfechaDesembolsoCancelacion(tableCancelaciones[nLineaPosition-1].d_fechacancelacion);
                console.log('d_fechacancelacion', tableCancelaciones[nLineaPosition-1].d_fechacancelacion)
            } else {
                setfechaDesembolsoCancelacion(fechaDesembolsoPrestamo);
                console.log('fechaDesembolsoPrestamo', fechaDesembolsoPrestamo)
            }
            //Abrimos el modal
            setOpenCancellationModal(true);
        } else {
            setResponseData({title: "Aviso", message:"Se canceló por completo el préstamo"})
            setOpenResponseModal(true);
        }
    }

    const handleSimulation = () => {
        const nLineaPosition = tableCancelaciones.length-1;
        if(nLineaPosition > 0) {
            setfechaDesembolsoCancelacion(tableCancelaciones[nLineaPosition-1].d_fechacancelacion);
        } else {
            setfechaDesembolsoCancelacion(fechaDesembolsoPrestamo);
        }
        //Abrimos el modal
        setOpenSimulationModal(true);
    }

    const handleDeleteCancelacion = async () => {
        await setIsLoading(true);
        //Cerramos el modal de confirmacion
        setOpen(false)
        const [c_compania, c_prestamo] = elementId.split('-');
        const response = await anularCancelacion({c_compania:c_compania, c_prestamo:c_prestamo});
        if(response && response.status === 200) {
            await getData();
            setResponseData({title:"Operación exitosa", message:"Se anuló la cancelación con éxito"});
            setOpenResponseModal(true);
        }  else {
            const message = response ? response.message : "Error al anular el préstamo";
            setResponseData({title:"Aviso", message:message});
            setOpenResponseModal(true);
        }
        setIsLoading(false);
    }

    const handleRegresarEntrega = async () => {
        await setIsLoading(true);
        setOpenRegresarEntrega(false)
        const [c_compania, c_prestamo] = elementId.split('-');
        const response = await retornarEntrega({c_compania:c_compania, c_prestamo:c_prestamo});
        if(response && response.status === 200) {
            await getData();
            setResponseData({title:"Operación exitosa", message:"Se regresó la entrega."});
            setOpenResponseModal(true);
        }  else {
            const message = response ? response.message : "Error al regresar la entrega.";
            setResponseData({title:"Aviso", message:message});
            setOpenResponseModal(true);
        }
        setIsLoading(false);
    }

    const handleRegresarRemate = async () => {
        await setIsLoading(true);
        setOpenRegresarRemate(false)
        const [c_compania, c_prestamo] = elementId.split('-');
        const response = await retornarRemate({c_compania:c_compania, c_prestamo:c_prestamo});
        if(response && response.status === 200) {
            await getData();
            setResponseData({title:"Operación exitosa", message:"Se regresó el remate."});
            setOpenResponseModal(true);
        }  else {
            const message = response ? response.message : "Error al regresar el remate.";
            setResponseData({title:"Aviso", message:message});
            setOpenResponseModal(true);
        }
        setIsLoading(false);
    }

    const handleIrFormatoRecibos = () => {
        if(selectedNLineas && selectedNLineas.length > 0 ) {
            history.push(`/formatoRecibos/${elementId}/${selectedNLineas}`);
        } else {
            setResponseData({title:"Aviso", message:"Debe seleccionar al menos una cancelación"});
            setOpenResponseModal(true);
        }
    }

    const handleIrFormatoCancelaciones = () => {
        history.push(`/formatoCancelaciones/${elementId}`);
    }

    const handleIrFormatoActaEntrega = () => {
        history.push(`/formatoActaEntrega/${elementId}`);
    }

    const handleIrEntrega = () => {
        history.push(`/entregarPrestamo/${elementId}`);
    }

    //Atributos de la tabla
    const rowSelection = {
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
            setSelectedNLineas(selectedRows.map(item => item.n_linea));
        }
    };

    const getUsuarios = async () => {
        const response = await listUsers();
        if(response && response.status === 200) setUsuarios(response.body.data);
    }

    useEffect(async () => {
        await getParameters();
        await getUsuarios();
    }, [])

    useEffect(() => {
        if(cancelaciones.length !== 0) getCancelaciones();
        else getDataForTable([])
    }, [cancelaciones]);

    return (
        <>
            <HeaderForm title="Cancelar"/>
            <div className="row col-12">
                <div className="col">
                    <Space style={{ marginBottom: 16 }}>
                        { (cancelarPermission && estadoPrestamo === "VI") && <Button onClick={handleAddCancelacion}>CANCELAR</Button> }
                        { (simulationPermission && estadoPrestamo === "RE") && <Button onClick={handleSimulation}>SIMULAR</Button> }
                        { (anularCancelacionPermission && (estadoPrestamo === "VI" || estadoPrestamo === "CA")) && <Button onClick={()=>setOpen(true)}>ANULAR CANCELACIÓN</Button> }
                        { (regresarEntregaPermission && estadoPrestamo === "EN") && <Button onClick={()=>setOpenRegresarEntrega(true)}>REGRESAR DE ENTREGA</Button>}
                        {/* (regresarRematePermission && estadoPrestamo === "RE") && <Button onClick={()=>setOpenRegresarRemate(true)}>REGRESAR DE REMATE</Button> */}
                        { (formatoRecibosCancelaciones) && <Button onClick={handleIrFormatoRecibos}>FORMATO RECIBOS</Button> }
                        { (formatoCancelaciones) && <Button onClick={handleIrFormatoCancelaciones}>FORMATO CANCELACIONES</Button> }
                        { (formatoActaEntrega && estadoPrestamo === "EN") && <Button onClick={handleIrFormatoActaEntrega}>FORMATO ACTA ENTREGA</Button> }
                        { (entregarPermission && estadoPrestamo === "CA") && <Button onClick={handleIrEntrega}>ENTREGAR</Button> }
                    </Space>
                </div>
            </div>
            <div className="row mx-2 mb-2" style={{ overflow: 'scroll' }}>
                <Table
                    columns={columns}
                    dataSource={tableCancelaciones}
                    pagination={{ pageSize: 50 }}
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                        selectedRowKeys,
                    }}
                />
            </div>
            <CancellationModal
                isOpen={openCancellationModal}
                onClose={()=>setOpenCancellationModal(false)}
                elementId={elementId}
                ultimaCancelacion={ultimaCancelacion}
                setResponseData={setResponseData}
                setOpenResponseModal={setOpenResponseModal}
                fechaDesembolsoCancelacion={fechaDesembolsoCancelacion}
                diasComisionParametros={diasComisionParametros}
                montoComisionParametros={montoComisionParametros}
                getCancelaciones={getData}
                usuarios={usuarios}
            />
            <SimulationModal
                isOpen={openSimulationModal}
                onClose={()=>setOpenSimulationModal(false)}
                ultimaCancelacion={ultimaCancelacion}
                fechaDesembolsoCancelacion={fechaDesembolsoCancelacion}
                diasComisionParametros={diasComisionParametros}
                montoComisionParametros={montoComisionParametros}
                usuarios={usuarios}
            />
            <ConfirmationModal
                isOpen={open}
                onClose={()=>setOpen(false)}
                title={"Aviso de anulación"}
                message={"¿Seguro que desea anular la última cancelación?."}
                onHandleFunction={()=>handleDeleteCancelacion()}
                buttonClass="btn-danger"
            />
            <ConfirmationModal
                isOpen={openRegresarEntrega}
                onClose={()=>setOpenRegresarEntrega(false)}
                title={"Aviso de regresar entrega"}
                message={"¿Seguro que desea regresar la entrega?. Se perderán los datos de la entrega registrada."}
                onHandleFunction={()=>handleRegresarEntrega()}
                buttonClass="btn-danger"
            />
            <ConfirmationModal
                isOpen={openRegresarRemate}
                onClose={()=>setOpenRegresarRemate(false)}
                title={"Aviso de regresar remate"}
                message={"¿Seguro que desea regresar el remate?. Se perderán los datos del remate registrado."}
                onHandleFunction={()=>handleRegresarRemate()}
                buttonClass="btn-danger"
            />
            <ResponseModal
                isOpen={openResponseModal}
                title={responseData.title}
                onClose={()=>setOpenResponseModal(false)}
                message={responseData.message}
            />
            {isLoading === true && <Loading/>}
        </>
    )
}

export default FormCancelaciones