import React, { forwardRef, useImperativeHandle, useState } from "react";
import Modal from "../../../components/Modal/ModalNotification";
import InputComponent from "../../../components/InputComponent/InputComponent";
import ReactSelect from "../../../components/ReactSelect/ReactSelect";
import Alert from "../../../components/Alert/Alert";
import {
  getSubtipoProductoByTipo,
  listUbicacionesByCodigo,
} from "../../../Api/Api";
import { actualizarDatosUbicacionSubtipo } from "../../../Api/Comercial/producto.service";

const defaultMessage = {
  title: "Hubo un problema",
  type: "alert-danger",
  message: "Favor de llenar los campos con valores válidos",
}

const ModalAssignment = forwardRef((props, ref) => {
  const { showSuccessMessage } = props;
  const [productSelected, setProductSelected] = useState({});
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [type, setType] = useState({ value: "", isValid: null });
  const [subtype, setSubtype] = useState("");
  const [subtypes, setSubtypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(defaultMessage);
  const [isAlert, setIsAlert] = useState(false);

  const getSubtypes = async (c_tipoproducto) => {
    const response = await getSubtipoProductoByTipo(c_tipoproducto);
    if (response && response.status === 200) setSubtypes(response.body.data);
    else setSubtypes([]);
  };

  const getLocations = async ({ c_compania, c_agencia }) => {
    const response = await listUbicacionesByCodigo({
      c_compania,
      c_agencia,
    });
    if (response && response.status === 200 && response.body.data)
      setLocations(response.body.data);
    else setLocations([]);
  };

  const validateData = () => {
    if (!subtype || !location) return false;
    return true;
  };

  const handleClose = () => {
    setOpen(false);
    setIsAlert(false);
    setProductSelected({});
    setLocations([]);
    setSubtypes([]);
    setIsLoading(false);
  };

  const handleAssignment = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (validateData()) {
      setIsAlert(false);
      const response = await actualizarDatosUbicacionSubtipo({
        c_compania: productSelected?.c_compania,
        c_agencia: productSelected?.c_agencia,
        c_item: productSelected?.c_item,
        c_subtipoproducto: subtype,
        c_ubicacion: location,
      });
      if ( response.status === 200 ) {
        showSuccessMessage();
        handleClose();
      } else {
        setNotification({
          title: "Hubo un problema",
          type: "alert-danger",
          message: "Error al actualizar los datos del producto.",
        });
        setIsAlert(true);
      }
      setIsLoading(false)
    } else {
      setNotification(defaultMessage);
      setIsAlert(true);
      setIsLoading(false);
    }
  };

  const selectProduct = async (product) => {
    setProductSelected(product);
    setType({ value: product.c_descripcion_tipo_producto || "" });
    setSubtype(product.c_subtipoproducto || "");
    setLocation(product.c_ubicacion || "");
    await getSubtypes(product.c_tipoproducto);
    await getLocations({
      c_compania: product.c_compania,
      c_agencia: product.c_agencia,
    });
    setOpen(true);
    setIsLoading(false);
  };

  useImperativeHandle(ref, () => ({
    selectProduct,
  }));

  return (
    <Modal
      isOpen={open}
      title="Asignar ubicación"
      onClose={handleClose}
      modal_class="Modal__container__form"
    >
      <form onSubmit={handleAssignment}>
        <div className="modal-body row">
          <InputComponent
            label="Tipos de producto"
            state={type}
            setState={setType}
            type="text"
            placeholder="Tipos de producto"
            inputId="tiposId"
            readOnly={true}
            classForm="col-12 col-lg-6"
          />
          <ReactSelect
            inputId="subtiposId"
            labelText="Subtipos de producto"
            placeholder="Seleccione un subtipo"
            valueSelected={subtype}
            data={subtypes}
            handleElementSelected={setSubtype}
            optionField="c_descripcion"
            valueField="c_subtipoproducto"
            classForm="col-12 col-lg-6"
          />
          <ReactSelect
            inputId="ubicacionId"
            labelText="Ubicación"
            placeholder="Seleccione una ubicación"
            valueSelected={location}
            data={[
              { c_descripcion: "Seleciona una ubicación", c_ubicacion: "" },
              ...locations,
            ]}
            handleElementSelected={setLocation}
            optionField="c_descripcion"
            valueField="c_ubicacion"
            classForm="col-12"
            labelSpace={1}
          />
        </div>
        {isAlert === true && (
          <Alert
            title={notification.title}
            type={notification.type}
            mainMessage={notification.message}
          />
        )}
        <div className="modal-footer justify-content-center">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {!isLoading ? "Asignar Ubicación" : "... Cargando"}
          </button>
        </div>
      </form>
    </Modal>
  );
});

export default ModalAssignment;
