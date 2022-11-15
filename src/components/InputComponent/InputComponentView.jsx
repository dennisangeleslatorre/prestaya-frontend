import React from 'react'
import './InputComponent.css'

const InputComponentView = (props) => {

    const { state, label=null, placeholder="", inputId,
             classForm="", marginForm="", labelSpace=2, labelLine  } = props;


    return (
        <div className={`form-group ${marginForm} ${classForm} row`}>
            { label && <label htmlFor={inputId} className={`${ labelLine ? "col-12" : `col-sm-${labelSpace}`} col-form-label label-input`}>{ label }</label> }
            <div className={ label ? `col-sm-${12-labelSpace}` : `col-sm-${14-labelSpace}`}>
                <input
                    readOnly={true}
                    value={state}
                    placeholder={placeholder}
                    id={inputId}
                    className={`form-control`}
                />
            </div>
        </div>
    )
}

export default InputComponentView
