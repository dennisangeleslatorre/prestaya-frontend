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
import { listAllProvincias, deleteProvincia } from '../../Api/Api'
import moment from 'moment'

const DropdownButton = ({keyCodes, showDeleteModal, viewPermission=false, updatePermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${keyCodes.c_paiscodigo}${keyCodes.c_departamentocodigo}${keyCodes.c_provinciacodigo}`}>
          {viewPermission && <Menu.Item key={`View${keyCodes.c_paiscodigo}${keyCodes.c_departamentocodigo}${keyCodes.c_provinciacodigo}`} className="btn btn-info">
            <Link to={`/visualizarProvincia/${keyCodes.c_paiscodigo}-${keyCodes.c_departamentocodigo}-${keyCodes.c_provinciacodigo}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {updatePermission && <Menu.Item key={`Edit${keyCodes.c_paiscodigo}${keyCodes.c_departamentocodigo}${keyCodes.c_provinciacodigo}`} className="btn btn-warning">
            <Link to={`/editarProvincia/${keyCodes.c_paiscodigo}-${keyCodes.c_departamentocodigo}-${keyCodes.c_provinciacodigo}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {deletePermission && <Menu.Item key={`Delete${keyCodes.c_paiscodigo}${keyCodes.c_departamentocodigo}${keyCodes.c_provinciacodigo}`} className="btn btn-danger" onClick={showDeleteModal}>
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

const Provincias = () => {
    //Estados
    const [provinciasTable, setProvinciasTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [keyElement, setKeyElement] = useState(null);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR PROVINCIA" || item === "AGREGAR PROVINCIA" || item === "VISUALIZAR PROVINCIA" || item === "ELIMINAR PROVINCIA"
    })
    const registerPermission = userPermisssions.includes("AGREGAR PROVINCIA");
    const updatePermission = userPermisssions.includes("ACTUALIZAR PROVINCIA");
    const viewPermission = userPermisssions.includes("VISUALIZAR PROVINCIA");
    const deletePermission = userPermisssions.includes("ELIMINAR PROVINCIA");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'pais', label: 'País', sortVar:1 },
        {name:'departamento', label: 'Departamento', sortVar:1 },
        {name:'c_provinciacodigo', label: 'Provincia', sortVar:1 },
        {name:'c_descripcion', label: 'Descripción', sortVar:1 },
        {name:'c_estado', label: 'Estado', sortVar:1 },
        {name:'c_usuarioregistro', label: 'Usuario registro', sortVar:1, audit:true },
        {name:'d_fecharegistro', label: 'Fecha registro', sortVar:0, audit:true },
        {name:'c_ultimousuario', label: 'Usuario actualización', sortVar:1, audit:true },
        {name:'d_ultimafechamodificacion', label: 'Fecha actualización', sortVar:0, audit:true },
    ];

    //campos de filtro
    const fieldsFilter= [
        { name: 'c_provinciacodigo' },
        { name: 'departamento' },
        { name: 'pais' },
        { name: 'c_descripcion' },
        { name: 'c_estado' }
    ];

    //consumo de api
    useEffect(async () => {
        await refreshFunction();
    }, [])

    const refreshFunction = async () => {
        await setIsLoading(true);
        await getProvincias();
        setIsLoading(false);
    }

    //Funcion para obtener provincias
    const getProvincias = async () => {
        const response = await listAllProvincias();
        if(response && response.status === 200 && response.body.data) getProvinciasTable(response.body.data);
    }

    const showDeleteModal = (keyCodes) => {
        setKeyElement(keyCodes);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        const response = await deleteProvincia(keyElement);
        if(response && response.status === 200) {
            await getProvincias();
            setResponseData( {title: "Operación exitosa", message: "Se eliminó con éxito la provincia." });
        } else {
            setResponseData( {title: "Error al eliminar", message: response.message });
        }
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    //Obtener provincias para la tabla
    const getProvinciasTable = (provincias) => {
        const listProvinciasTable = provincias.map((item) => {
            let aux = {};
            aux.pais = item.pais;
            aux.departamento = item.departamento;
            aux.c_provinciacodigo = item.c_provinciacodigo;
            aux.c_descripcion = item.c_descripcion;
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.c_usuarioregistro = item.c_usuarioregistro || "";
            aux.d_fecharegistro = item.d_fecharegistro ? moment(item.d_fecharegistro).format("DD/MM/yyyy HH:mm:ss") : "";
            aux.c_ultimousuario = item.c_ultimousuario || "";
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy HH:mm:ss") : "";
            const keyCodes = {
                c_departamentocodigo: item.c_departamentocodigo,
                c_paiscodigo: item.c_paiscodigo,
                c_provinciacodigo: item.c_provinciacodigo
            }
            aux.actions = (<DropdownButton keyCodes={keyCodes} showDeleteModal={()=>showDeleteModal(keyCodes)}
                viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setProvinciasTable(listProvinciasTable);
    }

    return (
        <>
            <ListContainer
                columns={columns} dataTable={provinciasTable} fieldsFilter={fieldsFilter} buttonLink='/nuevaProvincia'
                textButton='Agregar Provincia' registerPermission={registerPermission} refreshFunction={refreshFunction}
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

export default Provincias