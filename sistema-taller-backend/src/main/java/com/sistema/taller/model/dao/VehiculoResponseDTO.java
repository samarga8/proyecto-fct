package com.sistema.taller.model.dao;

import com.sistema.taller.model.dao.cliente_dao.ClienteSimpleDTO;

public class VehiculoResponseDTO {
    private Long id;
    private String marca;
    private String modelo;
    private String matricula;
    private Integer anio;
    private Integer kilometraje;
    private String color;
    private ClienteSimpleDTO cliente;
    private String combustible;
    private String transmision;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }
    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }
    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }
    public Integer getKilometraje() { return kilometraje; }
    public void setKilometraje(Integer kilometraje) { this.kilometraje = kilometraje; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
 
    public ClienteSimpleDTO getCliente() { return cliente; }
    public void setCliente(ClienteSimpleDTO cliente) { this.cliente = cliente; }
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

    
} 