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
import { listAllPaises, deletePais } from '../../Api/Api'

const DropdownButton = ({c_paiscodigo, showDeleteModal, viewPermission=false, updatePermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${c_paiscodigo}`}>
          {viewPermission && <Menu.Item key={`View${c_paiscodigo}`} className="btn btn-info">
            <Link to={`/visualizarPais/${c_paiscodigo}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {updatePermission && <Menu.Item key={`Edit${c_paiscodigo}`} className="btn btn-warning">
            <Link to={`/editarPais/${c_paiscodigo}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {deletePermission && <Menu.Item key={`Delete${c_paiscodigo}`} className="btn btn-danger" onClick={showDeleteModal}>
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

const Paises = () => {
    //Estados
    const [paisesTable, setPaisesTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [idElement, setIdElement] = useState(null);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR PAÍS" || item === "AGREGAR PAÍS" || item === "VISUALIZAR PAÍS" || item === "ELIMINAR PAÍS"
    })
    const registerPermission = userPermisssions.includes("AGREGAR PAÍS");
    const updatePermission = userPermisssions.includes("ACTUALIZAR PAÍS");
    const viewPermission = userPermisssions.includes("VISUALIZAR PAÍS");
    const deletePermission = userPermisssions.includes("ELIMINAR PAÍS");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'c_paiscodigo', label: 'Código del país', sortVar:1 },
        {name:'c_descripcion', label: 'Descripción', sortVar:1 },
        {name:'c_estado', label: 'Estado', sortVar:0 },
        {name:'c_usuarioregistro', label: 'Usuario registro', sortVar:0 },
        {name:'d_fecharegistro', label: 'Fecha registro', sortVar:0 },
        {name:'c_ultimousuario', label: 'Usuario actualización', sortVar:0 },
        {name:'d_ultimafechamodificacion', label: 'Fecha actualización', sortVar:0 },
    ];

    //campos de filtro
    const fieldsFilter= [
        {name:'c_paiscodigo'},
        {name:'c_descripcion'},
        {name:'c_estado'}
    ];

    //consumo de api
    useEffect(async () => {
        await refreshFunction();
    }, [])

    const refreshFunction = async () => {
        await setIsLoading(true);
        await getPaises();
        setIsLoading(false);
    }

    //Funcion para obtener paises
    const getPaises = async () => {
        const response = await listAllPaises();
        if(response && response.status === 200 && response.body.data) getPaisesTable(response.body.data);
    }

    const showDeleteModal = (c_paiscodigo) => {
        setIdElement(c_paiscodigo);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        const response = await deletePais(idElement);
        if(response && response.status === 200) {
            await getPaises();
            setResponseData( {title: "Operación exitosa", message: "Se eliminó con éxito el país." });
        } else {
            setResponseData( {title: "Error al eliminar", message: response.message });
        }
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    //Obtener paises para la tabla
    const getPaisesTable = (paises) => {
        const listPaisesTable = paises.map((item) => {
            let aux = {};
            aux.c_paiscodigo = item.c_paiscodigo;
            aux.c_descripcion = item.c_descripcion;
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.c_usuarioregistro = item.c_usuarioregistro || "";
            aux.d_fecharegistro = item.d_fecharegistro ? (new Date(item.d_fecharegistro)).toLocaleString("en-US") : "";
            aux.c_ultimousuario = item.c_ultimousuario || "";
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? (new Date(item.d_ultimafechamodificacion)).toLocaleString("en-US") : "";
            aux.actions = (<DropdownButton c_paiscodigo={item.c_paiscodigo} showDeleteModal={()=>showDeleteModal(item.c_paiscodigo)}
                viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setPaisesTable(listPaisesTable);
    }

    return (
        <>
            <ListContainer
                columns={columns} dataTable={paisesTable} fieldsFilter={fieldsFilter} buttonLink='/nuevoPais'
                textButton='Agregar País' registerPermission={registerPermission} refreshFunction={refreshFunction}
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

export default Paises
