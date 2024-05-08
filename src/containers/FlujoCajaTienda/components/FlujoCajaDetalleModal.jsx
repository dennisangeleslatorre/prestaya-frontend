import React, { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import { Table, Tooltip } from "antd";
import moment from "moment";
import Modal from "../../../components/Modal/ModalNotification";
import {} from "../../../Api/Api";

const columns = [
  {
    title: "#",
    dataIndex: "key",
    ellipsis: {
      showTitle: false,
    },
    width: 20,
    render: (key, flujoCajaDetalle) => (
      <div onClick={flujoCajaDetalle.handleMostrarMovimientoDetalleRow}>
        {key}
      </div>
    ),
  },
  {
    title: "Fecha",
    dataIndex: "d_fechamov_format",
    ellipsis: {
      showTitle: false,
    },
    width: 140,
    render: (d_fechamov_format, flujoCajaDetalle) => (
      <div onClick={flujoCajaDetalle.handleMostrarMovimientoDetalleRow}>
        {d_fechamov_format}
      </div>
    ),
  },
  {
    title: "Observaciones",
    dataIndex: "c_observaciones",
    ellipsis: {
      showTitle: true,
    },
    width: 200,
    render: (c_observaciones, flujoCajaDetalle) => (
      <div onClick={flujoCajaDetalle.handleMostrarMovimientoDetalleRow}>
        <Tooltip placement="topLeft" title={c_observaciones}>
          {c_observaciones}
        </Tooltip>
      </div>
    ),
  },
  {
    title: "Estado",
    dataIndex: "c_estado",
    ellipsis: {
      showTitle: false,
    },
    width: 130,
    render: (c_estado, flujoCajaDetalle) => (
      <div onClick={flujoCajaDetalle.handleMostrarMovimientoDetalleRow}>
        {c_estado}
      </div>
    ),
  },
];

const FlujoCajaDetalleModal = (props) => {
  const {
    isOpen,
    onClose,
    c_compania,
    n_correlativo,
    handleMostrarDetalleCajaMovimiento,
  } = props;
  const [detalles, setDetalles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getDataService = async () => {
    await setIsLoading(true);
    // const response = await getFlujoCajaDiasByCodigo({c_compania, n_correlativo});
    // if(response && response.status === 200 && response.body.data) {
    //     setDataFlujoCajaDetalleTable(response.body.data);
    // } else
    //     setDataFlujoCajaDetalleTable([]);
    setIsLoading(false);
  };

  const setDataFlujoCajaDetalleTable = (detallesService) => {
    const listAux = JSON.parse(JSON.stringify(detallesService)).map(
      (item, index) => {
        let aux = {};
        aux.key = index + 1;
        aux.d_fechamov_format = item.d_fechamov
          ? moment(item.d_fechamov).local().format("DD/MM/yyyy")
          : "";
        aux.c_observaciones = item.c_observaciones;
        aux.c_estado = item.c_estado === "A" ? "ACTIVO" : "INACTIVO";
        aux.handleMostrarMovimientoDetalleRow = () =>
          handleMostrarDetalleCajaMovimiento(
            c_compania,
            n_correlativo,
            moment(item.d_fechamov).local().format("yyyy-MM-DD")
          );
        return aux;
      }
    );
    setDetalles(listAux);
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (c_compania && n_correlativo) {
      getDataService();
    }
  }, [c_compania, n_correlativo]);

  return (
    <Modal
      isOpen={isOpen}
      title="Detalle"
      onClose={handleClose}
      modal_class="Modal__container__form"
    >
      <div className="modal-body row">
        <div className="col-12 mb-3 text-center">
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="row">
              <div className="col" style={{ overflow: "scroll" }}>
                <Table
                  columns={columns}
                  dataSource={detalles}
                  showHeadTable={false}
                  showSelectDataPerPage={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FlujoCajaDetalleModal;
