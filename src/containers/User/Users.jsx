import React, { useContext, useEffect, useState } from 'react'
import { Menu, Dropdown, Button, Space } from 'antd'
//Componentes
import ListContainer from '../../components/ListContainer/ListContainer'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import PagesContext from '../../context/PagesContext/PagesContext'
//Utilities
import { Link } from 'react-router-dom'
import { listUsers, deleteUser } from '../../Api/Api'


const DropdownButton = ({c_codigousuario, showDeleteModal, updatePermission=false, viewPermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${c_codigousuario}`}>
          {viewPermission && <Menu.Item key={`View${c_codigousuario}`} className="btn btn-info">
            <Link to={`/visualizarUsuario/${c_codigousuario}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {updatePermission && <Menu.Item key={`Edit${c_codigousuario}`} className="btn btn-warning">
            <Link to={`/editarUsuario/${c_codigousuario}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          { deletePermission && <Menu.Item key={`Delete${c_codigousuario}`} className="btn btn-danger" onClick={showDeleteModal}>
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

const UserList = () => {
    //Estados
    const [usuariosTable, setUsersTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [idElement, setIdElement] = useState(null);
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR USUARIO" || item === "AGREGAR USUARIO" || item === "VISUALIZAR USUARIO" || item === "ELIMINAR USUARIO"
    })
    const registerPermission = userPermisssions.includes("AGREGAR USUARIO");
    const updatePermission = userPermisssions.includes("ACTUALIZAR USUARIO");
    const viewPermission = userPermisssions.includes("VISUALIZAR USUARIO");
    const deletePermission = userPermisssions.includes("ELIMINAR USUARIO");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'c_codigousuario', label: 'Usuario', sortVar:1 },
        {name:'c_nombres', label: 'Nombre', sortVar:1 },
        {name:'c_correo', label: 'Correo', sortVar:1 },
        {name:'c_telefono', label: 'Teléfono', sortVar:1 },
        {name:'n_perfil', label: 'N° de perfil', sortVar:1 },
        {name:'c_estado', label: 'Estado', sortVar:0}
    ];

    //campos de filtro
    const fieldsFilter= [
        {name:'c_codigousuario'},
        {name:'c_nombres'},
        {name:'c_correo'},
        {name:'c_telefono'},
        {name:'n_perfil'},
        {name:'c_estado'}
    ];

    //consumo de api
    useEffect(async () => {
        await setIsLoading(true);
        await getUsers();
        setIsLoading(false);
    }, [])

    //Funcion para obtener usuarios
    const getUsers = async () => {
        const response = await listUsers();
        if(response && response.status === 200 && response.body.success && response.body.data.length != 0) getUsersTable(response.body.data);
    }

    const showDeleteModal = (c_codigousuario) => {
        setIdElement(c_codigousuario);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        console.log("Eliminar", idElement);
        //const response = await deleteUser(idElement)
        await getUsers();
        setIsLoading(false);
    }

    //Obtener usuarios para la tabla
    const getUsersTable = (usuarios) => {
        const listUsersTable = usuarios.map((item) => {
            let aux = {};
            aux.c_codigousuario = item.c_codigousuario
            aux.c_nombres = item.c_nombres
            aux.c_correo = item.c_correo
            aux.c_telefono = item.c_telefono
            aux.n_perfil = item.n_perfil
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.actions = (<DropdownButton c_codigousuario={item.c_codigousuario} showDeleteModal={()=>showDeleteModal(item.c_codigousuario)}
                viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setUsersTable(listUsersTable);
    }
    return (
        <>
            <ListContainer
                columns={columns} dataTable={usuariosTable} fieldsFilter={fieldsFilter} buttonLink='/nuevoUsuario'
                textButton='Agregar Usuario' registerPermission={registerPermission}
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
        </>
    )
}

export default UserList