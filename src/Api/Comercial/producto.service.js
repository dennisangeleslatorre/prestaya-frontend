import { consumer } from "../Api";
const port = process.env.REACT_APP_API_BASE_URL;

//Productos
export const actualizarDatosUbicacionSubtipo = async (body) => {
  console.log("---API--- : actualizarDatosUbicacionSubtipo");
  const url = `${port}/producto/actualizarDatosUbicacionSubtipo`;
  const response = await consumer(url, "put", body);
  return response;
};
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