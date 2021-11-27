import React, { useContext } from 'react'
//Componentes
import { ProSidebar, SidebarHeader, SidebarContent, SidebarFooter, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { Link } from 'react-router-dom'
import Logo from '../../assets/images/logo192.png'
import { useHistory } from 'react-router'
//Context
import PagesContext from '../../context/PagesContext/PagesContext'
import UserContext from '../../context/UserContext/UserContext'
//Estilos
import 'react-pro-sidebar/dist/css/styles.css'
import './Sidebar.css'

const systemModules = {
    salesModule: ['CATEGORIAS', 'FAMILIAS', 'GRUPOS', 'MATERIALES'],
    logisticsModule: [],
    customerServiceModule: [],
    systemModule: ['USUARIOS', 'ROLES']
}

const Sidebar = ({isCollapse, showSidebar, toggled}) => {
    //Contxtos
    const { pages, changePage } = useContext(PagesContext);
    let { logout } = useContext(UserContext);
    let history = useHistory();
    //Paginas por modulo
    const salesPages = pages.filter((item) => systemModules['salesModule'].includes(item.name));
    const logisticPages = pages.filter((item) => systemModules['logisticsModule'].includes(item.name));
    const customerServicePages = pages.filter((item) => systemModules['customerServiceModule'].includes(item.name));
    const systemPages = pages.filter((item) => systemModules['systemModule'].includes(item.name));

    //Logica para cerrar sesion
    const goToSignIn = () => { console.log('entro');  history.push('/signIn') };
    const handleLogout = () => { logout( () => goToSignIn() ) };

    return (
        <div id="sidebar">
            <ProSidebar collapsed={isCollapse} breakPoint="xs" toggled={toggled}>
                <SidebarHeader>
                    <div className="container-logo">
                    {/* small and big change using menucollapse state */}
                    {isCollapse ? <img src={Logo} className="mini-brand"/> : <img src={Logo} className="brand"/>}
                    </div>
                    {isCollapse ? (
                            <div className="close-mini-menu" onClick={showSidebar}>
                                <i className="bi bi-arrow-right-circle"></i>
                            </div>
                        ) : (
                            <div className="close-menu" onClick={showSidebar}>
                                <i className="bi bi-arrow-left-circle"></i>
                            </div>
                    )}
                </SidebarHeader>
                <SidebarContent>
                    <Menu iconShape="square">
                        {pages.find((item)=> item.name === 'PERFIL') && <MenuItem onClick={() => changePage('PERFIL')} icon={<i className="bi bi-person-fill"></i>}>Perfil<Link to="/profile" /></MenuItem>}
                        {salesPages.length !== 0 && (
                            <SubMenu
                            icon={<i className="bi bi-receipt"></i>}
                            title="Ventas"
                            >
                                {salesPages.map((page) => (
                                    <MenuItem key={page.name} onClick={() => changePage(page.name)}> {page.name} <Link to={page.path} /> </MenuItem>
                                ))}
                            </SubMenu>
                        )}
                        {logisticPages.length !== 0 && (
                            <SubMenu
                            icon={<i className="bi bi-box"></i>}
                            title="Logística"
                            >
                                {logisticPages.map((page) => (
                                    <MenuItem key={page.name} onClick={() => changePage(page.name)}> {page.name} <Link to={page.path} /> </MenuItem>
                                ))}
                            </SubMenu>
                        )}
                        {customerServicePages.length !== 0 && (
                            <SubMenu
                            icon={<i className="bi bi-telephone-fill"></i>}
                            title="Servicio al Cliente"
                            >
                                {customerServicePages.map((page) => (
                                    <MenuItem key={page.name} onClick={() => changePage(page.name)}> {page.name} <Link to={page.path} /> </MenuItem>
                                ))}
                            </SubMenu>
                        )}
                        {systemPages.length !== 0 && (
                            <SubMenu
                            icon={<i className="bi bi-receipt"></i>}
                            title="Sistema"
                            >
                                {systemPages.map((page) => (
                                    <MenuItem key={page.name} onClick={() => changePage(page.name)}> {page.name} <Link to={page.path} /> </MenuItem>
                                ))}
                            </SubMenu>
                        )}

                    </Menu>
                </SidebarContent>
                <SidebarFooter>
                    <Menu iconShape="square">
                        <MenuItem onClick={ () => handleLogout()} icon={<i className="bi-door-open" />}>Cerrar sesión</MenuItem>
                    </Menu>
                </SidebarFooter>
            </ProSidebar>
        </div>
    )
}

export default Sidebar
