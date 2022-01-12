import React, { useContext, useEffect, useState } from 'react'
//Context
import UserContext from '../../context/UserContext/UserContext'
//Img
import Logo from '../../assets/images/logo_login.png'
//Estilo
import './Home.css'

const Profile = () => {
    //Contextos
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData();

    return (
        <>
             <div className="continer-fluid pt-2 pb-2 pl-2 pr-2" style={{ background: '#FFFFFF' }}>
                <div className="row d-flex justify-content-center">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className='col-12'>
                                        <img src={Logo} className="img__logo__home" />
                                    </div>
                                    <div className='col-12'>
                                        <h2 className='text-center'>{`¡Bienvenido ${userLogedIn.c_nombres}!`}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile