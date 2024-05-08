import React, { useCallback, useContext, useEffect, useState } from "react";
import { Table, Space, Button, Tooltip } from "antd";
import moment from "moment";
import { useHistory, useLocation } from "react-router";
//Componentes
import SelectComponent from "../../components/SelectComponent/SelectComponent";
import InputComponentView from "../../components/InputComponent/InputComponentView";
import TextareaComponent from "../../components/TextareaComponent/TextareaComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import HeaderForm from "../../components/HeaderForm/HeaderForm";
// import FlujoCajaDetalleMovimientoForm from "../../components/FlujoCajaUsuarioModal/FlujoCajaDetalleMovimientoForm";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import ResponseModal from "../../components/Modal/ResponseModal";
import Loading from "../../components/Modal/LoadingModal";
import WrapperForm from "./components/WrapperForm";
//Context
import CajaTiendaContext from "../../context/CajaTiendaContext/CajaTiendaContext";
import PagesContext from "../../context/PagesContext/PagesContext";
//Funciones
import { listTipoMovimientoCajaTienda, listAgencias, listTiposDocumento } from "../../Api/Api";
import { separator } from "../../utilities/Functions/FormatNumber";
import { columns, estadosCajaTiendaDia } from "./config/FlujoCajaTiendaDiaMovimientos";
import FlujoCajaTiendaDetalleMovimientoForm from "./components/FlujoCajaTiendaDetalleMovimientoForm";

const FormCajaTiendaDiaMovimientos = () => {
  let history = useHistory();
  let location = useLocation();
  const urlFragment = location.pathname.split("/")[1];
  const {
    flujoCajaTienda,
    setFlujoCajaTienda,
    detalleSeleccionado,
    setDetalleSeleccionado,
    setMovimientoSeleccionado,
    detalles,
    setDetalles,
    eliminarMovimientos,
    setEliminarMovimientos,
  } = useContext(CajaTiendaContext);
  const { getPagesKeysForUser } = useContext(PagesContext);
  const userPermisssions = getPagesKeysForUser().filter((item) => {
    return item === "USUARIO ACCESO TOTAL CAJA TIENDA";
  });
  const usuarioAccesoTotalCajaPermiso = userPermisssions.includes(
    "USUARIO ACCESO TOTAL CAJA TIENDA"
  );
  // Estados
  const [compania, setCompania] = useState("");
  const [nroCorrelativo, setNroCorrelativo] = useState("");
  const [fechaMov, setFechaMov] = useState({ value: "", isValid: false });
  const [estado, setEstado] = useState("A");
  const [observaciones, setObservaciones] = useState("");
  const [usuarioRegistro, setUsuarioRegistro] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState("");
  const [usuarioModiciacion, setUsuarioModiciacion] = useState("");
  const [fechaModiciacion, setFechaModiciacion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [openResponseModal, setOpenResponseModal] = useState(false);
  const [openMovimientoModal, setOpenMovimientoModal] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openAlertConfirmationModal, setOpenAlertConfirmationModal] =
    useState(false);
  const [tiposMovimientos, setTiposMovimientos] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [elementSelectedRows, setElementSelectedRows] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  //Estados tablas
  const [movimientosCajaTabla, setMovimientosCajaTabla] = useState([]);
  const [saldoDia, setSaldoDia] = useState(0);

  //Validaciones
  const validDate = () => {
    let fechaInicio = moment(flujoCajaTienda.general.d_fechaInicioMov);
    let fechaFin = moment(flujoCajaTienda.general.d_fechaFinMov);
    let fechaMovMoment = moment(fechaMov.value);
    return fechaMovMoment.isBetween(fechaInicio, fechaFin, "days", "[]");
  };
  const showMessageValidationDate = () => {
    let fechaInicio = moment(flujoCajaTienda.general.d_fechaInicioMov);
    let fechaFin = moment(flujoCajaTienda.general.d_fechaFinMov);
    if (fechaMov.value) {
      if (!validDate())
        return (
          <div className="invalid__message__data">
            La fecha de movimiento debe estar en el rango:{" "}
            {fechaInicio.format("DD/MM/yyyy")} - {fechaFin.format("DD/MM/yyyy")}
          </div>
        );
    } else {
      return (
        <div className="invalid__message__data">
          Debe llenar la fecha de movimiento
        </div>
      );
    }
  };

  //Atributos de la tabla
  const rowSelection = {
    onChange: (selectedKeys, selectedRows) => {
      setElementSelectedRows(selectedRows);
      setSelectedRowKeys(selectedKeys);
    },
  };

  const prepareDetalle = useCallback(() => {
    return {
      general: {
        ...detalleSeleccionado.general,
        d_fechamov: fechaMov.value,
        c_estado: estado,
        c_observaciones: observaciones,
        is_updated: true,
      },
      movimientos: movimientos.map((item) => {
        item.d_fechamov = fechaMov.value;
        return item;
      }),
    };
  }, [detalleSeleccionado, fechaMov, estado, observaciones, movimientos]);

  const addDetalle = () => {
    const detalleAux = prepareDetalle();
    //Establece los valores
    setFlujoCajaTienda({ ...flujoCajaTienda, firstArrival: false });
    setDetalles([...detalles, detalleAux]);
    setDetalleSeleccionado({ general: {}, movimientos: [] });
    history.goBack();
  };

  //Funcion agregar
  const handleAgregarDetalle = () => {
    //Valida antes
    if (
      fechaMov.value &&
      validDate() &&
      observaciones &&
      movimientos.length !== 0
    ) {
      const validateFechaRegistrada = detalles.find(
        (item) => item.general.d_fechamov === fechaMov.value
      );
      if (!validateFechaRegistrada) {
        addDetalle();
      } else {
        setResponseData({
          title: "Aviso",
          message: "Hay un detalle registrado con esa fecha",
        });
        setOpenResponseModal(true);
      }
    } else {
      setResponseData({
        title: "Aviso",
        message: "Debe llenar el formulario superior y tener algún movimiento",
      });
      setOpenResponseModal(true);
    }
  };

  const updateDetalle = () => {
    const detalleAux = prepareDetalle();
    let detallesAux = [...detalles];
    detallesAux[Number(detalleSeleccionado.index)] = detalleAux;
    //Establece los valores
    setFlujoCajaTienda({ ...flujoCajaTienda, firstArrival: false });
    setDetalles(detallesAux);
    setDetalleSeleccionado({ general: {}, movimientos: [] });
    history.goBack();
  };

  const handleActualizarDetalle = () => {
    //Valida antes
    if (
      fechaMov.value &&
      validDate() &&
      observaciones &&
      movimientos.length !== 0
    ) {
      const validateFechaRegistrada = detalles.find(
        (item, index) =>
          item.general.d_fechamov === fechaMov.value &&
          index !== detalleSeleccionado.index
      );
      if (!validateFechaRegistrada) {
        updateDetalle();
      } else {
        setResponseData({
          title: "Aviso",
          message: "Hay un detalle registrado con esa fecha",
        });
        setOpenResponseModal(true);
      }
    } else {
      setResponseData({
        title: "Aviso",
        message: "Debe llenar el formulario superior y tener algún movimiento",
      });
      setOpenResponseModal(true);
    }
  };

  const handleCancelar = () => {
    setFlujoCajaTienda({ ...flujoCajaTienda, firstArrival: false });
    setDetalleSeleccionado({ general: {}, movimientos: [] });
    history.goBack();
  };

  const handleSelectNuevo = () => {
    if (fechaMov.value) {
      setOpenMovimientoModal(true);
      setMovimientoSeleccionado({
        general: {
          c_compania: detalleSeleccionado.general.c_compania,
          key: movimientos.length + 1,
        },
        action: "ADD",
      });
    } else {
      setOpenResponseModal(true);
      setResponseData({
        title: "Aviso",
        message: "Debe seleccionar una fecha",
      });
    }
  };

  const handleSelectActualizar = () => {
    if (selectedRowKeys.length > 0) {
      const movimientosAux = JSON.parse(JSON.stringify(movimientosCajaTabla));
      setMovimientoSeleccionado({
        general: {
          ...movimientosAux[selectedRowKeys[0] - 1],
        },
        action: "UPDATE",
      });
      setOpenMovimientoModal(true);
    } else {
      setResponseData({
        title: "Aviso",
        message: "Selecciona un item de la tabla",
      });
      setOpenResponseModal(true);
    }
  };

  const handleSelectDelete = () => {
    if (selectedRowKeys.length > 0) {
      if (elementSelectedRows[0].c_flagtransaccion === "S") {
        setResponseData({
          title: "Aviso",
          message:
            "No puedes eliminar un movimiento generado en el flujo de transacciones.",
        });
        setOpenResponseModal(true);
      } else {
        setOpenConfirmationModal(true);
      }
    } else {
      setResponseData({
        title: "Aviso",
        message: "Selecciona un item de la tabla",
      });
      setOpenResponseModal(true);
    }
  };

  const handleEliminar = () => {
    setOpenConfirmationModal(false);
    const movimientosAux = JSON.parse(JSON.stringify(movimientos)).filter(
      (item, index) => {
        if (index !== elementSelectedRows[0].key - 1) {
          return item;
        } else {
          if (item.d_fecharegistro)
            setEliminarMovimientos([
              ...eliminarMovimientos,
              { n_secuencia: item.n_secuencia, d_fechamov: fechaMov.value },
            ]);
        }
      }
    );
    setMovimientos(movimientosAux);
  };

  const getAgencias = async () => {
    const response = await listAgencias({
      c_compania: flujoCajaTienda.general.c_compania,
    });
    if (
      response &&
      response.status === 200 &&
      response.body?.data &&
      response.body.data.length > 0
    ) {
      setAgencias(response.body.data);
    }
  };

  const getTiposMovimientoCaja = async () => {
    const response = await listTipoMovimientoCajaTienda();
    if (response && response.status === 200) {
      let responseList = response.body.data.sort((a, b) => {
        if (a.c_clasetipomov > b.c_clasetipomov) return 1;
        else if (a.c_clasetipomov < b.c_clasetipomov) return -1;
        else {
          if (a.c_descricpion > b.c_descricpion) return 1;
          else if (a.c_descricpion < b.c_descricpion) return -1;
          return 0;
        }
      });
      setTiposMovimientos(responseList);
    }
  };

  const getTiposDocumentos = async () => {
    const response = await listTiposDocumento();
    if (response && response.status === 200) {
      setTiposDocumentos(response.body.data);
    }
  }

  const refreshList = useCallback(() => {
    let saldoAux = 0;
    const tableData = JSON.parse(JSON.stringify(movimientos)).map((item, index) => {
      let aux = item;
      aux.key = index+1;
      const tipoMov = tiposMovimientos.find(tipo => tipo.c_tipomovimientoctd === item.c_tipomovimientoctd)
      aux.c_tipomovimientoctd_desc = tipoMov.c_descricpion;
      aux.n_secuencia = item.n_secuencia;
      aux.n_montoxdiamov_format = item.n_montoxdiamov ? separator(Number(item.n_montoxdiamov).toFixed(2)) : "";
      aux.c_flagtransaccion_format = item.c_flagtransaccion === "S" ? "SI" : "NO";
      aux.d_fecharegistro_format = item.d_fecharegistro ? moment(item.d_fecharegistro).format("DD/MM/yyyy HH:mm:ss") : "";
      aux.d_ultimafechamodificacion_format = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy HH:mm:ss") : "";
      const tipoDocumento = tiposDocumentos.find(tipo => tipo.c_tipodocumento === item.c_tipodocumento);
      aux.c_tipodocumento_desc = tipoDocumento?.c_descricpion;
      saldoAux = saldoAux + Number(item.n_montoxdiamov ?  ( Number(item.n_montoxdiamov) * (tipoMov.c_clasetipomov === "I" ? 1 : -1) ) : 0);
      return aux;
    });
    setMovimientosCajaTabla(tableData);
    setSaldoDia(Number(saldoAux).toFixed(2));
  }, [movimientos, tiposMovimientos, tiposDocumentos]);

  const getData = useCallback(() => {
    setCompania(flujoCajaTienda.general.companiaName);
    setNroCorrelativo(flujoCajaTienda.general.n_correlativo);
    detalleSeleccionado.general.d_fechamov && setFechaMov({value: detalleSeleccionado.general.d_fechamov});
    detalleSeleccionado.general.c_estado && setEstado(detalleSeleccionado.general.c_estado);
    detalleSeleccionado.general.c_observaciones && setObservaciones(detalleSeleccionado.general.c_observaciones);
    setMovimientos(detalleSeleccionado.movimientos);
    if(detalleSeleccionado.general.c_usuarioregistro) {
      setUsuarioRegistro(detalleSeleccionado.general.c_usuarioregistro);
      setFechaRegistro(moment(detalleSeleccionado.general.d_fecharegistro).format("DD/MM/yyyy HH:mm:ss"));
      setUsuarioModiciacion(detalleSeleccionado.general.c_ultimousuario);
      setFechaModiciacion(moment(detalleSeleccionado.general.d_ultimafechamodificacion).format("DD/MM/yyyy HH:mm:ss"));
    }
  }, [flujoCajaTienda, detalleSeleccionado]);

  useEffect(() => {
    if(tiposMovimientos.length > 0 && tiposDocumentos.length > 0) {
        refreshList();
    }
  }, [tiposMovimientos, movimientos, tiposDocumentos])

  useEffect(async () => {
      await setIsLoading(true);
      await getAgencias();
      await getTiposMovimientoCaja();
      await getTiposDocumentos();
      await getData();
      setIsLoading(false);
  },[])


  return (
    <>
      <WrapperForm>
        <div className="row">
          <div className="row col-12 col-md-12">
            <InputComponentView
              label="Compañía"
              state={compania}
              setState={setCompania}
              type="text"
              placeholder="Compañía"
              inputId="companiaCodeId"
              readOnly={true}
              classForm="col-12 col-lg-6"
            />
            <InputComponentView
              label="Nro CCU"
              state={nroCorrelativo}
              setState={setNroCorrelativo}
              type="text"
              placeholder="Nro. Correlativo"
              inputId="nroCorrelativoId"
              readOnly={true}
              classForm="col-12 col-lg-6"
            />
            <InputComponent
              label="Fecha"
              state={fechaMov}
              setState={setFechaMov}
              type="date"
              placeholder="Fecha desembolso"
              inputId="fechaMovId"
              readOnly={
                urlFragment === "actualizarCajaTiendaDiaMovimientos"
                ? true
                : false
              }
              classForm="col-12 col-lg-6"
            >
              {showMessageValidationDate()}
            </InputComponent>
            <SelectComponent
              labelText="Estados"
              defaultValue="Seleccione un estado"
              items={estadosCajaTiendaDia}
              selectId="estadoId"
              valueField="value"
              optionField="name"
              valueSelected={estado}
              handleChange={setEstado}
              classForm="col-12 col-lg-6"
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
            />
            <InputComponentView
              label="Saldo Dia"
              state={saldoDia}
              setState={setSaldoDia}
              type="text"
              placeholder="Saldo dia"
              inputId="saldoDiaCorrelativ"
              readOnly={true}
              classForm="col-12 col-lg-6"
            />
          </div>
          <div className="col-12 mb-3 text-center">
            <button
              className="btn btn-light btn-form"
              onClick={ urlFragment === "nuevaCajaTiendaDiaMovimientos"
              ? handleAgregarDetalle : handleActualizarDetalle }
            >
              Aceptar
            </button>
            <button
              className="btn btn-light btn-form ml-md-3"
              onClick={handleCancelar}
            >
              Cancelar
            </button>
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
              {estado === "A" && <>
                <Button onClick={handleSelectNuevo}>NUEVO</Button>
                <Button onClick={handleSelectActualizar}>MODIFICAR</Button>
                <Button onClick={handleSelectDelete}>ELIMINAR</Button>
              </>}
            </Space>
          </div>
          <div className="row">
            <div className="col" style={{ overflow: 'scroll' }}>
              <Table
                classForm
                rowSelection={{
                    type: "radio",
                    ...rowSelection,
                    selectedRowKeys,
                }}
                columns={columns}
                dataSource={movimientosCajaTabla}
                pagination={{ pageSize: 50 }}
              />
            </div>
          </div>
        </div>
      </WrapperForm>
      {isLoading === true && <Loading/>}
        <ResponseModal
            isOpen={openResponseModal}
            title={responseData.title}
            onClose={()=>setOpenResponseModal(false)}
            message={responseData.message}
        />
      <FlujoCajaTiendaDetalleMovimientoForm
        isOpen={openMovimientoModal}
        onClose={()=>setOpenMovimientoModal(false)}
        tiposMovimientos={tiposMovimientos}
        setMovimientos={setMovimientos}
        movimientos={movimientos}
      />
      <ConfirmationModal
        isOpen={openConfirmationModal}
        onClose={()=>setOpenConfirmationModal(false)}
        title={"Aviso de eliminación"}
        message={"¿Seguro que desea eliminar este elemento?. Una vez eliminado no podrás recuperarlo."}
        onHandleFunction={()=>handleEliminar()}
        buttonClass="btn-danger"
      />
    </>
  );
};

export default FormCajaTiendaDiaMovimientos;
