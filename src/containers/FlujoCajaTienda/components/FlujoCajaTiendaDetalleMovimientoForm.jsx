import React, { useEffect, useState, useContext } from "react";
import Modal from "../../../components/Modal/ModalNotification";
import ReactSelect from '../../../components/ReactSelect/ReactSelect';
import TextareaComponent from '../../../components/TextareaComponent/TextareaComponent';
import InputComponent from '../../../components/InputComponent/InputComponent';
import InputComponentView from '../../../components/InputComponent/InputComponentView';
import Alert from '../../../components/Alert/Alert';
import CajaTiendaContext from "../../../context/CajaTiendaContext/CajaTiendaContext";
import PagesContext from "../../../context/PagesContext/PagesContext";
import { listUsers } from '../../../Api/Api';

const FlujoCajaTiendaDetalleMovimientoForm = (props) => {
  const {
    isOpen,
    onClose,
    tiposMovimientos = [],
    setMovimientos,
    movimientos = [],
  } = props;
  const { movimientoSeleccionado, setMovimientoSeleccionado } =
    useContext(CajaTiendaContext);
  const { getPagesKeysForUser } = useContext(PagesContext);
  const userPermisssions = getPagesKeysForUser().filter((item) => {
    return (
      item === "USUARIO PUEDE REALIZAR INGRESOS CAJA TIENDA" ||
      item === "USUARIO PUEDE REALIZAR SALIDAS CAJA TIENDA" ||
      item === "USUARIO ACCESO TOTAL CAJA TIENDA"
    );
  });
  const realizaIngresosPermiso = userPermisssions.includes(
    "USUARIO PUEDE REALIZAR INGRESOS CAJA TIENDA"
  );
  const realizaSalidasPermiso = userPermisssions.includes(
    "USUARIO PUEDE REALIZAR SALIDAS CAJA TIENDA"
  );
  const [correlativo, setCorrelativo] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("");
  const [usuarioMov, setUsuarioMov] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [montoxMov, setMontoxMov] = useState({ value: "0.0" });
  const [esPermitido, setEsPermitido] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [notification, setNotification] = useState({
    title: "Hubo un problema",
    type: "alert-danger",
    message: "Favor de llenar los campos con valores válidos",
  });
  const [isAlert, setIsAlert] = useState(false);

  const handleClose = () => {
    onClose();
    setIsAlert(false);
    setMovimientoSeleccionado({ general: {} });
  };

  const validatDatos = () => {
    if (tipoMovimiento && observaciones && montoxMov) return true;
    return false;
  };

  const validarCondiciones = (fn) => {
    if (validatDatos()) {
      if (!isNaN(montoxMov.value) && Number(montoxMov.value) > 0) {
        if (esPermitido) {
           fn();
        } else {
          setNotification({
            title: "Hubo un problema",
            type: "alert-danger",
            message:
              "El usuario no tiene permisos para realizar esta clase de movimientos.",
          });
          setIsAlert(true);
        }
      } else {
        setNotification({
          title: "Hubo un problema",
          type: "alert-danger",
          message: "El valor del monto debe ser mayor a 0",
        });
        setIsAlert(true);
      }
    } else {
      setNotification({
        title: "Hubo un problema",
        type: "alert-danger",
        message: "Favor de llenar los campos con valores válidos",
      });
      setIsAlert(true);
    }
  };

  const agregarMovimiento = () => {
    const movimiento = {
      ...movimientoSeleccionado.general,
      c_tipomovimientoctd: tipoMovimiento,
      c_usuariomovimiento: usuarioMov,
      c_observaciones: observaciones,
      n_montoxdiamov: montoxMov.value ? montoxMov.value : 0.0,
      c_flagtransaccion: "N",
    };
    setMovimientos([...movimientos, movimiento]);
    handleClose();
  };

  const handleAddMovimiento = async () => {
    validarCondiciones(agregarMovimiento);
  };

  const actualizarMovimiento = () => {
    const movimientosAux = [...movimientos];
    //movimientos
    const movimiento = {
      ...movimientoSeleccionado.general,
      c_tipomovimientoctd: tipoMovimiento,
      c_usuariomovimiento: usuarioMov,
      c_observaciones: observaciones,
      n_montoxdiamov: montoxMov.value ? montoxMov.value : 0.0,
      is_updated: true,
    };
    movimientosAux[Number(movimientoSeleccionado.general.key) - 1] = movimiento;
    setMovimientos(movimientosAux);
    handleClose();
  };

  const handleUpdateMovimiento = async () => {
    validarCondiciones(actualizarMovimiento);
  };

  const getUsuarios = async () => {
    const response = await listUsers();
    if (response && response.status === 200) {
      setUsuarios([
        { c_codigousuario: "", c_nombres: "Seleccionar usuario" },
        ...response.body.data,
      ]);
    }
  };

  const getData = () => {
    setCorrelativo(movimientoSeleccionado.general.key);
    if (movimientoSeleccionado.action !== "ADD") {
      setTipoMovimiento(movimientoSeleccionado.general.c_tipomovimientoctd);
      setMontoxMov({ value: movimientoSeleccionado.general.n_montoxdiamov });
      setUsuarioMov(movimientoSeleccionado.general.c_usuariomovimiento);
      setObservaciones(movimientoSeleccionado.general.c_observaciones);
    }
  };

  useEffect(() => {
    if (tipoMovimiento) {
      const tipoMov = tiposMovimientos.find(
        (tipo) => tipo.c_tipomovimientoctd === tipoMovimiento
      );
      if (
        (tipoMov.c_clasetipomov === "I" && realizaIngresosPermiso) ||
        (tipoMov.c_clasetipomov === "S" && realizaSalidasPermiso)
      )
        setEsPermitido(true);
      else setEsPermitido(false);
    }
  }, [tipoMovimiento]);

  useEffect(() => {
    getData();
  }, [movimientoSeleccionado]);

  useEffect(async () => {
    await getUsuarios();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      title={
        movimientoSeleccionado.action === "ADD"
          ? `Agregar Movimiento`
          : `Actualizar Movimiento`
      }
      onClose={handleClose}
      modal_class="Modal__container__form"
    >
      <div className="modal-body row">
        <InputComponentView
          label="Correlativo"
          state={correlativo}
          setState={setCorrelativo}
          type="text"
          placeholder="Correlativo"
          inputId="correlativoId"
          readOnly={true}
          classForm="col-12 col-lg-6"
        />
        <ReactSelect
          labelText="Tipos"
          defaultValue="Seleccione un tipo"
          data={[...tiposMovimientos].filter(tm => tm.c_flagtransacciontienda !== 'S')}
          inputId="tipoId"
          valueField="c_tipomovimientoctd"
          optionField="c_descricpion"
          valueSelected={tipoMovimiento}
          handleElementSelected={setTipoMovimiento}
          classForm="col-12 col-lg-6"
          disabledElement={
            movimientoSeleccionado.general.c_flagtransaccion === "S"
              ? true
              : false
          }
        />
        <InputComponent
          label="Monto x Mov."
          state={montoxMov}
          setState={setMontoxMov}
          type="number"
          placeholder="Monto x Movimiento"
          inputId="montoxValorId"
          classForm="col-12 col-lg-6"
          readOnly={
            movimientoSeleccionado.general.c_flagtransaccion === "S"
              ? true
              : false
          }
        />
        <ReactSelect
          inputId="usuarioId"
          labelText="Usuario Mov."
          placeholder="Seleccione un usuario"
          valueSelected={usuarioMov}
          data={usuarios}
          handleElementSelected={setUsuarioMov}
          optionField="c_nombres"
          valueField="c_codigousuario"
          classForm="col-12 col-lg-6"
          disabledElement={
            movimientoSeleccionado.general.c_flagtransaccion === "S"
              ? true
              : false
          }
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
          marginForm="mt-0"
        />
      </div>
      {/*Alerta*/}
      {isAlert === true && (
        <Alert
          title={notification.title}
          type={notification.type}
          mainMessage={notification.message}
        />
      )}
      {/*Boton*/}
      <div className="modal-footer justify-content-center">
        {movimientoSeleccionado.action === "ADD" ? (
          <button onClick={handleAddMovimiento} className="btn btn-primary">
            Agregar
          </button>
        ) : (
          <button onClick={handleUpdateMovimiento} className="btn btn-warning">
            Actualizar
          </button>
        )}
      </div>
    </Modal>
  );
};

export default FlujoCajaTiendaDetalleMovimientoForm;
