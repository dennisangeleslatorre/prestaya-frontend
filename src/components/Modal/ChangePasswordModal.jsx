import React, { useState } from 'react'
import InputComponent from '../../components/InputComponent/InputComponent'
import Modal from '../Modal/ModalNotification'
import Alert from '../Alert/Alert'

const ChangePasswordModal = (props) => {
    const {isOpen, onClose, handleChangePassword, setIdElement} = props;
    const [password, setPassword] = useState({value:"", isValid:null});
    const [isAlert, setIsAlert] = useState(false);

    const validate = () => {
        if(!password.value) return false;
        return true;
    }

    const cleanForm = () => {
        setPassword({value:"", isValid:null});
    }

    const handleClose = () => {
        cleanForm();
        onClose();
        setIsAlert(false);
        setIdElement(null);
    }

    const onHandleChangePassword = async () => {
        if(validate()) {
            handleChangePassword(password.value);
            handleClose();
        } else {
            setIsAlert(true);
        }
    }

    return (
        <Modal isOpen={isOpen} title="Cambiar contraseña" onClose={handleClose} modal_class="Modal__container__search">
            <div className="modal-body">
                <InputComponent
                    label="Nueva Contraseña"
                    state={password}
                    setState={setPassword}
                    type="text"
                    placeholder="Nueva contraseña"
                    inputId="newPasswordId"
                    autoComplete="new-password"
                    uppercaseOnly={false}
                />
            </div>
            {/*Alerta*/}
            { isAlert === true && <Alert
                title="Problema al actualizar"
                type="alert-danger"
                mainMessage="Favor de llenar los campos"
                classAlert="mx-2"
            /> }
            <div className="modal-footer justify-content-center">
                <button onClick={onHandleChangePassword} className="btn btn-warning">
                    Cambiar
                </button>
            </div>
        </Modal>
    )
}

export default ChangePasswordModal