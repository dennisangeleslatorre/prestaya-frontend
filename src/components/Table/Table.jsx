import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import SelectDataPerPage from './SelectDataPerPage';
import Pagination from './Pagination';

import './Table.css';

const Table = (props) => {
    //Se define una constante columns con el valor de la propiedad del mismo nombre
    const columns = props.columns;
    //Se define una constante items con el valor de la propiedad de datos
    const items = props.data;
    //Se define una constante que tenga el nombre de los campos por los que filtrar
    const fieldsFilter = props.fieldsFilter || [];
    //Declaraciones para el filtro
    //Variable que se usa para buscar
    const [query, setQuery] = useState("");
    //Se inicializa el filtro con la lista de los items
    const [filteredItems, setFilteredItems] = useState(items);
    //Variables para las paginas
    //Cantidad por pagina
    const [quantityPerPage, setQuantityPerPage] = useState(15);
    //useState para la pagina actual
    const [currentPage, setCurrentPage] = useState(1);
    //Datos de las paginas
    //Se usa el slice para que tenga por defecto los primeros datos del array
    const [currentItems, setCurrentItems] = useState(filteredItems.slice(0, quantityPerPage));
    //Constantes del boton
    const textButton = props.textButton || "Agregar";
    const buttonLink = props.buttonLink || "";
    //Mostrar cabecera
    const showHeadTable = props.showHeadTable === undefined ? true : props.showHeadTable;
    //Permiso del botón
    const registerPermission = props.registerPermission;
    //Refresh
    const refreshFunction = props.refreshFunction;

    //Funciones
    //Funcion para cambiar el query
    const handleChangeQuery = e => {
        const query = e.target.value;
        const result = items.filter( item => {
            var auxFilter = "";
            //Se recorre los campos de filtrado y se concatena su valor
            for( let field of fieldsFilter ) {
                auxFilter += `${item[field.name]} `
            }
            /*fieldsFilter.map((field) => {
                auxFilter += `${item[field.name]} `
            });*/
            //Se pregunta si el query esta dentro del valor resultante de los campos concatenados
            //Para la comparacion se mando los valores a minuscula
            const existVar = auxFilter.toLowerCase().includes(query.toLowerCase());
            if(existVar) {
                return item;
            }
            return null;
        });
        setFilteredItems(result);
        setQuery(query);
        setCurrentPage(1);
    }
    //Funcion que cambia la cantidad de items que se muestran en la lista por pagina, se envia en la accion onChange del SelectDataPerPage
    const handleChangeQuantityPerPage = e => {
        setCurrentPage(1);
        setQuantityPerPage(e.target.value);
    }
    //Funcion que llama al setCurrentPage para cambiar la pagina actual, esta funcion se envia en las propiedades del pagination para hacer el cambio de pagina
    const handleChangePage = (page) => {
        setCurrentPage(page);
    }
    //Funcion que ejecuta los cambios en los items actuales que se muestran
    const onPageChanged = () => {
        //Se clacula el offset para realizar el slice del array
        const offset = (currentPage - 1) * quantityPerPage;
        //Se obtine los items actuales
        const currentItems = filteredItems.slice(offset, offset + quantityPerPage);
        //Se establecen los items actuales
        setCurrentItems(currentItems);
    }

    //Mostrar boton de registrar
    const showRegisterButton = () => {
        if(!buttonLink) return null;
        //Permiso del boton
        if(!registerPermission) return null;
        return(
            <div className="col-12 col-md-6 section-buttons">
                <Link to={buttonLink} className="btn btn-success">
                    {textButton}
                </Link>
                { refreshFunction && <button onClick={refreshFunction} className="btn btn-info mr-2"><i className="bi bi-arrow-repeat"></i></button> }
            </div>
        )
    }
    //Mostrar el buscador
    const showSearcher = () => {
        if(fieldsFilter.length === 0) return null;
        return(
            <div className="col-md-12 col-lg-6">
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text"><i className="bi bi-search"></i></div>
                    </div>
                    <input type="text" className="form-control" value={ query }
                        placeholder="Buscar ..."
                        onChange={e => handleChangeQuery(e)}
                    />
                </div>
            </div>
        )
    }
    //Poner los ordenar
    const showSortAscendingAndDescending = (head) => {
        if(head.sortVar) {
           return (
                <span className="badge badge-dark ml-0">
                    <button onClick={ () => { handleSortAscendingDataTable(head.name) } } className="btn-table btn-outline-table">
                        <i className="bi bi-arrow-up"></i>
                    </button>
                    <button onClick={ () => { handleSortDescendingDataTable(head.name) } } className="btn-table btn-outline-table">
                        <i className="bi bi-arrow-down"></i>
                    </button>
                </span>
           )
        }
    }
    //Ordenar ascendente
    const handleSortAscendingDataTable = attr => {
        var array = [...filteredItems];
        array = array.sort(
            (a,b) => {
                if( a[attr] > b[attr] ) {
                    return 1;
                }
                else if ( a[attr] < b[attr] ) {
                    return -1;
                }
                return 0;
            }
        )
        setFilteredItems(array);
    }
    //Ordenar descendente
    const handleSortDescendingDataTable = attr => {
        var array = [...filteredItems];
        array = array.sort(
            (a,b) => {
                if( a[attr] > b[attr] ) {
                    return 1;
                }
                else if ( a[attr] < b[attr] ) {
                    return -1;
                }
                return 0;
            }
        ).reverse();
        setFilteredItems(array);
    }

    //Use effect
    useEffect(() => {
        onPageChanged()
        return () => null
    }, [filteredItems, quantityPerPage, currentPage])

    useEffect(() => {
        setFilteredItems(items);
    }, [items])

    return (
        <div className="card">
            {/*Titulo de la tabla*/}
            {showHeadTable === true ?
                <div className="card-header">
                    {/*Se usa la propiedad tableTitle*/}
                    <div className="row align-items-center">
                        {/*Filtro*/}
                        {showSearcher()}
                        {/*Boton para crear un cliente*/}
                        {showRegisterButton()}
                    </div>
                    <div className="clearfix"></div>
                </div>
             : null}
            <div className="card-body">
                {/*Se trae el componente de cantidad por pagina*/}
                <SelectDataPerPage onChange={handleChangeQuantityPerPage} quantityPerPage={quantityPerPage}/>
                {/*Tabla*/}
                <div className="row">
                    {/*Tabla responsive*/}
                    <div className="col table-responsive">
                        <table className="table b-table table-bordered b-table-fixed">
                            {/*Header de la tabla*/}
                            <thead className="thead-dark">
                                <tr className="table-header">
                                    {columns.map((head, index) => {
                                        return (
                                            <th key={index} scope="col">
                                                <span className="ml-0 text-center"> {head.label} </span>
                                                { showSortAscendingAndDescending(head) }
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            {/*Body de la tabla*/}
                            <tbody>
                                {currentItems.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            {columns.map((head, index2) => {
                                                return(
                                                    <td key={index + "-" + index2}>{item[head.name]}</td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination totalItems={filteredItems.length} pageLimit={quantityPerPage} handleChangePage={handleChangePage} currentPage={currentPage}/>
            </div>
        </div>
    )
}

export default Table;
