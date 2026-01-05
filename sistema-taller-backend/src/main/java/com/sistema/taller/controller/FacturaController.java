package com.sistema.taller.controller;

import com.sistema.taller.model.Factura;
import com.sistema.taller.model.dao.EstadisticasFacturacionDTO;
import com.sistema.taller.model.dao.FacturaDTO;
import com.sistema.taller.model.dao.FacturaDetalleDTO;
import com.sistema.taller.model.dao.FiltrosFacturacionDTO;
import com.sistema.taller.model.dao.IngresoMensualDTO;
import com.sistema.taller.model.dao.RespuestaFacturacionDTO;
import com.sistema.taller.service.FacturaServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/facturas")
@CrossOrigin("*")
public class FacturaController {

    @Autowired
    private FacturaServiceImpl facturaService;


    @PostMapping
    public Factura crear(@RequestBody FacturaDTO dto) {
        return facturaService.crearFactura(dto);
    }

   

    @GetMapping
    public List<FacturaDTO> obtenerTodas() {
        return facturaService.obtenerTodas();
    }


    @GetMapping("/{id}")
    public FacturaDetalleDTO obtenerPorId(@PathVariable long id) {
        return facturaService.obtenerFacturaDetallePorId(id);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        facturaService.eliminarFactura(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/filtrar")
    public RespuestaFacturacionDTO filtrar(@RequestBody FiltrosFacturacionDTO filtros) {
        return facturaService.filtrarFacturas(filtros);
    }

    @GetMapping("/estadisticas")
    public EstadisticasFacturacionDTO estadisticas() {
        return facturaService.obtenerEstadisticas();
    }

    @GetMapping("/ingresos-mensuales")
    public List<IngresoMensualDTO> ingresosMensuales() {
        return facturaService.obtenerIngresosMensuales();
    }

 
}
