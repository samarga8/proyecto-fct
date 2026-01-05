import { EstadoOrden } from "./OrdenTrabajoDTO";
import { PiezaOrdenDTO } from "./PiezaOrdenDTO";

export interface OrdenDetalleDTO {
  id:number;
  numeroOrden: string;
  fechaCreacion: Date;
  nombreCliente: string;
  nombreVehiculo: string;
  kilometraje: number;
  tecnicoAsignado: string;
  empleadoId:number;
  estado: EstadoOrden;
  fechaFinalizada: Date;
  descripcion:string;
  materiales: number; 
  manoDeObra: number; 
  subtotal: number;   
  totalGeneral: number;
  piezas: PiezaOrdenDTO[];
}