package com.sistema.taller.model.dao;

import com.sistema.taller.model.EstadoOrden;

public class ActualizarEstadoOrdenDTO {
    private Long ordenId;
    private EstadoOrden nuevoEstado;
    private String observaciones;
    private Long empleadoId;

    
    public Long getOrdenId() {
        return ordenId;
    }
    public void setOrdenId(Long ordenId) {
        this.ordenId = ordenId;
    }
    public EstadoOrden getNuevoEstado() {
        return nuevoEstado;
    }
    public void setNuevoEstado(EstadoOrden nuevoEstado) {
        this.nuevoEstado = nuevoEstado;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public Long getEmpleadoId() {
        return empleadoId;
    }
    public void setEmpleadoId(Long empleadoId) {
        this.empleadoId = empleadoId;
    }

    
}
