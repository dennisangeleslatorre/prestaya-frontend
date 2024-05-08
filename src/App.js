import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
//Componentes
import ProtectedRoute from './utilities/ProtectedRoute'
//Context
import PagesContext from './context/PagesContext/PagesContext'
import UserContext from './context/UserContext/UserContext'
import FiltersContext from './context/FiltersContext/FiltersContext'
import CajaContext from './context/CajaContext/CajaContext'
import CajaTiendaContext from './context/CajaTiendaContext/CajaTiendaContext'
//Hooks
import useInitialStatePages from './hooks/useInitialStatePages'
import useUserSession from './hooks/useUserSession'
import useFilters from './hooks/useFilters'
import useCaja from './hooks/useCaja'
import useCajaTienda from './hooks/useCajaTienda'
//Paginas
import Login from './containers/Login/Login'
import NotFound from './containers/NotFound'


const App = () => {
    //Hooks
    const pagesInitialState = useInitialStatePages();
    const userInitialState = useUserSession();
    const filters = useFilters();
    const cajaInitialState = useCaja();
    const cajaTiendaInitialState = useCajaTienda();
    //Establecer paginas
    const [ pages, setPages ] = useState(pagesInitialState.pages);
    //Obtner paginas por usuario
    const keysPagesForUser = pagesInitialState.getPagesKeysForUser();

    //Funcion para cambiar la pagina
    const handleChangePageSignIn = (pagesArray) => { setPages(pagesArray); }

    useEffect(() => {
        if(keysPagesForUser){
            setPages(pagesInitialState.setPagesForUser(keysPagesForUser));
        }
    }, [])

    return (
    <UserContext.Provider value={userInitialState}>
        <PagesContext.Provider value={pagesInitialState}>
            <FiltersContext.Provider value={filters}>
                <CajaContext.Provider value={cajaInitialState}>
                    <CajaTiendaContext.Provider value={cajaTiendaInitialState}>
                        <BrowserRouter>
                            <Switch>
                                <Route exact path='/signIn' render={ (props) => <Login {...props} changePages={handleChangePageSignIn}/>} />
                                {
                                    pages.map((page) => (
                                        <ProtectedRoute key={page.name} path={page.path} exact={page.exact} component={page.component} />
                                    ))
                                }
                                <Route exact path='/404' component={NotFound} />
                                <Redirect from='*' to='/404' />
                            </Switch>
                        </BrowserRouter>
                    </CajaTiendaContext.Provider>
                </CajaContext.Provider>
            </FiltersContext.Provider>
        </PagesContext.Provider>
    </UserContext.Provider>
    )
}

export default App
