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
import { listAllSubtiposProducto, deleteSubtipoProducto } from "../../Api/Api";
import moment from "moment";

const DropdownButton = ({
  c_tipoproducto,
  c_subtipoproducto,
  showDeleteModal,
  viewPermission = false,
  updatePermission = false,
  deletePermission = false,
}) => {
  const menu = (
    <Menu key={`Menu${c_tipoproducto}-${c_subtipoproducto}`}>
      {viewPermission && (
        <Menu.Item
          key={`View${c_tipoproducto}-${c_subtipoproducto}`}
          className="btn btn-info"
        >
          <Link
            to={`/visualizarSubtipoProduto/${c_tipoproducto}-${c_subtipoproducto}`}
          >
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
          key={`Edit${c_tipoproducto}-${c_subtipoproducto}`}
          className="btn btn-warning"
        >
          <Link
            to={`/editarSubtipoProduto/${c_tipoproducto}-${c_subtipoproducto}`}
          >
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
          key={`Delete${c_tipoproducto}-${c_subtipoproducto}`}
          className="btn btn-danger"
          onClick={() => showDeleteModal({
              c_tipoproducto: c_tipoproducto,
              c_subtipoproducto: c_subtipoproducto,
            })}
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

const SubtiposProductosLista = () => {
  //Estados
  const [subtiposProductoTable, setSubtiposProductoTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [idElement, setIdElement] = useState(null);
  const [openResponseModal, setOpenResponseModal] = useState(false);
  const [responseData, setResponseData] = useState({});
  //Contexto
  const { getPagesKeysForUser } = useContext(PagesContext);
  const userPermisssions = getPagesKeysForUser().filter((item) => {
    return (
      item === "ACTUALIZAR SUBTIPO DE PRODUCTO" ||
      item === "AGREGAR SUBTIPO DE PRODUCTO" ||
      item === "SUBTIPOS DE PRODUCTO" ||
      item === "ELIMINAR SUBTIPO DE PRODUCTO"
    );
  });
  const registerPermission = userPermisssions.includes(
    "AGREGAR SUBTIPO DE PRODUCTO"
  );
  const updatePermission = userPermisssions.includes(
    "ACTUALIZAR SUBTIPO DE PRODUCTO"
  );
  const viewPermission = userPermisssions.includes("SUBTIPOS DE PRODUCTO");
  const deletePermission = userPermisssions.includes(
    "ELIMINAR SUBTIPO DE PRODUCTO"
  );
  //Constantes
  const columns = [
    { name: "actions", label: "", sortVar: 0 },
    { name: "c_tipoproducto", label: "Tipo de producto", sortVar: 1 },
    { name: "c_subtipoproducto", label: "Subtipo de producto", sortVar: 1 },
    { name: "c_descripcion", label: "Descripción", sortVar: 1 },
    { name: "c_estado", label: "Estado", sortVar: 1 },
    { name: "n_porcremate", label: "% Remate", sortVar: 0 },
    { name: "n_porcvtatienda", label: "% Tienda", sortVar: 0 },
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
    { name: "c_tipoproducto" },
    { name: "c_subtipoproducto" },
    { name: "c_descripcion" },
    { name: "c_estado" },
  ];

  //consumo de api
  useEffect(async () => {
    await refreshFunction();
  }, []);

  const refreshFunction = async () => {
    await setIsLoading(true);
    await getSubtiposProductos();
    setIsLoading(false);
  };

  //Funcion para obtener subtipos de producto
  const getSubtiposProductos = async () => {
    const response = await listAllSubtiposProducto();
    if (response && response.status === 200 && response.body.data)
      getSubtiposProductosTable(response.body.data);
  };

  const handleDelete = async () => {
    await setOpen(false);
    await setIsLoading(true);
    const response = await deleteSubtipoProducto(idElement);
    if (response && response.status === 200) {
      await getSubtiposProductos();
      setResponseData({
        title: "Operación exitosa",
        message: "Se eliminó con éxito el subtipo de producto.",
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

  //Obtener subtipos producto para la tabla
  const getSubtiposProductosTable = (subtipos) => {
    const listSubtiposProductoTable = subtipos.map((item) => {
      let aux = {};
      aux.c_tipoproducto = item.c_tipoproducto;
      aux.c_subtipoproducto = item.c_subtipoproducto;
      aux.c_descripcion = item.c_descripcion;
      aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
      aux.n_porcremate = Number(item.n_porcremate).toFixed(2);
      aux.n_porcvtatienda = Number(item.n_porcvtatienda).toFixed(2);
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
          c_tipoproducto={item.c_tipoproducto}
          c_subtipoproducto={item.c_subtipoproducto}
          showDeleteModal={(id) => {
            setIdElement(id);
            setOpen(true);
          }}
          viewPermission={viewPermission}
          updatePermission={updatePermission}
          deletePermission={deletePermission}
        />
      );
      return aux;
    });
    setSubtiposProductoTable(listSubtiposProductoTable);
  };

  return (
    <>
      <ListContainer
        columns={columns}
        dataTable={subtiposProductoTable}
        fieldsFilter={fieldsFilter}
        buttonLink="/nuevoSubtipoProduto"
        textButton="Agregar Subtipo de Producto"
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

export default SubtiposProductosLista;
