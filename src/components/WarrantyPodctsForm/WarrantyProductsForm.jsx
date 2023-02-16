import React, { useEffect, useState } from 'react'
import HeaderForm from '../HeaderForm/HeaderForm'
import { Table, Space, Button } from 'antd'
import WarrantyProductsModal from '../WarrantyProductsModal/WarrantyProductsModal'
import ResponseModal from '../../components/Modal/ResponseModal'
//Servicios
import { listTiposProducto, listUnidadesMedida, listAllTiposProducto, listAllUnidadesMedida } from '../../Api/Api'
import moment from 'moment'

const columns = [
    {
        title: 'Línea',
        dataIndex: 'n_linea'
    },{
        title: 'Descripción producto',
        dataIndex: 'c_descripcionproducto'
    },{
        title: 'Tipo producto',
        dataIndex: 'c_tipoproducto_name'
    },,{
        title: 'Unidad Medida',
        dataIndex: 'c_unidadmedida_name'
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
        title: 'Cliente',
        dataIndex: 'c_nombrescompleto'
    },{
        title: 'Tipo Venta',
        dataIndex: 'c_tipoventa_desc'
    },{
        title: 'M. Capital',
        dataIndex: 'n_montocap',
        render: (field, item) => (
            <div className='justify-content-end d-flex'>
              {field}
            </div>
        ),
    },{
        title: 'Intereses',
        dataIndex: 'n_montoint',
        render: (field, item) => (
            <div className='justify-content-end d-flex'>
              {field}
            </div>
        ),
    },{
        title: 'M. Total Venta',
        dataIndex: 'n_montototal',
        render: (field, item) => (
            <div className='justify-content-end d-flex'>
              {field}
            </div>
        ),
    },{
        title: 'Observaciones Venta',
        dataIndex: 'c_observacionesventa'
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

const WarrantyProductsForm = (props) => {
    const { productos=[], setProductos, readOnly=false, userLogedIn, warrantyProductUpdateList, setWarrantyProductUpdateList, warrantyProductRemovalList, setWarrantyProductRemovalList } = props;
    //Estados
    const [editProduct, setEditProduct] = useState(null);
    const [elementSelected, setElementSelected] = useState();
    const [tiposProducto, setTiposProducto] = useState([]);
    const [allTiposProductos, setAllTiposProductos] = useState([]);
    const [unidadesMedidas, setUnidadesMedidas] = useState([]);
    const [allUnidadesMedidas, setAllUnidadesMedidas] = useState([]);
    const [tableDataProducts, setTableDataProducts] = useState([]);
    const [newNLine, setNewNLine] = useState({value:1});
    const [showModal, setShowModal] = useState(false);
    //Response
    const [openResponseModal , setOpenResponseModal ] = useState(false);
    const [responseData, setResponseData] = useState({});

    const handleDeleteProduct = () => {
        if(elementSelected) {
            let listProducts = [...productos];
            const productAux = productos[elementSelected];
            if(productAux.c_usuarioregistro) {
                const auxDeletedList = [...warrantyProductRemovalList, productos[elementSelected].n_linea];
                setWarrantyProductRemovalList(auxDeletedList);
            }
            listProducts.splice(elementSelected, 1);
            setProductos(listProducts);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }

    const handleUpdateProduct = () => {
        if(elementSelected) {
            let editProductAux = {...productos[elementSelected]};
            editProductAux.n_cantidad = Number(editProductAux.n_cantidad).toFixed(1);
            editProductAux.n_pesobruto = Number(editProductAux.n_pesobruto).toFixed(4);
            editProductAux.n_pesoneto = Number(editProductAux.n_pesoneto).toFixed(4);
            editProductAux.n_montovalortotal = Number(editProductAux.n_montovalortotal).toFixed(2);
            setEditProduct({...editProductAux, index:elementSelected});
            setShowModal(true);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }

    const getTiposProducto = async () => {
        const response = await listTiposProducto();
        if(response && response.status === 200) setTiposProducto(response.body.data);
    }

    const getAllListTiposProductos = async () => {
        const response = await listAllTiposProducto();
        if(response && response.status === 200) setAllTiposProductos(response.body.data);
    }

    const getUnidadesMedidas = async () => {
        const response = await listUnidadesMedida();
        if(response && response.status === 200) setUnidadesMedidas(response.body.data);
    }

    const getAllListUnidadesMedidas = async () => {
        const response = await listAllUnidadesMedida();
        if(response && response.status === 200) setAllUnidadesMedidas(response.body.data);
    }


    useEffect(async () => {
        await getUnidadesMedidas();
        await getTiposProducto();
        await getAllListTiposProductos();
        await getAllListUnidadesMedidas();
    }, [])

    //Atributos de la tabla
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          setElementSelected(selectedRowKeys);
        }
    };

    const getDataTable = () => {
        const listProducts = [...productos].map((item, index) => {
            let aux = item;
            aux.key = index;
            aux.c_tipoproducto_name = allTiposProductos.find(tipo => tipo.c_tipoproducto === item.c_tipoproducto).c_descripcion;
            aux.c_unidadmedida_name = allUnidadesMedidas.find(unidad => unidad.c_unidadmedida === item.c_unidadmedida).c_descripcion;
            aux.n_linea = index+1;
            aux.n_cantidad = Number(item.n_cantidad).toFixed(0);
            aux.n_pesobruto = Number(item.n_pesobruto).toFixed(4);
            aux.n_pesoneto = Number(item.n_pesoneto).toFixed(4);
            aux.n_montovalortotal = Number(item.n_montovalortotal).toFixed(2);
            aux.c_usuarioregistro = item.c_usuarioregistro ? item.c_usuarioregistro : "";
            aux.d_fecharegistro_format = item.d_fecharegistro ? moment(item.d_fecharegistro).format("DD/MM/yyyy") : "";
            aux.d_ultimafechamodificacion_format = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy") : "";
            aux.c_nombrescompleto = item.c_nombrescompleto;
            aux.c_tipoventa_desc = item.c_tipoventa ? item.c_tipoventa === "C" ? "TERCERO" : "TIENDA" : "";
            aux.n_montocap = item.n_montocap ? Number(item.n_montocap).toFixed(2) : "";
            aux.n_montoint = item.n_montocap ? Number(item.n_montoint).toFixed(2) : "";
            aux.n_montototal = item.n_montocap ? Number(item.n_montototal).toFixed(2) : "";
            aux.c_observacionesventa = item.c_observacionesventa;
            return aux;
        });
        setTableDataProducts(listProducts);
    }

    useEffect(() => {
        getDataTable();
        setNewNLine({value: productos.length+1});
    }, [productos])

    return (
        <>
            <HeaderForm title="Productos en garantía" handleNewProduct={()=>setShowModal(true)} readOnly={readOnly}/>
            {!readOnly && <div className="row col-12">
                <div className="col">
                    <Space style={{ marginBottom: 16 }}>
                        <Button onClick={handleUpdateProduct}>Modificar</Button>
                        <Button onClick={handleDeleteProduct}>Eliminar</Button>
                    </Space>
                </div>
            </div>}
            <div className="row mx-2 mb-2" style={{ overflow: 'scroll' }}>
                <Table
                    rowSelection={{
                        type: "radio",
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={tableDataProducts}
                    pagination={{ pageSize: 50 }}
                />
            </div>
            <WarrantyProductsModal
                newNLine={newNLine}
                isOpen={showModal}
                onClose={()=>setShowModal(false)}
                productos={productos}
                setProductos={setProductos}
                editProduct={editProduct}
                setEditProduct={setEditProduct}
                unidadesMedidas={unidadesMedidas}
                tiposProducto={tiposProducto}
                userLogedIn={userLogedIn}
                warrantyProductUpdateList={warrantyProductUpdateList}
                setWarrantyProductUpdateList={setWarrantyProductUpdateList}
            />
            <ResponseModal
                isOpen={openResponseModal}
                title={responseData.title}
                onClose={()=>setOpenResponseModal(false)}
                message={responseData.message}
            />
        </>
    )
}

export default WarrantyProductsForm