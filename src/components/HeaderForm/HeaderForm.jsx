import React from 'react'
import { Divider } from 'antd'

const HeaderForm = ({title, handleNewProduct}) => {
    return (
        <>
            <div className="col d-flex justify-content-sm-center justify-content-md-start mt-3">
                <h2 className="col col-md-8" style={{color: "#10489e"}}>{title}</h2>
                {handleNewProduct && <div className="text-center col col-md-4">
                    <button className='btn btn-primary btn-form' onClick={handleNewProduct}>Nuevo</button>
                </div>}
            </div>
            <Divider className='header-form' style={{borderTop: "3px solid #10489e"}} />
        </>
    )
}

export default HeaderForm