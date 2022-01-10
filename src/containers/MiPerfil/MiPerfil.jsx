import React, { useContext, useEffect, useState } from 'react'
//Componentes
import FormContainer from '../../components/FormContainer/FormContainer'
import InputComponent from '../../components/InputComponent/InputComponent'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import UserContext from '../../context/UserContext/UserContext'
//Functions
import { useLocation, useHistory } from 'react-router'
import { getUserByCodigoUsuario, listPerfiles } from '../../Api/Api'

const Profile = () => {
    const [codigoUsuario, setcodigoUsuario] = useState({value: "", isValid:null});
    const [nombres, setNombres] = useState({value: "", isValid:null});
    const [correo, setCorreo] = useState({value: "", isValid:null});
    const [telefono, setTelefono] = useState({value: "", isValid:null});
    const [nPerfil, setNPerfil] = useState("");
    const [perfiles, setPerfiles] = useState([]);
    const [estado, setEstado] = useState("A");
    //Estados del formulario
    const [isLoading, setIsLoading] = useState(false);
    //Contextos
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData().c_codigousuario;

    const getUser = async () => {
        const response = await getUserByCodigoUsuario(userLogedIn);
        if(response.status === 200) {
            const data = response.body.data;
            setcodigoUsuario({value:data.c_codigousuario, isValid: true});
            setNombres({value:data.c_nombres, isValid: true});
            setCorreo({value:data.c_correo, isValid: true});
            setTelefono({value:data.c_telefono, isValid: true});
            setNPerfil(data.n_perfil);
            setEstado(data.c_estado);
        }else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    const getPerfiles = async () => {
        const response = await listPerfiles();
        if(response && response.status === 200) setPerfiles(response.body.data);
    }

    useEffect(async () => {
        await setIsLoading(true);
        await getPerfiles();
        await getUser();
        setIsLoading(false);
    }, [])

    return (
        <>
             <div className="continer-fluid pt-2 pb-2 pl-2 pr-2" style={{ background: '#FFFFFF' }}>
                <div className="row d-flex justify-content-center">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <InputComponent
                                    label="Código"
                                    state={codigoUsuario}
                                    setState={setcodigoUsuario}
                                    type="text"
                                    placeholder="Código"
                                    inputId="codigoId"
                                    validation="textNumber"
                                    max={10}
                                    readOnly={true}
                                />
                                <InputComponent
                                    label="Nombre completo"
                                    state={nombres}
                                    setState={setNombres}
                                    type="text"
                                    placeholder="Nombre completo"
                                    inputId="nombresId"
                                    validation="name"
                                    max={60}
                                    readOnly={true}
                                />
                                <InputComponent
                                    label="Teléfono"
                                    state={telefono}
                                    setState={setTelefono}
                                    type="text"
                                    placeholder="Teléfono"
                                    inputId="telefonoId"
                                    validation="phone"
                                    max={20}
                                    readOnly={true}
                                />
                                <ReactSelect
                                    inputId="perfilId"
                                    labelText="Perfil"
                                    placeholder="Seleccione un perfil"
                                    valueSelected={nPerfil}
                                    data={perfiles}
                                    handleElementSelected={setNPerfil}
                                    optionField="c_codigoperfil"
                                    valueField="n_perfil"
                                    disabledElement={true}
                                />
                                <InputComponent
                                    label="Correo"
                                    state={correo}
                                    setState={setCorreo}
                                    type="text"
                                    placeholder="Correo"
                                    inputId="CorreoId"
                                    validation="email"
                                    max={60}
                                    readOnly={true}
                                />
                                <SelectComponent
                                    labelText="Estado"
                                    defaultValue="Seleccione un estado"
                                    items={[{name: "Activo", value:"A"}, {name: "Inactivo", value:"I"}]}
                                    selectId="estadoId"
                                    valueField="value"
                                    optionField="name"
                                    valueSelected={estado}
                                    handleChange={setEstado}
                                    disabledElement={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading === true && <Loading/>}
        </>
    )
}

export default Profile