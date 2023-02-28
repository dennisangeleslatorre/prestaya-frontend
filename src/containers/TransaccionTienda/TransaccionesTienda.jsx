import React, { useEffect, useState } from 'react'
//Componentes
import DateRangeComponent from '../../components/DateRangeComponent/DateRangeComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import PeriodoRange from '../../components/PeriodoRange/PeriodoRange';
import ReactSelect from '../../components/ReactSelect/ReactSelect';
import ReportContainer from '../../components/ReportContainer/ReportContainer'
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent';
import SelectComponent from '../../components/SelectComponent/SelectComponent';
import LoadingModal from '../../components/Modal/LoadingModal';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import ResponseModal from '../../components/Modal/ResponseModal';
import SearchModalCliente from '../../components/Modal/SearchModalCliente';
//Servicios
import { listAllCompanias, listAgencias, getClienteByCodigoCliente } from '../../Api/Api';
//Librerias
import moment from 'moment';


const estados = [
    { name: 'TODOS', value: 'TO' },
    { name: 'REGISTRADO', value: 'RE' },
    { name: 'ANULADO', value: 'AN' }
]

const tipos = [{value:"NI", option:"Nota de ingreso"}, {value:"NS", option:"Nota de salido"}, {value:"TO", option:"Todos"}]

const TransaccionesTienda = () => {
    //Estados
    const [compania, setCompania] = useState("");
    const [agencia, setAgencia] = useState("T");
    const [codigoCliente, setCodigoCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [fecha, setFecha] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [disabledFilterFecha, setDisabledFilterFecha] = useState(true);
    const [tipo, setTipo] = useState("TO");
    const [numeroDocumento, setNumeroDocumento] = useState({value: "", isValid:null});
    const [periodo, setPeriodo] = useState({periodoInicio:"", periodoFin:"", isValid:null});
    const [estado, setEstado] = useState("TO");
    const [nPrestamo, setNPrestamo] = useState({value:""})
    //Listas
    const [companias, setCompanias] = useState([]);
    const [agencias, setAgencias] = useState([]);
    //Form
    const [open, setOpen] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSeleccionarCompania = (value) => {
        setCompania(value);
        //Deberia buscar las agencias de la compañía
        getAgenciasByCompany(value);
    }

    const onHandleSearch = async () => {
        /*let parametros =  prepareBodyToSearch();
        const response = await getDataReporteVencidosyNoVencidos(parametros);
        if(response && response.status === 200 && response.body.data) {
            const data = response.body.data;
            getDataForTable(data);
        }
        else getDataForTable([]);*/
    }

    const onHandleClickSearch = async () => {
        await setIsLoading(true);
        await onHandleSearch();
        setIsLoading(false);
    }

    const getPeriodoDefualt = () => {
        const periodoAux = moment().format('yyyy-MM');
        setPeriodo({periodoInicio:periodoAux, periodoFin:periodoAux, isValid:true})
    };

    //Listas
    const getCompanias =  async () => {
        const response = await listAllCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }
    const getAgenciasByCompany = async (companyCode) => {
        const response = await listAgencias({c_compania: companyCode});
        if(response && response.status === 200 && response.body.data) setAgencias([{c_agencia:"T", c_descripcion:"TODAS"}, ...response.body.data]);
    }

    useEffect(() => {
        if(clienteSeleccionado) {
            setCodigoCliente(clienteSeleccionado.n_cliente);
            setNombreCliente(clienteSeleccionado.c_nombrescompleto);
        }
    }, [clienteSeleccionado])

    useEffect(() => {
        if(companias.length !== 0) {
            handleSeleccionarCompania(companias[0].c_compania);
            setAgencia("T");
        };
    }, [companias])

    useEffect(async() => {
        await setIsLoading(true);
        await getCompanias();
        getPeriodoDefualt();
        setIsLoading(false);
    }, [])

  return (
    <>
        <ReportContainer>
            <div className="row col-12 col-md-12">
                <ReactSelect
                    inputId="companiaCodeId"
                    labelText="Compañía"
                    placeholder="Seleccione un compañía"
                    valueSelected={compania}
                    data={companias}
                    handleElementSelected={setCompania}
                    optionField="c_descripcion"
                    valueField="c_compania"
                    classForm="col-12 col-md-6"
                    marginForm="ml-0"
                />
                <ReactSelect
                    inputId="agenciaCodeId"
                    labelText="Agencia"
                    placeholder="Seleccione una agencia"
                    valueSelected={agencia}
                    data={agencias}
                    handleElementSelected={setAgencia}
                    optionField="c_descripcion"
                    valueField="c_agencia"
                    classForm="col-12 col-md-6"
                    marginForm="ml-0"
                />
                <DateRangeComponent
                    inputId="fechaId"
                    labelText="Fecha"
                    state={fecha}
                    setState={setFecha}
                    enabled={disabledFilterFecha}
                    setEnabled={setDisabledFilterFecha}
                    classForm="col-12 col-md-6"
                    marginForm="ml-0"
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
                    marginForm="ml-0"
                />
                <SelectComponent
                    labelText="Tipo"
                    defaultValue="Seleccione un tipo"
                    items={tipos}
                    selectId="tipoId"
                    valueField="value"
                    optionField="option"
                    valueSelected={tipo}
                    handleChange={setTipo}
                    marginForm="ml-0"
                    classForm="col-12 col-lg-6"
                />
                <InputComponent
                    label="N° documento"
                    state={numeroDocumento}
                    setState={setNumeroDocumento}
                    type="text"
                    placeholder="N° documento"
                    inputId="numeroDocumentoId"
                    marginForm="ml-0"
                    classForm="col-12 col-lg-6"
                />
                <PeriodoRange
                    inputId="periodoId"
                    labelText="Periodo"
                    state={periodo}
                    setState={setPeriodo}
                    classForm="col-12 col-md-6"
                    marginForm="ml-0"
                />
                <SelectComponent
                    labelText="Estado"
                    defaultValue="Seleccione un estado"
                    items={estados}
                    selectId="estadoId"
                    valueField="value"
                    optionField="name"
                    valueSelected={estado}
                    handleChange={setEstado}
                    classForm="col-12 col-md-6"
                    marginForm="ml-0"
                />
                <InputComponent
                    state={nPrestamo}
                    setState={setNPrestamo}
                    type="text"
                    label="# Prestamo"
                    placeholder="# Prestamo"
                    inputId="nPrestamoInput"
                    classForm="col-12 col-md-6"
                    marginForm="ml-0"
                />
            </div>
        </ReportContainer>
        {isLoading === true && <LoadingModal/>}
        <ConfirmationModal
            isOpen={open}
            onClose={()=>setOpen(false)}
            title={"Aviso de retorno"}
            message={"¿Seguro que desea regresar el estado del prestamo a pendiente?."}
            onHandleFunction={()=>handleRetornarPendiente()}
            buttonClass="btn-success"
        />
        <ResponseModal
            isOpen={openResponseModal}
            title={responseData.title}
            onClose={()=>setOpenResponseModal(false)}
            message={responseData.message}
        />
        <SearchModalCliente
            isOpen={openSearchModal}
            onClose={()=>setOpenSearchModal(false)}
            setClienteObtained={setClienteSeleccionado}
            compania={compania}
        />
    </>
  )
}

export default TransaccionesTienda