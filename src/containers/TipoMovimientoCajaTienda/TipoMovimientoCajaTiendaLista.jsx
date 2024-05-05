import React, { useContext, useEffect, useState } from "react";
import { Menu, Dropdown, Button, Space } from "antd";
//Componentes
import ListContainer from "../../components/ListContainer/ListContainer";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import ResponseModal from "../../components/Modal/ResponseModal";
import Loading from "../../components/Modal/LoadingModal";
//Context
import PagesContext from "../../context/PagesContext/PagesContext";
//Utilities
import { Link } from "react-router-dom";
import {
  listAllTipoMovimientoCajaTienda,
  deleteTipoMovimientoCajaTienda,
} from "../../Api/Api";
import moment from "moment";

const DropdownButton = ({
  c_tipomovimientoctd,
  showDeleteModal,
  viewPermission = false,
  updatePermission = false,
  deletePermission = false,
}) => {
  const menu = (
    <Menu key={`Menu${c_tipomovimientoctd}`}>
      {viewPermission && (
        <Menu.Item key={`View${c_tipomovimientoctd}`} className="btn btn-info">
          <Link to={`/visualizarTipoDeMovimientoCajaTienda/${c_tipomovimientoctd}`}>
            <Space direction="horizontal">
              <Space wrap>
                <i className="bi bi-eye"></i>
              </Space>
              <Space wrap>Visualizar</Space>
            </Space>
          </Link>
        </Menu.Item>
      )}
      {updatePermission && (
        <Menu.Item
          key={`Edit${c_tipomovimientoctd}`}
          className="btn btn-warning"
        >
          <Link to={`/editarTipoDeMovimientoCajaTienda/${c_tipomovimientoctd}`}>
            <Space direction="horizontal">
              <Space wrap>
                <i className="bi bi-pencil"></i>
              </Space>
              <Space wrap>Editar</Space>
            </Space>
          </Link>
        </Menu.Item>
      )}
      {deletePermission && (
        <Menu.Item
          key={`Delete${c_tipomovimientoctd}`}
          className="btn btn-danger"
          onClick={showDeleteModal}
        >
          <Space direction="horizontal">
            <Space wrap>
              <i className="bi bi-trash"></i>
            </Space>
            <Space wrap>Eliminar</Space>
          </Space>
        </Menu.Item>
      )}
    </Menu>
  );
  return (
    <Dropdown overlay={menu} placement="bottomCenter">
      <Button>
        <Space direction="horizontal">
          <Space wrap>Acciones</Space>
          <Space wrap>
            <i className="bi bi-caret-down-fill"></i>
          </Space>
        </Space>
      </Button>
    </Dropdown>
  );
};

const TipoMovimientoCajaLista = () => {
  //Estados
  const [tiposMovimientosCajaTiendaTable, setTiposMovimientosCajaTiendaTable] =
    useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [idElement, setIdElement] = useState(null);
  const [openResponseModal, setOpenResponseModal] = useState(false);
  const [responseData, setResponseData] = useState({});
  //Contexto
  const { getPagesKeysForUser } = useContext(PagesContext);
  const userPermisssions = getPagesKeysForUser().filter((item) => {
    return (
      item === "ACTUALIZAR TIPO DE MOVIMIENTO DE CAJA TIENDA" ||
      item === "AGREGAR TIPO DE MOVIMIENTO DE CAJA TIENDA" ||
      item === "VISUALIZAR TIPO DE MOVIMIENTO DE CAJA TIENDA" ||
      item === "ELIMINAR TIPO DE MOVIMIENTO DE CAJA TIENDA"
    );
  });
  const registerPermission = userPermisssions.includes(
    "AGREGAR TIPO DE MOVIMIENTO DE CAJA TIENDA"
  );
  const updatePermission = userPermisssions.includes(
    "ACTUALIZAR TIPO DE MOVIMIENTO DE CAJA TIENDA"
  );
  const viewPermission = userPermisssions.includes(
    "VISUALIZAR TIPO DE MOVIMIENTO DE CAJA TIENDA"
  );
  const deletePermission = userPermisssions.includes(
    "ELIMINAR TIPO DE MOVIMIENTO DE CAJA TIENDA"
  );
  //Constantes
  const columns = [
    { name: "actions", label: "", sortVar: 0 },
    { name: "c_tipomovimientoctd", label: "Código", sortVar: 1 },
    { name: "c_descricpion", label: "Descripción", sortVar: 1 },
    { name: "c_clasetipomov", label: "Clase", sortVar: 1 },
    { name: "c_estado", label: "Estado", sortVar: 1 },
    { name: "c_tipomovimientoctdinverso", label: "Mov. Inverso", sortVar: 1 },
    { name: "c_flagtransacciontienda", label: "F. Transacción tienda", sortVar: 1 },
    {
      name: "c_usuarioregistro",
      label: "Usuario registro",
      sortVar: 1,
      audit: true,
    },
    {
      name: "d_fecharegistro",
      label: "Fecha registro",
      sortVar: 0,
      audit: true,
    },
    {
      name: "c_ultimousuario",
      label: "Usuario actualización",
      sortVar: 1,
      audit: true,
    },
    {
      name: "d_ultimafechamodificacion",
      label: "Fecha actualización",
      sortVar: 0,
      audit: true,
    },
  ];

  //campos de filtro
  const fieldsFilter = [
    { name: "c_tipomovimientoctd" },
    { name: "c_descricpion" },
    { name: "c_clasetipomov" },
    { name: "c_estado" },
    { name: "c_tipomovimientoctdinverso" },
    { name: "c_flagtransacciontienda" },
  ];

  //consumo de api
  useEffect(async () => {
    await setIsLoading(true);
    await getTiposMovimientosCajaTienda();
    setIsLoading(false);
  }, []);

  const refreshFunction = async () => {
    await setIsLoading(true);
    await getTiposMovimientosCajaTienda();
    setIsLoading(false);
  };

  //Funcion para obtener tiposDocumento
  const getTiposMovimientosCajaTienda = async () => {
    const response = await listAllTipoMovimientoCajaTienda();
    if (response && response.status === 200 && response.body.data)
      getTiposMovimientosCajaTiendaTable(response.body.data);
  };

  const showDeleteModal = (c_tipomovimientoctd) => {
    setIdElement(c_tipomovimientoctd);
    setOpen(true);
  };

  const handleDelete = async () => {
    await setOpen(false);
    await setIsLoading(true);
    const response = await deleteTipoMovimientoCajaTienda(idElement);
    if (response && response.status === 200) {
      await getTiposMovimientosCajaTienda();
      setResponseData({
        title: "Operación exitosa",
        message: "Se eliminó con éxito el tipo de documento.",
      });
    } else {
      setResponseData({
        title: "Error al eliminar",
        message: response.message,
      });
    }
    setOpenResponseModal(true);
    setIsLoading(false);
  };

  //Obtener tiposDocumento para la tabla
  const getTiposMovimientosCajaTiendaTable = (tiposDocumento) => {
    const listTiposMovimientosCajaTiendaTable = tiposDocumento.map((item) => {
      let aux = {};
      aux.c_tipomovimientoctd = item.c_tipomovimientoctd;
      aux.c_descricpion = item.c_descricpion;
      aux.c_clasetipomov = item.c_clasetipomov === "I" ? "INGRESO" : "SALIDA";
      aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
      aux.c_tipomovimientoctdinverso = item.c_tipomovimientoctdinverso
        ? item.c_tipomovimientoctdinverso
        : "";
      aux.c_flagtransacciontienda = item.c_flagtransacciontienda === "S" ? "SI" : "NO";
      aux.c_usuarioregistro = item.c_usuarioregistro || "";
      aux.d_fecharegistro = item.d_fecharegistro
        ? moment(item.d_fecharegistro).format("DD/MM/yyyy HH:mm:ss")
        : "";
      aux.c_ultimousuario = item.c_ultimousuario || "";
      aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion
        ? moment(item.d_ultimafechamodificacion).format("DD/MM/yyyy HH:mm:ss")
        : "";
      aux.actions = (
        <DropdownButton
          c_tipomovimientoctd={item.c_tipomovimientoctd}
          showDeleteModal={() => showDeleteModal(item.c_tipomovimientoctd)}
          viewPermission={viewPermission}
          updatePermission={updatePermission}
          deletePermission={deletePermission}
        />
      );
      return aux;
    });
    setTiposMovimientosCajaTiendaTable(listTiposMovimientosCajaTiendaTable);
  };

  return (
    <>
      <ListContainer
        columns={columns}
        dataTable={tiposMovimientosCajaTiendaTable}
        fieldsFilter={fieldsFilter}
        buttonLink="/nuevoTipoDeMovimientoCajaTienda"
        textButton="Agregar Tipo de Movimiento de Caja Tienda"
        registerPermission={registerPermission}
        refreshFunction={refreshFunction}
      />
      {isLoading === true && <Loading />}
      <ConfirmationModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={"Aviso de eliminación"}
        message={
          "¿Seguro que desea eliminar este elemento?. Una vez eliminado no podrás recuperarlo."
        }
        onHandleFunction={() => handleDelete()}
        buttonClass="btn-danger"
      />
      <ResponseModal
        isOpen={openResponseModal}
        title={responseData.title}
        onClose={() => setOpenResponseModal(false)}
        message={responseData.message}
      />
    </>
  );
};

export default TipoMovimientoCajaLista;
