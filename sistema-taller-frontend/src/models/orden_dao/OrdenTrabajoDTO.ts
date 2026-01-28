import { ServicioOrdenDTO } from "../servicio_dao/ServicioOrdenDTO";

export interface OrdenTrabajoDTO {
  id: string;
  numeroOrden: string;
  clienteId: number;
  clienteNombre: string;
  vehiculoId: number;
  vehiculoInfo: string; 
  empleadoId: number;
  tecnicoNombre: string;
  fecha: string;
  fechaCreacion: Date;
  fechaFinalizacion?: Date;
  servicio: string; 
  servicios: ServicioOrdenDTO[];
  estado: EstadoOrden;
  esUrgente: boolean;
  descripcion: string;
  totalGeneral?: number;
  observaciones?: string;
}

export type EstadoOrden = "ORIGINAR" | "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA" | "PAUSADA";
