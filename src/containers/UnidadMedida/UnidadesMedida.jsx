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
import { listAllUnidadesMedida, deleteUnidadMedida } from '../../Api/Api'
import moment from 'moment'

const DropdownButton = ({c_unidadmedida, showDeleteModal, viewPermission=false, updatePermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${c_unidadmedida}`}>
          {viewPermission && <Menu.Item key={`View${c_unidadmedida}`} className="btn btn-info">
            <Link to={`/visualizarUnidadMedida/${c_unidadmedida}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {updatePermission && <Menu.Item key={`Edit${c_unidadmedida}`} className="btn btn-warning">
            <Link to={`/editarUnidadMedida/${c_unidadmedida}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {deletePermission && <Menu.Item key={`Delete${c_unidadmedida}`} className="btn btn-danger" onClick={showDeleteModal}>
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

const UnidadesMedida = () => {
    //Estados
    const [unidadesMedidaTable, setUnidadesMedidaTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [idElement, setIdElement] = useState(null);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR UNIDAD DE MEDIDA" || item === "AGREGAR UNIDAD DE MEDIDA" || item === "VISUALIZAR UNIDAD DE MEDIDA" || item === "ELIMINAR UNIDAD DE MEDIDA"
    })
    const registerPermission = userPermisssions.includes("AGREGAR UNIDAD DE MEDIDA");
    const updatePermission = userPermisssions.includes("ACTUALIZAR UNIDAD DE MEDIDA");
    const viewPermission = userPermisssions.includes("VISUALIZAR UNIDAD DE MEDIDA");
    const deletePermission = userPermisssions.includes("ELIMINAR UNIDAD DE MEDIDA");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'c_unidadmedida', label: 'Unidad de medida', sortVar:1 },
        {name:'c_descripcion', label: 'Descripción', sortVar:1 },
        {name:'c_estado', label: 'Estado', sortVar:0 },
        {name:'c_usuarioregistro', label: 'Usuario registro', sortVar:0 },
        {name:'d_fecharegistro', label: 'Fecha registro', sortVar:0 },
        {name:'c_ultimousuario', label: 'Usuario actualización', sortVar:0 },
        {name:'d_ultimafechamodificacion', label: 'Fecha actualización', sortVar:0 },
    ];

    //campos de filtro
    const fieldsFilter= [
        {name:'c_unidadmedida'},
        {name:'c_descripcion'},
        {name:'c_estado'}
    ];

    //consumo de api
    useEffect(async () => {
        await refreshFunction();
    }, [])

    const refreshFunction = async () => {
        await setIsLoading(true);
        await getUnidadesMedida();
        setIsLoading(false);
    }

    //Funcion para obtener unidadesMedida
    const getUnidadesMedida = async () => {
        const response = await listAllUnidadesMedida();
        if(response && response.status === 200 && response.body.data) getUnidadesMedidaTable(response.body.data);
    }

    const showDeleteModal = (c_unidadmedida) => {
        setIdElement(c_unidadmedida);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        const response = await deleteUnidadMedida(idElement);
        if(response && response.status === 200) {
            await getUnidadesMedida();
            setResponseData( {title: "Operación exitosa", message: "Se eliminó con éxito la unidad de medida." });
        } else {
            setResponseData( {title: "Error al eliminar", message: response.message });
        }
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    //Obtener unidadesMedida para la tabla
    const getUnidadesMedidaTable = (unidadesMedida) => {
        const listUnidadesMedidaTable = unidadesMedida.map((item) => {
            let aux = {};
            aux.c_unidadmedida = item.c_unidadmedida;
            aux.c_descripcion = item.c_descripcion;
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.c_usuarioregistro = item.c_usuarioregistro || "";
            aux.d_fecharegistro = item.d_fecharegistro ? moment(item.d_fecharegistro).format("DD/MM/yyyy HH:MM:ss") : "";
            aux.c_ultimousuario = item.c_ultimousuario || "";
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy HH:MM:ss") : "";
            aux.actions = (<DropdownButton c_unidadmedida={item.c_unidadmedida} showDeleteModal={()=>showDeleteModal(item.c_unidadmedida)}
                viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setUnidadesMedidaTable(listUnidadesMedidaTable);
    }

    return (
        <>
            <ListContainer
                columns={columns} dataTable={unidadesMedidaTable} fieldsFilter={fieldsFilter} buttonLink='/nuevaUnidadMedida'
                textButton='Agregar Unidade de medida' registerPermission={registerPermission} refreshFunction={refreshFunction}
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

export default UnidadesMedida