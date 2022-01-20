import React, { useContext, useEffect, useState } from 'react'
import HeaderForm from '../HeaderForm/HeaderForm'
import { Table, Space, Button } from 'antd'
import CancellationModal from '../CancellationModal/CancellationModal'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import PagesContext from '../../context/PagesContext/PagesContext'
//Api
import { getCancelacionesByCodigoPrestamo, anularCancelacion, listParametrosByCompania } from '../../Api/Api'
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
        dataIndex: 'c_ultimousuario'
    },{
        title: 'U. Fecha Modificación',
        dataIndex: 'd_ultimafechamodificacion_format'
    }
]

const tipoCancelaciones = {
    'C': 'CANCELACIÓN',
    'A': 'AMORTIZACIÓN',
    'R': 'RENOVACIÓN'
}

const estados = {
    'PE': 'PENDIENTE',
    'CA': 'CANCELADO',
    'RE': 'REMATE'
}

const FormCancelaciones = (props) => {
    const { elementId, fechaDesembolsoPrestamo, estadoPrestamo } = props;
    //Estados
    const [tableCancelaciones, setTableCancelaciones] = useState([]);
    const [openCancellationModal, setOpenCancellationModal] = useState(false);
    const [ultimaCancelacion, setUltimaCancelacion] = useState(null);
    const [fechaDesembolsoCancelacion, setfechaDesembolsoCancelacion] = useState("");
    const [diasComisionParametros, setDiasComisionParametros] = useState(0);
    const [montoComisionParametros, setMontoComisionParametros] = useState(0);
    //Estados del forulario
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal ] = useState(false);
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "CANCELAR" || item === "ANULAR CANCELACIÓN"
    })
    const cancelarPermission = userPermisssions.includes("CANCELAR");
    const anularCancelacionPermission = userPermisssions.includes("ANULAR CANCELACIÓN");

    const getParameters = async () => {
        const [c_compania, c_prestamo] = elementId.split('-');
        const response = await listParametrosByCompania(c_compania);
        if(response && response.status === 200) {
            const data = response.body.data;
            const dias = data.find((item) => item.c_parametrocodigo === "PACO000004");
            const montos = data.find((item) => item.c_parametrocodigo === "PACO000009");
            console.log("dias", dias)
            console.log("montos", montos)
            setDiasComisionParametros(parseInt(dias.n_valornumero));
            setMontoComisionParametros(parseInt(montos.n_valornumero));
        }
    }

    const getCancelaciones = async () => {
        await setIsLoading(true);
        const [c_compania, c_prestamo] = elementId.split('-');
        const response = await getCancelacionesByCodigoPrestamo({c_compania:c_compania, c_prestamo:c_prestamo});
        if(response && response.status === 200 && response.body.data) {
            const cancelaciones = response.body.data;
            const nLineaPosition = cancelaciones.length-1;
            setUltimaCancelacion(cancelaciones[nLineaPosition]);
            getDataForTable(cancelaciones);
        }
        else getDataForTable([]);
        setIsLoading(false);
    }

    const getDataForTable = (cancelaciones) => {
        const listAux = cancelaciones.map((item, index) => {
            item.key = index;
            item.d_fechavencimiento_format = item.d_fechavencimiento ? moment(item.d_fechavencimiento).format('DD/MM/yyyy') : "";
            item.d_fechacancelacion_format = item.d_fechacancelacion ? moment(item.d_fechacancelacion).format('DD/MM/yyyy') : "";
            item.d_fecharegistro_format = moment(item.d_fecharegistro).format('DD/MM/yyyy HH:MM:ss');
            item.d_ultimafechamodificacion_format = moment(item.d_ultimafechamodificacion).format('DD/MM/yyyy HH:MM:ss');
            item.n_montoprestamo = item.n_montoprestamo ? Number(item.n_montoprestamo).toFixed(2) : "";
            item.n_montointereses = item.n_montointereses ? Number(item.n_montointereses).toFixed(2) : "";
            item.n_montointeresesdiario = item.n_montointeresesdiario ? Number(item.n_montointeresesdiario).toFixed(2) : "";
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

    const handleDeleteCancelacion = async () => {
        await setIsLoading(true);
        //Cerramos el modal de confirmacion
        setOpen(false)
        const [c_compania, c_prestamo] = elementId.split('-');
        const response = await anularCancelacion({c_compania:c_compania, c_prestamo:c_prestamo});
        if(response && response.status === 200) {
            await getCancelaciones();
            setResponseData({title:"Operación exitosa", message:"Se anuló la cancelación con éxito"});
            setOpenResponseModal(true);
        }  else {
            const message = response ? response.message : "Error al anular el préstamo";
            setResponseData({title:"Aviso", message:message});
            setOpenResponseModal(true);
        }
        setIsLoading(false);
    }

    useEffect(async () => {
        await getParameters();
        await getCancelaciones();
    }, [])

    return (
        <>
            <HeaderForm title="Cancelar"/>
            <div className="row col-12">
                <div className="col">
                    <Space style={{ marginBottom: 16 }}>
                        { (cancelarPermission && estadoPrestamo === "VI") && <Button onClick={handleAddCancelacion}>CANCELAR</Button>}
                        { (anularCancelacionPermission && (estadoPrestamo === "VI" || estadoPrestamo === "CA")) && <Button onClick={()=>setOpen(true)}>ANULAR CANCELACIÓN</Button>}
                    </Space>
                </div>
            </div>
            <div className="row mx-2 mb-2" style={{ overflow: 'scroll' }}>
                <Table
                    columns={columns}
                    dataSource={tableCancelaciones}
                    pagination={{ pageSize: 50 }}
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
                getCancelaciones={getCancelaciones}
            />
            <ConfirmationModal
                isOpen={open}
                onClose={()=>setOpen(false)}
                title={"Aviso de anulación"}
                message={"¿Seguro que desea anular la última cancelación?."}
                onHandleFunction={()=>handleDeleteCancelacion()}
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