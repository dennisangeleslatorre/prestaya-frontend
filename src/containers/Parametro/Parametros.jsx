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
import { listAllParametros, deleteParametro } from '../../Api/Api'

const DropdownButton = ({keyCodes, showDeleteModal, viewPermission=false, updatePermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${keyCodes.c_compania}${keyCodes.c_parametrocodigo}`}>
          { viewPermission && <Menu.Item key={`View${keyCodes.c_compania}${keyCodes.c_parametrocodigo}`} className="btn btn-info">
            <Link to={`/visualizarParametro/${keyCodes.c_compania}-${keyCodes.c_parametrocodigo}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          { updatePermission && <Menu.Item key={`Edit${keyCodes.c_compania}${keyCodes.c_parametrocodigo}`} className="btn btn-warning">
            <Link to={`/editarParametro/${keyCodes.c_compania}-${keyCodes.c_parametrocodigo}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          { deletePermission && <Menu.Item key={`Delete${keyCodes.c_compania}${keyCodes.c_parametrocodigo}`} className="btn btn-danger" onClick={showDeleteModal}>
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

const Parametros = () => {
    //Estados
    const [parametrosTable, setParametrosTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [keyElement, setKeyElement] = useState(null);
    const tipoValor = {
        N: "n_valornumero",
        F: "d_valorfecha",
        T: "c_valortexto"
    }
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR PARÁMETRO" || item === "AGREGAR PARÁMETRO" || item === "VISUALIZAR PARÁMETRO" || item === "ELIMINAR PARÁMETRO"
    })
    const registerPermission = userPermisssions.includes("AGREGAR PARÁMETRO");
    const updatePermission = userPermisssions.includes("ACTUALIZAR PARÁMETRO");
    const viewPermission = userPermisssions.includes("VISUALIZAR PARÁMETRO");
    const deletePermission = userPermisssions.includes("ELIMINAR PARÁMETRO");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'c_compania', label: 'Compañía', sortVar:1 },
        {name:'c_parametrocodigo', label: 'Código', sortVar:1 },
        {name:'c_descripcion', label: 'Descripción', sortVar:1 },
        {name:'c_tipovalor', label: 'Tipo valor', sortVar:1 },
        {name:'valor', label: 'Valor', sortVar:1 },
        {name:'c_estado', label: 'Estado', sortVar:1 },
        {name:'c_usuarioregistro', label: 'Usuario registro', sortVar:0 },
        {name:'d_fecharegistro', label: 'Fecha registro', sortVar:0 },
        {name:'c_ultimousuario', label: 'Usuario actualización', sortVar:0 },
        {name:'d_ultimafechamodificacion', label: 'Fecha actualización', sortVar:0 },
    ];

    //campos de filtro
    const fieldsFilter= [
        { name: 'c_compania' },
        { name: 'c_parametrocodigo' },
        { name: 'c_descripcion' },
        { name: 'c_tipovalor' },
        { name: 'valor' },
        { name: 'c_estado' }
    ];

    //consumo de api
    useEffect(async () => {
        await refreshFunction();
    }, [])

    const refreshFunction = async () => {
        await setIsLoading(true);
        await getParametros();
        setIsLoading(false);
    }

    //Funcion para obtener parametros
    const getParametros = async () => {
        const response = await listAllParametros();
        if(response && response.status === 200 && response.body.data) getParametrosTable(response.body.data);
    }

    const showDeleteModal = (keyCodes) => {
        setKeyElement(keyCodes);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        const response = await deleteParametro(keyElement);
        if(response && response.status === 200) {
            await getParametros();
            setResponseData( {title: "Operación exitosa", message: "Se eliminó con éxito el parámetro." });
        } else {
            setResponseData( {title: "Error al eliminar", message: response.message });
        }
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    //Obtener parametros para la tabla
    const getParametrosTable = (parametros) => {
        const listParametrosTable = parametros.map((item) => {
            let aux = {};
            aux.c_compania = item.c_compania;
            aux.c_parametrocodigo = item.c_parametrocodigo;
            aux.c_descripcion = item.c_descripcion;
            aux.c_tipovalor = item.c_tipovalor;
            aux.valor = item[tipoValor[item.c_tipovalor]];
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.c_usuarioregistro = item.c_usuarioregistro || "";
            aux.d_fecharegistro = item.d_fecharegistro ? (new Date(item.d_fecharegistro)).toLocaleString("en-US") : "";
            aux.c_ultimousuario = item.c_ultimousuario || "";
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? (new Date(item.d_ultimafechamodificacion)).toLocaleString("en-US") : "";
            const keyCodes = { c_parametrocodigo: item.c_parametrocodigo, c_compania: item.c_compania }
            aux.actions = (<DropdownButton keyCodes={keyCodes} showDeleteModal={()=>showDeleteModal(keyCodes)}
                viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setParametrosTable(listParametrosTable);
    }

    return (
        <>
            <ListContainer
                columns={columns} dataTable={parametrosTable} fieldsFilter={fieldsFilter} buttonLink='/nuevoParametro'
                textButton='Agregar Parámetro' registerPermission={registerPermission} refreshFunction={refreshFunction}
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

export default Parametros