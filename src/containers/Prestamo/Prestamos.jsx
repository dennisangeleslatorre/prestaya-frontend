import React, { useContext, useEffect, useState } from 'react'
import { Table, Divider, Space, Button } from 'antd'
//Componentes
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import DateRangeComponent from '../../components/DateRangeComponent/DateRangeComponent'
import SearchModalCliente from '../../components/Modal/SearchModalCliente'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import PagesContext from '../../context/PagesContext/PagesContext'
//States
import { useHistory } from 'react-router'
import { listAllCompanias, listAllTiposDocumento, getClienteByCodigoCliente, getPrestamoDinamico,
         listAllPaises, listAllDepartamentos, listAllProvincias, listAllDistritos } from '../../Api/Api'

const columns = [
    {
        title: '# Prestamo',
        dataIndex: 'c_prestamo'
    },
    {
        title: 'F. Registro',
        dataIndex: 'd_fecharegistro'
    },
    {
        title: 'Cliente',
        dataIndex: 'n_cliente'
    },
    {
        title: 'Nombre Completo',
        dataIndex: 'c_nombrescompleto'
    },
    {
        title: 'Tipo Doc',
        dataIndex: 'c_tipodocumento'
    },
    {
        title: 'Numero Doc',
        dataIndex: 'c_numerodocumento'
    },
    {
        title: 'Telefono',
        dataIndex: 'c_telefono1'
    },
    {
        title: 'F. Vigencia',
        dataIndex: 'd_fechavigente'
    },
    {
        title: 'F. Desembolso',
        dataIndex: 'd_fechadesembolso'
    },
    {
        title: 'Dias Plazo',
        dataIndex: 'n_diasplazo'
    },
    {
        title: 'F. Vencimiento',
        dataIndex: 'd_fechavencimiento'
    },
    {
        title: 'Moneda P.',
        dataIndex: 'c_monedaprestamo'
    },
    {
        title: 'Monto Prestamo',
        dataIndex: 'n_montoprestamo'
    },
    {
        title: '% Tasa Interes',
        dataIndex: 'n_tasainteres'
    },
    {
        title: 'Monto Intereses',
        dataIndex: 'n_montointereses'
    },
    {
        title: 'Monto Total P.',
        dataIndex: 'n_montototalprestamo'
    },
    {
        title: 'Monto Valor Prod.',
        dataIndex: 'calc_montovalorproducto'
    },
    {
        title: 'Dias Plazo Totales',
        dataIndex: 'calc_diastotalesplazo'
    },
    {
        title: 'F. Vcto. Reprog.',
        dataIndex: 'calc_fechaultimovencimiento'
    },
    {
        title: 'Dias Transcurridos',
        dataIndex: 'calc_diastotalestranscurridos'
    },
    {
        title: 'Dias Vencido',
        dataIndex: 'calc_diasvencido'
    },
    {
        title: 'Vencido',
        dataIndex: 'calc_esvencido'
    },
    {
        title: 'F. Cancelacion',
        dataIndex: 'calc_fechaultimacancelacion'
    },
    {
        title: 'Interes Cancelado',
        dataIndex: 'calc_sumainterescancelado'
    },
    {
        title: 'Monto Prest. Cancelado',
        dataIndex: 'calc_sumamontoprestamocancelado'
    },
    {
        title: 'Mnto. Comision Canc.',
        dataIndex: 'calc_sumamontocomisioncancelado'
    },
    {
        title: 'Mnto. Total Cancelado',
        dataIndex: 'calc_sumamontototalcancelado'
    },
    {
        title: 'Estado',
        dataIndex: 'estadoName'
    },
    {
        title: 'F. Entrega',
        dataIndex: 'd_fechaentrega'
    },
    {
        title: 'Observaciones Entrega',
        dataIndex: 'c_observacionesentrega'
    },
    {
        title: 'F. Remate',
        dataIndex: 'd_fechaRemate'
    },
    {
        title: 'Obs. Remate',
        dataIndex: 'c_observacionesremate'
    },
    {
        title: 'F. Anulacion',
        dataIndex: 'd_fechaanulacion'
    },
    {
        title: 'Obs. Anulacion',
        dataIndex: 'c_observacionesanula'
    },
    {
        title: 'Direccion',
        dataIndex: 'c_direccioncliente'
    },
    {
        title: 'Pais',
        dataIndex: 'c_paiscodigo'
    },
    {
        title: 'Departamento',
        dataIndex: 'c_departamentocodigo'
    },
    {
        title: 'Provincia',
        dataIndex: 'c_provinciacodigo'
    },
    {
        title: 'Distrito',
        dataIndex: 'c_distritocodigo'
    },
    {
        title: 'Usuario Registro',
        dataIndex: 'c_usuarioregistro'
    },
    {
        title: 'Usuario Vigencia',
        dataIndex: 'c_usuariovigente'
    },
    {
        title: 'Usuario Cancelacion',
        dataIndex: 'c_usuariocancelacion'
    },
    {
        title: 'Usuario Entrega',
        dataIndex: 'c_usuarioEntrega'
    },
    {
        title: 'Usuario Remate',
        dataIndex: 'c_usuarioRemate'
    },
    {
        title: 'U. Anulacion',
        dataIndex: 'c_usuarioanulacion'
    }
]

const estados = [
    { name: 'TODOS', value: 'T' },
    { name: 'PENDIENTE', value: 'PE' },
    { name: 'VIGENTE', value: 'VI' },
    { name: 'CANCELADO', value: 'CA' },
    { name: 'ENTREGADO', value: 'EN' },
    { name: 'REMATE', value: 'RE' },
    { name: 'ANULADO', value: 'AN' }
]

const Prestamos = () => {
    //Navegacion
    let history = useHistory();
    //Estados
    //Filtros
    const [compania, setCompania] = useState("");
    const [nPrestamo, setNPrestamo] = useState({value:""})
    const [estado, setEstado] = useState("T");
    const [codigoCliente, setCodigoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [tipoDocumento, setTipoDocumento] = useState("T");
    const [numeroDocumento, setNumeroDocumento] = useState({value: "", isValid:null});
    const [esVencido, setEsVencido] = useState("T");
    const [paisCodigo, setPaisCodigo] = useState("");
    const [departamentoCodigo, setDepartamentoCodigo] = useState("");
    const [provinciaCodigo, setProvinciaCodigo] = useState("");
    const [distritoCodigo, setDistritoCodigo] = useState("");
    const [fechaDesembolso, setFechaDesembolso] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaDesembolso, setEnabledFechaDesembolso] = useState(true);
    const [fechaRegistro, setFechaRegistro] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaRegistro, setEnabledFechaRegistro] = useState(true);
    const [fechaVigencia, setFechaVigencia] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaVigencia, setEnabledFechaVigencia] = useState(true);
    const [fechaRemate, setFechaRemate] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaRemate, setEnabledFechaRemate] = useState(true);
    const [fechaVencimiento, setFechaVencimiento] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaVencimiento, setEnabledFechaVencimiento] = useState(true);
    const [fechaCancelacion, setFechaCancelacion] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaCancelacion, setEnabledFechaCancelacion] = useState(true);
    const [fechaEntrega, setFechaEntrega] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaEntrega, setEnabledFechaEntrega] = useState(true);
    //Estado de los Componentes
    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [departamentosFiltrados, setDepartamentosFiltrados] = useState([]);
    const [provinciasFiltradas, setProvinciasFiltradas] = useState([]);
    const [distritosFiltrados, setDistritosFiltrados] = useState([]);
    const [companias, setCompanias] = useState([]);
    const [tiposDocumentos, setTiposDocumentos] = useState([]);
    const [elementSelected, setElementSelected] = useState(null);
    const [prestamosToTable, setPrestamosToTable] = useState([]);
    const [responseData, setResponseData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openResponseModal , setOpenResponseModal ] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR PRÉSTAMO" || item === "AGREGAR PRÉSTAMO" || item === "VISUALIZAR PRÉSTAMO" ||
        item === "ANULAR PRÉSTAMO" || item === "VIGENTE" || item === "REGRESAR A PENDIENTE" || item === "CANCELACIONES" ||
        item === "ENTREGAR" || item === "REMATE"
    })
    const registerPermission = userPermisssions.includes("AGREGAR PRÉSTAMO");
    const updatePermission = userPermisssions.includes("ACTUALIZAR PRÉSTAMO");
    const viewPermission = userPermisssions.includes("VISUALIZAR PRÉSTAMO");
    const cancelPermission = userPermisssions.includes("ANULAR PRÉSTAMO");
    const currentPermission = userPermisssions.includes("VIGENTE");
    const returnToPendingPermission = userPermisssions.includes("REGRESAR A PENDIENTE");
    const cancellationsPermission = userPermisssions.includes("CANCELACIONES");
    const rematePermission = userPermisssions.includes("REMATE");
    const entregarPermission = userPermisssions.includes("REMATE");

     //funciones
    const handleSelectUpdate = () => {
        if(elementSelected) {
            history.push(`/editarPrestamo/${elementSelected[0]}`);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }

    const handleSelectView = () => {
        if(elementSelected) {
            history.push(`/visualizarPrestamo/${elementSelected[0]}`);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }

    const handleSelectVigente = () => {
        if(elementSelected) {
            history.push(`/visualizarPrestamo/${elementSelected[0]}`);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }

    const handleSelectAnular = () => {
        if(elementSelected) {
            history.push(`/anularPrestamo/${elementSelected[0]}`);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }

    const handleSelectReturnVigente = () => {
        if(elementSelected) {
            setOpen(true);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }

    const handleReturnVigente = async () => {
        await setOpen(false);
        await setIsLoading(true);
        const [c_compania, c_prestamo] = elementSelected[0].split("-");
        const response = {}; //await regresarPrestamoAVigente({c_compania:c_compania, n_cliente:c_prestamo});
        if(response && response.status === 200) {
            await onHandleSearch();
            setResponseData( {title: "Operación exitosa", message: "Se realizó la operación con éxito el cliente." });
        } else {
            setResponseData( {title: "Error en la operación", message: response.message || "No se pudo realizar la operación" });
        }
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    const handleSelectCancelar = () => {
        if(elementSelected) {
            history.push(`/cancelaciones/${elementSelected[0]}`);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }

    const handleSelectEntregar = () => {
        if(elementSelected) {
            history.push(`/entregarPrestamo/${elementSelected[0]}`);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }

    const handleSelectRemate = () => {
        if(elementSelected) {
            history.push(`/rematePrestamo/${elementSelected[0]}`);
        } else {
            setResponseData({title:"Aviso", message:"Selecciona un item de la tabla"})
            setOpenResponseModal(true);
        }
    }

    //Modales
    const handleOpenSearchModal = async () => {
        setOpenSearchModal(true);
    }

    const findClienteByCode = async () => {
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
        if(nPrestamo.value) body.c_prestamo = nPrestamo.value;
        if(codigoCliente) body.n_cliente = codigoCliente;
        if(estado && estado !== "T") body.c_estado = estado;
        if(tipoDocumento && tipoDocumento !== "T") body.c_tipodocumento = tipoDocumento;
        if(numeroDocumento.value) body.c_numerodocumento = numeroDocumento.value;
        if(esVencido && esVencido !== "T") body.esVencido = esVencido;
        if(paisCodigo) body.c_paiscodigo = paisCodigo;
        if(departamentoCodigo) body.c_despartamentocodigo = departamentoCodigo;
        if(provinciaCodigo) body.c_provinciacodigo = provinciaCodigo;
        if(distritoCodigo) body.c_distritocodigo = distritoCodigo;
        if(fechaDesembolso.isValid && enabledFechaDesembolso) {
            body.d_fechadesembolsoinicio = fechaDesembolso.fechaInicio;
            body.d_fechadesembolsofin = fechaDesembolso.fechaFin;
        }
        if(fechaRegistro.isValid && enabledFechaRegistro) {
            body.d_fecharegistroinicio = fechaRegistro.fechaInicio;
            body.d_fecharegistrofin = fechaRegistro.fechaFin;
        }
        if(fechaVigencia.isValid && enabledFechaVigencia) {
            body.d_fechavigenteinicio = fechaVigencia.fechaInicio;
            body.d_fechavigentefin = fechaVigencia.fechaFin;
        }
        if(fechaRemate.isValid && enabledFechaRemate) {
            body.d_fechaRemateinicio = fechaRemate.fechaInicio;
            body.d_fechaRematefin = fechaRemate.fechaFin;
        }
        if(fechaVencimiento.isValid && enabledFechaVencimiento) {
            body.d_fechavencimientoinicio = fechaVencimiento.fechaInicio;
            body.d_fechavencimientofin = fechaVencimiento.fechaFin;
        }
        if(fechaCancelacion.isValid && enabledFechaCancelacion) {
            body.d_fechacancelacioninicio = fechaCancelacion.fechaInicio;
            body.d_fechacancelacionfin = fechaCancelacion.fechaFin;
        }
        if(fechaEntrega.isValid && enabledFechaEntrega) {
            body.d_fechaentregainicio = fechaEntrega.fechaInicio;
            body.d_fechaentregafin = fechaEntrega.fechaFin;
        }
        console.log('body', body)
        return body;
    }

    const onHandleSearch = async () => {
        let parametros = prepareBodyToSearch();
        const response = await getPrestamoDinamico(parametros);
        if(response && response.status === 200 && response.body.data) getDataForTable(response.body.data);
        else getDataForTable([]);
    }

    const onHandleClickSearch = async () => {
        await setIsLoading(true);
        await onHandleSearch();
        setIsLoading(false);
    }

    const getDataForTable = (clientes) => {
        const listAux = clientes.map((item) => {
            item.key = `${item.c_compania}-${item.c_prestamo}`;
            item.estadoName = estados.find(estado => estado.value === item.c_estado).name;
            return item;
        })
        setPrestamosToTable(listAux);
    }

    //Atributos de la tabla
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          setElementSelected(selectedRowKeys);
        }
    };

    //Listas
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
    const getPaises = async () => {
        const response = await listAllPaises();
        if(response && response.status === 200) setPaises(response.body.data);
    }
    const getDepartamentos = async () => {
        const response = await listAllDepartamentos();
        if(response && response.status === 200) setDepartamentos(response.body.data);
    }
    const getProvincias = async () => {
        const response = await listAllProvincias();
        if(response && response.status === 200) setProvincias(response.body.data);
    }
    const getDistritos = async () => {
        const response = await listAllDistritos();
        if(response && response.status === 200) setDistritos(response.body.data);
    }

    //Efectos
    //Listas enlazadas
    useEffect(() => {
        setDepartamentoCodigo("");
        if(paisCodigo && departamentos.length !== 0) {
            const departamentosAux = departamentos.filter((item) => item.c_paiscodigo === paisCodigo);
            setDepartamentosFiltrados(departamentosAux);
        }
    }, [paisCodigo, departamentos])
    useEffect(() => {
        setProvinciaCodigo("");
        if(departamentoCodigo && provincias.length !== 0) {
            const provinciasAux = provincias.filter((item) => item.c_departamentocodigo === departamentoCodigo);
            setProvinciasFiltradas(provinciasAux);
        }
        if(!departamentoCodigo) {
            setProvinciasFiltradas([]);
        }
    }, [departamentoCodigo, provincias])
    useEffect(() => {
        setDistritoCodigo("");
        if(provinciaCodigo && distritos.length !== 0) {
            const distritosAux = distritos.filter((item) => item.c_provinciacodigo === provinciaCodigo);
            setDistritosFiltrados(distritosAux);
        }
        if(!provinciaCodigo) {
            setProvinciasFiltradas([]);
        }
    }, [provinciaCodigo, distritos])

    //Valor por defecto de la compañia
    useEffect(() => {
        if(companias.length !== 0) setCompania(companias[0].c_compania);
    }, [companias])
    //Valor al seleccionar un cliente

    useEffect(() => {
        if(clienteSeleccionado) {
            setCodigoCliente(clienteSeleccionado.n_cliente);
            setNombreCliente(clienteSeleccionado.c_nombrescompleto);
        }
    }, [clienteSeleccionado])

    //Ejectuar los servicios de obtener al cargarse
    useEffect(async () => {
        await setIsLoading(true);
        await getCompanias();
        await getTiposDocumentos();
        await getPaises();
        await getDepartamentos();
        await getProvincias();
        await getDistritos();
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
                                            items={estados}
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
                                            onHandleBlur={findClienteByCode}
                                            readOnly={true}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        >
                                        </SearcherComponent>
                                        <InputComponent
                                            state={nPrestamo}
                                            setState={setNPrestamo}
                                            type="text"
                                            label="# Prestamo"
                                            placeholder="# Prestamo"
                                            inputId="nPrestamoInput"
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
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
                                        <SelectComponent
                                            labelText="Vencido"
                                            defaultValue="Seleccione"
                                            items={[{ name: "AMBOS", value: "T" }, { name: "SI", value: "S" }, { name: "NO", value: "N" }]}
                                            selectId="esVencidoId"
                                            valueField="value"
                                            optionField="name"
                                            valueSelected={esVencido}
                                            handleChange={setEsVencido}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <ReactSelect
                                            inputId="paisCodeId"
                                            labelText="País"
                                            placeholder="Seleccione un país"
                                            valueSelected={paisCodigo}
                                            data={paises}
                                            handleElementSelected={setPaisCodigo}
                                            optionField="c_descripcion"
                                            valueField="c_paiscodigo"
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                            isClear={true}
                                        />
                                        <ReactSelect
                                            inputId="departamentoCodeId"
                                            labelText="Departamento"
                                            placeholder="Seleccione un Departamento"
                                            valueSelected={departamentoCodigo}
                                            data={departamentosFiltrados}
                                            handleElementSelected={setDepartamentoCodigo}
                                            optionField="c_descripcion"
                                            valueField="c_departamentocodigo"
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <ReactSelect
                                            inputId="provinciaCodeId"
                                            labelText="Provincia"
                                            placeholder="Seleccione una Provincia"
                                            valueSelected={provinciaCodigo}
                                            data={provinciasFiltradas}
                                            handleElementSelected={setProvinciaCodigo}
                                            optionField="c_descripcion"
                                            valueField="c_provinciacodigo"
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <ReactSelect
                                            inputId="distritocodigoId"
                                            labelText="Distrito"
                                            placeholder="Seleccione una Distrito"
                                            valueSelected={distritoCodigo}
                                            data={distritosFiltrados}
                                            handleElementSelected={setDistritoCodigo}
                                            optionField="c_descripcion"
                                            valueField="c_distritocodigo"
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <DateRangeComponent
                                            inputId="fechaDesembolsoId"
                                            labelText="Fecha de desembolso"
                                            state={fechaDesembolso}
                                            setState={setFechaDesembolso}
                                            enabled={enabledFechaDesembolso}
                                            setEnabled={setEnabledFechaDesembolso}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <DateRangeComponent
                                            inputId="fechaRegistroId"
                                            labelText="Fecha de registro"
                                            state={fechaRegistro}
                                            setState={setFechaRegistro}
                                            enabled={enabledFechaRegistro}
                                            setEnabled={setEnabledFechaRegistro}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <DateRangeComponent
                                            inputId="fechaVigenciaId"
                                            labelText="Fecha de vigencia"
                                            state={fechaVigencia}
                                            setState={setFechaVigencia}
                                            enabled={enabledFechaVigencia}
                                            setEnabled={setEnabledFechaVigencia}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <DateRangeComponent
                                            inputId="fechaRemateId"
                                            labelText="Fecha de remate"
                                            state={fechaRemate}
                                            setState={setFechaRemate}
                                            enabled={enabledFechaRemate}
                                            setEnabled={setEnabledFechaRemate}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <DateRangeComponent
                                            inputId="fechaVencimientoId"
                                            labelText="Fecha de vencimiento"
                                            state={fechaVencimiento}
                                            setState={setFechaVencimiento}
                                            enabled={enabledFechaVencimiento}
                                            setEnabled={setEnabledFechaVencimiento}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <DateRangeComponent
                                            inputId="fechaCancelacionId"
                                            labelText="Fecha de cancelación"
                                            state={fechaCancelacion}
                                            setState={setFechaCancelacion}
                                            enabled={enabledFechaCancelacion}
                                            setEnabled={setEnabledFechaCancelacion}
                                            classForm="col-12 col-md-6"
                                            marginForm="ml-0"
                                            labelSpace={3}
                                        />
                                        <DateRangeComponent
                                            inputId="fechaEntregaId"
                                            labelText="Fecha de entrega"
                                            state={fechaEntrega}
                                            setState={setFechaEntrega}
                                            enabled={enabledFechaEntrega}
                                            setEnabled={setEnabledFechaEntrega}
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
                                        <Space style={{ marginBottom: 16 }}>
                                            { registerPermission && <Button onClick={()=>history.push(`/nuevoPrestamo/${compania}`)}>NUEVO</Button>}
                                            { updatePermission && <Button onClick={handleSelectUpdate}>MODIFICAR</Button>}
                                            { viewPermission && <Button onClick={handleSelectView}>VISUALIZAR</Button>}
                                            { cancelPermission && <Button onClick={handleSelectAnular}>ANULAR</Button>}
                                            { currentPermission && <Button onClick={handleSelectVigente}>VIGENTE</Button>}
                                            { returnToPendingPermission && <Button onClick={handleSelectReturnVigente}>REGRESAR A PENDIENTE</Button>}
                                            { cancellationsPermission && <Button onClick={handleSelectCancelar}>CANCELAR</Button>}
                                            { entregarPermission && <Button onClick={handleSelectEntregar}>ENTREGAR</Button>}
                                            { rematePermission && <Button onClick={handleSelectRemate}>REMATE</Button>}
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
                                            dataSource={prestamosToTable}
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
                message={"¿Seguro que desea regresar el estado del prestamo a pendiente?."}
                onHandleFunction={()=>handleReturnVigente()}
                buttonClass="btn-success"
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

export default Prestamos