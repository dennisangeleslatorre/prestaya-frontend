import React, { useContext, useEffect, useState } from 'react'
//Componentes
import FormContainer from '../../components/FormContainer/FormContainer'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
import InputComponentView from '../../components/InputComponent/InputComponentView'
import InputComponent from '../../components/InputComponent/InputComponent'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import PeriodoInputComponent from '../../components/PeriodoInputComponent/PeriodoInputComponent'
import SearchModalCliente from '../../components/Modal/SearchModalCliente'
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent'
//Context
import UserContext from '../../context/UserContext/UserContext'
//Functions
import { useHistory, useParams } from 'react-router'
import { getClienteByCodigoCliente, getAgenciaAndCompaniaByCodigo, registerTransaccion } from '../../Api/Api';
import { Button, Space, Table } from 'antd'
import TransactionDetailModal from '../../components/TransactionDetailModal/TransactionDetailModal'
import moment from 'moment'
import { columns, monedas } from './tableColumns';
import TextareaComponent from '../../components/TextareaComponent/TextareaComponent'

const TransaccionForm = () => {
    //Estados del formulario
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openModalForm, setOpenModalForm] = useState(false);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [modalAttributes, setModalAttributes] = useState({title:"", message:""});
    const [isAlert, setIsAlert] = useState(false);
    const [notification, setNotification] = useState({title:"", type:"", message:""});
    //Campos
    const [agenciaNombre, setAgenciaNombre] = useState("");
    const [companiaNombre, setCompaniaNombre] = useState("");
    const [numeroDoc, setNumeroDoc] = useState({value:"", isValid:true})
    const [estado, setEstado] = useState("RE");
    const [fechaDocumento, setFechaDocumento] = useState({value:""});
    const [periodo, setPeriodo] = useState("");
    const [codigoCliente, setCodigoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const [moneda, setMoneda] = useState("L");
    const [observaciones, setObservaciones] = useState("");
    const [montoTotal, setMontoTotal] = useState("0.00");
    const [elementSelected, setElementSelected] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [dataTableDetalles, setDataTableDetalles] = useState([]);
    const [detalles, setDetalles] = useState([]);
    //Contextos
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData().c_codigousuario;
    const { compania, agencia } = useParams();
    let history = useHistory();

    const findClienteByCode = async () => {
        setIsLoading(true);
        if(codigoCliente) {
            const response = await getClienteByCodigoCliente({c_compania:compania, n_cliente:codigoCliente});
            if(response && response.status === 200 && response.body.data) {
                setNombreCliente(response.body.data.c_nombrescompleto);
            } else {
                setResponseData({title:"Aviso", message:"No hay un cliente con ese código"});
                setCodigoCliente("");
                setNombreCliente("");
                setClienteSeleccionado({});
                setOpenResponseModal(true);
            }
        } else
            setNombreCliente("");
        setIsLoading(false);
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/transacionestienda"});
        setOpenResponseModal(true);
    }
    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if(!fechaDocumento.value || !codigoCliente || detalles.length === 0 || !observaciones) return false;
        return true;
    }

    const getProductos = (detalles) => {
        const groupedArr = detalles.reduce((acc, cur) => {
            const { c_item, n_cantidad } = cur;
            if (!acc[c_item]) {
                acc[c_item] = {
                    ...cur,
                    n_cantidad: parseFloat(n_cantidad)
                };
            } else {
                acc[c_item].n_cantidad += parseFloat(n_cantidad);
            }
            return acc;
        }, {});

        const result = Object.values(groupedArr);
        return {productosDatos: result};
    }

    const getDetalles = (detalles) => {
        return {
            detalles: {
                d_fechadocumento: moment(fechaDocumento.value).format("yyyy-MM-DD"),
                c_periodo: periodo.replace("-", ""),
                n_cliente: codigoCliente,
                c_moneda: moneda,
                c_observaciones: observaciones,
                n_montototal: montoTotal,
                c_estado: "RE",
                productosDetalle: detalles.map((item, index) => {
                    let aux = {};
                    aux.n_linea = index + 1;
                    aux.c_item = item.c_item;
                    aux.n_cantidad = item.n_cantidad;
                    aux.n_precio = item.n_precio;
                    aux.n_montototal = Number(item.n_cantidad) * Number(item.n_precio)
                    aux.c_observacionesdet = item.c_observaciones;
                    return aux;
                })
            }
        }
    }

    const prepareData = () => {
        const detallesAux = JSON.parse(JSON.stringify(detalles));
        const data = {
            c_agencia: agencia,
            c_compania: compania,
            c_usuarioregistro: userLogedIn,
            productos: getProductos(detallesAux),
            detalles: getDetalles(detallesAux)
        }
        return data;
    }

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        const response = await registerTransaccion(data);
        if (response && response.status === 200  && response.body && response.body.message === "OK") {
            prepareNotificationSuccess("Se registró con éxito la transaccion");
        } else
            prepareNotificationDanger("Error al registrar", response.body?.message);
        setIsLoading(false);
    }

    const handleClick = () => {
        if(validate()) {
            setOpen(true);
            setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"});
        } else {
            prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
        }

    }

    const rowSelection = {
        onChange: (selectedKeys, selectedRows) => {
            setElementSelected(selectedRows);
            setSelectedRowKeys(selectedKeys);
        }
    };

    const deleteDetalleTransaccion = () => {
        if(elementSelected.length > 0) {
            let listDetalles = JSON.parse(JSON.stringify(detalles));
            listDetalles.splice(selectedRowKeys, 1);
            setDetalles(listDetalles);
            setElementSelected([]);
            setSelectedRowKeys([]);
        } else {
            setResponseData({message: "Favor de seleccionar un item de la tabla", title: "Aviso"});
            setOpenResponseModal(true);
        }
    }

    const getAgenciaInfo = async () => {
        const response = await getAgenciaAndCompaniaByCodigo({c_compania:compania, c_agencia:agencia});
        if(response.status === 200 && response.body && response.body.data) {
            const data = response.body.data;
            setAgenciaNombre(data.agencia_desc);
            setCompaniaNombre(data.compania_desc);
        }else {
            prepareNotificationDanger("Error", response.body.message);
            setResponseData({message: "No se encontró la agencia", title: "Error", url:"/transacionestienda"});
            setOpenResponseModal(true);
        }
    }

    const getDataTable = (detalles) => {
        let montoTotal = 0.00;
        const detallesAux = detalles.map( (item, index) => {
            let aux = item;
            aux.key = index;
            montoTotal = Number(parseFloat(montoTotal) + parseFloat(item.n_cantidad) * parseFloat(item.n_precio)).toFixed(2);
            return aux;
        })
        setDataTableDetalles(detallesAux);
        setMontoTotal(montoTotal);
    }

    useEffect(() => {
        getDataTable(detalles);
    }, [detalles])

    useEffect(() => {
        if(fechaDocumento.value) {
            setPeriodo(`${moment(fechaDocumento.value).format('YYYY-MM')}`)
        }
    }, [fechaDocumento])

    useEffect(() => {
        if(clienteSeleccionado) {
            setCodigoCliente(clienteSeleccionado.n_cliente);
            setNombreCliente(clienteSeleccionado.c_nombrescompleto);
        }
    }, [clienteSeleccionado])

    useEffect(async () => {
        await setIsLoading(true);
        await getAgenciaInfo();
        setIsLoading(false);
    }, [])

  return (
    <>
      <FormContainer buttonAttributes={{label:"Guardar", class:"btn btn-primary btn-form"}} handleClick={handleClick} isAlert={isAlert} notification={notification} showButton={true}
            goList={()=>history.push(`/transacionestienda`)} view={false}>
        <div className="col-12 row">
            <InputComponentView
                label="Compañía"
                state={companiaNombre}
                setState={()=>{}}
                type="text"
                placeholder="Compañía"
                inputId="companiaId"
                readOnly={true}
                classForm="col-12 col-lg-6"
            />
            <InputComponentView
                label="Agencia"
                state={agenciaNombre}
                setState={()=>{}}
                type="text"
                placeholder="Agencia"
                inputId="agenciaId"
                readOnly={true}
                classForm="col-12 col-lg-6"
            />
            <InputComponentView
                label="Tipo Doc"
                state={'Nota Salida'}
                setState={()=>{}}
                type="text"
                placeholder="Tipo Doc"
                inputId="tipoDocId"
                readOnly={true}
                classForm="col-12 col-lg-6"
            />
            <InputComponent
                label="Numero Doc"
                state={numeroDoc}
                setState={setNumeroDoc}
                type="text"
                placeholder="Numero Doc"
                inputId="numeroDocID"
                classForm="col-12 col-lg-6"
                readOnly={true}
            />
            <SelectComponent
                labelText="Estado"
                defaultValue="Seleccione un estado"
                items={[{name: "ANULADO", value:"AN"}, {name: "REGISTRADO", value:"RE"}]}
                selectId="estadoId"
                valueField="value"
                optionField="name"
                valueSelected={estado}
                handleChange={setEstado}
                disabledElement={true}
                classForm="col-12 col-lg-6"
            />
            <InputComponent
                label="Fecha Doc"
                state={fechaDocumento}
                setState={setFechaDocumento}
                type="date"
                placeholder="Fecha Doc"
                inputId="fechaDocumentoId"
                classForm="col-12 col-lg-6"
                readOnly={false}
            />
            <PeriodoInputComponent
                label="Período"
                value={periodo}
                setState={setPeriodo}
                placeholder="Período"
                inputId="periodoId"
                classForm="col-12 col-lg-6"
                readOnly={true}
                marginForm=""
            />
            <SearcherComponent
                placeholder="Nombre del cliente"
                label="Cliente"
                inputCodeId="clienteCodigoId"
                stateCode={codigoCliente}
                setStateCode={setCodigoCliente}
                inputId="clienteNombreId"
                stateName={nombreCliente}
                setStateName={setNombreCliente}
                onHandleClick={()=>setOpenSearchModal(true)}
                onHandleBlur={findClienteByCode}
                readOnly={true}
                classForm="col-12 col-md-6"
                marginForm=""
            />
            <SelectComponent
                labelText="Moneda"
                defaultValue="Seleccione un moneda"
                items={monedas}
                selectId="monedaId"
                valueField="value"
                optionField="name"
                valueSelected={moneda}
                handleChange={setMoneda}
                disabledElement={false}
                classForm="col-12 col-lg-6"
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
                marginForm={""}
            />
        </div>
        <div className="col-12 d-flex justify-content-end">
            <InputComponentView
                label="Monto Total"
                state={montoTotal}
                setState={setMontoTotal}
                type="text"
                placeholder="Tipo Doc"
                inputId="tipoDocId"
                readOnly={true}
                classForm="col-12 col-lg-6"
            />
        </div>
        <div className="col-12">
            <Space size={[10, 3]} wrap style={{ marginBottom: 16 }}>
                <Button onClick={()=>setOpenModalForm(true)}>NUEVO</Button>
                <Button onClick={deleteDetalleTransaccion}>ELIMINAR</Button>
            </Space>
        </div>
        <div className="col-12" style={{ overflow: 'scroll' }}>
            <Table
                classForm
                rowSelection={{
                    type: "radio",
                    ...rowSelection,
                    selectedRowKeys,
                }}
                columns={columns}
                dataSource={dataTableDetalles}
                pagination={{ pageSize: 50 }}
            />
        </div>

      </FormContainer>
        {isLoading === true && <Loading/>}
        <ConfirmationModal
            isOpen={open}
            onClose={()=>setOpen(false)}
            title={modalAttributes.title}
            message={modalAttributes.message}
            onHandleFunction={()=>handleRegister()}
        />
        <ResponseModal
            isOpen={openResponseModal}
            title={responseData.title}
            onClose={()=>setOpenResponseModal(false)}
            message={responseData.message}
            buttonLink={responseData.url}
        />
        <SearchModalCliente
            isOpen={openSearchModal}
            onClose={()=>setOpenSearchModal(false)}
            setClienteObtained={setClienteSeleccionado}
            compania={compania}
        />
        <TransactionDetailModal
            isOpen={openModalForm}
            onClose={()=>setOpenModalForm(false)}
            detalles={detalles}
            setDetalles={setDetalles}
            compania={compania}
            agencia={agencia}
        />
    </>
  )
}

export default TransaccionForm