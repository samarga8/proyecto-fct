package com.sistema.taller.model.dao;

import java.math.BigDecimal;

public class PiezaOrdenDTO {
    
    private long piezaId;

    private String nombre;

    private BigDecimal precio;

    private int cantidad;


    public long getPiezaId() {
        return piezaId;
    }

    public void setPiezaId(long piezaId) {
        this.piezaId = piezaId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }


    
}
