import React from 'react'
import InputMask from "react-input-mask";

const PeriodoInputComponent = (props) => {
    const {inputId, label, placeholder, readOnly, value, setState, classForm="", labelSpace=2} = props;

    const handleOnChange = (e) => {
        setState(e.target.value);
    }

    return (
        <div className={`form-group mt-3 ${classForm} row`}>
            { label && <label htmlFor={inputId} className={`col-sm-${labelSpace} col-form-label label-input`}>{ label }</label> }
            <div className={ label ? `col-sm-${12-labelSpace}` : `col-sm-${14-labelSpace}`}>
                <InputMask
                    mask="9999-99"
                    readOnly={readOnly}
                    value={value}
                    placeholder={placeholder}
                    onChange={handleOnChange}
                    id={inputId}
                    className={`form-control`}
                />
            </div>
        </div>
    )
}

export default PeriodoInputComponent