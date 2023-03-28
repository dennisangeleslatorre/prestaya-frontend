import React, { useEffect, useState, useContext } from 'react'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
//Servicios
import { listAllCompanias, listAgencias, listTiposProducto, getProductoDinamico } from '../../Api/Api';
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent';
import Loading from '../../components/Modal/LoadingModal'
import ResponseModal from '../../components/Modal/ResponseModal';
import SearchModalProducto from '../../components/Modal/SearchModalProducto';
import { Button, Space, Table, Tooltip } from 'antd';
import moment from 'moment';
import StockProductModal from '../../components/StockProductModal/StockProductModal';
//Context
import FiltersContext from '../../context/FiltersContext/FiltersContext'

const estados = [{ name: 'TODOS', value: 'T' },{ name: 'ACTIVO', value: 'A' },{ name: 'INACTIVO', value: 'I' }];

const columns = [
    {
        title: 'Agencia',
        dataIndex: 'c_agencia_desc',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
        render: (c_agencia_desc, objeto) => (
            <div>
                <Tooltip placement="topLeft" title={c_agencia_desc}>
                    {c_agencia_desc}
                </Tooltip>
            </div>
        ),
    },
    {
        title: 'Producto',
        dataIndex: 'c_item',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
        render: (c_item, objeto) => (
            <div>
                <Tooltip placement="topLeft" title={c_item}>
                    {c_item}
                </Tooltip>
            </div>
        ),
    },
    {
        title: 'Descripción',
        dataIndex: 'c_descripcionproducto',
        ellipsis: {
            showTitle: false,
        },
        width: 200,
        render: (c_descripcionproducto, objeto) => (
            <div>
                <Tooltip placement="topLeft" title={c_descripcionproducto}>
                    {c_descripcionproducto}
                </Tooltip>
            </div>
        ),
    },
    {
        title: 'Unidad M.',
        dataIndex: 'c_unidadmedida_desc',
        ellipsis: {
            showTitle: false,
        },
        width: 120,
    },
    {
        title: 'Tipo producto',
        dataIndex: 'c_descripcion_tipo_producto',
        ellipsis: {
            showTitle: false,
        },
        width: 120,
    },
    {
        title: 'Observaciones',
        dataIndex: 'c_observaciones_producto',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        render: (c_observaciones_producto, objeto) => (
            <div>
                <Tooltip placement="topLeft" title={c_observaciones_producto}>
                    {c_observaciones_producto}
                </Tooltip>
            </div>
        ),
    },
    {
        title: 'P. Neto',
        dataIndex: 'n_pesoneto',
        width: 140,
         ellipsis: {
            showTitle: false,
        }
    },
    {
        title: 'P. Bruto',
        dataIndex: 'n_pesobruto',
        width: 140,
         ellipsis: {
            showTitle: false,
        }
    },
    {
        title: '# Prestamo',
        dataIndex: 'c_prestamo',
        width: 140,
         ellipsis: {
            showTitle: false,
        }
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

const Productos = () => {

    //Estados
    const [compania, setCompania] = useState("");
    const [agencia, setAgencia] = useState("T");
    const [tipo, setTipo] = useState("T");
    const [estado, setEstado] = useState("T");
    const [codigoProducto, setCodigoProducto] = useState("");
    const [nombreProducto, setNombreProducto] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [dataTableProductos, setDataTableProductos] = useState([]);
    //Listas
    const [companias, setCompanias] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [tiposProducto, setTiposProducto] = useState([]);
    //Form
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const [openStockModal, setOpenStockModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [elementSelected, setElementSelected] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    //Contexto
    const { setParamsForFilterProducto, getParamsForFilterProducto } = useContext(FiltersContext);

    const handleSeleccionarCompania = (value) => {
        setCompania(value);
        //Deberia buscar las agencias de la compañía
        getAgenciasByCompany(value);
    }

    const prepareBodyToSearch = () => {
        let body = {};
        if(compania) body.c_compania = compania;
        if(agencia && agencia !== "T") body.c_agencia = agencia;
        if(codigoProducto) body.c_item = codigoProducto;
        if(tipo && tipo !== "T") body.c_tipoproducto = tipo;
        if(estado && estado !== "T") body.c_estado = estado;
        return body;
    }

    const onHandleSearch = async (parametrosIniciales) => {
        let parametros =  parametrosIniciales ? parametrosIniciales : prepareBodyToSearch();
        setParamsForFilterProducto(parametros);
        const response = await getProductoDinamico(parametros);
        if(response && response.status === 200 && response.body.data) {
            const data = response.body.data;
            setDataForTable(data);
        }
        else setDataForTable([]);
    }

    const setDataForTable = (data) => {
        const listAux = JSON.parse(JSON.stringify(data)).map((item) => {
            let aux = item;
            aux.c_estado_desc = item.c_estado === "A" ? "Activo" : "Inactivo";
            aux.d_fecharegistro = item.d_fecharegistro ? moment(item.d_fecharegistro).format('DD/MM/yyyy HH:mm:ss'):  "";
            aux. d_ultimafechamodificacion = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format('DD/MM/yyyy HH:mm:ss') :  "";
            aux.key = `${item.c_compania}-${item.c_agencia}-${item.c_item}`
            return aux;
        });
        setDataTableProductos(listAux);
    }

    const onHandleClickSearch = async () => {
        await setIsLoading(true);
        await onHandleSearch();
        setIsLoading(false);
    }

    const findProductoByCode = async () => {
        setIsLoading(true);
        if(codigoProducto) {
            const response = await getProductoDinamico({ c_compania:compania, c_agencia:agencia, c_item:codigoProducto });
            if(response && response.status === 200 && response.body.data) {
                setNombreProducto(response.body.data[0].c_descripcionproducto);
            } else {
                setResponseData({title:"Aviso", message:"No hay un producto con ese código"});
                setCodigoProducto("");
                setNombreProducto("");
                setProductoSeleccionado({});
                setOpenResponseModal(true);
            }
        } else
        setNombreProducto("");
        setIsLoading(false);
    }

    //Listas
    const getCompanias =  async () => {
        const response = await listAllCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }
    const getAgenciasByCompany = async (companyCode) => {
        const response = await listAgencias({c_compania: companyCode});
        if(response && response.status === 200 && response.body.data) setAgencias([{c_agencia: 'T', c_descripcion: 'TODOS'},...response.body.data]);
    }
    const getTiposProducto = async () => {
        const response = await listTiposProducto();
        if(response && response.status === 200) setTiposProducto([{c_descripcion:"TODOS",c_tipoproducto:"T"},...response.body.data]);
    }

    useEffect(() => {
        if(productoSeleccionado) {
            setCodigoProducto(productoSeleccionado.c_item);
            setNombreProducto(productoSeleccionado.c_descripcionproducto);
        }
    }, [productoSeleccionado])

    useEffect(() => {
        if(companias.length !== 0 && !compania) {
            handleSeleccionarCompania(companias[0].c_compania);
        };
    }, [companias])

    const getLastSearch = async () => {
        const parametros = getParamsForFilterProducto();
        if( parametros && Object.keys(parametros).length !== 0 ) {
            await onHandleSearch(parametros);
            if(parametros.c_compania) setCompania(parametros.c_compania);
            if(parametros.c_agencia) setAgencia(parametros.c_agencia);
            if(parametros.c_tipoproducto) setTipo(parametros.c_tipoproducto);
            if(parametros.c_item) setCodigoProducto(parametros.c_item);
            if(parametros.c_estado) setEstado(parametros.c_estado);
        }
    };


    useEffect(async() => {
        await setIsLoading(true);
        await getCompanias();
        await getTiposProducto();
        await getLastSearch();
        setIsLoading(false);
    }, [])

    const rowSelection = {
        onChange: (selectedKeys, selectedRows) => {
            setElementSelected(selectedRows);
            setSelectedRowKeys(selectedKeys);
        }
    };

    const handleSelectStock = () => {
        if(elementSelected[0]) {
            console.log(elementSelected[0]);
            setOpenStockModal(true);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla."})
            setOpenResponseModal(true);
        }
    }

  return (
    <>
         <div className="container-fluid pt-2 pb-2 pl-2 pr-2" style={{ background: '#FFFFFF' }}>
                <div className="row" >
                    <div className="col">
                        <div className="card pr-3 pl-3">
                            <div className="card-body">
                                <div className="row">
                                    <div className="row col-12 col-md-12">
                                        <ReactSelect
                                            inputId="companiaCodeId"
                                            labelText="Compañía"
                                            placeholder="Seleccione un compañía"
                                            valueSelected={compania}
                                            data={companias}
                                            handleElementSelected={setCompania}
                                            optionField="c_descripcion"
                                            valueField="c_compania"
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                        />
                                        <ReactSelect
                                            inputId="agenciaCodeId"
                                            labelText="Agencia"
                                            placeholder="Seleccione una agencia"
                                            valueSelected={agencia}
                                            data={agencias}
                                            handleElementSelected={setAgencia}
                                            optionField="c_descripcion"
                                            valueField="c_agencia"
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                        />
                                        <ReactSelect
                                            inputId="tiposId"
                                            labelText="Tipos de producto"
                                            placeholder="Seleccione un tipo"
                                            valueSelected={tipo}
                                            data={tiposProducto}
                                            handleElementSelected={setTipo}
                                            optionField="c_descripcion"
                                            valueField="c_tipoproducto"
                                            classForm="col-12 col-lg-6"
                                            marginForm="ml-0"
                                        />
                                        <SearcherComponent
                                            placeholder="Nombre del producto"
                                            label="Producto"
                                            inputCodeId="productoCodigoId"
                                            stateCode={codigoProducto}
                                            setStateCode={setCodigoProducto}
                                            inputId="productoNombreId"
                                            stateName={nombreProducto}
                                            setStateName={setNombreProducto}
                                            onHandleClick={()=>setOpenSearchModal(true)}
                                            onHandleBlur={findProductoByCode}
                                            readOnly={true}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            searchWidth={4}
                                        />
                                        <SelectComponent
                                            labelText="Estado"
                                            defaultValue="Seleccione un estado"
                                            items={estados}
                                            selectId="estadoId"
                                            valueField="value"
                                            optionField="name"
                                            valueSelected={estado}
                                            handleChange={setEstado}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                        />
                                        <div className="col-12 col-md-12 mt-3 mb-3 text-center">
                                            <button onClick={onHandleClickSearch} className='btn btn-light' style={{width: "200px"}}>Buscar</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <Space size={[10, 3]} wrap style={{ marginBottom: 16 }}>
                                           <Button onClick={handleSelectStock}>STOCK</Button>
                                        </Space>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col" style={{ overflow: 'scroll' }}>
                                        <Table
                                            classForm
                                            rowSelection={{
                                                type: "radio",
                                                ...rowSelection,
                                                selectedRowKeys,
                                            }}
                                            columns={columns}
                                            dataSource={dataTableProductos}
                                            pagination={{ pageSize: 50 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        {isLoading === true && <Loading/>}
        <ResponseModal
            isOpen={openResponseModal}
            title={responseData.title}
            onClose={()=>setOpenResponseModal(false)}
            message={responseData.message}
        />
        <SearchModalProducto
            isOpen={openSearchModal}
            onClose={()=>setOpenSearchModal(false)}
            setProductoObtained={setProductoSeleccionado}
            compania={compania}
            agencia={agencia}
        />
        <StockProductModal
            isOpen={openStockModal}
            onClose={()=>setOpenStockModal(false)}
            compania={elementSelected[0]?.c_compania}
            agencia={elementSelected[0]?.c_agencia}
            codigoProducto={elementSelected[0]?.c_item}
        />
    </>
  )
}

export default Productos