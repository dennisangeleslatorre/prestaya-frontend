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
import { useLocation, useHistory, useParams } from 'react-router'
import { getClienteByCodigoCliente, getProductoDinamico, getTransaccionDinamico, getAgenciaAndCompaniaByCodigo } from '../../Api/Api';
import { Button, Space, Table, Tooltip } from 'antd'
import TransactionDetailModal from '../../components/TransactionDetailModal/TransactionDetailModal'
import moment from 'moment'

const monedas = [
    { name: 'LOCAL', value: 'L' },
    { name: 'EXTERIOR', value: 'E' }
];

const columns = [
    {
        title: 'Linea',
        dataIndex: 'n_linea',
        ellipsis: {
            showTitle: false,
        },
        width: 120,
    },{
        title: 'Producto  ',
        dataIndex: 'c_item',
        ellipsis: {
            showTitle: false,
        },
        width: 140,
    },{
        title: 'Descripción',
        dataIndex: 'c_descripcionproducto',
        ellipsis: {
            showTitle: false,
        },
        width: 160,
        render: (c_descripcionproducto, objeto) => (
            <div>
                <Tooltip placement="topLeft" title={c_descripcionproducto}>
                    {c_descripcionproducto}
                </Tooltip>
            </div>
        ),
    },{
        title: 'Unidad M.',
        dataIndex: 'c_unidadmedida',
        ellipsis: {
            showTitle: false,
        },
        width: 140
    },{
        title: 'Cantidad',
        dataIndex: 'n_cantidad',
        width: 140,
         ellipsis: {
            showTitle: false,
        }
    },{
        title: 'Precio',
        dataIndex: 'n_precio',
        ellipsis: {
            showTitle: false,
        },
        width: 160,
        className: 'text-numbers-table'
    },{
        title: 'Monto Total',
        dataIndex: 'n_montototal',
        ellipsis: {
            showTitle: false,
        },
        width: 160,
        className: 'text-numbers-table'
    },{
        title: 'Observacioens',
        dataIndex: 'c_observaciones',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        render: (c_observaciones, objeto) => (
            <div>
                <Tooltip placement="topLeft" title={c_observaciones}>
                    {c_observaciones}
                </Tooltip>
            </div>
        ),
    },{
        title:() => <label className='text-audit-table'>Estado</label>,
        dataIndex: 'c_estado_desc',
        width: 140,
         ellipsis: {
            showTitle: false,
        },
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>U. Registro</label>,
        dataIndex: 'c_usuarioregistro',
        ellipsis: {
            showTitle: false,
        },
        width: 155,
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>F. Registro</label>,
        dataIndex: 'd_fecharegistro',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>U. Modificación</label>,
        dataIndex: 'c_ultimousuario',
        ellipsis: {
            showTitle: false,
        },
        width: 155,
        className: 'table-audit-column text-audit-table',
    },{
        title:() => <label className='text-audit-table'>F. Modificación</label>,
        dataIndex: 'd_ultimafechamodificacion',
        ellipsis: {
            showTitle: false,
        },
        width: 180,
        className: 'table-audit-column text-audit-table',
    }
]

const TransaccionForm = () => {
    //Estados del formulario
    const [buttonAttributes, setButtonAttributes] = useState({label:"", class:""});
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
    const location = useLocation();
    const urlFragment = location.pathname.split('/')[1];
    const buttonTypes = {
        nuevaTransaccion: {label:"Guardar", class:"btn btn-primary btn-form"},
        visualizarTransaccion: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    const readOnlyView = urlFragment === "visualizarTransaccion" ? true : false;
    const formFunctions = {
      nuevaTransaccion: ()=> handleRegister()
    }

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

    /*const validate = () => {
        if(!perfil.isValid || !codigo.isValid || paginas.length === 0) return false;
        return true;
    }*/

    /*const prepareData = () => {
        const data = {
            n_perfil: perfil.value,
            c_codigoperfil: codigo.value.toUpperCase(),
            c_paginas: paginas.reduce((value, cvv)=>cvv=`${value},${cvv}`),
            c_estado: estado
        }
        return data;
    }*/

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_usuarioregistro = userLogedIn;
        //const response = await registerPerfil(data);
        /*if (response && response.status === 200) {
            prepareNotificationSuccess("Se registró con éxito la transaccion");
            assignReportesToProfile();
        } else
            prepareNotificationDanger("Error al registrar", response.message)*/
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarTransaccion") {
            if(validate()) {
                setOpen(true);
                if(urlFragment === "nuevaTransaccion") setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"});
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/transacionestienda")
        }
    }

    const getData = async () => {
        /*await getPaginasByPerfilFunction();
        await getReportesByPerfilFunction();*/
    }

    const rowSelection = {
        onChange: (selectedKeys, selectedRows) => {
            setElementSelected(selectedRows);
            setSelectedRowKeys(selectedKeys);
        }
    };

    const deleteDetalleTransaccion = () => {
        if(elementSelected) {
            let listDetalles = JSON.parse(JSON.stringify(detalles));
            listDetalles.splice(selectedRowKeys, 1);
            setDetalles(listDetalles);
        } else {
            prepareNotificationDanger("Aviso", "Favor de seleccionar un item de la tabla")
        }
    }

    const getAgenciaInfo = async () => {
        const response = await getAgenciaAndCompaniaByCodigo({c_compania:compania, c_agencia:agencia});
        if(response.status === 200) {
            const data = response.body.data;
            setAgenciaNombre(data.agencia_desc);
            setCompaniaNombre(data.compania_desc);
        }else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    const getDataTable = (detalles) => {
        const detallesAux = detalles.map( (item, index) => {
            let aux = item;
            aux.key = index;
            return aux;
        })
        setDataTableDetalles(detallesAux);
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
        setButtonAttributes(buttonTypes[urlFragment]);
        await getAgenciaInfo();
        /*
        await getReportesFunction()
        if(urlFragment !== "nuevoPerfil") await getData();
        */
        setIsLoading(false);
    }, [])

  return (
    <>
      <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification} showButton={urlFragment !== 'visualizarPrestamo'}
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
                readOnly={readOnlyView}
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
                disabledElement={readOnlyView}
                classForm="col-12 col-lg-6"
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
            onHandleFunction={formFunctions[urlFragment]}
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