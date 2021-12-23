import React from 'react'
import { Link } from 'react-router-dom'
import Modal from './ModalNotification';

const ResponseModal = ({isOpen, title, onClose, message, buttonLink="", buttonClass="btn-info"}) => {
    return (
        <Modal isOpen={isOpen} title={title} onClose={onClose}>
            {/*body*/}
            <div className="modal-body">
                <p className="modal-text">{message}</p>
            </div>
            {/*Footer*/}
            <div className="modal-footer justify-content-center">
                {buttonLink && <Link to={buttonLink} className={`btn ${buttonClass} mr-4`}>
                    Ir a lista
                </Link>}
                <button onClick={onClose} className="btn btn-light">
                    {buttonLink ? 'Cancel': 'Aceptar'}
                </button>
            </div>
        </Modal>
    )
}

export default ResponseModal