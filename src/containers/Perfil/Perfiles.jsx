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
import { listPerfiles, deletePerfil } from '../../Api/Api'


const DropdownButton = ({n_perfil, showDeleteModal, updatePermission=false, viewPermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${n_perfil}`}>
          { viewPermission && <Menu.Item key={`View${n_perfil}`} className="btn btn-info">
            <Link to={`/visualizarPerfil/${n_perfil}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {updatePermission && <Menu.Item key={`Edit${n_perfil}`} className="btn btn-warning">
            <Link to={`/editarPerfil/${n_perfil}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {deletePermission && <Menu.Item key={`Delete${n_perfil}`} className="btn btn-danger" onClick={showDeleteModal}>
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


const Perfiles = () => {
    //Estados
    const [perfilesTable, setPerfilesTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [idElement, setIdElement] = useState(null);
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const profilePermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR PERFIL" || item === "AGREGAR PERFIL" || item === "VISUALIZAR PERFIL" || item === "ELIMINAR PERFIL"
    })
    const registerPermission = profilePermisssions.includes("AGREGAR PERFIL");
    const updatePermission = profilePermisssions.includes("ACTUALIZAR PERFIL");
    const viewPermission = profilePermisssions.includes("VISUALIZAR PERFIL");
    const deletePermission = profilePermisssions.includes("ELIMINAR PERFIL");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'n_perfil', label: 'Paginas', sortVar:1 },
        {name:'c_codigoperfil', label: 'Perfil', sortVar:1 },
        {name:'c_paginas', label: 'Páginas', sortVar:0 },
        {name:'c_estado', label: 'Estado', sortVar:0}
    ];

    //campos de filtro
    const fieldsFilter= [
        {name:'n_perfil'},
        {name:'c_codigoperfil'},
        {name:'c_paginas'},
        {name:'c_estado'}
    ];

    //consumo de api
    useEffect(async () => {
        await setIsLoading(true);
        await getPerfiles();
        setIsLoading(false);
    }, [])

    //Funcion para obtener perfiles
    const getPerfiles = async () => {
        const response = await listPerfiles();
        if(response && response.status === 200 && response.body.success && response.body.data.length != 0) getPerfilesTable(response.body.data);
    }

    const showDeleteModal = (n_perfil) => {
        setIdElement(n_perfil);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        console.log("Eliminar", idElement);
        //const response = await deletePerfil(idElement)
        await getPerfiles();
        setIsLoading(false);
    }

    //Obtener perfiles para la tabla
    const getPerfilesTable = (perfiles) => {
        const listPerfilesTable = perfiles.map((item) => {
            let aux = {};
            aux.n_perfil = item.n_perfil;
            aux.c_codigoperfil = item.c_codigoperfil;
            aux.c_paginas = item.c_paginas;
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.actions = (<DropdownButton n_perfil={item.n_perfil} showDeleteModal={()=>showDeleteModal(item.n_perfil)}
                            viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setPerfilesTable(listPerfilesTable);
    }

    return (
        <>
            <ListContainer
                columns={columns} dataTable={perfilesTable} fieldsFilter={fieldsFilter} buttonLink='/nuevoPerfil'
                textButton='Agregar Perfil' registerPermission={registerPermission}
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

export default Perfiles