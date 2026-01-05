import axios from "axios";
import baseUrl from "./helper";
import { OrdenServicioDTO } from "../models/orden_dao/OrdenServicioDTO";
import { OrdenTrabajoDTO } from "../models/orden_dao/OrdenTrabajoDTO";
import { EstadisticasOrdenesDTO } from "../models/orden_dao/EstadisticasOrdenesDTO";
import { FiltrosOrdenesDTO, RespuestaOrdenesDTO } from "@/models/orden_dao/FiltrosOrdenesDTO";
import { ActualizarEstadoOrdenDTO } from "@/models/orden_dao/ActualizarEstadoOrdenDTO";
import { ServicioOrdenDTO } from "@/models/servicio_dao/ServicioOrdenDTO";
import { OrdenDetalleDTO } from "@/models/orden_dao/OrdenDetalleDTO";

// Función para crear una nueva orden de servicio
export const crearOrdenServicio = async (ordenData: OrdenServicioDTO) => {
  try {
    const response = await axios.post(`${baseUrl}/ordenes/crear`, ordenData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al crear la orden de servicio');
  }
};


export const listarOrdenes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/ordenes/listar`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener la lista de órdenes');
  }
};


// Función para obtener todas las órdenes de trabajo con filtros
export const listarOrdenesTrabajo = async (filtros?: FiltrosOrdenesDTO): Promise<RespuestaOrdenesDTO> => {
  try {
    const params = new URLSearchParams();
    
    if (filtros) {
      if (filtros.estado && filtros.estado.length > 0) {
        params.append('estados', filtros.estado.join(','));
      }
      if (filtros.fechaInicio) {
        params.append('fechaInicio', filtros.fechaInicio.toISOString());
      }
      if (filtros.fechaFin) {
        params.append('fechaFin', filtros.fechaFin.toISOString());
      }
      if (filtros.clienteId) {
        params.append('clienteId', filtros.clienteId.toString());
      }
      if (filtros.empleadoId) {
        params.append('empleadoId', filtros.empleadoId.toString());
      }
      if (filtros.esUrgente !== undefined) {
        params.append('esUrgente', filtros.esUrgente.toString());
      }
      if (filtros.busqueda) {
        params.append('busqueda', filtros.busqueda);
      }
    }
    
    const response = await axios.get(`${baseUrl}/ordenes/trabajo?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener las órdenes de trabajo');
  }
};

// Función para obtener estadísticas de órdenes
export const obtenerEstadisticasOrdenes = async (): Promise<EstadisticasOrdenesDTO> => {
  try {
    const response = await axios.get(`${baseUrl}/ordenes/estadisticas`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener las estadísticas de órdenes');
  }
};

// Función para actualizar el estado de una orden
export const actualizarEstadoOrden = async (datos: ActualizarEstadoOrdenDTO): Promise<OrdenTrabajoDTO> => {
  try {
    const response = await axios.patch(`${baseUrl}/ordenes/trabajo/${datos.ordenId}/estado`, {
      nuevoEstado: datos.nuevoEstado,
      observaciones: datos.observaciones,
      empleadoId: datos.empleadoId
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al actualizar el estado de la orden');
  }
};


// Función para obtener servicios por vehículo
export const obtenerServiciosPorVehiculo = async (vehiculoId: number) => {
  try {
    const response = await axios.get(`${baseUrl}/servicios/por-vehiculo/${vehiculoId}`);
    
    // Adaptar los datos del backend a la estructura que espera el frontend
    return response.data.map((item: any) => ({
      id: item.servicioId || item.id,
      fecha: item.fecha || new Date().toLocaleDateString(),
      tipo: item.tipo || "Servicio",
      descripcion: item.nombre || item.descripcion || "",
      costo: item.precio || 0, // Mapear precio a costo
      estado: item.estado || "Completado"
    }));
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('No se encontraron servicios para este vehículo');
    }
    throw new Error('Error al obtener los servicios del vehículo');
  }
};


// Función para obtener todos los servicios disponibles
export const listarServicios = async (): Promise<ServicioOrdenDTO[]> => {
  try {
    const response = await axios.get(`${baseUrl}/servicios/listar`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('No se encontraron servicios disponibles');
    }
    throw new Error('Error al obtener la lista de servicios');
  }
};

// Función para obtener órdenes por vehículo
export const obtenerOrdenesPorVehiculo = async (vehiculoId: number): Promise<OrdenTrabajoDTO[]> => {
  try {
    const response = await axios.get(`${baseUrl}/ordenes/por-vehiculo/${vehiculoId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('No se encontraron órdenes para este vehículo');
    }
    throw new Error('Error al obtener las órdenes del vehículo');
  }
};

export const asignarTecnico = async (ordenId: string,empleadoId: number,observaciones?: string): Promise<OrdenTrabajoDTO> => {
  try {
    const response = await axios.patch(
      `${baseUrl}/ordenes/trabajo/${ordenId}/estado`,
      {
        empleadoId,
        observaciones: observaciones ?? 'Técnico asignado manualmente'
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error('Error al asignar técnico a la orden');
  }
};

// Función para obtener detalles de orden en formato OrdenDetalleDTO
export const obtenerDetalleOrden = async (ordenId: string): Promise<OrdenDetalleDTO> => {
  try {
    const response = await axios.get(`${baseUrl}/ordenes/detalle/${ordenId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('Orden no encontrada');
    }
    throw new Error('Error al obtener los detalles de la orden');
  }
};


