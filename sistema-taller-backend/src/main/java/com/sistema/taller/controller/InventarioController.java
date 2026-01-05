package com.sistema.taller.controller;

import com.sistema.taller.model.Inventario;
import com.sistema.taller.model.dao.DetalleProductoDTO;
import com.sistema.taller.model.dao.InventarioDTO;
import com.sistema.taller.model.dao.MovimientoStockDTO;
import com.sistema.taller.service.InventarioServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventario")
@CrossOrigin("*")
public class InventarioController {

    @Autowired
    private InventarioServiceImpl inventarioService;

    @GetMapping
    public ResponseEntity<List<InventarioDTO>> listarProductos() {
        List<InventarioDTO> productos = inventarioService.listarProductos();
        return ResponseEntity.ok(productos); // Devuelve [] si está vacía
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventarioDTO> obtenerProducto(@PathVariable Long id) {
        InventarioDTO producto = inventarioService.obtenerProductoPorId(id);
        if (producto != null) {
            return ResponseEntity.ok(producto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/agregar")
    public ResponseEntity<Inventario> agregarProducto(@RequestBody InventarioDTO dto) {
        Inventario nuevoProducto = inventarioService.agregarProducto(dto);
        return ResponseEntity.ok(nuevoProducto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        inventarioService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/detalle/{id}")
    public ResponseEntity<DetalleProductoDTO> obtenerDetalleProducto(@PathVariable Long id) {
        DetalleProductoDTO detalle = inventarioService.obtenerDetalleProducto(id);
        return ResponseEntity.ok(detalle);
    }

    @PutMapping("actualizar/{id}")
    public ResponseEntity<InventarioDTO> actualizarProducto(
            @PathVariable Long id,
            @RequestBody InventarioDTO dto) {

        InventarioDTO actualizado = inventarioService.actualizarProducto(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @PostMapping("/stock")
    public ResponseEntity<InventarioDTO> actualizarStock(@RequestBody MovimientoStockDTO movimiento) {
        InventarioDTO actualizado = inventarioService.actualizarStock(movimiento);
        return ResponseEntity.ok(actualizado);
    }
}