import React, { useContext, useEffect, useState } from 'react'
import { Table, Divider, Space, Button, Tooltip } from 'antd'
//Componentes
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import SearchModalCliente from '../../components/Modal/SearchModalCliente'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import PagesContext from '../../context/PagesContext/PagesContext'
import FiltersContext from '../../context/FiltersContext/FiltersContext'
//States
import { useHistory } from 'react-router'
import { listAllCompanias, listAllTiposDocumento, getClienteByCodigoCliente, getClienteDinamico, deleteCliente } from '../../Api/Api'
import moment from 'moment'

const columns = [
    {
        title: 'Código',
        dataIndex: 'n_cliente',
        sorter: {
            compare: (a, b) => a.n_cliente - b.n_cliente,
            multiple: 1,
        },
        width: 100,
    },{
        title: 'Nombre Completo',
        dataIndex: 'c_nombrescompleto',
        sorter: {
            compare: (a, b) => a.c_nombrescompleto.localeCompare(b.c_nombrescompleto),
            multiple: 2,
        },
        ellipsis: {
            showTitle: false,
        },
        width: 300,
        render: c_nombrescompleto => (
            <Tooltip placement="topLeft" title={c_nombrescompleto}>
              {c_nombrescompleto}
            </Tooltip>
        ),
    },{
        title: 'Tipo Doc',
        dataIndex: 'c_tipodocumento',
        sorter: {
            compare: (a, b) => a.c_tipodocumento.localeCompare(b.c_tipodocumento),
            multiple: 3,
        },
        width: 120,
    },{
        title: 'Número doc',
        dataIndex: 'c_numerodocumento',
        sorter: {
            compare: (a, b) => a.c_numerodocumento - b.c_numerodocumento,
            multiple: 4,
        },
        width: 150,
    },{
        title: 'Dirección',
        dataIndex: 'c_direccion',
        ellipsis: {
            showTitle: false,
        },
        width: 300,
        render: c_direccion => (
            <Tooltip placement="topLeft" title={c_direccion}>
              {c_direccion}
            </Tooltip>
        ),
    },{
        title: 'País',
        dataIndex: 'pais',
        sorter: {
            compare: (a, b) => a.pais.localeCompare(b.pais),
            multiple: 5,
        },
        width: 150,
    },{
        title: 'Departamento',
        dataIndex: 'departamento',
        sorter: {
            compare: (a, b) => a.departamento.localeCompare(b.departamento),
            multiple: 6,
        },
        width: 150,
    },{
        title: 'Provincia',
        dataIndex: 'provincia',
        sorter: {
            compare: (a, b) => a.provincia.localeCompare(b.provincia),
            multiple: 7,
        },
        width: 150,
    },{
        title: 'Distrito',
        dataIndex: 'distrito',
        sorter: {
            compare: (a, b) => a.distrito.localeCompare(b.distrito),
            multiple: 8,
        },
        width: 150,
    },{
        title: 'Teléfono 1',
        dataIndex: 'c_telefono1',
        width: 150,
    },{
        title: 'Teléfono 2',
        dataIndex: 'c_telefono2',
        width: 150,
    },{
        title: 'Correo',
        dataIndex: 'c_correo',
        sorter: {
            compare: (a, b) => a.c_correo.localeCompare(b.c_correo),
            multiple: 9,
        },
        ellipsis: {
            showTitle: false,
        },
        width: 300,
        render: c_correo => (
            <Tooltip placement="topLeft" title={c_correo}>
              {c_correo}
            </Tooltip>
        ),
    },{
        title: 'F. Inicio Operaciones',
        dataIndex: 'd_fechaInicioOperaciones',
        width: 140,
    },{
        title: 'Estado',
        dataIndex: 'c_estado',
        sorter: {
            compare: (a, b) => a.c_correo.localeCompare(b.c_correo),
            multiple: 10,
        },
        width: 140,
    },{
        title: 'F. Inactivación',
        dataIndex: 'd_fechaInactivacion',
        width: 140,
    },{
        title: 'Motivo Inactivación',
        dataIndex: 'c_motivoinactivacion',
        ellipsis: {
            showTitle: false,
        },
        width: 300,
        render: c_motivoinactivacion => (
            <Tooltip placement="topLeft" title={c_motivoinactivacion}>
              {c_motivoinactivacion}
            </Tooltip>
        ),
    },{
        title: () => <label className='text-audit-table'>U. Registro</label>,
        dataIndex: 'c_usuarioregistro',
        sorter: {
            compare: (a, b) => a.c_usuarioregistro.localeCompare(b.c_usuarioregistro),
            multiple: 11,
        },
        render: text => <label className='text-audit-table'>{text}</label>,
        width: 155,
        className: 'table-audit-column'
    },{
        title: () => <label className='text-audit-table'>F. Registro</label>,
        dataIndex: 'd_fecharegistro',
        render: text => <label className='text-audit-table'>{text}</label>,
        width: 180,
        className: 'table-audit-column'
    },{
        title: () => <label className='text-audit-table'>U. Modificación</label>,
        dataIndex: 'c_ultimousuario',
        sorter: {
            compare: (a, b) => a.c_ultimousuario.localeCompare(b.c_ultimousuario),
            multiple: 12,
        },
        render: text => <label className='text-audit-table'>{text}</label>,
        width: 155,
        className: 'table-audit-column'
    },{
        title:() => <label className='text-audit-table'>F. Modificación</label>,
        dataIndex: 'd_ultimafechamodificacion',
        render: text => <label className='text-audit-table'>{text}</label>,
        width: 180,
        className: 'table-audit-column'
    }
]

const Clientes = () => {
    //Navegacion
    let history = useHistory();
    //Estados
    //Filtros
    const [compania, setCompania] = useState("");
    const [estado, setEstado] = useState("T");
    const [codigoCliente, setCodigoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [tipoDocumento, setTipoDocumento] = useState("T");
    const [numeroDocumento, setNumeroDocumento] = useState({value: "", isValid:null});
    //Estado de los Componentes
    const [companias, setCompanias] = useState([]);
    const [tiposDocumentos, setTiposDocumentos] = useState([]);
    const [elementSelected, setElementSelected] = useState(null);
    const [clientsToTable, setClientsToTable] = useState([]);
    const [responseData, setResponseData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openResponseModal , setOpenResponseModal ] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const { setParamsForFilterCliente, getParamsForFilterCliente } = useContext(FiltersContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR CLIENTE" || item === "AGREGAR CLIENTE" || item === "VISUALIZAR CLIENTE" || item === "ELIMINAR CLIENTE"
    })
    const registerPermission = userPermisssions.includes("AGREGAR CLIENTE");
    const updatePermission = userPermisssions.includes("ACTUALIZAR CLIENTE");
    const viewPermission = userPermisssions.includes("VISUALIZAR CLIENTE");
    const deletePermission = userPermisssions.includes("ELIMINAR CLIENTE");

    const handleChangeCompania = (value) => {
        setCompania(value);
        setEstado("T");
        setCodigoCliente("");
        setNombreCliente("");
        setTipoDocumento("T");
        setNumeroDocumento({value: "", isValid:null});
    };

    //Funciones
    const handleSelectUpdate = () => {
        if(elementSelected) {
            history.push(`/editarCliente/${elementSelected[0]}`);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }
    const handleSelectView = () => {
        if(elementSelected) {
            history.push(`/visualizarCliente/${elementSelected[0]}`);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }
    const handleSelectDelete = async () => {
        if(elementSelected) {
            setOpen(true);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        const [c_compania, n_cliente] = elementSelected[0].split("-");
        const response = await deleteCliente({c_compania:c_compania, n_cliente:n_cliente});
        if(response && response.status === 200) {
            await onHandleSearch();
            setResponseData( {title: "Operación exitosa", message: "Se eliminó con éxito el cliente." });
        } else {
            setResponseData( {title: "Error al eliminar", message: response.message || "Ocurrió un problema" });
        }
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    const handleOpenSearchModal = async () => {
        setOpenSearchModal(true);
    }

    const findByCode = async () => {
        setIsLoading(true);
        if(codigoCliente) {
            const response = await getClienteByCodigoCliente({c_compania:compania, n_cliente:codigoCliente});
            if(response && response.status === 200 && response.body.data) {
                setNombreCliente(response.body.data.c_nombrescompleto);
            } else {
                setResponseData({title:"Aviso", message:"No hay un cliente con ese código"});
                setCodigoCliente("");
                setOpenResponseModal(true);
            }
        } else
            setNombreCliente("");
        setIsLoading(false);
    }

    const prepareBodyToSearch = () => {
        let body = {};
        if(compania) body.c_compania = compania;
        if(codigoCliente) body.n_cliente = codigoCliente;
        if(estado && estado !== "T") body.c_estado = estado;
        if(tipoDocumento && tipoDocumento !== "T") body.c_tipodocumento = tipoDocumento;
        if(numeroDocumento.value) body.c_numerodocumento = numeroDocumento.value;
        return body;
    }

    const onHandleSearch = async (parametrosIniciales) => {
        let parametros = parametrosIniciales ? parametrosIniciales : prepareBodyToSearch();
        const response = await getClienteDinamico(parametros);
        if(response && response.status === 200 && response.body.data) {
            getDataForTable(response.body.data);
            setParamsForFilterCliente(parametros);
        }
        else getDataForTable([]);
    }

    const onHandleClickSearch = async () => {
        await setIsLoading(true);
        await onHandleSearch();
        setIsLoading(false);
    }

    const getDataForTable = (clientes) => {
        const listAux = clientes.map((item) => {
            item.key = `${item.c_compania}-${item.n_cliente}`;
            item.d_fechaInicioOperaciones = moment(item.d_fechaInicioOperaciones).format('DD/MM/yyyy');
            item.d_fechaInactivacion = item.d_fechaInactivacion ? moment(item.d_fechaInactivacion).format('DD/MM/yyyy') : "";
            item.d_fecharegistro = moment(item.d_fecharegistro).format('DD/MM/yyyy HH:mm:ss');
            item.d_ultimafechamodificacion = moment(item.d_ultimafechamodificacion).format('DD/MM/yyyy HH:mm:ss');
            item.c_estado = item.c_estado === 'A' ? 'ACTIVO' : 'INACTIVO';
            return item;
        })
        setClientsToTable(listAux);
    }

    //Atributos de la tabla
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          setElementSelected(selectedRowKeys);
        }
    };

    const getCompanias =  async () => {
        const response = await listAllCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }

    const getTiposDocumentos = async () => {
        const response = await listAllTiposDocumento();
        if(response && response.status === 200) {
            let arrayAux = [...response.body.data];
            arrayAux.unshift({c_tipodocumento:"T", c_descripcion:"TODOS"})
            setTiposDocumentos(arrayAux);
        }
    }

    const getLastSearch = async () => {
        const parametros = getParamsForFilterCliente();
        if( parametros && Object.keys(parametros).length !== 0 ) {
            await onHandleSearch(parametros);
            if(parametros.c_compania) setCompania(parametros.c_compania);
            if(parametros.n_cliente) setCodigoCliente(parametros.n_cliente);
            if(parametros.c_estado) setEstado(parametros.c_estado);
            if(parametros.c_tipodocumento) setTipoDocumento(parametros.c_tipodocumento);
            if(parametros.c_numerodocumento) setNumeroDocumento({value:parametros.c_numerodocumento});
        }
        console.log("parametros", parametros);
    };

    useEffect(() => {
        if(companias.length !== 0) setCompania(companias[0].c_compania);
    }, [companias])

    useEffect(() => {
        if(clienteSeleccionado) {
            setCodigoCliente(clienteSeleccionado.n_cliente);
            setNombreCliente(clienteSeleccionado.c_nombrescompleto);
        }
    }, [clienteSeleccionado])

    useEffect(async () => {
        await setIsLoading(true);
        await getCompanias();
        await getTiposDocumentos();
        await getLastSearch();
        setIsLoading(false);
    }, [])

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
                                            handleElementSelected={handleChangeCompania}
                                            optionField="c_descripcion"
                                            valueField="c_compania"
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <SelectComponent
                                            labelText="Estado"
                                            defaultValue="Seleccione un estado"
                                            items={[{name: "TODOS", value:"T"}, {name: "ACTIVO", value:"A"}, {name: "INACTIVO", value:"I"}]}
                                            selectId="estadoId"
                                            valueField="value"
                                            optionField="name"
                                            valueSelected={estado}
                                            handleChange={setEstado}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <SearcherComponent
                                            placeholder="Nombre del cliente"
                                            label="Cliente"
                                            inputCodeId="clienteCodigoId"
                                            stateCode={codigoCliente}
                                            setStateCode={setCodigoCliente}
                                            inputId="clienteNombreId"
                                            stateName={nombreCliente}
                                            setStateName={setNombreCliente}
                                            onHandleClick={handleOpenSearchModal}
                                            onHandleBlur={findByCode}
                                            readOnly={true}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        >
                                            { !codigoCliente && <div className="invalid__message__data">
                                                Debes escribir algo
                                            </div> }
                                        </SearcherComponent>
                                        <SelectComponent
                                            labelText="Tipo documento"
                                            defaultValue="Seleccione un tipo documento"
                                            items={tiposDocumentos}
                                            selectId="tipoDocId"
                                            valueField="c_tipodocumento"
                                            optionField="c_descripcion"
                                            valueSelected={tipoDocumento}
                                            handleChange={setTipoDocumento}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <InputComponent
                                            state={numeroDocumento}
                                            setState={setNumeroDocumento}
                                            type="text"
                                            label="N° de documento"
                                            placeholder="Número de documento"
                                            inputId="numeroDocumentoInput"
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                    </div>
                                    <div className="col-12 col-md-12 mt-3 mb-3 text-center">
                                        <button onClick={onHandleClickSearch} className='btn btn-light' style={{width: "200px"}}>Buscar</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <Divider />
                                        <Space size={[10, 3]} wrap style={{ marginBottom: 16 }}>
                                            {registerPermission && <Button onClick={()=>history.push(`/nuevoCliente/${compania}`)}>Nuevo</Button>}
                                            {updatePermission && <Button onClick={handleSelectUpdate}>Modificar</Button>}
                                            {viewPermission && <Button onClick={handleSelectView}>Visualizar</Button>}
                                            {deletePermission && <Button onClick={handleSelectDelete}>Eliminar</Button>}
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
                                            }}
                                            columns={columns}
                                            dataSource={clientsToTable}
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
            <ConfirmationModal
                isOpen={open}
                onClose={()=>setOpen(false)}
                title={"Aviso de eliminación"}
                message={"¿Seguro que desea eliminar este elemento?. Una vez eliminado no podrás recuperarlo."}
                onHandleFunction={()=>handleDelete()}
                buttonClass="btn-danger"
            />
            <ResponseModal
                isOpen={openResponseModal}
                title={responseData.title}
                onClose={()=>setOpenResponseModal(false)}
                message={responseData.message}
            />
            <SearchModalCliente
                isOpen={openSearchModal}
                onClose={()=>setOpenSearchModal(false)}
                setClienteObtained={setClienteSeleccionado}
                compania={compania}
            />
        </>
    )
}

export default Clientes