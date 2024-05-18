import { consumer } from "../Api";
const port = process.env.REACT_APP_API_BASE_URL;

//Productos
export const getProductosByPrestamo = async (body) => {
  console.log("---API--- : getProductosByPrestamo");
  const url = `${port}/prestamoproducto/getProductosByPrestamo`;
  const response = await consumer(url, "post", body);
  return response;
};
export const getProductosByFormato = async (body) => {
  console.log("---API--- : getProductosByFormato");
  const url = `${port}/prestamoproducto/getProductosByFormato`;
  const response = await consumer(url, "post", body);
  return response;
};
export const updateProductoUbicacion = async (body) => {
  console.log("---API--- : updateProductoUbicacion");
  const url = `${port}/prestamoproducto/updateProductoUbicacion`;
  const response = await consumer(url, "post", body);
  return response;
};