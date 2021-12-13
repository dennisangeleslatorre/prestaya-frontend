import React, { useContext, useEffect } from 'react'
import PagesContext from '../../context/PagesContext/PagesContext'
import { useLocation } from 'react-router'
import './HeaderStyles.css'

const Header = ( props ) => {
    let { currentPage, title } = useContext(PagesContext);
    //Titulo de la pagina
    let location = useLocation();

    useEffect(() => {
        currentPage(location.pathname.split('/')[1])
    }, []);

    return(
        <div className="container-fluid pr-0">
            <div className="row header-container">
                { props.width < 690 &&
                <div className="col-2">
                    <a className="menu-bars">
                        <i className={ props.isVisible ? 'bi bi-arrow-left-circle' : 'bi bi-arrow-right-circle' } onClick={props.showSidebar} />
                    </a>
                </div> }
                <div className="col-10 col-sm-10 col-md-12 col-lg-12 header-title">
                    <p className="h3 ">{title}</p>
                </div>
            </div>
        </div>
    )
}

export default Header;