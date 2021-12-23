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
import { listAllTiposDocumento, deleteTipoDocumento } from '../../Api/Api'

const DropdownButton = ({c_tipodocumento, showDeleteModal, viewPermission=false, updatePermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${c_tipodocumento}`}>
          {viewPermission && <Menu.Item key={`View${c_tipodocumento}`} className="btn btn-info">
            <Link to={`/visualizarTipoDocumento/${c_tipodocumento}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {updatePermission && <Menu.Item key={`Edit${c_tipodocumento}`} className="btn btn-warning">
            <Link to={`/editarTipoDocumento/${c_tipodocumento}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {deletePermission && <Menu.Item key={`Delete${c_tipodocumento}`} className="btn btn-danger" onClick={showDeleteModal}>
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

const TiposDocumento = () => {
    //Estados
    const [tiposDocumentoTable, setTiposDocumentoTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [idElement, setIdElement] = useState(null);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR TIPO DE DOCUMENTO" || item === "AGREGAR TIPO DE DOCUMENTO" || item === "VISUALIZAR TIPO DE DOCUMENTO" || item === "ELIMINAR TIPO DE DOCUMENTO"
    })
    const registerPermission = userPermisssions.includes("AGREGAR TIPO DE DOCUMENTO");
    const updatePermission = userPermisssions.includes("ACTUALIZAR TIPO DE DOCUMENTO");
    const viewPermission = userPermisssions.includes("VISUALIZAR TIPO DE DOCUMENTO");
    const deletePermission = userPermisssions.includes("ELIMINAR TIPO DE DOCUMENTO");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'c_tipodocumento', label: 'Tipo de documento', sortVar:1 },
        {name:'c_descripcion', label: 'Descripción', sortVar:1 },
        {name:'n_numerodigitos', label: 'N° dígitos', sortVar:1 },
        {name:'c_estado', label: 'Estado', sortVar:0 },
        {name:'c_usuarioregistro', label: 'Usuario registro', sortVar:0 },
        {name:'d_fecharegistro', label: 'Fecha registro', sortVar:0 },
        {name:'c_ultimousuario', label: 'Usuario actualización', sortVar:0 },
        {name:'d_ultimafechamodificacion', label: 'Fecha actualización', sortVar:0 },
    ];

    //campos de filtro
    const fieldsFilter= [
        {name:'c_tipodocumento'},
        {name:'c_descripcion'},
        {name:'n_numerodigitos'},
        {name:'c_estado'}
    ];

    //consumo de api
    useEffect(async () => {
        await setIsLoading(true);
        await getTiposDocumentos();
        setIsLoading(false);
    }, [])

    const refreshFunction = async () => {
        await setIsLoading(true);
        await getTiposDocumentos();
        setIsLoading(false);
    }

    //Funcion para obtener tiposDocumento
    const getTiposDocumentos = async () => {
        const response = await listAllTiposDocumento();
        if(response && response.status === 200 && response.body.data.length != 0) getTiposDocumentosTable(response.body.data);
    }

    const showDeleteModal = (c_tipodocumento) => {
        setIdElement(c_tipodocumento);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        const response = await deleteTipoDocumento(idElement);
        if(response && response.status === 200) {
            await getTiposDocumentos();
            setResponseData( {title: "Operación exitosa", message: "Se eliminó con éxito el tipo de documento." });
        } else {
            setResponseData( {title: "Error al eliminar", message: response.message });
        }
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    //Obtener tiposDocumento para la tabla
    const getTiposDocumentosTable = (tiposDocumento) => {
        const listTiposDocumentoTable = tiposDocumento.map((item) => {
            let aux = {};
            aux.c_tipodocumento = item.c_tipodocumento;
            aux.c_descripcion = item.c_descripcion;
            aux.n_numerodigitos = item.n_numerodigitos;
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.c_usuarioregistro = item.c_usuarioregistro || "";
            aux.d_fecharegistro = item.d_fecharegistro ? (new Date(item.d_fecharegistro)).toLocaleString("en-US") : "";
            aux.c_ultimousuario = item.c_ultimousuario || "";
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? (new Date(item.d_ultimafechamodificacion)).toLocaleString("en-US") : "";
            aux.actions = (<DropdownButton c_tipodocumento={item.c_tipodocumento} showDeleteModal={()=>showDeleteModal(item.c_tipodocumento)}
                viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setTiposDocumentoTable(listTiposDocumentoTable);
    }
    return (
        <>
            <ListContainer
                columns={columns} dataTable={tiposDocumentoTable} fieldsFilter={fieldsFilter} buttonLink='/nuevoTipoDocumento'
                textButton='Agregar Tipo de Documento' registerPermission={registerPermission} refreshFunction={refreshFunction}
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

export default TiposDocumento