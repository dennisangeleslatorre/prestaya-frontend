const pagesArray = [
    {
        title: 'INICIO',
        value: 'INICIO',
        key: 'INICIO',
        disabled: true
    },{
        title: 'COMERCIAL',
        value: 'COMERCIAL',
        key: 'COMERCIAL',
        children: [
            {
                title: 'CLIENTE',
                value: 'CLIENTE',
                key: 'CLIENTE',
                children: [
                    {
                        title: 'CLIENTES',
                        value: 'CLIENTES',
                        key: 'CLIENTES'
                    },{
                        title: 'AGREGAR CLIENTE',
                        value: 'AGREGAR CLIENTE',
                        key: 'AGREGAR CLIENTE'
                    },{
                        title: 'ACTUALIZAR CLIENTE',
                        value: 'ACTUALIZAR CLIENTE',
                        key: 'ACTUALIZAR CLIENTE'
                    },{
                        title: 'VISUALIZAR CLIENTE',
                        value: 'VISUALIZAR CLIENTE',
                        key: 'VISUALIZAR CLIENTE'
                    }
                    ,{
                        title: 'ELIMINAR CLIENTE',
                        value: 'ELIMINAR CLIENTE',
                        key: 'ELIMINAR CLIENTE'
                    }
                ]
            },{
                title: 'PRÉSTAMO',
                value: 'PRÉSTAMO',
                key: 'PRÉSTAMO',
                children: [
                    {
                        title: 'PRÉSTAMOS',
                        value: 'PRÉSTAMOS',
                        key: 'PRÉSTAMOS'
                    },{
                        title: 'AGREGAR PRÉSTAMO',
                        value: 'AGREGAR PRÉSTAMO',
                        key: 'AGREGAR PRÉSTAMO'
                    },{
                        title: 'ACTUALIZAR PRÉSTAMO',
                        value: 'ACTUALIZAR PRÉSTAMO',
                        key: 'ACTUALIZAR PRÉSTAMO'
                    },{
                        title: 'VISUALIZAR PRÉSTAMO',
                        value: 'VISUALIZAR PRÉSTAMO',
                        key: 'VISUALIZAR PRÉSTAMO'
                    },{
                        title: 'ANULAR PRÉSTAMO',
                        value: 'ANULAR PRÉSTAMO',
                        key: 'ANULAR PRÉSTAMO'
                    },{
                        title: 'TICKET VENTA TERCEROS',
                        value: 'TICKET VENTA TERCEROS',
                        key: 'TICKET VENTA TERCEROS'
                    },{
                        title: 'VIGENTE PRÉSTAMO',
                        value: 'VIGENTE PRÉSTAMO',
                        key: 'VIGENTE PRÉSTAMO'
                    },{
                        title: 'REGRESAR A PENDIENTE',
                        value: 'REGRESAR A PENDIENTE',
                        key: 'REGRESAR A PENDIENTE'
                    },{
                        title: 'ENTREGAR',
                        value: 'ENTREGAR',
                        key: 'ENTREGAR'
                    },{
                        title: 'REMATE',
                        value: 'REMATE',
                        key: 'REMATE'
                    },{
                        title: 'FORMATO PRÉSTAMO',
                        value: 'FORMATO PRÉSTAMO',
                        key: 'FORMATO PRÉSTAMO'
                    },{
                        title: 'MODIFICA USUARIO OPERACIÓN',
                        value: 'MODIFICA USUARIO OPERACIÓN',
                        key: 'MODIFICA USUARIO OPERACIÓN'
                    },{
                        title: 'MODIFICAR UBICACIÓN',
                        value: 'MODIFICAR UBICACIÓN',
                        key: 'MODIFICAR UBICACIÓN'
                    },{
                        title: 'CANCELAR PRÉSTAMO',
                        value: 'CANCELAR PRÉSTAMO',
                        key: 'CANCELAR PRÉSTAMO',
                        children: [
                            {
                                title: 'CANCELACIONES',
                                value: 'CANCELACIONES',
                                key: 'CANCELACIONES'
                            },{
                                title: 'CANCELAR',
                                value: 'CANCELAR',
                                key: 'CANCELAR'
                            },{
                                title: 'SIMULAR',
                                value: 'SIMULAR',
                                key: 'SIMULAR'
                            },{
                                title: 'ANULAR CANCELACIÓN',
                                value: 'ANULAR CANCELACIÓN',
                                key: 'ANULAR CANCELACIÓN'
                            },{
                                title: 'REGRESAR DE ENTREGA',
                                value: 'REGRESAR DE ENTREGA',
                                key: 'REGRESAR DE ENTREGA'
                            },{
                                title: 'REGRESAR DE REMATE',
                                value: 'REGRESAR DE REMATE',
                                key: 'REGRESAR DE REMATE'
                            },{
                                title: 'FORMATO RECIBOS CANCELACIONES',
                                value: 'FORMATO RECIBOS CANCELACIONES',
                                key: 'FORMATO RECIBOS CANCELACIONES'
                            },{
                                title: 'FORMATO CANCELACIONES',
                                value: 'FORMATO CANCELACIONES',
                                key: 'FORMATO CANCELACIONES'
                            },{
                                title: 'FORMATO ACTA ENTREGA',
                                value: 'FORMATO ACTA ENTREGA',
                                key: 'FORMATO ACTA ENTREGA'
                            }
                        ]
                    },
                ]
            },{
                title: 'TRANSACCIÓN',
                value: 'TRANSACCIÓN',
                key: 'TRANSACCIÓN',
                children: [
                    {
                        title: 'TRANSACCIONES TIENDA',
                        value: 'TRANSACCIONES TIENDA',
                        key: 'TRANSACCIONES TIENDA'
                    },{
                        title: 'NUEVA TRANSACCIÓN',
                        value: 'NUEVA TRANSACCIÓN',
                        key: 'NUEVA TRANSACCIÓN'
                    },{
                        title: 'VISUALIZAR TRANSACCIÓN',
                        value: 'VISUALIZAR TRANSACCIÓN',
                        key: 'VISUALIZAR TRANSACCIÓN'
                    },{
                        title: 'ANULAR TRANSACCIÓN',
                        value: 'ANULAR TRANSACCIÓN',
                        key: 'ANULAR TRANSACCIÓN'
                    },{
                        title: 'RECIBO VENTA TIENDA',
                        value: 'RECIBO VENTA TIENDA',
                        key: 'RECIBO VENTA TIENDA'
                    }
                ]
            },{
                title: 'PRODUCTO',
                value: 'PRODUCTO',
                key: 'PRODUCTO',
                children: [
                    {
                        title: 'PRODUCTOS',
                        value: 'PRODUCTOS',
                        key: 'PRODUCTOS'
                    },{
                        title: 'STOCK',
                        value: 'STOCK',
                        key: 'STOCK'
                    }
                ]
            },{
                title: 'FLUJO DE CAJA USUARIOS',
                value: 'FLUJO DE CAJA USUARIOS',
                key: 'FLUJO DE CAJA USUARIOS',
                children: [
                    {
                        title: 'FLUJO CAJA USUARIOS',
                        value: 'FLUJO CAJA USUARIOS',
                        key: 'FLUJO CAJA USUARIOS'
                    },{
                        title: 'NUEVO FLUJO CAJA USUARIOS',
                        value: 'NUEVO FLUJO CAJA USUARIOS',
                        key: 'NUEVO FLUJO CAJA USUARIOS'
                    },{
                        title: 'MODIFICAR FLUJO CAJA USUARIOS',
                        value: 'MODIFICAR FLUJO CAJA USUARIOS',
                        key: 'MODIFICAR FLUJO CAJA USUARIOS'
                    },{
                        title: 'USUARIO ACCESO TOTAL CAJA',
                        value: 'USUARIO ACCESO TOTAL CAJA',
                        key: 'USUARIO ACCESO TOTAL CAJA'
                    },{
                        title: 'USUARIO PUEDE REALIZAR INGRESOS CAJA',
                        value: 'USUARIO PUEDE REALIZAR INGRESOS CAJA',
                        key: 'USUARIO PUEDE REALIZAR INGRESOS CAJA'
                    },{
                        title: 'USUARIO PUEDE REALIZAR SALIDAS CAJA',
                        value: 'USUARIO PUEDE REALIZAR SALIDAS CAJA',
                        key: 'USUARIO PUEDE REALIZAR SALIDAS CAJA'
                    },{
                        title: 'MOVIMIENTOS CAJA USUARIO POR CONFIRMAR',
                        value: 'MOVIMIENTOS CAJA USUARIO POR CONFIRMAR',
                        key: 'MOVIMIENTOS CAJA USUARIO POR CONFIRMAR'
                    }
                ]
            }
        ]
    },{
        title: 'MAESTROS',
        value: 'MAESTROS',
        key: 'MAESTROS',
        children: [
            {
                title: 'AGENCIA',
                value: 'AGENCIA',
                key: 'AGENCIA',
                children: [
                    {
                        title: 'AGENCIAS',
                        value: 'AGENCIAS',
                        key: 'AGENCIAS'
                    },{
                        title: 'AGREGAR AGENCIA',
                        value: 'AGREGAR AGENCIA',
                        key: 'AGREGAR AGENCIA'
                    },{
                        title: 'ACTUALIZAR AGENCIA',
                        value: 'ACTUALIZAR AGENCIA',
                        key: 'ACTUALIZAR AGENCIA'
                    },{
                        title: 'VISUALIZAR AGENCIA',
                        value: 'VISUALIZAR AGENCIA',
                        key: 'VISUALIZAR AGENCIA'
                    },{
                        title: 'ELIMINAR AGENCIA',
                        value: 'ELIMINAR AGENCIA',
                        key: 'ELIMINAR AGENCIA'
                    }
                ]
            },{
                title: 'DEPARTAMENTO',
                value: 'DEPARTAMENTO',
                key: 'DEPARTAMENTO',
                children: [
                    {
                        title: 'DEPARTAMENTOS',
                        value: 'DEPARTAMENTOS',
                        key: 'DEPARTAMENTOS'
                    },{
                        title: 'AGREGAR DEPARTAMENTO',
                        value: 'AGREGAR DEPARTAMENTO',
                        key: 'AGREGAR DEPARTAMENTO'
                    },{
                        title: 'ACTUALIZAR DEPARTAMENTO',
                        value: 'ACTUALIZAR DEPARTAMENTO',
                        key: 'ACTUALIZAR DEPARTAMENTO'
                    },{
                        title: 'VISUALIZAR DEPARTAMENTO',
                        value: 'VISUALIZAR DEPARTAMENTO',
                        key: 'VISUALIZAR DEPARTAMENTO'
                    },{
                        title: 'ELIMINAR DEPARTAMENTO',
                        value: 'ELIMINAR DEPARTAMENTO',
                        key: 'ELIMINAR DEPARTAMENTO'
                    }
                ]
            },{
                title: 'COMPAÑÍA',
                value: 'COMPAÑÍA',
                key: 'COMPAÑÍA',
                children: [
                    {
                        title: 'COMPAÑÍAS',
                        value: 'COMPAÑÍAS',
                        key: 'COMPAÑÍAS'
                    },{
                        title: 'AGREGAR COMPAÑÍA',
                        value: 'AGREGAR COMPAÑÍA',
                        key: 'AGREGAR COMPAÑÍA'
                    },{
                        title: 'ACTUALIZAR COMPAÑÍA',
                        value: 'ACTUALIZAR COMPAÑÍA',
                        key: 'ACTUALIZAR COMPAÑÍA'
                    },{
                        title: 'VISUALIZAR COMPAÑÍA',
                        value: 'VISUALIZAR COMPAÑÍA',
                        key: 'VISUALIZAR COMPAÑÍA'
                    },{
                        title: 'ELIMINAR COMPAÑÍA',
                        value: 'ELIMINAR COMPAÑÍA',
                        key: 'ELIMINAR COMPAÑÍA'
                    }
                ]
            },{
                title: 'DISTRITO',
                value: 'DISTRITO',
                key: 'DISTRITO',
                children: [
                    {
                        title: 'DISTRITOS',
                        value: 'DISTRITOS',
                        key: 'DISTRITOS'
                    },{
                        title: 'AGREGAR DISTRITO',
                        value: 'AGREGAR DISTRITO',
                        key: 'AGREGAR DISTRITO'
                    },{
                        title: 'ACTUALIZAR DISTRITO',
                        value: 'ACTUALIZAR DISTRITO',
                        key: 'ACTUALIZAR DISTRITO'
                    },{
                        title: 'VISUALIZAR DISTRITO',
                        value: 'VISUALIZAR DISTRITO',
                        key: 'VISUALIZAR DISTRITO'
                    },{
                        title: 'ELIMINAR DISTRITO',
                        value: 'ELIMINAR DISTRITO',
                        key: 'ELIMINAR DISTRITO'
                    }
                ]
            },{
                title: 'PAÍS',
                value: 'PAÍS',
                key: 'PAÍS',
                children: [
                    {
                        title: 'PAÍSES',
                        value: 'PAÍSES',
                        key: 'PAÍSES'
                    },{
                        title: 'AGREGAR PAÍS',
                        value: 'AGREGAR PAÍS',
                        key: 'AGREGAR PAÍS'
                    },{
                        title: 'ACTUALIZAR PAÍS',
                        value: 'ACTUALIZAR PAÍS',
                        key: 'ACTUALIZAR PAÍS'
                    },{
                        title: 'VISUALIZAR PAÍS',
                        value: 'VISUALIZAR PAÍS',
                        key: 'VISUALIZAR PAÍS'
                    },{
                        title: 'ELIMINAR PAÍS',
                        value: 'ELIMINAR PAÍS',
                        key: 'ELIMINAR PAÍS'
                    }
                ]
            },{
                title: 'PARÁMETRO',
                value: 'PARÁMETRO',
                key: 'PARÁMETRO',
                children: [
                    {
                        title: 'PARÁMETROS',
                        value: 'PARÁMETROS',
                        key: 'PARÁMETROS'
                    },{
                        title: 'AGREGAR PARÁMETRO',
                        value: 'AGREGAR PARÁMETRO',
                        key: 'AGREGAR PARÁMETRO'
                    },{
                        title: 'ACTUALIZAR PARÁMETRO',
                        value: 'ACTUALIZAR PARÁMETRO',
                        key: 'ACTUALIZAR PARÁMETRO'
                    },{
                        title: 'VISUALIZAR PARÁMETRO',
                        value: 'VISUALIZAR PARÁMETRO',
                        key: 'VISUALIZAR PARÁMETRO'
                    },{
                        title: 'ELIMINAR PARÁMETRO',
                        value: 'ELIMINAR PARÁMETRO',
                        key: 'ELIMINAR PARÁMETRO'
                    }
                ]
            },{
                title: 'PERÍODO',
                value: 'PERÍODO',
                key: 'PERÍODO',
                children: [
                    {
                        title: 'PERÍODOS',
                        value: 'PERÍODOS',
                        key: 'PERÍODOS'
                    },{
                        title: 'AGREGAR PERÍODO',
                        value: 'AGREGAR PERÍODO',
                        key: 'AGREGAR PERÍODO'
                    },{
                        title: 'ACTUALIZAR PERÍODO',
                        value: 'ACTUALIZAR PERÍODO',
                        key: 'ACTUALIZAR PERÍODO'
                    },{
                        title: 'VISUALIZAR PERÍODO',
                        value: 'VISUALIZAR PERÍODO',
                        key: 'VISUALIZAR PERÍODO'
                    },{
                        title: 'ELIMINAR PERÍODO',
                        value: 'ELIMINAR PERÍODO',
                        key: 'ELIMINAR PERÍODO'
                    }
                ]
            },{
                title: 'PROVINCIA',
                value: 'PROVINCIA',
                key: 'PROVINCIA',
                children: [
                    {
                        title: 'PROVINCIAS',
                        value: 'PROVINCIAS',
                        key: 'PROVINCIAS'
                    },{
                        title: 'AGREGAR PROVINCIA',
                        value: 'AGREGAR PROVINCIA',
                        key: 'AGREGAR PROVINCIA'
                    },{
                        title: 'ACTUALIZAR PROVINCIA',
                        value: 'ACTUALIZAR PROVINCIA',
                        key: 'ACTUALIZAR PROVINCIA'
                    },{
                        title: 'VISUALIZAR PROVINCIA',
                        value: 'VISUALIZAR PROVINCIA',
                        key: 'VISUALIZAR PROVINCIA'
                    },{
                        title: 'ELIMINAR PROVINCIA',
                        value: 'ELIMINAR PROVINCIA',
                        key: 'ELIMINAR PROVINCIA'
                    }
                ]
            },{
                title: 'TIPO DE PRODUCTO',
                value: 'TIPO DE PRODUCTO',
                key: 'TIPO DE PRODUCTO',
                children: [
                    {
                        title: 'TIPOS DE PRODUCTO',
                        value: 'TIPOS DE PRODUCTO',
                        key: 'TIPOS DE PRODUCTO'
                    },{
                        title: 'AGREGAR TIPO DE PRODUCTO',
                        value: 'AGREGAR TIPO DE PRODUCTO',
                        key: 'AGREGAR TIPO DE PRODUCTO'
                    },{
                        title: 'ACTUALIZAR TIPO DE PRODUCTO',
                        value: 'ACTUALIZAR TIPO DE PRODUCTO',
                        key: 'ACTUALIZAR TIPO DE PRODUCTO'
                    },{
                        title: 'VISUALIZAR TIPO DE PRODUCTO',
                        value: 'VISUALIZAR TIPO DE PRODUCTO',
                        key: 'VISUALIZAR TIPO DE PRODUCTO'
                    },{
                        title: 'ELIMINAR TIPO DE PRODUCTO',
                        value: 'ELIMINAR TIPO DE PRODUCTO',
                        key: 'ELIMINAR TIPO DE PRODUCTO'
                    }
                ]
            },{
                title: 'SUBTIPO PRODUCTO',
                value: 'SUBTIPO PRODUCTO',
                key: 'SUBTIPO PRODUCTO',
                children: [
                    {
                        title: 'SUBTIPOS DE PRODUCTO',
                        value: 'SUBTIPOS DE PRODUCTO',
                        key: 'SUBTIPOS DE PRODUCTO'
                    },{
                        title: 'AGREGAR SUBTIPO DE PRODUCTO',
                        value: 'AGREGAR SUBTIPO DE PRODUCTO',
                        key: 'AGREGAR SUBTIPO DE PRODUCTO'
                    },{
                        title: 'ACTUALIZAR SUBTIPO DE PRODUCTO',
                        value: 'ACTUALIZAR SUBTIPO DE PRODUCTO',
                        key: 'ACTUALIZAR SUBTIPO DE PRODUCTO'
                    },{
                        title: 'VISUALIZAR SUBTIPO DE PRODUCTO',
                        value: 'VISUALIZAR SUBTIPO DE PRODUCTO',
                        key: 'VISUALIZAR SUBTIPO DE PRODUCTO'
                    },{
                        title: 'ELIMINAR SUBTIPO DE PRODUCTO',
                        value: 'ELIMINAR SUBTIPO DE PRODUCTO',
                        key: 'ELIMINAR SUBTIPO DE PRODUCTO'
                    }
                ]
            },{
                title: 'TIPO DE DOCUMENTO',
                value: 'TIPO DE DOCUMENTO',
                key: 'TIPO DE DOCUMENTO',
                children: [
                    {
                        title: 'TIPOS DE DOCUMENTO',
                        value: 'TIPOS DE DOCUMENTO',
                        key: 'TIPOS DE DOCUMENTO'
                    },{
                        title: 'AGREGAR TIPO DE DOCUMENTO',
                        value: 'AGREGAR TIPO DE DOCUMENTO',
                        key: 'AGREGAR TIPO DE DOCUMENTO'
                    },{
                        title: 'ACTUALIZAR TIPO DE DOCUMENTO',
                        value: 'ACTUALIZAR TIPO DE DOCUMENTO',
                        key: 'ACTUALIZAR TIPO DE DOCUMENTO'
                    },{
                        title: 'VISUALIZAR TIPO DE DOCUMENTO',
                        value: 'VISUALIZAR TIPO DE DOCUMENTO',
                        key: 'VISUALIZAR TIPO DE DOCUMENTO'
                    },{
                        title: 'ELIMINAR TIPO DE DOCUMENTO',
                        value: 'ELIMINAR TIPO DE DOCUMENTO',
                        key: 'ELIMINAR TIPO DE DOCUMENTO'
                    }
                ]
            },{
                title: 'UNIDAD DE MEDIDA',
                value: 'UNIDAD DE MEDIDA',
                key: 'UNIDAD DE MEDIDA',
                children: [
                    {
                        title: 'UNIDADES DE MEDIDA',
                        value: 'UNIDADES DE MEDIDA',
                        key: 'UNIDADES DE MEDIDA'
                    },{
                        title: 'AGREGAR UNIDAD DE MEDIDA',
                        value: 'AGREGAR UNIDAD DE MEDIDA',
                        key: 'AGREGAR UNIDAD DE MEDIDA'
                    },{
                        title: 'ACTUALIZAR UNIDAD DE MEDIDA',
                        value: 'ACTUALIZAR UNIDAD DE MEDIDA',
                        key: 'ACTUALIZAR UNIDAD DE MEDIDA'
                    },{
                        title: 'VISUALIZAR UNIDAD DE MEDIDA',
                        value: 'VISUALIZAR UNIDAD DE MEDIDA',
                        key: 'VISUALIZAR UNIDAD DE MEDIDA'
                    },{
                        title: 'ELIMINAR UNIDAD DE MEDIDA',
                        value: 'ELIMINAR UNIDAD DE MEDIDA',
                        key: 'ELIMINAR UNIDAD DE MEDIDA'
                    }
                ]
            },{
                title: 'UBICACIÓN AGENCIA',
                value: 'UBICACIÓN AGENCIA',
                key: 'UBICACIÓN AGENCIA',
                children: [
                    {
                        title: 'UBICACIONES DE AGENCIA',
                        value: 'UBICACIONES DE AGENCIA',
                        key: 'UBICACIONES DE AGENCIA'
                    },{
                        title: 'AGREGAR UBICACIÓN AGENCIA',
                        value: 'AGREGAR UBICACIÓN AGENCIA',
                        key: 'AGREGAR UBICACIÓN AGENCIA'
                    },{
                        title: 'ACTUALIZAR UBICACIÓN AGENCIA',
                        value: 'ACTUALIZAR UBICACIÓN AGENCIA',
                        key: 'ACTUALIZAR UBICACIÓN AGENCIA'
                    },{
                        title: 'VISUALIZAR UBICACIÓN AGENCIA',
                        value: 'VISUALIZAR UBICACIÓN AGENCIA',
                        key: 'VISUALIZAR UBICACIÓN AGENCIA'
                    },{
                        title: 'ELIMINAR UBICACIÓN AGENCIA',
                        value: 'ELIMINAR UBICACIÓN AGENCIA',
                        key: 'ELIMINAR UBICACIÓN AGENCIA'
                    }
                ]
            },{
                title: 'TIPO DE MOVIMIENTO DE CAJA',
                value: 'TIPO DE MOVIMIENTO DE CAJA',
                key: 'TIPO DE MOVIMIENTO DE CAJA',
                children: [
                    {
                        title: 'TIPOS DE MOVIMIENTOS DE CAJA',
                        value: 'TIPOS DE MOVIMIENTOS DE CAJA',
                        key: 'TIPOS DE MOVIMIENTOS DE CAJA'
                    },{
                        title: 'AGREGAR TIPO DE MOVIMIENTO DE CAJA',
                        value: 'AGREGAR TIPO DE MOVIMIENTO DE CAJA',
                        key: 'AGREGAR TIPO DE MOVIMIENTO DE CAJA'
                    },{
                        title: 'ACTUALIZAR TIPO DE MOVIMIENTO DE CAJA',
                        value: 'ACTUALIZAR TIPO DE MOVIMIENTO DE CAJA',
                        key: 'ACTUALIZAR TIPO DE MOVIMIENTO DE CAJA'
                    },{
                        title: 'VISUALIZAR TIPO DE MOVIMIENTO DE CAJA',
                        value: 'VISUALIZAR TIPO DE MOVIMIENTO DE CAJA',
                        key: 'VISUALIZAR TIPO DE MOVIMIENTO DE CAJA'
                    },{
                        title: 'ELIMINAR TIPO DE MOVIMIENTO DE CAJA',
                        value: 'ELIMINAR TIPO DE MOVIMIENTO DE CAJA',
                        key: 'ELIMINAR TIPO DE MOVIMIENTO DE CAJA'
                    }
                ]
            },{
                title: 'TIPO DE MOVIMIENTO DE CAJA TIENDA',
                value: 'TIPO DE MOVIMIENTO DE CAJA TIENDA',
                key: 'TIPO DE MOVIMIENTO DE CAJA TIENDA',
                children: [
                    {
                        title: 'TIPOS DE MOVIMIENTOS DE CAJA TIENDA',
                        value: 'TIPOS DE MOVIMIENTOS DE CAJA TIENDA',
                        key: 'TIPOS DE MOVIMIENTOS DE CAJA TIENDA'
                    },{
                        title: 'AGREGAR TIPO DE MOVIMIENTO DE CAJA TIENDA',
                        value: 'AGREGAR TIPO DE MOVIMIENTO DE CAJA TIENDA',
                        key: 'AGREGAR TIPO DE MOVIMIENTO DE CAJA TIENDA'
                    },{
                        title: 'ACTUALIZAR TIPO DE MOVIMIENTO DE CAJA TIENDA',
                        value: 'ACTUALIZAR TIPO DE MOVIMIENTO DE CAJA TIENDA',
                        key: 'ACTUALIZAR TIPO DE MOVIMIENTO DE CAJA TIENDA'
                    },{
                        title: 'VISUALIZAR TIPO DE MOVIMIENTO DE CAJA TIENDA',
                        value: 'VISUALIZAR TIPO DE MOVIMIENTO DE CAJA TIENDA',
                        key: 'VISUALIZAR TIPO DE MOVIMIENTO DE CAJA TIENDA'
                    },{
                        title: 'ELIMINAR TIPO DE MOVIMIENTO DE CAJA TIENDA',
                        value: 'ELIMINAR TIPO DE MOVIMIENTO DE CAJA TIENDA',
                        key: 'ELIMINAR TIPO DE MOVIMIENTO DE CAJA TIENDA'
                    }
                ]
            }
        ]
    },{
        title: 'SISTEMA',
        value: 'SISTEMA',
        key: 'SISTEMA',
        children: [
            {
                title: 'PERFIL',
                value: 'PERFIL',
                key: 'PERFIL',
                children: [
                    {
                        title: 'PERFILES',
                        value: 'PERFILES',
                        key: 'PERFILES'
                    },{
                        title: 'AGREGAR PERFIL',
                        value: 'AGREGAR PERFIL',
                        key: 'AGREGAR PERFIL'
                    },{
                        title: 'ACTUALIZAR PERFIL',
                        value: 'ACTUALIZAR PERFIL',
                        key: 'ACTUALIZAR PERFIL'
                    },{
                        title: 'VISUALIZAR PERFIL',
                        value: 'VISUALIZAR PERFIL',
                        key: 'VISUALIZAR PERFIL'
                    },{
                        title: 'ELIMINAR PERFIL',
                        value: 'ELIMINAR PERFIL',
                        key: 'ELIMINAR PERFIL'
                    }
                ]
            },{
                title: 'USUARIO',
                value: 'USUARIO',
                key: 'USUARIO',
                children: [
                    {
                        title: 'USUARIOS',
                        value: 'USUARIOS',
                        key: 'USUARIOS'
                    },{
                        title: 'AGREGAR USUARIO',
                        value: 'AGREGAR USUARIO',
                        key: 'AGREGAR USUARIO'
                    },{
                        title: 'ACTUALIZAR USUARIO',
                        value: 'ACTUALIZAR USUARIO',
                        key: 'ACTUALIZAR USUARIO'
                    },{
                        title: 'VISUALIZAR USUARIO',
                        value: 'VISUALIZAR USUARIO',
                        key: 'VISUALIZAR USUARIO'
                    },{
                        title: 'CAMBIAR CONTRASEÑA',
                        value: 'CAMBIAR CONTRASEÑA',
                        key: 'CAMBIAR CONTRASEÑA'
                    },{
                        title: 'ELIMINAR USUARIO',
                        value: 'ELIMINAR USUARIO',
                        key: 'ELIMINAR USUARIO'
                    }
                ]
            },
        ],
    }
]

export { pagesArray }