import React from 'react'
import Alert from '../Alert/Alert'

const FormContainer = (props) => {
    const { buttonAttributes={label:"", class:""}, handleClick=null, isAlert=false, view, goList,
    notification={title:"", type:"", message:""} } = props;

    const handleSubmit = () => {
        handleClick();
    }

    return (
        <>
            <div className="continer-fluid pt-2 pb-2 pl-2 pr-2" style={{ background: '#FFFFFF' }}>
                <div className="row d-flex justify-content-center">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <div className="mb-3" onSubmit={handleSubmit}>
                                    {props.children}
                                    <div className="text-center">
                                        <button onClick={handleSubmit} className={buttonAttributes.class}>{buttonAttributes.label}</button>
                                        {!view && <button onClick={goList} className="btn btn-light btn-form ml-2">Cancelar</button>}
                                    </div>
                                </div>
                                {/*Alerta*/}
                                { isAlert === true && <Alert
                                    title={notification.title}
                                    type={notification.type}
                                    mainMessage={notification.message}
                                /> }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4"></div>
        </>
    )
}

export default FormContainer