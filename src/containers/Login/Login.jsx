import React, { useContext, useEffect, useState } from 'react'
import { Redirect, useHistory } from "react-router-dom"
//Components
import InputComponent from '../../components/InputComponent/InputComponent'
import Alert from '../../components/Alert/Alert'
import Loading from '../../components/Modal/LoadingModal'
//Context
import PagesContext from '../../context/PagesContext/PagesContext'
import UserContext from '../../context/UserContext/UserContext'
//Assets
import Logo from '../../assets/images/logo_login.png'
import './LoginStyles.css'
//Servicio
import { signIn, getReportesByPerfil } from '../../Api/Api'
import { getSessionDataToLogin } from '../../utilities/Functions/getSessionDataToLogin'

const Login = (props) => {
    //Estados
    const [username, setUsername] = useState({value:"", isValid: null});
    const [password, setPassword] = useState({value:"", isValid: null});
    const [ isLoading, setIsLoading ] = useState(false);
    const [isAlert, setIsAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [user, setUser] = useState(null);
    //Context
    const { setPagesForUser, pages } = useContext(PagesContext);
    const { getUserAuth, login, setUserData, setUserToken, setReportesUsuarios } = useContext(UserContext);
    //Objetos
    const isAuth = getUserAuth();
    let history = useHistory();
    const { changePages } = props;
    const goToProfile = () => { history.push('/inicio') } ;

    const handleSetData = (keys, user) => {
        login(() => {
            window.location.reload(true);
            goToProfile();
            //Seteo las paginas con las llaves que tengo
            setPagesForUser(keys);
            //Esto es para saber que paginas voy a recorrer para la rutas prtegidas
            changePages(pages);
            //Guarda el usuario en el cache
            setUserData(user);
        })
    }

    const validate = () => {
        return ( username.value === "" || password.value === "" ) ? false : true;
    }

    const authentication = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const audit_description = await getSessionDataToLogin();
        //Se valida
        if( validate() ) {
            let user = {
                c_codigousuario: username.value,
                c_clave: password.value,
                c_descripcion_login: audit_description
            }
            const response = await signIn(user);
            const body = response.body;
            if( response.status === 200 && !body.success ) {
                setIsAlert(true);
                setErrorMessage(body.message);
            } else {
                const response2 = await getReportesByPerfil({n_perfil: body.data.n_perfil});
                let reportes = [];
                if( response2 && response2.status === 200 ) {
                    response2.body.data.forEach(item => {
                        if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 2 && item.n_reporte === 1) reportes.push('REPORTE RESUMIDO');
                        if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 2 && item.n_reporte === 2) reportes.push('REPORTE DETALLADO');
                        if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 2 && item.n_reporte === 3) reportes.push('REPORTE PRESTAMOS VENCIDOS Y NO VENCIDOS');
                        if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 2 && item.n_reporte === 4) reportes.push('REPORTE TRANSACCIONES TIENDA');
                        if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 2 && item.n_reporte === 5) reportes.push('REPORTE PRESTAMO DETALLADO POR FECHA CANCELACION');
                        if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 2 && item.n_reporte === 6) reportes.push('REPORTE UBICACIONES DE PRESTAMOS');
                        if(item.c_tiporeporte === 'CO000001' && item.n_grupo === 3 && item.n_reporte === 1) reportes.push('REPORTE FLUJO DE CAJA USUARIOS');
                    });
                    if(response2.body.data.length > 0) {
                        reportes.push('REPORTES');
                        setReportesUsuarios(response2.body.data);
                    } else setReportesUsuarios([]);
                } else setReportesUsuarios([]);
                body.data.reportes = reportes;
                setUser(body.data);
                setUserToken(body.token);
                setIsAlert(false);
            }
        } else {
            setIsAlert(true);
            setErrorMessage("Usuario y/o contraseña vacíos.");
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if(user) {
            if(user.a_paginas.includes("NUEVO FLUJO CAJA USUARIOS")) {
                user.a_paginas.push("NUEVA CAJA CHICA USUARIO");
                user.a_paginas.push("NUEVA CAJA C. U. X DÍA MOVIMIENTOS");
            }
            if(user.a_paginas.includes("MODIFICAR FLUJO CAJA USUARIOS")) {
                user.a_paginas.push("MODIFICAR CAJA CHICA USUARIO");
                user.a_paginas.push("ELIMINAR CAJA CHICA USUARIO");
                user.a_paginas.push("MODIFICAR CAJA C. U. X DÍA MOVIMIENTOS");
                user.a_paginas.push("ELIMINAR CAJA C. U. X DÍA MOVIMIENTOS");
            }
            if(user.a_paginas.includes("NUEVO FLUJO CAJA TIENDA")) {
                user.a_paginas.push("NUEVA CAJA TIENDA");
                user.a_paginas.push("NUEVA CAJA TIENDA DIA MOVIMIENTO");
            }
            if(user.a_paginas.includes("MODIFICAR FLUJO CAJA TIENDA")) {
                user.a_paginas.push("MODIFICAR CAJA TIENDA");
                user.a_paginas.push("ELIMINAR CAJA TIENDA");
                user.a_paginas.push("MODIFICAR CAJA TIENDA DIA MOVIMIENTO");
                user.a_paginas.push("ELIMINAR CAJA TIENDA DIA MOVIMIENTO");
            }
            const keys = [...user.a_paginas, ...user.reportes];
            handleSetData(keys, user);
        }
    }, [user])

    return (
        isAuth ? <Redirect to='/inicio' /> : <>
            <div className="justify-content-center" >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 pt-auto">
                            <img src={Logo} className="login__brand" />
                        </div>
                        <div className="col-10 col-md-8 justify-content-center mt-2">
                            <hr  className="hr-nexxum"/>
                            <div>
                                <div className="form-group text-center">
                                    <label className="form__title">Iniciar Sesion</label>
                                </div>
                                <form action="" onSubmit={authentication}>
                                    <div className="form-group mt-3">
                                        <InputComponent
                                            state={username}
                                            setState={setUsername}
                                            type="text"
                                            placeholder="Usuario"
                                            inputId="userId"
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <InputComponent
                                            state={password}
                                            setState={setPassword}
                                            type="password"
                                            placeholder="Contraseña"
                                            inputId="passwordId"
                                            uppercaseOnly={false}
                                        />
                                    </div>
                                    <div className="form-group text-center mt-4">
                                        <button type="submit" className="btn btn-primary">Ingresar</button>
                                        <hr  className="hr-nexxum my-4"/>
                                    </div>
                                {/*Alerta*/}
                                { isAlert === true && <Alert
                                        title="Error iniciando sesión"
                                        type="alert-danger"
                                        mainMessage={errorMessage}
                                    /> }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            { isLoading === true && <Loading/> }
        </>
    )
}

export default Login
