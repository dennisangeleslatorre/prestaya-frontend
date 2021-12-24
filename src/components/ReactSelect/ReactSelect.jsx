import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import './ReactSelect.css'

const ReactSelect = (props) => {
    //Propiedades
    const {labelText, placeholder="Selecciona un item", data=[], inputId, valueSelected, disabledElement=false,
            handleElementSelected, classForm="", marginForm="", labelSpace=2, valueField="id", optionField="name" } = props;
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
        <div className={`form-group ${marginForm} ${classForm} row`}>
            <label htmlFor={inputId} className={`col-sm-${labelSpace} col-form-label label-input`}>{ labelText }</label>
            <div className={ labelText ? `col-sm-${12-labelSpace}` : `col-sm-${14-labelSpace}`}>
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