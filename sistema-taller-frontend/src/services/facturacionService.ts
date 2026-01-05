import axios from "axios";
import baseUrl from "./helper";
import { 
  FacturaDTO, 
  EstadisticasFacturacionDTO, 
  IngresoMensualDTO, 
  EmailFacturaDTO
} from "../models/factura_dao/FacturaDTO";
import { FacturaDetalleDTO } from "../models/factura_dao/FacturaDTO"; 


export const obtenerFacturaPorId = async (id: string): Promise<FacturaDetalleDTO> => {
  try {
    const response = await axios.get(`${baseUrl}/facturas/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Factura no encontrada');
    }
    throw new Error('Error al obtener la factura');
  }
};

// Obtener estadísticas de facturación
export const obtenerEstadisticasFacturacion = async (): Promise<EstadisticasFacturacionDTO> => {
  try {
    const response = await axios.get(`${baseUrl}/facturas/estadisticas`);
    return response.data;
  } catch (error: any) {
    throw new Error('Error al obtener las estadísticas de facturación');
  }
};

// Obtener ingresos mensuales
export const obtenerIngresosMensuales = async (anio?: number): Promise<IngresoMensualDTO[]> => {
  try {
    const params = anio ? `?anio=${anio}` : '';
    const response = await axios.get(`${baseUrl}/facturas/ingresos-mensuales${params}`);
    return response.data;
  } catch (error: any) {
    throw new Error('Error al obtener los ingresos mensuales');
  }
};

// Crear nueva factura
export const crearFactura = async (facturaData: Partial<FacturaDTO>): Promise<FacturaDTO> => {
  try {
    const response = await axios.post(`${baseUrl}/facturas`, facturaData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al crear la factura');
  }
};

// Actualizar estado de factura
export const actualizarEstadoFactura = async (id: string, estado: string): Promise<FacturaDTO> => {
  try {
    const response = await axios.patch(`${baseUrl}/facturas/${id}/estado`, { estado });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al actualizar el estado de la factura');
  }
};

// Registrar pago de factura
export const registrarPagoFactura = async (id: string, datosPago: { metodoPago: string; fechaPago: Date; observaciones?: string }): Promise<FacturaDTO> => {
  try {
    const response = await axios.post(`${baseUrl}/facturas/${id}/pago`, datosPago);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al registrar el pago');
  }
};


// Obtener todas las facturas 
export const obtenerTodas = async (): Promise<FacturaDTO[]> => {
  try {
    const response = await axios.get(`${baseUrl}/facturas`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al obtener todas las facturas');
  }
};

// Enviar factura por email
export const enviarFacturaPorEmail = async (datosEmail: EmailFacturaDTO): Promise<void> => {
  try {
    await axios.post(`${baseUrl}/email/enviar-factura`, datosEmail);
  } catch (error: any) {
    throw new Error('Error al enviar la factura por email');
  }
};