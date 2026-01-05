package com.sistema.taller.model.dao;

import java.time.LocalDate;
import java.util.List;

import com.sistema.taller.model.EstadoOrden;

public class FiltrosOrdenesDTO {
    private List<EstadoOrden> estado;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Long clienteId;
    private Long empleadoId;
    private Boolean esUrgente;
    private String busqueda;
    public List<EstadoOrden> getEstado() {
        return estado;
    }
    public void setEstado(List<EstadoOrden> estado) {
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
    public Long getEmpleadoId() {
        return empleadoId;
    }
    public void setEmpleadoId(Long empleadoId) {
        this.empleadoId = empleadoId;
    }
    public Boolean getEsUrgente() {
        return esUrgente;
    }
    public void setEsUrgente(Boolean esUrgente) {
        this.esUrgente = esUrgente;
    }
    public String getBusqueda() {
        return busqueda;
    }
    public void setBusqueda(String busqueda) {
        this.busqueda = busqueda;
    }


    
}
