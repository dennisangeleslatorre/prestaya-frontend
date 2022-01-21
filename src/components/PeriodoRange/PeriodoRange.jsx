import React from 'react'
import InputMask from "react-input-mask"

const MessageComponent = ({message, classComponent}) => (
    <div className={classComponent}>
        {message}
    </div>
)

const PeriodoRange = (props) => {
    const { classForm="", marginForm="ml-3 mr-3", labelSpace=2, labelText=null, inputId="inputId", state, setState } = props;

    const isValidFunction = (periodoInicio, periodoFin) => {
        if(!periodoFin || !periodoInicio || Number(periodoFin.replace("-", "")) < Number(periodoInicio.replace("-", ""))) return false
        else return true;
    }

    const handleChangePeriodoInicio = (e) => {
        setState({...state, periodoInicio: e.target.value});
    }

    const handleChangePeriodoFin = (e) => {
        setState({...state, periodoFin: e.target.value});
    }

    const validarPeriodo = () => {
        const isValid = isValidFunction(state.periodoInicio, state.periodoFin);
        setState({...state, isValid: isValid});
    }

    const showMessage = () => {
        if( !state.periodoInicio || !state.periodoFin ) {
            return <MessageComponent message="Escribe un periodo inicio y un periodo fin." classComponent={"invalid__message__data"} />
        } else {
            if(Number(state.periodoFin.replace("-", "")) < Number(state.periodoInicio.replace("-", ""))) {
                return <MessageComponent message="El periodo fin debe ser mayor." classComponent={"invalid__message__data"} />
            }
        }
    }

    return (
        <div className={`form-group ${marginForm} ${classForm} row`}>
            { labelText && <label htmlFor={inputId} className={`col-md-${labelSpace} col-form-label label-input`}>
                { labelText }
            </label> }
            <div className={ labelText ? `col-12 col-md-${12-labelSpace}` : `col-md-${14-labelSpace}`}>
                <div className="input-group">
                    <InputMask
                        mask="9999-99"
                        value={state.periodoInicio}
                        onChange={handleChangePeriodoInicio}
                        placeholder="Período inicio"
                        id="periodoInicioId"
                        className={`form-control col-md-12 col-xs-12`}
                        onBlur={validarPeriodo}
                    />
                    <InputMask
                        mask="9999-99"
                        value={state.periodoFin}
                        onChange={handleChangePeriodoFin}
                        placeholder="Período fin"
                        id="periodoFinId"
                        className={`form-control col-md-12 col-xs-12`}
                        onBlur={validarPeriodo}
                    />
                </div>
                {showMessage()}
            </div>
        </div>
    )
};

export default PeriodoRange;
