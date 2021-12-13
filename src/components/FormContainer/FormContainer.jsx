import React from 'react'
import Alert from '../Alert/Alert'

const FormContainer = (props) => {
    const { buttonAttributes={label:"", class:""}, handleClick=null, isAlert=false,
    notification={title:"", type:"", message:""} } = props;

    const handleSubmit = (e) => {
        e.preventDefault();
        handleClick();
    }

    return (
        <>
            <div className="continer-fluid pt-2 pb-2 pl-2 pr-2" style={{ background: '#FFFFFF' }}>
                <div className="row d-flex justify-content-center">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <form className="mb-3" action="" onSubmit={handleSubmit} autoComplete="on">
                                    {props.children}
                                    <div className="text-center">
                                        <button type="submit" className={buttonAttributes.class}>{buttonAttributes.label}</button>
                                    </div>
                                </form>
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