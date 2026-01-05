package com.sistema.taller.model.dao;

import java.util.List;

public class RespuestaFacturacionDTO {
    

    private List<FacturaDTO> facturas;
    private EstadisticasFacturacionDTO estadisticas;
    private long total;

    
    public RespuestaFacturacionDTO(List<FacturaDTO> facturaDTOs, EstadisticasFacturacionDTO estadisticas2, int size) {
        //TODO Auto-generated constructor stub
    }
    public List<FacturaDTO> getFacturas() {
        return facturas;
    }
    public void setFacturas(List<FacturaDTO> facturas) {
        this.facturas = facturas;
    }
    public EstadisticasFacturacionDTO getEstadisticas() {
        return estadisticas;
    }
    public void setEstadisticas(EstadisticasFacturacionDTO estadisticas) {
        this.estadisticas = estadisticas;
    }
    public long getTotal() {
        return total;
    }
    public void setTotal(long total) {
        this.total = total;
    }

    
}
