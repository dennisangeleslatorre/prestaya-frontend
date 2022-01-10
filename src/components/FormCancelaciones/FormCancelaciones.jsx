import React, { useContext, useEffect, useState } from 'react'
import HeaderForm from '../HeaderForm/HeaderForm'
import { Table, Space, Button } from 'antd'
import CancellationModal from '../CancellationModal/CancellationModal'

const columns = [
    {
        title: 'Línea',
        dataIndex: 'n_linea'
    },{
        title: 'Fecha Vencimiento',
        dataIndex: 'd_fechavencimiento'
    },{
        title: 'Monto Prestamo',
        dataIndex: 'n_montoprestamo'
    },{
        title: 'Mnt. Intereses',
        dataIndex: 'n_montointereses'
    },{
        title: 'Tipo Cancelación',
        dataIndex: 'c_tipocancelacion'
    },{
        title: 'Fecha Cancelación',
        dataIndex: 'd_fechacancelacion'
    },{
        title: 'Dias Transcurridos',
        dataIndex: 'n_diastranscurridos'
    },{
        title: 'Mnt. Interes Diario',
        dataIndex: 'n_montointeresesdiario'
    },{
        title: 'Mnt. Interes a Cancelar',
        dataIndex: 'n_montointeresescancelar'
    },{
        title: 'Mnt. Prestamo a Cancelar',
        dataIndex: 'n_montoprestamocancelar'
    },{
        title: 'Mnt.. Comisión',
        dataIndex: 'n_montocomisioncancelar'
    },{
        title: 'Mnt. Total Cancelar',
        dataIndex: 'n_montototalcancelar'
    },{
        title: 'Observaciones',
        dataIndex: 'c_observacionescancelar'
    },{
        title: 'Estado',
        dataIndex: 'c_estado'
    },{
        title: 'U. Registro',
        dataIndex: 'c_usuarioregistro'
    },{
        title: 'F, Registro',
        dataIndex: 'd_fecharegistro'
    },{
        title: 'U. Usuario',
        dataIndex: 'c_ultimousuario'
    },{
        title: 'U. Fecha Modificación',
        dataIndex: 'd_ultimafechamodificacion'
    }
]

const FormCancelaciones = (props) => {
    //Estados
    const [tableCancelaciones, setTableCancelaciones] = useState([]);
    const [openCancellationModal, setOpenCancellationModal] = useState(false);

    const handleAddCancelacion = () => {
        //Abrimos el modal
        setOpenCancellationModal(true);
    }

    const handleDeleteCancelacion = () => {

    }

    //Atributos de la tabla
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          setElementSelected(selectedRowKeys);
        }
    };

    return (
        <>
            <HeaderForm title="Cancelar"/>
            <div className="row col-12">
                <div className="col">
                    <Space style={{ marginBottom: 16 }}>
                        <Button onClick={handleAddCancelacion}>CANCELAR</Button>
                        <Button onClick={handleDeleteCancelacion}>ANULAR CANCELACIÓN</Button>
                    </Space>
                </div>
            </div>
            <div className="row mx-2 mb-2" style={{ overflow: 'scroll' }}>
                <Table
                    rowSelection={{
                        type: "radio",
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={tableCancelaciones}
                    pagination={{ pageSize: 50 }}
                />
            </div>
            <CancellationModal
                isOpen={openCancellationModal}
                onClose={()=>setOpenCancellationModal(false)}
            />
        </>
    )
}

export default FormCancelaciones