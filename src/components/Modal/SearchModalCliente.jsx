import React, { useEffect, useState } from 'react'
import Modal from './ModalNotification'
import SearcherComponent from '../SearcherComponent/SearcherComponent'
import Table from '../Table/Table'
import Spinner from '../Spinner/Spinner'
import { getClienteDinamico } from '../../Api/Api';

const SearchModalCliente = (props) => {
    const {isOpen, onClose, setClienteObtained, compania} = props;
    const [nameCliente, setNameCliente] = useState("");
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const tableColumnsCliente = [
        {name:'n_cliente', label: 'N° Cliente', sortVar:0},
        {name:'c_nombrescompleto', label: 'Nombre del cliente', sortVar:0},
        {name:'actions', label: 'Acciones', sortVar:0}
    ]

    const handleSearchCliente = async () => {
        if(nameCliente.length >= 1) {
            await setIsLoading(true)
            const response = await getClienteDinamico({c_nombrescompleto: nameCliente, c_compania:compania});
            if(response && response.status === 200 && response.body) getClientesToTable(response.body.data);
            setIsLoading(false);
        }
    }

    const handleSelectCliente = async (item) => {
        await setClienteObtained(item);
        onClose();
    }

    const getClientesToTable = (clientes) => {
        const listClientesTable = clientes.map((item) => {
            let aux = {};
            aux.n_cliente = item.n_cliente;
            aux.c_nombrescompleto = item.c_nombrescompleto;
            aux.actions = <div className="row" style={{justifyContent: 'space-evenly'}}>
                <button type="button" onClick={() => handleSelectCliente(item)} className="btn btn-info"><i className="bi bi-check"></i></button>
            </div>
            return aux;
        })
        setTableData(listClientesTable);
    }

    useEffect(() => {
        setTableData([]);
    }, [])

    return (
        <Modal isOpen={isOpen} title="Buscador de cliente" onClose={onClose} modal_class="Modal__container__search">
            {/*body*/}
            <div className="modal-body">
                <SearcherComponent
                    label="Cliente"
                    stateName={nameCliente}
                    setStateName ={setNameCliente}
                    type="text"
                    placeholder="Cliente"
                    inputId="clienteNameModalId"
                    classForm="col-12"
                    autoComplete="seacher-cliente"
                    onHandleClick={handleSearchCliente}
                    labelSpace={2}
                    marginForm="ml-0 mr-0"
                >
                    { nameCliente.length < 1 && <div className="invalid__message__data">
                        La longitud debe ser mayor a 1
                    </div> }
                </SearcherComponent>
                <div className="col-12 mb-3 text-center">
                    { isLoading ? <Spinner/> :
                    <Table
                        columns={tableColumnsCliente}
                        data={tableData}
                        showHeadTable={false}
                        showSelectDataPerPage={false}
                    />}
                </div>
            </div>
        </Modal>
    )
}

export default SearchModalCliente
