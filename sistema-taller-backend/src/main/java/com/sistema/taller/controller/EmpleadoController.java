package com.sistema.taller.controller;

import com.sistema.taller.model.Empleado;
import com.sistema.taller.model.dao.EmpleadoDTO;
import com.sistema.taller.model.dao.EmpleadoRegistroDTO;
import com.sistema.taller.service.EmpleadoServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/empleados")
@CrossOrigin("*")
public class EmpleadoController {

    @Autowired
    private EmpleadoServiceImpl service;

    @PostMapping("/")
    public ResponseEntity<?> registrarEmpleado( @RequestBody EmpleadoRegistroDTO empleadoDTO) {
        
        try {
            Empleado nuevoEmpleado = service.guardarEmpleado(empleadoDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Empleado registrado correctamente");
            response.put("empleado", nuevoEmpleado);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of("Error al registrar empleado: " + e.getMessage()));
        }
    }

    @GetMapping("/tecnicos")
    public ResponseEntity<List<EmpleadoDTO>> getAllEmpleados(){
        return new ResponseEntity<>(service.listarEmpleados(),HttpStatus.OK);
    }


    @GetMapping("/{email}")
    public ResponseEntity<Empleado> obtenerEmpleado(@PathVariable String email) {
        return new ResponseEntity<>(service.obtenerEmpleado(email), HttpStatus.OK);
    }

   
}
