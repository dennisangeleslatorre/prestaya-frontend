import React from 'react'
import { TreeSelect } from 'antd'

const TreeSelectComponent = ({label="Páginas", data, value, handleOnChange, readOnly=false}) => {
    //Propiedades del select
    const tProps = {
        treeData: data,
        value: value,
        treeCheckable: true,
        placeholder: 'Seleccionar páginas',
        showCheckedStrategy: TreeSelect.SHOW_CHILD,
        disabled:readOnly,
        style: {
            width: '100%',
        },
    };
    return (
        <div className="form-group row">
            <label htmlFor="treeSelectPageId" className="col-sm-2 col-form-label label-input">{label}</label>
            <div className="col-sm-10">
                <TreeSelect {...tProps} onChange={handleOnChange}/>
            </div>
        </div>
    )
}

export default TreeSelectComponent