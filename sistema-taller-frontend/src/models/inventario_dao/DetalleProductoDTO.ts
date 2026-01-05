import { MovimientoInventarioDTO } from "./MovimientoInventarioDTO";

export interface DetalleProductoDTO {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  costo: number | null;
  stockMinimo: number;
  stockInicial: number;
  stockActual?: number;
  estado: string;
  ubicacion: string;
  proveedor: string;
  fechaCreacion: string;
  descripcion: string;
  historialMovimientos?: MovimientoInventarioDTO[];
}