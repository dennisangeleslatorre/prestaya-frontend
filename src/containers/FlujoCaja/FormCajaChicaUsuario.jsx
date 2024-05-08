import React, { useContext, useEffect, useState } from 'react'
import { Space, Button } from 'antd'
import { useHistory, useParams, useLocation } from 'react-router'
import { debounce } from 'lodash';
import moment from 'moment'
//Componentes
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import DateRangeComponent from '../../components/DateRangeComponent/DateRangeComponent'
import InputComponentView from '../../components/InputComponent/InputComponentView'
import TextareaComponent from '../../components/TextareaComponent/TextareaComponent'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
import SearchComponentTable from '../../components/SearchComponentTable/SearchComponentTable'
import FlujoCajaClonarDetalleModal from '../../components/FlujoCajaUsuarioModal/FlujoCajaClonarDetalleModal'
import HeaderForm from '../../components/HeaderForm/HeaderForm'
import InputComponent from '../../components/InputComponent/InputComponent'
//Context
import UserContext from '../../context/UserContext/UserContext'
import CajaContext from '../../context/CajaContext/CajaContext'
import PagesContext from '../../context/PagesContext/PagesContext'
//Librerias
import { listCompanias, listAgencias, listUsers, registerFlujoCaja, getFlujoCajaByCodigo, updateFlujoCaja, listTipoMovimientoCaja } from '../../Api/Api'

const monedas = [
  {value:"L" , name:"LOCAL" }, {value:"E" , name:"EXTERIOR" }
]

const estados = [
  {value:"A" , name:"ACTIVO" }, {value:"I" , name:"INACTIVO" }
]

const tiposCajaUsuario = [
  { name: 'BOVEDA', value: 'B' },
  { name: 'PERSONAL', value: 'P' }
]

const FormCajaChicaUsuario = () => {
    let history = useHistory();
    let location = useLocation();
    const urlFragment = location.pathname.split('/')[1];
    const { companycode, nrocorrelativo } = useParams();
    //Contexto
    const { flujoCaja, setFlujoCaja, setDetalleSeleccionado, detalles, setDetalles, auditoria, setAuditoria,
            eliminarDetalles, setEliminarDetalles, eliminarMovimientos, setEliminarMovimientos } = useContext(CajaContext);
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData().c_codigousuario;
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "USUARIO ACCESO TOTAL CAJA"
    });
    const usuarioAccesoTotalCajaPermiso = userPermisssions.includes("USUARIO ACCESO TOTAL CAJA");

    const deshabilitarUsuario = !usuarioAccesoTotalCajaPermiso ? true : (urlFragment !== "nuevaCajaChicaUsuario" ? true : false);

    //Estados del form
    const [companiaName, setCompaniaName] = useState("");
    const [agencia, setAgencia] = useState("");
    const [moneda, setMoneda] = useState("L");
    const [estado, setEstado] = useState("A");
    const [tipoCajaUsuario, setTipoCajaUsuario] = useState("P");
    const [usuarioCajaChica, setUsuarioCajaChica] = useState(userLogedIn);
    const [fechaMovimiento, setFechaMovimiento] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [observaciones, setObservaciones] = useState("");
    const [flagSaldoxDia, setFlagSaldoxDia] = useState("S");
    const [usuarioRegistro, setUsuarioRegistro] = useState("");
    const [fechaRegistro, setFechaRegistro] = useState("");
    const [montoMaximo, setMontoMaximo] = useState({value: 0});
    const [flagRestrinMonto, setFlagRestrinMonto] = useState("N")
    const [usuarioModiciacion, setUsuarioModiciacion] = useState("");
    const [fechaModiciacion, setFechaModiciacion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal ] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [openClonarModal, setOpenClonarModal] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [flujoCajaForm, setFlujoCajaForm] = useState({});
    const [openAlertConfirmationModal, setOpenAlertConfirmationModal] = useState(false);
    const [diasMontoExcedido, setDiasMontoExcedido] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);
    //Estados de las listas
    const [companias, setCompanias] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [tiposMovimientos, setTiposMovimientos] = useState([]);
    //Estadostablas
    const [flujosCajaDetalleTabla, setFlujosCajaDetalleTabla] = useState([]);
    //Atributos de la tabla
    const rowSelection = {
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
        }
    };
    //Funciones de selecion
    const handleSeleccionarCompania = () => {
        setCompaniaName(companias.find(item => item.c_compania === companycode).c_descripcion);
        //Deberia buscar las agencias de la compañía
        getAgenciasByCompany(companycode);

    }

    const prepareNotificationSuccess = (message) => {
        setResponseData({message: message, title: "Operación exitosa", url:"/flujousuarios"});
        setDetalles([]);
        setEliminarDetalles([]);
        setEliminarMovimientos([]);
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setResponseData({title:title, message:message})
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    const validateGeneralData = () => {
        if(companiaName && agencia && usuarioCajaChica && fechaMovimiento.isValid) return true;
        return false;
    }

    const validateDetailDateRange = () => {
        let fechaInicio = moment(flujoCajaForm.general.d_fechaInicioMov);
        let fechaFin= moment(flujoCajaForm.general.d_fechaFinMov);
        let areValidDates = true;
        detalles.forEach(item => {
            const fechaDetalle = moment(item.general.d_fechamov);
            if(!fechaDetalle.isBetween(fechaInicio, fechaFin, "days", "[]")) areValidDates = false;
        });
        return areValidDates;
    }

    const getUpdateAndNewDetails = () => {
        let newDetails = [];
        let updateDetails = [];
        detalles.forEach(item => {
            if(item.general.d_fecharegistro) {
                updateDetails = [...updateDetails, item];
            } else {
                newDetails = [...newDetails, item];
            }
        });
        return {
            newDetails, updateDetails
        }
    }

    const prepareNewDetailsToSend = (nuevosDetalles) => {
        return [...nuevosDetalles].map(detalle => `'${detalle.general.d_fechamov}','${detalle.general.c_estado}','${detalle.general.c_observaciones}','${userLogedIn}','${userLogedIn}','${detalle.general.n_montomaximofc}','${detalle.general.c_flagrestringexmtomax}'??${detalle.movimientos.map(movimiento => `'${movimiento.d_fechamov}','${movimiento.c_tipomovimientocc}',${movimiento.c_usuariomovimiento ? "'"+movimiento.c_usuariomovimiento+"'" : null },'${movimiento.c_observaciones}','${movimiento.n_montoxdiamov}','${userLogedIn}','${userLogedIn}','${movimiento.c_flagxconfirmar}',${movimiento.c_agenciaotra ? "'"+movimiento.c_agenciaotra+"'" : null }`)
        .reduce((acc,cv)=>`${acc}//${cv}`)}`)
        .reduce((acc,cv)=>`${acc}||${cv}`);
    }

    const prepareUpdateDetailsToSend = (updateDetails) => {
        const updatedDetails = [...updateDetails].filter(detalle => detalle.general.is_updated === true);
        if(updatedDetails.length > 0) {
            return updatedDetails.map( detalle => {
                let detalleFormat = `'${moment(detalle.general.d_fechamov).format("yyyy-MM-DD HH:mm:ss")}','${detalle.general.c_estado}','${detalle.general.c_observaciones}','${detalle.general.n_montomaximofc}','${detalle.general.c_flagrestringexmtomax}'`;
                let movimientosDetail = detalle.movimientos;
                const nuevosMovimientos = movimientosDetail.filter(movimiento => !movimiento.d_fecharegistro);
                let newMovimientos = nuevosMovimientos.length > 0 ?
                nuevosMovimientos.map(mov => `'${mov.d_fechamov}','${mov.c_tipomovimientocc}',${mov.c_usuariomovimiento ? "'"+mov.c_usuariomovimiento+"'" : null },'${mov.c_observaciones}','${mov.n_montoxdiamov}','${userLogedIn}','${userLogedIn}','${mov.c_flagxconfirmar}',${mov.c_agenciaotra ? "'"+mov.c_agenciaotra+"'" : null }`).reduce((acc, cv) => `${acc}//${cv}`)
                : "'-'";
                const actualizarMovimientos = movimientosDetail.filter(movimiento => movimiento.d_fecharegistro && movimiento.is_updated === true);
                let updateMovimientos = actualizarMovimientos.length > 0 ? actualizarMovimientos.map(mov => `'${mov.n_secuencia}';;'${mov.c_tipomovimientocc}';;${mov.c_usuariomovimiento ? "'"+mov.c_usuariomovimiento+"'" : null };;'${mov.c_observaciones}';;'${mov.n_montoxdiamov}';;'${mov.c_flagxconfirmar}';;'${userLogedIn}';;${mov.c_agenciaotra ? "'"+mov.c_agenciaotra+"'" : null }`).reduce((acc, cv) => `${acc}//${cv}`)
                : "'-'";
                return `${detalleFormat}??${newMovimientos}??${updateMovimientos}`
            }).reduce((acc,cv)=>`${acc}||${cv}`);
        }
        return '';
    }

    const prepareDeleteDetailsToSend = (removeDetails) => {
        return [...removeDetails].map(detalle => `'${moment(detalle.d_fechamov).format("yyyy-MM-DD HH:mm:ss")}'`).reduce((acc, cv) => `${acc}//${cv}`);
    }

    const prepareDeleteMovimientosToSend = () => {
        return [...eliminarMovimientos].map(mov => `'${moment(mov.d_fechamov).format("yyyy-MM-DD HH:mm:ss")}','${mov.n_secuencia}'`).reduce((acc, cv) => `${acc}//${cv}`);
    }

    const validateSaldo = () => {
        let validSaldo = true;
        if(flujoCajaForm.general.c_flagsaldoxdia === 'N') {
            let saldo = 0.00;
            detalles.forEach(det => {
                det.movimientos.forEach(mov => {
                    saldo = (Number(saldo) + ( ( tiposMovimientos.find(tipo => tipo.c_tipomovimientocc === mov.c_tipomovimientocc).c_clasetipomov === "S" ? -1 : 1 ) * Number(mov.n_montoxdiamov) )).toFixed(2);
                })
            })
            if(Number(saldo) < 0.00) {
                validSaldo = false;
            }

        } else if (flujoCajaForm.general.c_flagsaldoxdia === 'S') {
            detalles.forEach(det => {
                let saldo = 0.00;
                det.movimientos.forEach(mov => {
                    saldo = (Number(saldo) + ( ( tiposMovimientos.find(tipo => tipo.c_tipomovimientocc === mov.c_tipomovimientocc).c_clasetipomov === "S" ? -1 : 1 ) * Number(mov.n_montoxdiamov) )).toFixed(2);
                })
                if(Number(saldo) < 0.00) {
                    validSaldo = false;
                }
            })
        }
        return validSaldo;
    }

    const actualizarFC = debounce( async () => {
        setOpenAlertConfirmationModal(false);
        const flujoCajaToSend = {
            c_compania: flujoCajaForm.general.c_compania,
            n_correlativo: nrocorrelativo,
            c_agencia: flujoCajaForm.general.c_agencia,
            c_tipofcu: flujoCajaForm.general.c_tipofcu,
            c_usuariofcu: flujoCajaForm.general.c_usuariofcu,
            d_fechaInicioMov: flujoCajaForm.general.d_fechaInicioMov,
            d_fechaFinMov: flujoCajaForm.general.d_fechaFinMov,
            c_monedafcu: flujoCajaForm.general.c_monedafcu,
            c_estado: flujoCajaForm.general.c_estado,
            c_observaciones: flujoCajaForm.general.c_observaciones,
            c_ultimousuario: userLogedIn,
            c_flagsaldoxdia: flujoCajaForm.general.c_flagsaldoxdia,
            n_montomaximofc: flujoCajaForm.general.n_montomaximofc,
            c_flagrestringexmtomax: flujoCajaForm.general.c_flagrestringexmtomax

        }
        const { newDetails, updateDetails } = getUpdateAndNewDetails();
        const nuevosDetallesToSend = newDetails.length > 0 ?  prepareNewDetailsToSend(newDetails) : "";
        const actualizarDetallesToSend = updateDetails.length > 0 ? prepareUpdateDetailsToSend(updateDetails) : "";
        const eliminarDetallesToSend = eliminarDetalles.length > 0 ? prepareDeleteDetailsToSend(eliminarDetalles) :"";
        const eliminarMovimientosToSend = eliminarMovimientos.length > 0 ? prepareDeleteMovimientosToSend() : "";
        const response = await updateFlujoCaja({flujoCaja:flujoCajaToSend, nuevosDetalles: nuevosDetallesToSend, actualizarDetalles:actualizarDetallesToSend, eliminarDetalles:eliminarDetallesToSend, eliminarMovimientos:eliminarMovimientosToSend});
        (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el flujo de caja") : prepareNotificationDanger("Error al actualizar", response.message);
    }, 2000 );

    const handleActualizarFlujo = () => {
        setDisabledButton(true);
        setIsLoading(true);
        if(flujoCajaForm.general.c_usuariofcu === userLogedIn || usuarioAccesoTotalCajaPermiso) {
            if(validateGeneralData() && detalles && detalles.length > 0) {
                if(validateDetailDateRange()) {
                    const isValidoSaldo = validateSaldo();
                    if(isValidoSaldo) {
                        const detalleNoValidos = validaMontoMaximo();
                        const detallesNoValidosRestringe = detalleNoValidos.filter(det => det.restringe === "S");
                        const detallesNoValidosNoRestringe = detalleNoValidos.filter(det => det.restringe === "N");
                        if(detalleNoValidos.length === 0) {
                            actualizarFC();
                        } else if (detallesNoValidosRestringe.length > 0) {
                            const detMessage = detallesNoValidosRestringe.map(det => moment(det.d_fechamov).format("DD/MM/yyyy")).reduce((acc, cv) => acc + ", " + cv)
                            setResponseData({title:"Aviso", message:"El monto máximo es restrictivo para los detalles: " + detMessage })
                            setOpenResponseModal(true);
                            setIsLoading(false);
                        } else {
                            const detMessage = detallesNoValidosNoRestringe.map(det => moment(det.d_fechamov).format("DD/MM/yyyy")).reduce((acc, cv) => acc + ", " + cv);
                            setDiasMontoExcedido(detMessage)
                            setOpenAlertConfirmationModal(true);
                            setIsLoading(false);
                        }
                    } else {
                        prepareNotificationDanger("Aviso", `El cálculo del saldo por ${flujoCajaForm.general.c_flagsaldoxdia === 'S' ? 'DÍA' : 'CAJA'} es negativo.`);
                    }
                } else {
                    prepareNotificationDanger("Aviso", "Hay al menos una fecha de movimiento que no cumple con el rango de fecha inicio y fin.");
                }
            } else {
                prepareNotificationDanger("Aviso", "Debes llenar los campos del formulario superior y tener almenos un detalle.");
            }
        } else {
            prepareNotificationDanger("Aviso", "El usuario no tiene permisos para modificar una caja de un usuario diferente.");
        }
        setTimeout(()=>{
            setDisabledButton(false);
        }, 2000)
    };

    const validaMontoMaximo = () => {
        let detalleNoValidos = [];
        const fc = {
            c_flagsaldoxdia: flujoCajaForm.general.c_flagsaldoxdia,
            n_montomaximofc: flujoCajaForm.general.n_montomaximofc,
            c_flagrestringexmtomax: flujoCajaForm.general.c_flagrestringexmtomax
        }

        if (flujoCajaForm.general.c_flagsaldoxdia === 'S') {
            detalles.forEach(det => {
                console.log("de", det)
                let saldoDia = 0.00;
                det.movimientos.forEach(mov => {
                    saldoDia = (Number(saldoDia) + ( ( tiposMovimientos.find(tipo => tipo.c_tipomovimientocc === mov.c_tipomovimientocc).c_clasetipomov === "S" ? -1 : 1 ) * Number(mov.n_montoxdiamov) )).toFixed(2);
                })

                let fcd = {
                    n_montomaximofc: det.general.n_montomaximofc,
                    c_flagrestringexmtomax: det.general.c_flagrestringexmtomax
                }

                if(Number(fcd.n_montomaximofc) > 0 && Number(fcd.n_montomaximofc) < saldoDia) {
                    detalleNoValidos.push({d_fechamov: det.general.d_fechamov, restringe: fcd.general.c_flagrestringexmtomax});
                }
                else if(Number(fc.n_montomaximofc) > 0 && Number(fc.n_montomaximofc) < saldoDia) {
                    detalleNoValidos.push({d_fechamov: det.general.d_fechamov, restringe: fc.c_flagrestringexmtomax});
                }
            })
        }
        return detalleNoValidos;
    }

    const registrarFC = debounce( async () => {
        setOpenAlertConfirmationModal(false);
        const flujoCajaToSend = {
            c_compania: flujoCajaForm.general.c_compania,
            c_agencia: flujoCajaForm.general.c_agencia,
            c_tipofcu: flujoCajaForm.general.c_tipofcu,
            c_usuariofcu: flujoCajaForm.general.c_usuariofcu,
            d_fechaInicioMov: flujoCajaForm.general.d_fechaInicioMov,
            d_fechaFinMov: flujoCajaForm.general.d_fechaFinMov,
            c_monedafcu: flujoCajaForm.general.c_monedafcu,
            c_estado: flujoCajaForm.general.c_estado,
            c_observaciones: flujoCajaForm.general.c_observaciones,
            c_usuarioregistro: userLogedIn,
            c_flagsaldoxdia:flujoCajaForm.general.c_flagsaldoxdia,
            n_montomaximofc: flujoCajaForm.general.n_montomaximofc,
            c_flagrestringexmtomax: flujoCajaForm.general.c_flagrestringexmtomax
        }
        const detailsToSend = prepareNewDetailsToSend(detalles);
        const response = await registerFlujoCaja({flujoCaja:flujoCajaToSend, detalles: detailsToSend});
        (response && response.status === 200) ? prepareNotificationSuccess("Se registró con éxito el préstamo") : prepareNotificationDanger("Error al registrar", response.message);
    }, 2000 );

    const handleRegistrarFlujo = async () => {
        setDisabledButton(true);
        setIsLoading(true);
        if(flujoCajaForm.general.c_usuariofcu === userLogedIn || usuarioAccesoTotalCajaPermiso) {
            if(validateGeneralData() && detalles && detalles.length > 0) {
                if(validateDetailDateRange()) {
                    const isValidoSaldo = validateSaldo();
                    if(isValidoSaldo) {
                        const detalleNoValidos = validaMontoMaximo();
                        const detallesNoValidosRestringe = detalleNoValidos.filter(det => det.restringe === "S");
                        const detallesNoValidosNoRestringe = detalleNoValidos.filter(det => det.restringe === "N");
                        if(detalleNoValidos.length === 0) {
                            registrarFC();
                        } else if (detallesNoValidosRestringe.length > 0) {
                            const detMessage = detallesNoValidosRestringe.map(det => moment(det.d_fechamov).format("DD/MM/yyyy")).reduce((acc, cv) => acc + ", " + cv)
                            setResponseData({title:"Aviso", message:"El monto máximo es restrictivo para los detalles: " + detMessage })
                            setOpenResponseModal(true);
                            setIsLoading(false);
                        } else {
                            const detMessage = detallesNoValidosNoRestringe.map(det => moment(det.d_fechamov).format("DD/MM/yyyy")).reduce((acc, cv) => acc + ", " + cv);
                            setDiasMontoExcedido(detMessage)
                            setOpenAlertConfirmationModal(true);
                            setIsLoading(false);
                        }
                    } else {
                        prepareNotificationDanger("Aviso", `El cálculo del saldo por ${flujoCajaForm.general.c_flagsaldoxdia === 'S' ? 'DÍA' : 'CAJA'} es negativo.`);
                    }
                } else {
                    prepareNotificationDanger("Aviso", "Hay al menos una fecha de movimiento que no cumple con el rango de fecha inicio y fin.");
                }
            } else {
                prepareNotificationDanger("Aviso", "Debes llenar los campos del formulario superior y tener almenos un detalle.");
            }
        }  else {
            prepareNotificationDanger("Aviso", "El usuario no tiene permisos para crear una caja para un usuario diferente.");
        }
        setTimeout(()=>{
            setDisabledButton(false);
        }, 2000)
    };

    const handleCancelar = () => {
        setDetalleSeleccionado({general:{}, movimientos:[], firstArrival:true});
        setDetalles([]);
        setEliminarDetalles([]);
        setEliminarMovimientos([]);
        history.push(`/flujousuarios`);
    }

    const handleSelectNuevo = () => {
        if(validateGeneralData()) {
            setFlujoCaja(flujoCajaForm);
            setDetalleSeleccionado({general:{
                c_compania:flujoCaja.general.c_compania
            }, movimientos:[]});
            history.push(`/nuevaCUxDiaMovimiento/${companycode}`);
        } else {
            prepareNotificationDanger("Aviso", "Debes llenar los campos del formulario superior.");
        }
    }

    const handleSelectActualizar = () => {
        if(selectedRowKeys.length > 0 && detalles && detalles.length > 0) {
            setFlujoCaja(flujoCajaForm);
            const detalleAux = detalles[Number(selectedRowKeys[0])-1];
            setDetalleSeleccionado({...detalleAux, index: Number(selectedRowKeys[0])-1});
            history.push(`/actualizarCUxDiaMovimiento/${companycode}`);
        } else {
            prepareNotificationDanger("Aviso", "Selecciona un item de la tabla.");
        }
    }

    const handleSelectDelete = () => {
        if(selectedRowKeys.length > 0) {
            const detalleAux = detalles[Number(selectedRowKeys[0])-1];
            let validDelete = true;
            detalleAux.movimientos.forEach(item => {
                if(item.c_prestamo || item.c_flagconfirmado === 'S') validDelete = false;
            })
            if(validDelete) {
                setOpenConfirmationModal(true);
            } else {
                prepareNotificationDanger("Aviso", "No puedes eliminar un dia con un movimiento generado en el flujo de prestamos o que este confirmado.");
            }
        } else {
            prepareNotificationDanger("Aviso", "Selecciona un item de la tabla.");
        }
    }

    const handleSelectClonar = () => {
        if(selectedRowKeys.length > 0) {
            setFlujoCaja(flujoCajaForm);
            const detalleAux = detalles[Number(selectedRowKeys[0])-1];
            let validDelete = true;
            detalleAux.movimientos.forEach(item => {
                if(item.c_prestamo || item.c_flagconfirmado === 'S') validDelete = false;
            })
            if(validDelete) {
                setDetalleSeleccionado({...detalleAux, index: Number(selectedRowKeys[0])-1});
                setOpenClonarModal(true);
            } else {
                prepareNotificationDanger("Aviso", "No puedes clonar un dia con un movimiento generado en el flujo de prestamos o que este confirmado.");
            }
        } else {
            prepareNotificationDanger("Aviso", "Selecciona un item de la tabla.");
        }
    }

    const handleEliminar = () => {
        setOpenConfirmationModal(false);
        const detalleAux = JSON.parse(JSON.stringify(detalles))
        .filter((item, index) => {
            if (index !== Number(selectedRowKeys[0])-1){
                return item;
            } else {
                if(item.general.d_fecharegistro) {
                    setEliminarDetalles([...eliminarDetalles, item.general]);
                }
            }
        });
        setDetalles(detalleAux);
    }

    const getCompanias =  async () => {
        const response = await listCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }

    const getAgenciasByCompany = async (companyCode) => {
        const response = await listAgencias({c_compania: companyCode});
        if(response && response.status === 200 && response.body.data) setAgencias(response.body.data);
    }

    const getUsuarios = async () => {
        const response = await listUsers();
        if(response && response.status === 200) setUsuarios(response.body.data);
    }

    const getTiposMovimientoCaja = async () => {
        const response = await listTipoMovimientoCaja();
        if(response && response.status === 200) {
            setTiposMovimientos(response.body.data);
        };
    }

    const refreshList = () => {
        if(tiposMovimientos.length > 0) {
            const tableData = JSON.parse(JSON.stringify(detalles)).map((item, index) => {
                let aux = item.general;
                aux.key = index+1;
                aux.d_fechamov_format = moment(item.general.d_fechamov).format("DD/MM/yyyy");
                aux.c_estado_desc = item.general.c_estado === "A" ? "ABIERTO" : "CERRADO";
                aux.d_fecharegistro = item.general.d_fecharegistro ? moment(item.general.d_fecharegistro).format("DD/MM/yyyy HH:MM:ss") : "";
                aux.d_ultimafechamodificacion = item.general.d_ultimafechamodificacion ? moment(item.general.d_ultimafechamodificacion).format("DD/MM/yyyy HH:MM:ss") : "";
                aux.saldodia = 0;
                item.movimientos.forEach(mov => {
                    const tipoMov = tiposMovimientos.find(tipo => tipo.c_tipomovimientocc === mov.c_tipomovimientocc);
                    aux.saldodia = aux.saldodia + Number(mov.n_montoxdiamov ?  ( Number(mov.n_montoxdiamov) * (tipoMov.c_clasetipomov === "I" ? 1 : -1) ) : 0);
                })
                return aux;
            });
            setFlujosCajaDetalleTabla(tableData);
        }
    }

    //Obtener datos del contexto
    const getDataContext = () => {
        setAgencia(flujoCaja.general.c_agencia);
        setTipoCajaUsuario(flujoCaja.general.c_tipofcu);
        setUsuarioCajaChica(flujoCaja.general.c_usuariofcu);
        setFechaMovimiento({fechaInicio:flujoCaja.general.d_fechaInicioMov , fechaFin:flujoCaja.general.d_fechaFinMov, isValid:true});
        setMoneda(flujoCaja.general.c_monedafcu);
        setEstado(flujoCaja.general.c_estado);
        setObservaciones(flujoCaja.general.c_observaciones);
        setFlagSaldoxDia(flujoCaja.general.c_flagsaldoxdia);
        setMontoMaximo({value: Number(flujoCaja.general.n_montomaximofc).toFixed(2)});
        setFlagRestrinMonto(flujoCaja.general.c_flagrestringexmtomax)
        if(urlFragment === "actualizarCajaChicaUsuario") {
            setUsuarioRegistro(auditoria.c_usuarioregistro);
            setFechaRegistro(auditoria.d_fecharegistro);
            setUsuarioModiciacion(auditoria.c_ultimousuario);
            setFechaModiciacion(auditoria.d_ultimafechamodificacion);
        }
        refreshList();
    }

    //Trae la data registrada de un servicio si es que no tiene
    const getServiceData = async () => {
        const response = await getFlujoCajaByCodigo({c_compania: companycode, n_correlativo: nrocorrelativo});
        if (response && response.status === 200) {
            const data = response.body.data;
            setAuditoria({
                c_usuarioregistro: data.general.c_usuarioregistro,
                d_fecharegistro: moment(data.general.d_fecharegistro).format('DD/MM/yyyy HH:mm:ss'),
                c_ultimousuario: data.general.c_ultimousuario,
                d_ultimafechamodificacion: moment(data.general.d_ultimafechamodificacion).format('DD/MM/yyyy HH:mm:ss')
            });
            setDetalles(data.detalles);
            setAgencia(data.general.c_agencia);
            setTipoCajaUsuario(data.general.c_tipofcu);
            setUsuarioCajaChica(data.general.c_usuariofcu);
            setFechaMovimiento({fechaInicio:moment(data.general.d_fechaInicioMov).format('yyyy-MM-DD'), fechaFin:moment(data.general.d_fechaFinMov).format('yyyy-MM-DD'), isValid:true});
            setMoneda(data.general.c_monedafcu);
            setEstado(data.general.c_estado);
            setObservaciones(data.general.c_observaciones);
            setUsuarioRegistro(data.general.c_usuarioregistro);
            setFechaRegistro(moment(data.general.d_fecharegistro).format('DD/MM/yyyy HH:mm:ss'));
            setUsuarioModiciacion(data.general.c_ultimousuario);
            setFechaModiciacion(moment(data.general.d_ultimafechamodificacion).format('DD/MM/yyyy HH:mm:ss'));
            setFlagSaldoxDia(data.general.c_flagsaldoxdia);
            setMontoMaximo({value: Number(data.general.n_montomaximofc).toFixed(2)});
            setFlagRestrinMonto(data.general.c_flagrestringexmtomax)
        } else {
            prepareNotificationDanger("Error", response.message);
        }
    }

    const getData = async () => {
        if(companias.find(item => item.c_compania === companycode)) {
            handleSeleccionarCompania();
            if(!flujoCaja.firstArrival) {
                getDataContext();
            } else {
                if(urlFragment === "actualizarCajaChicaUsuario") {
                    getServiceData();
                }
            }
        } else {
            prepareNotificationDanger("Aviso", "La compañía seleccionada no se encuentra activa.");
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setFlujoCajaForm({
            ...flujoCaja,
            general: {
                c_compania:companycode,
                companiaName: companiaName,
                c_agencia:agencia,
                c_monedafcu:moneda,
                c_estado:estado,
                c_tipofcu:tipoCajaUsuario,
                c_usuariofcu:usuarioCajaChica,
                d_fechaInicioMov:fechaMovimiento.fechaInicio,
                d_fechaFinMov:fechaMovimiento.fechaFin,
                c_observaciones:observaciones,
                n_correlativo:nrocorrelativo,
                c_flagsaldoxdia:flagSaldoxDia,
                n_montomaximofc:montoMaximo.value,
                c_flagrestringexmtomax:flagRestrinMonto
            }
        })
    }, [companycode, companiaName, agencia, moneda, estado, tipoCajaUsuario, usuarioCajaChica, fechaMovimiento, observaciones, flagSaldoxDia, montoMaximo, flagRestrinMonto])

    useEffect(async () => {
        if(companias.length>0 && tiposMovimientos.length > 0) await getData();
    }, [companias, tiposMovimientos])

    useEffect(() => {
        refreshList();
    }, [detalles])

    useEffect( async () => {
        await setIsLoading(true);
        await getTiposMovimientoCaja();
        await getCompanias();
        await getUsuarios();
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
                                      valueSelected={companycode}
                                      data={companias}
                                      handleElementSelected={()=>{}}
                                      optionField="c_descripcion"
                                      valueField="c_compania"
                                      classForm="col-12 col-lg-6"
                                      marginForm="ml-0"
                                      disabledElement={true}
                                  />
                                  <InputComponentView
                                      label="Nro CCU"
                                      state={ nrocorrelativo }
                                      setState={()=>{}}
                                      type="text"
                                      placeholder="Nro CCU"
                                      inputId="nrccu"
                                      readOnly={true}
                                      classForm="col-12 col-lg-6"
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
                                      classForm="col-12 col-lg-6"
                                      marginForm="ml-0"
                                      disabledElement={urlFragment !== "nuevaCajaChicaUsuario" }
                                  />
                                  <SelectComponent
                                      labelText="Moneda"
                                      defaultValue="Seleccione una moneda"
                                      items={monedas}
                                      selectId="estadoId"
                                      valueField="value"
                                      optionField="name"
                                      valueSelected={moneda}
                                      handleChange={setMoneda}
                                      classForm="col-12 col-lg-6"
                                      marginForm="ml-0"
                                  />
                                  <SelectComponent
                                      labelText="Estados"
                                      defaultValue="Seleccione un estado"
                                      items={estados}
                                      selectId="estadoId"
                                      valueField="value"
                                      optionField="name"
                                      valueSelected={estado}
                                      handleChange={setEstado}
                                      classForm="col-12 col-lg-6"
                                      marginForm="ml-0"
                                  />
                                  <SelectComponent
                                      labelText="Tipo Caja"
                                      defaultValue="Seleccione un tipo"
                                      items={tiposCajaUsuario}
                                      selectId="tipoCajaId"
                                      valueField="value"
                                      optionField="name"
                                      valueSelected={tipoCajaUsuario}
                                      handleChange={setTipoCajaUsuario}
                                      classForm="col-12 col-lg-6"
                                      marginForm="ml-0"
                                  />
                                  <ReactSelect
                                      inputId="usuarioCodeId"
                                      labelText="Usuario"
                                      placeholder="Seleccione un Usuario"
                                      valueSelected={usuarioCajaChica}
                                      data={usuarios}
                                      handleElementSelected={setUsuarioCajaChica}
                                      optionField="c_nombres"
                                      valueField="c_codigousuario"
                                      classForm="col-12 col-lg-6"
                                      marginForm="ml-0"
                                      disabledElement={deshabilitarUsuario}
                                  />
                                  <DateRangeComponent
                                      inputId="fechaMovimientoId"
                                      labelText="Fecha de movimiento"
                                      state={fechaMovimiento}
                                      setState={setFechaMovimiento}
                                      enabled={false}
                                      classForm="col-12 col-lg-6"
                                      marginForm="ml-0"
                                  />
                                  <SelectComponent
                                      labelText="Saldo Caja por:"
                                      defaultValue="Seleccione"
                                      items={[{value:"S", name:"DIA"},{value:"N", name:"CAJA"}]}
                                      selectId="flagSaldoxDiaId"
                                      valueField="value"
                                      optionField="name"
                                      valueSelected={flagSaldoxDia}
                                      handleChange={setFlagSaldoxDia}
                                      classForm="col-12 col-lg-6"
                                      marginForm="ml-0"
                                      disabledElement={!usuarioAccesoTotalCajaPermiso}
                                  />
                                  <InputComponent
                                    label="Monto Max fc"
                                    state={montoMaximo}
                                    setState={setMontoMaximo}
                                    type="number"
                                    placeholder="Monto Max fc"
                                    inputId="montoMaxFcId"
                                    classForm="col-12 col-lg-6"
                                    marginForm="ml-0"
                                    readOnly={!usuarioAccesoTotalCajaPermiso}
                                  />
                                  <SelectComponent
                                      labelText="Flag restrin monto"
                                      defaultValue="Seleccione"
                                      items={[{value:"S", option:"SI"},{value:"N", option:"NO"}]}
                                      selectId="flagRestinMontoId"
                                      valueField="value"
                                      optionField="option"
                                      valueSelected={flagRestrinMonto}
                                      handleChange={setFlagRestrinMonto}
                                      classForm="col-12 col-lg-6"
                                      marginForm="ml-0"
                                      disabledElement={!usuarioAccesoTotalCajaPermiso}
                                  />
                                  <TextareaComponent
                                      inputId="observacionCreacionId"
                                      label="Observaciones"
                                      placeholder="Observaciones"
                                      value={observaciones}
                                      setState={setObservaciones}
                                      max={500}
                                      readOnly={false}
                                      classForm="col-12"
                                      labelLine={true}
                                      marginForm="ml-0"
                                  />
                              </div>
                              <div className="col-12 mb-3 text-center">
                                    <button
                                        onClick={urlFragment === "nuevaCajaChicaUsuario" ? handleRegistrarFlujo : handleActualizarFlujo}
                                        className="btn btn-light btn-form"
                                        disabled={disabledButton}
                                    >
                                        Guardar
                                    </button>
                                    <button onClick={handleCancelar} className="btn btn-light btn-form ml-md-3">Cancelar</button>
                              </div>
                              <HeaderForm title="Datos de auditoria"/>
                              <div className="col-12 table-responsive">
                                <table className="table b-table table-bordered b-table-fixed">
                                  <tbody>
                                    <tr>
                                        <td className='header-data'>Usuario Registro</td>
                                        <td className='header-label'>{usuarioRegistro}</td>
                                        <td className='header-data'>Fecha Registro</td>
                                        <td className='header-data'>{fechaRegistro}</td>
                                    </tr>
                                    <tr>
                                        <td className='header-data'>Último Usuario</td>
                                        <td className='header-label'>{usuarioModiciacion}</td>
                                        <td className='header-data'>Fecha Modificación</td>
                                        <td className='header-data'>{fechaModiciacion}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col">
                                  <Space size={[10, 3]} wrap style={{ marginBottom: 16 }}>
                                      <Button onClick={handleSelectNuevo}>NUEVO</Button>
                                      <Button onClick={handleSelectActualizar}>MODIFICAR</Button>
                                      <Button onClick={handleSelectDelete}>ELIMINAR</Button>
                                      { urlFragment === "actualizarCajaChicaUsuario" && <Button onClick={handleSelectClonar}>CLONAR</Button> }
                                  </Space>
                              </div>
                          </div>
                          <div className="row">
                              <div className="col" style={{ overflow: 'scroll' }}>
                                  <SearchComponentTable
                                    flujosCajaDetalleTabla={flujosCajaDetalleTabla}
                                    rowSelection={rowSelection}
                                    selectedRowKeys ={selectedRowKeys}
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
            buttonLink={responseData.url}
            showCloseButton={false}
        />
        <ConfirmationModal
            isOpen={openConfirmationModal}
            onClose={()=>setOpenConfirmationModal(false)}
            title={"Aviso de eliminación"}
            message={"¿Seguro que desea eliminar este elemento?. Una vez eliminado no podrás recuperarlo."}
            onHandleFunction={()=>handleEliminar()}
            buttonClass="btn-danger"
        />
        <FlujoCajaClonarDetalleModal
            isOpen={openClonarModal}
            onClose={()=>setOpenClonarModal(false)}
        />
        <ConfirmationModal
            isOpen={openAlertConfirmationModal}
            onClose={()=>setOpenAlertConfirmationModal(false)}
            title={"Aviso de operación"}
            message={"¿Seguro que desea continuar con esta operación?. Se ha excedido el monto maximo del dia. " + diasMontoExcedido}
            onHandleFunction={() => urlFragment === "nuevaCUxDiaMovimiento" ? registrarFC() : actualizarFC()}
            buttonClass="btn-danger"
        />
    </>
  )
}

export default FormCajaChicaUsuario