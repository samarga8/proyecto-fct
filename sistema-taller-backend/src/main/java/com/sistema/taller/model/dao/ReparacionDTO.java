package com.sistema.taller.model.dao;

import java.time.LocalDateTime;

public class ReparacionDTO {

    private Long id;
    private VehiculoResponseDTO vehiculo;
    private String tipoServicio;
    private String descripcion;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaEstimadaFin;

    private String tecnicoAsignado;
    private String prioridad;
    private Boolean notificarCliente;
    private String estado;
    private Integer progreso;

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public VehiculoResponseDTO getVehiculo() {
        return vehiculo;
    }

    public void setVehiculo(VehiculoResponseDTO vehiculo) {
        this.vehiculo = vehiculo;
    }



    public String getTipoServicio() {
        return tipoServicio;
    }

    public void setTipoServicio(String tipoServicio) {
        this.tipoServicio = tipoServicio;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDateTime getFechaEstimadaFin() {
        return fechaEstimadaFin;
    }

    public void setFechaEstimadaFin(LocalDateTime fechaEstimadaFin) {
        this.fechaEstimadaFin = fechaEstimadaFin;
    }

 

    public String getTecnicoAsignado() {
        return tecnicoAsignado;
    }

    public void setTecnicoAsignado(String tecnicoAsignado) {
        this.tecnicoAsignado = tecnicoAsignado;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public Boolean getNotificarCliente() {
        return notificarCliente;
    }

    public void setNotificarCliente(Boolean notificarCliente) {
        this.notificarCliente = notificarCliente;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getProgreso() {
        return progreso;
    }

    public void setProgreso(Integer progreso) {
        this.progreso = progreso;
    }
}

