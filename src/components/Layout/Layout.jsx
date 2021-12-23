import React, { useState } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import useWindowsDimensions from '../../hooks/useWindowDimension'
import './Layout.css'

const Layout = (props) => {
    const [ isVisible, setIsVisible ] = useState(false);
    const showSidebar = () => setIsVisible(!isVisible);
    const { height, width } = useWindowsDimensions();

    const containerClass = () => {
        if(width <= 480) {
            return "c-wrapper-mobile";
        } else {
            return !isVisible ? "c-wrapper-nav-collapse" : "c-wrapper-nav-no-collapse";
        }
    }

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
