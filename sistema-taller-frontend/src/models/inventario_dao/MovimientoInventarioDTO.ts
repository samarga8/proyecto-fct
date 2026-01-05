export interface MovimientoInventarioDTO {
  id: number;
  tipo: string; // Entrada o Salida
  cantidad: number;
  descripcion: string;
  fecha: string;
}