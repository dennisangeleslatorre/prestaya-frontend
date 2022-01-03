import React, { useEffect, useState } from 'react'
import HeaderForm from '../HeaderForm/HeaderForm'
import { Table, Space, Button } from 'antd'
import WarrantyProductsModal from '../WarrantyProductsModal/WarrantyProductsModal'
import { listUnidadesMedida } from '../../Api/Api'
import moment from 'moment'

const columns = [
    {
        title: 'Línea',
        dataIndex: 'n_linea'
    },{
        title: 'Descripción producto',
        dataIndex: 'c_descripcionproducto'
    },{
        title: 'Unidad Medida',
        dataIndex: 'c_unidadmedida'
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
        dataIndex: 'd_fecharegistro'
    },{
        title: 'U. Usuario',
        dataIndex: 'c_ultimousuario'
    },{
        title: 'U. Fecha Modificación',
        dataIndex: 'd_ultimafechamodificacion'
    }
]

const WarrantyProductsForm = (props) => {
    const { productos=[], setProductos, readOnly=false, userLogedIn } = props;
    //Estados
    const [editProduct, setEditProduct] = useState(null);
    const [elementSelected, setElementSelected] = useState();
    const [unidadesMedidas, setUnidadesMedidas] = useState([]);
    const [tableDataProducts, setTableDataProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleDeleteProduct = () => {
        if(elementSelected) {
            let listProducts = [...productos];
            const productAux = productos[elementSelected];
            if(productAux.n_linea) {
                console.log("Agregar a la lsta de eliminacion")
            }
            listProducts.splice(elementSelected, 1);
            setProductos(listProducts);
        }
    }

    const handleUpdateProduct = () => {
        if(elementSelected) {
            setEditProduct(productos[elementSelected-1]);
            setShowModal(true);
        }
    }

    const getUnidadesMedidas = async () => {
        const response = await listUnidadesMedida();
        if(response && response.status === 200) setUnidadesMedidas(response.body.data);
    }

    useEffect(async () => {
        await getUnidadesMedidas();
    }, [])

    //Atributos de la tabla
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          setElementSelected(selectedRowKeys);
        }
    };

    const getDataTable = () => {
        const listProducts = productos.map((item, index) => {
            let aux = item;
            aux.key = index;
            aux.c_usuarioregistro = item.n_linea ? item.c_usuarioregistro : "";
            aux.d_fecharegistro = item.d_fecharegistro ? moment(item.d_fecharegistro).format("DD/MM/yyyy") : "";
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy") : "";
            return aux;
        });
        setTableDataProducts(listProducts);
    }

    useEffect(() => {
        getDataTable();
    }, [productos])

    return (
        <>
            <HeaderForm title="Productos en garantía" handleNewProduct={()=>setShowModal(true)} />
            <div className="col-12 col-md-11">
                <Space style={{ marginBottom: 16 }}>
                    <Button onClick={handleUpdateProduct}>Modificar</Button>
                    <Button onClick={handleDeleteProduct}>Eliminar</Button>
                </Space>
            </div>
            <Table
                className='mb-5'
                rowSelection={{
                    type: "radio",
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={tableDataProducts}
                pagination={{ pageSize: 50 }}
            />
            <WarrantyProductsModal
                isOpen={showModal}
                onClose={()=>setShowModal(false)}
                productos={productos}
                setProductos={setProductos}
                editProduct={editProduct}
                setEditProduct={setEditProduct}
                unidadesMedidas={unidadesMedidas}
                userLogedIn={userLogedIn}
            />
        </>
    )
}

export default WarrantyProductsForm