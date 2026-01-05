package com.sistema.taller.model.dao;

import java.math.BigDecimal;
import java.time.LocalDate;

import java.util.List;


public class OrdenServicioDTO {

    private Long clienteId;
    private Long vehiculoId;
    private Long empleadoId;
    private LocalDate fecha;
    private Boolean esUrgente;
    private String descripcion;
    private List<ServicioOrdenDTO> servicios;
    private List<PiezaOrdenDTO> piezas; 

    private BigDecimal totalServicios;
    private BigDecimal totalPiezas;
    private BigDecimal subtotal;

    private BigDecimal totalGeneral;

    // Getters y Setters

    public Long getVehiculoId() {
        return vehiculoId;
    }

    public void setVehiculoId(Long vehiculoId) {
        this.vehiculoId = vehiculoId;
    }

    public Long getEmpleadoId() {
        return empleadoId;
    }

    public void setEmpleadoId(Long empleadoId) {
        this.empleadoId = empleadoId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

  

    public Boolean getEsUrgente() {
        return esUrgente;
    }

    public void setEsUrgente(Boolean esUrgente) {
        this.esUrgente = esUrgente;
    }

    public List<ServicioOrdenDTO> getServicios() {
        return servicios;
    }

    public void setServicios(List<ServicioOrdenDTO> servicios) {
        this.servicios = servicios;
    }

    public List<PiezaOrdenDTO> getPiezas() {
        return piezas;
    }

    public void setPiezas(List<PiezaOrdenDTO> piezas) {
        this.piezas = piezas;
    }

    

    public BigDecimal getTotalServicios() {
        return totalServicios;
    }

    public void setTotalServicios(BigDecimal totalServicios) {
        this.totalServicios = totalServicios;
    }

    public BigDecimal getTotalPiezas() {
        return totalPiezas;
    }

    public void setTotalPiezas(BigDecimal totalPiezas) {
        this.totalPiezas = totalPiezas;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getTotalGeneral() {
        return totalGeneral;
    }

    public void setTotalGeneral(BigDecimal totalGeneral) {
        this.totalGeneral = totalGeneral;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
