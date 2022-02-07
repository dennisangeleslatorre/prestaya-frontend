const formatPeriodo = (str) => {
    let periodoFormato = '';
    Array.from(str).map((item, index) => {
        periodoFormato += (index===4) ? `-${item}` : item;
    })
    return periodoFormato;
}

export {
    formatPeriodo
}