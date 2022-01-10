import React, { useEffect } from 'react'
import './InputComponent.css'

const validations = {
    code: () => { return  { expression: /^[\u00C0-\u017Fa-zA-Z']+$/, errorMessage: "Solo se aceptan letras" } },
    name: () => { return  { expression: /^[\u00C0-\u017Fa-zA-Z']+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1])*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/, errorMessage: "Solo se aceptan letras y no puede terminar en espacio" } },
    email: () => { return  { expression: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, errorMessage: "Correo ingresado no válido"} },
    phone: () => { return { expression: /^\d{7,20}$/, errorMessage: "El teléfono solo puede contener números y de 7 a 20 cifras" } },
    number: () => { return { expression: /^\d+$/, errorMessage: "Solo se aceptan números" } },
    decimalNumber: () => { return { expression: /^(\d)*(\.)*(\d)+$/, errorMessage: "Solo se aceptan números con formato 1.0" } },
    textNumber: () => { return { expression: /^[a-zA-Z0-9]+$/, errorMessage: "Solo se aceptan letas y números." } },
    codeTextNumber: () => { return { expression: /^[a-zA-Z0-9]{1,3}$/, errorMessage: "Solo letas y números de 1 a 3 dígitos." } },
    textWithRange: (a, b) => { return { expression: new RegExp(`^[\\u00C0-\\u017Fa-zA-Z']{${a},${b}}$`), errorMessage: `Solo se aceptan letras de ${a} a ${b} dígitos` } },
    numberWithRange: (a, b) => { return { expression: new RegExp(`^\\d{${a},${b}}$`), errorMessage: `Solo se aceptan número de ${a} a ${b} dígitos` } },
    numberAndTextWithRange: (a, b) => { return { expression: new RegExp(`^[a-zA-ZÀ-ÿ\\u00f1\\u00d1\\d]{${a},${b}}$`), errorMessage: `Solo se aceptan letras y números de ${a} a ${b} dígitos` } },
    alphanumericRange: (a, b) => { return { expression: new RegExp(`^[\\u00C0-\\u017Fa-zA-Z0-9]*(\\s*[a-zA-ZÀ-ÿ\\u00f1\\u00d1\\d\\-\\_\\.\\°\\(\\)\\#)]){${a},${b}}$`), errorMessage: `Solo se aceptan caractéres alfanuméricos de ${a} a ${b} dígitos. No puede terminar en espacio.` } },
    documentNumber: (a, b) => { return { expression: new RegExp(`^[a-zA-Z0-9]{${a},${b}}$`), errorMessage: `Solo se aceptan números y letras de ${b} dígitos` } }
}

const InputComponent = (props) => {

    const { state, setState, type, label=null, placeholder="", inputId, validation, min, max=250, readOnly, autoComplete="new-text",
            required=true, uppercaseOnly=true, classForm="", marginForm="", labelSpace=2, fixedNumber=2  } = props;

    const handleOnChange = (e) => {
        if(type === "number") {
            setState({...state, value: e.target.value});
        }
        else {
            if(uppercaseOnly) setState({...state, value: e.target.value.toUpperCase()});
            else setState({...state, value: e.target.value})
        }
    }

    const handleOnBlur = () => {
        validate();
        if(type === "number") {
            let num = Number(state.value)
            setState({...state, value: num.toFixed(fixedNumber)});
        }
    }

    const validationObject = validation ? validations[validation](min, max) : null;

    const validate = () => {
        if( validation && validationObject ) {
            if ( !required && state.value === "" ) setState({...state, isValid:true})
            else validationObject.expression.test(state.value) ? setState({...state, isValid: true}) : setState({...state, isValid: false})
        }
    }

    return (
        <div className={`form-group ${marginForm} ${classForm} row`}>
            { label && <label htmlFor={inputId} className={`col-sm-${labelSpace} col-form-label label-input`}>{ label }</label> }
            <div className={ label ? `col-sm-${12-labelSpace}` : `col-sm-${14-labelSpace}`}>
                <input
                    autoComplete={autoComplete}
                    readOnly={readOnly}
                    value={state.value}
                    type={type}
                    placeholder={placeholder}
                    id={inputId}
                    onChange={handleOnChange}
                    onKeyUp={validate}
                    onBlur={handleOnBlur}
                    className={`form-control ${ validation ? (state.isValid ? "input-succes" : "input-error") : ""}`}
                    maxLength={max}
                />
                { (!state.isValid && validation) &&
                    <div className="invalid__message__data">
                        {validationObject.errorMessage}
                    </div>
                }
            </div>
        </div>
    )
}

export default InputComponent
