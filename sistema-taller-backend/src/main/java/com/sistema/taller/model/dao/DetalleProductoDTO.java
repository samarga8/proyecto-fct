package com.sistema.taller.model.dao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;


public class DetalleProductoDTO  {
    private Long id;
    private String nombre;
    private String categoria;
    private BigDecimal precio;
    private BigDecimal costo;
    private Integer stockMinimo;
    private Integer stockInicial;
    private Integer stockActual;
    private String estado;
    private String ubicacion;
    private String proveedor;
    private String documento;
    private LocalDate fechaCreacion;
    private String descripcion;

    private List<MovimientoInventarioDTO> historialMovimientos;

   

    public DetalleProductoDTO(
        Long id, String nombre, String categoria, BigDecimal precio,BigDecimal costo,
        Integer stockMinimo, Integer stockInicial, Integer stockActual,
        String estado, String ubicacion, String proveedor,
        LocalDate fechaCreacion, String descripcion,
        List<MovimientoInventarioDTO> historialMovimientos
) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.costo = costo;
    this.stockMinimo = stockMinimo;
    this.stockInicial = stockInicial;
    this.stockActual = stockActual;
    this.estado = estado;
    this.ubicacion = ubicacion;
    this.proveedor = proveedor;
    this.fechaCreacion = fechaCreacion;
    this.descripcion = descripcion;
    this.historialMovimientos = historialMovimientos;
}


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    

    public Integer getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(Integer stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    public Integer getStockInicial() {
        return stockInicial;
    }

    public void setStockInicial(Integer stockInicial) {
        this.stockInicial = stockInicial;
    }

    public Integer getStockActual() {
        return stockActual;
    }

    public void setStockActual(Integer stockActual) {
        this.stockActual = stockActual;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getProveedor() {
        return proveedor;
    }

    public void setProveedor(String proveedor) {
        this.proveedor = proveedor;
    }

 

    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<MovimientoInventarioDTO> getHistorialMovimientos() {
        return historialMovimientos;
    }

    public void setHistorialMovimientos(List<MovimientoInventarioDTO> historialMovimientos) {
        this.historialMovimientos = historialMovimientos;
    }


    public BigDecimal getCosto() {
        return costo;
    }


    public void setCosto(BigDecimal costo) {
        this.costo = costo;
    }


    public String getDocumento() {
        return documento;
    }


    public void setDocumento(String documento) {
        this.documento = documento;
    }

    
}
