import React, { useEffect, useState } from 'react'
import Modal from '../Modal/ModalNotification'
import Table from '../Table/Table'
import Spinner from '../Spinner/Spinner'
import { getProductoStockDinamico } from '../../Api/Api';
import moment from 'moment';

const StockProductModal = (props) => {

    const {isOpen, onClose, compania, agencia, codigoProducto} = props;
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const tableColumnsProducto = [
        {name:'c_compania_desc', label: 'Compañía', sortVar:0},
        {name:'c_agencia_desc', label: 'Agencia', sortVar:0},
        {name:'n_cantidad', label: 'Cantidad', sortVar:0},
        {name:'c_usuarioregistro', label: 'U. Registro', sortVar:0},
        {name:'d_fecharegistro', label: 'F. Registro', sortVar:0},
        {name:'c_ultimousuario', label: 'U. Modificación', sortVar:0},
        {name:'d_ultimafechamodificacion', label: 'F. Modificación', sortVar:0}
    ]

    const getStocks = async () => {
        await setIsLoading(true);
        const response = await getProductoStockDinamico({c_compania:compania,c_agencia:agencia,c_item:codigoProducto});
        if(response && response.status === 200 && response.body && response.body.data) await getStocksToTable(response.body.data);
        setIsLoading(false);
    }

    const getStocksToTable = (stocks) => {
        const listStocksTable = stocks.map((item) => {
            let aux = item;
            aux.n_cantidad = Number(item.n_cantidad).toFixed(0);
            aux.d_fecharegistro = item.d_fecharegistro ? moment(item.d_fecharegistro).format('DD/MM/yyyy HH:mm:ss') : '';
            aux.d_ultimafechamodificacion = item.d_ultimafechamodificacion ? moment(item.d_ultimafechamodificacion).format('DD/MM/yyyy HH:mm:ss') : '';
            return aux;
        })
        setTableData(listStocksTable);
    }

    useEffect(() => {
        if(codigoProducto) getStocks();
    }, [codigoProducto])

    return (
        <Modal isOpen={isOpen} title={`Stock producto: ${codigoProducto}`} onClose={onClose} modal_class="Modal__container__form">
            {/*body*/}
            <div className="modal-body">
                <div className="col-12 mb-3 text-center">
                    { isLoading ? <Spinner/> :
                    <Table
                        columns={tableColumnsProducto}
                        data={tableData}
                        showHeadTable={false}
                        showSelectDataPerPage={false}
                    />}
                </div>
            </div>
        </Modal>
    )
}

export default StockProductModal