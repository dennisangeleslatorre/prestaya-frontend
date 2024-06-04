import React, { useState, useEffect, useContext } from "react";
import ReportContainer from "../../components/ReportContainer/ReportContainer";
import DateRangeComponent from "../../components/DateRangeComponent/DateRangeComponent";
import ReactSelect from "../../components/ReactSelect/ReactSelect";
import SelectComponent from "../../components/SelectComponent/SelectComponent";
import Loading from "../../components/Modal/LoadingModal";
import { PDFViewer } from "@react-pdf/renderer";
import ButtonDownloadExcel from "../../components/ButtonDownloadExcel/ButtonDownloadExcel";
import {
  listAllCompanias,
  listAgenciesByUserAndCompany,
  getSubtipoProductoByTipo,
  listTiposProducto,
  listUbicacionesByCodigo,
  getReporteProductoStockTransaccion,
} from "../../Api/Api";
import ReporteProductosTiendaPdf from "../../components/ReactPDF/ReporteProductosTiendaPdf";
import moment from "moment";
import UserContext from "../../context/UserContext/UserContext";
import SearcherComponent from "../../components/SearcherComponent/SearcherComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import NumberRangeComponent from "../../components/NumberRangeComponent/NumberRangeComponent";
import LoadingModal from "../../components/Modal/LoadingModal";
import SearchModalProducto from "../../components/Modal/SearchModalProducto";

const columnsExportExcel = [
  {
    label: "AGENCIA",
    value: (row) => row.agencia_desc || "",
  },
  {
    label: "PRODUCTO ",
    value: (row) => row.c_item || "",
  },
  {
    label: "DESCRICPION",
    value: (row) => row.c_descripcionproducto || "",
  },
  {
    label: "UNIDAD",
    value: (row) => row.c_unidadmedida || "",
  },
  {
    label: "STOCK",
    value: (row) => Number(row.stock).toFixed(2) || "",
  },
  {
    label: "UNICACIÓN",
    value: (row) => row.ubicacion_desc || "",
  },
  {
    label: "F. INGRESO",
    value: (row) => moment(row.fechaingresa).format("DD/MM/yyyy") || "",
  },
  {
    label: "C. ING",
    value: (row) => row.cantidad_ingreso || "",
  },
  {
    label: "F. SALIDA",
    value: (row) =>
      row.fechasalida ? moment(row.fechasalida).format("DD/MM/yyyy") : "",
  },
  {
    label: "C. SALIDA",
    value: (row) => row.cantidad_salida || "",
  },
  {
    label: "ANTIGUEDAD (DÍAS)",
    value: (row) => row.tiempo_transcurrido_dias || "",
  },
  {
    label: "PRECIO PROM. S/.",
    value: (row) => Number(row.precio).toFixed(2) || "",
  },
  {
    label: "TIPO PRODUCTO",
    value: (row) => row.descripciontipo || "",
  },
  {
    label: "SUBTIPO PRODUCTO",
    value: (row) => row.descripcionsubtipo || "",
  },
  {
    label: "PESO BRUTO",
    value: (row) => row.n_pesobruto || "",
  },
  {
    label: "PESO NETO",
    value: (row) => row.n_pesoneto || "",
  },
  {
    label: "# PRESTAMO",
    value: (row) => row.c_prestamo || "",
  },
  {
    label: "ITEM ORIGEN",
    value: (row) => row.c_itemorigen || "",
  },
  {
    label: "ESTADO",
    value: (row) => row.c_estado || "",
  },
  {
    label: "OBSERVACIONES",
    value: (row) => row.producto_observaciones || "",
  },
];

const opciones = [
  { name: "TODAS", value: "T" },
  { name: "SI", value: "S" },
  { name: "NO", value: "N" },
];

const opcionesStock = [
  { name: "TODAS", value: "T" },
  { name: "Con Stock", value: "S" },
  { name: "Sin Stock", value: "N" },
];

const estados = [
  { name: "TODOS", value: "T" },
  { name: "ACTIVO", value: "A" },
  { name: "INACTIVO", value: "I" },
];

const ReporteProductosTienda = () => {
  const { getUserData } = useContext(UserContext);
  const userLogedIn = getUserData().c_codigousuario;
  //Estados
  const [compania, setCompania] = useState("");
  const [agencia, setAgencia] = useState("T");
  const [tipoProducto, setTipoProducto] = useState("T");
  const [codigoProducto, setCodigoProducto] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [estado, setEstado] = useState("T");
  const [subtipo, setSubtipo] = useState("T");
  const [ubicacion, setUbicacion] = useState("T");
  const [prestamo, setPrestamo] = useState({ value: "" });
  const [fechaActual, setFechaActual] = useState({
    value: moment().format("yyyy-MM-DD"),
  });
  const [tieneStock, setTieneStock] = useState("T");
  const [deshabilitaAntiguedad, setDeshabilitaAntiguedad] = useState(true);
  const [antiguedad, setAntiguedad] = useState({
    inicio: 0,
    fin: 0,
    isValid: false,
  });
  const [tieneUbicacion, setTieneUbicacion] = useState("T");
  // Listas
  const [companias, setCompanias] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [tiposProducto, setTiposProducto] = useState([]);
  const [subtipos, setSubtipos] = useState([
    { c_subtipoproducto: "T", c_descripcion: "TODOS" },
  ]);
  const [ubicaciones, setUbicaciones] = useState([
    { c_descripcion: "TODOS", c_ubicacion: "T" },
  ]);
  // Form
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataReportToTable, setDataReportToTable] = useState([]);
  const [elementPdf, setElementPdf] = useState(null);
  const [general, setGeneral] = useState({
    fechaActual: "",
    tieneStock: "",
    agencia: "",
    ubicacion: "",
    estado: ""
  });

  const prepareBodyToSearch = () => {
    let body = {};
    let filters = {};
    if (compania) body.c_compania = compania;
    if (agencia && agencia !== "T") {
      body.c_agencia = agencia;
      filters.agencia = agencias.find(
        (item) => item.c_agencia === agencia
      ).c_descripcion;
    }
    if (tipoProducto && tipoProducto !== "T")
      body.c_tipoproducto = tipoProducto;
    if (codigoProducto) body.c_producto = codigoProducto;
    if (estado && estado !== "T") body.c_estado = estado;
    filters.estado = estados.find(e => e.value === estado).name;
    if (subtipo && subtipo !== "T") body.subtipoproducto = subtipo;
    if (ubicacion && ubicacion !== "T") {
      body.c_ubicacion = ubicacion;
      filters.ubicacion = ubicaciones.find(
        (item) => item.c_ubicacion === ubicacion
      ).c_descripcion;
    } else {
      filters.ubicacion = "-";
    }
    if (prestamo && prestamo.value) body.c_prestamo = prestamo.value;
    if (fechaActual.value) {
      body.d_fechaactual = fechaActual.value;
      filters.fechaActual = fechaActual.value;
    } else {
      body.d_fechaactual = moment();
      filters.fechaActual = moment();
    }
    if (tieneStock && tieneStock !== "T") {
      body.c_stock = tieneStock;
      filters.tieneStock = tieneStock === "S" ? "SI" : "NO";
    } else {
      filters.tieneStock = "AMBOS";
    }
    if (antiguedad.isValid && !deshabilitaAntiguedad) {
      body.n_antiguedadinicio = antiguedad.inicio;
      body.n_antiguedadfin = antiguedad.fin;
    }
    if (tieneUbicacion && tieneUbicacion !== "T")
      body.c_tieneubicacion = tieneUbicacion;
    body.c_codigousuario = userLogedIn;
    setGeneral(filters);
    return body;
  };

  const onHandleSearch = async () => {
    let parametros = prepareBodyToSearch();
    const response = await getReporteProductoStockTransaccion(parametros);
    if (response && response.status === 200 && response.body.data) {
      const data = response.body.data;
      setDataReportToTable(data);
      getDataForPDF(data);
    } else {
      setDataReportToTable([]);
      getDataForPDF([]);
    }
  };

  const getDataForPDF = (datos) => {
    let element = {};
    const dataReportes = getLineasReportes(datos);
    element = { ...dataReportes };
    element.compania = companias.find(
      (item) => (item.c_compania = compania)
    ).c_descripcion;
    setElementPdf(element);
  };

  const getLineasReportes = (datos) => {
    return {lineasReporte: datos};
  };

  const onHandleClickSearch = async () => {
    await setIsLoading(true);
    await onHandleSearch();
    setIsLoading(false);
  };

  const findProductoByCode = async () => {
    setIsLoading(true);
    if (codigoProducto) {
      const response = await getProductoDinamico({
        c_compania: compania,
        c_agencia: agencia !== "T" ? agencia : null,
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

  //Servicios
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
  const getTiposProducto = async () => {
    const response = await listTiposProducto();
    if (response && response.status === 200)
      setTiposProducto([
        { c_descripcion: "TODOS", c_tipoproducto: "T" },
        ...response.body.data,
      ]);
  };
  const getSubtipos = async (c_tipoproducto) => {
    try {
      const response = await getSubtipoProductoByTipo(c_tipoproducto);
      if (response && response.status === 200)
        setSubtipos([
          { c_subtipoproducto: "T", c_descripcion: "TODOS" },
          ...response.body.data,
        ]);
      else setSubtipos([]);
    } catch (e) {
      setSubtipos([]);
    }
  };
  const getUbicacionesByAgencia = async (c_agencia) => {
    const response = await listUbicacionesByCodigo({
      c_compania: compania,
      c_agencia: c_agencia,
    });
    if (response && response.status === 200 && response.body.data) {
      setUbicaciones([
        { c_descripcion: "TODOS", c_ubicacion: "T" },
        ...response.body.data,
      ]);
    }
  };

  const handleSelectCompania = async (c_compania) => {
    setCompania(c_compania);
    setAgencia("");
    await getAgenciasByCompany(c_compania);
  };

  const handleSelectAgencia = async (c_agencia) => {
    setAgencia(c_agencia);
    setUbicacion("T");
    await getUbicacionesByAgencia(c_agencia);
  };

  const handleSelectTipo = async (c_tipoproducto) => {
    setTipoProducto(c_tipoproducto);
    setSubtipo("T");
    await getSubtipos(c_tipoproducto);
  };

  useEffect(() => {
    if (productoSeleccionado) {
      setCodigoProducto(productoSeleccionado.c_item);
      setNombreProducto(productoSeleccionado.c_descripcionproducto);
    }
  }, [productoSeleccionado]);

  useEffect(() => {
    if (companias.length !== 0 && !compania) {
      handleSelectCompania(companias[0].c_compania);
    }
  }, [companias]);

  useEffect(async () => {
    await setIsLoading(true);
    await getCompanias();
    await getTiposProducto();
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
            handleElementSelected={handleSelectCompania}
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
            handleElementSelected={handleSelectAgencia}
            optionField="c_descripcion"
            valueField="c_agencia"
            classForm="col-12 col-md-6"
            marginForm="ml-0"
          />
          <ReactSelect
            inputId="tiposId"
            labelText="Tipos de producto"
            placeholder="Seleccione un tipo"
            valueSelected={tipoProducto}
            data={tiposProducto}
            handleElementSelected={handleSelectTipo}
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
            onHandleClick={() => setOpenSearchModal(true)}
            onHandleBlur={findProductoByCode}
            readOnly={true}
            classForm="col-12 col-md-6"
            marginForm="ml-0"
            searchWidth={5}
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
          <ReactSelect
            inputId="subtiposId"
            labelText="Subtipo"
            placeholder="Seleccione un subtipo"
            valueSelected={subtipo}
            data={subtipos}
            handleElementSelected={setSubtipo}
            optionField="c_descripcion"
            valueField="c_subtipoproducto"
            classForm="col-12 col-lg-6"
            marginForm="ml-0"
          />
          <ReactSelect
            inputId="ubicacionId"
            labelText="Ubicación"
            placeholder="Seleccione una ubicación"
            valueSelected={ubicacion}
            data={ubicaciones}
            handleElementSelected={setUbicacion}
            optionField="c_descripcion"
            valueField="c_ubicacion"
            classForm="col-12 col-lg-6"
            marginForm="ml-0"
          />
          <InputComponent
            state={prestamo}
            setState={setPrestamo}
            type="text"
            label="# Prestamo"
            placeholder="# Prestamo"
            inputId="nPrestamoInput"
            classForm="col-12 col-md-6"
            marginForm="ml-0"
          />
          <InputComponent
            label="Fecha Actual"
            state={fechaActual}
            setState={setFechaActual}
            type="date"
            placeholder="Fecha Actual"
            inputId="fechaActualId"
            classForm="col-12 col-md-6"
            marginForm="ml-0"
          />
          <SelectComponent
            labelText="Con stock"
            defaultValue="Seleccione una opción"
            items={opcionesStock}
            selectId="stockId"
            valueField="value"
            optionField="name"
            valueSelected={tieneStock}
            handleChange={setTieneStock}
            classForm="col-12 col-md-6"
            marginForm="ml-0"
          />
          <NumberRangeComponent
            inputId="antiguedadId"
            labelText="Antigüedad (dias)"
            state={antiguedad}
            setState={setAntiguedad}
            checked={deshabilitaAntiguedad}
            setChecked={setDeshabilitaAntiguedad}
            classForm="col-12 col-md-6"
            marginForm="ml-0"
          />
          <SelectComponent
            labelText="Tiene Ubicación"
            defaultValue="Seleccione una opción"
            items={opciones}
            selectId="tieneUbicacionId"
            valueField="value"
            optionField="name"
            valueSelected={tieneUbicacion}
            handleChange={setTieneUbicacion}
            classForm="col-12 col-lg-6"
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
        <ButtonDownloadExcel
          fileName="reporteProductosTienda"
          sheet="reporte"
          columns={columnsExportExcel}
          content={dataReportToTable}
        />
        <div className="col-12">
          {elementPdf ? (
            <PDFViewer
              className="col-12"
              style={{ height: "800px" }}
              children={
                <ReporteProductosTiendaPdf
                  element={elementPdf}
                  general={general}
                />
              }
            />
          ) : (
            <div className="text-center">
              <h2>No se a realizado una búsqueda</h2>
            </div>
          )}
        </div>
      </ReportContainer>
      {isLoading === true && <LoadingModal />}
      <SearchModalProducto
        isOpen={openSearchModal}
        onClose={() => setOpenSearchModal(false)}
        setProductoObtained={setProductoSeleccionado}
        compania={compania}
        agencia={agencia}
        userLogedIn={userLogedIn}
      />
    </>
  );
};

export default ReporteProductosTienda;
