import { Tooltip } from 'antd'

export const columns = [
    {
        title: 'Linea',
        dataIndex: 'n_linea',
        ellipsis: {
            showTitle: false,
        },
        width: 120,
    },{
        title: 'Producto  ',
        dataIndex: 'c_item',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
    },{
        title: 'Descripción',
        dataIndex: 'c_descripcionproducto',
        ellipsis: {
            showTitle: false,
        },
        width: 160,
        render: (c_descripcionproducto, objeto) => (
            <div>
                <Tooltip placement="topLeft" title={c_descripcionproducto}>
                    {c_descripcionproducto}
                </Tooltip>
            </div>
        ),
    },{
        title: 'Unidad M.',
        dataIndex: 'c_unidadmedida',
        ellipsis: {
            showTitle: false,
        },
        width: 140
    },{
        title: 'Cantidad',
        dataIndex: 'n_cantidad',
        width: 140,
         ellipsis: {
            showTitle: false,
        }
    },{
        title: 'Precio',
        dataIndex: 'n_precio',
        ellipsis: {
            showTitle: false,
        },
        width: 160,
        className: 'text-numbers-table'
    },{
        title: 'Monto Total',
        dataIndex: 'n_montototal',
        ellipsis: {
            showTitle: false,
        },
        width: 160,
        className: 'text-numbers-table'
    },{
        title: 'Observaciones',
        dataIndex: 'c_observaciones',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        render: (c_observaciones, objeto) => (
            <div>
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
    }
]

export const monedas = [
    { name: 'LOCAL', value: 'L' },
    { name: 'EXTERIOR', value: 'E' }
];