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
    console.log('---API--- : registerUser');
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
export const listAgenciesByUserAndCompany = async (body) => {
    console.log('---API--- : listAgenciesByUserAndCompany');
    const url = `${port}/user/getAgenciaXUsuarioAndCompany`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const listAgenciesByUser = async (body) => {
    console.log('---API--- : listAgenciesByUser');
    const url = `${port}/user/getAllAgenciesOfUser`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const assignAgenciesToUser = async (body) => {
    console.log('---API--- : assignAgenciesToUser');
    const url = `${port}/user/assignAgentXUsers`;
    const response = await consumer(url, 'post', body);
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
//Subtipo producto
export const listSubtiposProductoActivos = async () => {
    console.log('---API--- : listSubtiposProductoActivos');
    const url = `${port}/subtipoproducto/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listAllSubtiposProducto = async () => {
    console.log('---API--- : listAllSubtiposProducto');
    const url = `${port}/subtipoproducto/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const getSubtipoProductoByTipo = async (c_tipoproducto) => {
    console.log('---API--- : getSubtipoProductoByTipo');
    const url = `${port}/subtipoproducto/get/${c_tipoproducto}`;
    const response = await consumer(url, 'get');
    return response;
}
export const getSubtipoProductoByCodigo = async (body) => {
    console.log('---API--- : getSubtipoProductoByCodigo');
    const url = `${port}/subtipoproducto/show`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const registerSubtipoProducto = async (body) => {
    console.log('---API--- : registerSubtipoProducto');
    const url = `${port}/subtipoproducto/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateSubtipoProducto = async (body) => {
    console.log('---API--- : updateSubtipoProducto');
    const url = `${port}/subtipoproducto/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deleteSubtipoProducto = async (body) => {
    console .log("BODY", body)
    console.log('---API--- : deleteSubtipoProducto');
    const url = `${port}/subtipoproducto/delete`;
    const response = await consumer(url, 'post', body);
    return response;
};
//Tipo Movimiento caja
export const listTipoMovimientoCaja = async () => {
    console.log('---API--- : listTipoMovimientoCaja');
    const url = `${port}/tipomovimientocaja/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listAllTipoMovimientoCaja = async () => {
    console.log('---API--- : listAllTipoMovimientoCaja');
    const url = `${port}/tipomovimientocaja/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const getTipoMovimientoCajaByCodigoTipoMovimientoCaja = async (id) => {
    console.log('---API--- : getTipoMovimientoCajaByCodigoTipoMovimientoCaja');
    const url = `${port}/tipomovimientocaja/${id}/getTipoMovimientoCajaByCodigoTipoMovimientoCaja`;
    const response = await consumer(url, 'get');
    return response;
};
export const registerTipoMovimientoCaja = async (body) => {
    console.log('---API--- : registerTipoMovimientoCaja');
    const url = `${port}/tipomovimientocaja/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateTipoMovimientoCaja = async ({body, id}) => {
    console.log('---API--- : updateTipoMovimientoCaja');
    const url = `${port}/tipomovimientocaja/${id}/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deleteTipoMovimientoCaja = async (c_tipoproducto) => {
    console.log('---API--- : deleteTipoMovimientoCaja');
    const url = `${port}/tipomovimientocaja/${c_tipoproducto}/delete`;
    const response = await consumer(url, 'post', {});
    return response;
};
// Tipo movimiento caja tienda
export const listTipoMovimientoCajaTienda = async () => {
    console.log('---API--- : listTipoMovimientoCajaTienda');
    const url = `${port}/tipomovimientocajatienda/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const listAllTipoMovimientoCajaTienda = async () => {
    console.log('---API--- : listAllTipoMovimientoCajaTienda');
    const url = `${port}/tipomovimientocajatienda/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const getTipoMovimientoCajaTiendaByCodigo = async (id) => {
    console.log('---API--- : getTipoMovimientoCajaTiendaByCodigo');
    const url = `${port}/tipomovimientocajatienda/${id}/show`;
    const response = await consumer(url, 'get');
    return response;
};
export const registerTipoMovimientoCajaTienda = async (body) => {
    console.log('---API--- : registerTipoMovimientoCajaTienda');
    const url = `${port}/tipomovimientocajatienda/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateTipoMovimientoCajaTienda = async ({body, id}) => {
    console.log('---API--- : updateTipoMovimientoCajaTienda');
    const url = `${port}/tipomovimientocajatienda/${id}/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deleteTipoMovimientoCajaTienda = async (c_tipomovimientoctd) => {
    console.log('---API--- : deleteTipoMovimientoCajaTienda');
    const url = `${port}/tipomovimientocajatienda/${c_tipomovimientoctd}/delete`;
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
export const getCompaniaToFormato = async (id) => {
    console.log('---API--- : getCompaniaToFormato');
    const url = `${port}/compania/${id}/getCompaniaToFormato`;
    const response = await consumer(url, 'get');
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
export const getAgenciaAndCompaniaByCodigo = async (body) => {
    console.log('---API--- : getAgenciaAndCompaniaByCodigo');
    const url = `${port}/agencia/getAgenciaAndCompaniaByCodigo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const deleteAgencia = async (body) => {
    console.log('---API--- : deleteAgencia');
    const url = `${port}/agencia/delete`;
    const response = await consumer(url, 'post', body);
    return response;
};
//Ubicacion
export const listAllUbicaciones = async () => {
    console.log('---API--- : listAllUbicaciones');
    const url = `${port}/ubicacion/listAll`;
    const response = await consumer(url, 'get');
    return response;
};
export const listUbicacionesByCodigo = async (body) => {
    console.log('---API--- : listUbicacionesByCodigo');
    const url = `${port}/ubicacion/listUbicacionesByCodigo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getAgenciaUbicacionByCodigo = async (body) => {
    console.log('---API--- : getAgenciaUbicacionByCodigo');
    const url = `${port}/ubicacion/getAgenciaUbicacionByCodigo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const registerUbicacion = async (body) => {
    console.log('---API--- : registerUbicacion');
    const url = `${port}/ubicacion/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateUbicacion = async (body) => {
    console.log('---API--- : updateUbicacion');
    const url = `${port}/ubicacion/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deleteUbicacion = async (body) => {
    console.log('---API--- : deleteUbicacion');
    const url = `${port}/ubicacion/delete`;
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
export const getParametroSession = async () => {
    console.log('---API--- : getParametroSession');
    const url = `${port}/parametros/getParametroSession`;
    const response = await consumer(url, 'get');
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
export const deleteCliente = async (body) => {
    console.log('---API--- : deleteCliente');
    const url = `${port}/cliente/delete`;
    const response = await consumer(url, 'post', body);
    return response;
};
//Prestamos
export const obtenerDatosFormatoPrestamo = async (body) => {
    console.log('---API--- : obtenerDatosFormatoPrestamo');
    const url = `${port}/prestamo/obtenerDatosFormatoPrestamo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getPrestamoByCodigoPrestamo = async (body) => {
    console.log('---API--- : getPrestamoByCodigoPrestamo');
    const url = `${port}/prestamo/getPrestamoByCodigoPrestamo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getPrestamoByCodigoPrestamoParaTicket = async (body) => {
    console.log('---API--- : getPrestamoByCodigoPrestamoParaTicket');
    const url = `${port}/prestamo/getPrestamoByCodigoPrestamoParaTicket`;
    const response = await consumer(url, 'post', body);
    return response;
};
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
export const obtenerSaldoPrestamo = async (body) => {
    console.log('---API--- : obtenerSaldoPrestamo');
    const url = `${port}/prestamo/obtenerSaldoPrestamo`;
    const response = await consumer(url, 'post', body);
    return response;
};
//ANULAR
export const anularPrestamo = async (body) => {
    console.log('---API--- : anularPrestamo');
    const url = `${port}/prestamo/anularPrestamo`;
    const response = await consumer(url, 'put', body);
    return response;
};
//VIGENTE
export const updtVigentePrestamo = async (body) => {
    console.log('---API--- : updtVigentePrestamo');
    const url = `${port}/prestamo/updtVigentePrestamo`;
    const response = await consumer(url, 'put', body);
    return response;
};
//RETORNAR PENDIENTE
export const validarRetornarPendiente = async (body) => {
    console.log('---API--- : validarRetornarPendiente');
    const url = `${port}/prestamo/validarRetornarPendiente`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const retornarPendiente = async (body) => {
    console.log('---API--- : retornarPendiente');
    const url = `${port}/prestamo/retornarPendiente`;
    const response = await consumer(url, 'put', body);
    return response;
};
//REMATE
export const validarFechaRemate = async (body) => {
    console.log('---API--- : validarFechaRemate');
    const url = `${port}/prestamo/validarFechaRemate`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const validarEstadoRemate = async (body) => {
    console.log('---API--- : validarEstadoRemate');
    const url = `${port}/prestamo/validarEstadoRemate`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const cambiarEstadoRemate = async (body) => {
    console.log('---API--- : cambiarEstadoRemate');
    const url = `${port}/prestamo/cambiarEstadoRemate`;
    const response = await consumer(url, 'put', body);
    return response;
};
//ENTREGAR
export const cambiarEstadoEntregar = async (body) => {
    console.log('---API--- : cambiarEstadoEntregar');
    const url = `${port}/prestamo/cambiarEstadoEntregar`;
    const response = await consumer(url, 'put', body);
    return response;
};
//RETORNA ENTREGA
export const retornarEntrega = async (body) => {
    console.log('---API--- : retornarEntrega');
    const url = `${port}/prestamo/retornarEntrega`;
    const response = await consumer(url, 'put', body);
    return response;
};
//RETORNAR REMATE
export const retornarRemate = async (body) => {
    console.log('---API--- : retornarRemate');
    const url = `${port}/prestamo/retornarRemate`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const obtenerDatosTicketVentaTercero = async (body) => {
    console.log('---API--- : obtenerDatosTicketVentaTercero');
    const url = `${port}/prestamo/obtenerDatosTicketVentaTercero`;
    const response = await consumer(url, 'post', body);
    return response;
};
//CANCELAR
export const getCancelacionesByCodigoPrestamo = async (body) => {
    console.log('---API--- : getCancelacionesByCodigoPrestamo');
    const url = `${port}/prestamo/getCancelacionesByCodigoPrestamo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getCancelacionesByNLinea = async (body) => {
    console.log('---API--- : getCancelacionesByNLinea');
    const url = `${port}/prestamo/getCancelacionesByNLinea`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const cancelarPrestamo = async (body) => {
    console.log('---API--- : cancelarPrestamo');
    const url = `${port}/prestamo/cancelarPrestamo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const anularCancelacion = async (body) => {
    console.log('---API--- : anularCancelacion');
    const url = `${port}/prestamo/anularCancelacion`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const obtenerDatosActaEntrega = async (body) => {
    console.log('---API--- : obtenerDatosActaEntrega');
    const url = `${port}/prestamo/obtenerDatosActaEntrega`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getValidaSufijoProducto = async (body) => {
    console.log('---API--- : getValidaSufijoProducto');
    const url = `${port}/prestamo/getValidaSufijoProducto`;
    const response = await consumer(url, 'post', body);
    return response;
};
//Validar Monto
export const getValidarAlertaMontoMaximo = async (body) => {
    console.log('---API--- : getValidarAlertaMontoMaximo');
    const url = `${port}/prestamo/getValidarAlertaMontoMaximo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getValidarMontoMaximoConfirMov = async (body) => {
    console.log('---API--- : getValidarMontoMaximoConfirMov');
    const url = `${port}/prestamo/getValidarMontoMaximoConfirMov`;
    const response = await consumer(url, 'post', body);
    return response;
};
//Productos
export const getProductosByPrestamo = async (body) => {
    console.log('---API--- : getProductosByPrestamo');
    const url = `${port}/prestamoproducto/getProductosByPrestamo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getProductosByFormato = async (body) => {
    console.log('---API--- : getProductosByFormato');
    const url = `${port}/prestamoproducto/getProductosByFormato`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateProductoUbicacion = async (body) => {
    console.log('---API--- : updateProductoUbicacion');
    const url = `${port}/prestamoproducto/updateProductoUbicacion`;
    const response = await consumer(url, 'post', body);
    return response;
};

//Reportes
export const getReportesByPerfil = async (body) => {
    console.log('---API--- : getReportesByPerfil');
    const url = `${port}/reporte/getReportesByPerfil`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getDataReporteResumidos = async (body) => {
    console.log('---API--- : getDataReporteResumidos');
    const url = `${port}/reporte/getDataReporteResumidos`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getDataReporteDetallado = async (body) => {
    console.log('---API--- : getDataReporteDetallado');
    const url = `${port}/reporte/getDataReporteDetallado`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getReportes = async () => {
    console.log('---API--- : getReportes');
    const url = `${port}/reporte/getReportes`;
    const response = await consumer(url, 'get');
    return response;
};
export const assignReportToProfile = async (body) => {
    console.log('---API--- : assignReportToProfile');
    const url = `${port}/reporte/assignReportToProfile`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getDataReporteFlujoCaja = async (body) => {
    console.log('---API--- : getDataReporteFlujoCaja');
    const url = `${port}/reporte/getDataReporteFlujoCaja`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getDataReporteVencidosyNoVencidos = async (body) => {
    console.log('---API--- : getDataReporteVencidosyNoVencidos');
    const url = `${port}/reporte/getDataReporteVencidosyNoVencidos`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getPrestamosDetalladoPeriodo = async (body) => {
    console.log('---API--- : getPrestamosDetalladoPeriodo');
    const url = `${port}/reporte/getPrestamosDetalladoPeriodo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getPrestamosUbicacionProducto = async (body) => {
    console.log('---API--- : getPrestamosUbicacionProducto');
    const url = `${port}/reporte/getPrestamosUbicacionProducto`;
    const response = await consumer(url, 'post', body);
    return response;
};
//Flujo Caja
export const registerFlujoCaja = async (body) => {
    console.log('---API--- : registerFlujoCaja');
    const url = `${port}/flujocaja/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateFlujoCaja = async (body) => {
    console.log('---API--- : updateFlujoCaja');
    const url = `${port}/flujocaja/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const getFlujoCajaByCodigo = async (body) => {
    console.log('---API--- : getFlujoCajaByCodigo');
    const url = `${port}/flujocaja/getFlujoCajaByCodigo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getFlujoCajaDinamico = async (body) => {
    console.log('---API--- : getFlujoCajaDinamico');
    const url = `${port}/flujocaja/getFlujoCajaDinamico`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getFlujoCajaDiasByCodigo = async (body) => {
    console.log('---API--- : getFlujoCajaDiasByCodigo');
    const url = `${port}/flujocaja/getFlujoCajaDiasByCodigo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getFlujoCajaMovimientosByCodigo = async (body) => {
    console.log('---API--- : getFlujoCajaMovimientosByCodigo');
    const url = `${port}/flujocaja/getFlujoCajaMovimientosByCodigo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getMovimientosCajaUsuarioxConfirmar = async (body) => {
    console.log('---API--- : getMovimientosCajaUsuarioxConfirmar');
    const url = `${port}/flujocaja/getMovimientosCajaUsuarioxConfirmar`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const confirmarMovimiento = async (body) => {
    console.log('---API--- : confirmarMovimiento');
    const url = `${port}/flujocaja/confirmarMovimiento`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getCajaUsuarioByAgenciaAndUsuario = async (body) => {
    console.log('---API--- : getCajaUsuarioByAgenciaAndUsuario');
    const url = `${port}/flujocaja/getCajaUsuarioByAgenciaAndUsuario`;
    const response = await consumer(url, 'post', body);
    return response;
};
//Flujo Caja Tienda
export const registerFlujoTienda = async (body) => {
    console.log('---API--- : registerFlujoTienda');
    const url = `${port}/flujocajatienda/registerFlujoTienda`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateFlujoCajaTienda = async (body) => {
    console.log('---API--- : updateFlujoCajaTienda');
    const url = `${port}/flujocajatienda/update`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const getFlujoCajaTiendaByCodigo = async (body) => {
    console.log('---API--- : getFlujoCajaTiendaByCodigo');
    const url = `${port}/flujocajatienda/getFlujoCajaByCodigo`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getFlujoCajaTiendaDinamico = async (body) => {
    console.log('---API--- : getFlujoCajaTiendaDinamico');
    const url = `${port}/flujocajatienda/getFlujoCajaTiendaDinamico`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getFlujoCajaTiendaDiaDinamico = async (body) => {
    console.log('---API--- : getFlujoCajaTiendaDiaDinamico');
    const url = `${port}/flujocajatienda/getFlujoCajaTiendaDiaDinamico`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getFlujoCajaTiendaDiaMovDinamico = async (body) => {
    console.log('---API--- : getFlujoCajaTiendaDiaMovDinamico');
    const url = `${port}/flujocajatienda/getFlujoCajaTiendaDiaMovDinamico`;
    const response = await consumer(url, 'post', body);
    return response;
};
//PRODUCTOS
export const getProductoDinamico = async (body) => {
    console.log('---API--- : getProductoDinamico');
    const url = `${port}/producto/getProductoDinamico`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getProductoStockDinamico = async (body) => {
    console.log('---API--- : getProductoStockDinamico');
    const url = `${port}/producto/getProductoStockDinamico`;
    const response = await consumer(url, 'post', body);
    return response;
};
//TRANSACCION
export const getTransaccionDinamico = async (body) => {
    console.log('---API--- : getTransaccionDinamico');
    const url = `${port}/transaccion/getTransaccionDinamico`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getTransaccionDetalle = async (body) => {
    console.log('---API--- : getTransaccionDetalle');
    const url = `${port}/transaccion/getTransaccionDetalle`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const getTransaccionCabecera = async (body) => {
    console.log('---API--- : getTransaccionCabecera');
    const url = `${port}/transaccion/getTransaccionCabecera`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const registerTransaccion = async (body) => {
    console.log('---API--- : registerTransaccion');
    const url = `${port}/transaccion/registerTransaccion`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateTransaccionAnular = async (body) => {
    console.log('---API--- : updateTransaccionAnular');
    const url = `${port}/transaccion/updateTransaccionAnular`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const getReporteTransaccion = async (body) => {
    console.log('---API--- : getReporteTransaccion');
    const url = `${port}/transaccion/getReporteTransaccion`;
    const response = await consumer(url, 'post', body);
    return response;
};