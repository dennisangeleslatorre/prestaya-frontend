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
import { listAllDepartamentos, deleteDepartamento } from '../../Api/Api'

const DropdownButton = ({keyCodes, showDeleteModal, viewPermission=false, updatePermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${keyCodes.c_paiscodigo}${keyCodes.c_departamentocodigo}`}>
          {viewPermission && <Menu.Item key={`View${keyCodes.c_paiscodigo}${keyCodes.c_departamentocodigo}`} className="btn btn-info">
            <Link to={`/visualizarDepartamento/${keyCodes.c_paiscodigo}-${keyCodes.c_departamentocodigo}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {updatePermission && <Menu.Item key={`Edit${keyCodes.c_paiscodigo}${keyCodes.c_departamentocodigo}`} className="btn btn-warning">
            <Link to={`/editarDepartamento/${keyCodes.c_paiscodigo}-${keyCodes.c_departamentocodigo}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {deletePermission && <Menu.Item key={`Delete${keyCodes.c_paiscodigo}${keyCodes.c_departamentocodigo}`} className="btn btn-danger" onClick={showDeleteModal}>
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

const Departamentos = () => {
    //Estados
    const [departamentosTable, setDepartamentosTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [keyElement, setKeyElement] = useState(null);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR DEPARTAMENTO" || item === "AGREGAR DEPARTAMENTO" || item === "VISUALIZAR DEPARTAMENTO" || item === "ELIMINAR DEPARTAMENTO"
    })
    const registerPermission = userPermisssions.includes("AGREGAR DEPARTAMENTO");
    const updatePermission = userPermisssions.includes("ACTUALIZAR DEPARTAMENTO");
    const viewPermission = userPermisssions.includes("VISUALIZAR DEPARTAMENTO");
    const deletePermission = userPermisssions.includes("ELIMINAR DEPARTAMENTO");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'c_paiscodigo', label: 'País', sortVar:1 },
        {name:'c_departamentocodigo', label: 'Departamento', sortVar:1 },
        {name:'c_descripcion', label: 'Descripción', sortVar:1 },
        {name:'c_estado', label: 'Estado', sortVar:0 },
        {name:'c_usuarioregistro', label: 'Usuario registro', sortVar:0 },
        {name:'d_fecharegistro', label: 'Fecha registro', sortVar:0 },
        {name:'c_ultimousuario', label: 'Usuario actualización', sortVar:0 },
        {name:'d_ultimafechamodificacion', label: 'Fecha actualización', sortVar:0 },
    ];

    //campos de filtro
    const fieldsFilter= [
        { name: 'c_departamentocodigo' },
        { name: 'c_paiscodigo' },
        { name: 'c_descripcion' },
        { name: 'c_estado' }
    ];

    //consumo de api
    useEffect(async () => {
        await refreshFunction();
    }, [])

    const refreshFunction = async () => {
        await setIsLoading(true);
        await getDepartamentos();
        setIsLoading(false);
    }

    //Funcion para obtener departamentos
    const getDepartamentos = async () => {
        const response = await listAllDepartamentos();
        if(response && response.status === 200 && response.body.data) getDepartamentosTable(response.body.data);
    }

    const showDeleteModal = (keyCodes) => {
        setKeyElement(keyCodes);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        const response = await deleteDepartamento(keyElement)
        if(response && response.status === 200) {
            await getDepartamentos();
            setResponseData( {title: "Operación exitosa", message: "Se eliminó con éxito el departamento." });
        } else {
            setResponseData( {title: "Error al eliminar", message: response.message });
        }
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    //Obtener departamentos para la tabla
    const getDepartamentosTable = (departamentos) => {
        const listDepartamentosTable = departamentos.map((item) => {
            let aux = {};
            aux.c_paiscodigo = item.c_paiscodigo;
            aux.c_departamentocodigo = item.c_departamentocodigo;
            aux.c_descripcion = item.c_descripcion;
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.c_usuarioregistro = item.c_usuarioregistro || "";
            aux.d_fecharegistro = item.d_fecharegistro ? (new Date(item.d_fecharegistro)).toLocaleString("en-US") : "";
            aux.c_ultimousuario = item.c_ultimousuario || "";
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? (new Date(item.d_ultimafechamodificacion)).toLocaleString("en-US") : "";
            const keyCodes = { c_departamentocodigo: item.c_departamentocodigo, c_paiscodigo: item.c_paiscodigo }
            aux.actions = (<DropdownButton keyCodes={keyCodes} showDeleteModal={()=>showDeleteModal(keyCodes)}
                viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setDepartamentosTable(listDepartamentosTable);
    }

    return (
        <>
            <ListContainer
                columns={columns} dataTable={departamentosTable} fieldsFilter={fieldsFilter} buttonLink='/nuevoDepartamento'
                textButton='Agregar Departamento' registerPermission={registerPermission} refreshFunction={refreshFunction}
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

export default Departamentos