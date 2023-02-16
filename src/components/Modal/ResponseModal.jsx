import React from 'react'
import { Link } from 'react-router-dom'
import Modal from './ModalNotification';

const ResponseModal = ({isOpen, title, onClose, message, buttonLink="", buttonClass="btn-info", showCloseButton = true, buttonLinkView=null}) => {
    return (
        <Modal isOpen={isOpen} title={title} onClose={onClose} showCloseButton={showCloseButton}>
            {/*body*/}
            <div className="modal-body">
                <p className="modal-text">{message}</p>
            </div>
            {/*Footer*/}
            <div className="modal-footer justify-content-center">
                {buttonLinkView ? <Link to={buttonLinkView} className={`btn btn-light mr-4`}>
                    Aceptar
                </Link> :
                    <>
                    {buttonLink && <Link to={buttonLink} className={`btn ${buttonClass} mr-4`}>
                        Ir a lista
                    </Link>}
                    {!buttonLink && <button onClick={onClose} className="btn btn-light">
                        Aceptar
                    </button>}
                    </>
                }
            </div>
        </Modal>
    )
}

export default ResponseModal