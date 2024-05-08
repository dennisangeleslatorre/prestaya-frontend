import React, { useEffect, useState } from 'react'
import Spinner from '../Spinner/Spinner'
import { Table, Tooltip } from 'antd'
import moment from 'moment'
import Modal from '../Modal/ModalNotification'
import { separator } from '../../utilities/Functions/FormatNumber'
import { getFlujoCajaMovimientosByCodigo } from '../../Api/Api'

const columns = [
    {
        title: '#',
        dataIndex: 'key',
        ellipsis: {
            showTitle: false,
        },
        width: 40,
    },{
        title: 'Fecha',
        dataIndex: 'd_fechamov',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
    },{
        title: 'Tipo Movimiento',
        dataIndex: 'c_tipomovimientoccdesc',
        ellipsis: {
            showTitle: false,
        },
        width: 200,
        render: (c_tipomovimientoccdesc) => (
            <Tooltip placement="topLeft" title={c_tipomovimientoccdesc}>
              {c_tipomovimientoccdesc}
            </Tooltip>
        ),
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
            showTitle: true,
        },
        width: 200,
        render: (c_observaciones) => (
            <Tooltip placement="topLeft" title={c_observaciones}>
              {c_observaciones}
            </Tooltip>
        ),
    },{
        title: 'Monto x Mov',
        dataIndex: 'n_montoxdiamov',
        ellipsis: {
            showTitle: false,
        },
        width: 145,
        className: 'text-numbers-table',
    },{
        title:() => <label className='text-audit-table'>F. Registro</label>,
        dataIndex: 'd_fecharegistro',
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
        dataIndex: 'd_ultimafechamodificacion',
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
        dataIndex: 'c_flagconfirmado',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        className: 'table-audit-column text-audit-table',
    },{
        title: 'Otra agencia',
        dataIndex: 'otraagenciadesc',
        ellipsis: {
            showTitle: true,
        },
        width: 200,
        render: (otraagenciadesc) => (
            <Tooltip placement="topLeft" title={otraagenciadesc}>
              {otraagenciadesc}
            </Tooltip>
        ),
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

const FlujoCajaDetalleMovimientosModal = (props) => {
    const {isOpen, onClose, c_compania, n_correlativo, d_fechamov } = props;
    const [movimientos, setMovimientos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getDataService = async () => {
        await setIsLoading(true);
        const response = await getFlujoCajaMovimientosByCodigo({c_compania, n_correlativo, d_fechamov});
        if(response && response.status === 200 && response.body.data) {
            setDataFlujoCajaMovimientoTable(response.body.data);
        } else
            setDataFlujoCajaMovimientoTable([]);
        setIsLoading(false);
    }

    const setDataFlujoCajaMovimientoTable = (movimientosService) => {
        const listAux = JSON.parse(JSON.stringify(movimientosService)).map((item, index) => {
            let aux = {};
            item.key = index+1;
            aux.d_fechamov = item.d_fechamov ? moment(item.d_fechamov).local().format('DD/MM/yyyy') : "";
            aux.c_usuariomovimiento = item.c_usuariomovimiento;
            aux.c_observaciones = item.c_observaciones;
            aux.n_montoxdiamov  = item.n_montoxdiamov ? separator(Number(item.n_montoxdiamov).toFixed(2)) : "";
            aux.c_usuarioregistro = item.c_usuarioregistro;
            aux.d_fecharegistro = item.d_fecharegistro ? moment(item.d_fecharegistro).format('DD/MM/yyyy HH:mm:ss') : "";
            aux.c_ultimousuario = item.c_ultimousuario;
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format('DD/MM/yyyy HH:mm:ss') : "";
            aux.c_tipomovimientoccdesc = item.c_tipomovimientoccdesc;
            aux.n_secuencia = item.n_secuencia;
            aux.c_prestamo = item.c_prestamo;
            aux.n_linea = item.n_linea;
            aux.flagConfirmar = item.c_flagxconfirmar === "S" ? "SI" : "NO";
            aux.c_flagconfirmado = item.c_flagconfirmado === "S" ? "SI" : "NO";
            aux.c_usuarioconfirmado = item.c_usuarioconfirmado;
            aux.d_fechaconfirmado_format = item.d_fechaconfirmado ? moment(item.d_fechaconfirmado).format("DD/MM/yyyy") : "";
            aux.otraagenciadesc = item.otraagenciadesc || "";
            return aux;
        });
        setMovimientos(listAux);
    }

    const handleClose = () => {
        onClose();
    }

    useEffect(() => {
        if(c_compania && n_correlativo && d_fechamov) {
            getDataService();
        }
    }, [c_compania, n_correlativo, d_fechamov])

    return (
        <Modal isOpen={isOpen} title="Movimientos" onClose={handleClose} modal_class="Modal__container__form" classModal="Modal2">
            <div className="modal-body row">
                <div className="col-12 mb-3 text-center">
                    { isLoading ? <Spinner/> :
                    <div className="row">
                        <div className="col" style={{ overflow: 'scroll' }}>
                            <Table
                                columns={columns}
                                dataSource={movimientos}
                                showHeadTable={false}
                                showSelectDataPerPage={false}
                            />
                        </div>
                    </div>}
                </div>
            </div>
        </Modal>
    )
}

export default FlujoCajaDetalleMovimientosModal