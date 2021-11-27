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
        console.log(error);
        return {status};
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
export const registerUser = async () => {
    console.log('---API--- : listUsers');
    const url = `${port}/user/register`;
    const response = await consumer(url, 'get');
    return response;
};
export const updateUsers = async () => {
    console.log('---API--- : updateUsers');
    const url = `${port}/user/update/${body.c_codigousuario}`;
    const response = await consumer(url, 'get');
    return response;
};
//role
export const listRoles = async () => {
    console.log('---API--- : listRoles');
    const url = `${port}/role/list`;
    const response = await consumer(url, 'get');
    return response;
};
export const registerRole = async (body) => {
    console.log('---API--- : registerRole');
    const url = `${port}/role/register`;
    const response = await consumer(url, 'post', body);
    return response;
};
export const updateRole = async (body) => {
    console.log('---API--- : updateRole');
    const url = `${port}/role/update/${body.n_perfil}`;
    const response = await consumer(url, 'put', body);
    return response;
};
export const deleteRole = async (body) => {
    console.log('---API--- : deleteRole');
    const url = `/role/delete/${body.n_perfil}`;
    const response = await consumer(url, 'patch', body);
    return response;
};