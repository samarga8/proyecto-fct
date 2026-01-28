import { ICliente } from "../cliente_dao/ICliente";
import { IVehiculo } from "../vehiculo_dao/IVehiculo";

export interface CitaDTO {
  id: number;
  clienteId: number;
  vehiculoId: number;
  fecha: string;
  hora: string;
  servicio: string;
  estadoOrden?: string;
  descripcion?: string;
  cliente?: ICliente;
  vehiculo?: IVehiculo;

}

export interface FiltrosCitasDTO {
  fecha?: string;
  clienteId?: number;
  vehiculoId?: number;
  busqueda?: string;
}

export interface RespuestaCitasDTO {
  citas: CitaDTO[];
  total: number;
}