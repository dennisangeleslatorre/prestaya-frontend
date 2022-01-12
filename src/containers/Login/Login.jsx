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
import './LoginStyles.css';
//Servicio
import { signIn } from '../../Api/Api';

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
    const { getUserAuth, login, setUserData, setUserToken } = useContext(UserContext);
    //Objetos
    const isAuth = getUserAuth();
    let history = useHistory();
    const { changePages } = props;
    const goToProfile = () => { history.push('/home') } ;

    const handleSetData = (keys, user) => {
        login(() => {
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
        //Se valida
        if( validate() ) {
            let user = {
                c_codigousuario: username.value,
                c_clave: password.value
            }
            const response = await signIn(user);
            const body = response.body;
            if( response.status === 200 && !body.success ) {
                setIsAlert(true);
                setErrorMessage(body.message);
            } else {
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
            handleSetData(user.a_paginas, user);
        }
    }, [user])

    return (
        isAuth ? <Redirect to='/home' /> : <>
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
