import React, { useEffect, useState } from 'react'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import ReportContainer from '../../components/ReportContainer/ReportContainer'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
//Servicios
import { listAllCompanias, listAgencias, listTiposProducto, getProductoDinamico } from '../../Api/Api';
import SearcherComponent from '../../components/SearcherComponent/SearcherComponent';
import ResponseModal from '../../components/Modal/ResponseModal';

const estados = [{ name: 'TODOS', value: 'T' },{ name: 'ACTIVO', value: 'A' },{ name: 'INACTIVO', value: 'I' }];

const Productos = () => {

    //Estados
    const [compania, setCompania] = useState("");
    const [agencia, setAgencia] = useState("T");
    const [tipo, setTipo] = useState("T");
    const [estado, setEstado] = useState("TO");
    const [codigoProducto, setCodigoProducto] = useState("");
    const [nombreProducto, setNombreProducto] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    //Listas
    const [companias, setCompanias] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [tiposProducto, setTiposProducto] = useState([]);
    //Form
    const [open, setOpen] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [openResponseModal , setOpenResponseModal] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const findProductoByCode = async () => {
        setIsLoading(true);
        if(codigoProducto) {
            const response = await getProductoDinamico({ c_compania:compania, c_agencia:agencia, c_item:codigoProducto });
            if(response && response.status === 200 && response.body.data) {
                setNombreProducto(response.body.data[0].DESCRIPCIONTPRODUCTO);
            } else {
                setResponseData({title:"Aviso", message:"No hay un producto con ese código"});
                setCodigoProducto("");
                setNombreProducto("");
                setProductoSeleccionado({});
                setOpenResponseModal(true);
            }
        } else
        setNombreProducto("");
        setIsLoading(false);
    }

    //Listas
    const getCompanias =  async () => {
        const response = await listAllCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }
    const getAgenciasByCompany = async (companyCode) => {
        const response = await listAgencias({c_compania: companyCode});
        if(response && response.status === 200 && response.body.data) setAgencias(response.body.data);
    }
    const getTiposProducto = async () => {
        const response = await listTiposProducto();
        if(response && response.status === 200) setTiposProducto([{c_descripcion:"TODOS",c_tipoproducto:"T"},...response.body.data]);
    }

    useEffect(() => {
        if(productoSeleccionado) {
            setCodigoProducto(productoSeleccionado.c_item);
            setNombreProducto(productoSeleccionado.c_descripcionproducto);
        }
    }, [productoSeleccionado])

    useEffect(() => {
        if(companias.length !== 0) {
            handleSeleccionarCompania(companias[0].c_compania);
        };
    }, [companias])

    useEffect(() => {
        if(agencias.length !== 0) {
            setAgencia(agencias[0].c_agencia);
        };
    }, [agencias])

    useEffect(async() => {
        await setIsLoading(true);
        await getCompanias();
        await getTiposProducto();
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
                    marginForm="ml-0"
                />
                <SearcherComponent
                    placeholder="Nombre del producto"
                    label="Producto"
                    inputCodeId="productoCodigoId"
                    stateCode={codigoProducto}
                    setStateCode={setCodigoProducto}
                    inputId="productoNombreId"
                    stateName={nombreProducto}
                    setStateName={setNombreProducto}
                    onHandleClick={()=>setOpenSearchModal(true)}
                    onHandleBlur={findProductoByCode}
                    readOnly={true}
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
            </div>
        </ReportContainer>
        <ResponseModal
            isOpen={openResponseModal}
            title={responseData.title}
            onClose={()=>setOpenResponseModal(false)}
            message={responseData.message}
        />
    </>
  )
}

export default Productos