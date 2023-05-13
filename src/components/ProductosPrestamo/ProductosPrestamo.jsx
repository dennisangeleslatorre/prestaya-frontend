import { Table } from 'antd';
import moment from 'moment';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import HeaderForm from '../HeaderForm/HeaderForm';

const columns = [
    {
        title: 'Línea',
        dataIndex: 'n_linea'
    },{
        title: 'Descripción producto',
        dataIndex: 'c_descripcionproducto'
    },{
        title: 'Cantidad',
        dataIndex: 'n_cantidad'
    },{
        title: 'Peso Bruto',
        dataIndex: 'n_pesobruto'
    },{
        title: 'Peso Neto',
        dataIndex: 'n_pesoneto'
    },{
        title: 'Observaciones',
        dataIndex: 'c_observaciones'
    },{
        title: 'Monto Valor Total',
        dataIndex: 'n_montovalortotal'
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
    },{
        title: 'Ubicación',
        dataIndex: 'c_ubicaciondesc'
    },{
        title: 'Obs. ubicacion',
        dataIndex: 'c_observacionubicacion'
    },{
        title: 'Usuario ubic.',
        dataIndex: 'c_usuarioubicacion'
    },{
        title: 'Fecha Ubicación',
        dataIndex: 'd_fechaubicacion_format'
    }
];

const ProductosPrestamo = ({productos}) => {
    const [tableDataProducts, setTableDataProducts] = useState([]);
    const getDataTable = () => {
        const listProducts = [...productos].map((item, index) => {
            let aux = item;
            aux.key = index;
            aux.n_linea = index+1;
            aux.n_cantidad = Number(item.n_cantidad).toFixed(0);
            aux.n_pesobruto = Number(item.n_pesobruto).toFixed(4);
            aux.n_pesoneto = Number(item.n_pesoneto).toFixed(4);
            aux.n_montovalortotal = Number(item.n_montovalortotal).toFixed(2);
            aux.c_usuarioregistro = item.c_usuarioregistro ? item.c_usuarioregistro : "";
            aux.d_fecharegistro_format = item.d_fecharegistro ? moment(item.d_fecharegistro).format("DD/MM/yyyy") : "";
            aux.d_ultimafechamodificacion_format = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy") : "";
            aux.d_fechaubicacion_format = item.d_fechaubicacion ? moment(item.d_fechaubicacion).format("DD/MM/yyyy") : "";
            return aux;
        });
        setTableDataProducts(listProducts);
    }

    useEffect(() => {
        getDataTable();
    }, [productos]);

  return (
    <>
        <HeaderForm title="Productos en garantía" readOnly={true}/>
            <div className="row mx-2 mb-2" style={{ overflow: 'scroll' }}>
                <Table
                    columns={columns}
                    dataSource={tableDataProducts}
                    pagination={{ pageSize: 50 }}
                />
        </div>
    </>
  )
}

export default ProductosPrestamo;