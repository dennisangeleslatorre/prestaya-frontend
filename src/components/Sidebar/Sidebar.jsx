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
    commercialModule: ['CLIENTES', 'PRÉSTAMOS'],
    masterModule: [ 'TIPOS DE PRODUCTO', 'TIPOS DE DOCUMENTO', 'UNIDADES DE MEDIDA', 'AGENCIAS', 'PARÁMETROS', 'PAÍSES',
                    'DEPARTAMENTOS', 'PROVINCIAS', 'DISTRITOS', 'COMPAÑÍAS', 'PERÍODOS' ],
    systemModule: ['USUARIOS', 'PERFILES']
}

const Sidebar = ({isCollapse, showSidebar, toggled}) => {
    //Contxtos
    const { pages, changePage } = useContext(PagesContext);
    let { logout } = useContext(UserContext);
    let history = useHistory();
    //Paginas por modulo
    const commercialPages = pages.filter((item) => systemModules['commercialModule'].includes(item.name));
    const masterPages = pages.filter((item) => systemModules['masterModule'].includes(item.name));
    const systemPages = pages.filter((item) => systemModules['systemModule'].includes(item.name));

    //Logica para cerrar sesion
    const goToSignIn = () => { history.push('/signIn') };
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
                        {pages.find((item)=> item.name === 'MI PERFIL') && <MenuItem onClick={() => changePage('MI PERFIL')} icon={<i className="bi bi-person-fill"></i>}>MI PERFIL<Link to="/miPerfil" /></MenuItem>}
                        {commercialPages.length !== 0 && (
                            <SubMenu
                            icon={<i className="bi bi-wallet-fill"></i>}
                            title="Comercial"
                            >
                                {commercialPages.map((page) => (
                                    <MenuItem key={page.name} onClick={() => changePage(page.name)}> {page.name} <Link to={page.path} /> </MenuItem>
                                ))}
                            </SubMenu>
                        )}
                        {masterPages.length !== 0 && (
                            <SubMenu
                            icon={<i className="bi bi-gear-fill"></i>}
                            title="Maestros"
                            >
                                {masterPages.map((page) => (
                                    <MenuItem key={page.name} onClick={() => changePage(page.name)}> {page.name} <Link to={page.path} /> </MenuItem>
                                ))}
                            </SubMenu>
                        )}
                        {systemPages.length !== 0 && (
                            <SubMenu
                            icon={<i className="bi bi-shield-shaded"></i>}
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
