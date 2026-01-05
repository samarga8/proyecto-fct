package com.sistema.taller.model.dao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sistema.taller.model.EstadoOrden;

public class OrdenDetalleDTO {

    private long id;
    private String numeroOrden;
    private LocalDate fechaCreacion;
    private String nombreCliente;
    private String nombreVehiculo;
    private Integer kilometraje;
    private String tecnicoAsignado;
    private long empleadoId;
    private LocalDate fechaFinalizada;

    private EstadoOrden estado;
    private String descripcion;
    private BigDecimal materiales;
    private BigDecimal manoDeObra;
    private BigDecimal subtotal;
    private BigDecimal totalGeneral;

    @JsonProperty("piezas") 
    private List<PiezaOrdenDTO> piezasUtilizadas;

    public String getNumeroOrden() {
        return numeroOrden;
    }

    public void setNumeroOrden(String numeroOrden) {
        this.numeroOrden = numeroOrden;
    }

    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getNombreVehiculo() {
        return nombreVehiculo;
    }

    public void setNombreVehiculo(String nombreVehiculo) {
        this.nombreVehiculo = nombreVehiculo;
    }

    public Integer getKilometraje() {
        return kilometraje;
    }

    public void setKilometraje(Integer kilometraje) {
        this.kilometraje = kilometraje;
    }

    public String getTecnicoAsignado() {
        return tecnicoAsignado;
    }

    public void setTecnicoAsignado(String tecnicoAsignado) {
        this.tecnicoAsignado = tecnicoAsignado;
    }

    public LocalDate getFechaFinalizada() {
        return fechaFinalizada;
    }

    public void setFechaFinalizada(LocalDate fechaFinalizada) {
        this.fechaFinalizada = fechaFinalizada;
    }

    public BigDecimal getMateriales() {
        return materiales;
    }

    public void setMateriales(BigDecimal materiales) {
        this.materiales = materiales;
    }

    public BigDecimal getManoDeObra() {
        return manoDeObra;
    }

    public void setManoDeObra(BigDecimal manoDeObra) {
        this.manoDeObra = manoDeObra;
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

    public EstadoOrden getEstado() {
        return estado;
    }

    public void setEstado(EstadoOrden estado) {
        this.estado = estado;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<PiezaOrdenDTO> getPiezasUtilizadas() {
        return piezasUtilizadas;
    }

    public void setPiezasUtilizadas(List<PiezaOrdenDTO> piezasUtilizadas) {
        this.piezasUtilizadas = piezasUtilizadas;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getEmpleadoId() {
        return empleadoId;
    }

    public void setEmpleadoId(long empleadoId) {
        this.empleadoId = empleadoId;
    }

}
