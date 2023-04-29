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
import { listAllUbicaciones, deleteUbicacion } from '../../Api/Api'
import moment from 'moment'

const DropdownButton = ({keyCodes, showDeleteModal, viewPermission=false, updatePermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${keyCodes.c_compania}${keyCodes.c_agencia}${keyCodes.c_ubicacion}`}>
          { viewPermission && <Menu.Item key={`View${keyCodes.c_compania}${keyCodes.c_agencia}${keyCodes.c_ubicacion}`} className="btn btn-info">
            <Link to={`/visualizarUbicacion/${keyCodes.c_compania}-${keyCodes.c_agencia}-${keyCodes.c_ubicacion}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          { updatePermission && <Menu.Item key={`Edit${keyCodes.c_compania}${keyCodes.c_agencia}${keyCodes.c_ubicacion}`} className="btn btn-warning">
            <Link to={`/editarUbicacion/${keyCodes.c_compania}-${keyCodes.c_agencia}-${keyCodes.c_ubicacion}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          { deletePermission && <Menu.Item key={`Delete${keyCodes.c_compania}${keyCodes.c_agencia}${keyCodes.c_ubicacion}`} className="btn btn-danger" onClick={showDeleteModal}>
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

const Ubicaciones = () => {
    //Estados
    const [ubicacionesTable, setUbicacionesTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [keyElement, setKeyElement] = useState(null);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR UBICACIÓN AGENCIA" || item === "AGREGAR UBICACIÓN AGENCIA" || item === "VISUALIZAR UBICACIÓN AGENCIA" || item === "ELIMINAR UBICACIÓN AGENCIA"
    })
    const registerPermission = userPermisssions.includes("AGREGAR UBICACIÓN AGENCIA");
    const updatePermission = userPermisssions.includes("ACTUALIZAR UBICACIÓN AGENCIA");
    const viewPermission = userPermisssions.includes("VISUALIZAR UBICACIÓN AGENCIA");
    const deletePermission = userPermisssions.includes("ELIMINAR UBICACIÓN AGENCIA");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'compania_desc', label: 'Compañía', sortVar:1 },
        {name:'agencia_desc', label: 'Agencia', sortVar:1 },
        {name:'c_ubicacion', label: 'Ubicación', sortVar:1 },
        {name:'c_descripcion', label: 'Descripción', sortVar:1 },
        {name:'c_estado', label: 'Estado', sortVar:0 },
        {name:'c_usuarioregistro', label: 'Usuario registro', sortVar:1, audit:true },
        {name:'d_fecharegistro', label: 'Fecha registro', sortVar:0, audit:true },
        {name:'c_ultimousuario', label: 'Usuario actualización', sortVar:1, audit:true },
        {name:'d_ultimafechamodificacion', label: 'Fecha actualización', sortVar:0, audit:true },
    ];

    //campos de filtro
    const fieldsFilter= [
        { name: 'compania_desc' },
        { name: 'agencia_desc' },
        { name: 'c_ubicacion' },
        { name: 'c_descripcion' },
        { name: 'c_estado' }
    ];

    //consumo de api
    useEffect(async () => {
        await refreshFunction();
    }, [])

    const refreshFunction = async () => {
        await setIsLoading(true);
        await getUbicaciones();
        setIsLoading(false);
    }

    //Funcion para obtener ubicaciones
    const getUbicaciones = async () => {
        const response = await listAllUbicaciones();
        if(response && response.status === 200 && response.body.data) getUbicacionesTable(response.body.data);
    }

    const showDeleteModal = (keyCodes) => {
        setKeyElement(keyCodes);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        const response = await deleteUbicacion(keyElement);
        if(response && response.status === 200) {
            await getUbicaciones();
            setResponseData( {title: "Operación exitosa", message: "Se eliminó con éxito la ubicación." });
        } else {
            setResponseData( {title: "Error al eliminar", message: response.message });
        }
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    //Obtener ubicaciones para la tabla
    const getUbicacionesTable = (ubicaciones) => {
        const listUbicacionesTable = ubicaciones.map((item) => {
            let aux = {};
            aux.compania_desc = item.compania_desc;
            aux.agencia_desc = item.agencia_desc;
            aux.c_ubicacion = item.c_ubicacion;
            aux.c_descripcion = item.c_descripcion;
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.c_usuarioregistro = item.c_usuarioregistro || "";
            aux.d_fecharegistro = item.d_fecharegistro ? moment(item.d_fecharegistro).format("DD/MM/yyyy HH:mm:ss") : "";
            aux.c_ultimousuario = item.c_ultimousuario || "";
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy HH:mm:ss") : "";
            const keyCodes = { c_agencia: item.c_agencia, c_compania: item.c_compania, c_ubicacion: item.c_ubicacion }
            aux.actions = (<DropdownButton keyCodes={keyCodes} showDeleteModal={()=>showDeleteModal(keyCodes)}
                viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setUbicacionesTable(listUbicacionesTable);
    }

    return (
        <>
            <ListContainer
                columns={columns} dataTable={ubicacionesTable} fieldsFilter={fieldsFilter} buttonLink='/nuevaUbicacion'
                textButton='Agregar Ubicación' registerPermission={registerPermission} refreshFunction={refreshFunction}
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

export default Ubicaciones