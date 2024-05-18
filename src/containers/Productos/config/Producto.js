import { Tooltip } from "antd";

export const estados = [
  { name: "TODOS", value: "T" },
  { name: "ACTIVO", value: "A" },
  { name: "INACTIVO", value: "I" },
];

export const columns = [
  {
    title: "Agencia",
    dataIndex: "c_agencia_desc",
    ellipsis: {
      showTitle: false,
    },
    width: 160,
    render: (value, obj) => (
      <div>
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      </div>
    ),
  },
  {
    title: "Producto",
    dataIndex: "c_item",
    ellipsis: {
      showTitle: false,
    },
    width: 140,
    render: (c_item, objeto) => (
      <div>
        <Tooltip placement="topLeft" title={c_item}>
          {c_item}
        </Tooltip>
      </div>
    ),
  },
  {
    title: "Descripción",
    dataIndex: "c_descripcionproducto",
    ellipsis: {
      showTitle: false,
    },
    width: 200,
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
    dataIndex: "c_unidadmedida_desc",
    ellipsis: {
      showTitle: false,
    },
    width: 120,
  },
  {
    title: "Tipo producto",
    dataIndex: "c_descripcion_tipo_producto",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    render: (value, obj) => (
      <div>
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      </div>
    ),
  },
  {
    title: "Subtipo producto",
    dataIndex: "c_subtipoproducto_desc",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    render: (value, obj) => (
      <div>
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      </div>
    ),
  },
  {
    title: "Ubicación",
    dataIndex: "c_ubicacion_desc",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    render: (value, obj) => (
      <div>
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      </div>
    ),
  },
  {
    title: "Observaciones",
    dataIndex: "c_observaciones_producto",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    render: (value, obj) => (
      <div>
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      </div>
    ),
  },
  {
    title: "P. Neto",
    dataIndex: "n_pesoneto",
    width: 140,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: "P. Bruto",
    dataIndex: "n_pesobruto",
    width: 140,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: "# Prestamo",
    dataIndex: "c_prestamo",
    width: 140,
    ellipsis: {
      showTitle: false,
    },
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
