export interface ServicioOrdenDTO {
  servicioId: number;
  nombre: string;
  precio: number;
  cantidad?: number;
  subtotal?: number;
  tipo?: string;
}