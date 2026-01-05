package com.sistema.taller.model.dao;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class VehiculoRegistroDTO {

    @NotNull
    private String marca;

    @NotNull
    private String modelo;


    @NotNull
    private String matricula;

    @NotNull
    private Integer anio;

    @NotNull
    private String color;

    @NotNull
    private Integer kilometraje;

    @NotNull
    private String combustible;

    @NotNull
    private String transmision;

    @NotNull(message = "El DNI no puede ser nulo")
    @Pattern(regexp = "\\d{8}[A-HJ-NP-TV-Z]", message = "Formato de DNI inválido")
    private String dni;

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public String getColor() {
        return color;
    }
    public void setColor(String color) {
        this.color = color;
    }
    public Integer getKilometraje() {
        return kilometraje;
    }
    public void setKilometraje(Integer kilometraje) {
        this.kilometraje = kilometraje;
    }
    public String getCombustible() {
        return combustible;
    }
    public void setCombustible(String combustible) {
        this.combustible = combustible;
    }
    public String getTransmision() {
        return transmision;
    }
    public void setTransmision(String transmision) {
        this.transmision = transmision;
    }
    public String getDni() {
        return dni;
    }
    public void setDni(String dni) {
        this.dni = dni;
    }
}