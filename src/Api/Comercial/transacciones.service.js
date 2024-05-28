import { consumer } from "../Api";
const port = process.env.REACT_APP_API_BASE_URL;

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
export const postTransaccionProductoSalida = async (body) => {
    console.log('---API--- : postTransaccionProductoSalida');
    const url = `${port}/transaccion/postTransaccionProductoSalida`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const postTransaccionProductoIngreso = async (body) => {
    console.log('---API--- : postTransaccionProductoIngreso');
    const url = `${port}/transaccion/postTransaccionProductoIngreso`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateTransaccionAnular = async (body) => {
    console.log('---API--- : updateTransaccionAnular');
    const url = `${port}/transaccion/updateTransaccionAnular`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const getTransaccionesPorConfirmar = async (body) => {
    console.log('---API--- : getTransaccionesPorConfirmar');
    const url = `${port}/transaccion/getTransaccionesPorConfirmar`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const postConfirmarTransaccionProductoSalida = async (body) => {
    console.log('---API--- : postConfirmarTransaccionProductoSalida');
    const url = `${port}/transaccion/postConfirmarTransaccionProductoSalida`;
    const response = await consumer(url, 'post', body);
    return response;
}
export const postConfirmarTransaccionProductoSalidaOtraAgencia = async (body) => {
    console.log('---API--- : postConfirmarTransaccionProductoSalidaOtraAgencia');
    const url = `${port}/transaccion/postConfirmarTransaccionProductoSalidaOtraAgencia`;
    const response = await consumer(url, 'post', body);
    return response;
}