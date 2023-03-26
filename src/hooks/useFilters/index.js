import React, { useState } from 'react'

const useFilters = () => {
    const setParamsForFilterPrestamo = value => {
        window.localStorage.setItem('paramsPrestamo', JSON.stringify(value));
    }

    const setParamsForFilterCliente = value => {
        window.localStorage.setItem('paramsCliente', JSON.stringify(value));
    }

    const setParamsForFilterFlujoCaja = value => {
        window.localStorage.setItem('paramsFlujoCaja', JSON.stringify(value));
    }

    const setParamsForFilterProducto = value => {
        window.localStorage.setItem('paramsProducto', JSON.stringify(value));
    }

    const setParamsForFilterTransaccion = value => {
        window.localStorage.setItem('paramsTransaccion', JSON.stringify(value));
    }

    const getParamsForFilterPrestamo = () => {
        let filters = window.localStorage.getItem('paramsPrestamo');
        filters = JSON.parse(filters);
        return filters ;
    };

    const getParamsForFilterCliente = () => {
        let filters = window.localStorage.getItem('paramsCliente');
        filters = JSON.parse(filters);
        return filters ;
    };

    const getParamsForFilterFlujoCaja = () => {
        let filters = window.localStorage.getItem('paramsFlujoCaja');
        filters = JSON.parse(filters);
        return filters ;
    };

    const getParamsForFilterProducto = () => {
        let filters = window.localStorage.getItem('paramsProducto');
        filters = JSON.parse(filters);
        return filters ;
    };

    const getParamsForFilterTransaccion = () => {
        let filters = window.localStorage.getItem('paramsTransaccion');
        filters = JSON.parse(filters);
        return filters ;
    };

    return {
        setParamsForFilterPrestamo,
        setParamsForFilterCliente,
        setParamsForFilterFlujoCaja,
        setParamsForFilterProducto,
        setParamsForFilterTransaccion,
        getParamsForFilterPrestamo,
        getParamsForFilterCliente,
        getParamsForFilterFlujoCaja,
        getParamsForFilterProducto,
        getParamsForFilterTransaccion
    }
}

export default useFilters;