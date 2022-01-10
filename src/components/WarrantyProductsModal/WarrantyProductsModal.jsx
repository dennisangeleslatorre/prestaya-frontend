import React, { useEffect, useState } from 'react'
import InputComponent from '../../components/InputComponent/InputComponent'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import TextareaComponent from '../../components/TextareaComponent/TextareaComponent'
import Modal from '../Modal/ModalNotification'
import Alert from '../Alert/Alert'

const WarrantyProductsModal = (props) => {
    const {isOpen, onClose, productos, setProductos, editProduct, setEditProduct, unidadesMedidas, tiposProducto, userLogedIn, newNLine} = props;
    const [nLinea, setNLinea] = useState({value:"", isValid:null});
    const [descripcion, setDescripcion] = useState({value:"", isValid:null});
    const [tipo, setTipo] = useState("");
    const [unidadMedida, setUnidadMedida] = useState("");
    const [cantidad, setCantidad] = useState({value:1, isValid:null});
    const [pesoBruto, setPesoBruto] = useState({value:"", isValid:null});
    const [pesoNeto, setPesoNeto] = useState({value:"", isValid:null});
    const [observaciones, setObservaciones] = useState("");
    const [montoValorTotal, setMontoValorTotal] = useState({value:"", isValid:null});
    const notification = {title:"Hubo un problema", type:"alert-danger", message:"Favor de llenar los campos con valores válidos"};
    const [isAlert, setIsAlert] = useState(false);

    const validate = () => {
        if(!descripcion.value || !unidadMedida || !cantidad.value || !pesoBruto.value || !pesoNeto.value || !observaciones || !montoValorTotal.value || !tipo) return false;
        return true;
    }

    const cleanProduct = () => {
        setTipo("");
        setNLinea({value:"", isValid:null});
        setDescripcion({value:"", isValid:null});
        setUnidadMedida("");
        setCantidad({value:1, isValid:null});
        setPesoBruto({value:"", isValid:null});
        setPesoNeto({value:"", isValid:null});
        setObservaciones("");
        setMontoValorTotal({value:"", isValid:null});
    }

    const prepareProduct = () => {
        const product = {
            c_descripcionproducto: descripcion.value,
            c_unidadmedida: unidadMedida,
            n_cantidad: cantidad.value,
            n_pesobruto: pesoBruto.value,
            n_pesoneto: pesoNeto.value,
            c_observaciones: observaciones,
            n_montovalortotal: montoValorTotal.value,
            c_tipoproducto: tipo
        }
        return product;
    }

    const handleAddProduct = () => {
        if(validate()) {
            const product = prepareProduct();
            let listProducts = [...productos, product];
            setProductos(listProducts);
            handleClose();
        } else {
            setIsAlert(true);
        }
    }

    const handleUpdateProduct = () => {
        if(validate()) {
            const product = prepareProduct();
            if(editProduct.n_linea) product.n_linea = editProduct.n_linea;
            let listProducts = [...productos];
            listProducts[editProduct.index] = product;
            setProductos(listProducts);
            handleClose();
        } else {
            setIsAlert(true);
        }
    }

    const handleClose = () => {
        cleanProduct();
        onClose();
        setIsAlert(false);
        setEditProduct(null);
    }

    useEffect(() => {
        if(editProduct) {
            if(editProduct.n_linea) setNLinea({value:editProduct.n_linea, isValid:null});
            setDescripcion({value:editProduct.c_descripcionproducto, isValid:null});
            setUnidadMedida(editProduct.c_unidadmedida);
            setCantidad({value:editProduct.n_cantidad, isValid:null});
            setPesoBruto({value:editProduct.n_pesobruto, isValid:null});
            setPesoNeto({value:editProduct.n_pesoneto, isValid:null});
            setObservaciones(editProduct.c_observaciones);
            setMontoValorTotal({value:editProduct.n_montovalortotal, isValid:null});
        }
    }, [editProduct])

    return (
        <Modal isOpen={isOpen} title="Producto" onClose={handleClose} modal_class="Modal__container__form">
            <div className="modal-body row">
                <InputComponent
                    label="Línea"
                    state={ editProduct ? nLinea : newNLine}
                    setState={setNLinea}
                    type="text"
                    placeholder="Línea"
                    inputId="lineaId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Descripción producto"
                    state={descripcion}
                    setState={setDescripcion}
                    type="text"
                    placeholder="Descripción producto"
                    inputId="descripcionId"
                    classForm="col-12 col-lg-6"
                    max={300}
                />
                <ReactSelect
                    inputId="tiposId"
                    labelText="Tipos de producto"
                    placeholder="Seleccione un tipo"
                    valueSelected={tipo}
                    data={tiposProducto}
                    handleElementSelected={setTipo}
                    optionField="c_descripcion"
                    valueField="c_tipoproducto"
                    classForm="col-12 col-lg-6"
                />
                <ReactSelect
                    inputId="unidadMedidaId"
                    labelText="Unidad medida"
                    placeholder="Seleccione un unidad"
                    valueSelected={unidadMedida}
                    data={unidadesMedidas}
                    handleElementSelected={setUnidadMedida}
                    optionField="c_descripcion"
                    valueField="c_unidadmedida"
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Cantidad"
                    state={cantidad}
                    setState={setCantidad}
                    type="text"
                    placeholder="Cantidad"
                    inputId="cantidadId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Peso Bruto"
                    state={pesoBruto}
                    setState={setPesoBruto}
                    type="number"
                    placeholder="Peso bruto"
                    inputId="pesoBrutoId"
                    classForm="col-12 col-lg-6"
                    fixedNumber={4}
                />
                <InputComponent
                    label="Peso Neto"
                    state={pesoNeto}
                    setState={setPesoNeto}
                    type="number"
                    placeholder="Peso Neto"
                    inputId="PesoNetoId"
                    classForm="col-12 col-lg-6"
                    fixedNumber={4}
                />
                <TextareaComponent
                    inputId="observacionesId"
                    label="Observaciones"
                    placeholder="Observaciones"
                    value={observaciones}
                    setState={setObservaciones}
                    max={500}
                    classForm="col-12"
                    labelSpace={1}
                />
                <InputComponent
                    label="Monto valor"
                    state={montoValorTotal}
                    setState={setMontoValorTotal}
                    type="number"
                    placeholder="Monto valor total"
                    inputId="montoValorTotalId"
                    classForm="col-12 col-lg-6"
                />
            </div>
            {/*Alerta*/}
            { isAlert === true && <Alert
                title={notification.title}
                type={notification.type}
                mainMessage={notification.message}
            /> }
            <div className="modal-footer justify-content-center">
                { !editProduct ? <button onClick={handleAddProduct} className="btn btn-primary">
                    Agregar
                </button> : <button onClick={handleUpdateProduct} className="btn btn-warning">
                    Actualizar
                </button>}
            </div>
        </Modal>
    )
}

export default WarrantyProductsModal