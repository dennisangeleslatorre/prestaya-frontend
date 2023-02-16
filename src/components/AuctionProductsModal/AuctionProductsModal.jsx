import React, { useEffect, useState } from 'react'
import InputComponent from '../../components/InputComponent/InputComponent'
import TextareaComponent from '../../components/TextareaComponent/TextareaComponent'
import Modal from '../Modal/ModalNotification'
import Alert from '../Alert/Alert'
import Spinner from '../Spinner/Spinner'
import SearchModalCliente from '../../components/Modal/SearchModalCliente'
import { getClienteByCodigoCliente } from '../../Api/Api'
import SearcherComponent from '../SearcherComponent/SearcherComponent'
import SelectComponent from '../SelectComponent/SelectComponent'

const AuctionProductsModal = (props) => {
    const { compania, isOpen, onClose, productos, setProductos, nIndex, setNIndex, productSelected, setProductSelected, saldoCapital } = props;
    const [codigoCliente, setCodigoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [tipoVenta, setTipoVenta] = useState("");
    const [montoCap, setMontoCap] = useState({value:"0.0", isValid:true});
    const [newMontoCap, setNewMontoCap] = useState({value:"0.0", isValid:true});
    const [percentCap, setPercentCap] = useState({value:"0.0", isValid:true});
    const [newPercentCap, setNewPercentCap] = useState({value:"0.0", isValid:true});
    const [montoInteres, setMontoInteres] = useState({value:"0.0", isValid:true});
    const [montototal, setMontototal] = useState({value:"0.0", isValid:true});
    const [observacionesVenta, setObservacionesVenta] = useState("");
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const [isAlert, setIsAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({title:"Hubo un problema", type:"alert-danger", message:"Favor de llenar los campos con valores válidos"});

    const handleClose = () => {
        cleanProduct();
        onClose();
        setIsAlert(false);
        setProductSelected(null)
        //Quitar el id
    }

    const findClienteByCode = async () => {
        setIsLoading(true);
        if(codigoCliente) {
            const response = await getClienteByCodigoCliente({c_compania:compania, n_cliente:codigoCliente});
            if(response && response.status === 200 && response.body.data) {
                setClienteSeleccionado(response.body.data);
            } else {
                //setResponseData({title:"Aviso", message:"No hay un cliente con ese código"});
                setCodigoCliente("");
                //setOpenResponseModal(true);
            }
        }
        setIsLoading(false);
    }

    const cleanProduct = () => {
        setCodigoCliente("");
        setNombreCliente("");
        setTipoVenta("");
        setPercentCap({value:"0.0"});
        setMontoCap({value:"0.0", isValid:true});
        setMontoInteres({value:"0.0", isValid:true});
        setMontototal({value:"0.0", isValid:true});
        setObservacionesVenta("");
    }

    useEffect(() => {
        if(clienteSeleccionado) {
            setCodigoCliente(clienteSeleccionado.n_cliente);
            setNombreCliente(clienteSeleccionado.c_nombrescompleto);
        } else {
            setCodigoCliente("");
            setNombreCliente("");
        }
    }, [clienteSeleccionado])

    const setDataFunction = () => {
        if(productSelected.n_cliente) setCodigoCliente(productSelected.n_cliente);
        if(productSelected.c_nombrescompleto) setNombreCliente(productSelected.c_nombrescompleto);
        if(productSelected.c_tipoventa) setTipoVenta(productSelected.c_tipoventa);
        if(productSelected.n_percentcap) setPercentCap({value:productSelected.n_percentcap});
        if(productSelected.n_montocap) setMontoCap({value:productSelected.n_montocap});
        if(productSelected.n_montoint) setMontoInteres({value:productSelected.n_montoint});
        if(productSelected.n_montototal) setMontototal({value:productSelected.n_montototal});
        if(productSelected.c_observacionesventa) setObservacionesVenta(productSelected.c_observacionesventa);
    }

    const validate = () => {
        if( !codigoCliente || !tipoVenta || !montoCap.value || Number(montoCap.value) <= 0 || !montoInteres.value ||
            Number(montoInteres.value) <= 0 || !observacionesVenta ) {
                setNotification({...notification, message: 'LLenar los campos con valores validos'})
                return false;
        }
        if( Number(percentCap.value) > 100 ) {
            setNotification({...notification, message: 'El monto capital no puede ser mayor al saldo'})
                return false;
        }
        if( Number(percentCap.value) < 100 && productos.length === 1 ) {
            setNotification({...notification, message: 'El porcentaje de Capital debe ser 100 cuando hay un producto'})
                return false;
        }
        return true;
    }

    const updateProductos = () => {
        if(productos.length === 2) {
            const productosAx = JSON.parse(JSON.stringify(productos)).map((producto, index) => {
                if(index === nIndex) {
                    producto.n_cliente = codigoCliente;
                    producto.c_nombrescompleto = nombreCliente;
                    producto.c_tipoventa = tipoVenta;
                    producto.n_percentcap = percentCap.value;
                    producto.n_montocap = montoCap.value;
                    producto.n_montototal = montototal.value;
                    producto.n_montoint = montoInteres.value;
                    producto.c_observacionesventa = observacionesVenta;
                    producto.t_cliente = `${codigoCliente}-${nombreCliente}`;
                } else {
                    producto.n_percentcap = Number(100 - Number(percentCap.value)).toFixed(2);
                    producto.n_montocap = Number(saldoCapital - Number(montoCap.value)).toFixed(2);
                    const interesP = producto.n_montoint ? Number(producto.n_montoint) : 0;
                    producto.n_montototal = Number(producto.n_montocap) + interesP;
                }
                return producto;
            });
            setProductos(productosAx);
        } else {
            const productosAx = JSON.parse(JSON.stringify(productos)).map((producto, index) => {
                if(index === nIndex) {
                    producto.n_cliente = codigoCliente;
                    producto.c_nombrescompleto = nombreCliente;
                    producto.c_tipoventa = tipoVenta;
                    producto.n_percentcap = percentCap.value;
                    producto.n_montocap = montoCap.value;
                    producto.n_montototal = montototal.value;
                    producto.n_montoint = montoInteres.value;
                    producto.c_observacionesventa = observacionesVenta;
                    producto.t_cliente = `${codigoCliente}-${nombreCliente}`;
                }
                return producto;
            });
            setProductos(productosAx);
        }
    }

    const handleSaveInformation = () => {
        if(validate()) {
            updateProductos();
            setNIndex(null);
            handleClose();
        } else {
            setIsAlert(true);
        }
    }

    useEffect(() => {
        if(productSelected) setDataFunction();
    }, [productSelected])

    useEffect(() => {
        setMontoCap({value: Number(Number(newPercentCap.value) * Number(saldoCapital) / 100).toFixed(2)})
        setPercentCap({value: newPercentCap.value});
    }, [newPercentCap])

    useEffect(() => {
        setPercentCap({value: Number(100 * Number(newMontoCap.value) / Number(saldoCapital)).toFixed(2)});
        setMontoCap({value: newMontoCap.value});
    }, [newMontoCap])

    useEffect(() => {
        const monto =  montoCap.value ? Number(montoCap.value) : 0;
        const interes = montoInteres.value ? Number(montoInteres.value) : 0;
        setMontototal({value: Number(monto + interes).toFixed(2)});
    }, [montoCap, montoInteres])


    return (
        <>
            <Modal isOpen={isOpen} title="Datos de venta" classModal='ModalForm' onClose={handleClose} modal_class="Modal__container__form">
                <div className="modal-body row">
                { isLoading ?
                    <div className='d-flex w-100 row justify-content-center'>
                        <Spinner/>
                    </div>
                    :<>
                    <SearcherComponent
                        placeholder="Nombre del cliente"
                        label="Cliente"
                        inputCodeId="clienteCodigoModalId"
                        stateCode={codigoCliente}
                        setStateCode={setCodigoCliente}
                        inputId="clienteNombreModalId"
                        stateName={nombreCliente}
                        setStateName={setNombreCliente}
                        onHandleClick={()=>setOpenSearchModal(true)}
                        onHandleBlur={findClienteByCode}
                        classForm="col-12 col-lg-6"
                        marginForm=""
                    />
                    <SelectComponent
                        labelText="Tipo Venta"
                        defaultValue="Seleccione un tipo"
                        items={[{value: "C", option:"Tercero"}, {value: "A", option:"Tienda"}]}
                        disableDefaultValue={false}
                        selectId="tipoVentaModalId"
                        valueField="value"
                        optionField="option"
                        valueSelected={tipoVenta}
                        handleChange={setTipoVenta}
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="% Capital"
                        state={percentCap}
                        setState={setNewPercentCap}
                        type="number"
                        placeholder="% capital"
                        inputId="percentCapId"
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="M. Capital"
                        state={montoCap}
                        setState={setNewMontoCap}
                        type="number"
                        placeholder="Monto capital"
                        inputId="mCapitalId"
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="Intereses"
                        state={montoInteres}
                        setState={setMontoInteres}
                        type="number"
                        placeholder="Intereses"
                        inputId="interesesVentaId"
                        classForm="col-12 col-lg-6"
                    />
                    <InputComponent
                        label="M. Total Venta"
                        state={montototal}
                        setState={setMontototal}
                        type="number"
                        placeholder="Monto total venta"
                        inputId="mTotalVentaId"
                        classForm="col-12 col-lg-6"
                        readOnly={true}
                    />
                    <TextareaComponent
                        inputId="observacionVentaId"
                        label="Observaciones"
                        placeholder="Observaciones"
                        value={observacionesVenta}
                        setState={setObservacionesVenta}
                        max={500}
                        classForm="col-12"
                        labelSpace={1}
                    />
                </>
                }
                </div>
                {/*Alerta*/}
                { isAlert === true && <Alert
                    title={notification.title}
                    type={notification.type}
                    mainMessage={notification.message}
                /> }
                <div className="modal-footer justify-content-center">
                    <button onClick={handleSaveInformation} className="btn btn-primary">
                        Guardar
                    </button>
                </div>
            </Modal>
            <SearchModalCliente
                isOpen={openSearchModal}
                onClose={()=>setOpenSearchModal(false)}
                setClienteObtained={setClienteSeleccionado}
                compania={compania}
            />
        </>
    )
}

export default AuctionProductsModal