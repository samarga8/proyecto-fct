package com.sistema.taller.controller;

import com.sistema.taller.model.Cliente;
import com.sistema.taller.model.dao.VehiculoResponseDTO;
import com.sistema.taller.model.dao.cliente_dao.ClienteRegistroDTO;
import com.sistema.taller.model.dao.cliente_dao.ClienteResponseDTO;
import com.sistema.taller.service.ClienteServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/clientes")
@CrossOrigin("*")
public class ClienteController {

    @Autowired
    private ClienteServiceImpl service;

    @PostMapping("/nuevoCliente")
    public ResponseEntity<?> guardarNuevaPersona(@RequestBody ClienteRegistroDTO dto) {

        try {
            Cliente clienteGuardado = service.registrarCliente(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(clienteGuardado);
        } catch (IllegalArgumentException e) {
            // Cliente duplicado
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al guardar el cliente."));
        }
    }
    @GetMapping("/listar")
    public ResponseEntity<List<ClienteResponseDTO>> listarClientes() {
        return ResponseEntity.ok(service.listarClientes());
    }
    @GetMapping("/obtener/{dni}")
    public ResponseEntity<Cliente> obtenerCliente(@PathVariable String dni) {

        try {
            return new ResponseEntity<>(service.obtenerCliente(dni), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/obtenerCliente/{id}")
    public ResponseEntity<Cliente> obtenerClientePorId(@PathVariable long id) {

        try {
            return new ResponseEntity<>(service.findById(id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/{clienteId}/vehiculos")
    public List<VehiculoResponseDTO> getVehiculosPorCliente(@PathVariable long clienteId) {
        return service.obtenerVehiculosPorCliente(clienteId);
    }
    @PutMapping("/editarCliente/{id}")
    public ResponseEntity<?> actualizarCliente(@PathVariable long id, @RequestBody Cliente cliente) {
        try {
            cliente.setId(id);
            Cliente clienteActualizado = service.actualizarCliente(cliente);
            return ResponseEntity.ok(clienteActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar el cliente: " + e.getMessage()));
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarCliente(@PathVariable long id) {
        try {
            service.eliminarCliente(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al eliminar el cliente: " + e.getMessage()));
        }
    }

}