import React, { useEffect, useState } from 'react'
import Modal from './ModalNotification'
import SearcherComponent from '../SearcherComponent/SearcherComponent'
import Table from '../Table/Table'
import Spinner from '../Spinner/Spinner'
import { getProductoDinamico } from '../../Api/Api';
import { Radio } from 'antd';

const SearchModalProducto = () => {
    const {isOpen, onClose, setProductoObtained, compania} = props;
    const [opcion, setOpcion] = useState("nombre");
    const [filterCliente, setFilterCliente] = useState("");
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
  return (
    <div>SearchModalProducto</div>
  )
}

export default SearchModalProducto