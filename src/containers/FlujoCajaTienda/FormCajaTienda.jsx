import React, { useContext, useEffect, useState } from "react";
import { Space, Button } from "antd";
import { useHistory, useParams, useLocation } from "react-router";
import moment from "moment";
import { debounce } from "lodash";
//Componentes
import ReactSelect from "../../components/ReactSelect/ReactSelect";
import SelectComponent from "../../components/SelectComponent/SelectComponent";
import DateRangeComponent from "../../components/DateRangeComponent/DateRangeComponent";
import InputComponentView from "../../components/InputComponent/InputComponentView";
import TextareaComponent from "../../components/TextareaComponent/TextareaComponent";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import ResponseModal from "../../components/Modal/ResponseModal";
import Loading from "../../components/Modal/LoadingModal";
import SearchComponentTable from "../../components/SearchComponentTable/SearchComponentTable";
import HeaderForm from "../../components/HeaderForm/HeaderForm";
//Context
import UserContext from "../../context/UserContext/UserContext";
import CajaTiendaContext from "../../context/CajaTiendaContext/CajaTiendaContext";
import PagesContext from "../../context/PagesContext/PagesContext";
//Servicios
import {
  listCompanias,
  listAgencias,
  listUsers,
  registerFlujoTienda,
  getFlujoCajaTiendaByCodigo,
  updateFlujoTienda,
  listTipoMovimientoCajaTienda,
} from "../../Api/Api";
//Enums
import { monedas, estados } from "../../enums/general";
import { tiposCajaTienda } from "./config/FlujoCajaTienda";
import WrapperForm from "./components/WrapperForm";

const FormCajaTienda = () => {
  let history = useHistory();
  let location = useLocation();
  const urlFragment = location.pathname.split("/")[1];
  const { companycode, nrocorrelativo } = useParams();
  const {
    flujoCajaTienda,
    setFlujoCajaTienda,
    setDetalleSeleccionado,
    detalles,
    setDetalles,
    auditoria,
    setAuditoria,
    eliminarDetalles,
    setEliminarDetalles,
    eliminarMovimientos,
    setEliminarMovimientos,
  } = useContext(CajaTiendaContext);
  const { getUserData } = useContext(UserContext);
  const userLogedIn = getUserData().c_codigousuario;
  const { getPagesKeysForUser } = useContext(PagesContext);
  const userPermisssions = getPagesKeysForUser().filter((item) => {
    return item === "USUARIO ACCESO TOTAL CAJA TIENDA";
  });
  const usuarioAccesoTotalCajaPermiso = userPermisssions.includes(
    "USUARIO ACCESO TOTAL CAJA TIENDA"
  );
  const deshabilitarUsuario = !usuarioAccesoTotalCajaPermiso
    ? true
    : urlFragment !== "nuevaCajaTienda"
    ? true
    : false;

  //Estados del form
  const [companiaName, setCompaniaName] = useState("");
  const [agencia, setAgencia] = useState("");
  const [moneda, setMoneda] = useState("L");
  const [estado, setEstado] = useState("A");
  const [tipoCajaUsuario, setTipoCajaUsuario] = useState("B");
  const [usuarioCajaChica, setUsuarioCajaChica] = useState(userLogedIn);
  const [fechaMovimiento, setFechaMovimiento] = useState({
    fechaInicio: "",
    fechaFin: "",
    isValid: false,
  });
  const [observaciones, setObservaciones] = useState("");
  const [usuarioRegistro, setUsuarioRegistro] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState("");
  const [usuarioModiciacion, setUsuarioModiciacion] = useState("");
  const [fechaModiciacion, setFechaModiciacion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [openResponseModal, setOpenResponseModal] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [flujoCajaForm, setFlujoCajaForm] = useState({});
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
    },
  };
  //Funciones de selecion
  const handleSeleccionarCompania = () => {
    setCompaniaName(
      companias.find((item) => item.c_compania === companycode).c_descripcion
    );
    //Deberia buscar las agencias de la compañía
    getAgenciasByCompany(companycode);
  };

  const prepareNotificationSuccess = (message) => {
    setResponseData({
      message: message,
      title: "Operación exitosa",
      url: "/flujocajatienda",
    });
    setDetalles([]);
    setEliminarDetalles([]);
    setEliminarMovimientos([]);
    setOpenResponseModal(true);
    setIsLoading(false);
  };

  const prepareNotificationDanger = (
    title,
    message = "Error al consumir el servicio."
  ) => {
    setResponseData({ title: title, message: message });
    setOpenResponseModal(true);
    setIsLoading(false);
  };

  const validateGeneralData = () => {
    if (companiaName && agencia && usuarioCajaChica && fechaMovimiento.isValid)
      return true;
    return false;
  };

  const validateDetailDateRange = () => {
    let fechaInicio = moment(flujoCajaForm.general.d_fechainiciomov);
    let fechaFin = moment(flujoCajaForm.general.d_fechafinmov);
    let areValidDates = true;
    detalles.forEach((item) => {
      const fechaDetalle = moment(item.general.d_fechamov);
      if (!fechaDetalle.isBetween(fechaInicio, fechaFin, "days", "[]"))
        areValidDates = false;
    });
    return areValidDates;
  };

  const getUpdateAndNewDetails = () => {
    let newDetails = [];
    let updateDetails = [];
    detalles.forEach((item) => {
      if (item.general.d_fecharegistro) {
        updateDetails = [...updateDetails, item];
      } else {
        newDetails = [...newDetails, item];
      }
    });
    return {
      newDetails,
      updateDetails,
    };
  };

  const prepareNewDetailsToSend = (nuevosDetalles) => {
    return nuevosDetalles.map((detalle) => {
      const nuevoDetalle = {
        d_fechamov: detalle.general.d_fechamov,
        c_estado: detalle.general.c_estado,
        c_observaciones: detalle.general.c_observaciones,
      };
      nuevoDetalle.listdetallediamov = detalle.movimientos.map((mov) => {
        const nuevoMovimiento = {
          c_tipomovimientoctd: mov.c_tipomovimientoctd,
          c_observaciones: mov.c_observaciones,
          n_montoxdiamov: Number(mov.n_montoxdiamov),
          c_flagtransaccion: mov.c_flagtransaccion
            ? mov.c_flagtransaccion
            : "N",
        };
        if (mov.c_usuariomovimiento)
          nuevoMovimiento.c_usuariomovimiento = mov.c_usuariomovimiento;
        return nuevoMovimiento;
      });
      return nuevoDetalle;
    });
  };

  const prepareUpdateDetailsToSend = (updateDetails) => {
    const updatedDetails = [...updateDetails].filter(
      (detalle) => detalle.general.is_updated === true
    );
    if (updatedDetails.length > 0) {
      return updatedDetails.map((detalle) => {
        let detailToUpdate = {
          d_fechamov: moment(detalle.general.d_fechamov).format("yyyy-MM-DD"),
          c_estado: detalle.general.c_estado,
          c_observaciones: detalle.general.c_observaciones,
        };
        const movimientosDetail = detalle.movimientos;
        const nuevosMovimientos = movimientosDetail.filter(
          (movimiento) => !movimiento.d_fecharegistro
        );
        const newMovimientosFormateado =
          nuevosMovimientos.length > 0
            ? nuevosMovimientos.map((mov) => {
                let newMov = {
                  c_tipomovimientoctd: mov.c_tipomovimientoctd,
                  c_observaciones: mov.c_observaciones,
                  n_montoxdiamov: Number(mov.n_montoxdiamov),
                  c_flagtransaccion: mov.c_flagtransaccion
                    ? mov.c_flagtransaccion
                    : "N",
                };
                if (mov.c_usuariomovimiento)
                  newMov.c_usuariomovimiento = mov.c_usuariomovimiento;
                return newMov;
              })
            : [];
        detailToUpdate.listdetallediamovinsert = newMovimientosFormateado;

        const actualizarMovimientos = movimientosDetail.filter(
          (movimiento) =>
            movimiento.d_fecharegistro && movimiento.is_updated === true
        );
        let updateMovimientos =
          actualizarMovimientos.length > 0
            ? actualizarMovimientos.map((mov) => {
                let updateMov = {
                  n_secuencia: mov.n_secuencia,
                  c_tipomovimientoctd: mov.c_tipomovimientoctd,
                  c_usuariomovimiento: mov.c_usuariomovimiento,
                  c_observaciones: mov.c_observaciones,
                  n_montoxdiamov: Number(mov.n_montoxdiamov),
                  c_flagtransaccion: mov.c_flagtransaccion,
                };
                if (mov.c_tipodocumento)
                  updateMov.c_tipodocumento = mov.c_tipodocumento;
                if (mov.c_numerodocumento)
                  updateMov.c_numerodocumento = mov.c_numerodocumento;
                return updateMov;
              })
            : [];
        detailToUpdate.listdetallediamovupdt = updateMovimientos;
        return detailToUpdate;
      });
    }
    return [];
  };

  const prepareDeleteDetailsToSend = (removeDetails) => {
    return [...removeDetails].map((detalle) => ({
      d_fechamov: moment(detalle.d_fechamov).format("yyyy-MM-DD"),
    }));
  };

  const prepareDeleteMovimientosToSend = () => {
    return [...eliminarMovimientos].map((mov) => ({
      d_fechamov: moment(mov.d_fechamov).format("yyyy-MM-DD"),
      n_secuencia: mov.n_secuencia,
    }));
  };

  const validateSaldo = () => {
    let validSaldo = true;
    let saldo = 0.0;
    detalles.forEach((det) => {
      det.movimientos.forEach((mov) => {
        saldo = (
          Number(saldo) +
          (tiposMovimientos.find(
            (tipo) => tipo.c_tipomovimientoctd === mov.c_tipomovimientoctd
          ).c_clasetipomov === "S"
            ? -1
            : 1) *
            Number(mov.n_montoxdiamov)
        ).toFixed(2);
      });
    });
    if (Number(saldo) < 0.0) {
      validSaldo = false;
    }
    return validSaldo;
  };

  const prepararDatosGenerales = () => {
    return {
      c_compania: flujoCajaForm.general.c_compania,
      c_agencia: flujoCajaForm.general.c_agencia,
      c_tipofctienda: flujoCajaForm.general.c_tipofctienda,
      c_usuariofctienda: flujoCajaForm.general.c_usuariofctienda,
      d_fechainiciomov: flujoCajaForm.general.d_fechainiciomov,
      d_fechafinmov: flujoCajaForm.general.d_fechafinmov,
      c_monedafctienda: flujoCajaForm.general.c_monedafctienda,
      c_estado: flujoCajaForm.general.c_estado,
      c_observaciones: flujoCajaForm.general.c_observaciones,
    };
  };

  const actualizarFC = debounce(async () => {
    const flujoCajaToSend = prepararDatosGenerales();
    flujoCajaToSend.n_correlativo = Number(nrocorrelativo);
    flujoCajaToSend.c_ultimousuario = userLogedIn;
    const { newDetails, updateDetails } = getUpdateAndNewDetails();
    const nuevosDetallesToSend =
      newDetails.length > 0 ? prepareNewDetailsToSend(newDetails) : [];
    flujoCajaToSend.nuevosDetalles = nuevosDetallesToSend;
    console.log("nuevosDetallesToSend", nuevosDetallesToSend);
    const actualizarDetallesToSend =
      updateDetails.length > 0 ? prepareUpdateDetailsToSend(updateDetails) : [];
    flujoCajaToSend.actualizarDetalles = actualizarDetallesToSend;
    console.log("actualizarDetallesToSend", actualizarDetallesToSend);
    const eliminarDetallesToSend =
      eliminarDetalles.length > 0
        ? prepareDeleteDetailsToSend(eliminarDetalles)
        : null;
    flujoCajaToSend.eliminarDetalles = eliminarDetallesToSend;
    console.log("eliminarDetalles", eliminarDetalles);
    const eliminarMovimientosToSend =
      eliminarMovimientos.length > 0 ? prepareDeleteMovimientosToSend() : null;
    flujoCajaToSend.eliminarMovimientos = eliminarMovimientosToSend;
    console.log("eliminarMovimientos", eliminarMovimientos);
    console.log("flujoCajaToSend", flujoCajaToSend);
    const response = await updateFlujoTienda(flujoCajaToSend);
    (response && response.status === 200) ? prepareNotificationSuccess("Se actualizó con éxito el flujo de caja") : prepareNotificationDanger("Error al actualizar", response.message);
  }, 2000);

  const handleActualizarFlujo = () => {
    setDisabledButton(true);
    setIsLoading(true);
    if (flujoCajaForm.general.c_usuariofctienda === userLogedIn) {
      if (validateGeneralData() && detalles && detalles.length > 0) {
        if (validateDetailDateRange()) {
          const isValidoSaldo = validateSaldo();
          if (isValidoSaldo) {
            actualizarFC();
          } else {
            prepareNotificationDanger(
              "Aviso",
              `El cálculo del saldo por caja es negativo.`
            );
          }
        } else {
          prepareNotificationDanger(
            "Aviso",
            "Hay al menos una fecha de movimiento que no cumple con el rango de fecha inicio y fin."
          );
        }
      } else {
        prepareNotificationDanger(
          "Aviso",
          "Debes llenar los campos del formulario superior y tener almenos un detalle."
        );
      }
    } else {
      prepareNotificationDanger(
        "Aviso",
        "El usuario no tiene permisos para crear una caja para un usuario diferente."
      );
    }
    setTimeout(() => {
      setDisabledButton(false);
    }, 2000);
  };

  const registrarFC = debounce(async () => {
    const flujoCajaToSend = prepararDatosGenerales();
    flujoCajaToSend.c_usuarioregistro = userLogedIn;
    flujoCajaToSend.listdetalledia = prepareNewDetailsToSend(detalles);
    const response = await registerFlujoTienda(flujoCajaToSend);
    response && response.status === 200
      ? prepareNotificationSuccess("Se registró con éxito el préstamo")
      : prepareNotificationDanger("Error al registrar", response.message);
  }, 2000);

  const handleRegistrarFlujo = async () => {
    setDisabledButton(true);
    setIsLoading(true);
    if (flujoCajaForm.general.c_usuariofctienda === userLogedIn) {
      if (validateGeneralData() && detalles && detalles.length > 0) {
        if (validateDetailDateRange()) {
          const isValidoSaldo = validateSaldo();
          if (isValidoSaldo) {
            registrarFC();
          } else {
            prepareNotificationDanger(
              "Aviso",
              `El cálculo del saldo por caja es negativo.`
            );
          }
        } else {
          prepareNotificationDanger(
            "Aviso",
            "Hay al menos una fecha de movimiento que no cumple con el rango de fecha inicio y fin."
          );
        }
      } else {
        prepareNotificationDanger(
          "Aviso",
          "Debes llenar los campos del formulario superior y tener almenos un detalle."
        );
      }
    } else {
      prepareNotificationDanger(
        "Aviso",
        "El usuario no tiene permisos para crear una caja para un usuario diferente."
      );
    }
    setTimeout(() => {
      setDisabledButton(false);
    }, 2000);
  };

  const handleCancelar = () => {
    setDetalleSeleccionado({
      general: {},
      movimientos: [],
      firstArrival: true,
    });
    setDetalles([]);
    setEliminarDetalles([]);
    setEliminarMovimientos([]);
    history.push(`/flujocajatienda`);
  };

  const handleSelectNuevo = () => {
    if (validateGeneralData()) {
      setFlujoCajaTienda(flujoCajaForm);
      setDetalleSeleccionado({
        general: {
          c_compania: flujoCajaTienda.general.c_compania,
        },
        movimientos: [],
      });
      history.push(`/nuevaCajaTiendaDiaMovimientos/${companycode}`);
    } else {
      prepareNotificationDanger(
        "Aviso",
        "Debes llenar los campos del formulario superior."
      );
    }
  };

  const handleSelectActualizar = () => {
    if (selectedRowKeys.length > 0 && detalles && detalles.length > 0) {
      setFlujoCajaTienda(flujoCajaForm);
      const detalleAux = detalles[Number(selectedRowKeys[0]) - 1];
      setDetalleSeleccionado({
        ...detalleAux,
        index: Number(selectedRowKeys[0]) - 1,
      });
      history.push(`/actualizarCajaTiendaDiaMovimientos/${companycode}`);
    } else {
      prepareNotificationDanger("Aviso", "Selecciona un item de la tabla.");
    }
  };

  const handleSelectDelete = () => {
    if (selectedRowKeys.length > 0) {
      const detalleAux = detalles[Number(selectedRowKeys[0]) - 1];
      let validDelete = true;
      detalleAux.movimientos.forEach((item) => {
        if (item.c_flagtransaccion === "S") validDelete = false;
      });
      if (validDelete) {
        setOpenConfirmationModal(true);
      } else {
        prepareNotificationDanger(
          "Aviso",
          "No puedes eliminar un dia con un movimiento generado en el flujo de transacciones."
        );
      }
    } else {
      prepareNotificationDanger("Aviso", "Selecciona un item de la tabla.");
    }
  };

  // const handleSelectClonar = () => {
  //   if (selectedRowKeys.length > 0) {
  //     setFlujoCajaTienda(flujoCajaForm);
  //     const detalleAux = detalles[Number(selectedRowKeys[0]) - 1];
  //     let validDelete = true;
  //     detalleAux.movimientos.forEach((item) => {
  //       if (item.c_flagtransaccion === "S") validDelete = false;
  //     });
  //     if (validDelete) {
  //       setDetalleSeleccionado({
  //         ...detalleAux,
  //         index: Number(selectedRowKeys[0]) - 1,
  //       });
  //       setOpenClonarModal(true);
  //     } else {
  //       prepareNotificationDanger(
  //         "Aviso",
  //         "No puedes clonar un dia con un movimiento generado en el flujo de transacciones."
  //       );
  //     }
  //   } else {
  //     prepareNotificationDanger("Aviso", "Selecciona un item de la tabla.");
  //   }
  // };

  const handleEliminar = () => {
    setOpenConfirmationModal(false);
    const detalleAux = JSON.parse(JSON.stringify(detalles)).filter(
      (item, index) => {
        if (index !== Number(selectedRowKeys[0]) - 1) {
          return item;
        } else {
          if (item.general.d_fecharegistro) {
            setEliminarDetalles([...eliminarDetalles, item.general]);
          }
        }
      }
    );
    setDetalles(detalleAux);
  };

  const getCompanias = async () => {
    const response = await listCompanias();
    if (response && response.status === 200) setCompanias(response.body.data);
  };

  const getAgenciasByCompany = async (companyCode) => {
    const response = await listAgencias({ c_compania: companyCode });
    if (response && response.status === 200 && response.body.data)
      setAgencias(response.body.data);
  };

  const getUsuarios = async () => {
    const response = await listUsers();
    if (response && response.status === 200) setUsuarios(response.body.data);
  };

  const getTiposMovimientoCaja = async () => {
    const response = await listTipoMovimientoCajaTienda();
    if (response && response.status === 200) {
      setTiposMovimientos(response.body.data);
    }
  };

  const refreshList = () => {
    if (tiposMovimientos.length > 0) {
      const tableData = JSON.parse(JSON.stringify(detalles)).map(
        (item, index) => {
          let aux = item.general;
          aux.key = index + 1;
          aux.d_fechamov_format = moment(item.general.d_fechamov).format(
            "DD/MM/yyyy"
          );
          aux.c_estado_desc =
            item.general.c_estado === "A" ? "ABIERTO" : "CERRADO";
          aux.d_fecharegistro = item.general.d_fecharegistro
            ? moment(item.general.d_fecharegistro).format("DD/MM/yyyy HH:MM:ss")
            : "";
          aux.d_ultimafechamodificacion = item.general.d_ultimafechamodificacion
            ? moment(item.general.d_ultimafechamodificacion).format(
                "DD/MM/yyyy HH:MM:ss"
              )
            : "";
          aux.saldodia = 0;
          item.movimientos.forEach((mov) => {
            const tipoMov = tiposMovimientos.find(
              (tipo) => tipo.c_tipomovimientoctd === mov.c_tipomovimientoctd
            );
            aux.saldodia =
              aux.saldodia +
              Number(
                mov.n_montoxdiamov
                  ? Number(mov.n_montoxdiamov) *
                      (tipoMov.c_clasetipomov === "I" ? 1 : -1)
                  : 0
              );
          });
          return aux;
        }
      );
      setFlujosCajaDetalleTabla(tableData);
    }
  };

  const setDatosGenerales = (data) => {
    setAgencia(data.general.c_agencia);
    setTipoCajaUsuario(data.general.c_tipofctienda);
    setUsuarioCajaChica(data.general.c_usuariofctienda);
    setFechaMovimiento({
      fechaInicio: data.general.d_fechainiciomov,
      fechaFin: data.general.d_fechafinmov,
      isValid: true,
    });
    setMoneda(data.general.c_monedafctienda);
    setEstado(data.general.c_estado);
    setObservaciones(data.general.c_observaciones);
  };

  //Obtener datos del contexto
  const getDataContext = () => {
    setDatosGenerales(flujoCajaTienda);
    if (urlFragment === "actualizarCajaTienda") {
      setUsuarioRegistro(auditoria.c_usuarioregistro);
      setFechaRegistro(auditoria.d_fecharegistro);
      setUsuarioModiciacion(auditoria.c_ultimousuario);
      setFechaModiciacion(auditoria.d_ultimafechamodificacion);
    }
    refreshList();
  };

  //Trae la data registrada de un servicio si es que no tiene
  const getServiceData = async () => {
    const response = await getFlujoCajaTiendaByCodigo({
      c_compania: companycode,
      n_correlativo: nrocorrelativo,
    });
    if (response && response.status === 200) {
      const data = response.body.data;
      setAuditoria({
        c_usuarioregistro: data.general.c_usuarioregistro,
        d_fecharegistro: moment(data.general.d_fecharegistro).format(
          "DD/MM/yyyy HH:mm:ss"
        ),
        c_ultimousuario: data.general.c_ultimousuario,
        d_ultimafechamodificacion: moment(
          data.general.d_ultimafechamodificacion
        ).format("DD/MM/yyyy HH:mm:ss"),
      });
      setDatosGenerales(data);
      setDetalles(data.detalles);
      setUsuarioRegistro(data.general.c_usuarioregistro);
      setFechaRegistro(
        moment(data.general.d_fecharegistro).format("DD/MM/yyyy HH:mm:ss")
      );
      setUsuarioModiciacion(data.general.c_ultimousuario);
      setFechaModiciacion(
        moment(data.general.d_ultimafechamodificacion).format(
          "DD/MM/yyyy HH:mm:ss"
        )
      );
    } else {
      prepareNotificationDanger("Error", response.message);
    }
  };

  const getData = async () => {
    if (companias.find((item) => item.c_compania === companycode)) {
      handleSeleccionarCompania();
      if (!flujoCajaTienda.firstArrival) {
        getDataContext();
      } else {
        if (urlFragment === "actualizarCajaTienda") {
          getServiceData();
        }
      }
    } else {
      prepareNotificationDanger(
        "Aviso",
        "La compañía seleccionada no se encuentra activa."
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setFlujoCajaForm({
      ...flujoCajaTienda,
      general: {
        c_compania: companycode,
        companiaName: companiaName,
        c_agencia: agencia,
        c_monedafctienda: moneda,
        c_estado: estado,
        c_tipofctienda: tipoCajaUsuario,
        c_usuariofctienda: usuarioCajaChica,
        d_fechainiciomov: fechaMovimiento.fechaInicio,
        d_fechafinmov: fechaMovimiento.fechaFin,
        c_observaciones: observaciones,
        n_correlativo: nrocorrelativo,
      },
    });
  }, [
    companycode,
    companiaName,
    agencia,
    moneda,
    estado,
    tipoCajaUsuario,
    usuarioCajaChica,
    fechaMovimiento,
    observaciones,
  ]);

  useEffect(async () => {
    if (companias.length > 0 && tiposMovimientos.length > 0) await getData();
  }, [companias, tiposMovimientos]);

  useEffect(() => {
    refreshList();
  }, [detalles]);

  useEffect(async () => {
    await setIsLoading(true);
    await getTiposMovimientoCaja();
    await getCompanias();
    await getUsuarios();
  }, []);

  return (
    <>
      <WrapperForm>
        <div className="row">
          <div className="row col-12 col-md-12">
            <ReactSelect
              inputId="companiaCodeId"
              labelText="Compañía"
              placeholder="Seleccione un compañía"
              valueSelected={companycode}
              data={companias}
              handleElementSelected={() => {}}
              optionField="c_descripcion"
              valueField="c_compania"
              classForm="col-12 col-lg-6"
              marginForm="ml-0"
              disabledElement={true}
            />
            <InputComponentView
              label="Nro CCU"
              state={nrocorrelativo}
              setState={() => {}}
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
              disabledElement={urlFragment !== "nuevaCajaTienda"}
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
              labelText="Tipo Caja tienda"
              defaultValue="Seleccione un tipo"
              items={tiposCajaTienda}
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
              onClick={
                urlFragment === "nuevaCajaTienda"
                  ? handleRegistrarFlujo
                  : handleActualizarFlujo
              }
              className="btn btn-light btn-form"
              disabled={disabledButton}
            >
              Guardar
            </button>
            <button
              onClick={handleCancelar}
              className="btn btn-light btn-form ml-md-3"
            >
              Cancelar
            </button>
          </div>
          <HeaderForm title="Datos de auditoria" />
          <div className="col-12 table-responsive">
            <table className="table b-table table-bordered b-table-fixed">
              <tbody>
                <tr>
                  <td className="header-data">Usuario Registro</td>
                  <td className="header-label">{usuarioRegistro}</td>
                  <td className="header-data">Fecha Registro</td>
                  <td className="header-data">{fechaRegistro}</td>
                </tr>
                <tr>
                  <td className="header-data">Último Usuario</td>
                  <td className="header-label">{usuarioModiciacion}</td>
                  <td className="header-data">Fecha Modificación</td>
                  <td className="header-data">{fechaModiciacion}</td>
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
            </Space>
          </div>
        </div>
        <div className="row">
          <div className="col" style={{ overflow: "scroll" }}>
            <SearchComponentTable
              flujosCajaDetalleTabla={flujosCajaDetalleTabla}
              rowSelection={rowSelection}
              selectedRowKeys={selectedRowKeys}
            />
          </div>
        </div>
      </WrapperForm>
      {isLoading === true && <Loading />}
      <ResponseModal
        isOpen={openResponseModal}
        title={responseData.title}
        onClose={() => setOpenResponseModal(false)}
        message={responseData.message}
        buttonLink={responseData.url}
        showCloseButton={false}
      />
      <ConfirmationModal
        isOpen={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        title={"Aviso de eliminación"}
        message={
          "¿Seguro que desea eliminar este elemento?. Una vez eliminado no podrás recuperarlo."
        }
        onHandleFunction={() => handleEliminar()}
        buttonClass="btn-danger"
      />
    </>
  );
};

export default FormCajaTienda;
