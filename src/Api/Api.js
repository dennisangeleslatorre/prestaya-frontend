import axios from 'axios';
const port = process.env.REACT_APP_API_BASE_URL;

const consumer = async (url, method, body) => {
    const attributes  = {
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json',
        }
    }
    if(url!=`${port}/user/login`) {
        let token = await window.localStorage.getItem('userToken');
        token = JSON.parse(token);
        attributes.headers.Authorization = `Bearer ${token}`;
    }
    if(body) attributes.data = body;
    let status;
    return axios(attributes)
    .then(res => {
        status = res.status;
        return res.data;
    })
    .then(data => {
        return { body: data, status: status }
    })
    .catch((error) => {
        const response = error.response;
        return {status: response.status, message: response.data.message};
    });
}

//user
export const signIn = async (body) => {
    console.log('---API--- : signIn');
    const url = `${port}/user/login`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const listUsers = async () => {
    console.log('---API--- : listUsers');
    const url = `${port}/user/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const getUserByCodigoUsuario = async (id) => {
    console.log('---API--- : getUserByCodigoUsuario');
    const url = `${port}/user/${id}/getUserByCodigoUsuario`;
    const response = await consumer(url, 'get');
    return response;
};
export const registerUser = async (body) => {
    console.log('---API--- : listUsers');
    const url = `${port}/user/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateUser = async ({body, id}) => {
    console.log('---API--- : updateUser');
    const url = `${port}/user/${id}/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deleteUser = async (c_codigousuario) => {
    console.log('---API--- : deleteUser');
    const url = `${port}/user/${c_codigousuario}/delete`;
    const response = await consumer(url, 'post', {});
    return response;
};
export const changePassword = async (id, body) => {
    console.log('---API--- : changePassword');
    const url = `${port}/user/${id}/changePassword`;
    const response = await consumer(url, 'put', body);
    return response;
};
//Perfiles
export const listPerfiles = async () => {
    console.log('---API--- : listPerfiles');
    const url = `${port}/role/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listActivePerfiles = async () => {
    console.log('---API--- : listActivePerfiles');
    const url = `${port}/role/listActivateRoles`;
    const response = await consumer(url, 'get');
    return response;
};
export const getRoleByNPerfil = async (id) => {
    console.log('---API--- : getRoleByNPerfil');
    const url = `${port}/role/${id}/getRoleByNPerfil`;
    const response = await consumer(url, 'get');
    return response;
};
export const registerPerfil = async (body) => {
    console.log('---API--- : registerPerfil');
    const url = `${port}/role/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updatePerfil = async ({body, id}) => {
    console.log('---API--- : updatePerfil');
    const url = `${port}/role/${id}/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deletePerfil = async (n_perfil) => {
    console.log('---API--- : deletePerfil');
    const url = `${port}/role/${n_perfil}/delete`;
    const response = await consumer(url, 'post', {});
    return response;
};
//Unidad medida
export const listUnidadesMedida = async () => {
    console.log('---API--- : listUnidadesMedida');
    const url = `${port}/unidadmedida/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listAllUnidadesMedida = async () => {
    console.log('---API--- : listAllUnidadesMedida');
    const url = `${port}/unidadmedida/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const getUnidadMedidaByCodigoUnidadMedida = async (id) => {
    console.log('---API--- : getUnidadMedidaByCodigoUnidadMedida');
    const url = `${port}/unidadmedida/${id}/getUnidadMedidaByCodigoUnidadMedida`;
    const response = await consumer(url, 'get');
    return response;
};
export const registerUnidadMedida = async (body) => {
    console.log('---API--- : registerUnidadMedida');
    const url = `${port}/unidadmedida/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateUnidadMedida = async ({body, id}) => {
    console.log('---API--- : updateUnidadMedida');
    const url = `${port}/unidadmedida/${id}/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deleteUnidadMedida = async (c_unidadmedida) => {
    console.log('---API--- : deleteUnidadMedida');
    const url = `${port}/unidadmedida/${c_unidadmedida}/delete`;
    const response = await consumer(url, 'post', {});
    return response;
};
//Tipo documento
export const listTiposDocumento = async () => {
    console.log('---API--- : listTiposDocumento');
    const url = `${port}/tipodocumento/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listAllTiposDocumento = async () => {
    console.log('---API--- : listAllTiposDocumento');
    const url = `${port}/tipodocumento/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const getTipoDocumentoByCodigoTipoDocumento = async (id) => {
    console.log('---API--- : getTipoDocumentoByCodigoTipoDocumento');
    const url = `${port}/tipodocumento/${id}/getTipoDocumentoByCodigoTipoDocumento`;
    const response = await consumer(url, 'get');
    return response;
};
export const registerTipoDocumento = async (body) => {
    console.log('---API--- : registerTipoDocumento');
    const url = `${port}/tipodocumento/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateTipoDocumento = async ({body, id}) => {
    console.log('---API--- : updateTipoDocumento');
    const url = `${port}/tipodocumento/${id}/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deleteTipoDocumento = async (c_tipodocumento) => {
    console.log('---API--- : deleteTipoDocumento');
    const url = `${port}/tipodocumento/${c_tipodocumento}/delete`;
    const response = await consumer(url, 'post', {});
    return response;
};
//Tipo producto
export const listTiposProducto = async () => {
    console.log('---API--- : listTiposProducto');
    const url = `${port}/tipoproducto/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listAllTiposProducto = async () => {
    console.log('---API--- : listAllTiposProducto');
    const url = `${port}/tipoproducto/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const getTipoProductoByCodigoTipoProducto = async (id) => {
    console.log('---API--- : getTipoProductoByCodigoTipoProducto');
    const url = `${port}/tipoproducto/${id}/getTipoProductoByCodigoTipoProducto`;
    const response = await consumer(url, 'get');
    return response;
};
export const registerTipoProducto = async (body) => {
    console.log('---API--- : registerTipoProducto');
    const url = `${port}/tipoproducto/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateTipoProducto = async ({body, id}) => {
    console.log('---API--- : updateTipoProducto');
    const url = `${port}/tipoproducto/${id}/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deleteTipoProducto = async (c_tipoproducto) => {
    console.log('---API--- : deleteTipoProducto');
    const url = `${port}/tipoproducto/${c_tipoproducto}/delete`;
    const response = await consumer(url, 'post', {});
    return response;
};
//Compania
export const listCompanias = async () => {
    console.log('---API--- : listCompanias');
    const url = `${port}/compania/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listAllCompanias = async () => {
    console.log('---API--- : listAllCompanias');
    const url = `${port}/compania/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const getCompaniaByCodigoCompania = async (id) => {
    console.log('---API--- : getCompaniaByCodigoCompania');
    const url = `${port}/compania/${id}/getCompaniaByCodigoCompania`;
    const response = await consumer(url, 'get');
    return response;
};
export const registerCompania = async (body) => {
    console.log('---API--- : registerCompania');
    const url = `${port}/compania/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateCompania = async (body) => {
    console.log('---API--- : updateCompania');
    const url = `${port}/compania/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deleteCompania = async (c_compania) => {
    console.log('---API--- : deleteCompania');
    const url = `${port}/compania/${c_compania}/delete`;
    const response = await consumer(url, 'post', {});
    return response;
};
//Pais
export const listPaises = async () => {
    console.log('---API--- : listPaises');
    const url = `${port}/pais/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listAllPaises = async () => {
    console.log('---API--- : listAllPaises');
    const url = `${port}/pais/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const getPaisByCodigoPais = async (id) => {
    console.log('---API--- : getPaisByCodigoPais');
    const url = `${port}/pais/${id}/getPaisByCodigoPais`;
    const response = await consumer(url, 'get');
    return response;
};
export const registerPais = async (body) => {
    console.log('---API--- : registerPais');
    const url = `${port}/pais/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updatePais = async ({body, id}) => {
    console.log('---API--- : updatePais');
    const url = `${port}/pais/${id}/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deletePais = async (c_paiscodigo) => {
    console.log('---API--- : deletePais');
    const url = `${port}/pais/${c_paiscodigo}/delete`;
    const response = await consumer(url, 'post', {});
    return response;
};
//Departamento
export const listDepartamentos = async () => {
    console.log('---API--- : listDepartamentos');
    const url = `${port}/departamento/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listAllDepartamentos = async () => {
    console.log('---API--- : listAllDepartamentos');
    const url = `${port}/departamento/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const getDepartamentoByCodigoDepartamento = async (body) => {
    console.log('---API--- : getDepartamentoByCodigoDepartamento');
    const url = `${port}/departamento/getDepartamentoByCodigoDepartamento`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const registerDepartamento = async (body) => {
    console.log('---API--- : registerDepartamento');
    const url = `${port}/departamento/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateDepartamento = async (body) => {
    console.log('---API--- : updateDepartamento');
    const url = `${port}/departamento/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deleteDepartamento = async (body) => {
    console.log('---API--- : deleteDepartamento');
    const url = `${port}/departamento/delete`;
    const response = await consumer(url, 'post', body);
    return response;
};
//Provincia
export const listProvincias = async () => {
    console.log('---API--- : listProvincias');
    const url = `${port}/provincia/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listAllProvincias = async () => {
    console.log('---API--- : listAllProvincias');
    const url = `${port}/provincia/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const getProvinciaByCodigoProvincia = async (body) => {
    console.log('---API--- : getProvinciaByCodigoProvincia');
    const url = `${port}/provincia/getProvinciaByCodigoProvincia`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const registerProvincia = async (body) => {
    console.log('---API--- : registerProvincia');
    const url = `${port}/provincia/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateProvincia = async (body) => {
    console.log('---API--- : updateProvincia');
    const url = `${port}/provincia/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deleteProvincia = async (body) => {
    console.log('---API--- : deleteProvincia');
    const url = `${port}/provincia/delete`;
    const response = await consumer(url, 'post', body);
    return response;
};
//Distrito
export const listDistritos = async () => {
    console.log('---API--- : listDistritos');
    const url = `${port}/distrito/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listAllDistritos = async () => {
    console.log('---API--- : listAllDistritos');
    const url = `${port}/distrito/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const getDistritoByCodigoDistrito = async (body) => {
    console.log('---API--- : getDistritoByCodigoDistrito');
    const url = `${port}/distrito/getDistritoByCodigoDistrito`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const registerDistrito = async (body) => {
    console.log('---API--- : registerDistrito');
    const url = `${port}/distrito/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateDistrito = async (body) => {
    console.log('---API--- : updateDistrito');
    const url = `${port}/distrito/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deleteDistrito = async (body) => {
    console.log('---API--- : deleteDistrito');
    const url = `${port}/distrito/delete`;
    const response = await consumer(url, 'post', body);
    return response;
};
//Agencia
export const listAgencias = async (body) => {
    console.log('---API--- : listAgencias');
    const url = `${port}/agencia/list`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const listAllAgencias = async () => {
    console.log('---API--- : listAllAgencias');
    const url = `${port}/agencia/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const registerAgencia = async (body) => {
    console.log('---API--- : registerAgencia');
    const url = `${port}/agencia/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateAgencia = async (body) => {
    console.log('---API--- : updateAgencia');
    const url = `${port}/agencia/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const getAgenciaByCodigoAgencia = async (body) => {
    console.log('---API--- : getAgenciaByCodigoAgencia');
    const url = `${port}/agencia/getAgenciaByCodigoAgencia`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const deleteAgencia = async (body) => {
    console.log('---API--- : deleteAgencia');
    const url = `${port}/agencia/delete`;
    const response = await consumer(url, 'post', body);
    return response;
};
//Parametro
export const listParametrosByCompania = async (c_codigocompania) => {
    console.log('---API--- : listParametros');
    const url = `${port}/parametros/${c_codigocompania}/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listAllParametros = async () => {
    console.log('---API--- : listAllParametros');
    const url = `${port}/parametros/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const registerParametro = async (body) => {
    console.log('---API--- : registerParametro');
    const url = `${port}/parametros/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateParametro = async (body) => {
    console.log('---API--- : updateParametro');
    const url = `${port}/parametros/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const getParametrosByCodigoParametros = async (body) => {
    console.log('---API--- : getParametrosByCodigoParametros');
    const url = `${port}/parametros/getParametrosByCodigoParametros`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const deleteParametro = async (body) => {
    console.log('---API--- : deleteParametro');
    const url = `${port}/parametros/delete`;
    const response = await consumer(url, 'post', body);
    return response;
};
//Peridos
export const listPeriodosByCompania = async (c_codigocompania) => {
    console.log('---API--- : listPeriodos');
    const url = `${port}/${c_codigocompania}/periodos/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listAllPeriodos = async () => {
    console.log('---API--- : listAllPeriodos');
    const url = `${port}/periodos/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const registerPeriodo = async (body) => {
    console.log('---API--- : registerPeriodo');
    const url = `${port}/periodos/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updatePeriodo = async (body) => {
    console.log('---API--- : updatePeriodo');
    const url = `${port}/periodos/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const getPeriodosByCodigoPeriodos = async (body) => {
    console.log('---API--- : getPeriodosByCodigoPeriodos');
    const url = `${port}/periodos/getPeriodosByCodigoPeriodos`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const deletePeriodos = async (body) => {
    console.log('---API--- : deletePeriodos');
    const url = `${port}/periodos/delete`;
    const response = await consumer(url, 'post', body);
    return response;
};
//Clientes
export const getClienteByCodigoCliente = async (body) => {
    console.log('---API--- : getClienteByCodigoCliente');
    const url = `${port}/cliente/getClienteByCodigoCliente`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getClienteDinamico = async (body) => {
    console.log('---API--- : getClienteDinamico');
    const url = `${port}/cliente/getClienteDinamico`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const registerCliente = async (body) => {
    console.log('---API--- : registerCliente');
    const url = `${port}/cliente/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateCliente = async (body) => {
    console.log('---API--- : updateCliente');
    const url = `${port}/cliente/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
//Prestamos
export const registerPrestamo = async (body) => {
    console.log('---API--- : registerPrestamo');
    const url = `${port}/prestamo/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updatePrestamo = async (body) => {
    console.log('---API--- : updatePrestamo');
    const url = `${port}/prestamo/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const validateTipos = async (body) => {
    console.log('---API--- : validateTipos');
    const url = `${port}/prestamo/validateTipos`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const validateUnidades = async (body) => {
    console.log('---API--- : validateUnidades');
    const url = `${port}/prestamo/validateUnidades`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getPrestamoDinamico = async (body) => {
    console.log('---API--- : getPrestamoDinamico');
    const url = `${port}/prestamo/getPrestamoDinamico`;
    const response = await consumer(url, 'post', body);
    return response;
};