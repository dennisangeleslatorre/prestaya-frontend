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
  listUsers,
  listAllTipoMovimientoCajaTienda,
  getReporteFlujoTiendaMovimientos,
} from "../../Api/Api";
import moment from "moment";
import UserContext from "../../context/UserContext/UserContext";
import ReporteFlujoCajaTiendaPdf from "../../components/ReactPDF/ReporteFlujoCajaTiendaPdf";
import { Radio, Table } from "antd";
import { separator } from "../../utilities/Functions/FormatNumber";

const columnsExportExcel = [
  {
    label: "NRO",
    value: (row) => row.n_correlativo || "",
  },
  {
    label: "FECHA",
    value: (row) => moment(row.fechamov).format("DD/MM/yyyy") || "",
  },
  {
    label: "OBSERVACIONES DIA",
    value: (row) => row.observacionesdia || "",
  },
  {
    label: "ESTADO",
    value: (row) => row.estado || "",
  },
  {
    label: "SEC.",
    value: (row) => row.sec || "",
  },
  {
    label: "TIPO MOVIMIENTO",
    value: (row) => row.c_tipomovimientoctd_desc || "",
  },
  {
    label: "USUARIO MOV.",
    value: (row) => row.c_usuariomovimiento || "",
  },
  {
    label: "OBSERVACIONES MOV",
    value: (row) => row.observacionesmov || "",
  },
  {
    label: "MNTO. TOTAL",
    value: (row) => (row.montototal ? row.montototal : ""),
  },
  {
    label: "FUENTE",
    value: (row) => row.fuente || "",
  },
  {
    label: "# DOC TRANSACCION",
    value: (row) => row.doc_transaccion || "",
  },
  {
    label: "AGENCIA O/D",
    value: (row) => row.agenciadesc || "",
  },
];

const columnsTable = [
  {
    title: "NRO",
    dataIndex: "n_correlativo",
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: "FECHA",
    dataIndex: "fechamov",
    width: 130,
    render: (fechamov) => <span>{moment(fechamov).format("DD/MM/yyyy")}</span>,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: "OBSERVACIONES DIA",
    dataIndex: "observacionesdia",
    ellipsis: {
      showTitle: false,
    },
    width: 400
  },
  {
    title: "ESTADO",
    dataIndex: "estado",
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: "SEC.",
    dataIndex: "sec",
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: "TIPO MOVIMIENTO",
    dataIndex: "c_tipomovimientoctd_desc",
    ellipsis: {
      showTitle: false,
    },
    width: 300
  },
  {
    title: "USUARIO MOV.",
    dataIndex: "c_usuariomovimiento",
    ellipsis: {
      showTitle: false,
    },
    width: 130
  },
  {
    title: "OBSERVACIONES MOV",
    dataIndex: "observacionesmov",
    ellipsis: {
      showTitle: false,
    },
    width: 500
  },
  {
    title: "MNTO. TOTAL",
    dataIndex: "montototal",
    render: (montototal) => (
      <span>{separator(Number(montototal).toFixed(2))}</span>
    ),
    ellipsis: {
      showTitle: false,
    },
    width: 200
  },
  {
    title: "FUENTE",
    dataIndex: "fuente",
    ellipsis: {
      showTitle: false,
    },
    width: 300
  },
  {
    title: "# DOC TRANSACCION",
    dataIndex: "doc_transaccion",
    ellipsis: {
      showTitle: false,
    },
    width: 200
  },
  {
    title: "AGENCIA O/D",
    dataIndex: "agenciadesc",
    ellipsis: {
      showTitle: false,
    },
    width: 300
  },
];

const estados = [
  { name: "TODOS", value: "T" },
  { name: "ABIERTO", value: "A" },
  { name: "CERRADO", value: "C" },
];

const tiposCajaTienda = [{ name: "BOVEDA", value: "B" }];

const fuentes = [
  { name: "TODOS", value: "T" },
  { name: "CAJA FLUJO TIENDA", value: "CT" },
  { name: "TRANSACCIONES TIENDA", value: "TT" },
];

const clasesTipoMov = [
  { name: "TODAS", value: "T" },
  { name: "INGRESOS", value: "I" },
  { name: "SALIDAS", value: "S" },
];

const monedas = [
  { name: "TODAS", value: "T" },
  { name: "LOCAL", value: "L" },
  { name: "EXTERIOR", value: "E" },
];

const ReporteFlujoCajaTienda = () => {
  // Estados
  const [compania, setCompania] = useState("T");
  const [agencia, setAgencia] = useState("T");
  const [moneda, setMoneda] = useState("T");
  const [usuarioFT, setUsuarioFT] = useState("T");
  const [tipoCajaTienda, setTipoCajaTienda] = useState("B");
  const [fechaMovimiento, setFechaMovimiento] = useState({
    fechaInicio: "",
    fechaFin: "",
    isValid: false,
  });
  const [enabledFechaMovimiento, setEnabledFechaMovimiento] = useState(true);
  const [estadoDia, setEstadoDia] = useState("T");
  const [fuente, setFuente] = useState("T");
  const [tipoMovimiento, setTipoMovimiento] = useState("T");
  const [claseTipoMov, setClaseTipoMov] = useState("T");
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfGenerated, setIsPdfGenerated] = useState(true);
  //Datos del reporte
  const [elementPdf, setElementPdf] = useState(null);
  const [movimientosFlujoTienda, setMovimientosFlujoTienda] = useState({});
  const [totalesFlujoTienda, setTotalesFlujoTienda] = useState({});
  //Lista
  const [companias, setCompanias] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tiposMovimientos, setTiposMovimientos] = useState([]);
  //Estados del pdf
  const [dataReportToTable, setDataReportToTable] = useState([]);
  //Contexto
  const { getUserData } = useContext(UserContext);
  const userLogedIn = getUserData().c_codigousuario;

  //Prepare
  const prepareBodyToSearch = () => {
    let body = {};
    if (compania) body.c_compania = compania;
    if (agencia && agencia !== "T") body.c_agencia = agencia;
    if (moneda && moneda !== "T") body.c_moneda = moneda;
    if (tipoCajaTienda && tipoCajaTienda !== "T")
      body.c_tipofctienda = tipoCajaTienda;
    if (usuarioFT && usuarioFT !== "T") body.c_tusuariofcu = usuarioFT;
    if (fechaMovimiento.isValid && !enabledFechaMovimiento) {
      body.d_fechamovimientoinicio = fechaMovimiento.fechaInicio;
      body.d_fechamovimientofin = fechaMovimiento.fechaFin;
    }
    if (estadoDia && estadoDia !== "T") body.c_estado_dia = estadoDia;
    if (fuente && fuente !== "T") body.c_fuente = fuente;
    if (tipoMovimiento && tipoMovimiento !== "T")
      body.c_tipomovimiento = tipoMovimiento;
    if (claseTipoMov && claseTipoMov !== "T")
      body.c_clasetipomov = claseTipoMov;
    body.c_codigousuario = userLogedIn;
    return body;
  };
  //Evento
  const handleSeleccionarCompania = (value) => {
    setCompania(value);
    //Deberia buscar las agencias de la compañía
    getAgenciasByCompany(value);
  };
  const onHandleClickSearch = async () => {
    await setIsLoading(true);
    await onHandleSearch();
    setIsLoading(false);
  };
  //Funciones
  const getCompanias = async () => {
    const response = await listAllCompanias();
    if (response && response.status === 200) setCompanias(response.body.data);
  };
  const getUsuarios = async () => {
    const response = await listUsers();
    if (response && response.status === 200)
      setUsuarios([
        { c_codigousuario: "T", c_nombres: "TODOS" },
        ...response.body.data,
      ]);
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
  const getTiposMovimientosCajaTienda = async () => {
    const response = await listAllTipoMovimientoCajaTienda();
    if (response && response.status === 200 && response.body.data) {
      let responseList = response.body.data.sort((a, b) => {
        if (a.c_clasetipomov > b.c_clasetipomov) return 1;
        else if (a.c_clasetipomov < b.c_clasetipomov) return -1;
        else {
          if (a.c_descricpion > b.c_descricpion) return 1;
          else if (a.c_descricpion < b.c_descricpion) return -1;
          return 0;
        }
      });
      setTiposMovimientos([
        { c_tipomovimientocc: "T", c_descricpion: "TODAS" },
        ...responseList,
      ]);
    }
  };
  const onHandleSearch = async () => {
    await setIsLoading(true);
    let parametros = prepareBodyToSearch();
    const response = await getReporteFlujoTiendaMovimientos(parametros);
    if (response && response.status === 200) {
      const movimientos = JSON.parse(JSON.stringify(response.body.data));
      transformDataForPdf(movimientos);
      setElementPdf({
        companianame: companias.find((c) => c.c_compania === compania)
          .c_descripcion,
        fechaMovimientoInicio: fechaMovimiento.fechaInicio
          ? moment(fechaMovimiento.fechaInicio).format("DD/MM/yyyy")
          : "-",
        fechaMovimientoFinal: fechaMovimiento.fechaFin
          ? moment(fechaMovimiento.fechaFin).format("DD/MM/yyyy")
          : "-",
        clase: clasesTipoMov.find((c) => c.value === claseTipoMov).name,
        usuarioFT: usuarios.find((u) => u.c_codigousuario === usuarioFT)
          .c_nombres,
      });
      setDataReportToTable([...movimientos]);
    } else {
      setDataReportToTable([]);
    }
  };

  const transformDataForPdf = (movimientos) => {
    const nuevoArray = [];
    let sumastotales = {
      suma_montototal: 0.0,
    };
    [...movimientos].forEach((item) => {
      if (
        nuevoArray.findIndex(
          (fc) => fc.cod === `${item.c_compania}-${item.n_correlativo}`
        ) < 0
      ) {
        nuevoArray.push({
          cod: `${item.c_compania}-${item.n_correlativo}`,
          agencia: item.agenciadesc,
          usuarioFlujoCajaTienda: item.c_usuariofctienda,
          tipoCajaUsuario: item.tipofcu,
          moneda: item.moneda,
          fechaInicio: moment(item.d_fechaInicioMov).format("DD/MM/yyyy"),
          fechaFin: moment(item.d_fechaFinMov).format("DD/MM/yyyy"),
          sumas: {
            suma_montototal: 0.0,
          },
          fechas: [],
        });
      }
      const indexfc = nuevoArray.findIndex(
        (fc) => fc.cod === `${item.c_compania}-${item.n_correlativo}`
      );

      if (
        nuevoArray[indexfc].fechas.findIndex(
          (fecha) => fecha.fecha === item.fechamov
        ) < 0
      ) {
        nuevoArray[indexfc].fechas.push({
          fecha: item.fechamov,
          estado: item.estado,
          observacion: item.observacionesdia,
          movimientos: [],
        });
      }

      const indexFecha = nuevoArray[indexfc].fechas.findIndex(
        (fecha) => fecha.fecha === item.fechamov
      );
      nuevoArray[indexfc].fechas[indexFecha].movimientos.push({
        secuencia: item.sec,
        tipomovimiento: item.c_tipomovimientoctd_desc,
        usuariomov: item.c_usuariomovimiento,
        observacion: item.observacionesmov,
        montomov: item.montototal,
        clasemov: item.c_clasetipomov,
        fuente: item.fuente,
        docTransaccion: item.doc_transaccion || "",
        agenciarelacioanda: item.agenciadesc ? item.agenciadesc : "",
      });

      nuevoArray[indexfc].sumas.suma_montototal =
        nuevoArray[indexfc].sumas.suma_montototal +
        (item.montototal
          ? item.c_clasetipomov === "S"
            ? Number(item.montototal) * -1
            : Number(item.montototal)
          : 0);

      sumastotales.suma_montototal =
        sumastotales.suma_montototal +
        +(item.montototal
          ? item.c_clasetipomov === "S"
            ? Number(item.montototal) * -1
            : Number(item.montototal)
          : 0);
    });

    setMovimientosFlujoTienda(nuevoArray);
    setTotalesFlujoTienda(sumastotales);
  };

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
    await getTiposMovimientosCajaTienda();
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
            handleElementSelected={handleSeleccionarCompania}
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
          />
          <ReactSelect
            inputId="usuarioCodeId"
            labelText="Usuario"
            placeholder="Seleccione un Usuario"
            valueSelected={usuarioFT}
            data={usuarios}
            handleElementSelected={setUsuarioFT}
            optionField="c_nombres"
            valueField="c_codigousuario"
            classForm="col-12 col-md-6"
            marginForm="ml-0"
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
          />
          <SelectComponent
            labelText="Estado día"
            defaultValue="Seleccione un estado"
            items={estados}
            selectId="estadoDiaId"
            valueField="value"
            optionField="name"
            valueSelected={estadoDia}
            handleChange={setEstadoDia}
            classForm="col-12 col-md-6"
            marginForm="ml-0"
          />
          <SelectComponent
            labelText="Fuente"
            defaultValue="Seleccione una fuente"
            items={fuentes}
            selectId="fuenteId"
            valueField="value"
            optionField="name"
            valueSelected={fuente}
            handleChange={setFuente}
            classForm="col-12 col-md-6"
            marginForm="ml-0"
          />
          <SelectComponent
            labelText="Tipos Movimientos"
            defaultValue="Seleccione un tipo"
            items={tiposMovimientos}
            selectId="tipoMovId"
            valueField="c_tipomovimientoctd"
            optionField="c_descricpion"
            valueSelected={tipoMovimiento}
            handleChange={setTipoMovimiento}
            classForm="col-12 col-md-6"
            marginForm="ml-0"
          />
          <SelectComponent
            labelText="Clase Tipo Mov."
            defaultValue="Seleccione una clase"
            items={clasesTipoMov}
            selectId="claseTipoId"
            valueField="value"
            optionField="name"
            valueSelected={claseTipoMov}
            handleChange={setClaseTipoMov}
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
        <ButtonDownloadExcel
          fileName="reporteFlujoCajaTienda"
          sheet="reporte"
          columns={columnsExportExcel}
          content={dataReportToTable}
        />
        {isPdfGenerated ? (
          <div className="col-12">
            {elementPdf ? (
              <PDFViewer
                className="col-12"
                style={{ height: "800px" }}
                children={
                  <ReporteFlujoCajaTiendaPdf
                    general={elementPdf}
                    movimientosFlujoTienda={movimientosFlujoTienda}
                    totalesFlujoTienda={totalesFlujoTienda}
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
                dataSource={dataReportToTable}
                pagination={{ pageSize: 50 }}
              />
            </div>
          </div>
        )}
      </ReportContainer>
      {isLoading === true && <Loading />}
    </>
  );
};

export default ReporteFlujoCajaTienda;
