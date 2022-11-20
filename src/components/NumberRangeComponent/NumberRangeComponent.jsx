import React, { useEffect } from 'react';
import { Checkbox } from 'antd';

const MessageComponent = ({message, classComponent}) => (
    <div className={classComponent}>
        {message}
    </div>
)

const NumberRangeComponent = (props) => {
    const { classForm="", marginForm="ml-3 mr-3", labelSpace=2, labelText=null, inputId="inputId", state, setState, checked=true, setChecked } = props;

    const onChange = (e) => {
        setChecked(e.target.checked);
    }

    const validateRangeDate = () => {
        const diff = Number(state.inicio) <= Number(state.fin);
        return diff;
    }

    const isValidFunction = (inicio, fin) => {
        if(!inicio || !fin || !validateRangeDate()) return false
        else return true;
    }

    const handleChangeInicio = (e) => {
        setState({...state, inicio: e.target.value});
    }

    const handleChangeFin = (e) => {
        setState({...state, fin: e.target.value});
    }

    useEffect(() => {
        const isValid = isValidFunction(state.inicio, state.fin);
        setState({...state, isValid:isValid})
    }, [state.inicio, state.fin])

    const showMessage = () => {
        if( !state.inicio || !state.fin ) {
            return <MessageComponent message="Escriba un numero de inicio y fin." classComponent={"invalid__message__data"} />
        } else {
            const valid = validateRangeDate();
            if(!valid) {
                return <MessageComponent message="El número de fin debe ser mayor o igual." classComponent={"invalid__message__data"} />
            }
        }
    }

    return (
        <div className={`form-group ${marginForm} ${classForm} row`}>
            { labelText && <label htmlFor={inputId} className={`col-md-${labelSpace} col-form-label label-input`}>
                { labelText } { setChecked && <Checkbox id={inputId} checked={checked} onChange={onChange} />}
            </label> }
            <div className={ labelText ? `col-12 col-md-${12-labelSpace}` : `col-md-${14-labelSpace}`}>
                <div className="input-group">
                    <input
                        onChange={handleChangeInicio}
                        placeholder="0"
                        type="number"
                        value = {state.inicio}
                        className={`form-control "col-md-12 col-xs-12`}
                        readOnly={checked}
                        min={0}
                    />
                    <input
                        onChange={handleChangeFin}
                        placeholder="0"
                        type="number"
                        value = {state.fin}
                        className={`form-control "col-md-12 col-xs-12`}
                        readOnly={checked}
                        min={0}
                    />
                </div>
                {showMessage()}
            </div>
        </div>
    )
}

export default NumberRangeComponent