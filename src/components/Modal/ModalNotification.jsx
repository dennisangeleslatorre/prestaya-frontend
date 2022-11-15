import React from 'react';
import ReactDOM from 'react-dom';

import './ModalStyles.css';

function Modal(props) {
  const { modal_class="Modal__container", title, classModal="Modal", showCloseButton = true } = props;

    if(!props.isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        //Esto es el fondo oscuro
        <div className={classModal}>
          <div className={modal_class}>
            {/*Header del modal*/}
            <div className="modal-header">
              <h3 className="modal-title">{title}</h3>
              {showCloseButton && <button onClick={props.onClose} className="close">
                  <span aria-hidden="true">&times;</span>
              </button>}
            </div>
            {props.children}
          </div>
        </div>,
         document.getElementById('app')
    );
}

export default Modal;