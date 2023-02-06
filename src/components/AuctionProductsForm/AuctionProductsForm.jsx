import React, { useEffect, useState } from 'react'
import HeaderForm from '../HeaderForm/HeaderForm'
import { Table,} from 'antd'
import ResponseModal from '../../components/Modal/ResponseModal'
import AuctionProductsModal from '../AuctionProductsModal/AuctionProductsModal'
//Servicios
import { listAllTiposProducto, listAllUnidadesMedida, getClienteByCodigoCliente  } from '../../Api/Api'
import moment from 'moment'
import SearchModalCliente from '../Modal/SearchModalCliente'
import InputComponentView from '../InputComponent/InputComponentView'
import SearcherComponent from '../SearcherComponent/SearcherComponent'
import SelectComponent from '../SelectComponent/SelectComponent'

const columns = [
    {
        title: 'Línea',
        dataIndex: 'n_linea',
        width: 80,
         ellipsis: {
            showTitle: false,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: 'Descripción producto',
        dataIndex: 'c_descripcionproducto',
        width: 200,
         ellipsis: {
            showTitle: true,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: 'Tipo producto',
        dataIndex: 'c_tipoproducto_name',
        width: 200,
         ellipsis: {
            showTitle: true,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },,{
        title: 'Unidad Medida',
        dataIndex: 'c_unidadmedida_name',
        width: 140,
         ellipsis: {
            showTitle: false,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: 'Cantidad',
        dataIndex: 'n_cantidad',
        width: 120,
         ellipsis: {
            showTitle: false,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: 'Peso Bruto',
        dataIndex: 'n_pesobruto',
        width: 140,
         ellipsis: {
            showTitle: false,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: 'Peso Neto',
        dataIndex: 'n_pesoneto',
        width: 140,
         ellipsis: {
            showTitle: false,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: 'Cliente',
        dataIndex: 't_cliente',
        width: 280,
         ellipsis: {
            showTitle: false,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: 'Tipo Venta',
        dataIndex: 'c_tipoventa_option',
        width: 140,
         ellipsis: {
            showTitle: false,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: '% Capital',
        dataIndex: 'n_percentcap',
        width: 120,
         ellipsis: {
            showTitle: false,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: 'M. Capital',
        dataIndex: 'n_montocap',
        width: 180,
         ellipsis: {
            showTitle: false,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: 'Intereses',
        dataIndex: 'n_montoint',
        width: 120,
         ellipsis: {
            showTitle: false,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: 'M. Total Venta',
        dataIndex: 'n_montototal',
        width: 180,
         ellipsis: {
            showTitle: false,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: 'Observaciones Venta',
        dataIndex: 'c_observacionesventa',
        width: 250,
         ellipsis: {
            showTitle: true,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: 'Observaciones',
        dataIndex: 'c_observaciones',
        width: 250,
         ellipsis: {
            showTitle: true,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    },{
        title: 'Monto Valor Total',
        dataIndex: 'n_montovalortotal',
        width: 180,
         ellipsis: {
            showTitle: false,
        },
        render: (field, item) => (
            <div className='w-100' style={{minHeight: "29px"}} onClick={item.handleMostrarDetalleProductoRow}>
              {field}
            </div>
        ),
    }
]

const tiposVentas =[{value: "C", option:"Tercero"}, {value: "A", option:"Tienda"}];

const AuctionProductsForm = (props) => {
    const { productos=[], setProductos, compania, setIsLoading } = props;
    const [tableDataProducts, setTableDataProducts] = useState([]);
    const [nIndex, setNIndex] = useState(0);
    const [productSelected, setProductSelected] = useState(null);
    //Valores de modificacion
    const [saldoCapital, setSaldoCapital] = useState("");
    const [codigoClienteRemate, setCodigoClienteRemate] = useState("");
    const [nombreClienteRemate, setNombreClienteRemate] = useState("");
    const [clienteSeleccionadoRemate, setClienteSeleccionadoRemate] = useState(null);
    const [tipoVenta, setTipoVenta] = useState("");
    const [openSearchModalRemate, setOpenSearchModalRemate] = useState(false);
    //Listas
    const [allTiposProductos, setAllTiposProductos] = useState([]);
    const [allUnidadesMedidas, setAllUnidadesMedidas] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const getDataTable = () => {
        let saldoCapitalProductos = 0;
        const listProducts = [...productos].map((item, index) => {
            console.log("item", item)
            let aux = {...item};
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
            aux.handleMostrarDetalleProductoRow = () => handleShowDetalleProducto(index, item);
            saldoCapitalProductos = Number(Number(saldoCapitalProductos) + Number(item.n_montovalortotal)).toFixed(2);
            return aux;
        });
        setTableDataProducts(listProducts);
        setSaldoCapital(saldoCapitalProductos);
    }

    const handleShowDetalleProducto = (index, producto) => {
        console.log("Producto", producto);
        setNIndex(index);
        setOpenModal(true);
        setProductSelected(producto);
    }

    const getAllListTiposProductos = async () => {
        const response = await listAllTiposProducto();
        if(response && response.status === 200) setAllTiposProductos(response.body.data);
    }


    const getAllListUnidadesMedidas = async () => {
        const response = await listAllUnidadesMedida();
        if(response && response.status === 200) setAllUnidadesMedidas(response.body.data);
    }

    useEffect(() => {
        getDataTable();
    }, [productos])

    useEffect(() => {
        if(clienteSeleccionadoRemate) {
            setProductos(productos.map(producto => {
                producto.n_cliente = clienteSeleccionadoRemate.n_cliente;
                producto.t_cliente = `${clienteSeleccionadoRemate.n_cliente}-${clienteSeleccionadoRemate.c_nombrescompleto}`;
                producto.c_nombrescompleto = clienteSeleccionadoRemate.c_nombrescompleto;
                return producto;
            }))
        } else {
            setProductos(productos.map(producto => {
                producto.n_cliente = "";
                producto.t_cliente = "";
                return producto;
            }))
        }
        if(tipoVenta) {
            setProductos(productos.map(producto => {
                producto.c_tipoventa_option = tiposVentas.find(t => t.value === tipoVenta).option;
                producto.c_tipoventa = tipoVenta;
                return producto;
            }))
        } else {
            setProductos(productos.map(producto => {
                producto.c_tipoventa = "";
                return producto;
            }))
        }
    }, [codigoClienteRemate, tipoVenta])

    const handleOpenSearchModalForRemate = async () => {
        setOpenSearchModalRemate(true);
    }

    const findClienteByCodeRemate = async () => {
        setIsLoading(true);
        if(codigoClienteRemate) {
            const response = await getClienteByCodigoCliente({c_compania:compania, n_cliente:codigoClienteRemate});
            if(response && response.status === 200 && response.body.data) {
                setClienteSeleccionadoRemate(response.body.data);
            } else {
                setResponseData({title:"Aviso", message:"No hay un cliente con ese código"});
                setCodigoClienteRemate("");
                setOpenResponseModal(true);
            }
        } else {
            setClienteSeleccionadoRemate(null);
        }
        setIsLoading(false);
    }

    /*REMATE*/
    useEffect(() => {
        if(clienteSeleccionadoRemate) {
            setCodigoClienteRemate(clienteSeleccionadoRemate.n_cliente);
            setNombreClienteRemate(clienteSeleccionadoRemate.c_nombrescompleto);
        } else {
            setCodigoClienteRemate("");
            setNombreClienteRemate("");
        }
    }, [clienteSeleccionadoRemate])

    useEffect(async () => {
        await getAllListTiposProductos();
        await getAllListUnidadesMedidas();
    }, [])

    return (
        <>
            <InputComponentView
                label={"Saldo Capital"}
                inputId={"saldoCapitalID"}
                state={saldoCapital}
                classForm="col-12 col-lg-6"
                labelSpace={2}
            ></InputComponentView>
            <SearcherComponent
                placeholder="Cliente"
                label="Cliente"
                inputCodeId="clienteCodigoRemateId"
                stateCode={codigoClienteRemate}
                setStateCode={setCodigoClienteRemate}
                inputId="clienteNombreRemateId"
                stateName={nombreClienteRemate}
                setStateName={setNombreClienteRemate}
                onHandleClick={handleOpenSearchModalForRemate}
                onHandleBlur={findClienteByCodeRemate}
                readOnly={true}
                classForm="col-12 col-lg-6"
                marginForm=""
            />
            <SelectComponent
                labelText="Tipo Venta"
                defaultValue="Seleccione un tipo"
                items={[{value: "C", option:"Tercero"}, {value: "A", option:"Tienda"}]}
                disableDefaultValue={false}
                selectId="tipoVentaId"
                valueField="value"
                optionField="option"
                valueSelected={tipoVenta}
                handleChange={setTipoVenta}
                classForm="col-12 col-lg-6"
            />
            <HeaderForm title="Productos en garantía" readOnly={true}/>
            <div className="row mx-2 mb-2" style={{ overflow: 'scroll' }}>
                <Table
                    columns={columns}
                    dataSource={tableDataProducts}
                    pagination={{ pageSize: 50 }}
                />
            </div>
            <AuctionProductsModal
                isOpen={openModal}
                onClose={()=>setOpenModal(false)}
                nIndex={nIndex}
                setNIndex={setNIndex}
                compania={compania}
                productos={productos}
                setProductos={setProductos}
                setProductSelected={setProductSelected}
                productSelected={productSelected}
                saldoCapital={saldoCapital}
            />
            <SearchModalCliente
                isOpen={openSearchModalRemate}
                onClose={()=>setOpenSearchModalRemate(false)}
                setClienteObtained={setClienteSeleccionadoRemate}
                compania={compania}
            />
        </>
    );
}

export default AuctionProductsForm