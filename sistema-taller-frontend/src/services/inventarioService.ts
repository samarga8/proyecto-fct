import axios from "axios";
import baseUrl from "./helper";
import { InventarioDTO } from "@/models/inventario_dao/InventarioDTO";
import { MovimientoStockDTO } from "@/models/inventario_dao/MovimientoStockDTO";
import { DetalleProductoDTO } from "@/models/inventario_dao/DetalleProductoDTO";


export const listarProductos = async (): Promise<InventarioDTO[]> => {
  try {
    const response = await axios.get(`${baseUrl}/inventario`); 
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al obtener la lista de productos');
  }
};


// Función para agregar un nuevo producto al inventario
export const agregarProducto = async (producto: Omit<InventarioDTO, 'id'>): Promise<InventarioDTO> => {
  try {
    const response = await axios.post(`${baseUrl}/inventario/agregar`, producto);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al agregar el producto');
  }
};

// Función para eliminar un producto del inventario
export const eliminarProducto = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${baseUrl}/inventario/${id}`);
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al eliminar el producto');
  }
};

// Función para obtener un producto por su ID (versión básica)
export const obtenerProductoPorId = async (id: number): Promise<InventarioDTO> => {
  try {
    const response = await axios.get(`${baseUrl}/inventario/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al obtener el producto');
  }
};

// Función para obtener el detalle completo de un producto por su ID
export const obtenerDetalleProducto = async (id: number): Promise<DetalleProductoDTO> => {
  // Validar que el ID sea un número válido
  if (isNaN(id)) {
    throw new Error('ID de producto no válido');
  }
  
  try {
    const response = await axios.get(`${baseUrl}/inventario/detalle/${id}`);
    console.log("Respuesta completa de la API:", response);
    
    // Asegurarse de que historialMovimientos siempre sea un array
    const data = response.data;
    if (!data.historialMovimientos) {
      data.historialMovimientos = [];
    }
    
    // Asegurarse de que stockActual siempre tenga un valor
    data.stockActual = data.stockActual ?? 0; 
    
    return data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al obtener el detalle del producto');
  }
};

// Función para actualizar el stock de un producto
export const actualizarStock = async (movimiento: MovimientoStockDTO): Promise<InventarioDTO> => {
  try {
    const response = await axios.post(`${baseUrl}/inventario/stock`, movimiento);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al actualizar el stock del producto');
  }
};

// Función para actualizar un producto existente
export const actualizarProducto = async (id: number, producto: InventarioDTO): Promise<InventarioDTO> => {
  try {
    const response = await axios.put(`${baseUrl}/inventario/actualizar/${id}`, producto);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Error al actualizar el producto');
  }
};