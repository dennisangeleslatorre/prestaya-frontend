import React from 'react';

const SelectComponent = (props) => {
    const { labelText, defaultValue, items, selectId, valueField, optionField, valueSelected, handleChange, disabledElement=false,
            classForm="", marginForm="", labelSpace=2, disableDefaultValue=true } = props;
    return (
        <div className={`form-group ${marginForm} ${classForm} row`}>
            { labelText && <label htmlFor={selectId} className={`col-sm-${labelSpace} col-form-label label-input`}>{ labelText }</label> }
            <div className={ labelText ? `col-sm-${12-labelSpace}` : `col-sm-${14-labelSpace}`}>
                <select id={selectId} disabled={disabledElement} className="form-control" value={valueSelected} onChange={(e)=>handleChange(e.target.value)}>
                    <option value="" disabled={disableDefaultValue}>{defaultValue}</option>
                    {items.map( (item) => {
                        return (
                            <option key={selectId + item[valueField]} value={item[valueField]}>{item[optionField]}</option>
                        )
                    })}
                </select>
            </div>
        </div>
    )
}

export default SelectComponent;