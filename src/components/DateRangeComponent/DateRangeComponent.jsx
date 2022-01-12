import React from 'react'
import { Checkbox } from 'antd';
import { useEffect } from 'react';

const MessageComponent = ({message, classComponent}) => (
    <div className={classComponent}>
        {message}
    </div>
)

const DateRangeComponent = (props) => {
    const { classForm="", marginForm="ml-3 mr-3", labelSpace=2, labelText=null, inputId="inputId", state, setState, enabled=true, setEnabled } = props;

    const onChange = (e) => {
        setEnabled(e.target.checked);
    }

    const validateRangeDate = () => {
        const fechaInicio = new Date(state.fechaInicio).getTime();
        const fechaFin    = new Date(state.fechaFin).getTime();
        const diff = fechaFin - fechaInicio;
        //const diffDias = diff/(1000*60*60*24);
        return diff;
    }

    const isValidFunction = (fechaInicio, fechaFin) => {
        if(!fechaInicio || !fechaFin || validateRangeDate() <= 0) return false
        else return true;
    }

    const handleChangeFechaInicio = (e) => {
        const isValid = isValidFunction(e.target.value, state.fechaFin);
        setState({...state, fechaInicio: e.target.value, isValid: isValid});
    }

    const handleChangeFechaFin = (e) => {
        const isValid = isValidFunction(state.fechaInicio, e.target.value);
        setState({...state, fechaFin: e.target.value, isValid: isValid});
    }

    const showMessage = () => {
        if( !state.fechaInicio || !state.fechaFin ) {
            return <MessageComponent message="Selecciona fecha de inicio y fin." classComponent={"invalid__message__data"} />
        } else {
            const diff = validateRangeDate();
            if(diff <= 0) {
                return <MessageComponent message="La fecha de fin debe ser mayor." classComponent={"invalid__message__data"} />
            }
        }
    }

    return (
        <div className={`form-group ${marginForm} ${classForm} row`}>
            { labelText && <label htmlFor={inputId} className={`col-md-${labelSpace} col-form-label label-input`}>
                { labelText } <Checkbox id={inputId} checked={enabled} onChange={onChange} />
            </label> }
            <div className={ labelText ? `col-12 col-md-${12-labelSpace}` : `col-md-${14-labelSpace}`}>
                <div className="input-group">
                    <input
                        onChange={handleChangeFechaInicio}
                        placeholder="Fecha de inicio"
                        type="date"
                        value = {state.fechaInicio}
                        className={`form-control "col-md-12 col-xs-12`}
                        readOnly={!enabled}
                    />
                    <input
                        onChange={handleChangeFechaFin}
                        placeholder="Fecha de fin"
                        type="date"
                        value = {state.fechaFin}
                        className={`form-control "col-md-12 col-xs-12`}
                        readOnly={!enabled}
                    />
                </div>
                {showMessage()}
            </div>
        </div>
    )
}

export default DateRangeComponent