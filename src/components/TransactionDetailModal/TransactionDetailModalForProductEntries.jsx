import React, { useContext, useEffect, useState } from "react";
import InputComponent from "../InputComponent/InputComponent";
import TextareaComponent from "../TextareaComponent/TextareaComponent";
import Modal from "../Modal/ModalNotification";
import Alert from "../Alert/Alert";
import { getProductoDinamicoConPrecio } from "../../Api/Comercial/producto.service";
import { getSubtipoProductoByTipo } from "../../Api/Api";
import SearcherComponent from "../SearcherComponent/SearcherComponent";
import SearchModalProductToTransaction from "../Modal/SearchModalProductToTransaction";
import UserContext from "../../context/UserContext/UserContext";
import { Checkbox } from "antd";
import ReactSelect from "../ReactSelect/ReactSelect";

const TransactionDetailModalForProductEntries = (props) => {
  const { isOpen, onClose, detalles, setDetalles, compania, agencia, locations=[],
    unidadesMedidas=[], tiposProducto=[] } = props;
  //Usuario
  const { getUserData } = useContext(UserContext);
  const userLogedIn = getUserData().c_codigousuario;
  //Producto
  const [cantidad, setCantidad] = useState({ value: 1, isValid: null });
  const [precio, setPrecio] = useState({ value: "0.0", isValid: null });
  const [montoTotal, setMontoTotal] = useState({ value: "0.0", isValid: null });
  const [observaciones, setObservaciones] = useState("");
  const [codigoProducto, setCodigoProducto] = useState("");
  const [nombreProducto, setNombreProducto] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [esNuevoProducto, setEsNuevoProducto] = useState(false);
  const [openSearchModalProducto, setOpenSearchModalProducto] = useState(false);
  const [notification, setNotification] = useState({
    title: "Hubo un problema",
    type: "alert-danger",
    message: "Favor de llenar los campos con valores válidos",
  });
  const [isAlert, setIsAlert] = useState(false);
  // Nuevo Producto
  const [descripcioProducto, setDescripcionProducto] = useState({value: ""});
  const [subtipo, setSubtipo] = useState("");
  const [subtiposProducto, setSubtiposProducto] = useState([]);
  const [tipo, setTipo] = useState("");
  const [observacionesProducto, setObservacionesProducto] = useState("");
  const [pesoBruto, setPesoBruto] = useState({value: "0.00", isValid: null});
  const [pesoNeto, setPesoNeto] = useState({value: "0.00", isValid: null});
  const [ubicacion, setUbicacion] = useState("");

  const validarProductoSeleccionado = () => {
    if ( !esNuevoProducto && codigoProducto ) return true;
    if ( esNuevoProducto &&  descripcioProducto.value && subtipo
        && tipo && observaciones && Number(pesoBruto.value) >= 0
        && Number(pesoNeto.value) >= 0 && ubicacion
    ) return true;
    return false;
  }

  const validateForm = () => {
    if (
      Number(cantidad.value) > 0 &&
      Number(precio.value) > 0 &&
      Number(montoTotal.value) > 0 &&
      observaciones &&
      validarProductoSeleccionado()
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

        let nuevoProducto = {
          c_item: codigoProducto || null,
          n_esNuevo: esNuevoProducto,
          c_descripcionproducto: nombreProducto || descripcioProducto.value,
          c_unidadmedida: unidadMedida,
          n_cantidad: Number(cantidad.value).toFixed(2),
          n_precio: Number(precio.value).toFixed(2),
          n_montototal: Number(montoTotal.value).toFixed(2),
          c_observaciones: observaciones,
        };

        if (esNuevoProducto) {
          nuevoProducto.datosNuevoProducto = {
            c_descripcionproducto: descripcioProducto.value,
            c_tipoproducto: tipo,
            c_unidadmedida: unidadMedida,
            c_observaciones: observacionesProducto,
            n_pesobruto: pesoBruto.value,
            n_pesoneto: pesoNeto.value,
            c_subtipoproducto: subtipo,
            c_ubicacion: ubicacion,
          }
        }

        setDetalles([
          ...detalles,
          nuevoProducto
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
    setEsNuevoProducto(false);
    setDescripcionProducto({value:""});
    setSubtipo("");
    setSubtiposProducto([]);
    setTipo("");
    setObservacionesProducto("");
    setPesoBruto({value:"0.00"});
    setPesoNeto({value:"0.00"});
    setUbicacion("");
  };

  const getSubtipos = async (c_tipoproducto) => {
    try {
        const response = await getSubtipoProductoByTipo(c_tipoproducto);
        if ( response && response.status === 200 ) setSubtiposProducto(response.body.data || []);
        else setSubtiposProducto([]);
    } catch (e) {
        setSubtiposProducto([]);
    }
}

  const handleSelectTipo = (c_tipoproducto) => {
    setSubtipo("");
    if (c_tipoproducto) {
        setTipo(c_tipoproducto);
        getSubtipos(c_tipoproducto);
    } else {
        setSubtiposProducto([]);
    }
  }

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
      if (response && response.status === 200 && response.body.data) {
        setNombreProducto(response.body.data[0].c_descripcionproducto);
        setUnidadMedida(response.body.data[0].c_unidadmedida);
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
    let precioCalculado = productoSeleccionado.n_precio;
    if (productoSeleccionado.n_porcvtatienda)
      precioCalculado =
        ((100 + Number(productoSeleccionado.n_porcvtatienda)) / 100) *
        precioCalculado;
    setPrecio({ value: Number(precioCalculado).toFixed(2), isValid: true });
  };

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
    if (productoSeleccionado) {
      setCodigoProducto(productoSeleccionado.c_item);
      setNombreProducto(productoSeleccionado.c_descripcionproducto);
      setUnidadMedida(productoSeleccionado.c_unidadmedida);
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
            readOnlyCode={esNuevoProducto}
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
            setState={setPrecio}
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
          <div className="d-flex col-12 col-lg-6">
            <Checkbox checked={esNuevoProducto} onChange={() => setEsNuevoProducto(!esNuevoProducto)}>
              Nuevo Producto
            </Checkbox>
          </div>
          <div className={`col-12 mt-3 row ${esNuevoProducto ? 'd-flex' : 'd-none'}`}>
            <InputComponent
              label="Descripción producto"
              state={descripcioProducto}
              setState={setDescripcionProducto}
              type="text"
              placeholder="Descripción producto"
              inputId="descripcionId"
              classForm="col-12"
              max={300}
              labelSpace={0}
              labelLine={true}
            />
            <ReactSelect
              inputId="tiposId"
              labelText="Tipo"
              placeholder="Seleccione un tipo"
              valueSelected={tipo}
              data={tiposProducto}
              handleElementSelected={handleSelectTipo}
              optionField="c_descripcion"
              valueField="c_tipoproducto"
              classForm="col-12 col-lg-6"
            />
            <ReactSelect
              inputId="subtiposId"
              labelText="Subtipo"
              placeholder="Seleccione un subtipo"
              valueSelected={subtipo}
              data={subtiposProducto}
              handleElementSelected={setSubtipo}
              optionField="c_descripcion"
              valueField="c_subtipoproducto"
              classForm="col-12 col-lg-6"
            />
            <ReactSelect
              inputId="ubicacionId"
              labelText="Ubicación"
              placeholder="Seleccione una ubicación"
              valueSelected={ubicacion}
              data={[{c_descripcion:"Seleciona una ubicación", c_ubicacion:""},...locations]}
              handleElementSelected={setUbicacion}
              optionField="c_descripcion"
              valueField="c_ubicacion"
              classForm="col-12 col-lg-6"
            />
            <ReactSelect
              inputId="unidadMedidaId"
              labelText="Uni. Medida"
              placeholder="Seleccione un unidad"
              valueSelected={unidadMedida}
              data={unidadesMedidas}
              handleElementSelected={setUnidadMedida}
              optionField="c_descripcion"
              valueField="c_unidadmedida"
              classForm="col-12 col-lg-6"
            />
            <TextareaComponent
              inputId="observacionesProductoId"
              label="Observaciones"
              placeholder="Observaciones"
              value={observacionesProducto}
              setState={setObservacionesProducto}
              max={500}
              classForm="col-12"
              labelSpace={0}
              labelLine={true}
            />
            <InputComponent
              label="P. Bruto"
              state={pesoBruto}
              setState={setPesoBruto}
              type="number"
              placeholder="Peso bruto"
              inputId="pesoBrutoId"
              classForm="col-12 col-lg-6"
              fixedNumber={4}
            />
            <InputComponent
              label="P. Neto"
              state={pesoNeto}
              setState={setPesoNeto}
              type="number"
              placeholder="Peso Neto"
              inputId="PesoNetoId"
              classForm="col-12 col-lg-6"
              fixedNumber={4}
            />
          </div>
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

export default TransactionDetailModalForProductEntries;
