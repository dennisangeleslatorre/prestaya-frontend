import { Tooltip } from "antd";

export const columns = [
  {
    title: "#",
    dataIndex: "key",
    ellipsis: {
      showTitle: false,
    },
    width: 130,
  },
  {
    title: "Tipo Movimiento tienda",
    dataIndex: "c_tipomovimientoctd_desc",
    ellipsis: {
      showTitle: false,
    },
    width: 240,
    render: (c_tipomovimientoctd_desc) => (
      <Tooltip placement="topLeft" title={c_tipomovimientoctd_desc}>
        {c_tipomovimientoctd_desc}
      </Tooltip>
    ),
  },
  {
    title: "Usuario Mov.",
    dataIndex: "c_usuariomovimiento",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
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
    title: "Monto x Mov.",
    dataIndex: "n_montoxdiamov_format",
    ellipsis: {
      showTitle: false,
    },
    width: 160,
    className: "text-numbers-table",
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
    dataIndex: "d_fecharegistro_format",
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
    dataIndex: "d_ultimafechamodificacion_format",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    className: "table-audit-column text-audit-table",
  },
  {
    title: () => <label className="text-audit-table">F. Transacción</label>,
    dataIndex: "c_flagtransaccion_format",
    ellipsis: {
      showTitle: false,
    },
    width: 150,
    className: "table-audit-column text-audit-table",
  },
  {
    title: () => <label className="text-audit-table">Tipo documento</label>,
    dataIndex: "c_tipodocumento_desc",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    className: "table-audit-column text-audit-table",
  },
  {
    title: () => <label className="text-audit-table">N° documento</label>,
    dataIndex: "c_numerodocumento",
    ellipsis: {
      showTitle: false,
    },
    width: 180,
    className: "table-audit-column text-audit-table",
  },
];

export const estadosCajaTiendaDia = [
  {value:"A" , name:"ABIERTO" }, {value:"C" , name:"CERRADO" }
]