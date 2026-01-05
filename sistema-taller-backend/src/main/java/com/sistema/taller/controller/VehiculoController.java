package com.sistema.taller.controller;

import com.sistema.taller.model.Vehiculo;
import com.sistema.taller.model.dao.VehiculoRegistroDTO;
import com.sistema.taller.model.dao.VehiculoResponseDTO;
import com.sistema.taller.service.VehiculoServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/vehiculos")
@CrossOrigin("*")
public class VehiculoController {

    @Autowired
    private VehiculoServiceImpl vehiculoService;

    @PostMapping("/nuevoVehiculo")
    public ResponseEntity<?> guardarNuevoVehiculo(@RequestBody VehiculoRegistroDTO dto) {
        try {
            vehiculoService.guardarVehiculo(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("mensaje", "Vehículo registrado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<VehiculoResponseDTO>> listarVehiculos() {
        List<VehiculoResponseDTO> vehiculos = vehiculoService.listarTodosLosVehiculos();
        return ResponseEntity.ok(vehiculos);
    }

    @GetMapping("/obtener/{id}")
    public ResponseEntity<?> obtenerVehiculoPorId(@PathVariable Long id) {
        try {
            VehiculoResponseDTO vehiculo = vehiculoService.obtenerVehiculoPorId(id);
            if (vehiculo != null) {
                return ResponseEntity.ok(vehiculo);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Vehículo no encontrado con ID: " + id));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener el vehículo: " + e.getMessage()));
        }
    }

    @GetMapping("/obtenerPorMatricula/{matricula}")
    public ResponseEntity<?> obtenerVehiculoPorMatricula(@PathVariable String matricula) {
        try {
            Vehiculo vehiculo = vehiculoService.obtenerVehiculoPorMatricula(matricula);
            return ResponseEntity.ok(vehiculo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Vehiculo>> obtenerVehiculosPorCliente(@PathVariable Long clienteId) {
        List<Vehiculo> vehiculos = vehiculoService.obtenerVehiculosPorCliente(clienteId);
        return ResponseEntity.ok(vehiculos);
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<?> actualizarVehiculo(@PathVariable Long id, @RequestBody Vehiculo vehiculo) {
        try {
            Vehiculo vehiculoActualizado = vehiculoService.actualizarVehiculo(id, vehiculo);
            return ResponseEntity.ok(vehiculoActualizado);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar el vehículo"));
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarVehiculo(@PathVariable Long id) {
        try {
            vehiculoService.eliminarVehiculo(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
