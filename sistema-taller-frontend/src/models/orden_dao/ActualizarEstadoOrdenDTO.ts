import { EstadoOrden } from './OrdenTrabajoDTO';

export interface ActualizarEstadoOrdenDTO {
  ordenId: string;
  nuevoEstado: EstadoOrden;
  observaciones?: string;
  empleadoId?: number;
}