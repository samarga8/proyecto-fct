package com.sistema.taller.model.dao;

import java.time.LocalDate;
import java.util.List;

import com.sistema.taller.model.EstadoFactura;

public class FiltrosFacturacionDTO {
    

    private List<EstadoFactura> estado;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Long clienteId;
    private String busqueda;
    public List<EstadoFactura> getEstado() {
        return estado;
    }
    public void setEstado(List<EstadoFactura> estado) {
        this.estado = estado;
    }
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    public LocalDate getFechaFin() {
        return fechaFin;
    }
    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
    public Long getClienteId() {
        return clienteId;
    }
    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }
    public String getBusqueda() {
        return busqueda;
    }
    public void setBusqueda(String busqueda) {
        this.busqueda = busqueda;
    }

    
}
