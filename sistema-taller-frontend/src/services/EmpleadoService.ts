import axios from "axios";
import baseUrl from "./helper";
import { IEmpleado } from "@/models/empleado_dao/IEmpleado";

// Función para obtener un empleado por ID
export const obtenerEmpleadoPorId = async (id: number): Promise<IEmpleado> => {
  try {
    const response = await axios.get(`${baseUrl}/empleados/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('Empleado no encontrado');
    }
    throw new Error('Error al obtener el empleado');
  }
};


// Función para obtener mecanicos
export const obtenerTecnicos = async (): Promise<IEmpleado[]> => {
  try {
    const response = await axios.get(`${baseUrl}/empleados/tecnicos`);
    return response.data;
  } catch (error: any) {
    throw new Error('Error al obtener la lista de técnicos');
  }
};