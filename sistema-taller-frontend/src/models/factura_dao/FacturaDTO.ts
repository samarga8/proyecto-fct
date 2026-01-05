import { PiezaMovimientoDTO } from "../inventario_dao/PiezaMovimientoDTO";
import { ServicioOrdenDTO } from "../servicio_dao/ServicioOrdenDTO";

export interface FacturaDetalleDTO {
  id: number;
  numeroFactura: string;
  fecha: Date;
  fechaVencimiento: Date;
  subtotal: number;
  impuestos: number;
  total: number;
  estadoFactura: string;
  metodoPago?: string;
  notas?: string;

  // Cliente
  clienteNombreCompleto: string;
  clienteDireccion: string;
  clienteTelefono: string;
  clienteEmail: string;

  // Vehículo
  vehiculoMarca: string;
  vehiculoModelo: string;
  vehiculoAno: number;
  vehiculoMatricula: string;

  // Orden y servicios
  ordenId: number;
  ordenNumero: string;
  servicios: ServicioOrdenDTO[];

  piezas: PiezaMovimientoDTO[];
}

export interface FacturaDTO {
  id: string;
  numeroFactura?: string;
  clienteId: number;
  clienteNombre: string;
  clienteEmail: string;
  vehiculoId: number;
  vehiculoInfo: string;
  ordenTrabajoId?: string;
  fecha: string;
  fechaVencimiento: string;
  subtotal: number;
  impuestos?: number;
  total: number;
  estadoFactura: EstadoFactura;
  metodoPago?: string;
  notas?: string;
  fechaCreacion?: Date;
  fechaPago?: Date;
  servicios?: ServicioOrdenDTO[]; 
}

export type EstadoFactura = "PAGADA" | "PENDIENTE" | "VENCIDA" | "CANCELADA";

export interface EstadisticasFacturacionDTO {
  totalFacturadoMes: number;
  totalPendiente: number;
  totalVencido: number;
  facturasPendientes: number;
  facturasVencidas: number;
  porcentajeCambioMes: number;
}

export interface IngresoMensualDTO {
  mes: string;
  anio: number;
  ingresos: number;
  servicios: number;
  facturas: number;
}


export interface EmailFacturaDTO {
  email: string;
  asunto: string;
  facturaId: string;
  
  // Datos para la plantilla
  clienteNombre: string;
  clienteDireccion: string;
  clienteEmail: string;
  clienteTelefono: string;
  
  numeroFactura: string;
  fechaFactura: string;
  
  lineas: EmailLineaDTO[];
  
  iva: number;
  subtotal: number;
  total: number;
}

// Interfaces para el envío de email
export interface EmailLineaDTO {
  concepto: string;
  cantidad: number;
  precio: number;
  total: number;
}