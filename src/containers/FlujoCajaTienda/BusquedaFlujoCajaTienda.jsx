import React, { useContext, useEffect, useState } from "react";
import { Table, Space, Button, Tooltip } from "antd";
import { useHistory } from "react-router";
import moment from "moment";
// Componentes
import ReactSelect from "../../components/ReactSelect/ReactSelect";
import SelectComponent from "../../components/SelectComponent/SelectComponent";
import DateRangeComponent from "../../components/DateRangeComponent/DateRangeComponent";
import ResponseModal from "../../components/Modal/ResponseModal";
import Loading from "../../components/Modal/LoadingModal";

//Context
import PagesContext from "../../context/PagesContext/PagesContext";
import UserContext from "../../context/UserContext/UserContext";
import CajaTiendaContext from "../../context/CajaTiendaContext/CajaTiendaContext";
import FiltersContext from "../../context/FiltersContext/FiltersContext";
// Data
import {
  listCompanias,
  listAgenciesByUserAndCompany,
  listUsers,
} from "../../Api/Api";
import { separator } from "../../utilities/Functions/FormatNumber";
import {
  columns,
  estadosCajaTienda,
  tiposCajaTienda,
} from "./config/FlujoCajaTienda";
import FlujoCajaDetalleModal from "./components/FlujoCajaDetalleModal";
import FlujoCajaDetalleMovimientosModal from "./components/FlujoCajaDetalleMovimientosModal";

const BusquedaFlujoCajaTienda = () => {
  let history = useHistory();
  //Contexto
  const { getUserData } = useContext(UserContext);
  const userLogedIn = getUserData().c_codigousuario;
  const {
    setParamsForFilterFlujoCajaTienda,
    getParamsForFilterFlujoCajaTienda,
  } = useContext(FiltersContext);
  const {
    setFlujoCajaTienda,
    setDetalles,
    setEliminarDetalles,
    setEliminarMovimientos,
  } = useContext(CajaTiendaContext);
  const { getPagesKeysForUser } = useContext(PagesContext);
  const userPermisssions = getPagesKeysForUser().filter((item) => {
    return (
      item === "NUEVA CAJA TIENDA" ||
      item === "MODIFICAR CAJA TIENDA"
    );
  });
  const registerPermission = userPermisssions.includes("NUEVA CAJA TIENDA");
  const updatePermission = userPermisssions.includes("MODIFICAR CAJA TIENDA");
  //Estados del form
  const [compania, setCompania] = useState("");
  const [agencia, setAgencia] = useState("T");
  const [estado, setEstado] = useState("T");
  const [tipoCajaTienda, setTipoCajaTienda] = useState("B");
  const [usuarioFlujoCajaTienda, setUsuarioFlujoCajaTienda] = useState("T");
  const [fechaRegistro, setFechaRegistro] = useState({
    fechaInicio: "",
    fechaFin: "",
    isValid: false,
  });
  const [enabledFechaRegistro, setEnabledFechaRegistro] = useState(true);
  const [fechaMovimiento, setFechaMovimiento] = useState({
    fechaInicio: "",
    fechaFin: "",
    isValid: false,
  });
  const [enabledFechaMovimiento, setEnabledFechaMovimiento] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [openResponseModal, setOpenResponseModal] = useState(false);
  const [openModalDetalleFlujoCaja, setOpenModalDetalleFlujoCaja] =
    useState(false);
  const [
    openModalDetalleFlujoCajaMovimientos,
    setOpenModalDetalleFlujoCajaMovimientos,
  ] = useState(false);
  const [elementSelected, setElementSelected] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemFlujoCajaSelected, setItemFlujoCajaSelected] = useState({
    c_compania: "",
    n_correlativo: "",
  });
  const [itemFlujoCajaDetalleSelected, setItemFlujoCajaDetalleSelected] =
    useState({ c_compania: "", n_correlativo: "", d_fechamov: "" });
  //Estados de las listas
  const [companias, setCompanias] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  //Estadostablas
  const [flujosCajaTiendaTabla, setFlujosCajaTiendaTabla] = useState([]);
  //Atributos de la tabla
  const rowSelection = {
    onChange: (selectedKeys, selectedRows) => {
      setElementSelected(selectedRows);
      setSelectedRowKeys(selectedKeys);
    },
  };
  //Funciones de selecion
  const handleSeleccionarCompania = (value) => {
    setCompania(value);
    //Deberia buscar las agencias de la compañía
    getAgenciasByCompany(value);
  };
  const prepareBodyToSearch = () => {
    let body = {};
    if (compania) body.c_compania = compania;
    if (agencia && agencia !== "T") body.c_agencia = agencia;
    if (estado && estado !== "T") body.c_estado = estado;
    if (tipoCajaTienda && tipoCajaTienda !== "T")
      body.c_tipofctienda = tipoCajaTienda;
    if (usuarioFlujoCajaTienda && usuarioFlujoCajaTienda !== "T")
      body.c_usuariofctienda = usuarioFlujoCajaTienda;
    if (fechaRegistro.isValid && !enabledFechaRegistro) {
      body.d_fecharegistroinicio = fechaRegistro.fechaInicio;
      body.d_fecharegistrofin = fechaRegistro.fechaFin;
    }
    if (fechaMovimiento.isValid && !enabledFechaMovimiento) {
      body.d_fechamovimientoinicio = fechaMovimiento.fechaInicio;
      body.d_fechamovimientofin = fechaMovimiento.fechaFin;
    }
    body.c_codigousuario = userLogedIn;
    return body;
  };

  const onHandleClickBuscar = async () => {
    await setIsLoading(true);
    await onHandleBuscarFlujosCaja();
    setIsLoading(false);
  };

  //Funciones de los botones
  const onHandleBuscarFlujosCaja = async (parametrosIniciales) => {
    await setIsLoading(true);
    let parametros = parametrosIniciales
      ? parametrosIniciales
      : prepareBodyToSearch();
    // const response = await getFlujoCajaDinamico(parametros);
    // if(response && response.status === 200 ) {
    //     setDataFlujoCajaTable(response.body.data);
    //     setParamsForFilterFlujoCajaTienda(parametros);
    // } else {
    //     setDataFlujoCajaTable([]);
    // }
    setElementSelected([]);
    setSelectedRowKeys([]);
    setIsLoading(false);
  };

  const handleSelectNuevo = () => {
    if (compania) {
      setFlujoCajaTienda({ general: {}, firstArrival: true });
      setDetalles([]);
      setEliminarDetalles([]);
      setEliminarMovimientos([]);
      history.push(`/nuevaCajaTienda/${compania}`);
    }
  };

  const prepareNotificationDanger = (
    title,
    message = "Error al consumir el servicio."
  ) => {
    setResponseData({ title: title, message: message });
    setOpenResponseModal(true);
  };

  const handleSelectActualizar = () => {
    if (elementSelected[0]) {
      setFlujoCajaTienda({ general: {}, firstArrival: true });
      history.push(
        `/actualizarCajaTienda/${elementSelected[0].c_compania}/${elementSelected[0].n_correlativo}`
      );
    } else {
      prepareNotificationDanger("Aviso", "Selecciona un item de la tabla.");
    }
  };

  const handleMostrarDetalleCaja = (c_compania, n_correlativo) => {
    setOpenModalDetalleFlujoCaja(true);
    setItemFlujoCajaSelected({
      c_compania: c_compania,
      n_correlativo: n_correlativo,
    });
  };

  const handleMostrarDetalleCajaMovimiento = (
    c_compania,
    n_correlativo,
    d_fechamov
  ) => {
    setOpenModalDetalleFlujoCajaMovimientos(true);
    setItemFlujoCajaDetalleSelected({
      c_compania: c_compania,
      n_correlativo: n_correlativo,
      d_fechamov: d_fechamov,
    });
  };

  //Datos de la tabla
  const setDataFlujoCajaTable = (data) => {
    const listAux = JSON.parse(JSON.stringify(data)).map((item) => {
      let aux = {};
      aux.key = `${item.c_compania}-${item.n_correlativo}`;
      aux.c_compania = item.c_compania;
      aux.c_companiadesc = item.c_companiadesc;
      aux.n_correlativo = item.n_correlativo;
      aux.c_agenciadesc = item.c_agenciadesc;
      aux.c_tipofctienda = item.c_tipofctienda === "B" ? "BOVEDA" : "PERSONAL";
      aux.c_usuariofctienda = item.c_usuariofctienda;
      aux.d_fechaInicioMov = item.d_fechaInicioMov
        ? moment(item.d_fechaInicioMov).local().format("DD/MM/yyyy")
        : "";
      aux.d_fechaFinMov = item.d_fechaFinMov
        ? moment(item.d_fechaFinMov).local().format("DD/MM/yyyy")
        : "";
      aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
      aux.c_monedafctienda =
        item.c_monedafctienda === "L" ? "LOCAL" : "EXTRANJERO";
      aux.n_montoingresos = item.n_montoingresos
        ? separator(Number(item.n_montoingresos).toFixed(2))
        : "0.00";
      aux.n_montosalidas = item.n_montosalidas
        ? separator(Number(item.n_montosalidas).toFixed(2))
        : "0.00";
      aux.n_saldo = separator(
        Number(item.n_montoingresos - item.n_montosalidas).toFixed(2)
      );
      aux.c_observaciones = item.c_observaciones;
      aux.c_usuarioregistro = item.c_usuarioregistro;
      aux.d_fecharegistro = item.d_fecharegistro
        ? moment(item.d_fecharegistro).format("DD/MM/yyyy HH:mm:ss")
        : "";
      aux.c_ultimousuario = item.c_ultimousuario;
      aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion
        ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy HH:mm:ss")
        : "";
      aux.handleMostrarDetalleCajaRow = () =>
        handleMostrarDetalleCaja(item.c_compania, item.n_correlativo);
      return aux;
    });
    setFlujosCajaTiendaTabla(listAux);
  };

  //Funciones con servicios de lista
  const getCompanias = async () => {
    const response = await listCompanias();
    if (response && response.status === 200) {
      setCompanias(response.body.data);
      handleSeleccionarCompania(
        response.body.data ? response.body.data[0].c_compania : ""
      );
    }
  };
  const getAgenciasByCompany = async (companyCode) => {
    const response = await listAgenciesByUserAndCompany({
      c_compania: companyCode,
      c_codigousuario: userLogedIn,
    });
    if (response && response.status === 200 && response.body.data)
      setAgencias([
        { c_agencia: "T", c_descripcion: "TODAS" },
        ...response.body.data,
      ]);
  };
  const getUsuarios = async () => {
    const response = await listUsers();
    if (response && response.status === 200)
      setUsuarios([
        { c_codigousuario: "T", c_nombres: "TODOS" },
        ...response.body.data,
      ]);
  };

  const getLastSearch = async () => {
    const parametros = getParamsForFilterFlujoCajaTienda();
    if (parametros && Object.keys(parametros).length !== 0) {
      await onHandleBuscarFlujosCaja(parametros);
      if (parametros.c_compania) {
        setCompania(parametros.c_compania);
      }
      if (parametros.c_agencia) setAgencia(parametros.c_agencia);
      if (parametros.c_estado) setEstado(parametros.c_estado);
      if (parametros.c_tipofctienda)
        setTipoCajaTienda(parametros.c_tipofctienda);
      if (parametros.c_usuariofctienda)
        setUsuarioFlujoCajaTienda(parametros.c_usuariofctienda);
      if (parametros.d_fecharegistroinicio && parametros.d_fecharegistrofin) {
        setFechaRegistro({
          fechaInicio: parametros.d_fecharegistroinicio,
          fechaFin: parametros.d_fecharegistrofin,
          isValid: true,
        });
        setEnabledFechaRegistro(false);
      }
      if (parametros.d_fechaInicioMov && parametros.d_fechaFinMov) {
        setFechaRegistro({
          fechaInicio: parametros.d_fechaInicioMov,
          fechaFin: parametros.d_fechaFinMov,
          isValid: true,
        });
        setEnabledFechaRegistro(false);
      }
    }
  };

  useEffect(async () => {
    await setIsLoading(true);
    await getCompanias();
    await getUsuarios();
    await getLastSearch();
    setIsLoading(false);
  }, []);

  return (
    <>
      <div
        className="container-fluid pt-2 pb-2 pl-2 pr-2"
        style={{ background: "#FFFFFF" }}
      >
        <div className="row">
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
                      handleElementSelected={handleSeleccionarCompania}
                      optionField="c_descripcion"
                      valueField="c_compania"
                      classForm="col-12 col-md-6"
                      marginForm="ml-0"
                      labelSpace={3}
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
                      labelSpace={3}
                    />
                    <SelectComponent
                      labelText="Estados"
                      defaultValue="Seleccione un estado"
                      items={estadosCajaTienda}
                      selectId="estadoId"
                      valueField="value"
                      optionField="name"
                      valueSelected={estado}
                      handleChange={setEstado}
                      classForm="col-12 col-md-6"
                      marginForm="ml-0"
                      labelSpace={3}
                    />
                    <SelectComponent
                      labelText="Tipo Caja Tienda"
                      defaultValue="Seleccione un tipo"
                      items={tiposCajaTienda}
                      selectId="tipoCajaId"
                      valueField="value"
                      optionField="name"
                      valueSelected={tipoCajaTienda}
                      handleChange={setTipoCajaTienda}
                      classForm="col-12 col-md-6"
                      marginForm="ml-0"
                      labelSpace={3}
                    />
                    <ReactSelect
                      inputId="usuarioCodeId"
                      labelText="Usuario"
                      placeholder="Seleccione un Usuario"
                      valueSelected={usuarioFlujoCajaTienda}
                      data={usuarios}
                      handleElementSelected={setUsuarioFlujoCajaTienda}
                      optionField="c_nombres"
                      valueField="c_codigousuario"
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
                      inputId="fechaMovimientoId"
                      labelText="Fecha de movimiento"
                      state={fechaMovimiento}
                      setState={setFechaMovimiento}
                      enabled={enabledFechaMovimiento}
                      setEnabled={setEnabledFechaMovimiento}
                      classForm="col-12 col-md-6"
                      marginForm="ml-0"
                      labelSpace={3}
                    />
                  </div>
                  <div className="col-12 col-md-12 mt-3 mb-3 text-center">
                    <button
                      onClick={onHandleClickBuscar}
                      className="btn btn-light"
                      style={{ width: "200px" }}
                    >
                      Buscar
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <Space size={[10, 3]} wrap style={{ marginBottom: 16 }}>
                      {registerPermission && (
                        <Button onClick={handleSelectNuevo}>NUEVO</Button>
                      )}
                      {updatePermission && (
                        <Button onClick={handleSelectActualizar}>
                          MODIFICAR
                        </Button>
                      )}
                    </Space>
                  </div>
                </div>
                <div className="row">
                  <div className="col" style={{ overflow: "scroll" }}>
                    <Table
                      classForm
                      rowSelection={{
                        type: "radio",
                        ...rowSelection,
                        selectedRowKeys,
                      }}
                      columns={columns}
                      dataSource={flujosCajaTiendaTabla}
                      pagination={{ pageSize: 50 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading === true && <Loading />}
      <ResponseModal
        isOpen={openResponseModal}
        title={responseData.title}
        onClose={() => setOpenResponseModal(false)}
        message={responseData.message}
      />
      <FlujoCajaDetalleModal
        isOpen={openModalDetalleFlujoCaja}
        onClose={() => setOpenModalDetalleFlujoCaja(false)}
        c_compania={itemFlujoCajaSelected.c_compania}
        n_correlativo={itemFlujoCajaSelected.n_correlativo}
        handleMostrarDetalleCajaMovimiento={handleMostrarDetalleCajaMovimiento}
      />
      <FlujoCajaDetalleMovimientosModal
        isOpen={openModalDetalleFlujoCajaMovimientos}
        onClose={() => setOpenModalDetalleFlujoCajaMovimientos(false)}
        c_compania={itemFlujoCajaDetalleSelected.c_compania}
        n_correlativo={itemFlujoCajaDetalleSelected.n_correlativo}
        d_fechamov={itemFlujoCajaDetalleSelected.d_fechamov}
      />
    </>
  );
};

export default BusquedaFlujoCajaTienda;
