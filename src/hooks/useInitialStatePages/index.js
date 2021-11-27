import React, { useState } from 'react'
import initalStatePages from '../../utilities/initalStatePages'

const useInitialState = () => {

    //Guardas en cache las paginas del usuario
    const setPagesKeysForUser = value => {
        window.localStorage.setItem('pagesKeysUser', JSON.stringify(value));
    };

    //Obtines las paginas del usuario del cache
    const getPagesKeysForUser = () => {
        let keys = window.localStorage.getItem('pagesKeysUser');
        keys = JSON.parse(keys);
        return keys ;
    };

    //Traes todas las paginas
    const { initialPages, allPages } = initalStatePages;
    //Estableces las paginas
    const [ pages, setPages ] = useState( getPagesKeysForUser ? allPages : initialPages);
    //Estableces el titulo
    const [ title, setTitle ] = useState("");

    //Se establece las paginas del usuario
    const setPagesForUser = keyArrayPages => {
        var auxArrayPages = [];
        allPages.map( (page) => {
            keyArrayPages.map( (key) => {
                if( page.name === key ){
                   auxArrayPages.push(page)
                }
            })
        })
        setPages(auxArrayPages);
        setPagesKeysForUser(keyArrayPages);
        return auxArrayPages;
    };

    //Cambiar pagina, esto se hace con el nombre
    const changePage = name => {
        var auxArrayPages = [...pages];
        //Buscamos la pagina que tenga el nombre
        let currentTitlePage = auxArrayPages.find((item) => item.name === name).name;
        setTitle(currentTitlePage);
    };

    //Pagina actual
    const currentPage = currentUrl => {
        let auxArrayPages = [...pages];
        //Buscamos la pagina que incluye el fragmento de la ruta
        let currentTitlePage = auxArrayPages.find((item) => item.path === currentUrl).name;
        setTitle(currentTitlePage);
    };

    return {
        setPagesKeysForUser,
        setPagesForUser,
        getPagesKeysForUser,
        changePage,
        currentPage,
        pages,
        title,
    };
};

export default useInitialState;