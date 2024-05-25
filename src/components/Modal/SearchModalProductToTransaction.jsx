import React, { useEffect, useState } from "react";
import Modal from "./ModalNotification";
import SearcherComponent from "../SearcherComponent/SearcherComponent";
import Table from "../Table/Table";
import Spinner from "../Spinner/Spinner";
import { getProductoDinamicoConPrecio } from "../../Api/Comercial/producto.service";

const SearchModalProductToTransaction = (props) => {
  const {
    isOpen,
    onClose,
    setProductoObtained,
    compania,
    agencia,
    userLogedIn,
  } = props;
  const [filterProducto, setFilterProducto] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const tableColumnsProducto = [
    { name: "c_item", label: "Item", sortVar: 0 },
    { name: "c_descripcionproducto", label: "Producto", sortVar: 0 },
    { name: "n_precio", label: "Precio", sortVar: 0 },
    { name: "actions", label: "Acciones", sortVar: 0 },
  ];

  const handleSearchProducto = async () => {
    if (filterProducto.length >= 1) {
      await setIsLoading(true);
      let data = {
        c_compania: compania,
        c_agencia: agencia !== "T" ? agencia : null,
        c_descripcionproducto: filterProducto,
        c_codigousuario: userLogedIn,
      };
      const response = await getProductoDinamicoConPrecio(data);
      if (
        response &&
        response.status === 200 &&
        response.body &&
        response.body.data
      )
        getProductosToTable(response.body.data);
      setIsLoading(false);
    }
  };

  const handleSelectProducto = async (item) => {
    await setProductoObtained(item);
    setFilterProducto("");
    setTableData([]);
    onClose();
  };

  const getProductosToTable = (productos) => {
    const listProductosTable = productos.map((item) => {
      let aux = {};
      aux.c_item = item.c_item;
      aux.c_descripcionproducto = item.c_descripcionproducto;
      aux.n_precio = Number(item.n_precio).toFixed(2);
      aux.actions = (
        <div className="row" style={{ justifyContent: "space-evenly" }}>
          <button
            type="button"
            onClick={() => handleSelectProducto(item)}
            className="btn btn-info"
          >
            <i className="bi bi-check"></i>
          </button>
        </div>
      );
      return aux;
    });
    setTableData(listProductosTable);
  };

  useEffect(() => {
    setTableData([]);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      title="Buscador de productos"
      onClose={onClose}
      modal_class="Modal__container__search"
    >
      {/*body*/}
      <div className="modal-body">
        <SearcherComponent
          stateName={filterProducto}
          setStateName={setFilterProducto}
          type="text"
          placeholder="Producto"
          inputId="productoNameModalId"
          classForm="col-12"
          autoComplete="seacher-producto"
          onHandleClick={handleSearchProducto}
          labelSpace={2}
          marginForm="ml-0 mr-0"
        >
          {filterProducto.length < 1 && (
            <div className="invalid__message__data">
              La longitud debe ser mayor a 0
            </div>
          )}
        </SearcherComponent>
        <div className="col-12 mb-3 text-center">
          {isLoading ? (
            <Spinner />
          ) : (
            <Table
              columns={tableColumnsProducto}
              data={tableData}
              showHeadTable={false}
              showSelectDataPerPage={false}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SearchModalProductToTransaction;
