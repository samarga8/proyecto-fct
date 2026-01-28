package com.sistema.taller.model.dao;

import com.sistema.taller.model.EstadoOrden;
import com.sistema.taller.model.dao.cliente_dao.ClienteSimpleDTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public class CitaDTO {
    private Long id;
    private Long clienteId;
    private Long vehiculoId;
    private String fecha;
    private String hora;
    private String servicio;
    private String descripcion;
    @Enumerated(EnumType.STRING)
    private EstadoOrden estadoOrden;
    private ClienteSimpleDTO cliente;
    private VehiculoResponseDTO vehiculo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getVehiculoId() {
        return vehiculoId;
    }

    public void setVehiculoId(Long vehiculoId) {
        this.vehiculoId = vehiculoId;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public String getServicio() {
        return servicio;
    }

    public void setServicio(String servicio) {
        this.servicio = servicio;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public ClienteSimpleDTO getCliente() {
        return cliente;
    }

    public void setCliente(ClienteSimpleDTO cliente) {
        this.cliente = cliente;
    }

    public VehiculoResponseDTO getVehiculo() {
        return vehiculo;
    }

    public void setVehiculo(VehiculoResponseDTO vehiculo) {
        this.vehiculo = vehiculo;
    }

    public EstadoOrden getEstadoOrden() {
        return estadoOrden;
    }

    public void setEstadoOrden(EstadoOrden estadoOrden) {
        this.estadoOrden = estadoOrden;
    }
}
