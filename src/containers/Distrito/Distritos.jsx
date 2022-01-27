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
import { listAllDistritos, deleteDistrito } from '../../Api/Api'
import moment from 'moment'

const DropdownButton = ({keyCodes, showDeleteModal, viewPermission=false, updatePermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${keyCodes.c_paiscodigo}${keyCodes.c_departamentocodigo}${keyCodes.c_provinciacodigo}${keyCodes.c_distritocodigo}`}>
          {viewPermission && <Menu.Item key={`View${keyCodes.c_paiscodigo}${keyCodes.c_departamentocodigo}${keyCodes.c_provinciacodigo}${keyCodes.c_distritocodigo}`} className="btn btn-info">
            <Link to={`/visualizarDistrito/${keyCodes.c_paiscodigo}-${keyCodes.c_departamentocodigo}-${keyCodes.c_provinciacodigo}-${keyCodes.c_distritocodigo}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {updatePermission && <Menu.Item key={`Edit${keyCodes.c_paiscodigo}${keyCodes.c_departamentocodigo}${keyCodes.c_provinciacodigo}${keyCodes.c_distritocodigo}`} className="btn btn-warning">
            <Link to={`/editarDistrito/${keyCodes.c_paiscodigo}-${keyCodes.c_departamentocodigo}-${keyCodes.c_provinciacodigo}-${keyCodes.c_distritocodigo}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {deletePermission && <Menu.Item key={`Delete${keyCodes.c_paiscodigo}${keyCodes.c_departamentocodigo}${keyCodes.c_provinciacodigo}${keyCodes.c_distritocodigo}`} className="btn btn-danger" onClick={showDeleteModal}>
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

const Distritos = () => {
    //Estados
    const [distritosTable, setDistritosTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [idElement, setIdElement] = useState(null);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR DISTRITO" || item === "AGREGAR DISTRITO" || item === "VISUALIZAR DISTRITO" || item === "ELIMINAR DISTRITO"
    })
    const registerPermission = userPermisssions.includes("AGREGAR DISTRITO");
    const updatePermission = userPermisssions.includes("ACTUALIZAR DISTRITO");
    const viewPermission = userPermisssions.includes("VISUALIZAR DISTRITO");
    const deletePermission = userPermisssions.includes("ELIMINAR DISTRITO");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'c_paiscodigo', label: 'País', sortVar:1 },
        {name:'c_departamentocodigo', label: 'Departamento', sortVar:1 },
        {name:'c_provinciacodigo', label: 'Provincia', sortVar:1 },
        {name:'c_distritocodigo', label: 'Distrito', sortVar:1 },
        {name:'c_descripcion', label: 'Descripción', sortVar:1 },
        {name:'c_estado', label: 'Estado', sortVar:0 },
        {name:'c_usuarioregistro', label: 'Usuario registro', sortVar:0 },
        {name:'d_fecharegistro', label: 'Fecha registro', sortVar:0 },
        {name:'c_ultimousuario', label: 'Usuario actualización', sortVar:0 },
        {name:'d_ultimafechamodificacion', label: 'Fecha actualización', sortVar:0 },
    ];

    //campos de filtro
    const fieldsFilter= [
        { name: 'c_distritocodigo' },
        { name: 'c_provinciacodigo' },
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
        await getDistritos();
        setIsLoading(false);
    }

    //Funcion para obtener distritos
    const getDistritos = async () => {
        const response = await listAllDistritos();
        if(response && response.status === 200 && response.body.data) getDistritosTable(response.body.data);
    }

    const showDeleteModal = (keyCodes) => {
        setIdElement(keyCodes);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        const response = await deleteDistrito(idElement)
        if(response && response.status === 200) {
            await getDistritos();
            setResponseData( {title: "Operación exitosa", message: "Se eliminó con éxito el departamento." });
        } else {
            setResponseData( {title: "Error al eliminar", message: response.message });
        }
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    //Obtener distritos para la tabla
    const getDistritosTable = (distritos) => {
        const listDistritosTable = distritos.map((item) => {
            let aux = {};
            aux.c_paiscodigo = item.c_paiscodigo;
            aux.c_departamentocodigo = item.c_departamentocodigo;
            aux.c_provinciacodigo = item.c_provinciacodigo;
            aux.c_distritocodigo = item.c_distritocodigo;
            aux.c_descripcion = item.c_descripcion;
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.c_usuarioregistro = item.c_usuarioregistro || "";
            aux.d_fecharegistro = item.d_fecharegistro ? moment(item.d_fecharegistro).format("DD/MM/yyyy HH:mm:ss") : "";
            aux.c_ultimousuario = item.c_ultimousuario || "";
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy HH:mm:ss") : "";
            const keyCodes = {
                c_departamentocodigo: item.c_departamentocodigo,
                c_paiscodigo: item.c_paiscodigo,
                c_provinciacodigo: item.c_provinciacodigo,
                c_distritocodigo: item.c_distritocodigo
            }
            aux.actions = (<DropdownButton keyCodes={keyCodes} showDeleteModal={()=>showDeleteModal(keyCodes)}
                viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setDistritosTable(listDistritosTable);
    }

    return (
        <>
            <ListContainer
                columns={columns} dataTable={distritosTable} fieldsFilter={fieldsFilter} buttonLink='/nuevoDistrito'
                textButton='Agregar Distrito' registerPermission={registerPermission} refreshFunction={refreshFunction}
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

export default Distritos