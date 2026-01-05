package com.sistema.taller.model.dao;

public class EstadisticasOrdenesDTO {
    private long total;
    private long completadas;
    private long enProceso;
    private long canceladas;
    private long urgentes;
    public long getTotal() {
        return total;
    }
    public void setTotal(long total) {
        this.total = total;
    }
    public long getCompletadas() {
        return completadas;
    }
    public void setCompletadas(long completadas) {
        this.completadas = completadas;
    }
    public long getEnProceso() {
        return enProceso;
    }
    public void setEnProceso(long enProceso) {
        this.enProceso = enProceso;
    }
    public long getCanceladas() {
        return canceladas;
    }
    public void setCanceladas(long canceladas) {
        this.canceladas = canceladas;
    }
    public long getUrgentes() {
        return urgentes;
    }
    public void setUrgentes(long urgentes) {
        this.urgentes = urgentes;
    }

    
}
