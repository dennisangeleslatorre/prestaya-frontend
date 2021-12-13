import React from 'react';

import './Pagination.css';

//Rango de las paginas que se muestran
const range = (num1, num2) => {
    let min = Math.min(num1, num2);
    let max = Math.max(num1, num2);
    let range = Array.from({length: max - min + 1}, (v, i) => i + min);
    return range;
}

const Pagination = (props) => {

    //Total de los items de la lista
    const totalItems = props.totalItems ? props.totalItems : 0;
    //Limite por pagina
    const pageLimit = props.pageLimit ? props.pageLimit : 10;
    //Numero de paginas
    const totalPages = Math.ceil(totalItems/pageLimit);
    //Pagina actual
    const currentPage = props.currentPage;

    //Funciones
    //Funcion ir a la pagina que recibe como parametro una pagina y usa la propiedad onPageChanged
    const goToPage = (page) => {
        //Se trae la funcion de las propiedades
        const { handleChangePage } = props;
        //Se actualiza la pagina actual
        handleChangePage(page);
    }
    //Al hacer click en una pagina
    const handleClick = page => e => {
        e.preventDefault();
        goToPage(page);
    }
    //Al hacer click en la flecha izquierda
    const handleMoveLeft = e => {
        e.preventDefault();
        //Se crea una constante para saber si se puede cambiar de pagina
        const newCurrentPage = currentPage - 1 > 0 ?  currentPage - 1 : 1;
        goToPage(newCurrentPage);
    }
    //Al hacer click en la flecha derecha
    const handleMoveRight = e => {
        e.preventDefault();
        //Se crea una constante para saber si se puede cambiar de pagina
        const newCurrentPage = currentPage + 1 <= totalPages  ?  currentPage + 1 : currentPage;
        goToPage(newCurrentPage);
    }

    //Se crean las paginas
    const pages = range(1, totalPages);

    //Si no hay items se regresa null
    if( totalItems === 0 ) return null;

    return (
        <div className="row">
            <div className="dataTables_paginate paging_simple_numbers">
                <ul className="paginate-links dataTable pagination">
                    {/*Pasar a anterior*/}
                    <li className={`left-arrow page-item"`}>
                        <a className="page-link" onClick={(e) => handleMoveLeft(e)}>Anterior</a>
                    </li>
                    {/*número de las páginas*/}
                    {pages.map((page, index) => {
                        return (
                            <li key={index} className={`number active page-item`}>
                                <a className={`page-link ${page===currentPage ? "current-page": "no-current-page"}`} onClick={handleClick(page)}> { page } </a>
                            </li>
                        )
                    })}
                    {/*Pasar a siguiente*/}
                    <li className={`left-arrow page-item"`}>
                        <a className="page-link" onClick={(e) => handleMoveRight(e)}>Siguiente</a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Pagination
