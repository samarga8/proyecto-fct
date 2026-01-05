package com.sistema.taller.model.dao;


import java.time.LocalDate;

public class ResumenFinancieroDTO {
    private Double totalFacturado;
    private Double totalPagado;
    private Double totalPendiente;
    private LocalDate fechaUltimaFactura;
    private String ultimoConcepto;
    private int totalFacturas;

    public Double getTotalFacturado() {
        return totalFacturado;
    }

    public void setTotalFacturado(Double totalFacturado) {
        this.totalFacturado = totalFacturado;
    }

    public Double getTotalPagado() {
        return totalPagado;
    }

    public void setTotalPagado(Double totalPagado) {
        this.totalPagado = totalPagado;
    }

    public Double getTotalPendiente() {
        return totalPendiente;
    }

    public void setTotalPendiente(Double totalPendiente) {
        this.totalPendiente = totalPendiente;
    }

    public LocalDate getFechaUltimaFactura() {
        return fechaUltimaFactura;
    }

    public void setFechaUltimaFactura(LocalDate fechaUltimaFactura) {
        this.fechaUltimaFactura = fechaUltimaFactura;
    }

    public String getUltimoConcepto() {
        return ultimoConcepto;
    }

    public void setUltimoConcepto(String ultimoConcepto) {
        this.ultimoConcepto = ultimoConcepto;
    }

    public int getTotalFacturas() {
        return totalFacturas;
    }

    public void setTotalFacturas(int totalFacturas) {
        this.totalFacturas = totalFacturas;
    }
}
