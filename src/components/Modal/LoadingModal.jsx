import React from 'react'
import ReactDOM from 'react-dom'
import './ModalStyles.css'
import Spinner from '../Spinner/Spinner'

const LoadingModal = () => {
    return ReactDOM.createPortal(
        //Esto es el fondo oscuro
        <div className="Modal">
             <div className="Modal__container">
                <div className="text-center">
                    <h2 className="pt-3">Cargando</h2>
                    <Spinner/>
                </div>
             </div>
        </div>,
         document.getElementById('modalLoading')
    );
}

export default LoadingModal
