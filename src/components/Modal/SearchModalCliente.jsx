import React, { useEffect, useState } from 'react'
import Modal from './ModalNotification'
import SearcherComponent from '../SearcherComponent/SearcherComponent'
import Table from '../Table/Table'
import Spinner from '../Spinner/Spinner'
import { getClienteDinamico } from '../../Api/Api';
import { Radio } from 'antd';

const SearchModalCliente = (props) => {
    const {isOpen, onClose, setClienteObtained, compania} = props;
    const [opcion, setOpcion] = useState("nombre");
    const [filterCliente, setFilterCliente] = useState("");
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const tableColumnsCliente = [
        {name:'n_cliente', label: 'N° Cliente', sortVar:0},
        {name:'c_tipodocumento', label: 'Tipo', sortVar:0},
        {name:'c_numerodocumento', label: 'N° documento', sortVar:0},
        {name:'c_nombrescompleto', label: 'Nombre del cliente', sortVar:0},
        {name:'actions', label: 'Acciones', sortVar:0}
    ]

    const handleSearchCliente = async () => {
        if(filterCliente.length >= 1) {
            await setIsLoading(true);
            let data = {c_compania:compania};
            (opcion === 'nombre') ? data.c_nombrescompleto = filterCliente : data.c_numerodocumento = filterCliente ;
            const response = await getClienteDinamico(data);
            if(response && response.status === 200 && response.body) getClientesToTable(response.body.data);
            setIsLoading(false);
        }
    }

    const handleSelectCliente = async (item) => {
        await setClienteObtained(item);
        setFilterCliente("")
        setTableData([]);
        onClose();
    }

    const getClientesToTable = (clientes) => {
        const listClientesTable = clientes.map((item) => {
            let aux = {};
            aux.n_cliente = item.n_cliente;
            aux.c_tipodocumento = item.c_tipodocumento;
            aux.c_numerodocumento = item.c_numerodocumento;
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
                <Radio.Group className='ml-4' onChange={e => setOpcion(e.target.value)} value={opcion}>
                    <Radio value="nombre">Nombre</Radio>
                    <Radio value="doc">N° doc</Radio>
                </Radio.Group>
                <SearcherComponent
                    stateName={filterCliente}
                    setStateName ={setFilterCliente}
                    type="text"
                    placeholder="Cliente"
                    inputId="clienteNameModalId"
                    classForm="col-12"
                    autoComplete="seacher-cliente"
                    onHandleClick={handleSearchCliente}
                    labelSpace={2}
                    marginForm="ml-0 mr-0"
                >
                    { filterCliente.length < 1 && <div className="invalid__message__data">
                        La longitud debe ser mayor a 0
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
