export interface InventarioDTO {
  id: number;
  nombre: string;
  categoria: string;
  stockActual?: number;
  stockInicial: number;
  stockMinimo: number;
  precio?: number;
  costo?: number;
  ubicacion: string;
  estado?: string;
  proveedor: string;
  descripcion: string;
  fechaCreacion?: string;
}