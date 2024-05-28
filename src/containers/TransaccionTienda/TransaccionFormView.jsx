import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import moment from "moment";
import { Table } from "antd";
//Componentes
import FormContainer from "../../components/FormContainer/FormContainer";
import ResponseModal from "../../components/Modal/ResponseModal";
import Loading from "../../components/Modal/LoadingModal";
import InputComponentView from "../../components/InputComponent/InputComponentView";
import InputComponent from "../../components/InputComponent/InputComponent";
import SelectComponent from "../../components/SelectComponent/SelectComponent";
import PeriodoInputComponent from "../../components/PeriodoInputComponent/PeriodoInputComponent";
import SearcherComponent from "../../components/SearcherComponent/SearcherComponent";
//Functions
import {
  getTransaccionCabecera,
  getTransaccionDetalle,
} from "../../Api/Comercial/transacciones.service";
import { columnsForm as columns, currencies } from "./configData";
import TextareaComponent from "../../components/TextareaComponent/TextareaComponent";

const TransaccionFormView = () => {
  //Estados del formulario
  const [isLoading, setIsLoading] = useState(false);
  const [openResponseModal, setOpenResponseModal] = useState(false);
  const [responseData, setResponseData] = useState({ title: "", message: "" });
  //Campos
  const [agenciaNombre, setAgenciaNombre] = useState("");
  const [companiaNombre, setCompaniaNombre] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDoc, setNumeroDoc] = useState("");
  const [estado, setEstado] = useState("RE");
  const [fechaDocumento, setFechaDocumento] = useState({ value: "" });
  const [periodo, setPeriodo] = useState("");
  const [codigoCliente, setCodigoCliente] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [moneda, setMoneda] = useState("L");
  const [montoTotal, setMontoTotal] = useState("0.00");
  const [dataTableDetalles, setDataTableDetalles] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const [usuarioOperacion, setUsuarioOperacion] = useState("");
  const [usuarioFCTienda, setUsuarioFCTienda] = useState("");
  const [agenciaRelacionada, setAgenciaRelacionada] = useState("");
  const [usuarioFCTiendaRelacionado, setUsuarioFCTiendaRelacionado] =
    useState("");
  const [nombreProveedor, setNombreProveedor] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("");

  //Contextos
  const { compania, agencia, tipodocumento, numerodocumento } = useParams();
  let history = useHistory();

  const handleClick = () => {
    history.push("/transacionestienda");
  };

  const getData = async () => {
    const responseCabecera = await getTransaccionCabecera({
      c_compania: compania,
      c_agencia: agencia,
      c_tipodocumento: tipodocumento,
      c_numerodocumento: numerodocumento,
    });
    if (
      responseCabecera.status === 200 &&
      responseCabecera.body &&
      responseCabecera.body.data
    ) {
      const data = responseCabecera.body.data;
      setCompaniaNombre(data.compania_desc || "");
      setAgenciaNombre(data.agencia_desc || "");
      setNumeroDoc(data.c_numerodocumento || "");
      setTipoDocumento(
        data.c_tipodocumento === "NI" ? "NOTA INGRESO" : "NOTA SALIDA"
      );
      setEstado(data.c_estado === "RE" ? "REGISTRADO" : "ANULADO");
      setFechaDocumento({
        value: moment(data.d_fechadocumento).format("YYYY-MM-DD"),
      });
      setPeriodo(data.c_periodo || "");
      setCodigoCliente(data.n_cliente || "");
      setNombreCliente(data.c_nombrescompleto || "");
      setMoneda(data.c_moneda || "");
      setObservaciones(data.c_observaciones || "");
      setUsuarioOperacion(data.c_usuariooperacion || "");
      setUsuarioFCTienda(data.c_usuariofctienda || "");
      setAgenciaRelacionada(data.agencia_relacionada_desc || "");
      setUsuarioFCTiendaRelacionado(data.c_usuariofctiendarelacionado || "");
      setNombreProveedor(data.c_nombreproveedor || "");
      setTipoMovimiento(data.tipomov_desc || "");
      await getDetalles();
    } else {
      setResponseData({
        title: "Aviso",
        message:
          responseCabecera.body.message ||
          "Ocurrio un problema con el servicio",
      });
      setOpenResponseModal(true);
    }
  };

  const getDetalles = async () => {
    const responseDetalle = await getTransaccionDetalle({
      c_compania: compania,
      c_agencia: agencia,
      c_tipodocumento: tipodocumento,
      c_numerodocumento: numerodocumento,
    });
    if (
      responseDetalle.status === 200 &&
      responseDetalle.body &&
      responseDetalle.body.data
    ) {
      getDataTable(responseDetalle.body.data);
    } else {
      setResponseData({
        title: "Aviso",
        message:
          responseDetalle.body.message || "Ocurrio un problema con el servicio",
      });
      setOpenResponseModal(true);
    }
  };

  const getDataTable = (detalles) => {
    let total = 0;
    const detallesAux = detalles.map((item, index) => {
      let aux = item;
      aux.key = index;
      aux.n_cantidad = Number(item.n_cantidad).toFixed(2);
      aux.n_precio = Number(item.n_precio).toFixed(2);
      aux.n_montototal = Number(item.n_montototal).toFixed(2);
      aux.c_estado_desc = item.c_estado === "RE" ? "REGISTRADO" : "ANULADO";
      aux.c_observaciones = item.c_observacionesdet;
      aux.d_fecharegistro = moment(item.d_fecharegistro).format(
        "DD/MM/yyyy HH:MM:ss"
      );
      aux.d_ultimafechamodificacion = moment(
        item.d_ultimafechamodificacion
      ).format("DD/MM/yyyy HH:MM:ss");
      total = Number(
        Number(total) + Number(item.n_cantidad) * Number(item.n_precio)
      ).toFixed(2);
      return aux;
    });
    setDataTableDetalles(detallesAux);
    setMontoTotal(total);
  };

  useEffect(async () => {
    await setIsLoading(true);
    await getData();
    setIsLoading(false);
  }, []);

  return (
    <>
      <FormContainer
        buttonAttributes={{
          label: "Ir a lista",
          class: "btn btn-info btn-form",
        }}
        handleClick={handleClick}
        showButton={false}
        goList={() => history.push(`/transacionestienda`)}
        view={false}
      >
        <div className="col-12 row">
          <InputComponentView
            label="Compañía"
            state={companiaNombre}
            setState={setCompaniaNombre}
            type="text"
            placeholder="Compañía"
            inputId="companiaId"
            readOnly={true}
            classForm="col-12 col-lg-6"
          />
          <InputComponentView
            label="Agencia"
            state={agenciaNombre}
            setState={setAgenciaNombre}
            type="text"
            placeholder="Agencia"
            inputId="agenciaId"
            readOnly={true}
            classForm="col-12 col-lg-6"
          />
          <InputComponentView
            label="Tipo Doc"
            state={tipoDocumento}
            setState={setTipoDocumento}
            type="text"
            placeholder="Tipo Doc"
            inputId="tipoDocId"
            readOnly={true}
            classForm="col-12 col-lg-6"
          />
          <InputComponentView
            label="Numero Doc"
            state={numeroDoc}
            setState={setNumeroDoc}
            type="text"
            placeholder="Numero Doc"
            inputId="numeroDocID"
            readOnly={true}
            classForm="col-12 col-lg-6"
          />
          <InputComponentView
            label="Usuario Operación"
            state={usuarioOperacion}
            setState={setUsuarioOperacion}
            type="text"
            placeholder="Seleccione un usuario"
            inputId="usuarioOperacionId"
            readOnly={true}
            classForm="col-12 col-lg-6"
          />
          <InputComponentView
            label="Usuario Caja Tienda"
            state={usuarioFCTienda}
            setState={setUsuarioFCTienda}
            type="text"
            placeholder="Seleccione un usuario"
            inputId="usuarioCajaTiendaId"
            readOnly={true}
            classForm="col-12 col-lg-6"
          />
          <InputComponentView
            label="Estado"
            state={estado}
            setState={setEstado}
            type="text"
            placeholder="Estado"
            inputId="estadoId"
            readOnly={true}
            classForm="col-12 col-lg-6"
          />
          <InputComponent
            label="Fecha Doc"
            state={fechaDocumento}
            setState={setFechaDocumento}
            type="date"
            placeholder="Fecha Doc"
            inputId="fechaDocumentoId"
            classForm="col-12 col-lg-6"
            readOnly={true}
          />
          <PeriodoInputComponent
            label="Período"
            value={periodo}
            setState={setPeriodo}
            placeholder="Período"
            inputId="periodoId"
            classForm="col-12 col-lg-6"
            readOnly={true}
            marginForm=""
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
            readOnly={true}
            readOnlyCode={true}
            classForm="col-12 col-md-6"
            marginForm=""
          />
          <InputComponentView
            label="Agencia relacioanda"
            state={agenciaRelacionada}
            setState={setAgenciaRelacionada}
            type="text"
            placeholder="Seleccione una agencia"
            inputId="agenciarelacionadaId"
            readOnly={true}
            classForm="col-12 col-lg-6"
          />
          <InputComponentView
            label="Usuario Caja Relacionado"
            state={usuarioFCTiendaRelacionado}
            setState={setUsuarioFCTiendaRelacionado}
            type="text"
            placeholder="Seleccione un usuario"
            inputId="usuarioCajaRelacionadoId"
            readOnly={true}
            classForm="col-12 col-lg-6"
          />
          <InputComponentView
            label="Tipo Movimiento Caja"
            state={tipoMovimiento}
            setState={setTipoMovimiento}
            type="text"
            placeholder="Seleccione un tipo"
            inputId="tipoMocimientoCajaTiendaId"
            readOnly={true}
            classForm="col-12 col-lg-6"
          />
          <SelectComponent
            labelText="Moneda"
            defaultValue="Seleccione un moneda"
            items={currencies}
            selectId="monedaId"
            valueField="value"
            optionField="name"
            valueSelected={moneda}
            handleChange={setMoneda}
            disabledElement={true}
            classForm="col-12 col-lg-6"
          />
           <InputComponentView
            label="Nombre del proveedor"
            state={nombreProveedor}
            setState={setNombreProveedor}
            type="text"
            placeholder=""
            inputId="proveedorId"
            readOnly={true}
            classForm="col-12 col-lg-6"
          />
          <TextareaComponent
            inputId="observacionesId"
            label="Observaciones"
            placeholder="Observaciones"
            value={observaciones}
            setState={setObservaciones}
            max={500}
            classForm="col-12"
            labelSpace={0}
            labelLine={true}
            marginForm={""}
            readOnly={true}
          />
        </div>
        <div className="col-12 d-flex justify-content-end">
          <InputComponentView
            label="Monto Total"
            state={montoTotal}
            setState={setMontoTotal}
            type="text"
            placeholder="Monto total"
            inputId="montoTtoalId"
            readOnly={true}
            classForm="col-12 col-lg-6"
          />
        </div>
        <div className="col-12" style={{ overflow: "scroll" }}>
          <Table
            classForm
            columns={columns}
            dataSource={dataTableDetalles}
            pagination={{ pageSize: 50 }}
          />
        </div>
      </FormContainer>
      {isLoading === true && <Loading />}
      <ResponseModal
        isOpen={openResponseModal}
        title={responseData.title}
        onClose={() => setOpenResponseModal(false)}
        message={responseData.message}
        buttonLink={responseData.url}
      />
    </>
  );
};

export default TransaccionFormView;
