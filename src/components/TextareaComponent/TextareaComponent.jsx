import React from 'react'

const TextareaComponent = ({inputId, label, placeholder, readOnly, value, setState, max=250, classForm="", labelSpace=2, uppercaseOnly=false}) => {
    const handleOnChange = (e) => {
        if(uppercaseOnly) setState({...value, value: e.target.value.toUpperCase()});
        else setState(e.target.value);
    }
    return (
        <div className={`form-group mt-3 ${classForm} row`}>
            { label && <label htmlFor={inputId} className={`col-sm-${labelSpace} col-form-label label-input`}>{ label }</label> }
            <div className={ label ? `col-sm-${12-labelSpace}` : `col-sm-${14-labelSpace}`}>
                <textarea
                    readOnly={readOnly}
                    value={value}
                    placeholder={placeholder}
                    onChange={handleOnChange}
                    id={inputId}
                    className={`form-control`}
                    maxLength={max}
                />
            </div>
        </div>
    )
}

export default TextareaComponent