package com.sistema.taller.model.dao;

import java.util.List;

public class RespuestaOrdenesDTO {
    private List<OrdenTrabajoDTO> ordenes;
    private long total;
    private int paginaActual;
    private int totalPaginas;
    private long totalFiltrado;
    public List<OrdenTrabajoDTO> getOrdenes() {
        return ordenes;
    }
    public void setOrdenes(List<OrdenTrabajoDTO> ordenes) {
        this.ordenes = ordenes;
    }
    public long getTotal() {
        return total;
    }
    public void setTotal(long total) {
        this.total = total;
    }
    public int getPaginaActual() {
        return paginaActual;
    }
    public void setPaginaActual(int paginaActual) {
        this.paginaActual = paginaActual;
    }
    public int getTotalPaginas() {
        return totalPaginas;
    }
    public void setTotalPaginas(int totalPaginas) {
        this.totalPaginas = totalPaginas;
    }
    public long getTotalFiltrado() {
        return totalFiltrado;
    }
    public void setTotalFiltrado(long totalFiltrado) {
        this.totalFiltrado = totalFiltrado;
    }

    
}
