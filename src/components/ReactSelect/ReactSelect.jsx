import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import './ReactSelect.css'

const ReactSelect = (props) => {
    //Propiedades
    const {labelText, placeholder="Selecciona un item", data=[], inputId, valueSelected, disabledElement=false, handleElementSelected, valueField, optionField} = props;
    const [options, setOptions] = useState([]);
    const [itemSelected, setItemSelected] = useState(null);

    useEffect(() => {
        //console.log("data", data);
        getData();
    }, [data])

    const getData = () => {
        //Opciones
        let optionsAux = [];
        data.forEach(item => {
            let aux = {};
            aux.value = item[valueField];
            aux.label = item[optionField];
            optionsAux.push(aux);
        })
        setOptions(optionsAux);
    }

    useEffect(() => {
        //console.log("valueSelected", valueSelected);
        if(options.length !== 0 && valueSelected) {
            intialValue(valueSelected);
        }
        if(!valueSelected) setItemSelected("");
    }, [options, valueSelected])

    const intialValue = (value) => {
        let element = options.find((item)=>item.value===value);
        setItemSelected(element);
    }

    const selectValue = (item) => {
        handleElementSelected(item);
    }

    return (
        <div className="form-group row">
            <label htmlFor={inputId} className="col-sm-2 col-form-label label-input">{ labelText }</label>
            <div className="col-sm-10">
                <Select
                    inputId={inputId}
                    onChange={(item)=>selectValue(item.value)}
                    options={options}
                    placeholder={placeholder}
                    noOptionsMessage={()=><div className="message">No hay elementos</div>}
                    value={itemSelected}
                    isDisabled={disabledElement}
                />
            </div>
        </div>
    )
}

export default ReactSelect