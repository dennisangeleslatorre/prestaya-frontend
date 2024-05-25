import React, { useState, useEffect, useContext } from "react";
import { Table, Space, Button, Tooltip } from "antd";
import ReactSelect from "../../components/ReactSelect/ReactSelect";
import {
  listCompanias,
  listUsers,
  listAgenciesByUserAndCompany,
} from "../../Api/Api";
import moment from "moment";
import Loading from "../../components/Modal/LoadingModal";
import { separator } from "../../utilities/Functions/FormatNumber";
import { useHistory } from "react-router";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import ResponseModal from "../../components/Modal/ResponseModal";
import { debounce } from "lodash";
//Context
import UserContext from "../../context/UserContext/UserContext";
import PagesContext from "../../context/PagesContext/PagesContext";
import { getTransaccionesPorConfirmar, postConfirmarTransaccionProductoSalida } from "../../Api/Comercial/transacciones.service";
import { confirmTransactionsFormColumns } from "./configData";

const FormTransaccionTiendaPorConfirmar = () => {
  let history = useHistory();
  //Estados
  const [company, setCompany] = useState("");
  const [userOperation, setUserOperation] = useState("T");
  const [originAgency, setOriginAgency] = useState("T");
  const [relatedAgency, setRelatedAgency] = useState("T");
  const [userCashFlowStore, setUserCashFlowStore] = useState("T");
  const [userCashFlowStoreDestinantion, setUserCashFlowStoreDestinantion] = useState("T");
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [openResponseModal, setOpenResponseModal] = useState(false);
  const [elementSelected, setElementSelected] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalAttributes, setModalAttributes] = useState({
    title: "",
    message: "",
  });
  const [open, setOpen] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  //Estados de las listas
  const [companies, setCompanies] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  //Contextos
  const { getUserData } = useContext(UserContext);
  const userLogedIn = getUserData().c_codigousuario;
  const { getPagesKeysForUser } = useContext(PagesContext);
  const userPermisssions = getPagesKeysForUser().filter((item) => {
    return item === "USUARIO ACCESO TOTAL CAJA TIENDA";
  });
  const userAccessTotalCashPermission = userPermisssions.includes(
    "USUARIO ACCESO TOTAL CAJA TIENDA"
  );
  //Atributos de la tabla
  const rowSelection = {
    onChange: (selectedKeys, selectedRows) => {
      setElementSelected(selectedRows);
      setSelectedRowKeys(selectedKeys);
    },
  };

  const prepareNotification = (title, message) => {
    setResponseData({ title: title, message: message });
    setOpenResponseModal(true);
  };

  const prepareBodyToSearch = () => {
    let body = {};
    if (company) body.c_compania = company;
    if (userOperation && userOperation !== "T")
      body.usuariooperacion = userOperation;
    if (userCashFlowStore && userCashFlowStore !== "T")
      body.c_usuariofctienda = userOperation;
    if (userCashFlowStoreDestinantion && userCashFlowStoreDestinantion !== "T")
      body.c_usuariofctiendarelacionado = userCashFlowStoreDestinantion;
    if (originAgency && originAgency !== "T") body.c_agencia = originAgency;
    if (relatedAgency && relatedAgency !== "T")
      body.agenciarelacionado = relatedAgency;
    body.c_codigousuario = userLogedIn;
    return body;
  };

  const handleConfirmTransaction = async () => {
    try {
      setOpen(false);
      setDisabledButton(true);
      const selectedTransaction = transactions.find(
        (item) =>
          item.c_compania === elementSelected[0].c_compania &&
          item.c_agencia === elementSelected[0].c_agencia &&
          item.c_tipodocumento === elementSelected[0].c_tipodocumento &&
          item.c_numerodocumento === elementSelected[0].c_numerodocumento
      );
      const body = prepareBody(selectedTransaction);
      const response = await postConfirmarTransaccionProductoSalida(body);
      if (response && response.status === 200 && response.body.message === 'OK') {
        await refresListTable();
        setResponseData({ title: 'Operación exitosa', message: 'Se confirmo con éxito.' });
      } else {
        setResponseData({ title: 'Error al confirmar', message: response.body.message });
      }
      setOpenResponseModal(true);
      setTimeout(() => {
        setDisabledButton(false);
      }, 2000);
      setIsLoading(false);
    } catch (error) {
      setDisabledButton(false);
      setIsLoading(false);
    }
  }

  const onHandleClickSearch = async () => {
    await setIsLoading(true);
    await refresListTable();
    setIsLoading(false);
  };

  const refresListTable = async () => {
    let parameters = prepareBodyToSearch();
    const response = await getTransaccionesPorConfirmar(parameters);
    if (response && response.status === 200) {
      setTransactionDataTable(response.body.data);
    } else {
      setTransactionDataTable([]);
    }
    setElementSelected([]);
    setSelectedRowKeys([]);
  };

  const handleOpenConfirmTransactionModal = () => {
    if (elementSelected[0]) {
      if (
        elementSelected[0].c_usuariofctienda === userLogedIn ||
        userAccessTotalCashPermission
      ) {
        setModalAttributes({
          title: "Aviso de confirmación",
          message: `Una vez realizada la operación se generarán los movimientos respectivos. Confirmación de transacción para la caja tienda de ${elementSelected[0].c_usuariofctienda}.`,
        });
        setOpen(true);
      } else {
        prepareNotification(
          "Aviso",
          "El usuario no tiene permiso para confirmar esta transaccioón."
        );
      }
    } else {
      prepareNotification("Aviso", "Selecciona un item de la tabla.");
    }
  };

  const prepareBody = (transacctionData) => {
    return {
      c_compania: transacctionData.c_compania,
      c_agencia: transacctionData.c_agencia,
      c_tipodocumento: transacctionData.c_tipodocumento,
      c_numerodocumento: transacctionData.c_numerodocumento,
      n_montototal: transacctionData.n_montototal,
      c_usuariooperacion: transacctionData.c_usuariooperacion,
      c_usuariofctienda: transacctionData.c_usuariofctienda,
      d_fechadocumento: moment(transacctionData.d_fechadocumento).format("yyyy-MM-DD"),
      c_usuarioconfirmado: userLogedIn,
      c_ultimousuario: userLogedIn
    };
  };

  const handleSelectCompany = (value) => {
    setCompany(value);
    setOriginAgency("T");
    setRelatedAgency("T");
    getAgencies(value);
  };

  const setTransactionDataTable = (transactionsPorConfirmar) => {
    const listAux = JSON.parse(JSON.stringify(transactionsPorConfirmar)).map(
      (item) => {
        let aux = item;
        aux.key = `${item.c_compania}-${item.c_agencia}-${item.c_tipodocumento}-${item.c_numerodocumento}`;
        aux.d_fechamov_format = item.d_fechadocumento
          ? moment(item.d_fechadocumento).format("DD/MM/yyyy")
          : "";
        aux.n_montototal_format = item.n_montototal
          ? separator(Number(item.n_montototal).toFixed(2))
          : "";
        return aux;
      }
    );
    setTransactions(listAux);
  };

  const getCompanias = async () => {
    const response = await listCompanias();
    if (response && response.status === 200) setCompanies(response.body.data);
  };

  const getUsers = async () => {
    const response = await listUsers();
    if (response && response.status === 200)
      setUsers([
        { c_codigousuario: "T", c_nombres: "TODOS" },
        ...response.body.data,
      ]);
  };

  const getAgencies = async (companyCode) => {
    const response = await listAgenciesByUserAndCompany({
      c_compania: companyCode,
      c_codigousuario: userLogedIn,
    });
    if (response && response.status === 200 && response.body.data)
      setAgencies([
        { c_agencia: "T", c_descripcion: "TODOS" },
        ...response.body.data,
      ]);
  };

  useEffect(() => {
    if (companies.length !== 0) {
      handleSelectCompany(companies[0].c_compania);
    }
  }, [companies]);

  useEffect(async () => {
    await setIsLoading(true);
    await getCompanias();
    await getUsers();
    setIsLoading(false);
  }, []);

  return (
    <>
      <div
        className="container-fluid pt-2 pb-2 pl-2 pr-2"
        style={{ background: "#FFFFFF" }}
      >
        <div className="row">
          <div className="col">
            <div className="card pr-3 pl-3">
              <div className="card-body">
                <div className="row">
                  <div className="row col-12 col-md-12">
                    <ReactSelect
                      inputId="companyCodeId"
                      labelText="Compañía"
                      placeholder="Seleccione un compañía"
                      valueSelected={company}
                      data={companies}
                      handleElementSelected={handleSelectCompany}
                      optionField="c_descripcion"
                      valueField="c_compania"
                      classForm="col-12 col-md-6"
                      marginForm="ml-0"
                    />
                    <ReactSelect
                      inputId="originAgencyCodeId"
                      labelText="Agencia"
                      placeholder="Seleccione una agencia"
                      valueSelected={originAgency}
                      data={agencies}
                      handleElementSelected={setOriginAgency}
                      optionField="c_descripcion"
                      valueField="c_agencia"
                      classForm="col-12 col-lg-6"
                      marginForm="ml-0"
                    />
                    <ReactSelect
                      inputId="userOperationCodeId"
                      labelText="Usuario operación"
                      placeholder="Seleccione un Usuario"
                      valueSelected={userOperation}
                      data={users}
                      handleElementSelected={setUserOperation}
                      optionField="c_nombres"
                      valueField="c_codigousuario"
                      classForm="col-12 col-md-6"
                      marginForm="ml-0"
                    />
                    <ReactSelect
                      inputId="usuarioTiendaId"
                      labelText="Usuario tienda"
                      placeholder="Seleccione un Usuario"
                      valueSelected={userCashFlowStore}
                      data={users}
                      handleElementSelected={setUserCashFlowStore}
                      optionField="c_nombres"
                      valueField="c_codigousuario"
                      classForm="col-12 col-md-6"
                      marginForm="ml-0"
                    />
                    <ReactSelect
                      inputId="relatedAgencyCodeId"
                      labelText="Agencia relacionada"
                      placeholder="Seleccione una agencia"
                      valueSelected={relatedAgency}
                      data={agencies}
                      handleElementSelected={setRelatedAgency}
                      optionField="c_descripcion"
                      valueField="c_agencia"
                      classForm="col-12 col-lg-6"
                      marginForm="ml-0"
                    />
                    <ReactSelect
                      inputId="usuarioTiendaRelacionadaId"
                      labelText="Usuario tienda relacionada"
                      placeholder="Seleccione un Usuario"
                      valueSelected={userCashFlowStoreDestinantion}
                      data={users}
                      handleElementSelected={setUserCashFlowStoreDestinantion}
                      optionField="c_nombres"
                      valueField="c_codigousuario"
                      classForm="col-12 col-md-6"
                      marginForm="ml-0"
                    />
                  </div>
                  <div className="col-12 col-md-12 mt-3 mb-3 text-center">
                    <button
                      onClick={onHandleClickSearch}
                      className="btn btn-light"
                      style={{ width: "200px" }}
                    >
                      Buscar
                    </button>
                    <button
                      onClick={() => history.push(`/transacionestienda`)}
                      className="btn btn-light btn-form ml-2"
                    >
                      Regresar
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <Space size={[10, 3]} wrap style={{ marginBottom: 16 }}>
                      <Button onClick={handleOpenConfirmTransactionModal}>
                        CONFIRMAR
                      </Button>
                    </Space>
                  </div>
                </div>
                <div className="row">
                  <div className="col" style={{ overflow: "scroll" }}>
                    <Table
                      classForm
                      rowSelection={{
                        type: "radio",
                        ...rowSelection,
                        selectedRowKeys,
                      }}
                      columns={confirmTransactionsFormColumns}
                      dataSource={transactions}
                      pagination={{ pageSize: 50 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading === true && <Loading />}
      <ConfirmationModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={modalAttributes.title}
        message={modalAttributes.message}
        onHandleFunction={() => handleConfirmTransaction()}
        disabledButton={disabledButton}
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

export default FormTransaccionTiendaPorConfirmar;
