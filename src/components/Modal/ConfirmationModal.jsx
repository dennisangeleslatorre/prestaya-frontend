import React from 'react';
import Modal from './ModalNotification';

const ConfirmationModal = ({isOpen, title, onClose, message, onHandleFunction, buttonClass="btn-success", disabledButton=false}) => {
    return (
        <Modal isOpen={isOpen} title={title} onClose={onClose}>
            {/*body*/}
            <div className="modal-body">
                <p className="modal-text">{message}</p>
            </div>
            {/*Footer*/}
            <div className="modal-footer">
                <button onClick={onHandleFunction} className={`btn ${buttonClass} mr-4`} disabled={disabledButton}>
                    Aceptar
                </button>
                <button onClick={onClose} className="btn btn-primary">
                    Cancel
                </button>
            </div>
        </Modal>
    )
}

export default ConfirmationModal;