import moment from 'moment'

const addDaysToDate = (date, addDays) => {
    const inputDate = moment(date);
    const nuevaFecha = moment(inputDate).add(Number(addDays), "day").format('yyyy-MM-DD');
    return nuevaFecha;
}

export {
    addDaysToDate
}
