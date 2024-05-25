import React, { useContext, useEffect, useState } from "react";
import InputComponent from "../../components/InputComponent/InputComponent";
import TextareaComponent from "../../components/TextareaComponent/TextareaComponent";
import Modal from "../Modal/ModalNotification";
import Alert from "../Alert/Alert";
import { getProductoDinamicoConPrecio } from "../../Api/Comercial/producto.service";
import SearcherComponent from "../SearcherComponent/SearcherComponent";
import SearchModalProductToTransaction from "../Modal/SearchModalProductToTransaction";
import UserContext from "../../context/UserContext/UserContext";

const TransactionDetailModal = (props) => {
  const { isOpen, onClose, detalles, setDetalles, compania, agencia } = props;
  //Usuario
  const { getUserData } = useContext(UserContext);
  const userLogedIn = getUserData().c_codigousuario;
  //Producto
  const [cantidad, setCantidad] = useState({ value: 1, isValid: null });
  const [precio, setPrecio] = useState({ value: "0.0", isValid: null });
  const [precioBaseHistorico, setPrecioBaseHistorico] = useState({ value: "0.0", isValid: null });
  const [porcentajeRemate, setPorcentajeRemate] = useState({ value: "0.0", isValid: null });
  const [porcentajeBaseHistoricoRemate, setPorcentajeHistoricoRemate] = useState({ value: "0.0", isValid: null });
  const [montoTotal, setMontoTotal] = useState({ value: "0.0", isValid: null });
  const [observaciones, setObservaciones] = useState("");
  const [codigoProducto, setCodigoProducto] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [openSearchModalProducto, setOpenSearchModalProducto] = useState(false);
  const [notification, setNotification] = useState({
    title: "Hubo un problema",
    type: "alert-danger",
    message: "Favor de llenar los campos con valores válidos",
  });
  const [isAlert, setIsAlert] = useState(false);

  const validateForm = () => {
    if (
      Number(cantidad.value) > 0 &&
      Number(precio.value) > 0 &&
      Number(montoTotal.value) > 0 &&
      codigoProducto &&
      observaciones
    )
      return true;
    return false;
  };

  const validateRepeatedProduct = () => {
    return detalles.find((producto) => producto.c_item === codigoProducto);
  };

  const handleAdDetalle = () => {
    if (validateForm()) {
      if (!validateRepeatedProduct()) {
        setDetalles([
          ...detalles,
          {
            c_item: codigoProducto,
            c_descripcionproducto: nombreProducto,
            c_unidadmedida: unidadMedida,
            n_cantidad: Number(cantidad.value).toFixed(2),
            n_precio: Number(precio.value).toFixed(2),
            n_montototal: Number(montoTotal.value).toFixed(2),
            c_observaciones: observaciones,
            n_preciobasehist: precioBaseHistorico.value,
            n_porcremate: porcentajeRemate.value,
            n_porcrematehist: porcentajeBaseHistoricoRemate.value,
            c_prestamoitem: productoSeleccionado.c_prestamo
          },
        ]);
        handleClose();
      } else {
        setNotification({
          title: "Hubo un problema",
          type: "alert-danger",
          message: "El producto ya esta agregado en otro detalle",
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

  const cleanDetalle = () => {
    setObservaciones("");
    setCantidad({ value: 1, isValid: null });
    setProductoSeleccionado(null);
    setCodigoProducto("");
    setNombreProducto("");
    setUnidadMedida("");
    setMontoTotal({ value: "0.0", isValid: null });
    setPrecio({ value: "0.0", isValid: null });
  };

  const handleClose = () => {
    cleanDetalle();
    onClose();
    setIsAlert(false);
  };

  const findProductoByCode = async () => {
    //setIsLoading(true);
    if (codigoProducto) {
      const response = await getProductoDinamicoConPrecio({
        c_compania: compania,
        c_agencia: agencia,
        c_item: codigoProducto,
        c_codigousuario: userLogedIn,
      });
      if (response && response.status === 200 && response.body.data && response.body.data[0]) {
        setProductoSeleccionado(response.body.data[0]);
      } else {
        setCodigoProducto("");
        setNombreProducto("");
        setUnidadMedida("");
        setProductoSeleccionado({});
        setNotification({
          title: "Hubo un problema",
          type: "alert-danger",
          message: "No se encontró producto con ese código",
        });
        setIsAlert(true);
      }
    } else setNombreProducto("");
    setUnidadMedida("");
  };

  const calcularPrecio = () => {
    // Primero se inicializa la variable con el precio original
    let precioCalculado =  productoSeleccionado.n_precio;
    if (productoSeleccionado.n_porcvtatienda)
      precioCalculado = ((100 + Number(productoSeleccionado.n_porcvtatienda)) / 100) * precioCalculado;
    setPrecio({value: Number(precioCalculado).toFixed(2), isValid: true});
    setPorcentajeRemate({value: Number(productoSeleccionado.n_porcvtatienda).toFixed(2)});
  }

  const handleChangePrice = (newPrice) => {
    setPrecio(newPrice);
    const nuevoPorcentaje = ((newPrice.value - productoSeleccionado.n_precio) / productoSeleccionado.n_precio) * 100;
    setPorcentajeRemate({value: Number(nuevoPorcentaje).toFixed(2)});
  }

  useEffect(() => {
    if (Number(cantidad.value) > 0 && Number(precio.value) > 0) {
      setMontoTotal({
        value: (Number(cantidad.value) * Number(precio.value))
          .toFixed(2)
          .toString(),
      });
      setIsAlert(false);
    } else if (Number(cantidad.value) === 0 || Number(precio.value) === 0) {
      setMontoTotal({ value: "0.00" });
      setIsAlert(false);
    } else {
      setMontoTotal({ value: 0 });
      setNotification({
        title: "Hubo un problema",
        type: "alert-danger",
        message: "Llenar los campos de cantidad y precio con valores correctos",
      });
      setIsAlert(true);
    }
  }, [cantidad, precio]);

  useEffect(() => {
    if (productoSeleccionado && Object.keys(productoSeleccionado).length > 0) {
      setCodigoProducto(productoSeleccionado.c_item);
      setNombreProducto(productoSeleccionado.c_descripcionproducto);
      setUnidadMedida(productoSeleccionado.c_unidadmedida);
      setPrecioBaseHistorico({value: Number(productoSeleccionado.n_precio).toFixed(2)});
      setPorcentajeHistoricoRemate({value: Number(productoSeleccionado.n_porcvtatienda).toFixed(2)});
      calcularPrecio();
    }
  }, [productoSeleccionado]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        title="Detalle"
        onClose={handleClose}
        modal_class="Modal__container__form"
      >
        <div className="modal-body row">
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
            marginForm=""
            searchWidth={5}
          />
          <InputComponent
            label="Cantidad"
            state={cantidad}
            setState={setCantidad}
            type="number"
            placeholder="Cantidad"
            inputId="cantidadId"
            classForm="col-12 col-lg-6"
          />
          <InputComponent
            label="Precio"
            state={precio}
            setState={handleChangePrice}
            type="number"
            placeholder="Precio"
            inputId="precioId"
            classForm="col-12 col-lg-6"
          />
          <InputComponent
            label="Monto total"
            state={montoTotal}
            setState={setMontoTotal}
            type="number"
            placeholder="Monto total"
            inputId="montoTotalId"
            classForm="col-12 col-lg-6"
            readOnly={true}
          />
          <InputComponent
            label="Precio historico"
            state={precioBaseHistorico}
            setState={() => {}}
            type="number"
            placeholder="Precio"
            inputId="precioId"
            classForm="col-12 col-lg-6"
            readOnly={true}
          />
          <InputComponent
            label="Porc. Histórico"
            state={porcentajeBaseHistoricoRemate}
            setState={() => {}}
            type="number"
            placeholder="Porcentaje"
            inputId="precioId"
            classForm="col-12 col-lg-6"
            readOnly={true}
          />
          <InputComponent
            label="Porcentaje Actual"
            state={porcentajeRemate}
            setState={() => {}}
            type="number"
            placeholder="Precio"
            inputId="precioId"
            classForm="col-12 col-lg-6"
            readOnly={true}
          />
          <TextareaComponent
            inputId="observacionesDetalleId"
            label="Observaciones"
            placeholder="Observaciones"
            value={observaciones}
            setState={setObservaciones}
            max={500}
            classForm="col-12"
            labelSpace={0}
            labelLine={true}
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
        <div className="modal-footer justify-content-center">
          <button onClick={handleAdDetalle} className="btn btn-primary">
            Agregar
          </button>
        </div>
      </Modal>
      <SearchModalProductToTransaction
        isOpen={openSearchModalProducto}
        onClose={() => setOpenSearchModalProducto(false)}
        setProductoObtained={setProductoSeleccionado}
        compania={compania}
        agencia={agencia}
        userLogedIn={userLogedIn}
      />
    </>
  );
};

export default TransactionDetailModal;
