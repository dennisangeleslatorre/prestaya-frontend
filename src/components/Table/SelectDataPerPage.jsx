import React from 'react';

const SelectDataPerPage = (props) => {
    const {quantityPerPage, onChange} = props;
    const valsPage =[15,25,45,65,100];
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="form-group form-inline pull-left">
                    <label>
                        Datos:
                        {/*Select con las cantidades por pagina*/}
                        <select onChange={(e) => onChange(e)} className="form-control" value={quantityPerPage}>
                            {valsPage.map( (value) => {
                                return(
                                    <option key={value} value={value}>{value}</option>
                                )
                            })}
                        </select>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default SelectDataPerPage;
