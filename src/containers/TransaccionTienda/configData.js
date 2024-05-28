import { Tooltip } from "antd";

export const columnsForm = [
  {
    title: "Linea",
    dataIndex: "n_linea",
    ellipsis: {
      showTitle: false,
    },
    width: 120,
  },
  {
    title: "Producto  ",
    dataIndex: "c_item",
    ellipsis: {
      showTitle: false,
    },
    width: 140,
  },
  {
    title: "Descripción",
    dataIndex: "c_descripcionproducto",
    ellipsis: {
      showTitle: false,
    },
    width: 160,
    render: (c_descripcionproducto, objeto) => (
      <div>
        <Tooltip placement="topLeft" title={c_descripcionproducto}>
          {c_descripcionproducto}
        </Tooltip>
      </div>
    ),
  },
  {
    title: "Unidad M.",
    dataIndex: "c_unidadmedida",
    ellipsis: {
      showTitle: false,
    },
    width: 140,
  },
  {
    title: "Cantidad",
    dataIndex: "n_cantidad",
    width: 140,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: "Precio",
    dataIndex: "n_precio",
    ellipsis: {
      showTitle: false,
    },
    width: 160,
    className: "text-numbers-table",
  },
  {
    title: "Monto Total",
    dataIndex: "n_montototal",
    ellipsis: {
      showTitle: false,
    },
    width: 160,
    className: "text-numbers-table",
  },
  {
    title: "Observaciones",
    dataIndex: "c_observaciones",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    render: (c_observaciones, objeto) => (
      <div>
        <Tooltip placement="topLeft" title={c_observaciones}>
          {c_observaciones}
        </Tooltip>
      </div>
    ),
  },
  {
    title: () => <label className="text-audit-table">Estado</label>,
    dataIndex: "c_estado_desc",
    width: 140,
    ellipsis: {
      showTitle: false,
    },
    className: "table-audit-column text-audit-table",
  },
  {
    title: () => <label className="text-audit-table">U. Registro</label>,
    dataIndex: "c_usuarioregistro",
    ellipsis: {
      showTitle: false,
    },
    width: 155,
    className: "table-audit-column text-audit-table",
  },
  {
    title: () => <label className="text-audit-table">F. Registro</label>,
    dataIndex: "d_fecharegistro",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    className: "table-audit-column text-audit-table",
  },
  {
    title: () => <label className="text-audit-table">U. Modificación</label>,
    dataIndex: "c_ultimousuario",
    ellipsis: {
      showTitle: false,
    },
    width: 155,
    className: "table-audit-column text-audit-table",
  },
  {
    title: () => <label className="text-audit-table">F. Modificación</label>,
    dataIndex: "d_ultimafechamodificacion",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    className: "table-audit-column text-audit-table",
  },
];

export const currencies = [
  { name: "LOCAL", value: "L" },
  { name: "EXTERIOR", value: "E" },
];

export const transactionStatuses = [
  { name: "TODOS", value: "TO" },
  { name: "REGISTRADO", value: "RE" },
  { name: "ANULADO", value: "AN" },
];

export const transactionTypes = [
  { value: "NI", option: "Nota de ingreso" },
  { value: "NS", option: "Nota de salida" },
];

export const listColumns = [
  {
    title: "Agencia",
    dataIndex: "c_agencia_desc",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    render: (c_agencia_desc, objeto) => (
      <div onClick={objeto.hendleFunction}>
        <Tooltip placement="topLeft" title={c_agencia_desc}>
          {c_agencia_desc}
        </Tooltip>
      </div>
    ),
  },
  {
    title: "Tipo",
    dataIndex: "c_tipodocumento_desc",
    ellipsis: {
      showTitle: false,
    },
    width: 120,
    render: (field, objeto) => (
      <div onClick={objeto.hendleFunction}>{field}</div>
    ),
  },
  {
    title: "Numero Doc.",
    dataIndex: "c_numerodocumento",
    ellipsis: {
      showTitle: false,
    },
    width: 120,
    render: (field, objeto) => (
      <div onClick={objeto.hendleFunction}>{field}</div>
    ),
  },
  {
    title: "Fecha Doc",
    dataIndex: "d_fechadocumento_formato",
    ellipsis: {
      showTitle: false,
    },
    width: 140,
    render: (field, objeto) => (
      <div onClick={objeto.hendleFunction}>{field}</div>
    ),
  },
  {
    title: "Periodo",
    dataIndex: "c_periodo",
    ellipsis: {
      showTitle: false,
    },
    width: 140,
    render: (field, objeto) => (
      <div onClick={objeto.hendleFunction}>{field}</div>
    ),
  },
  {
    title: "Cliente",
    dataIndex: "c_nombrescompleto",
    ellipsis: {
      showTitle: false,
    },
    width: 240,
    render: (field, objeto) => (
      <div onClick={objeto.hendleFunction}>
        <Tooltip placement="topLeft" title={field}>
          {field}
        </Tooltip>
      </div>
    ),
  },
  {
    title: "Producto",
    dataIndex: "c_descripcionproducto",
    ellipsis: {
      showTitle: false,
    },
    width: 140,
    render: (c_descripcionproducto, objeto) => (
      <div onClick={objeto.hendleFunction}>
        <Tooltip placement="topLeft" title={c_descripcionproducto}>
          {c_descripcionproducto}
        </Tooltip>
      </div>
    ),
  },
  {
    title: "# Prestamo",
    dataIndex: "c_prestamo",
    width: 140,
    ellipsis: {
      showTitle: false,
    },
    render: (field, objeto) => (
      <div onClick={objeto.hendleFunction}>{field}</div>
    ),
  },
  {
    title: "Moneda",
    dataIndex: "c_moneda_desc",
    width: 140,
    ellipsis: {
      showTitle: false,
    },
    render: (field, objeto) => (
      <div onClick={objeto.hendleFunction}>{field}</div>
    ),
  },
  {
    title: "Monto Total",
    dataIndex: "n_montototal",
    ellipsis: {
      showTitle: false,
    },
    width: 160,
    className: "text-numbers-table",
    render: (field, objeto) => (
      <div onClick={objeto.hendleFunction}>{field}</div>
    ),
  },
  {
    title: "Observacioens",
    dataIndex: "c_observaciones",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    render: (c_observaciones, objeto) => (
      <div onClick={objeto.hendleFunction}>
        <Tooltip placement="topLeft" title={c_observaciones}>
          {c_observaciones}
        </Tooltip>
      </div>
    ),
  },
  {
    title: () => <label className="text-audit-table">Estado</label>,
    dataIndex: "c_estado_desc",
    width: 140,
    ellipsis: {
      showTitle: false,
    },
    className: "table-audit-column text-audit-table",
    render: (field, objeto) => (
      <div onClick={objeto.hendleFunction}>{field}</div>
    ),
  },
  {
    title: "Producto",
    dataIndex: "c_descripcionproducto",
    ellipsis: {
      showTitle: false,
    },
    width: 200,
    render: (c_descripcionproducto, objeto) => (
      <div onClick={objeto.hendleFunction}>
        <Tooltip placement="topLeft" title={c_descripcionproducto}>
          {c_descripcionproducto}
        </Tooltip>
      </div>
    ),
  },
  {
    title: () => <label className="text-audit-table">U. Registro</label>,
    dataIndex: "c_usuarioregistro",
    ellipsis: {
      showTitle: false,
    },
    width: 155,
    className: "table-audit-column text-audit-table",
    render: (field, objeto) => (
      <div onClick={objeto.hendleFunction}>{field}</div>
    ),
  },
  {
    title: () => <label className="text-audit-table">F. Registro</label>,
    dataIndex: "d_fecharegistro",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    className: "table-audit-column text-audit-table",
    render: (field, objeto) => (
      <div onClick={objeto.hendleFunction}>{field}</div>
    ),
  },
  {
    title: () => <label className="text-audit-table">U. Modificación</label>,
    dataIndex: "c_ultimousuario",
    ellipsis: {
      showTitle: false,
    },
    width: 155,
    className: "table-audit-column text-audit-table",
    render: (field, objeto) => (
      <div onClick={objeto.hendleFunction}>{field}</div>
    ),
  },
  {
    title: () => <label className="text-audit-table">F. Modificación</label>,
    dataIndex: "d_ultimafechamodificacion",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    className: "table-audit-column text-audit-table",
    render: (field, objeto) => (
      <div onClick={objeto.hendleFunction}>{field}</div>
    ),
  },
];

export const confirmTransactionsFormColumns = [
  {
    title: "Compañía",
    dataIndex: "compania_desc",
    ellipsis: {
      showTitle: false,
    },
    width: 140,
  },
  {
    title: "Usuario Operación",
    dataIndex: "c_usuariooperacion",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
  },
  {
    title: "Usuario FC. Tienda",
    dataIndex: "c_usuariofctienda",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
  },
  {
    title: "Agencia",
    dataIndex: "agencia_desc",
    ellipsis: {
      showTitle: false,
    },
    width: 200,
  },
  {
    title: "Tipo Movimiento",
    dataIndex: "tipomov_desc",
    ellipsis: {
      showTitle: false,
    },
    width: 240,
    render: (tipomov_desc) => (
      <Tooltip placement="topLeft" title={tipomov_desc}>
        {tipomov_desc}
      </Tooltip>
    ),
  },
  {
    title: "Fecha",
    dataIndex: "d_fechamov_format",
    ellipsis: {
      showTitle: false,
    },
    width: 140,
  },
  {
    title: "Agencia relacionada",
    dataIndex: "otra_agencia_desc",
    ellipsis: {
      showTitle: false,
    },
    width: 200,
  },
  {
    title: "Usuario caja relacionado",
    dataIndex: "c_usuariofctiendarelacionado",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
  },
  {
    title: "Moneda",
    dataIndex: "moneda",
    ellipsis: {
      showTitle: false,
    },
    width: 130,
  },
  {
    title: "Observaciones",
    dataIndex: "c_observaciones",
    ellipsis: {
      showTitle: false,
    },
    width: 260,
    render: (c_observaciones) => (
      <Tooltip placement="topLeft" title={c_observaciones}>
        {c_observaciones}
      </Tooltip>
    ),
  },
  {
    title: "Monto Total Trans.",
    dataIndex: "n_montototal_format",
    ellipsis: {
      showTitle: false,
    },
    width: 160,
    className: "text-numbers-table",
  },
];
