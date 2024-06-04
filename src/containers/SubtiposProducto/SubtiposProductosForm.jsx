import React, { useContext, useEffect, useState } from "react";
//Componentes
import FormContainer from "../../components/FormContainer/FormContainer";
import InputComponent from "../../components/InputComponent/InputComponent";
import SelectComponent from "../../components/SelectComponent/SelectComponent";
import ReactSelect from "../../components/ReactSelect/ReactSelect";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import ResponseModal from "../../components/Modal/ResponseModal";
import Loading from "../../components/Modal/LoadingModal";
//Context
import UserContext from "../../context/UserContext/UserContext";
//Functions
import { useLocation, useHistory } from "react-router";
import {
  getSubtipoProductoByCodigo,
  updateSubtipoProducto,
  registerSubtipoProducto,
  listTiposProducto
} from "../../Api/Api";

const SubtiposProductosForm = (props) => {
  //Estados
  const [subtipoProducto, setSubtipoProducto] = useState({
    value: "",
    isValid: null,
  });
  const [tipoProducto, setTipoProducto] = useState("");
  const [descripcion, setDescripcion] = useState({ value: "", isValid: null });
  const [porRemate, setPorRemate] = useState({ value: "0", isValid: null });
  const [porTienda, setPorTienda] = useState({ value: "0", isValid: null });
  const [estado, setEstado] = useState("A");
  const [tiposProductos, setTiposProductos] = useState([]);
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
    nuevoSubtipoProduto: {
      label: "Guardar",
      class: "btn btn-primary btn-form",
    },
    editarSubtipoProduto: {
      label: "Actualizar",
      class: "btn btn-warning btn-form",
    },
    visualizarSubtipoProduto: {
      label: "Ir a lista",
      class: "btn btn-info btn-form",
    },
  };
  const readOnlyView =
    urlFragment === "visualizarSubtipoProduto" ? true : false;
  const readOnlyCode = urlFragment !== "nuevoSubtipoProduto" ? true : false;

  const formFunctions = {
    nuevoSubtipoProduto: () => handleRegister(),
    editarSubtipoProduto: () => handleUpdate(),
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
      url: "/listaSubtiposDeProductos",
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
    if (
      !tipoProducto ||
      !descripcion.isValid ||
      !subtipoProducto.isValid ||
      Number(porRemate.value) < 0 ||
      Number(porTienda.value) < 0
    )
      return false;
    return true;
  };

  const prepareData = () => {
    const data = {
      c_subtipoproducto: subtipoProducto.value,
      c_tipoproducto: tipoProducto,
      c_descripcion: descripcion.value,
      n_porcremate: Number(porRemate.value),
      n_porcvtatienda: Number(porTienda.value),
      c_estado: estado,
    };
    return data;
  };

  const handleRegister = async () => {
    setOpen(false);
    await setIsLoading(true);
    const data = prepareData();
    data.c_usuarioregistro = userLogedIn;
    const response = await registerSubtipoProducto(data);
    response && response.status === 200
      ? prepareNotificationSuccess("Se registró con éxito el perfil")
      : prepareNotificationDanger("Error al registrar", response.message);
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setOpen(false);
    await setIsLoading(true);
    const data = prepareData();
    data.c_ultimousuario = userLogedIn;
    const response = await updateSubtipoProducto(data);
    response && response.status === 200
      ? prepareNotificationSuccess("Se actualizó con éxito el perfil")
      : prepareNotificationDanger("Error al actualizar", response.message);
    setIsLoading(false);
  };

  const handleClick = () => {
    if (urlFragment !== "visualizarSubtipoProduto") {
      if (validate()) {
        setOpen(true);
        if (urlFragment === "nuevoSubtipoProduto")
          setModalAttributes({
            title: "Aviso de creación",
            message: "¿Seguro que desea crear este elemento?",
          });
        if (urlFragment === "editarSubtipoProduto")
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
      history.push("/listaSubtiposDeProductos");
    }
  };

  const getData = async () => {
    const [c_tipoproducto, c_subtipoproducto] = elementId.split("-");
    const response = await getSubtipoProductoByCodigo({
      c_tipoproducto,
      c_subtipoproducto,
    });
    if (response.status === 200) {
      const data = response.body.data;
      setSubtipoProducto({ value: data.c_subtipoproducto, isValid: true });
      setTipoProducto(data.c_tipoproducto);
      setDescripcion({ value: data.c_descripcion, isValid: true });
      setPorRemate({ value: Number(data.n_porcremate).toFixed(2), isValid: true });
      setPorTienda({ value: Number(data.n_porcvtatienda).toFixed(2), isValid: true });
      setEstado(data.c_estado);
    } else {
      prepareNotificationDanger("Error obteniendo datos", response.message);
    }
  };

  const getSubtiposProductos = async () => {
    const response = await listTiposProducto();
    if(response && response.status === 200) setTiposProductos([...response.body.data]);
  }

  useEffect(async () => {
    await setIsLoading(true);
    setButtonAttributes(buttonTypes[urlFragment]);
    getSubtiposProductos();
    if (urlFragment !== "nuevoSubtipoProduto") await getData();
    setIsLoading(false);
  }, []);

  return (
    <>
      <FormContainer
        buttonAttributes={buttonAttributes}
        handleClick={handleClick}
        isAlert={isAlert}
        notification={notification}
        goList={() => history.push("/listaSubtiposDeProductos")}
        view={readOnlyView}
      >
        <InputComponent
          state={subtipoProducto}
          setState={setSubtipoProducto}
          type="text"
          label="Subtipo producto"
          placeholder="Subtipo producto"
          inputId="subtipoProductoInput"
          validation="numberAndTextWithRange"
          min={1}
          max={3}
          readOnly={readOnlyCode}
        />
        <ReactSelect
          inputId="tiposId"
          labelText="Tipo de producto"
          placeholder="Seleccione un tipo"
          valueSelected={tipoProducto}
          data={tiposProductos}
          handleElementSelected={setTipoProducto}
          optionField="c_descripcion"
          valueField="c_tipoproducto"
          disabledElement={readOnlyView}
        />
        <InputComponent
          state={descripcion}
          setState={setDescripcion}
          type="text"
          label="Descripción"
          placeholder="Descripción"
          inputId="numeroDigitosInput"
          validation="alphanumericRange"
          min={1}
          max={60}
          readOnly={readOnlyView}
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
        <InputComponent
          state={porRemate}
          setState={setPorRemate}
          type="number"
          label="Por. Remate"
          placeholder="Por. Reamte"
          inputId="porRemateInput"
          readOnly={readOnlyView}
        />
        <InputComponent
          state={porTienda}
          setState={setPorTienda}
          type="number"
          label="Por. Tienda"
          placeholder="Por. Tienda"
          inputId="porTiendaInput"
          readOnly={readOnlyView}
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

export default SubtiposProductosForm;
