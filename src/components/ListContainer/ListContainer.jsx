import React from 'react'
import Table from '../Table/Table'

const ListContainer = ({columns, dataTable, fieldsFilter, buttonLink, textButton, registerPermission=false}) => {
    return (
        <>
            <div className="continer-fluid pt-2 pb-2 pl-2 pr-2" style={{ background: '#FFFFFF' }}>
                <div className="row">
                    <div className="col">
                        <div className="card pr-3 pl-3">
                            <div className="card-body">
                                <Table columns={columns} data={dataTable} fieldsFilter={fieldsFilter}
                                    buttonLink={buttonLink} textButton={textButton} registerPermission={registerPermission}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ListContainer