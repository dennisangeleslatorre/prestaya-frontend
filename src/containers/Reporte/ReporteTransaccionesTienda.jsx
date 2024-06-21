import React, { useContext, useState, useEffect } from "react";
import ReportContainer from "../../components/ReportContainer/ReportContainer";
import ReactSelect from "../../components/ReactSelect/ReactSelect";
import DateRangeComponent from "../../components/DateRangeComponent/DateRangeComponent";
import SearcherComponent from "../../components/SearcherComponent/SearcherComponent";
import ButtonDownloadExcel from "../../components/ButtonDownloadExcel/ButtonDownloadExcel";
import { Space } from "antd";
import ResponseModal from "../../components/Modal/ResponseModal";
import SearchModalCliente from "../../components/Modal/SearchModalCliente";
import SearchModalProducto from "../../components/Modal/SearchModalProducto";
import SelectComponent from "../../components/SelectComponent/SelectComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import PeriodoRange from "../../components/PeriodoRange/PeriodoRange";
import LoadingModal from "../../components/Modal/LoadingModal";
import {
  listAllCompanias,
  listAgenciesByUserAndCompany,
  getClienteByCodigoCliente,
  getReporteTransaccion,
  listUsers,
} from "../../Api/Api";
import { getProductoDinamico } from "../../Api/Comercial/producto.service";
import moment from "moment";
import { formatPeriodo } from "../../utilities/Functions/FormatPeriodo";
import UserContext from "../../context/UserContext/UserContext";
import PagesContext from "../../context/PagesContext/PagesContext";
import { Radio, Table } from "antd";
//PDF
import { PDFViewer } from "@react-pdf/renderer";
import ReporteTransaccionesPdfComponent from "../../components/ReporteTransaccionesPdfComponent/ReporteTransaccionesPdfComponent";

const estados = [
  { name: "TODOS", value: "TO" },
  { name: "REGISTRADO", value: "RE" },
  { name: "ANULADO", value: "AN" },
];

const tipos = [
  { value: "NI", option: "Nota de ingreso" },
  { value: "NS", option: "Nota de salida" },
  { value: "TO", option: "Todos" },
];

const columnsExportExcel = [
  {
    label: "Agencia",
    value: (row) => row.c_agencia_desc || "",
  },
  {
    label: "Tipo",
    value: (row) => row.c_tipodocumento || "",
  },
  {
    label: "Numero Doc.",
    value: (row) => row.c_numerodocumento || "",
  },
  {
    label: "Fecha Doc",
    value: (row) => moment(row.d_fechadocumento).format("DD/MM/yyyy") || "",
  },
  {
    label: "Periodo",
    value: (row) => formatPeriodo(row.c_periodo) || "",
  },
  {
    label: "Cliente",
    value: (row) => row.c_nombrescompleto || "",
  },
  {
    label: "Moneda",
    value: (row) =>
      row.c_moneda ? (row.c_moneda === "L" ? "LOCAL" : "EXTRANJERO") : "",
  },
  {
    label: "Observaciones Cab.",
    value: (row) => row.c_obsv_cabecera || "",
  },
  {
    label: "Linea",
    value: (row) => row.n_linea || "",
  },
  {
    label: "Producto",
    value: (row) => row.c_descripcionproducto || "",
  },
  {
    label: "Descripcion Producto",
    value: (row) => row.c_item || "",
  },
  {
    label: "Unidad M.",
    value: (row) => row.c_unidadmedida || "",
  },
  {
    label: "Cantidad",
    value: (row) => row.n_cantidad || "",
  },
  {
    label: "Precio",
    value: (row) => row.n_precio || "",
  },
  {
    label: "Monto total",
    value: (row) => row.n_montototal || "",
  },
  {
    label: "Usuario operación",
    value: (row) => row.c_usuariooperacion || "",
  },
  {
    label: "Porcentaje G.",
    value: (row) => row.n_porcremate || "",
  },
  {
    label: "Precio histórico",
    value: (row) => row.n_preciobasehist || "",
  },
  {
    label: "Monto Margen",
    value: (row) => row.n_montomargen || "",
  },
  {
    label: "Porcentaje histórico",
    value: (row) => row.n_porcrematehist || "",
  },
  {
    label: "Observaciones Det.",
    value: (row) => row.c_observacionesdet || "",
  },
];

const columnsTable = [
  {
    title: "Agencia",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "c_agencia_desc",
  },
  {
    title: "Tipo",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "c_tipodocumento",
  },
  {
    title: "Numero Doc.",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "c_numerodocumento",
    width: 160,
  },
  {
    title: "Fecha Doc",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "d_fechadocumento",
    render: (d_fechadocumento) => (
      <span>{moment(d_fechadocumento).format("DD/MM/yyyy")}</span>
    ),
    width: 160,
  },
  {
    title: "Periodo",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "c_periodo",
    render: (c_periodo) => <span>{formatPeriodo(c_periodo)}</span>,
  },
  {
    title: "Cliente",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "c_nombrescompleto",
  },
  {
    title: "Moneda",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "c_moneda",
  },
  {
    title: "Observaciones Cab.",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "c_obsv_cabecera",
    width: 300,
  },
  {
    title: "Linea",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "n_linea",
  },
  {
    title: "Producto",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "c_descripcionproducto",
    width: 300,
  },
  {
    title: "Descripcion Producto",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "c_item",
  },
  {
    title: "Unidad M.",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "c_unidadmedida",
    width: 200,
  },
  {
    title: "Cantidad",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "n_cantidad",
  },
  {
    title: "Precio",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "n_precio",
    width: 300,
  },
  {
    title: "Monto total",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "n_montototal",
    width: 300,
  },
  {
    title: "Usuario operación",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "c_usuariooperacion",
    width: 300,
  },
  {
    title: "Porcentaje G.",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "n_porcremate",
    width: 200,
  },
  {
    title: "Precio histórico",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "n_preciobasehist",
    width: 200,
  },
  {
    title: "Monto Margen",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "n_montomargen",
    width: 200,
  },
  {
    title: "Porcentaje histórico",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "n_porcrematehist",
    width: 200,
  },
  {
    title: "Observaciones Det.",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "c_observacionesdet",
    width: 300,
  },
];

const ReporteTransaccionesTienda = () => {
  const { getUserData } = useContext(UserContext);
  const userLogedIn = getUserData().c_codigousuario;
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
  const [estado, setEstado] = useState("RE");
  const [nPrestamo, setNPrestamo] = useState({ value: "" });
  const [isPdfGenerated, setIsPdfGenerated] = useState(true);
  const [usuarioOperacion, setUsuarioOperacion] = useState("T");
  const [usuarios, setUsuarios] = useState([]);
  //Listas obtenidas
  const [dataReportToTable, setDataReportToTable] = useState([]);
  const [elementPdf, setElementPdf] = useState(null);
  //Producto
  const [codigoProducto, setCodigoProducto] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  //Listas
  const [companias, setCompanias] = useState([]);
  const [agencias, setAgencias] = useState([]);
  //Form
  const [responseData, setResponseData] = useState({});
  const [openResponseModal, setOpenResponseModal] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openSearchModalProducto, setOpenSearchModalProducto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getPagesKeysForUser } = useContext(PagesContext);
  const userPermisssions = getPagesKeysForUser().filter((item) => {
    return item === "VER HISTÓRICO";
  });
  const usuarioAccesoVerHistorico = userPermisssions.includes("VER HISTÓRICO");

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
    if(usuarioOperacion && usuarioOperacion !== "T") body.c_usuariooperacion = usuarioOperacion;
    body.c_codigousuario = userLogedIn;
    return body;
  };

  const prepareHeadPdf = () => {
    let head = {};
    head.company_name = companias.find(
      (item) => item.c_compania === compania
    )?.c_descripcion;
    if (fecha.isValid && !disabledFilterFecha)
      head.fecha_descripcion = `Fecha: del ${moment(fecha.fechaInicio).format(
        "DD/MM/YYYY"
      )} al ${moment(fecha.fechaFin).format("DD/MM/YYYY")}`;
    if (periodo.isValid && !disabledPeriodo)
      head.periodo_descripcion = `Periodo: del ${periodo.periodoInicio} al ${periodo.periodoInicio}`;
    head.tipo_descripcion = tipos.find((item) => item.value === tipo)?.option;
    return head;
  };

  const prepareDataToPdf = (data = [], dataHeadPdf) => {
    let total = {
      sumaExterior: 0,
      sumaLocal: 0,
      sumaMargenLocal: 0,
      sumaMargenExterior: 0,
    };
    const arregloAgrupado = data.reduce((acumulador, elemento) => {
      const grupo = `${elemento.c_compania}-${elemento.c_agencia}-${elemento.c_item}`;
      if (!acumulador[grupo]) {
        acumulador[grupo] = {};
        acumulador[grupo].key = grupo;
        acumulador[grupo].data = [];
        acumulador[grupo].sumaLocal = 0;
        acumulador[grupo].sumaExterior = 0;
        acumulador[grupo].cantidad = 0;
        acumulador[grupo].sumaMargenLocal = 0;
        acumulador[grupo].sumaMargenExterior = 0;
      }
      acumulador[grupo].data.push(elemento);
      if (elemento.c_moneda === "L") {
        if (elemento.c_tipodocumento === "NI") {
          acumulador[grupo].sumaLocal = Number(
            Number(acumulador[grupo].sumaLocal) + Number(elemento.n_montototal)
          ).toFixed(2);
          acumulador[grupo].cantidad = Number(
            Number(acumulador[grupo].cantidad) + Number(elemento.n_cantidad)
          ).toFixed(0);
          acumulador[grupo].sumaMargenLocal = Number(
            Number(acumulador[grupo].sumaMargenLocal) + Number(elemento.n_montomargen)
          ).toFixed(2);
          total.sumaLocal = Number(Number(total.sumaLocal) + Number(elemento.n_montototal)).toFixed(2);
          total.sumaMargenLocal = Number(Number(total.sumaMargenLocal) + Number(elemento.n_montomargen)).toFixed(2);
        } else if (elemento.c_tipodocumento === "NS") {
          acumulador[grupo].sumaLocal = Number(
            Number(acumulador[grupo].sumaLocal) - Number(elemento.n_montototal)
          ).toFixed(2);
          acumulador[grupo].cantidad = Number(
            Number(acumulador[grupo].cantidad) - Number(elemento.n_cantidad)
          ).toFixed(0);
          acumulador[grupo].sumaMargenLocal = Number(
            Number(acumulador[grupo].sumaMargenLocal) - Number(elemento.n_montomargen)
          ).toFixed(2);
          total.sumaLocal = Number(Number(total.sumaLocal) - Number(elemento.n_montototal)).toFixed(2);
          total.sumaMargenLocal = Number(Number(total.sumaMargenLocal) - Number(elemento.n_montomargen)).toFixed(2);
        }
      } else {
        if (elemento.c_tipodocumento === "NI") {
          acumulador[grupo].sumaExterior = Number(
            Number(acumulador[grupo].sumaExterior) +
              Number(elemento.n_montototal)
          ).toFixed(2);
          acumulador[grupo].cantidad = Number(
            Number(acumulador[grupo].cantidad) + Number(elemento.n_cantidad)
          ).toFixed(0);
          acumulador[grupo].sumaMargenExterior = Number(
            Number(acumulador[grupo].sumaMargenExterior) + Number(elemento.n_montomargen)
          ).toFixed(2);
          total.sumaExterior = Number(Number(total.sumaExterior) + Number(elemento.n_montototal)).toFixed(2);
          total.sumaMargenExterior = Number(Number(total.sumaMargenExterior) + Number(elemento.n_montomargen)).toFixed(2);
        } else if (elemento.c_tipodocumento === "NS") {
          acumulador[grupo].sumaExterior = Number(
            Number(acumulador[grupo].sumaExterior) -
              Number(elemento.n_montototal)
          ).toFixed(2);
          acumulador[grupo].cantidad = Number(
            Number(acumulador[grupo].cantidad) - Number(elemento.n_cantidad)
          ).toFixed(0);
          acumulador[grupo].sumaMargenExterior = Number(
            Number(acumulador[grupo].sumaMargenExterior) - Number(elemento.n_montomargen)
          ).toFixed(2);
          total.sumaExterior = Number(Number(total.sumaExterior) - Number(elemento.n_montototal)).toFixed(2);
          total.sumaMargenExterior = Number(Number(total.sumaMargenExterior) - Number(elemento.n_montomargen)).toFixed(2);
        }
      }
      return acumulador;
    }, {});
    setElementPdf({ data: arregloAgrupado, dataHeadPdf: dataHeadPdf, total: total});
  };

  const onHandleSearch = async () => {
    let parametros = prepareBodyToSearch();
    const response = await getReporteTransaccion(parametros);
    if (response && response.status === 200 && response.body.data) {
      const data = response.body.data;
      const dataHeadPdf = prepareHeadPdf();
      if (!usuarioAccesoVerHistorico) {
        const newData = data.map((item) => {
          const newItem = { ...item };
          newItem.n_porcrematehist = "";
          newItem.n_preciobasehist = "";
          newItem.n_montomargen = "";
          newItem.n_porcremate = "";
          return newItem;
        });
        setDataReportToTable(newData);
        prepareDataToPdf(newData, dataHeadPdf);
      } else {
        const newData = data.map((item) => {
          const newItem = { ...item };
          newItem.n_montomargen =
            (Number(item.n_precio || 0) - Number(item.n_preciobasehist || 0)) *
            Number(item.n_cantidad);
          return newItem;
        });
        setDataReportToTable(newData);
        prepareDataToPdf(newData, dataHeadPdf);
      }
    } else {
      setElementPdf(null);
      setDataReportToTable([]);
      setResponseData({
        title: "Aviso",
        message: "No se encontraron transacciones",
      });
    }
  };

  const onHandleClickSearch = async () => {
    await setIsLoading(true);
    await onHandleSearch();
    setIsLoading(false);
  };

  const getPeriodoDefualt = () => {
    const periodoAux = moment().format("yyyy-MM");
    setPeriodo({
      periodoInicio: periodoAux,
      periodoFin: periodoAux,
      isValid: true,
    });
  };

  const findProductoByCode = async () => {
    setIsLoading(true);
    if (codigoProducto) {
      const response = await getProductoDinamico({
        c_compania: compania,
        c_agencia: agencia,
        c_item: codigoProducto,
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
  const getUsuarios = async () => {
    const response = await listUsers();
    if (response && response.status === 200)
      setUsuarios([
        { c_codigousuario: "T", c_nombres: "TODOS" },
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
    if (companias.length !== 0) {
      handleSeleccionarCompania(companias[0].c_compania);
      setAgencia("T");
    }
  }, [companias]);

  useEffect(async () => {
    await setIsLoading(true);
    await getCompanias();
    await getUsuarios();
    getPeriodoDefualt();
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
            items={tipos}
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
            disabledElement={true}
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
          <ReactSelect
            inputId="usuarioCodeId"
            labelText="Usuario"
            placeholder="Seleccione un Usuario"
            valueSelected={usuarioOperacion}
            data={usuarios}
            handleElementSelected={setUsuarioOperacion}
            optionField="c_nombres"
            valueField="c_codigousuario"
            classForm="col-12 col-md-6"
            marginForm="ml-0"
          />
          <div className={`form-group col-12 row`}>
            <label className={`col-12 col-form-label label-input`}>
              ¿Generar pdf?
            </label>
            <div className="col-12">
              <Radio.Group
                onChange={(e) => setIsPdfGenerated(e.target.value)}
                value={isPdfGenerated}
              >
                <Radio value={true}>SI</Radio>
                <Radio value={false}>NO</Radio>
              </Radio.Group>
            </div>
          </div>
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
            <ButtonDownloadExcel
              fileName="reporteFlujoCaja"
              sheet="reporte"
              columns={columnsExportExcel}
              content={dataReportToTable}
            />
          </Space>
        </div>
        {isPdfGenerated ? (
          <div className="col-12">
            {elementPdf ? (
              <PDFViewer
                className="col-12"
                style={{ height: "800px" }}
                children={
                  <ReporteTransaccionesPdfComponent
                    data={elementPdf.data}
                    dataHeadPdf={elementPdf.dataHeadPdf}
                    total={elementPdf.total}
                  />
                }
              />
            ) : (
              <div className="text-center">
                <h2>No se a realizado una búsqueda</h2>
              </div>
            )}
          </div>
        ) : (
          <div className="row" style={{ overflow: "hidden" }}>
            <div className="col" style={{ overflow: "scroll" }}>
              <Table
                classForm
                columns={columnsTable}
                dataSource={dataReportToTable || []}
                pagination={{ pageSize: 50 }}
              />
            </div>
          </div>
        )}
      </ReportContainer>
      {isLoading === true && <LoadingModal />}
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

export default ReporteTransaccionesTienda;
