package com.sistema.taller.model.dao;

import java.math.BigDecimal;

public class IngresoMensualDTO {
    
    private String mes;
    private int anio;
    private BigDecimal ingresos;
    private int servicios;
    private int facturas;
    public IngresoMensualDTO(String displayName, int year, double total, long servicios2, int size) {
        
    }
    public String getMes() {
        return mes;
    }
    public void setMes(String mes) {
        this.mes = mes;
    }
    public int getAnio() {
        return anio;
    }
    public void setAnio(int anio) {
        this.anio = anio;
    }
    public BigDecimal getIngresos() {
        return ingresos;
    }
    public void setIngresos(BigDecimal ingresos) {
        this.ingresos = ingresos;
    }
    public int getServicios() {
        return servicios;
    }
    public void setServicios(int servicios) {
        this.servicios = servicios;
    }
    public int getFacturas() {
        return facturas;
    }
    public void setFacturas(int facturas) {
        this.facturas = facturas;
    }

    
}
