import React from 'react'
import './InputComponent.css'

const validations = {
    name: { expression: /^[\u00C0-\u017Fa-zA-Z'][\u00C0-\u017Fa-zA-Z' ]+[\u00C0-\u017Fa-zA-Z']?$/, errorMessage: "Solo se aceptan letras" },
    email: { expression: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, errorMessage: "Correo ingresado no válido"},
    phone:  { expression: /^\d{7,14}$/, errorMessage: "El teléfono solo puede contener números" },

}

const InputComponent = ({state, setState, type, label=null, placeholder="", inputId, validation}) => {

    const handleOnChange = (e) => {
        setState({...state, value: e.target.value})
    }

    const validate = () => {
        if( validation && validations[validation] ) {
            console.log(validations[validation].expression)
            console.log(state.value)
            console.log(validations[validation].expression.test(state.value))
            validations[validation].expression.test(state.value) ? setState({...state, isValid: true}) : setState({...state, isValid: false})
        }
    }

    return (
        <div className="form-group row">
            { label && <label htmlFor={inputId} className="col-sm-2 col-form-label label-input">{ label }</label> }
            <div className={ label ? "col-sm-10" : "col-sm-12"}>
                <input
                    type={type}
                    placeholder={placeholder}
                    id={inputId}
                    onChange={handleOnChange}
                    onKeyUp={validate}
                    onBlur={validate}
                    className={`form-control ${ validation ? (state.isValid ? "input-succes" : "input-error") : ""}`}
                />
                { (!state.isValid && validation) &&
                    <div className="invalid__message__data">
                        {validations[validation].errorMessage}
                    </div>
                }
            </div>
        </div>
    )
}

export default InputComponent
