import React, { useEffect, useState, useContext } from "react";
//Componentes
import DateRangeComponent from "../../components/DateRangeComponent/DateRangeComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import PeriodoRange from "../../components/PeriodoRange/PeriodoRange";
import ReactSelect from "../../components/ReactSelect/ReactSelect";
import ReportContainer from "../../components/ReportContainer/ReportContainer";
import SearcherComponent from "../../components/SearcherComponent/SearcherComponent";
import SelectComponent from "../../components/SelectComponent/SelectComponent";
import LoadingModal from "../../components/Modal/LoadingModal";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import ResponseModal from "../../components/Modal/ResponseModal";
import SearchModalProducto from "../../components/Modal/SearchModalProducto";
import SearchModalCliente from "../../components/Modal/SearchModalCliente";
//Context
import PagesContext from "../../context/PagesContext/PagesContext";
import UserContext from "../../context/UserContext/UserContext";
import FiltersContext from "../../context/FiltersContext/FiltersContext";
//Servicios
import { useHistory } from "react-router";
import {
  listAllCompanias,
  listAgenciesByUserAndCompany,
  getClienteByCodigoCliente,
} from "../../Api/Api";
import { getProductoDinamico } from "../../Api/Comercial/producto.service";
import {
  getTransaccionDinamico,
  postAnularTransaccion,
} from "../../Api/Comercial/transacciones.service";
//Librerias
import moment from "moment";
import { Button, Space, Table } from "antd";
import { formatPeriodo } from "../../utilities/Functions/FormatPeriodo";
import {
  transactionStatuses,
  transactionTypes,
  listColumns,
} from "./configData";

const TransaccionesTienda = () => {
  //Navegacion
  let history = useHistory();
  //Estados
  const [compania, setCompania] = useState("");
  const [agencia, setAgencia] = useState("T");
  const [codigoCliente, setCodigoCliente] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [fecha, setFecha] = useState({
    fechaInicio: "",
    fechaFin: "",
    isValid: false,
  });
  const [disabledFilterFecha, setDisabledFilterFecha] = useState(true);
  const [tipo, setTipo] = useState("TO");
  const [numeroDocumento, setNumeroDocumento] = useState({
    value: "",
    isValid: null,
  });
  const [periodo, setPeriodo] = useState({
    periodoInicio: "",
    periodoFin: "",
    isValid: null,
  });
  const [disabledPeriodo, setDisabledPeriodo] = useState(false);
  const [estado, setEstado] = useState("TO");
  const [nPrestamo, setNPrestamo] = useState({ value: "" });
  const [dataTableTransacciones, setDataTableTransacciones] = useState([]);
  //Producto
  const [codigoProducto, setCodigoProducto] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  //Listas
  const [companias, setCompanias] = useState([]);
  const [agencias, setAgencias] = useState([]);
  //Form
  const [open, setOpen] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [openResponseModal, setOpenResponseModal] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openSearchModalProducto, setOpenSearchModalProducto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [elementSelected, setElementSelected] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  //Contexto
  const { getUserData } = useContext(UserContext);
  const userLogedIn = getUserData().c_codigousuario;
  const { getPagesKeysForUser } = useContext(PagesContext);
  const userPermisssions = getPagesKeysForUser().filter((item) => {
    return (
      item === "NUEVA TRANSACCIÓN SALIDA" ||
      item === "NUEVA TRANSACCIÓN INGRESO" ||
      item === "ANULAR TRANSACCIÓN" ||
      item === "RECIBO VENTA TIENDA" ||
      item === "VISUALIZAR TRANSACCIÓN" ||
      item === "TRANSACCIONES POR CONFIRMAR" ||
      item === "CONSTANCIA DE ENTREGA PARA NS" ||
      item === "CONSTANCIA DE VENTA PARA NS"
    );
  });
  const outputPermission = userPermisssions.includes(
    "NUEVA TRANSACCIÓN SALIDA"
  );
  const inputPermission = userPermisssions.includes(
    "NUEVA TRANSACCIÓN INGRESO"
  );
  const cancelPermission = userPermisssions.includes("ANULAR TRANSACCIÓN");
  const ticetPermission = userPermisssions.includes("RECIBO VENTA TIENDA");
  const viewPermission = userPermisssions.includes("VISUALIZAR TRANSACCIÓN");
  const confirmPermission = userPermisssions.includes(
    "TRANSACCIONES POR CONFIRMAR"
  );
  const proofOfSaleTopNote = userPermisssions.includes(
    "CONSTANCIA DE ENTREGA PARA NS"
  );
  const proofOfDeliveryOfTopNote = userPermisssions.includes(
    "CONSTANCIA DE VENTA PARA NS"
  );
  //Contexto
  const { setParamsForFilterTransaccion, getParamsForFilterTransaccion } =
    useContext(FiltersContext);

  const findClienteByCode = async () => {
    setIsLoading(true);
    if (codigoCliente) {
      const response = await getClienteByCodigoCliente({
        c_compania: compania,
        n_cliente: codigoCliente,
      });
      if (response && response.status === 200 && response.body.data) {
        setNombreCliente(response.body.data.c_nombrescompleto);
      } else {
        setResponseData({
          title: "Aviso",
          message: "No hay un cliente con ese código",
        });
        setCodigoCliente("");
        setNombreCliente("");
        setClienteSeleccionado({});
        setOpenResponseModal(true);
      }
    } else setNombreCliente("");
    setIsLoading(false);
  };

  const handleSeleccionarCompania = (value) => {
    setCompania(value);
    //Deberia buscar las agencias de la compañía
    getAgenciasByCompany(value);
  };

  const prepareBodyToSearch = () => {
    let body = {};
    if (compania) body.c_compania = compania;
    if (agencia && agencia !== "T") body.c_agencia = agencia;
    if (fecha.isValid && !disabledFilterFecha) {
      body.d_fechadocumentoInicio = fecha.fechaInicio;
      body.d_fechadocumentoFin = fecha.fechaFin;
    }
    if (codigoCliente) body.n_cliente = codigoCliente;
    if (tipo && tipo !== "TO") body.c_tipodocumento = tipo;
    if (numeroDocumento.value) body.c_numerodocumento = numeroDocumento.value;
    if (periodo.isValid && !disabledPeriodo) {
      body.periodo_inicio = periodo.periodoInicio.replace("-", "");
      body.periodo_fin = periodo.periodoFin.replace("-", "");
    }
    if (codigoProducto) body.c_item = codigoProducto;
    if (estado && estado !== "TO") body.c_estado = estado;
    if (nPrestamo.value) body.c_prestamo = nPrestamo.value;
    body.c_codigousuario = userLogedIn;
    return body;
  };

  const onHandleSearch = async (parametrosIniciales) => {
    let parametros = parametrosIniciales
      ? parametrosIniciales
      : prepareBodyToSearch();
    setParamsForFilterTransaccion(parametros);
    const response = await getTransaccionDinamico(parametros);
    if (response && response.status === 200 && response.body.data) {
      const data = response.body.data;
      getDataForTable(data);
    } else {
      getDataForTable([]);
      setResponseData({
        title: "Aviso",
        message: "No se encontraron transacciones",
      });
    }
  };

  const gotoView = (
    c_compania,
    c_agencia,
    c_tipodocumento,
    c_numerodocumento
  ) => {
    history.push(
      `/visualizarTransaccion/${c_compania}/${c_agencia}/${c_tipodocumento}/${c_numerodocumento}`
    );
  };

  const getDataForTable = (transacciones) => {
    const listAux = transacciones.map((item) => {
      item.key = `${item.c_compania}-${item.c_agencia}-${item.c_tipodocumento}-${item.c_numerodocumento}`;
      item.c_estado_desc = transactionStatuses.find(
        (estado) => estado.value === item.c_estado
      )?.name;
      item.c_tipodocumento_desc =
        item.c_tipodocumento === "NI" ? "Nota de ingreso" : "Nota de salida";
      item.d_fechadocumento_formato = moment(item.d_fechadocumento).format(
        "DD/MM/yyyy"
      );
      item.d_fecharegistro = moment(item.d_fecharegistro).format(
        "DD/MM/yyyy HH:MM:ss"
      );
      item.d_ultimafechamodificacion = item.d_ultimafechamodificacion
        ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy HH:MM:ss")
        : "";
      item.c_moneda_desc = item.c_moneda === "L" ? "LOCAL" : "EXTRANJERO";
      item.n_montototal = Number(item.n_montototal).toFixed(2);
      item.hendleFunction = viewPermission
        ? () =>
            gotoView(
              item.c_compania,
              item.c_agencia,
              item.c_tipodocumento,
              item.c_numerodocumento
            )
        : () => {};
      item.c_periodo = formatPeriodo(item.c_periodo);
      return item;
    });
    setDataTableTransacciones(listAux);
  };

  const onHandleClickSearch = async () => {
    await setIsLoading(true);
    await onHandleSearch();
    setIsLoading(false);
  };

  const getPeriodoDefualt = () => {
    if (!periodo.periodoInicio && !periodo.periodoFin) {
      const periodoAux = moment().format("yyyy-MM");
      setPeriodo({
        periodoInicio: periodoAux,
        periodoFin: periodoAux,
        isValid: true,
      });
    }
  };

  const findProductoByCode = async () => {
    setIsLoading(true);
    if (codigoProducto) {
      const response = await getProductoDinamico({
        c_compania: compania,
        c_agencia: agencia,
        c_item: codigoProducto,
        c_codigousuario: userLogedIn,
      });
      if (response && response.status === 200 && response.body.data) {
        setNombreProducto(response.body.data[0].c_descripcionproducto);
      } else {
        setResponseData({
          title: "Aviso",
          message: "No hay un producto con ese código",
        });
        setCodigoProducto("");
        setNombreProducto("");
        setProductoSeleccionado({});
        setOpenResponseModal(true);
      }
    } else setNombreProducto("");
    setIsLoading(false);
  };

  const clickRegistrarTransaccion = (route = "nuevaTransaccionSalida") => {
    if (agencia !== "T") {
      history.push(`/${route}/${compania}/${agencia}`);
    } else {
      setResponseData({
        title: "Aviso",
        message: "Debes seleccionar una agencia",
      });
      setOpenResponseModal(true);
    }
  };

  const clickAnularTransaccion = () => {
    if (elementSelected.length > 0) {
      if (elementSelected[0].c_tipodocumento === 'NI' && elementSelected[0].c_numerodocumentorel) {
        setResponseData({
          title: "Aviso",
          message: "No puedes anular una nota de ingreso que es generada por un nota de salida desde otra agencia",
        });
        setOpenResponseModal(true);
      } else {
        setOpen(true);
      }
    } else {
      setResponseData({
        title: "Aviso",
        message: "Favor de seleccionar un item de la tabla",
      });
      setOpenResponseModal(true);
    }
  };

  const validateSelectionOfTopNote = (url, requiresConfirmation = 'N') => {
    if (elementSelected.length > 0) {
      if (elementSelected[0].c_tipodocumento === "NS") {
        if (requiresConfirmation === 'N') {
          history.push(url);
        } else {
          if(elementSelected[0].c_flagconfirmado === 'S') {
            history.push(url);
          }
          else {
            setResponseData({
              title: "Aviso",
              message: "La transacción requiere confirmación.",
            });
            setOpenResponseModal(true);
          }
        }
      }
      else {
        setResponseData({
          title: "Aviso",
          message: "Tienes que seleccionar una nota de salida",
        });
        setOpenResponseModal(true);
      }
    } else {
      setResponseData({
        title: "Aviso",
        message: "Favor de seleccionar un item de la tabla",
      });
      setOpenResponseModal(true);
    }
  };

  const handleClickGoToPrintTicket = () => {
    validateSelectionOfTopNote(
      `/ticketVentaTienda/${elementSelected[0]?.c_compania}-${elementSelected[0]?.c_agencia}-${elementSelected[0]?.c_tipodocumento}-${elementSelected[0]?.c_numerodocumento}`,
      elementSelected[0]?.validatransaccionconfirmada
    );
  };

  const handleClickGoToPrintProofOfdelivery = () => {
    validateSelectionOfTopNote(
      `/contanciaEntregaNotaSalida/${elementSelected[0]?.c_compania}/${elementSelected[0]?.c_agencia}/${elementSelected[0]?.c_tipodocumento}/${elementSelected[0]?.c_numerodocumento}`,
      elementSelected[0]?.validatransaccionconfirmada
    );
  };

  const handleClickGoToPrintProofOfSale = () => {
    validateSelectionOfTopNote(
      `/constanciaVentaNotaSalida/${elementSelected[0]?.c_compania}/${elementSelected[0]?.c_agencia}/${elementSelected[0]?.c_tipodocumento}/${elementSelected[0]?.c_numerodocumento}`,
      elementSelected[0]?.validatransaccionconfirmada
    );
  };

  const handleAnular = async () => {
    if (elementSelected.length > 0) {
      const response = await postAnularTransaccion({
        c_compania: elementSelected[0].c_compania,
        c_agencia: elementSelected[0].c_agencia,
        c_tipodocumento: elementSelected[0].c_tipodocumento,
        c_numerodocumento: elementSelected[0].c_numerodocumento,
        d_fechadocumento: moment(elementSelected[0].d_fechadocumento).format("yyyy-MM-DD"),
        c_usuariofctienda: elementSelected[0].c_usuariofctienda,
        c_observacionesanulacion: 'Anular',
        c_usuarioanulacion: userLogedIn,
        c_ultimousuario:  userLogedIn,
      });
      if (response.status === 200 && response.body.message === "OK") {
        onHandleSearch();
        setResponseData({
          title: "Aviso",
          message: "Se anuló la transacción con éxito",
        });
      } else
        setResponseData({
          title: "Aviso",
          message: response.message
            ? response.message
            : "Ocurrió un error en el servicio",
        });
    } else {
      setResponseData({
        title: "Aviso",
        message: "Favor de seleccionar un item de la tabla",
      });
    }
    setOpen(false);
    setOpenResponseModal(true);
  };

  const rowSelection = {
    onChange: (selectedKeys, selectedRows) => {
      setElementSelected(selectedRows);
      setSelectedRowKeys(selectedKeys);
    },
  };

  //Listas
  const getCompanias = async () => {
    const response = await listAllCompanias();
    if (response && response.status === 200) setCompanias(response.body.data);
  };
  const getAgenciasByCompany = async (companyCode) => {
    const response = await listAgenciesByUserAndCompany({
      c_compania: companyCode,
      c_codigousuario: userLogedIn,
    });
    if (response && response.status === 200 && response.body.data)
      setAgencias([
        { c_agencia: "T", c_descripcion: "TODOS" },
        ...response.body.data,
      ]);
  };

  useEffect(() => {
    if (productoSeleccionado) {
      setCodigoProducto(productoSeleccionado.c_item);
      setNombreProducto(productoSeleccionado.c_descripcionproducto);
    }
  }, [productoSeleccionado]);

  useEffect(() => {
    if (clienteSeleccionado) {
      setCodigoCliente(clienteSeleccionado.n_cliente);
      setNombreCliente(clienteSeleccionado.c_nombrescompleto);
    }
  }, [clienteSeleccionado]);

  useEffect(() => {
    if (companias.length !== 0 && !compania) {
      handleSeleccionarCompania(companias[0].c_compania);
      setAgencia("T");
    }
  }, [companias]);

  const getLastSearch = async () => {
    const parametros = getParamsForFilterTransaccion();
    if (parametros && Object.keys(parametros).length !== 0) {
      await onHandleSearch(parametros);
      if (parametros.c_compania) setCompania(parametros.c_compania);
      if (parametros.c_agencia) setAgencia(parametros.c_agencia);
      if (parametros.d_fechadocumentoInicio && parametros.d_fechadocumentoFin) {
        setFecha({
          fechaInicio: parametros.d_fechadocumentoInicio,
          fechaFin: parametros.d_fechadocumentoFin,
          isValid: true,
        });
        setDisabledFilterFecha(false);
      } else {
        setDisabledFilterFecha(true);
      }
      if (parametros.n_cliente) setCodigoCliente(parametros.n_cliente);
      if (parametros.c_tipodocumento) setTipo(parametros.c_tipodocumento);
      if (parametros.c_numerodocumento)
        setNumeroDocumento(parametros.c_numerodocumento);

      if (parametros.periodo_inicio && parametros.periodo_fin) {
        setPeriodo({
          periodoInicio: parametros.periodo_inicio,
          periodoFin: parametros.periodo_fin,
          isValid: true,
        });
        setDisabledPeriodo(false);
      } else {
        setDisabledPeriodo(true);
      }
      if (parametros.c_item) setCodigoProducto(parametros.c_item);
      if (parametros.c_estado) setEstado(parametros.c_estado);
      if (parametros.c_prestamo) setNPrestamo({ value: parametros.c_prestamo });
    }
  };

  useEffect(async () => {
    await setIsLoading(true);
    await getCompanias();
    getPeriodoDefualt();
    await getLastSearch();
    setIsLoading(false);
  }, []);

  return (
    <>
      <ReportContainer>
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
          <DateRangeComponent
            inputId="fechaId"
            labelText="Fecha"
            state={fecha}
            setState={setFecha}
            enabled={disabledFilterFecha}
            setEnabled={setDisabledFilterFecha}
            classForm="col-12 col-md-6"
            marginForm="ml-0"
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
            onHandleClick={() => setOpenSearchModal(true)}
            onHandleBlur={findClienteByCode}
            readOnly={true}
            classForm="col-12 col-md-6"
            marginForm="ml-0"
          />
          <SelectComponent
            labelText="Tipo"
            defaultValue="Seleccione un tipo"
            items={transactionTypes}
            selectId="tipoId"
            valueField="value"
            optionField="option"
            valueSelected={tipo}
            handleChange={setTipo}
            marginForm="ml-0"
            classForm="col-12 col-lg-6"
          />
          <InputComponent
            label="N° documento"
            state={numeroDocumento}
            setState={setNumeroDocumento}
            type="text"
            placeholder="N° documento"
            inputId="numeroDocumentoId"
            marginForm="ml-0"
            classForm="col-12 col-lg-6"
          />
          <PeriodoRange
            inputId="periodoId"
            labelText="Periodo"
            state={periodo}
            setState={setPeriodo}
            classForm="col-12 col-md-6"
            marginForm="ml-0"
            disabledPeriodo={disabledPeriodo}
            setDisabledPeriodo={setDisabledPeriodo}
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
            onHandleClick={() => setOpenSearchModalProducto(true)}
            onHandleBlur={findProductoByCode}
            readOnly={true}
            classForm="col-12 col-md-6"
            marginForm="ml-0"
            searchWidth={5}
          />
          <SelectComponent
            labelText="Estado"
            defaultValue="Seleccione un estado"
            items={transactionStatuses}
            selectId="estadoId"
            valueField="value"
            optionField="name"
            valueSelected={estado}
            handleChange={setEstado}
            classForm="col-12 col-md-6"
            marginForm="ml-0"
          />
          <InputComponent
            state={nPrestamo}
            setState={setNPrestamo}
            type="text"
            label="# Prestamo"
            placeholder="# Prestamo"
            inputId="nPrestamoInput"
            classForm="col-12 col-md-6"
            marginForm="ml-0"
          />
        </div>
        <div className="col-12 col-md-12 mt-3 mb-3 text-center">
          <button
            onClick={onHandleClickSearch}
            className="btn btn-light"
            style={{ width: "200px" }}
          >
            Buscar
          </button>
        </div>
        <div className="col-12">
          <Space size={[10, 3]} wrap style={{ marginBottom: 16 }}>
            {outputPermission && (
              <Button
                onClick={() =>
                  clickRegistrarTransaccion("nuevaTransaccionSalida")
                }
              >
                NUEVA SALIDA
              </Button>
            )}
            {inputPermission && (
              <Button
                onClick={() =>
                  clickRegistrarTransaccion("nuevaTransaccionIngreso")
                }
              >
                NUEVO INGRESO
              </Button>
            )}
            {cancelPermission && (
              <Button onClick={clickAnularTransaccion}>ANULAR</Button>
            )}
            {ticetPermission && (
              <Button onClick={handleClickGoToPrintTicket}>
                RECIBO VENTA TIENDA
              </Button>
            )}
            {confirmPermission && (
              <Button
                onClick={() => history.push("/trannsaccionesPorConfirmar")}
              >
                CONFIRMAR TRANSACCONES
              </Button>
            )}
            {proofOfDeliveryOfTopNote && (
              <Button onClick={handleClickGoToPrintProofOfdelivery}>
                CONSTANCIA DE ENTREGA (NS)
              </Button>
            )}
            {proofOfSaleTopNote && (
              <Button onClick={handleClickGoToPrintProofOfSale}>
                CONSTANCIA DE VENTA (NS)
              </Button>
            )}
          </Space>
        </div>
        <div className="col-12" style={{ overflow: "scroll" }}>
          <Table
            classForm
            rowSelection={{
              type: "radio",
              ...rowSelection,
              selectedRowKeys,
            }}
            columns={listColumns}
            dataSource={dataTableTransacciones}
            pagination={{ pageSize: 50 }}
          />
        </div>
      </ReportContainer>
      {isLoading === true && <LoadingModal />}
      <ConfirmationModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={"Aviso de retorno"}
        message={"¿Seguro que desea anular la transacción."}
        onHandleFunction={() => handleAnular()}
        buttonClass="btn-success"
      />
      <ResponseModal
        isOpen={openResponseModal}
        title={responseData.title}
        onClose={() => setOpenResponseModal(false)}
        message={responseData.message}
      />
      <SearchModalCliente
        isOpen={openSearchModal}
        onClose={() => setOpenSearchModal(false)}
        setClienteObtained={setClienteSeleccionado}
        compania={compania}
      />
      <SearchModalProducto
        isOpen={openSearchModalProducto}
        onClose={() => setOpenSearchModalProducto(false)}
        setProductoObtained={setProductoSeleccionado}
        compania={compania}
        agencia={agencia}
      />
    </>
  );
};

export default TransaccionesTienda;
