import React, { useState, useContext, useEffect } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import useWindowsDimensions from '../../hooks/useWindowDimension'
import './Layout.css'
import { useIdleTimer } from "react-idle-timer";
import UserContext from '../../context/UserContext/UserContext'
import { useHistory } from 'react-router'
import { getParametroSession } from '../../Api/Api';

const Layout = (props) => {
    const [ isVisible, setIsVisible ] = useState(true);
    const showSidebar = () => setIsVisible(!isVisible);
    const { height, width } = useWindowsDimensions();
    //Context
    const { sessionTime, logout, setSessionTime } = useContext(UserContext);
    let history = useHistory();
    //Logica para cerrar sesion
    const goToSignIn = () => { history.push('/signIn') };
    const handleIdle = () => {
        logout( () => goToSignIn() )
    }

    const { getLastActiveTime } = useIdleTimer({
        timeout:sessionTime,
        onIdle: handleIdle
    });

    const containerClass = () => {
        if(width <= 480) {
            return "c-wrapper-mobile";
        } else {
            return !isVisible ? "c-wrapper-nav-collapse" : "c-wrapper-nav-no-collapse";
        }
    }

    useEffect( async () => {
        const responseParametro = await getParametroSession();
        if( responseParametro && responseParametro.status === 200 ) {
            setSessionTime(1000 * 60 * Number(responseParametro.body.data.n_valornumero > 0 ? responseParametro.body.data.n_valornumero : 525600));
        }
    }, [])

    return (
        <div className="container-fluid container-layout">
            <div className="row">
                {/*Este es el sidebar*/}
                <div className="nav-container">
                    <Sidebar showSidebar={showSidebar} isCollapse={!isVisible} toggled={isVisible}/>
                </div>
                {/*Las siguientes clases funcionan cuando hay collapse*/}
                <div className={containerClass()}>
                    <div className="row main-header-container">
                        <div className="col pl-0 pr-0">
                            {/*Aqui va el header*/}
                            <Header width={width} showSidebar={showSidebar} isVisible={isVisible}/>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col pt-3 main-container">
                                {props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout
