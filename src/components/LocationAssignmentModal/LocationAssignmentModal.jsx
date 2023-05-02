import React, { useEffect, useState, useContext } from 'react'
import InputComponent from '../../components/InputComponent/InputComponent'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import TextareaComponent from '../../components/TextareaComponent/TextareaComponent'
import Modal from '../Modal/ModalNotification'
import Alert from '../Alert/Alert'
import { updateProductoUbicacion } from '../../Api/Api'
import moment from 'moment'

const LocationAssignmentModal = (props) => {
    const {isOpen, onClose, editProduct, userLogedIn, compania, nPrestamo, locations, setEditProduct, setResponseData,
        setOpenResponseModal, productos, setProductos} = props;
    const [nLinea, setNLinea] = useState({value:"", isValid:null});
    const [descripcion, setDescripcion] = useState({value:"", isValid:null});
    const [tipo, setTipo] = useState({value: "", isValid:null});
    const [unidadMedida, setUnidadMedida] = useState({value: ""});
    const [cantidad, setCantidad] = useState({value:1, isValid:null});
    const [pesoBruto, setPesoBruto] = useState({value:"0", isValid:null});
    const [pesoNeto, setPesoNeto] = useState({value:"0", isValid:null});
    const [observaciones, setObservaciones] = useState("");
    const [montoValorTotal, setMontoValorTotal] = useState({value:"", isValid:null});
    const [notification, setNotification] = useState({title:"Hubo un problema", type:"alert-danger", message:"Favor de llenar los campos con valores válidos"});
    const [isAlert, setIsAlert] = useState(false);
    const [ubicacion, setUbicacion] = useState("");
    const [observacionUbicacion, setObservacionUbicacion] = useState("");

    const validate = () => {
        if(!ubicacion || !observacionUbicacion) return false;
        return true;
    }

    const cleanProduct = () => {
        setUbicacion("");
        setObservacionUbicacion("");
    }

    const handleAssignment = async () => {
        if(validate()) {
            const response = await updateProductoUbicacion({
                c_compania: compania,
                c_prestamo: nPrestamo,
                n_linea: nLinea.value,
                c_ubicacion: ubicacion,
                c_observacionubicacion: observacionUbicacion,
                c_usuarioubicacion: userLogedIn
            });
            if(response && response.status === 200) {
                updateProducts();
                handleClose();
                setResponseData({
                    title:"Operación exitosa",  message:"Se actualizó la ubicación del producto"
                });
                setOpenResponseModal(true);
            } else {
                setNotification({title:"Hubo un problema", type:"alert-danger", message:"Error al actualizar"})
                setIsAlert(true);
            }
        }
    }
    const updateProducts = () => {
        const newListProducts = JSON.parse(JSON.stringify(productos));
        let product = JSON.parse(JSON.stringify(editProduct));
        product.c_ubicacion = ubicacion;
        product.c_observacionubicacion = observacionUbicacion;
        product.c_usuarioubicacion = userLogedIn;
        product.d_fechaubicacion = moment();
        product.c_ubicaciondesc = locations.find(location => location.c_ubicacion === ubicacion).c_descripcion;
        newListProducts[editProduct.key] = product;
        setProductos(newListProducts);
    }

    const handleClose = () => {
        cleanProduct();
        onClose();
        setIsAlert(false);
        setEditProduct(null);
    }

    useEffect(() => {
        if(editProduct) {
            setNLinea({value: editProduct.n_linea});
            setTipo({value: editProduct.c_tipoproducto_name});
            setDescripcion({value: editProduct.c_descripcionproducto});
            setUnidadMedida({value: editProduct.c_unidadmedida_name});
            setCantidad({value:editProduct.n_cantidad});
            console.log(editProduct.c_ubicacion);
            if(editProduct.c_ubicacion) setUbicacion(editProduct.c_ubicacion);
            if(editProduct.c_observacionubicacion) setObservacionUbicacion(editProduct.c_observacionubicacion);
        }
    }, [editProduct])

    return (
        <Modal isOpen={isOpen} title="Ubicación" onClose={handleClose} modal_class="Modal__container__form">
            <div className="modal-body row">
                <InputComponent
                    label="Línea"
                    state={nLinea}
                    setState={setNLinea}
                    type="text"
                    placeholder="Línea"
                    inputId="lineaId"
                    readOnly={true}
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="Tipos de producto"
                    state={tipo}
                    setState={setTipo}
                    type="text"
                    placeholder="Tipos de producto"
                    inputId="tiposId"
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
                    classForm="col-12"
                    max={300}
                    labelSpace={0}
                    labelLine={true}
                    readOnly={true}
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
                    classForm="col-12"
                    labelSpace={1}
                />
                <TextareaComponent
                    inputId="observacionesId"
                    label="Obs. ubicación"
                    placeholder="Observaciones"
                    value={observacionUbicacion}
                    setState={setObservacionUbicacion}
                    max={500}
                    classForm="col-12"
                    labelSpace={0}
                    labelLine={true}
                />
            </div>
            {/*Alerta*/}
            { isAlert === true && <Alert
                title={notification.title}
                type={notification.type}
                mainMessage={notification.message}
            /> }
            <div className="modal-footer justify-content-center">
                <button onClick={handleAssignment} className="btn btn-primary">
                    Asignar Ubicación
                </button>
            </div>
        </Modal>
    )
}

export default LocationAssignmentModal