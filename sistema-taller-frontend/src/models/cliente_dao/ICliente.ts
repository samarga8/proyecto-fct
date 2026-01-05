import { IVehiculo } from "../vehiculo_dao/IVehiculo";

export interface ICliente {
  id: number;
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion: string;
  dni: string;
  vehiculos?: IVehiculo[]
}