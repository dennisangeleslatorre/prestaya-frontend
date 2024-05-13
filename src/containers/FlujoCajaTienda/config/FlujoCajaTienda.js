import { Tooltip } from "antd"

export const columns = [
    {
        title: 'Compañía',
        dataIndex: 'c_nombrecompania',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
        render: (c_nombrecompania, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {c_nombrecompania}
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
        dataIndex: 'c_nombreagencia',
        ellipsis: {
            showTitle: false,
        },
        width: 200,
        render: (c_nombreagencia, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {c_nombreagencia}
            </div>
        ),
    },{
        title: 'Tipo Caja',
        dataIndex: 'c_tipofctienda',
        ellipsis: {
            showTitle: false,
        },
        width: 160,
        render: (c_tipofctienda, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {c_tipofctienda}
            </div>
        ),
    },{
        title: 'Usuario CC',
        dataIndex: 'c_usuariofctienda',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        render: (c_usuariofctienda, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {c_usuariofctienda}
            </div>
        ),
    },{
        title: 'F. Inicio',
        dataIndex: 'd_fechainiciomov',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
        render: (d_fechainiciomov, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {d_fechainiciomov}
            </div>
        ),
    },{
        title: 'F. Fin',
        dataIndex: 'd_fechafinmov',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
        render: (d_fechafinmov, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {d_fechafinmov}
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
        dataIndex: 'c_monedafctienda',
        ellipsis: {
            showTitle: false,
        },
        width: 130,
        render: (c_monedafctienda, flujoCaja) => (
            <div onClick={flujoCaja.handleMostrarDetalleCajaRow}>
              {c_monedafctienda}
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

export const tiposCajaTienda = [
  { name: 'BOVEDA', value: 'B' },
]

export const estadosCajaTienda = [
    { name: 'TODOS', value: 'T' },
    { name: 'ACTIVO', value: 'A' },
    { name: 'INACTIVO', value: 'I' }
]
