import React, { useContext, useEffect, useState } from 'react'
import { Menu, Dropdown, Button, Space } from 'antd'
//Componentes
import ListContainer from '../../components/ListContainer/ListContainer'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import PagesContext from '../../context/PagesContext/PagesContext'
//Utilities
import { Link } from 'react-router-dom'
import { listAllPeriodos, deletePeriodos } from '../../Api/Api'

const DropdownButton = ({keyCodes, showDeleteModal, viewPermission=false, updatePermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${keyCodes.c_compania}${keyCodes.c_tipoperiodo}`}>
          { viewPermission && <Menu.Item key={`View${keyCodes.c_compania}${keyCodes.c_tipoperiodo}`} className="btn btn-info">
            <Link to={`/visualizarPeriodo/${keyCodes.c_compania}-${keyCodes.c_tipoperiodo}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          { updatePermission && <Menu.Item key={`Edit${keyCodes.c_compania}${keyCodes.c_tipoperiodo}`} className="btn btn-warning">
            <Link to={`/editarPeriodo/${keyCodes.c_compania}-${keyCodes.c_tipoperiodo}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          { deletePermission && <Menu.Item key={`Delete${keyCodes.c_compania}${keyCodes.c_tipoperiodo}`} className="btn btn-danger" onClick={showDeleteModal}>
            <Space direction="horizontal">
                <Space wrap><i className="bi bi-trash"></i></Space>
                <Space wrap>Eliminar</Space>
            </Space>
          </Menu.Item>}
        </Menu>
    );
    return (
        <Dropdown overlay={menu} placement="bottomCenter">
            <Button>
                <Space direction="horizontal">
                    <Space wrap>Acciones</Space>
                    <Space wrap><i className="bi bi-caret-down-fill"></i></Space>
                </Space>
            </Button>
        </Dropdown>
    )
}

const Periodos = () => {
    //Estados
    const [periodosTable, setPeriodosTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [keyElement, setKeyElement] = useState(null);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR AGENCIA" || item === "AGREGAR AGENCIA" || item === "VISUALIZAR AGENCIA" || item === "ELIMINAR AGENCIA"
    })
    const registerPermission = userPermisssions.includes("AGREGAR AGENCIA");
    const updatePermission = userPermisssions.includes("ACTUALIZAR AGENCIA");
    const viewPermission = userPermisssions.includes("VISUALIZAR AGENCIA");
    const deletePermission = userPermisssions.includes("ELIMINAR AGENCIA");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'c_compania', label: 'Compañía', sortVar:1 },
        {name:'c_tipoperiodo', label: 'Tipo', sortVar:1 },
        {name:'c_periodo', label: 'Periodo', sortVar:1 },
        {name:'c_estado', label: 'Estado', sortVar:1 },
        {name:'c_usuariocierre', label: 'Usuario cierre', sortVar:1 },
        {name:'d_fechacierre', label: 'Fecha cierre', sortVar:1 },
        {name:'c_usuarioregistro', label: 'Usuario registro', sortVar:0 },
        {name:'d_fecharegistro', label: 'Fecha registro', sortVar:0 },
        {name:'c_ultimousuario', label: 'Usuario actualización', sortVar:0 },
        {name:'d_ultimafechamodificacion', label: 'Fecha actualización', sortVar:0 },
    ];

    //campos de filtro
    const fieldsFilter= [
        { name: 'c_compania' },
        { name: 'c_tipoperiodo' },
        { name: 'c_periodo' },
        { name: 'c_estado' },
        { name: 'c_usuariocierre' },
        { name: 'd_fechacierre' }
    ];

    //consumo de api
    useEffect(async () => {
        await refreshFunction();
    }, [])

    const refreshFunction = async () => {
        await setIsLoading(true);
        await getPeriodos();
        setIsLoading(false);
    }

    //Funcion para obtener periodos
    const getPeriodos = async () => {
        const response = await listAllPeriodos();
        if(response && response.status === 200 && response.body.data.length != 0) getPeriodosTable(response.body.data);
    }

    const showDeleteModal = (keyCodes) => {
        setKeyElement(keyCodes);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        const response = await deletePeriodos(keyElement);
        if(response && response.status === 200) {
            await getPeriodos();
            setResponseData( {title: "Operación exitosa", message: "Se eliminó con éxito el periodo." });
        } else {
            setResponseData( {title: "Error al eliminar", message: response.message });
        }
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    //Obtener periodos para la tabla
    const getPeriodosTable = (periodos) => {
        const listPeriodosTable = periodos.map((item) => {
            let aux = {};
            aux.c_compania = item.c_compania;
            aux.c_tipoperiodo = item.c_tipoperiodo;
            aux.c_periodo = item.c_periodo;
            aux.c_descripcion = item.c_descripcion;
            aux.c_estado = item.c_estado === "A" ? "ABIERTO" : "CERRADO";
            aux.c_usuariocierre = item.c_usuariocierre || "";
            aux.d_fechacierre = item.d_fechacierre ? (new Date(item.d_fechacierre)).toLocaleString("en-US") : "";
            aux.c_usuarioregistro = item.c_usuarioregistro || "";
            aux.d_fecharegistro = item.d_fecharegistro ? (new Date(item.d_fecharegistro)).toLocaleString("en-US") : "";
            aux.c_ultimousuario = item.c_ultimousuario || "";
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? (new Date(item.d_ultimafechamodificacion)).toLocaleString("en-US") : "";
            const keyCodes = { c_tipoperiodo: item.c_tipoperiodo, c_compania: item.c_compania }
            aux.actions = (<DropdownButton keyCodes={keyCodes} showDeleteModal={()=>showDeleteModal(keyCodes)}
                viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setPeriodosTable(listPeriodosTable);
    }

    return (
        <>
            <ListContainer
                columns={columns} dataTable={periodosTable} fieldsFilter={fieldsFilter} buttonLink='/nuevoPeriodo'
                textButton='Agregar Período' registerPermission={registerPermission} refreshFunction={refreshFunction}
            />
            {isLoading === true && <Loading/>}
            <ConfirmationModal
                isOpen={open}
                onClose={()=>setOpen(false)}
                title={"Aviso de eliminación"}
                message={"¿Seguro que desea eliminar este elemento?. Una vez eliminado no podrás recuperarlo."}
                onHandleFunction={()=>handleDelete()}
                buttonClass="btn-danger"
            />
            <ResponseModal
                isOpen={openResponseModal}
                title={responseData.title}
                onClose={()=>setOpenResponseModal(false)}
                message={responseData.message}
            />
        </>
    )
}

export default Periodos