import React, { useContext, useEffect, useState } from 'react'
import { Table, Divider, Space, Button } from 'antd'
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
//States
import { useHistory } from 'react-router'
import { listAllCompanias, listAllTiposDocumento, getClienteByCodigoCliente, getClienteDinamico } from '../../Api/Api'

const columns = [
    {
        title: 'Código',
        dataIndex: 'n_cliente',
        sorter: {
            compare: (a, b) => a.n_cliente - b.n_cliente,
            multiple: 4,
        },
    },{
        title: 'Nombre Completo',
        dataIndex: 'c_nombrescompleto',
        sorter: {
            compare: (a, b) => a.c_nombrescompleto - b.c_nombrescompleto,
            multiple: 3,
        },
    },{
        title: 'Tipo Doc',
        dataIndex: 'c_tipodocumento',
    },{
        title: 'Número doc',
        dataIndex: 'c_numerodocumento',
        sorter: {
            compare: (a, b) => a.c_nombrescompleto - b.c_nombrescompleto,
            multiple: 2,
        },
    },{
        title: 'Dirección',
        dataIndex: 'c_direccion',
    },{
        title: 'País',
        dataIndex: 'c_paiscodigo',
    },{
        title: 'Departamento',
        dataIndex: 'c_departamentocodigo',
    },{
        title: 'Provincia',
        dataIndex: 'c_provinciacodigo',
    },{
        title: 'Distrito',
        dataIndex: 'c_distritocodigo',
    },{
        title: 'Teléfono 1',
        dataIndex: 'c_telefono1',
    },{
        title: 'Teléfono 2',
        dataIndex: 'c_telefono2',
    },{
        title: 'Correo',
        dataIndex: 'c_correo',
        sorter: {
            compare: (a, b) => a.c_nombrescompleto - b.c_nombrescompleto,
            multiple: 1,
        },
    },{
        title: 'F. Inicio Operaciones',
        dataIndex: 'd_fechaInicioOperaciones',
    },{
        title: 'Estado',
        dataIndex: 'c_estado',
    },{
        title: 'F. Inactivación',
        dataIndex: 'd_fechaInactivacion',
    },{
        title: 'Motivo Inactivación',
        dataIndex: 'c_motivoinactivacion',
    },{
        title: 'U. Registro',
        dataIndex: 'c_usuarioregistro',
    },{
        title: 'F. Registro',
        dataIndex: 'd_fecharegistro',
    },{
        title: 'U. Modificación',
        dataIndex: 'c_ultimousuario',
    },{
        title: 'F. Modificación',
        dataIndex: 'd_ultimafechamodificacion',
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
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR CLIENTE" || item === "AGREGAR CLIENTE" || item === "VISUALIZAR CLIENTE" || item === "ELIMINAR CLIENTE"
    })
    const registerPermission = userPermisssions.includes("AGREGAR CLIENTE");
    const updatePermission = userPermisssions.includes("ACTUALIZAR CLIENTE");
    const viewPermission = userPermisssions.includes("VISUALIZAR CLIENTE");
    const deletePermission = userPermisssions.includes("ELIMINAR CLIENTE");

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
        const response = {}; //await deleteUnidadMedida({c_compania:c_compania, n_cliente:n_cliente});
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
        }
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

    const onHandleSearch = async () => {
        let parametros = prepareBodyToSearch();
        const response = await getClienteDinamico(parametros);
        if(response && response.status === 200 && response.body.data) getDataForTable(response.body.data);
    }

    const onHandleClickSearch = async () => {
        await setIsLoading(true);
        await onHandleSearch();
        setIsLoading(false);
    }

    const getDataForTable = (clientes) => {
        const listAux = clientes.map((item) => {
            item.key = `${item.c_compania}-${item.n_cliente}`;
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
                                            handleElementSelected={setCompania}
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
                                    <div className="col-12 col-md-11">
                                        <Divider />
                                        <Space style={{ marginBottom: 16 }}>
                                            {registerPermission && <Button onClick={()=>history.push("/nuevoCliente")}>Nuevo</Button>}
                                            {updatePermission && <Button onClick={handleSelectUpdate}>Modificar</Button>}
                                            {viewPermission && <Button onClick={handleSelectView}>Visualizar</Button>}
                                            {deletePermission && <Button onClick={handleSelectDelete}>Eliminar</Button>}
                                        </Space>
                                        <Table
                                            classForm
                                            rowSelection={{
                                                type: "radio",
                                                ...rowSelection,
                                            }}
                                            columns={columns}
                                            dataSource={clientsToTable}
                                            scroll={{ x: 1300}}
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
            />
        </>
    )
}

export default Clientes