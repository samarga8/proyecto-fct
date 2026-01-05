import axios from "axios";
import baseUrl from "./helper";
import { IVehiculo } from "@/models/vehiculo_dao/IVehiculo";

// Interfaz para el registro de vehículos
export interface VehiculoRegistroDTO {
  marca: string;
  modelo: string;
  anio: number;
  matricula: string;
  color: string;
  kilometraje: number;
  dni: string;
  combustible?: string;
  transmision?: string;
}

// Función para registrar un nuevo vehículo
export const guardarVehiculo = async (vehiculoData: VehiculoRegistroDTO) => {
  try {
    const response = await axios.post(`${baseUrl}/vehiculos/nuevoVehiculo`, vehiculoData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al registrar el vehículo');
  }
};

// Función para obtener todos los vehículos
export const listarVehiculos = async () => {
  try {
    const response = await axios.get(`${baseUrl}/vehiculos/listar`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener la lista de vehículos');
  }
};

// Función para obtener un vehículo por ID
export const obtenerVehiculoPorId = async (id: number) => {
  try {
    const response = await axios.get(`${baseUrl}/vehiculos/obtener/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('Vehículo no encontrado');
    }
    throw new Error('Error al obtener el vehículo');
  }
};

// Función para obtener un vehículo por matrícula
export const obtenerVehiculoPorMatricula = async (matricula: string) => {
  try {
    const response = await axios.get(`${baseUrl}/vehiculos/obtenerPorMatricula/${matricula}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('Vehículo no encontrado');
    }
    throw new Error('Error al obtener el vehículo');
  }
};

// Función para obtener los vehículos de un cliente
export const obtenerVehiculosPorCliente = async (clienteId: number) => {
  try {
    const response = await axios.get(`${baseUrl}/vehiculos/cliente/${clienteId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los vehículos del cliente');
  }
};

// Función para actualizar un vehículo
export const actualizarVehiculo = async (id: number, vehiculo: IVehiculo) => {
  try {
    const response = await axios.put(`${baseUrl}/vehiculos/editar/${id}`, vehiculo);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al actualizar el vehículo');
  }
};

// Función para eliminar un vehículo
export const eliminarVehiculo = async (id: number) => {
  try {
    await axios.delete(`${baseUrl}/vehiculos/eliminar/${id}`);
    return true;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al eliminar el vehículo');
  }
};