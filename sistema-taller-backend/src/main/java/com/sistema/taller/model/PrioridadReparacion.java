package com.sistema.taller.model;

public enum PrioridadReparacion {
    BAJA("Baja"),
    NORMAL("Normal"),
    ALTA("Alta"),
    URGENTE("Urgente");

    private final String descripcion;

    PrioridadReparacion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}