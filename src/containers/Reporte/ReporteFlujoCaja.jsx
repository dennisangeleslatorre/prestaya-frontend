import React, { useState, useEffect, useContext } from 'react'
import ReportContainer from '../../components/ReportContainer/ReportContainer';
import DateRangeComponent from '../../components/DateRangeComponent/DateRangeComponent';
import ReactSelect from '../../components/ReactSelect/ReactSelect';
import SelectComponent from '../../components/SelectComponent/SelectComponent';
import Loading from '../../components/Modal/LoadingModal';
import { PDFViewer } from '@react-pdf/renderer';
import ButtonDownloadExcel from '../../components/ButtonDownloadExcel/ButtonDownloadExcel';
import { listAllCompanias, listAgenciesByUserAndCompany, listUsers, listAllTipoMovimientoCaja, getDataReporteFlujoCaja } from '../../Api/Api'
import ReporteFlujoCajaPDFComponent from '../../components/ReporteFlujoCajaPDFComponent/ReporteFlujoCajaPDFComponent';
import PagesContext from '../../context/PagesContext/PagesContext'
import moment from 'moment'
import UserContext from '../../context/UserContext/UserContext'

const columnsExportExcel = [
    {
        label: 'NRO',
        value: row => (row.n_correlativo || '')
    },
    {
        label: 'FECHA',
        value: row => (moment(row.fechamov).format('DD/MM/yyyy') || '')
    },
    {
        label: 'OOBSERVACIONES',
        value: row => (row.diaobservacion || '')
    },
    {
        label: 'ESTADO',
        value: row => (row.diaestado || '')
    },
    {
        label: 'SEC.',
        value: row => (row.n_secuencia || '')
    },
    {
        label: 'TIPO MOVIMIENTO',
        value: row => (row.c_tipomovimientocc_desc || '')
    },
    {
        label: 'USUARIO MOV.',
        value: row => (row.usuariomov || '')
    },
    {
        label: 'OBSERVACIONES',
        value: row => (row.movobservacion || '')
    },
    {
        label: 'MNTO. INTERES A CANCELAR',
        value: row => (row.n_montointeresescancelar ? row.n_montointeresescancelar : (row.n_montoint ? row.n_montoint : ""))
    },
    {
        label: 'MNTO. PRESTAMO A CANCELAR',
        value: row => (row.n_montoprestamocancelar ? row.n_montoprestamocancelar : (row.n_montocap ? row.n_montocap : ""))
    },
    {
        label: 'MNTO. COMISION',
        value: row => (row.n_montocomisioncancelar || '')
    },
    {
        label: 'MNT TOTAL',
        value: row => (row.n_montoxdiamov || '')
    },
    {
        label: 'FUENTE',
        value: row => (row.c_fuente || '')
    },
    {
        label: 'Otra agencia',
        value: row => (row.otraagenciadesc || '')
    },
]

const estados = [{name: "TODOS", value: "T"},{name: "ABIERTO", value: "A"},{name: "CERRADO", value: "C"}];

const tiposCajaUsuario = [{name: 'TODOS', value: 'T'},{name: 'BOVEDA', value: 'B'},{name: 'PERSONAL', value: 'P'}];

const fuentes = [{name: 'TODOS', value: 'T'},{name: 'CAJA CHICA USUARIOS', value: 'CU'},{name: 'PRÉSTAMOS', value: 'PR'}];

const clasesTipoMov = [{name: 'TODAS', value: 'T'},{name: 'INGRESOS', value: 'I'},{name: 'SALIDAS', value: 'S'}];

const monedas = [{name: "TODAS", value: "T"},{name: "L", value: "LOCAL"},{name: "EXTERIOR", value: "E"}];

const ReporteFlujoCaja = () => {
    //Estado
    const [compania, setCompania] = useState("T");
    const [agencia, setAgencia] = useState("T");
    const [moneda, setMoneda] = useState("T");
    const [usuarioFC, setUsuarioFC] = useState("T");
    const [tipoCajaUsuario, setTipoCajaUsuario] = useState("T");
    const [fechaMovimiento, setFechaMovimiento] = useState({fechaInicio: "", fechaFin: "", isValid: false});
    const [enabledFechaMovimiento, setEnabledFechaMovimiento] = useState(true);
    const [estadoDia, setEstadoDia] = useState("T");
    const [fuente, setFuente] = useState("T");
    const [tipoMovimiento, setTipoMovimiento] = useState("T");
    const [claseTipoMov, setClaseTipoMov] = useState("T");
    const [isLoading, setIsLoading] = useState(false);
    const [elementPdf, setElementPdf] = useState(null);
    const [movsFlujoCaja, setMovsFlujoCaja] = useState([]);
    const [movsPxC, setMovsPxC] = useState([]);
    const [totalesFC, setTotalesFC] = useState({});
    const [totalesPxC, setTotalesPxC] = useState({});
    //Lista
    const [companias, setCompanias] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [tiposMovimientos, setTiposMovimientos] = useState([]);
    //Estados del pdf
    const [dataReportToTable, setDataReportToTable] = useState([]);
    //Contexto
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData().c_codigousuario;
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "USUARIO ACCESO TOTAL CAJA"
    });
    const usuarioAccesoTotalCajaPermiso = userPermisssions.includes("USUARIO ACCESO TOTAL CAJA");
    //Prepare
    const prepareBodyToSearch = () => {
        let body = {};
        if(compania) body.c_compania = compania;
        if(agencia && agencia !== "T") body.c_agencia = agencia;
        if(moneda && moneda !== "T") body.c_monedafcu = moneda;
        if(tipoCajaUsuario && tipoCajaUsuario !== "T") body.c_tipofcu = tipoCajaUsuario;
        if(usuarioFC && usuarioFC !== "T") body.c_usuariofcu = usuarioFC;
        if(fechaMovimiento.isValid && !enabledFechaMovimiento) {
            body.d_fechamovimientoinicio = fechaMovimiento.fechaInicio;
            body.d_fechamovimientofin = fechaMovimiento.fechaFin;
        }
        if(estadoDia && estadoDia !== "T") body.c_estado = estadoDia;
        if(fuente && fuente !== "T") body.c_fuente = fuente;
        if(tipoMovimiento && tipoMovimiento !== "T") body.c_tipomovimientocc = tipoMovimiento;
        if(claseTipoMov && claseTipoMov !== "T") body.c_clasetipomov = claseTipoMov;
        if(!usuarioAccesoTotalCajaPermiso) body.in_flaglistaadmin = "N";
        body.c_codigousuario = userLogedIn;
        return body;
    }
    //Evento
    const handleSeleccionarCompania = (value) => {
        setCompania(value);
        //Deberia buscar las agencias de la compañía
        getAgenciasByCompany(value);
    }
    const onHandleClickSearch = async () => {
        await setIsLoading(true);
        await onHandleSearch();
        setIsLoading(false);
    }
    //Funciones
    const getCompanias = async () => {
        const response = await listAllCompanias();
        if(response && response.status === 200) setCompanias(response.body.data);
    }
    const getUsuarios = async () => {
        const response = await listUsers();
        if(response && response.status === 200) setUsuarios([{c_codigousuario: "T", c_nombres: "TODOS"}, ...response.body.data]);
    }
    const getAgenciasByCompany = async (companyCode) => {
        const response = await listAgenciesByUserAndCompany({c_compania: companyCode, c_codigousuario: userLogedIn});
        if(response && response.status === 200 && response.body.data) setAgencias([{c_agencia:"T", c_descripcion:"TODAS"}, ...response.body.data]);
    }
    const getTiposMovimientosCaja = async () => {
        const response = await listAllTipoMovimientoCaja();
        if(response && response.status === 200 && response.body.data) {
            let responseList = response.body.data.sort((a, b) => {
                if(a.c_clasetipomov > b.c_clasetipomov) return 1;
                else if(a.c_clasetipomov < b.c_clasetipomov) return -1;
                else {
                    if(a.c_descricpion > b.c_descricpion) return 1;
                    else if(a.c_descricpion < b.c_descricpion) return -1;
                    return 0;
                }
            })
            setTiposMovimientos([{c_tipomovimientocc:"T", c_descricpion:"TODAS"}, ...responseList]);
        };
    }
    const onHandleSearch = async () => {
        await setIsLoading(true);
        let parametros = prepareBodyToSearch();
        const response = await getDataReporteFlujoCaja(parametros);
        if(response && response.status === 200 ) {
            const movCU = JSON.parse(JSON.stringify(response.body.data.movimientosCajaUsuario));
            const movPxC = JSON.parse(JSON.stringify(response.body.data.movimientosPxC));
            setDataFlujoCajaMovimientosTable(movCU);
            setDataPrestamoMovimientosTable(movPxC);
            setElementPdf({
                companianame: companias.find(c => c.c_compania === compania).c_descripcion,
                fechaMovimientoInicio: fechaMovimiento.fechaInicio ? moment(fechaMovimiento.fechaInicio).format("DD/MM/yyyy") : "-",
                fechaMovimientoFinal: fechaMovimiento.fechaFin ? moment(fechaMovimiento.fechaFin).format("DD/MM/yyyy") : "-",
                clase: clasesTipoMov.find(c => c.value === claseTipoMov).name,
                usuarioFC: usuarios.find(u => u.c_codigousuario === usuarioFC).c_nombres
            });
            setDataReportToTable([...movCU, ...movPxC]);
        } else {
            setDataFlujoCajaMovimientosTable([]);
            setDataPrestamoMovimientosTable([]);
        }
        setIsLoading(false);
    }

    const setDataPrestamoMovimientosTable = (movimientosPxC) => {
        let nuevoArray = [];
        let sumastotales = {
            suma_montointerescancelar: 0.00,
            suma_montoprestamocancelar: 0.00,
            suma_montocomisioncancelar: 0.00,
            suma_montototalcancelar: 0.00,
        };
        [...movimientosPxC].forEach(item => {
            if(nuevoArray.findIndex(mpc => mpc.cod === `${item.agenciadesc}-${item.usuariomov}`) < 0) {
                nuevoArray.push({
                    cod:  `${item.agenciadesc}-${item.usuariomov}`,
                    agencia: item.agenciadesc,
                    usuarioFlujoCaja: item.usuariomov,
                    tipoCajaUsuario: '',
                    moneda: item.moneda,
                    fechaInicio: fechaMovimiento.fechaInicio ? moment(fechaMovimiento.fechaInicio).format("DD/MM/yyyy") : "-",
                    fechaFin: fechaMovimiento.fechaFin ? moment(fechaMovimiento.fechaFin).format("DD/MM/yyyy") : "-",
                    sumas: {
                        suma_montointerescancelar: 0.00,
                        suma_montoprestamocancelar: 0.00,
                        suma_montocomisioncancelar: 0.00,
                        suma_montototalcancelar: 0.00,
                    },
                    fechas:[]
                })
            }
            const indexmpc = nuevoArray.findIndex(mpc => mpc.cod === `${item.agenciadesc}-${item.usuariomov}`);

            if(nuevoArray[indexmpc].fechas.findIndex(fecha => fecha.fecha === item.fechamov) < 0) {
                nuevoArray[indexmpc].fechas.push({
                  fecha: item.fechamov,
                  estado: item.diaestado,
                  observacion: '',
                  movimientos: []
                });
            }

            const indexFecha = nuevoArray[indexmpc].fechas.findIndex(fecha => fecha.fecha === item.fechamov);
            nuevoArray[indexmpc].fechas[indexFecha].movimientos.push({
                secuencia: '',
                tipomovimiento: item.c_tipomovimientocc_desc,
                usuariomov: item.usuariomov,
                observacion: '',
                montointerescancelar: item.n_montointeresescancelar || "",
                montoprestamocancelar: item.n_montoprestamocancelar  || "",
                montocomisioncancelar: item.n_montocomisioncancelar || "",
                montomov: item.n_montoxdiamov,
                clasemov: item.c_clasetipomov,
                fuente: item.c_fuente,
                c_prestamo: item.c_prestamo,
                otraagenciadesc: item.otraagenciadesc ? item.otraagenciadesc : ""
            })

            nuevoArray[indexmpc].sumas.suma_montointerescancelar = nuevoArray[indexmpc].sumas.suma_montointerescancelar + (item.n_montointeresescancelar ? Number(item.n_montointeresescancelar) : 0);
            nuevoArray[indexmpc].sumas.suma_montoprestamocancelar = nuevoArray[indexmpc].sumas.suma_montoprestamocancelar + (item.n_montoprestamocancelar ? Number(item.n_montoprestamocancelar) : 0);
            nuevoArray[indexmpc].sumas.suma_montocomisioncancelar = nuevoArray[indexmpc].sumas.suma_montocomisioncancelar + (item.n_montocomisioncancelar ? Number(item.n_montocomisioncancelar) : 0);
            nuevoArray[indexmpc].sumas.suma_montototalcancelar = nuevoArray[indexmpc].sumas.suma_montototalcancelar + (item.n_montoxdiamov ? (item.c_clasetipomov === "S" ? Number(item.n_montoxdiamov) * -1 : Number(item.n_montoxdiamov)) : 0);

            sumastotales.suma_montointerescancelar = sumastotales.suma_montointerescancelar + (item.n_montointeresescancelar ? Number(item.n_montointeresescancelar) : 0);
            sumastotales.suma_montoprestamocancelar = sumastotales.suma_montoprestamocancelar + (item.n_montoprestamocancelar ? Number(item.n_montoprestamocancelar) : 0);
            sumastotales.suma_montocomisioncancelar = sumastotales.suma_montocomisioncancelar + (item.n_montocomisioncancelar ? Number(item.n_montocomisioncancelar) : 0);
            sumastotales.suma_montototalcancelar = sumastotales.suma_montototalcancelar + (item.n_montoxdiamov ? (item.c_clasetipomov === "S" ? Number(item.n_montoxdiamov) * -1 : Number(item.n_montoxdiamov)) : 0);

        });
        setMovsPxC(nuevoArray);
        setTotalesPxC(sumastotales);
    }

    const setDataFlujoCajaMovimientosTable = (movimientosCU) => {
        const nuevoArray = [];
        let sumastotales = {
            suma_montointerescancelar: 0.00,
            suma_montoprestamocancelar: 0.00,
            suma_montocomisioncancelar: 0.00,
            suma_montototalcancelar: 0.00,
        };
        [...movimientosCU].forEach(item => {
            if(nuevoArray.findIndex(fc => fc.cod === `${item.c_compania}-${item.n_correlativo}`) < 0) {
                nuevoArray.push({
                    cod:  `${item.c_compania}-${item.n_correlativo}`,
                    agencia: item.agenciadesc,
                    usuarioFlujoCaja: item.usuariofcu,
                    tipoCajaUsuario: item.tipofcu,
                    moneda: item.moneda,
                    fechaInicio: moment(item.fechainiciocu).format("DD/MM/yyyy"),
                    fechaFin: moment(item.fechafincu).format("DD/MM/yyyy"),
                    sumas: {
                        suma_montointerescancelar: 0.00,
                        suma_montoprestamocancelar: 0.00,
                        suma_montocomisioncancelar: 0.00,
                        suma_montototalcancelar: 0.00,
                    },
                    fechas:[]
                })
            }
            const indexfc = nuevoArray.findIndex(fc => fc.cod === `${item.c_compania}-${item.n_correlativo}`);

            if(nuevoArray[indexfc].fechas.findIndex(fecha => fecha.fecha === item.fechamov) < 0) {
                nuevoArray[indexfc].fechas.push({
                  fecha: item.fechamov,
                  estado: item.diaestado,
                  observacion: item.diaobservacion,
                  movimientos: []
                });
            }

            const indexFecha = nuevoArray[indexfc].fechas.findIndex(fecha => fecha.fecha === item.fechamov);
            nuevoArray[indexfc].fechas[indexFecha].movimientos.push({
                secuencia: item.n_secuencia,
                tipomovimiento: item.c_tipomovimientocc_desc,
                usuariomov: item.usuariomov,
                observacion: item.movobservacion,
                montointerescancelar: item.n_montointeresescancelar ? item.n_montointeresescancelar : (item.n_montoint ? item.n_montoint : ""),
                montoprestamocancelar: item.n_montoprestamocancelar ? item.n_montoprestamocancelar : (item.n_montocap ? item.n_montocap : ""),
                montocomisioncancelar: item.n_montocomisioncancelar || "",
                montomov: item.n_montoxdiamov,
                clasemov: item.c_clasetipomov,
                fuente: item.c_fuente,
                c_prestamo: item.c_prestamo,
                percent_ganancia: item.n_montoint && item.n_montocap ? (Number(item.n_montoint) / Number(item.n_montocap) * 100) : "",
                otraagenciadesc: item.otraagenciadesc ? item.otraagenciadesc : ""
            })

            nuevoArray[indexfc].sumas.suma_montointerescancelar = nuevoArray[indexfc].sumas.suma_montointerescancelar + (item.n_montointeresescancelar ? Number(item.n_montointeresescancelar) : (item.n_montoint ? Number(item.n_montoint) : 0));
            nuevoArray[indexfc].sumas.suma_montoprestamocancelar = nuevoArray[indexfc].sumas.suma_montoprestamocancelar + (item.n_montoprestamocancelar ? Number(item.n_montoprestamocancelar) : (item.n_montocap ? Number(item.n_montocap) : 0));
            nuevoArray[indexfc].sumas.suma_montocomisioncancelar = nuevoArray[indexfc].sumas.suma_montocomisioncancelar + (item.n_montocomisioncancelar ? Number(item.n_montocomisioncancelar) : 0);
            nuevoArray[indexfc].sumas.suma_montototalcancelar = nuevoArray[indexfc].sumas.suma_montototalcancelar + (item.n_montoxdiamov ? (item.c_clasetipomov === "S" ? Number(item.n_montoxdiamov) * -1 : Number(item.n_montoxdiamov)) : 0);

            sumastotales.suma_montointerescancelar = sumastotales.suma_montointerescancelar + (item.n_montointeresescancelar ? Number(item.n_montointeresescancelar) : (item.n_montoint ? Number(item.n_montoint) : 0));
            sumastotales.suma_montoprestamocancelar = sumastotales.suma_montoprestamocancelar + (item.n_montoprestamocancelar ? Number(item.n_montoprestamocancelar) : (item.n_montocap ? Number(item.n_montocap) : 0));
            sumastotales.suma_montocomisioncancelar = sumastotales.suma_montocomisioncancelar + (item.n_montocomisioncancelar ? Number(item.n_montocomisioncancelar) : 0);
            sumastotales.suma_montototalcancelar = sumastotales.suma_montototalcancelar + (item.n_montoxdiamov ? (item.c_clasetipomov === "S" ? Number(item.n_montoxdiamov) * -1 : Number(item.n_montoxdiamov)) : 0);

        });
        setMovsFlujoCaja(nuevoArray);
        setTotalesFC(sumastotales);
    }

    useEffect(() => {
        if(companias.length !== 0) {
            handleSeleccionarCompania(companias[0].c_compania);
            setAgencia("T");
        };
    }, [companias])

    useEffect(async ()=> {
        await setIsLoading(true);
        await getCompanias();
        await getUsuarios();
        await getTiposMovimientosCaja();
        setIsLoading(false);
    },[])

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
                        handleElementSelected={handleSeleccionarCompania}
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
                    <SelectComponent
                        labelText="Moneda"
                        defaultValue="Seleccione una moneda"
                        items={monedas}
                        selectId="estadoId"
                        valueField="value"
                        optionField="name"
                        valueSelected={moneda}
                        handleChange={setMoneda}
                        classForm="col-12 col-lg-6"
                        marginForm="ml-0"
                    />
                    <SelectComponent
                        labelText="Tipo Caja Usuario"
                        defaultValue="Seleccione un tipo"
                        items={tiposCajaUsuario}
                        selectId="tipoCajaId"
                        valueField="value"
                        optionField="name"
                        valueSelected={tipoCajaUsuario}
                        handleChange={setTipoCajaUsuario}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <ReactSelect
                        inputId="usuarioCodeId"
                        labelText="Usuario"
                        placeholder="Seleccione un Usuario"
                        valueSelected={usuarioFC}
                        data={usuarios}
                        handleElementSelected={setUsuarioFC}
                        optionField="c_nombres"
                        valueField="c_codigousuario"
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <DateRangeComponent
                        inputId="fechaMovimientoId"
                        labelText="Fecha de movimiento"
                        state={fechaMovimiento}
                        setState={setFechaMovimiento}
                        enabled={enabledFechaMovimiento}
                        setEnabled={setEnabledFechaMovimiento}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <SelectComponent
                        labelText="Estado día"
                        defaultValue="Seleccione un estado"
                        items={estados}
                        selectId="estadoDiaId"
                        valueField="value"
                        optionField="name"
                        valueSelected={estadoDia}
                        handleChange={setEstadoDia}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <SelectComponent
                        labelText="Fuente"
                        defaultValue="Seleccione una fuente"
                        items={fuentes}
                        selectId="fuenteId"
                        valueField="value"
                        optionField="name"
                        valueSelected={fuente}
                        handleChange={setFuente}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <SelectComponent
                        labelText="Tipos Movimientos"
                        defaultValue="Seleccione un tipo"
                        items={tiposMovimientos}
                        selectId="tipoMovId"
                        valueField="c_tipomovimientocc"
                        optionField="c_descricpion"
                        valueSelected={tipoMovimiento}
                        handleChange={setTipoMovimiento}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                    <SelectComponent
                        labelText="Clase Tipo Mov."
                        defaultValue="Seleccione una clase"
                        items={clasesTipoMov}
                        selectId="claseTipoId"
                        valueField="value"
                        optionField="name"
                        valueSelected={claseTipoMov}
                        handleChange={setClaseTipoMov}
                        classForm="col-12 col-md-6"
                        marginForm="ml-0"
                    />
                </div>
                <div className="col-12 col-md-12 mt-3 mb-3 text-center">
                    <button onClick={onHandleClickSearch} className='btn btn-light' style={{width: "200px"}}>Buscar</button>
                </div>
                <ButtonDownloadExcel
                    fileName="reporteFlujoCaja"
                    sheet="reporte"
                    columns={columnsExportExcel}
                    content={dataReportToTable}
                />
                <div className="col-12">
                    { elementPdf ? <PDFViewer
                        className="col-12"
                        style={{height: "800px"}}
                        children={<ReporteFlujoCajaPDFComponent general={elementPdf} movsFlujoCaja={movsFlujoCaja} movsPxC={movsPxC}
                                    totalesPxC={totalesPxC} totalesFC={totalesFC}/>}
                    /> : <div className="text-center">
                        <h2>No se a realizado una búsqueda</h2>
                    </div> }
                </div>
            </ReportContainer>
            {isLoading === true && <Loading/>}
        </>
    )
}

export default ReporteFlujoCaja