import React from 'react'

const SearcherComponent = (props) => {
    const { classForm="", marginForm="ml-3 mr-3", labelSpace=2, placeholder="", label=null, inputCodeId="inputCodeId", stateCode=null, setStateCode=null, inputId, stateName,
    setStateName, readOnly=false, autoComplete='new-searcher', onHandleClick, onHandleBlur=null } = props;
    return (
        <div className={`form-group ${marginForm} ${classForm} row`}>
            { label && <label htmlFor={inputId} className={`col-md-${labelSpace} col-form-label label-input`}>{ label }</label> }
            <div className={ label ? `col-12 col-md-${12-labelSpace}` : `col-md-${14-labelSpace}`}>
                <div className="input-group">
                    {onHandleBlur && <input
                        id={inputCodeId}
                        onBlur={onHandleBlur}
                        type="text"
                        className="form-control col-md-2 col-xs-2"
                        value = {stateCode}
                        onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                        autoComplete="new-code-search"
                    />}
                    <input
                        id={inputId}
                        onChange={(e) => setStateName(e.target.value.toUpperCase())}
                        placeholder={placeholder}
                        type="text"
                        value = {stateName}
                        className={`form-control ${onHandleBlur ? "col-md-10 col-xs-10" : "col-md-12 col-xs-12"}`}
                        autoComplete={autoComplete}
                        readOnly={readOnly}
                    />
                    <button type="button" onClick={onHandleClick} className="btn btn-light input-group-text"><i className="bi bi-search"></i></button>
                </div>
                {props.children}
            </div>
        </div>
    )
}

export default SearcherComponent