package com.sistema.taller.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sistema.taller.model.dao.CitaDTO;
import com.sistema.taller.model.dao.FiltrosCitasDTO;
import com.sistema.taller.service.CitaService;

@RestController
@CrossOrigin("*")
@RequestMapping("/citas")
public class CitaController {

    @Autowired
    private CitaService citaService;

    @GetMapping("/listar")
    public List<CitaDTO> listarCitas() {
        return citaService.listarCitas();
    }


    @PostMapping("/crear")
    public ResponseEntity<CitaDTO> crearCita(@RequestBody CitaDTO citaDTO) {
        CitaDTO nuevaCita = citaService.crearCita(citaDTO);
        return ResponseEntity.status(201).body(nuevaCita); 
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<CitaDTO> actualizarCita(@PathVariable Long id, @RequestBody CitaDTO citaDTO) {
        CitaDTO citaActualizada = citaService.actualizarCita(id, citaDTO);
        return ResponseEntity.ok(citaActualizada); 
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarCita(@PathVariable Long id) {
        citaService.eliminarCita(id);
        return ResponseEntity.noContent().build(); 
    }

     @PostMapping("/filtrar")
    public ResponseEntity<List<CitaDTO>> filtrarCitas(@RequestBody FiltrosCitasDTO filtros) {
        List<CitaDTO> citasFiltradas = citaService.filtrarCitas(filtros);
        return ResponseEntity.ok(citasFiltradas);
    }

     @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<CitaDTO>> listarCitasPorFecha(@PathVariable String fecha) {
        List<CitaDTO> citas = citaService.listarCitasPorFecha(fecha);
        return ResponseEntity.ok(citas);
    }
}
