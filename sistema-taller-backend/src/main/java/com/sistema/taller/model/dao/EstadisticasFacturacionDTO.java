package com.sistema.taller.model.dao;

import java.math.BigDecimal;

public class EstadisticasFacturacionDTO {
    
    private BigDecimal totalFacturadoMes;
    private BigDecimal totalPendiente;
    private BigDecimal totalVencido;
    private int facturasPendientes;
    private int facturasVencidas;
    private double porcentajeCambioMes;

    
    public EstadisticasFacturacionDTO(BigDecimal totalFacturadoMes, BigDecimal totalPendiente,
                                  BigDecimal totalVencido, int facturasPendientes,
                                  int facturasVencidas, double porcentajeCambioMes) {
    this.totalFacturadoMes = totalFacturadoMes;
    this.totalPendiente = totalPendiente;
    this.totalVencido = totalVencido;
    this.facturasPendientes = facturasPendientes;
    this.facturasVencidas = facturasVencidas;
    this.porcentajeCambioMes = porcentajeCambioMes;
}

    public BigDecimal getTotalFacturadoMes() {
        return totalFacturadoMes;
    }
    public void setTotalFacturadoMes(BigDecimal totalFacturadoMes) {
        this.totalFacturadoMes = totalFacturadoMes;
    }
    public BigDecimal getTotalPendiente() {
        return totalPendiente;
    }
    public void setTotalPendiente(BigDecimal totalPendiente) {
        this.totalPendiente = totalPendiente;
    }
    public BigDecimal getTotalVencido() {
        return totalVencido;
    }
    public void setTotalVencido(BigDecimal totalVencido) {
        this.totalVencido = totalVencido;
    }
    public int getFacturasPendientes() {
        return facturasPendientes;
    }
    public void setFacturasPendientes(int facturasPendientes) {
        this.facturasPendientes = facturasPendientes;
    }
    public int getFacturasVencidas() {
        return facturasVencidas;
    }
    public void setFacturasVencidas(int facturasVencidas) {
        this.facturasVencidas = facturasVencidas;
    }
    public double getPorcentajeCambioMes() {
        return porcentajeCambioMes;
    }
    public void setPorcentajeCambioMes(double porcentajeCambioMes) {
        this.porcentajeCambioMes = porcentajeCambioMes;
    }

    
}
