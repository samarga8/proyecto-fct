package com.sistema.taller.model.dao;

import java.time.LocalDate;

public class MovimientoInventarioDTO {

    private Long id;
    private String tipo; // Entrada o Salida
    private Integer cantidad;
    private String descripcion;
    private LocalDate fecha;

    public MovimientoInventarioDTO(Long id, String tipo, Integer cantidad, String descripcion, LocalDate fecha) {
        this.id = id;
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.descripcion = descripcion;
        this.fecha = fecha;
    }

    public MovimientoInventarioDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

}
