import React, { useContext, useEffect, useState } from 'react'
//Componentes
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent'
import FormContainer from '../../components/FormContainer/FormContainer'
import InputComponent from '../../components/InputComponent/InputComponent'
import InputComponentView from '../../components/InputComponent/InputComponentView'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import TextareaComponent from '../../components/TextareaComponent/TextareaComponent'
import WarrantyProductsForm from '../../components/WarrantyPodctsForm/WarrantyProductsForm'
import AuctionProductsForm from '../../components/AuctionProductsForm/AuctionProductsForm'
import SearchModalCliente from '../../components/Modal/SearchModalCliente'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
import AuditTableComponent from '../../components/AuditTableComponent/AuditTableComponent'
import HeaderForm from '../../components/HeaderForm/HeaderForm'
//Context
import PagesContext from '../../context/PagesContext/PagesContext'
import UserContext from '../../context/UserContext/UserContext'
//Functions
import { useLocation, useHistory } from 'react-router'
import { listAllCompanias, listAllTiposDocumento, listAllPaises, listAllDepartamentos, listAllProvincias, listAllDistritos, listAgencias,
        getClienteByCodigoCliente, registerPrestamo, updatePrestamo, listParametrosByCompania, validateTipos, validateUnidades, getPrestamoByCodigoPrestamo,
        getProductosByPrestamo, anularPrestamo, cambiarEstadoRemate, updtVigentePrestamo, cambiarEstadoEntregar, validarFechaRemate, listUsers } from '../../Api/Api'
import { addDaysToDate } from '../../utilities/Functions/AddDaysToDate';
import moment from 'moment'

const estados = [
    { name: 'PENDIENTE', value: 'PE' },
    { name: 'VIGENTE', value: 'VI' },
    { name: 'CANCELADO', value: 'CA' },
    { name: 'ENTREGADO', value: 'EN' },
    { name: 'REMATE', value: 'RE' },
    { name: 'ANULADO', value: 'AN' }
]

const monedas = [
    { name: 'LOCAL', value: 'L' },
    { name: 'EXTERIOR', value: 'E' }
]

const PrestamoForm = (props) => {
    //Estados
    const [compania, setCompania] = useState("");
    const [nPrestamo, setNPrestamo] = useState({value:"", isValid:null});
    const [agencia, setAgencia] = useState("");
    const [estado, setEstado] = useState("");
    const [codigoCliente, setCodigoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [numeroDocumento, setNumeroDocumento] = useState({value:"", isValid:null});
    const [direccion, setDireccion] = useState({value:"", isValid:null});
    const [paisCodigo, setPaisCodigo] = useState("");
    const [departamentoCodigo, setDepartamentoCodigo] = useState("");
    const [provinciaCodigo, setProvinciaCodigo] = useState("");
    const [distritoCodigo, setDistritoCodigo] = useState("");
    const [telefono, setTelefono] = useState({value:"", isValid:null});
    const [moneda, setMoneda] = useState("L");
    const [montoPrestamo, setMontoPrestamo] = useState({value:"0.0", isValid:true});
    const [tasaInteres, setTasaInteres] = useState({value:"14.98", isValid:true});
    const [montoIntereses, setMontoIntereses] = useState({value:"0.0", isValid:true});
    const [montoTotalPrestamo, setMontoTotalPrestamo] = useState({value:"0.0", isValid:true});
    const [fechaDesembolso, setFechaDesembolso] = useState({value:""});
    const [plazoDias, setPlazoDias] = useState({value: "30", isValid:true});
    const [fechaVencimiento, setFechaVencimiento] = useState({value:"", required:null});
    const [montoInteresDiario, setMontoInteresDiario] = useState({value:"0.0", required:null});
    const [observacionesRegistro, setObservacionesRegistro] = useState("");
    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioDesembolso, setUsuarioDesembolso] = useState("");
    //Listas
    const [warrantyProductUpdateList, setWarrantyProductUpdateList] = useState([]);
    const [warrantyProductRemovalList, setWarrantyProductRemovalList] = useState([]);
    //Anular
    const [observacionesAnular, setObservacionesAnular] = useState("");
    //Vigencia
    const [observacionesVigencia, setObservacionesVigencia] = useState("");
    //Entrega
    const [observacionesEntrega, setObservacionesEntrega] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState({value:""});
    const [personaRecoge, setPersonaRecoge] = useState({value:"", isValid:null});
    const [tipoDocumentoEntrega, setTipoDocumentoEntrega] = useState("");
    //Falta establecer el tipo de documento seleccionado al selecionar
    const [tipoDocumentoSelected, setTipoDocumentoSelected] = useState({});
    const [numeroDocumentoEntrega, setNumeroDocumentoEntrega] = useState({value:"", isValid:null});
    const [telefonoEntrega, setTelefonoEntrega] = useState({value:"", isValid:null});
    //Remate
    const [fechaRemate, setFechaRemate] = useState({value:""});
    const [observacionesRemate, setObservacionesRemate] = useState("");
    //Auditoria
    const [usuarioRegistro, setUsuarioRegistro] = useState("");
    const [fechaRegistro, setFechaRegistro] = useState("");
    const [ultimoUsuario, setUltimoUsuario] = useState("");
    const [fechaModificacion, setFechaModificacion] = useState("");
    const [usuarioVigente, setUsuarioVigente] = useState("");
    const [fechaVigente, setFechaVigente] = useState("");
    const [usuarioCancelacion, setUsuarioCancelacion] = useState("");
    const [fechaCancelacion, setFechaCancelacion] = useState("");
    const [usuarioEntrega, setUsuarioEntrega] = useState("");
    const [fechaEntregaUS, setFechaEntregaUS] = useState("");
    const [usuarioRemate, setUsuarioRemate] = useState("");
    const [fechaRemateUS, setFechaRemateUS] = useState("");
    const [usuarioAnulacion, setUsuarioAnulacion] = useState("");
    const [fechaAnulacion, setFechaAnulacion] = useState("");
    const [usuarioRetornarPendiente, setUsuarioRetornarPendiente] = useState("");
    const [fechaRetornarPendiente, setFechaRetornarPendiente] = useState("");
    //Listas
    const [companias, setCompanias] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [tiposDocumentos, setTiposDocumentos] = useState([]);
    //Estado del formulario
    const [buttonAttributes, setButtonAttributes] = useState({label:"", class:""});
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [modalAttributes, setModalAttributes] = useState({title:"", message:""});
    const [isAlert, setIsAlert] = useState(false);
    const [notification, setNotification] = useState({title:"", type:"", message:""})
    const [openSearchModal, setOpenSearchModal] = useState(false);
    //Contextos
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData().c_codigousuario;
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "MODIFICA USUARIO OPERACIÓN" })
    const modificaOperacionPermission = userPermisssions.includes("MODIFICA USUARIO OPERACIÓN");
    //Variables
    const elementId = props.match.params.id;
    const location = useLocation();
    let history = useHistory();
    const urlFragment = location.pathname.split('/')[1];
    const buttonTypes = {
        nuevoPrestamo: {label:"Guardar", class:"btn btn-primary btn-form"},
        editarPrestamo: {label:"Actualizar", class:"btn btn-warning btn-form"},
        anularPrestamo: {label:"Anular", class:"btn btn-danger btn-form"},
        vigentePrestamo: {label:"Guardar vigente", class:"btn btn-primary btn-form"},
        entregarPrestamo: {label:"Entregar", class:"btn btn-primary btn-form"},
        rematePrestamo: {label:"Remate", class:"btn btn-primary btn-form"},
    }
    const readOnlyView = (urlFragment !== "nuevoPrestamo" && urlFragment !== "editarPrestamo") ? true : false;

    const formFunctions = {
        nuevoPrestamo: ()=> handleRegister(),
        editarPrestamo: ()=> handleUpdate(),
        anularPrestamo: ()=> handleAnular(),
        vigentePrestamo: ()=> handleVigente(),
        entregarPrestamo: ()=> handleEntregar(),
        rematePrestamo: ()=> handleRemate()
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/prestamos"});
        setOpenResponseModal(true);
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if(!compania || !codigoCliente || !nombreCliente || !tipoDocumento || !numeroDocumento.value || !direccion.value || !paisCodigo ||
            !departamentoCodigo || !provinciaCodigo || !distritoCodigo || !telefono.value || !moneda || !montoPrestamo.value || !tasaInteres.value ||
            !montoIntereses.value || !montoTotalPrestamo.value || !fechaDesembolso.value || !plazoDias.value || !fechaVencimiento.value ||
            !montoInteresDiario.value || !agencia ) return false;
        return true;
    }

    const prepareData = () => {
        const data = {
            c_compania: compania,
            n_cliente: codigoCliente,
            c_nombrescompleto: nombreCliente,
            c_tipodocumento: tipoDocumento,
            c_numerodocumento: numeroDocumento.value,
            c_direccioncliente: direccion.value,
            c_paiscodigo: paisCodigo,
            c_departamentocodigo: departamentoCodigo,
            c_provinciacodigo: provinciaCodigo,
            c_distritocodigo: distritoCodigo,
            c_telefono1: telefono.value,
            c_monedaprestamo: moneda,
            n_montoprestamo: montoPrestamo.value,
            n_tasainteres: tasaInteres.value,
            n_montointereses: montoIntereses.value,
            n_montototalprestamo: montoTotalPrestamo.value,
            n_diasplazo: plazoDias.value,
            d_fechadesembolso: fechaDesembolso.value,
            d_fechavencimiento: fechaVencimiento.value,
            n_montointeresesdiario: montoInteresDiario.value,
            c_observacionesregistro: observacionesRegistro,
            c_agencia: agencia
        }
        return data;
    }

    const prepareProducts = (productos) => {
        const aux = productos.map((item)=>`'${item.c_tipoproducto}','${item.c_descripcionproducto}','${item.c_unidadmedida}','${item.n_cantidad}','${item.n_pesobruto}','${item.n_pesoneto}','${item.c_observaciones}','${item.n_montovalortotal}'`)
        .reduce((acc, cv) => `${acc}|${cv}`)
        return aux;
    }

    const prepareProductsToUpdate = (productos) => {
        const aux = productos.map((item)=>`'${item.n_linea}','${item.c_tipoproducto}','${item.c_descripcionproducto}','${item.c_unidadmedida}','${item.n_cantidad}','${item.n_pesobruto}','${item.n_pesoneto}','${item.c_observaciones}','${item.n_montovalortotal}'`)
        .reduce((acc, cv) => `${acc}|${cv}`)
        return aux;
    }

    const handleOpenSearchModal = async () => {
        setOpenSearchModal(true);
    }

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_usuarioregistro = userLogedIn;
        data.c_usuarioregpendiente = userLogedIn;
        //Buscar los ids para validar si estan activos
        const tiposProductos = productos.map((item) => `'${item.c_tipoproducto}'`);
        const unidadesMedidas = productos.map((item) => `'${item.c_unidadmedida}'`);
        const responseValidateTipos = await validateTipos({ids: `${tiposProductos}`});
        if( responseValidateTipos && responseValidateTipos.status === 200 ) {
            const responseValidateMedidas = await validateUnidades({ids: `${unidadesMedidas}`});
            if( responseValidateMedidas && responseValidateMedidas.status === 200 ) {
                const productosGarantia = productos.length !== 0 ? prepareProducts(productos) : "";
                const response = await registerPrestamo({prestamo:data, productos:productosGarantia});
                (response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito el préstamo") : prepareNotificationDanger("Error al registrar", response.message);
            } else
                prepareNotificationDanger("Error al registrar", responseValidateMedidas.message);
        } else
            prepareNotificationDanger("Error al registrar", responseValidateTipos.message);
        setIsLoading(false);
    }

    const validateWithServices = async () => {
        //Buscar los ids para validar si estan activos
        const tiposProductos = productos.map((item) => `'${item.c_tipoproducto}'`);
        const unidadesMedidas = productos.map((item) => `'${item.c_unidadmedida}'`);
        const responseValidateTipos = await validateTipos({ids: `${tiposProductos}`});
        if( responseValidateTipos && responseValidateTipos.status === 200 ) {
            const responseValidateMedidas = await validateUnidades({ids: `${unidadesMedidas}`});
            if( responseValidateMedidas && responseValidateMedidas.status === 200 ) {
                return true;
            }
            prepareNotificationDanger("Error al registrar", responseValidateMedidas.message);
            return false;
        }
        prepareNotificationDanger("Error al registrar", responseValidateTipos.message);
        return false;
    }

    const setCreatedAndUpdatedItems = (arrayItems) => {
        let createdItems = [];
        let updatedItems = [];
        arrayItems.forEach(item => {
            if(!item.c_usuarioregistro) createdItems.push(item);
            if(warrantyProductUpdateList.includes(item.n_linea)) updatedItems.push(item);
        })
        return {createdItems: createdItems, updatedItems: updatedItems};
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        data.c_prestamo = nPrestamo.value;
        //Separar entre productos nuevos y actualizados
        const {createdItems, updatedItems} = setCreatedAndUpdatedItems(productos);
       if( await validateWithServices()) {
            const nuevosProductosGarantia = createdItems.length !== 0 ? prepareProducts(createdItems) : "";
            const actulizarProductosGarantia = updatedItems.length !== 0 ? prepareProductsToUpdate(updatedItems) : "";
            const eliminarProductosGarntia = warrantyProductRemovalList.length !== 0 ? warrantyProductRemovalList.map(item => `'${item}'`).reduce((acc, cv) => `${acc},${cv}`) : "";
            const response = await updatePrestamo({prestamo:data, nuevosProductos:nuevosProductosGarantia, actualizarProductos:actulizarProductosGarantia, eliminarProductos:eliminarProductosGarntia});
            (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el préstamo") : prepareNotificationDanger("Error al actualizar", response.message);
        }
        setIsLoading(false);
    }

    //Funciones adicionales
    const handleAnular = async () => {
        setOpen(false);
        await setIsLoading(true);
        if(observacionesAnular) {
            const [c_compania, c_prestamo] = elementId.split('-');
            const data = {
                c_compania: c_compania,
                c_prestamo: c_prestamo,
                c_estado: "AN",
                c_observacionesanula: observacionesAnular,
                c_usuarioanulacion: userLogedIn
            }
            const response = await anularPrestamo(data);
            (response && response.status === 200) ? prepareNotificationSuccess("Se anulo con éxito el préstamo") : prepareNotificationDanger("Error al anular", response.message);
        } else {
            prepareNotificationDanger("Error al anular", "Favor de llenar el campo de Observaciones Anular");
        }
        setIsLoading(false);
    }

    const handleVigente = async () => {
        setOpen(false);
        await setIsLoading(true);
        if(observacionesVigencia) {
            const [c_compania, c_prestamo] = elementId.split('-');
            const data = {
                c_compania: c_compania,
                c_prestamo: c_prestamo,
                c_estado: "VI",
                c_usuariovigente: userLogedIn,
                c_observacionesvigente: observacionesVigencia,
                c_usuariodesembolso: usuarioDesembolso,
                n_monto: montoPrestamo.value
            }
            const response = await updtVigentePrestamo(data);
            (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el préstamo a Vigente") : prepareNotificationDanger("Error al actualizar", response.message);
        } else {
            prepareNotificationDanger("Error", "Favor de llenar el campo de Observaciones Vigencia");
        }
        setIsLoading(false);
    }

    const handleEntregar = async () => {
        setOpen(false);
        await setIsLoading(true);
        if(!fechaEntrega.value || !personaRecoge.value || !tipoDocumentoEntrega || !numeroDocumentoEntrega.isValid || !telefonoEntrega.isValid || !observacionesEntrega) {
            prepareNotificationDanger("Error", "Favor de llenar los campos activos");
        } else {
            const [c_compania, c_prestamo] = elementId.split('-');
            const data = {
                c_compania: c_compania,
                c_prestamo: c_prestamo,
                c_usuarioEntrega: userLogedIn,
                d_fechaentrega: fechaEntrega.value,
                c_nombrepersonarecogio: personaRecoge.value,
                c_tipodocumentopr: tipoDocumentoEntrega,
                c_numerodocumentopr: numeroDocumentoEntrega.value,
                c_telefonopr: telefonoEntrega.value,
                c_observacionesentrega: observacionesEntrega
            }
            const response = await cambiarEstadoEntregar(data);
            (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el préstamo a Entregado") : prepareNotificationDanger("Error al actualizar", response.message);
        }
        setIsLoading(false);
    }

    const validateProductos = () => {
        let isValid = true;
        productos.forEach(producto => {
            if( !producto.n_cliente || !producto.c_tipoventa || !producto.n_montocap || !producto.n_montoint
                || !producto.n_montototal || !producto.c_observacionesventa) isValid = false;
        })
        return isValid;
    }

    const validaTipoVenta = () => {
        let isValid = true;
        productos.forEach(producto => {
            if( producto.c_tipoventa !== 'C') isValid = false;
        })
        return isValid;
    }

    const prepareProductsToRemate = () => {
        const aux = productos.map(item => {
            let productoAux = {}
            productoAux.n_linea = item.n_linea;
            productoAux.c_observaciones = item.c_observaciones;
            productoAux.n_pesobruto = item.n_pesobruto;
            productoAux.n_pesoneto = item.n_pesoneto;
            productoAux.c_descripcionproducto = item.c_descripcionproducto;
            productoAux.c_tipoproducto = item.c_tipoproducto;
            productoAux.c_unidadmedida = item.c_unidadmedida;
            productoAux.n_cliente = item.n_cliente;
            productoAux.c_tipoventa = item.c_tipoventa;
            productoAux.n_montocap = Number(item.n_montocap);
            productoAux.n_montoint = Number(item.n_montoint);
            productoAux.n_montototal = Number(item.n_montototal);
            productoAux.n_cantidad = Number(item.n_cantidad);
            productoAux.n_precio = Number(item.n_montototal) / Number(item.n_cantidad);
            productoAux.c_nombrescompleto = item.c_nombrescompleto;
            return productoAux;
        })
        return aux;
    }

    const handleRemate = async () => {
        setOpen(false);
        await setIsLoading(true);
        if(fechaRemate.value && observacionesRemate) {
            if(validateProductos()) {
                if(validaTipoVenta()) {
                    const [c_compania, c_prestamo] = elementId.split('-');
                    const data = {
                        c_compania: c_compania,
                        c_prestamo: c_prestamo,
                        c_usuarioRemate: userLogedIn,
                        d_fechaRemate: fechaRemate.value,
                        c_observacionesremate: observacionesRemate,
                        c_moneda: moneda,
                        productos: prepareProductsToRemate()
                    }
                    setIsAlert(false);
                    console.log("data", data);
                    const response = await cambiarEstadoRemate(data);
                    (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el préstamo a Remate") : prepareNotificationDanger("Error al actualizar", response.message);
                } else {
                    prepareNotificationDanger("Aviso", "El sistema no esta preparado aun para venta a tienda.");
                }
            } else {
                prepareNotificationDanger("Error", "Los campos de los productos de remate no estan llenos.");
            }
        } else {
            prepareNotificationDanger("Error", "Favor de llenar los campos activos");
        }
        setIsLoading(false);
    }

    const handleClick = async () => {
        if(urlFragment !== "visualizarPrestamo") {
            if(validate()) {
                setOpen(true);
                if(urlFragment === "nuevoPrestamo") setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"});
                if(urlFragment === "editarPrestamo") setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
                if(urlFragment === "anularPrestamo") setModalAttributes({title:"Aviso de anulación", message:"¿Seguro que desea cambiar el estado a anulado?"});
                if(urlFragment === "vigentePrestamo") setModalAttributes({title:"Aviso de vigente", message:"¿Seguro que desea cambiar el estado a vigente?"});
                if(urlFragment === "entregarPrestamo") setModalAttributes({title:"Aviso de entrega", message:"¿Seguro que desea cambiar el estado a entregado?"});
                if(urlFragment === "rematePrestamo") {
                    const [c_compania, c_prestamo] = elementId.split('-');
                    const response = await validarFechaRemate({c_compania: c_compania, c_prestamo: c_prestamo, d_fechaRemate: fechaRemate.value});
                    let message = '¿Seguro que desea cambiar el estado a remate?';
                    if(response.status !== 200) message = `${message} ${response.message ? response.message : ""}`
                    setModalAttributes({title:"Aviso de remate", message:message});
                }
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        }
    }

    const getData = async () => {
        const [c_compania, c_prestamo] = elementId.split('-');
        const response = await getPrestamoByCodigoPrestamo({c_compania:c_compania, c_prestamo:c_prestamo});
        if(response.status === 200) {
            const data = response.body.data;
            //Actualizar
            setCompania(data.c_compania);
            setNPrestamo({value:data.c_prestamo});
            setAgencia(data.c_agencia);
            setEstado(data.c_estado);
            setCodigoCliente(data.n_cliente);
            setNombreCliente(data.c_nombrescompleto);
            //setClienteSeleccionado();
            setTipoDocumento(data.c_tipodocumento);
            setNumeroDocumento({value:data.c_numerodocumento});
            setDireccion({value:data.c_direccioncliente});
            setPaisCodigo(data.c_paiscodigo);
            setDepartamentoCodigo(data.c_departamentocodigo);
            setProvinciaCodigo(data.c_provinciacodigo);
            setDistritoCodigo(data.c_distritocodigo);
            setTelefono({value:data.c_telefono1});
            setMoneda(data.c_monedaprestamo);
            setMontoPrestamo({value:Number(data.n_montoprestamo).toFixed(2), isValid:true});
            setTasaInteres({value:Number(data.n_tasainteres).toFixed(2), isValid:true});
            setMontoIntereses({value:Number(data.n_montointereses).toFixed(2)});
            setMontoTotalPrestamo({value:Number(data.n_montototalprestamo).toFixed(2)});
            setFechaDesembolso({value:moment(data.d_fechadesembolso).format('yyyy-MM-DD')});
            setPlazoDias({value:data.n_diasplazo, isValid:true});
            setFechaVencimiento({value:moment(data.d_fechavencimiento).format('yyyy-MM-DD')});
            setMontoInteresDiario({value:Number(data.n_montointeresesdiario).toFixed(4)});
            setObservacionesRegistro(data.c_observacionesregistro);
            //Recojo
            setPersonaRecoge({value:data.c_nombrepersonarecogio || ""});
            setTipoDocumentoEntrega(data.c_tipodocumentopr || "");
            setNumeroDocumentoEntrega({value:data.c_numerodocumentopr || ""});
            setObservacionesEntrega(data.c_observacionesentrega || "");
            setTelefonoEntrega({value:data.c_telefonopr || ""});
            setFechaEntrega({value:data.d_fechaentrega || ""})
            //Anulacion
            setObservacionesAnular(data.c_observacionesanula || "");
            //Remate
            setObservacionesRemate(data.c_observacionesremate || "");
            setFechaRemate({value:moment(data.d_fechaRemate).format('yyyy-MM-DD') || ""});
            //Vigente
            setObservacionesVigencia(data.c_observacionesvigente || "");
            //Auditoria
            setUsuarioRegistro(data.c_usuarioregistro);
            setFechaRegistro(moment(data.d_fecharegistro).format('DD/MM/yyy HH:mm:ss'));
            setUltimoUsuario(data.c_ultimousuario);
            setFechaModificacion(moment(data.d_ultimafechamodificacion).format('DD/MM/yyy HH:mm:ss'));
            setUsuarioRetornarPendiente(data.c_usuarioretornarpendiente);
            if(data.d_fecharetornarpendiente) setFechaRetornarPendiente(moment(data.d_fecharetornarpendiente).format('DD/MM/yyy HH:mm:ss'));
            setUsuarioVigente(data.c_usuariovigente);
            if(data.d_fechavigente) setFechaVigente(moment(data.d_fechavigente).format('DD/MM/yyy HH:mm:ss'));
            setUsuarioEntrega(data.c_usuarioEntrega);
            if(data.d_fechaEntregaUS) setFechaEntregaUS(moment(data.d_fechaEntregaUS).format('DD/MM/yyy HH:mm:ss'));
            setUsuarioRemate(data.c_usuarioRemate);
            if(data.d_fechaRemateUS) setFechaRemateUS(moment(data.d_fechaRemateUS).format('DD/MM/yyy HH:mm:ss'));
            setUsuarioAnulacion(data.c_usuarioanulacion);
            if(data.d_fechaanulacion) setFechaAnulacion(moment(data.d_fechaanulacion).format('DD/MM/yyy HH:mm:ss'));
            setUsuarioCancelacion(data.c_usuariocancelacion);
            if(data.d_fechacancelacion) setFechaCancelacion(moment(data.d_fechacancelacion).format('DD/MM/yyy HH:mm:ss'));
            if(data.c_usuariodesembolso) setUsuarioDesembolso(data.c_usuariodesembolso);

            const responseProducts = await getProductosByPrestamo({c_compania:c_compania, c_prestamo:c_prestamo});
            if( responseProducts && responseProducts.status === 200 && responseProducts.body.data ) setProductos(responseProducts.body.data);
        }else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    const findClienteByCode = async () => {
        setIsLoading(true);
        if(codigoCliente) {
            const response = await getClienteByCodigoCliente({c_compania:compania, n_cliente:codigoCliente});
            if(response && response.status === 200 && response.body.data) {
                setClienteSeleccionado(response.body.data);
            } else {
                setResponseData({title:"Aviso", message:"No hay un cliente con ese código"});
                setCodigoCliente("");
                setOpenResponseModal(true);
            }
        }
        setIsLoading(false);
    }

    const getParameters = async () => {
        const response = await listParametrosByCompania(elementId);
        if(response && response.status === 200) {
            const data = response.body.data;
            const tasaInteres = data.find((item) => item.c_parametrocodigo === "PACO000001");
            const plazoDias = data.find((item) => item.c_parametrocodigo === "PACO000002");
            setTasaInteres({value:Number(tasaInteres.n_valornumero).toFixed(2), isValid:true});
            setPlazoDias({value:parseInt(plazoDias.n_valornumero), isValid:true});
        }
    }

    const getAgencias = async () => {
        const companyCode = urlFragment === "nuevoPrestamo" ? elementId : elementId.split('-')[0];
        const response = await listAgencias({c_compania: companyCode});
        if(response && response.status === 200) setAgencias(response.body.data);
    }

    const getCompanias = async () => {
        const response = await listAllCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }

    const getTiposDocumento = async () => {
        const response = await listAllTiposDocumento();
        if(response && response.status === 200) setTiposDocumentos(response.body.data);
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

    const getUsuarios = async () => {
        const response = await listUsers();
        if(response && response.status === 200) setUsuarios(response.body.data);
        setUsuarioDesembolso(userLogedIn);
    }

    useEffect(async () => {
        await setIsLoading(true);
        if(urlFragment === "nuevoPrestamo") await getParameters();
        await getCompanias();
        await getAgencias();
        await getTiposDocumento();
        await getPaises();
        await getDepartamentos();
        await getProvincias();
        await getDistritos();
        if(urlFragment === "vigentePrestamo") await getUsuarios();
        setButtonAttributes(buttonTypes[urlFragment]);
        if(urlFragment !== "nuevoPrestamo") await getData();
        else setEstado("PE")
        setIsLoading(false);
    }, [])

    useEffect(() => {
        if(urlFragment === "nuevoPrestamo" && companias.length !== 0) setCompania(elementId);
    }, [companias])

    useEffect(() => {
        if(clienteSeleccionado) {
            setCodigoCliente(clienteSeleccionado.n_cliente);
            setNombreCliente(clienteSeleccionado.c_nombrescompleto);
            setNumeroDocumento({value: clienteSeleccionado.c_numerodocumento});
            setTipoDocumento(clienteSeleccionado.c_tipodocumento);
            setTelefono({value: clienteSeleccionado.c_telefono1});
            //setTipoDocumento(clienteSeleccionado.c_tipodocumento);
            setPaisCodigo(clienteSeleccionado.c_paiscodigo);
            setDepartamentoCodigo(clienteSeleccionado.c_departamentocodigo);
            setProvinciaCodigo(clienteSeleccionado.c_provinciacodigo);
            setDistritoCodigo(clienteSeleccionado.c_distritocodigo);
            setDireccion({value: clienteSeleccionado.c_direccion});
        }
    }, [clienteSeleccionado])

    useEffect(() => {
        const calc = Number(montoPrestamo.value) * Number(tasaInteres.value) / 100;
        setMontoIntereses({value:calc.toFixed(2)})
        setMontoTotalPrestamo({value:(Number(montoPrestamo.value) + calc).toFixed(2)})
    }, [montoPrestamo, tasaInteres])

    useEffect(() => {
        if(plazoDias.isValid && fechaDesembolso.value) {
            const fechaCalc = addDaysToDate(fechaDesembolso.value, plazoDias.value);
            setFechaVencimiento({value:fechaCalc});
        } else {

        }
    }, [plazoDias, fechaDesembolso])

    useEffect(() => {
        if( plazoDias.isValid && montoIntereses.value ) {
            setMontoInteresDiario({value: (Number(montoIntereses.value)/Number(plazoDias.value)).toFixed(4)});
        }
    }, [montoIntereses, plazoDias])

    useEffect(() => {
        if(tipoDocumentoEntrega) {
            const aux = tiposDocumentos.find((item) => item.c_tipodocumento === tipoDocumentoEntrega);
            setTipoDocumentoSelected(aux);
        }
    }, [tipoDocumentoEntrega])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification} showButton={urlFragment !== 'visualizarPrestamo'}
            goList={()=>history.push(`/prestamos`)} view={false}>
                <div className="row">
                    <ReactSelect
                        inputId="companiaCodeId"
                        labelText="Compañía"
                        placeholder="Seleccione un compañía"
                        valueSelected={compania}
                        data={companias}
                        handleElementSelected={setCompania}
                        optionField="c_descripcion"
                        valueField="c_compania"
                        disabledElement={true}
                        classForm="col-12 col-lg-6"
                    />
                    { urlFragment !== 'nuevoPrestamo' && <InputComponent
                        label="N° Prestamo"
                        state={nPrestamo}
                        setState={setNPrestamo}
                        type="text"
                        placeholder="N° Prestamo"
                        inputId="prestamoCodigoId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />}
                    <ReactSelect
                        inputId="agenciaCodeId"
                        labelText="Agencia"
                        placeholder="Seleccione un agencia"
                        valueSelected={agencia}
                        data={agencias}
                        handleElementSelected={setAgencia}
                        optionField="c_descripcion"
                        valueField="c_agencia"
                        disabledElement={readOnlyView}
                        classForm="col-12 col-lg-6"
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
                        classForm="col-12 col-lg-6"
                        disabledElement={true}
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
                        readOnlyCode={readOnlyView}
                        classForm="col-12 col-lg-6"
                        marginForm=""
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
                        disabledElement={true}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="N° documento"
                        state={numeroDocumento}
                        setState={setNumeroDocumento}
                        type="text"
                        placeholder="N° documento"
                        inputId="numeroDocumentoId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Dirección"
                        state={direccion}
                        setState={setDireccion}
                        type="text"
                        placeholder="Dirección"
                        inputId="direccionId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
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
                        disabledElement={true}
                        classForm="col-12 col-lg-6"
                    />
                    <ReactSelect
                        inputId="departamentoCodeId"
                        labelText="Departamento"
                        placeholder="Seleccione un Departamento"
                        valueSelected={departamentoCodigo}
                        data={departamentos}
                        handleElementSelected={setDepartamentoCodigo}
                        optionField="c_descripcion"
                        valueField="c_departamentocodigo"
                        disabledElement={true}
                        classForm="col-12 col-lg-6"
                    />
                    <ReactSelect
                        inputId="provinciaCodeId"
                        labelText="Provincia"
                        placeholder="Seleccione una Provincia"
                        valueSelected={provinciaCodigo}
                        data={provincias}
                        handleElementSelected={setProvinciaCodigo}
                        optionField="c_descripcion"
                        valueField="c_provinciacodigo"
                        disabledElement={true}
                        classForm="col-12 col-lg-6"
                    />
                    <ReactSelect
                        inputId="distritocodigoId"
                        labelText="Distrito"
                        placeholder="Seleccione una Distrito"
                        valueSelected={distritoCodigo}
                        data={distritos}
                        handleElementSelected={setDistritoCodigo}
                        optionField="c_descripcion"
                        valueField="c_distritocodigo"
                        disabledElement={true}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Teléfono"
                        state={telefono}
                        setState={setTelefono}
                        type="text"
                        placeholder="Teléfono"
                        inputId="telefonoId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />
                    <SelectComponent
                        labelText="Moneda"
                        defaultValue="Seleccione un moneda"
                        items={monedas}
                        selectId="monedaId"
                        valueField="value"
                        optionField="name"
                        valueSelected={moneda}
                        handleChange={setMoneda}
                        disabledElement={readOnlyView}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Monto Préstamo"
                        state={montoPrestamo}
                        setState={setMontoPrestamo}
                        type="number"
                        placeholder="Monto Préstamo"
                        inputId="montoPrestamoId"
                        validation="decimalNumber"
                        readOnly={readOnlyView}
                        classForm="col-12 col-lg-6"
                        fixedNumber={2}
                    />
                    <InputComponent
                        label="Tasa interés"
                        state={tasaInteres}
                        setState={setTasaInteres}
                        type="number"
                        placeholder="Tasa interés"
                        inputId="tasaInteresId"
                        validation="decimalNumber"
                        readOnly={readOnlyView}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Monto intereses"
                        state={montoIntereses}
                        setState={setMontoIntereses}
                        type="number"
                        placeholder="Tasa interés"
                        inputId="tasaInteresId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Mnt. Total P."
                        state={montoTotalPrestamo}
                        setState={setMontoTotalPrestamo}
                        type="number"
                        placeholder="Monto total préstamo"
                        inputId="montoTotalPrestamoId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="F. Desembolso"
                        state={fechaDesembolso}
                        setState={setFechaDesembolso}
                        type="date"
                        placeholder="Fecha desembolso"
                        inputId="fechaDesembolsoId"
                        readOnly={readOnlyView}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Plazo (días)"
                        state={plazoDias}
                        setState={setPlazoDias}
                        type="text"
                        placeholder="Plazo (días)"
                        inputId="plazoDiaId"
                        validation="number"
                        readOnly={readOnlyView}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="F. Vencimiento"
                        state={fechaVencimiento}
                        setState={setFechaVencimiento}
                        type="date"
                        placeholder="Fecha vencimiento"
                        inputId="fechaVencimientoId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Mnt. interés Diario"
                        state={montoInteresDiario}
                        setState={setMontoInteresDiario}
                        type="text"
                        placeholder="Mnt. interés Diario"
                        inputId="montoInteresDiarioId"
                        readOnly={true}
                        classForm="col-12 col-lg-6"
                    />
                    <TextareaComponent
                        inputId="observacionCreacionId"
                        label="Observaciones"
                        placeholder="Observaciones"
                        value={observacionesRegistro}
                        setState={setObservacionesRegistro}
                        max={500}
                        readOnly={readOnlyView}
                        classForm="col-12"
                        labelSpace={1}
                    />
                    {/*ANULAR*/}
                    <TextareaComponent
                        inputId="observacionAnularId"
                        label="Observaciones Anular"
                        placeholder="Observaciones Anular"
                        value={observacionesAnular}
                        setState={setObservacionesAnular}
                        max={500}
                        readOnly={urlFragment!=="anularPrestamo" ? true : false}
                        classForm="col-12"
                        labelSpace={1}
                    />
                    {/*VIGENCIA*/}
                    <TextareaComponent
                        inputId="observacionVigenciaId"
                        label="Observaciones Vigencia"
                        placeholder="Observaciones Vigencia"
                        value={observacionesVigencia}
                        setState={setObservacionesVigencia}
                        max={500}
                        readOnly={urlFragment!=="vigentePrestamo" ? true : false}
                        classForm="col-12"
                        labelSpace={1}
                    />
                    {urlFragment === "vigentePrestamo" ? <div className='col-12 m-0 p-0'>
                        <ReactSelect
                            inputId="usuarioDesembolsoId"
                            labelText="Usuario Desembolso"
                            placeholder="Seleccione un Usuario"
                            valueSelected={usuarioDesembolso}
                            data={usuarios}
                            handleElementSelected={setUsuarioDesembolso}
                            optionField="c_nombres"
                            valueField="c_codigousuario"
                            classForm="col-12 col-lg-6"
                            disabledElement={!modificaOperacionPermission}
                        />
                    </div>
                    : <div className='col-12 m-0 p-0'>
                        <InputComponentView
                            label="Usuario Desembolso"
                            state={usuarioDesembolso}
                            type="text"
                            placeholder="Usuario Desembolso"
                            inputId="nrccu"
                            readOnly={true}
                            classForm="col-12 col-lg-6"
                        />
                    </div>}
                    {/*ENTREGA*/}
                    <InputComponent
                        label="Persona recoge"
                        state={personaRecoge}
                        setState={setPersonaRecoge}
                        type="text"
                        placeholder="Persona recoge"
                        inputId="nombresId"
                        max={180}
                        readOnly={urlFragment!=="entregarPrestamo" ? true : false}
                        classForm="col-12 col-lg-6"
                    />
                    <SelectComponent
                        labelText="Tipo documento"
                        defaultValue="Seleccione un tipo documento"
                        items={tiposDocumentos}
                        selectId="tipoDocId"
                        valueField="c_tipodocumento"
                        optionField="c_descripcion"
                        valueSelected={tipoDocumentoEntrega}
                        handleChange={setTipoDocumentoEntrega}
                        disabledElement={urlFragment!=="entregarPrestamo" ? true : false}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="N° documento"
                        state={numeroDocumentoEntrega}
                        setState={setNumeroDocumentoEntrega}
                        type="text"
                        placeholder="N° documento"
                        inputId="numeroDocumentoEntregaId"
                        validation={urlFragment==="entregarPrestamo" ? "textNumber" : null}
                        max={tipoDocumentoSelected.n_numerodigitos === 0 ? 250 : tipoDocumentoSelected.n_numerodigitos}
                        min={tipoDocumentoSelected.n_numerodigitos === 0 ? 1 : tipoDocumentoSelected.n_numerodigitos}
                        readOnly={urlFragment!=="entregarPrestamo" ? true : false}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Teléfono"
                        state={telefonoEntrega}
                        setState={setTelefonoEntrega}
                        type="text"
                        placeholder="Teléfono"
                        inputId="telefonoId"
                        validation={urlFragment==="entregarPrestamo" ? "phone" : null}
                        max={20}
                        readOnly={urlFragment!=="entregarPrestamo" ? true : false}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="F. Entrega"
                        state={fechaEntrega}
                        setState={setFechaEntrega}
                        type="date"
                        placeholder="Fecha entrega"
                        inputId="fechaEntregaId"
                        readOnly={urlFragment!=="entregarPrestamo" ? true : false}
                        classForm="col-12 col-lg-6"
                    />
                    <TextareaComponent
                        inputId="observacionEntregaId"
                        label="Observaciones Entrega"
                        placeholder="Observaciones Entrega"
                        value={observacionesEntrega}
                        setState={setObservacionesEntrega}
                        max={500}
                        readOnly={urlFragment!=="entregarPrestamo" ? true : false}
                        classForm="col-12"
                        labelSpace={1}
                    />
                    {/*REMATE*/}
                    <InputComponent
                        label="F. Remate"
                        state={fechaRemate}
                        setState={setFechaRemate}
                        type="date"
                        placeholder="Fecha remate"
                        inputId="fechaRemateId"
                        readOnly={urlFragment!=="rematePrestamo" ? true : false}
                        classForm="col-12 col-lg-6"
                    />
                    <TextareaComponent
                        inputId="observacionRemateId"
                        label="Observaciones Remate"
                        placeholder="Observaciones Remate"
                        value={observacionesRemate}
                        setState={setObservacionesRemate}
                        max={500}
                        readOnly={urlFragment!=="rematePrestamo" ? true : false}
                        classForm="col-12"
                        labelSpace={1}
                    />
                    {
                        urlFragment === "rematePrestamo" &&
                        <AuctionProductsForm
                            productos={productos}
                            setProductos={setProductos}
                            compania={compania}
                            setIsLoading={setIsLoading}
                            elementId={elementId}
                        />
                    }
                    {/*Fin remate*/}
                    {/*GARANTIA*/}
                    { urlFragment!=="rematePrestamo" &&
                        <WarrantyProductsForm
                            productos={productos}
                            setProductos={setProductos}
                            userLogedIn={userLogedIn}
                            warrantyProductUpdateList={warrantyProductUpdateList}
                            setWarrantyProductUpdateList={setWarrantyProductUpdateList}
                            warrantyProductRemovalList={warrantyProductRemovalList}
                            setWarrantyProductRemovalList={setWarrantyProductRemovalList}
                            readOnly={urlFragment!=="nuevoPrestamo" && urlFragment!=="editarPrestamo"}
                            estado={estado}
                            elementId={elementId}
                        />
                    }
                    <HeaderForm title="Datos de auditoria"/>
                    <AuditTableComponent
                        c_usuarioregistro={usuarioRegistro}
                        d_fecharegistro={fechaRegistro}
                        c_ultimousuario={ultimoUsuario}
                        d_ultimafechamodificacion={fechaModificacion}
                        c_usuariovigente={usuarioVigente}
                        d_fechavigente={fechaVigente}
                        c_usuariocancelacion={usuarioCancelacion}
                        d_fechacancelacion={fechaCancelacion}
                        c_usuarioEntrega={usuarioEntrega}
                        d_fechaEntregaUS={fechaEntregaUS}
                        c_usuarioRemate={usuarioRemate}
                        d_fechaRemateUS={fechaRemateUS}
                        c_usuarioanulacion={usuarioAnulacion}
                        d_fechaanulacion={fechaAnulacion}
                        usuarioRetornarPendiente={usuarioRetornarPendiente}
                        fechaRetornarPendiente={fechaRetornarPendiente}
                    />
                </div>
            </FormContainer>
            {isLoading === true && <Loading/>}
            <ConfirmationModal
                isOpen={open}
                onClose={()=>setOpen(false)}
                title={modalAttributes.title}
                message={modalAttributes.message}
                onHandleFunction={formFunctions[urlFragment]}
            />
            <ResponseModal
                isOpen={openResponseModal}
                title={responseData.title}
                onClose={()=>setOpenResponseModal(false)}
                message={responseData.message}
                buttonLink={responseData.url}
                buttonLinkView={urlFragment === 'rematePrestamo' ? `/visualizarPrestamo/${elementId}` : ''}
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

export default PrestamoForm