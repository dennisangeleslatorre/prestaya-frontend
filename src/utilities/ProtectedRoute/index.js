import React, { useContext, useEffect } from 'react'
import { Route, Redirect } from 'react-router'
import UserContext from '../../context/UserContext/UserContext'
import Layout from '../../components/Layout/Layout'

const ProtectedRoute = ({...params}) => {
    const { getUserAuth } = useContext(UserContext);
    const isAuth = getUserAuth();

    useEffect(() => {
        console.log('isAuth', isAuth);
    })

    return (
        <>
            <Layout>
                { isAuth ? <Route {...params}/> : <Redirect to={"/signIn"}/> }
            </Layout>
        </>
    )
}

export default ProtectedRoute
