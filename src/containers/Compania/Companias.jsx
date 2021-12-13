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
import { listAllCompanias } from '../../Api/Api'

const DropdownButton = ({c_compania, showDeleteModal, viewPermission=false, updatePermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${c_compania}`}>
          {viewPermission && <Menu.Item key={`View${c_compania}`} className="btn btn-info">
            <Link to={`/visualizarCompania/${c_compania}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {updatePermission && <Menu.Item key={`Edit${c_compania}`} className="btn btn-warning">
            <Link to={`/editarCompania/${c_compania}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {deletePermission && <Menu.Item key={`Delete${c_compania}`} className="btn btn-danger" onClick={showDeleteModal}>
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

const Companias = () => {
    //Estados
    const [companiasTable, setCompaniasTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [idElement, setIdElement] = useState(null);
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR COMPAÑÍA" || item === "AGREGAR COMPAÑÍA" || item === "VISUALIZAR COMPAÑÍA" || item === "ELIMINAR COMPAÑÍA"
    })
    const registerPermission = userPermisssions.includes("AGREGAR COMPAÑÍA");
    const updatePermission = userPermisssions.includes("ACTUALIZAR COMPAÑÍA");
    const viewPermission = userPermisssions.includes("VISUALIZAR COMPAÑÍA");
    const deletePermission = userPermisssions.includes("ELIMINAR COMPAÑÍA");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'c_compania', label: 'Compañía', sortVar:0 },
        {name:'c_descripcion', label: 'Descripción', sortVar:0 },
        {name:'c_ruc', label: 'RUC', sortVar:0 },
        {name:'c_direccion', label: 'Dirección', sortVar:0 },
        {name:'c_paiscodigo', label: 'País', sortVar:0 },
        {name:'c_departamentocodigo', label: 'Departamento', sortVar:0 },
        {name:'c_provinciacodigo', label: 'Provincia', sortVar:0 },
        {name:'c_distritocodigo', label: 'Distrito', sortVar:0 },
        {name:'c_estado', label: 'Estado', sortVar:0 },
        {name:'c_usuarioregistro', label: 'Usuario registro', sortVar:0 },
        {name:'d_fecharegistro', label: 'Fecha registro', sortVar:0 },
        {name:'c_ultimousuario', label: 'Usuario actualización', sortVar:0 },
        {name:'d_ultimafechamodificacion', label: 'Fecha actualización', sortVar:0 },
    ];

    //campos de filtro
    const fieldsFilter= [
        { name: 'c_compania' },
        { name: 'c_descripcion' },
        { name: 'c_ruc' },
        { name: 'c_direccion' },
        { name: 'c_paiscodigo' },
        { name: 'c_departamentocodigo' },
        { name: 'c_provinciacodigo' },
        { name: 'c_distritocodigo' },
        { name: 'c_estado' }
    ];

    //consumo de api
    useEffect(async () => {
        await setIsLoading(true);
        await getCompanias();
        setIsLoading(false);
    }, [])

    //Funcion para obtener companias
    const getCompanias = async () => {
        const response = await listAllCompanias();
        if(response && response.status === 200 && response.body.data.length != 0) getCompaniasTable(response.body.data);
    }

    const showDeleteModal = (c_compania) => {
        setIdElement(c_compania);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        console.log("Eliminar", idElement);
        //const response = await deletePais(idElement)
        await getCompanias();
        setIsLoading(false);
    }

    //Obtener companias para la tabla
    const getCompaniasTable = (companias) => {
        const listCompaniasTable = companias.map((item) => {
            let aux = {};
            aux.c_compania = item.c_compania;
            aux.c_descripcion = item.c_descripcion;
            aux.c_ruc = item.c_ruc;
            aux.c_direccion = item.c_direccion;
            aux.c_paiscodigo = item.c_paiscodigo;
            aux.c_departamentocodigo = item.c_departamentocodigo;
            aux.c_provinciacodigo = item.c_provinciacodigo;
            aux.c_distritocodigo = item.c_distritocodigo;
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.c_usuarioregistro = item.c_usuarioregistro || "";
            aux.d_fecharegistro = item.d_fecharegistro || "";
            aux.c_ultimousuario = item.c_ultimousuario || "";
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion || "";
            aux.actions = (<DropdownButton c_compania={item.c_compania} showDeleteModal={()=>showDeleteModal(item.c_compania)}
                viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setCompaniasTable(listCompaniasTable);
    }

    return (
        <>
            <ListContainer
                columns={columns} dataTable={companiasTable} fieldsFilter={fieldsFilter} buttonLink='/nuevaCompania'
                textButton='Agregar Compañía' registerPermission={registerPermission}
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

export default Companias