import { ClienteRegistroDTO } from "@/models/cliente_dao/ClienteRegistroDTO";
import baseUrl from "./helper";
import { ICliente } from "@/models/cliente_dao/ICliente";
import axios from "axios";

export const registrarCliente = async (clienteData: ClienteRegistroDTO) => {
  try {
    const response = await axios.post(`${baseUrl}/clientes/nuevoCliente`, clienteData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      throw new Error(error.response.data.error || 'El cliente ya existe');
    }
    throw new Error('Error al registrar el cliente');
  }
};

// Función para obtener todos los clientes
export const listarClientes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/clientes/listar`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener la lista de clientes');
  }
};

// Función para obtener un cliente por DNI
export const obtenerClientePorDni = async (dni: string) => {
  try {
    const response = await axios.get(`${baseUrl}/clientes/obtener/${dni}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('Cliente no encontrado');
    }
    throw new Error('Error al obtener el cliente');
  }
};

// Función para obtener un cliente por ID
export const obtenerClientePorId = async (id: number) => {
  try {
    const response = await axios.get(`${baseUrl}/clientes/obtenerCliente/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('Cliente no encontrado');
    }
    throw new Error('Error al obtener el cliente');
  }
};

// Función para obtener los vehículos de un cliente
export const obtenerVehiculosPorCliente = async (clienteId: number) => {
  try {
    const response = await axios.get(`${baseUrl}/clientes/${clienteId}/vehiculos`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los vehículos del cliente');
  }
};

// Función para actualizar un cliente
export const actualizarCliente = async (id: number, clienteData: ICliente) => {
  try {
    const response = await axios.put(`${baseUrl}/clientes/editarCliente/${id}`, clienteData);
    return response.data;
  } catch (error) {
    throw new Error('Error al actualizar el cliente');
  }
};

// Función para eliminar un cliente
export const eliminarCliente = async (id: number) => {
  try {
    await axios.delete(`${baseUrl}/clientes/eliminar/${id}`);
    return true;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 409) {
        // Cliente con relaciones existentes
        throw new Error(error.response.data.error || 'No se puede eliminar el cliente porque tiene elementos asociados');
      } else if (error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
    }
    throw new Error('Error al eliminar el cliente');
  }
};