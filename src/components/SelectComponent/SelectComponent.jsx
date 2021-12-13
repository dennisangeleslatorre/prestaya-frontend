import React from 'react';

const SelectComponent = (props) => {
    const { labelText, defaultValue, items, selectId, valueField, optionField, valueSelected, handleChange, disabledElement=false } = props;
    return (
        <div className="form-group row">
            { labelText && <label htmlFor={selectId} className="col-sm-2 col-form-label label-input">{ labelText }</label> }
            <div className="col-sm-10">
                <select id={selectId} disabled={disabledElement} className="form-control" value={valueSelected} onChange={(e)=>handleChange(e.target.value)}>
                    <option value="" disabled>{defaultValue}</option>
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