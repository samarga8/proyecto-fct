package com.sistema.taller.controller;


import com.sistema.taller.model.dao.ServicioOrdenDTO;
import com.sistema.taller.service.ServicioServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/servicios")
@CrossOrigin("*")
public class ServicioController {

    @Autowired
    private ServicioServiceImpl servicioService;

    

    @GetMapping("/por-vehiculo/{vehiculoId}")
    public ResponseEntity<List<ServicioOrdenDTO>> getServiciosPorVehiculo(@PathVariable Long vehiculoId) {
        List<ServicioOrdenDTO> servicios = servicioService.obtenerServiciosPorVehiculo(vehiculoId);
        if (servicios.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {

            return ResponseEntity.ok(servicios);
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<ServicioOrdenDTO>> listarServicios(){
        List<ServicioOrdenDTO> servicios = servicioService.listarServicios();
        if (servicios.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {

            return ResponseEntity.ok(servicios);
        }
    }
        
} 