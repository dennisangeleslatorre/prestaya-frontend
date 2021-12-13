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
import { listAllTiposProducto } from '../../Api/Api'

const DropdownButton = ({c_tipoproducto, showDeleteModal, viewPermission=false, updatePermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${c_tipoproducto}`}>
          {viewPermission && <Menu.Item key={`View${c_tipoproducto}`} className="btn btn-info">
            <Link to={`/visualizarTipoProduto/${c_tipoproducto}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {updatePermission && <Menu.Item key={`Edit${c_tipoproducto}`} className="btn btn-warning">
            <Link to={`/editarTipoProduto/${c_tipoproducto}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {deletePermission && <Menu.Item key={`Delete${c_tipoproducto}`} className="btn btn-danger" onClick={showDeleteModal}>
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

const TiposProducto = () => {
    //Estados
    const [tiposProductoTable, setTiposProductoTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [idElement, setIdElement] = useState(null);
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR TIPO DE PRODUCTO" || item === "AGREGAR TIPO DE PRODUCTO" || item === "VISUALIZAR TIPO DE PRODUCTO" || item === "ELIMINAR TIPO DE PRODUCTO"
    })
    const registerPermission = userPermisssions.includes("AGREGAR TIPO DE PRODUCTO");
    const updatePermission = userPermisssions.includes("ACTUALIZAR TIPO DE PRODUCTO");
    const viewPermission = userPermisssions.includes("VISUALIZAR TIPO DE PRODUCTO");
    const deletePermission = userPermisssions.includes("ELIMINAR TIPO DE PRODUCTO");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'c_tipoproducto', label: 'Tipo de producto', sortVar:1 },
        {name:'c_descripcion', label: 'Descripción', sortVar:1 },
        {name:'c_estado', label: 'Estado', sortVar:0 },
        {name:'c_usuarioregistro', label: 'Usuario registro', sortVar:0 },
        {name:'d_fecharegistro', label: 'Fecha registro', sortVar:0 },
        {name:'c_ultimousuario', label: 'Usuario actualización', sortVar:0 },
        {name:'d_ultimafechamodificacion', label: 'Fecha actualización', sortVar:0 },
    ];

    //campos de filtro
    const fieldsFilter= [
        {name:'c_tipoproducto'},
        {name:'c_descripcion'},
        {name:'c_estado'}
    ];

    //consumo de api
    useEffect(async () => {
        await setIsLoading(true);
        await getTiposProductos();
        setIsLoading(false);
    }, [])

    //Funcion para obtener tiposProducto
    const getTiposProductos = async () => {
        const response = await listAllTiposProducto();
        if(response && response.status === 200 && response.body.data.length != 0) getTiposProductosTable(response.body.data);
    }

    const showDeleteModal = (c_tipoproducto) => {
        setIdElement(c_tipoproducto);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        console.log("Eliminar", idElement);
        //const response = await deleteTipoProducto(idElement)
        await getTiposProductos();
        setIsLoading(false);
    }

    //Obtener tiposProducto para la tabla
    const getTiposProductosTable = (tiposProducto) => {
        const listTiposProductoTable = tiposProducto.map((item) => {
            let aux = {};
            aux.c_tipoproducto = item.c_tipoproducto;
            aux.c_descripcion = item.c_descripcion;
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.actions = (<DropdownButton c_tipoproducto={item.c_tipoproducto} showDeleteModal={()=>showDeleteModal(item.c_tipoproducto)}/>);
            aux.c_usuarioregistro = item.c_usuarioregistro || "";
            aux.d_fecharegistro = item.d_fecharegistro || "";
            aux.c_ultimousuario = item.c_ultimousuario || "";
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion || "";
            aux.actions = (<DropdownButton c_tipoproducto={item.c_tipoproducto} showDeleteModal={()=>showDeleteModal(item.c_tipoproducto)}
                viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setTiposProductoTable(listTiposProductoTable);
    }

    return (
        <>
            <ListContainer
                columns={columns} dataTable={tiposProductoTable} fieldsFilter={fieldsFilter} buttonLink='/nuevoTipoProduto'
                textButton='Agregar Tipo de Producto' registerPermission={registerPermission}
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

export default TiposProducto