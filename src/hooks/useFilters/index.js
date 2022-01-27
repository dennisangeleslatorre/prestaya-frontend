import React, { useState } from 'react'

const useFilters = () => {
    const setParamsForFilterPrestamo = value => {
        window.localStorage.setItem('paramsPrestamo', JSON.stringify(value));
    }

    const setParamsForFilterCliente = value => {
        window.localStorage.setItem('paramsCliente', JSON.stringify(value));
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

    return {
        setParamsForFilterPrestamo,
        setParamsForFilterCliente,
        getParamsForFilterPrestamo,
        getParamsForFilterCliente
    }
}

export default useFilters;