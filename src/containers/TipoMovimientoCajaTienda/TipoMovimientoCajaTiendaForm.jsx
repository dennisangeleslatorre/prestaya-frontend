import React, { useContext, useEffect, useState } from "react";
//Componentes
import FormContainer from "../../components/FormContainer/FormContainer";
import InputComponent from "../../components/InputComponent/InputComponent";
import SelectComponent from "../../components/SelectComponent/SelectComponent";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import ResponseModal from "../../components/Modal/ResponseModal";
import Loading from "../../components/Modal/LoadingModal";
//Context
import UserContext from "../../context/UserContext/UserContext";
//Functions
import { useLocation, useHistory } from "react-router";
import {
  getTipoMovimientoCajaTiendaByCodigo,
  registerTipoMovimientoCajaTienda,
  updateTipoMovimientoCajaTienda,
  listAllTipoMovimientoCajaTienda,
} from "../../Api/Api";

const TipoMovimientoCajaForm = (props) => {
  //Estados
  const [codigoTipoMovimientoCajaTienda, setCodigoTipoMovimientoCajaTienda] =
    useState({
      value: "",
      isValid: null,
    });
  const [descripcion, setDescripcion] = useState({ value: "", isValid: null });
  const [claseTipoMovimiento, setClaseTipoMovimiento] = useState("I");
  const [estado, setEstado] = useState("A");
  const [movimientoInverso, setMovimientoInverso] = useState("");
  const [tiposMovimientos, setTiposMovimientos] = useState([]);
  const [flagTransaccionTienda, setFlagTransaccionTienda] = useState("N");
  //Estados del formulario
  const [buttonAttributes, setButtonAttributes] = useState({
    label: "",
    class: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openResponseModal, setOpenResponseModal] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [modalAttributes, setModalAttributes] = useState({
    title: "",
    message: "",
  });
  const [isAlert, setIsAlert] = useState(false);
  const [notification, setNotification] = useState({
    title: "",
    type: "",
    message: "",
  });
  //Contextos
  const { getUserData } = useContext(UserContext);
  const userLogedIn = getUserData().c_codigousuario;
  //Variables
  const elementId = props.match.params.id;
  const location = useLocation();
  let history = useHistory();
  const urlFragment = location.pathname.split("/")[1];
  const buttonTypes = {
    nuevoTipoDeMovimientoCajaTienda: {
      label: "Guardar",
      class: "btn btn-primary btn-form",
    },
    editarTipoDeMovimientoCajaTienda: {
      label: "Actualizar",
      class: "btn btn-warning btn-form",
    },
    visualizarTipoDeMovimientoCajaTienda: {
      label: "Ir a lista",
      class: "btn btn-info btn-form",
    },
  };
  const readOnlyView =
    urlFragment === "visualizarTipoDeMovimientoCajaTienda" ? true : false;
  const readOnlyCode =
    urlFragment !== "nuevoTipoDeMovimientoCajaTienda" ? true : false;

  const formFunctions = {
    nuevoTipoDeMovimientoCajaTienda: () => handleRegister(),
    editarTipoDeMovimientoCajaTienda: () => handleUpdate(),
  };

  const prepareNotificationSuccess = (message) => {
    setIsAlert(true);
    setNotification({
      title: "Operación exitosa",
      type: "alert-success",
      message: message,
    });
    setResponseData({
      message: message,
      title: "Operación exitosa",
      url: "/tiposDeMovimientosCajaTienda",
    });
    setOpenResponseModal(true);
  };

  const prepareNotificationDanger = (
    title,
    message = "Error al consumir el servicio."
  ) => {
    setIsAlert(true);
    setNotification({ title: title, type: "alert-danger", message: message });
  };

  const validate = () => {
    if (!codigoTipoMovimientoCajaTienda.isValid || !descripcion.isValid)
      return false;
    return true;
  };

  const prepareData = () => {
    const data = {
      c_tipomovimientoctd: codigoTipoMovimientoCajaTienda.value.toUpperCase(),
      c_descricpion: descripcion.value,
      c_clasetipomov: claseTipoMovimiento,
      c_estado: estado,
      c_tipomovimientoctdinverso: movimientoInverso ? movimientoInverso : null,
      c_flagtransacciontienda: flagTransaccionTienda,
    };
    return data;
  };

  const handleRegister = async () => {
    setOpen(false);
    await setIsLoading(true);
    const data = prepareData();
    data.c_usuarioregistro = userLogedIn;
    const response = await registerTipoMovimientoCajaTienda(data);
    response && response.status === 200
      ? prepareNotificationSuccess(
          "Se registró con éxito el tipo de movimiento de caja tienda"
        )
      : prepareNotificationDanger("Error al registrar", response.message);
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setOpen(false);
    await setIsLoading(true);
    const data = prepareData();
    data.c_ultimousuario = userLogedIn;
    const response = await updateTipoMovimientoCajaTienda({
      body: data,
      id: elementId,
    });
    response && response.status === 200
      ? prepareNotificationSuccess(
          "Se actualizó con éxito el tipo de movimiento de caja"
        )
      : prepareNotificationDanger("Error al actualizar", response.message);
    setIsLoading(false);
  };

  const handleClick = () => {
    if (urlFragment !== "visualizarTipoDeMovimientoCajaTienda") {
      if (validate()) {
        setOpen(true);
        if (urlFragment === "nuevoTipoDeMovimientoCajaTienda")
          setModalAttributes({
            title: "Aviso de creación",
            message: "¿Seguro que desea crear este elemento?",
          });
        if (urlFragment === "editarTipoDeMovimientoCajaTienda")
          setModalAttributes({
            title: "Aviso de actualización",
            message: "¿Seguro que desea actualizar este elemento?",
          });
      } else {
        prepareNotificationDanger(
          "Error campos incompletos",
          "Favor de llenar los campos del formulario con valores válidos"
        );
      }
    } else {
      history.push("/tiposDeMovimientosCajaTienda");
    }
  };

  const getData = async () => {
    const response = await getTipoMovimientoCajaTiendaByCodigo(elementId);
    if (response.status === 200) {
      const data = response.body.data;
      setCodigoTipoMovimientoCajaTienda({
        value: data.c_tipomovimientoctd,
        isValid: true,
      });
      setDescripcion({ value: data.c_descricpion, isValid: true });
      setClaseTipoMovimiento(data.c_clasetipomov);
      setEstado(data.c_estado);
      setMovimientoInverso(data.c_tipomovimientoctdinverso || "");
      setFlagTransaccionTienda(data.c_flagtransacciontienda || "N");
    } else {
      prepareNotificationDanger("Error obteniendo datos", response.message);
    }
  };

  const getTiposMovimientosCaja = async () => {
    const response = await listAllTipoMovimientoCajaTienda();
    if (response && response.status === 200 && response.body.data)
      setTiposMovimientos(response.body.data);
  };

  useEffect(async () => {
    await setIsLoading(true);
    getTiposMovimientosCaja();
    setButtonAttributes(buttonTypes[urlFragment]);
    if (urlFragment !== "nuevoTipoDeMovimientoCajaTienda") await getData();
    setIsLoading(false);
  }, []);

  return (
    <>
      <FormContainer
        buttonAttributes={buttonAttributes}
        handleClick={handleClick}
        isAlert={isAlert}
        notification={notification}
        goList={() => history.push("/tiposMovimientosCaja")}
        view={readOnlyView}
      >
        <InputComponent
          state={codigoTipoMovimientoCajaTienda}
          setState={setCodigoTipoMovimientoCajaTienda}
          type="text"
          label="Tipo de Movimiento"
          placeholder="Tipo de movimiento"
          inputId="codigoTipoMovimientoInput"
          validation="numberAndTextWithRange"
          min={1}
          max={3}
          readOnly={readOnlyCode}
        />
        <InputComponent
          state={descripcion}
          setState={setDescripcion}
          type="text"
          label="Descripción"
          placeholder="Descripción"
          inputId="numeroDigitosInput"
          validation="name"
          max={60}
          readOnly={readOnlyView}
        />
        <SelectComponent
          labelText="Clase"
          defaultValue="Seleccione una clase"
          items={[
            { name: "Ingreso", value: "I" },
            { name: "Salida", value: "S" },
          ]}
          selectId="claseId"
          valueField="value"
          optionField="name"
          valueSelected={claseTipoMovimiento}
          handleChange={setClaseTipoMovimiento}
          disabledElement={readOnlyView}
        />
        <SelectComponent
          labelText="Estado"
          defaultValue="Seleccione un estado"
          items={[
            { name: "Activo", value: "A" },
            { name: "Inactivo", value: "I" },
          ]}
          selectId="estadoId"
          valueField="value"
          optionField="name"
          valueSelected={estado}
          handleChange={setEstado}
          disabledElement={readOnlyView}
        />
        <SelectComponent
          labelText="Mov. Inverso"
          defaultValue="Sin movimiento"
          items={tiposMovimientos}
          selectId="movInversoId"
          valueField="c_tipomovimientoctd"
          optionField="c_descricpion"
          valueSelected={movimientoInverso}
          handleChange={setMovimientoInverso}
          disabledElement={readOnlyView}
          disableDefaultValue={false}
        />
        <SelectComponent
          labelText="Flag transaccion tienda"
          defaultValue="Selecciona"
          items={[
            { value: "N", option: "NO" },
            { value: "S", option: "SI" },
          ]}
          selectId="flagTransaccionTienda"
          valueField="value"
          optionField="option"
          valueSelected={flagTransaccionTienda}
          handleChange={setFlagTransaccionTienda}
          disabledElement={readOnlyView}
          disableDefaultValue={true}
        />
      </FormContainer>
      {isLoading === true && <Loading />}
      <ConfirmationModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={modalAttributes.title}
        message={modalAttributes.message}
        onHandleFunction={formFunctions[urlFragment]}
      />
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

export default TipoMovimientoCajaForm;
