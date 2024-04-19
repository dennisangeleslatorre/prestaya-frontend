import React, { useContext, useEffect, useState } from 'react'
//Componentes
import { Checkbox } from "antd";
import FormContainer from '../../components/FormContainer/FormContainer'
import InputComponent from '../../components/InputComponent/InputComponent'
import ReactSelect from '../../components/ReactSelect/ReactSelect'
import SelectComponent from '../../components/SelectComponent/SelectComponent'
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import ResponseModal from '../../components/Modal/ResponseModal'
import Loading from '../../components/Modal/LoadingModal'
//Context
import UserContext from '../../context/UserContext/UserContext'
//Functions
import { useLocation, useHistory } from 'react-router'
import { registerUser, updateUser, getUserByCodigoUsuario, listActivePerfiles, listAllAgencias, assignAgenciesToUser, listAgenciesByUser } from '../../Api/Api'
import TreeSelectComponent from '../../components/TreeSelectComponent/TreeSelectComponent';

const UserForm = (props) => {
    const [codigoUsuario, setcodigoUsuario] = useState({value: "", isValid:null});
    const [nombres, setNombres] = useState({value: "", isValid:null});
    const [correo, setCorreo] = useState({value: "", isValid:null});
    const [telefono, setTelefono] = useState({value: "", isValid:null});
    const [clave, setClave] = useState({value: "", isValid:null});
    const [nPerfil, setNPerfil] = useState("");
    const [perfiles, setPerfiles] = useState([]);
    const [estado, setEstado] = useState("A");
    const [todasAgencias, setTodasAgencias] = useState(false);
    const [agencias, setAgencias] = useState([]);
    const [agenciasSeleccionadas, setAgenciasSeleccionadas] = useState([]);
    //Estados del formulario
    const [buttonAttributes, setButtonAttributes] = useState({label:"", class:""});
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openResponseModal, setOpenResponseModal] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [modalAttributes, setModalAttributes] = useState({title:"", message:""});
    const [isAlert, setIsAlert] = useState(false);
    const [notification, setNotification] = useState({title:"", type:"", message:""})
    //Contextos
    const { getUserData } = useContext(UserContext);
    const userLogedIn = getUserData().c_codigousuario;
    //Variables
    const elementId = props.match.params.id;
    const location = useLocation();
    let history = useHistory();
    const urlFragment = location.pathname.split('/')[1];
    const buttonTypes = {
        nuevoUsuario: {label:"Guardar", class:"btn btn-primary btn-form"},
        editarUsuario: {label:"Actualizar", class:"btn btn-warning btn-form"},
        visualizarUsuario: {label:"Ir a lista", class:"btn btn-info btn-form"}
    }
    const readOnlyView = urlFragment === "visualizarUsuario" ? true : false;
    const readOnlyCode = urlFragment === "editarUsuario" ? true : false;

    const formFunctions = {
        nuevoUsuario: ()=> handleRegister(),
        editarUsuario: ()=> handleUpdate()
    }

    const prepareNotificationSuccess = (message) => {
        setIsAlert(true);
        setNotification({title:"Operación exitosa", type:"alert-success", message:message});
        setResponseData({message: message, title: "Operación exitosa", url:"/usuarios"});
        setOpenResponseModal(true);
    }

    const prepareNotificationDanger = (title, message="Error al consumir el servicio.") => {
        setIsAlert(true);
        setNotification({title:title, type:"alert-danger", message:message})
    }

    const validate = () => {
        if(!codigoUsuario.isValid || !nombres.isValid || !correo.isValid || !telefono.isValid || !nPerfil) return false;
        return true;
    }

    const prepareData = () => {
        const data = {
            c_codigousuario: codigoUsuario.value.toUpperCase(),
            c_nombres:  nombres.value,
            c_correo: correo.value,
            c_telefono: telefono.value,
            n_perfil: nPerfil,
            c_estado: estado,
            b_todas_agencias: todasAgencias,
        }
        return data;
    }

    const handleRegister = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_clave = clave.value;
        data.c_usuarioregistro = userLogedIn;
        const response = await registerUser(data);
        if (response && response.status === 200) {
            if (agenciasSeleccionadas.length > 0) {
                const dataAssign = {
                    c_codigousuario: data.c_codigousuario,
                    c_codigousuarioconsultado: userLogedIn,
                    listagencia: agenciasSeleccionadas.join(",")
                }
                const responseAssign = await assignAgenciesToUser(dataAssign);
                if ( responseAssign && responseAssign.status === 200 ) {
                    prepareNotificationSuccess("Se registró con éxito el usuario")
                } else {
                    prepareNotificationDanger("Error al asignar agencias", responseAssign.message);
                }
            } else {
                prepareNotificationSuccess("Se registró con éxito el usuario")
            }
        } else {
            prepareNotificationDanger("Error al registrar", response.message);
        }
        setIsLoading(false);
    }

    const handleUpdate = async () => {
        setOpen(false);
        await setIsLoading(true);
        const data = prepareData();
        data.c_ultimousuario = userLogedIn;
        const response = await updateUser({body:data, id:elementId});
        if (response && response.status === 200) {
            if (agenciasSeleccionadas.length > 0) {
                const dataAssign = {
                    c_codigousuario: data.c_codigousuario,
                    c_codigousuarioconsultado: userLogedIn,
                    listagencia: agenciasSeleccionadas.join(",")
                }
                const responseAssign = await assignAgenciesToUser(dataAssign);
                if ( responseAssign && responseAssign.status === 200 ) {
                    prepareNotificationSuccess("Se actualizó con éxito el usuario");
                } else {
                    prepareNotificationDanger("Error al asignar agencias", responseAssign.message);
                }
            } else {
                prepareNotificationSuccess("Se actualizó con éxito el usuario");
            }
        } else {
            prepareNotificationDanger("Error al actualizar", response.message);
        }
        setIsLoading(false);
    }

    const handleClick = () => {
        if(urlFragment !== "visualizarUsuario") {
            if(validate()) {
                if( urlFragment === "nuevoUsuario" ) {
                    if( clave.value ) {
                        setOpen(true);
                        setModalAttributes({title:"Aviso de creación", message:"¿Seguro que desea crear este elemento?"})
                    } else {
                        prepareNotificationDanger("Error campos incompletos", "Favor de llenar la contraseña");
                    }
                }
                if(urlFragment === "editarUsuario") {
                    setOpen(true);
                    setModalAttributes({title:"Aviso de actualización", message:"¿Seguro que desea actualizar este elemento?"});
                }
            } else {
                prepareNotificationDanger("Error campos incompletos", "Favor de llenar los campos del formulario con valores válidos")
            }
        } else {
            history.push("/usuarios")
        }
    }

    const getUserDataOfService = async () => {
        const response = await getUserByCodigoUsuario(elementId);
        if(response.status === 200) {
            const data = response.body.data;
            setcodigoUsuario({value:data.c_codigousuario, isValid: true});
            setNombres({value:data.c_nombres, isValid: true});
            setCorreo({value:data.c_correo, isValid: true});
            setTelefono({value:data.c_telefono, isValid: true});
            setNPerfil(data.n_perfil);
            setEstado(data.c_estado);
            setTodasAgencias(data.b_todas_agencias);
        } else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    const getAgenciesOfUser = async () => {
        const response = await listAgenciesByUser({c_codigousuario: elementId});
        if(response.status === 200) {
            const data = response.body.data;
            setAgenciasSeleccionadas(
                data.map(agency => `${agency.c_compania}-${agency.c_agencia}`)
            );
        } else {
            prepareNotificationDanger("Error obteniendo datos", response.message);
        }
    }

    const getData = async () => {
        await getUserDataOfService();
        await getAgenciesOfUser();
    }

    const getPerfiles = async () => {
        const response = await listActivePerfiles();
        if(response && response.status === 200) setPerfiles(response.body.data);
    }

    const prepareAgenciesToReport = (agencias) => {
        const agenciaToList = [];
        agencias.forEach(agencia => {
            agenciaToList.push({
                title: agencia.c_descripcion,
                value: `${agencia.c_compania}-${agencia.c_agencia}`,
                key: `${agencia.c_compania}-${agencia.c_agencia}`,
            });
        })
        setAgencias(agenciaToList);
    }

    const getAgencias = async () => {
        const response = await listAllAgencias();
        if(response && response.status === 200 && response.body.data) prepareAgenciesToReport(response.body.data);
    }

    useEffect(async () => {
        await setIsLoading(true);
        await getPerfiles();
        await getAgencias();
        setButtonAttributes(buttonTypes[urlFragment]);
        if(urlFragment !== "nuevoUsuario") await getData();
        setIsLoading(false);
    }, [])

    return (
        <>
            <FormContainer buttonAttributes={buttonAttributes} handleClick={handleClick} isAlert={isAlert} notification={notification}
            goList={()=>history.push("/usuarios")} view={readOnlyView} >
                <InputComponent
                    label="Código"
                    state={codigoUsuario}
                    setState={setcodigoUsuario}
                    type="text"
                    placeholder="Código"
                    inputId="codigoId"
                    validation="textNumber"
                    max={10}
                    readOnly={readOnlyCode}
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
                    readOnly={readOnlyView}
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
                    readOnly={readOnlyView}
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
                    disabledElement={readOnlyView}
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
                    uppercaseOnly={false}
                    readOnly={readOnlyView}
                />
                { urlFragment === "nuevoUsuario" && <InputComponent
                    label="Contraseña"
                    state={clave}
                    setState={setClave}
                    type="password"
                    placeholder="Contraseña del usuario"
                    inputId="passwordId"
                    readOnly={readOnlyView}
                    autoComplete="new-password"
                    uppercaseOnly={false}
                />}
                <SelectComponent
                    labelText="Estado"
                    defaultValue="Seleccione un estado"
                    items={[{name: "Activo", value:"A"}, {name: "Inactivo", value:"I"}]}
                    selectId="estadoId"
                    valueField="value"
                    optionField="name"
                    valueSelected={estado}
                    handleChange={setEstado}
                    disabledElement={readOnlyView}
                />
                <div className={`form-group row`}>
                    <label
                        htmlFor="all_agencies"
                        className={`col-md-2 w-100 col-form-label label-input d-flex`}
                        style={{
                            gap: "8px"
                        }}
                    >
                        Todas las agencias
                        <Checkbox
                        id="all_agencies"
                        checked={todasAgencias}
                        onChange={() => setTodasAgencias(!todasAgencias)}
                        disabledElement={readOnlyView}
                    />
                    </label>
                </div>
                <TreeSelectComponent
                    label="Agencias"
                    data={agencias}
                    value={agenciasSeleccionadas}
                    handleOnChange={(value) => setAgenciasSeleccionadas(value)}
                    readOnly={readOnlyView}
                />
            </FormContainer>
            {isLoading === true && <Loading/>}
            <ConfirmationModal
                isOpen={open}
                onClose={()=>setOpen(false)}
                title={modalAttributes.title}
                message={modalAttributes.message}
                onHandleFunction={formFunctions[urlFragment]}
            />
            <ResponseModal
                isOpen={openResponseModal}
                title={responseData.title}
                onClose={()=>setOpenResponseModal(false)}
                message={responseData.message}
                buttonLink={responseData.url}
            />
        </>
    )
}

export default UserForm