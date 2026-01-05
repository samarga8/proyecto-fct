import { ICliente } from "../cliente_dao/ICliente";

export interface IVehiculo {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  matricula: string;
  color: string;
  kilometraje: number;
  combustible?: string; 
  transmision?: string; 
  estadoVehiculo:string
  cliente: ICliente;
}
