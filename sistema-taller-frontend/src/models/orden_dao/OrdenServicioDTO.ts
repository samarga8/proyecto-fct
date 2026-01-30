import { ServicioOrdenDTO } from "../servicio_dao/ServicioOrdenDTO";
import { PiezaOrdenDTO } from "./PiezaOrdenDTO";
import { EstadoOrden } from "./OrdenTrabajoDTO";

export interface OrdenServicioDTO {
  id?: string;
  clienteId: number;
  vehiculoId: number;
  empleadoId?: number; 
  fecha: Date;
  esUrgente: boolean;
  descripcion:string,
  estado:EstadoOrden,
  servicios: ServicioOrdenDTO[];
  piezas?: PiezaOrdenDTO[]; 
  totalServicios?: number;
  totalPiezas?: number;
  subtotal?: number;
  totalGeneral?: number;
}
