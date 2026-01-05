package com.sistema.taller.model.dao;

import java.math.BigDecimal;

public class PiezaMovimientoDTO {

    private Long movimientoId;
    private Long piezaId;
    private String nombrePieza;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subTotal;
    public Long getMovimientoId() {
        return movimientoId;
    }
    public void setMovimientoId(Long movimientoId) {
        this.movimientoId = movimientoId;
    }
    public Long getPiezaId() {
        return piezaId;
    }
    public void setPiezaId(Long piezaId) {
        this.piezaId = piezaId;
    }
    public String getNombrePieza() {
        return nombrePieza;
    }
    public void setNombrePieza(String nombrePieza) {
        this.nombrePieza = nombrePieza;
    }
    public Integer getCantidad() {
        return cantidad;
    }
    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }
    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
    public BigDecimal getSubTotal() {
        return subTotal;
    }
    public void setSubTotal(BigDecimal subTotal) {
        this.subTotal = subTotal;
    }

    
}
