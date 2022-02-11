import { useState } from 'react'

const useUserSession = () => {

    const [sessionTime, setSessionTime] = useState(1000 * 60 * 15);

    //Al logearse
    const login = (callback, token) => {
        setUserAuth(true);
        callback();
    };

    const logout = callback => {
        window.localStorage.clear();
        callback();
    };

    //Guardala autoriazacion en la variable isSessionActive
    const setUserAuth = value => {
        window.localStorage.setItem('isSessionActive', JSON.stringify(value));
    };

    const setUserToken = token => {
        window.localStorage.setItem('userToken', JSON.stringify(token));
    };

    //Guarda el usuario en el local storage
    const setUserData = user => {
        window.localStorage.setItem('userData', JSON.stringify(user));
    };

    //Funcin para obtener el usuario
    const getUserData = () => {
        let user = window.localStorage.getItem('userData');
        user = JSON.parse(user);
        return user;
    };

    const getUserToken = async () => {
        let token = await window.localStorage.getItem('userToken');
        token = JSON.parse(token);
        return token;
    };

    const getUserAuth = () => {
        let isSessionActive = window.localStorage.getItem('isSessionActive');
        isSessionActive = JSON.parse(isSessionActive);
        return isSessionActive;
    };

    const setReportesUsuarios = value => {
        window.localStorage.setItem('reportesUsuario', JSON.stringify(value));
    }

    const getReportesUsuarios = () => {
        let reoprtes = window.localStorage.getItem('reportesUsuario');
        reoprtes = JSON.parse(reoprtes);
        return reoprtes ;
    };

    return {
        login,
        logout,
        getUserAuth,
        setUserData,
        getUserData,
        setUserToken,
        getUserToken,
        setReportesUsuarios,
        getReportesUsuarios,
        sessionTime,
        setSessionTime
    }
};

export default useUserSession;