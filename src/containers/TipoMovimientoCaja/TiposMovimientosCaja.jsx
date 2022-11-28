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
import { listAllTipoMovimientoCaja, deleteTipoMovimientoCaja } from '../../Api/Api'
import moment from 'moment'

const DropdownButton = ({c_tipomovimientocc, showDeleteModal, viewPermission=false, updatePermission=false, deletePermission=false}) => {
    const menu = (
        <Menu key={`Menu${c_tipomovimientocc}`}>
          {viewPermission && <Menu.Item key={`View${c_tipomovimientocc}`} className="btn btn-info">
            <Link to={`/visualizarTipoMovimientoCaja/${c_tipomovimientocc}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-eye"></i></Space>
                    <Space wrap>Visualizar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {updatePermission && <Menu.Item key={`Edit${c_tipomovimientocc}`} className="btn btn-warning">
            <Link to={`/editarTipoMovimientoCaja/${c_tipomovimientocc}`}>
                <Space direction="horizontal">
                    <Space wrap><i className="bi bi-pencil"></i></Space>
                    <Space wrap>Editar</Space>
                </Space>
            </Link>
          </Menu.Item>}
          {deletePermission && <Menu.Item key={`Delete${c_tipomovimientocc}`} className="btn btn-danger" onClick={showDeleteModal}>
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

const TiposMovimientosCaja = () => {
    //Estados
    const [tiposMovimientosCajaTable, setTiposMovimientosCajaTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [idElement, setIdElement] = useState(null);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    //Contexto
    const { getPagesKeysForUser } = useContext(PagesContext);
    const userPermisssions = getPagesKeysForUser().filter((item)=>{
        return item === "ACTUALIZAR TIPO DE MOVIMIENTO DE CAJA" || item === "AGREGAR TIPO DE MOVIMIENTO DE CAJA" || item === "VISUALIZAR TIPO DE MOVIMIENTO DE CAJA" || item === "ELIMINAR TIPO DE MOVIMIENTO DE CAJA"
    })
    const registerPermission = userPermisssions.includes("AGREGAR TIPO DE MOVIMIENTO DE CAJA");
    const updatePermission = userPermisssions.includes("ACTUALIZAR TIPO DE MOVIMIENTO DE CAJA");
    const viewPermission = userPermisssions.includes("VISUALIZAR TIPO DE MOVIMIENTO DE CAJA");
    const deletePermission = userPermisssions.includes("ELIMINAR TIPO DE MOVIMIENTO DE CAJA");
    //Constantes
    const columns = [
        {name:'actions', label: '', sortVar:0},
        {name:'c_tipomovimientocc', label: 'Código', sortVar:1 },
        {name:'c_descricpion', label: 'Descripción', sortVar:1 },
        {name:'c_clasetipomov', label: 'Clase', sortVar:1 },
        {name:'c_flagusuario', label: 'Flag', sortVar:1 },
        {name:'c_estado', label: 'Estado', sortVar:1 },
        {name:'c_flagsinmonto', label: 'Flag sin monto', sortVar:1 },
        {name:'c_flagxconfirmar', label: 'Flag Confirmar', sortVar:1 },
        {name:'c_tipomovimientoccinverso', label: 'Mov. Inverso', sortVar:1 },
        {name:'c_usuarioregistro', label: 'Usuario registro', sortVar:1, audit:true },
        {name:'d_fecharegistro', label: 'Fecha registro', sortVar:0, audit:true },
        {name:'c_ultimousuario', label: 'Usuario actualización', sortVar:1, audit:true },
        {name:'d_ultimafechamodificacion', label: 'Fecha actualización', sortVar:0, audit:true },
    ];

    //campos de filtro
    const fieldsFilter= [
        {name:'c_tipomovimientocc'},
        {name:'c_descricpion'},
        {name:'c_clasetipomov'},
        {name:'c_flagusuario'},
        {name:'c_estado'},
        {name:'c_flagsinmonto'},
        {name:'c_flagxconfirmar'},
        {name:'c_tipomovimientoccinverso'}
    ];

    //consumo de api
    useEffect(async () => {
        await setIsLoading(true);
        await getTiposMovimientosCaja();
        setIsLoading(false);
    }, [])

    const refreshFunction = async () => {
        await setIsLoading(true);
        await getTiposMovimientosCaja();
        setIsLoading(false);
    }

    //Funcion para obtener tiposDocumento
    const getTiposMovimientosCaja = async () => {
        const response = await listAllTipoMovimientoCaja();
        if(response && response.status === 200 && response.body.data) getTiposMovimientosCajaTable(response.body.data);
    }

    const showDeleteModal = (c_tipomovimientocc) => {
        setIdElement(c_tipomovimientocc);
        setOpen(true);
    }

    const handleDelete = async () => {
        await setOpen(false);
        await setIsLoading(true);
        const response = await deleteTipoMovimientoCaja(idElement);
        if(response && response.status === 200) {
            await getTiposMovimientosCaja();
            setResponseData( {title: "Operación exitosa", message: "Se eliminó con éxito el tipo de documento." });
        } else {
            setResponseData( {title: "Error al eliminar", message: response.message });
        }
        setOpenResponseModal(true);
        setIsLoading(false);
    }

    //Obtener tiposDocumento para la tabla
    const getTiposMovimientosCajaTable = (tiposDocumento) => {
        const listTiposMovimientosCajaTable = tiposDocumento.map((item) => {
            let aux = {};
            aux.c_tipomovimientocc = item.c_tipomovimientocc;
            aux.c_descricpion = item.c_descricpion;
            aux.c_clasetipomov = item.c_clasetipomov === "I" ? "INGRESO" : "SALIDA";
            aux.c_flagusuario = item.c_flagusuario === "S" ? "SI" : "NO";
            aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
            aux.c_flagsinmonto = item.c_flagsinmonto === "N" ? "NO" : "SI";
            aux.c_flagxconfirmar = item.c_flagxconfirmar === "N" ? "NO" : "SI";
            aux.c_tipomovimientoccinverso = item.c_tipomovimientoccinverso ? item.c_tipomovimientoccinverso : "";
            aux.c_usuarioregistro = item.c_usuarioregistro || "";
            aux.d_fecharegistro = item.d_fecharegistro ? moment(item.d_fecharegistro).format("DD/MM/yyyy HH:mm:ss") : "";
            aux.c_ultimousuario = item.c_ultimousuario || "";
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy HH:mm:ss") : "";
            aux.actions = (<DropdownButton c_tipomovimientocc={item.c_tipomovimientocc} showDeleteModal={()=>showDeleteModal(item.c_tipomovimientocc)}
                viewPermission={viewPermission} updatePermission={updatePermission} deletePermission={deletePermission} />);
            return aux;
        })
        setTiposMovimientosCajaTable(listTiposMovimientosCajaTable);
    }
    return (
        <>
            <ListContainer
                columns={columns} dataTable={tiposMovimientosCajaTable} fieldsFilter={fieldsFilter} buttonLink='/nuevoTipoMovimientoCaja'
                textButton='Agregar Tipo de Movimiento de Caja' registerPermission={registerPermission} refreshFunction={refreshFunction}
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

export default TiposMovimientosCaja