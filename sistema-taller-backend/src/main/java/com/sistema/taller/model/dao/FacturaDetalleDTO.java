package com.sistema.taller.model.dao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;



public class FacturaDetalleDTO {
    private Long id;
    private String numeroFactura;
    private LocalDate fecha;
    private LocalDate fechaVencimiento;
    private BigDecimal subtotal;
    private BigDecimal impuestos;
    private BigDecimal total;
    private String estadoFactura;
    private String metodoPago;
    private String notas;

    // Cliente
    private String clienteNombreCompleto;
    private String clienteDireccion;
    private String clienteTelefono;
    private String clienteEmail;

    // Vehículo
    private String vehiculoMarca;
    private String vehiculoModelo;
    private Integer vehiculoAno;
    private String vehiculoMatricula;

    // Orden y servicios
    private Long ordenId;
    private String ordenNumero;
    private List<ServicioOrdenDTO> servicios;
    private List<PiezaMovimientoDTO> piezas;


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNumeroFactura() {
        return numeroFactura;
    }
    public void setNumeroFactura(String numeroFactura) {
        this.numeroFactura = numeroFactura;
    }
    public LocalDate getFecha() {
        return fecha;
    }
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }
    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    public BigDecimal getImpuestos() {
        return impuestos;
    }
    public void setImpuestos(BigDecimal impuestos) {
        this.impuestos = impuestos;
    }
    public BigDecimal getTotal() {
        return total;
    }
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    public String getEstadoFactura() {
        return estadoFactura;
    }
    public void setEstadoFactura(String estadoFactura) {
        this.estadoFactura = estadoFactura;
    }
    public String getMetodoPago() {
        return metodoPago;
    }
    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
    public String getNotas() {
        return notas;
    }
    public void setNotas(String notas) {
        this.notas = notas;
    }
    public String getClienteNombreCompleto() {
        return clienteNombreCompleto;
    }
    public void setClienteNombreCompleto(String clienteNombreCompleto) {
        this.clienteNombreCompleto = clienteNombreCompleto;
    }
    public String getClienteDireccion() {
        return clienteDireccion;
    }
    public void setClienteDireccion(String clienteDireccion) {
        this.clienteDireccion = clienteDireccion;
    }
    public String getClienteTelefono() {
        return clienteTelefono;
    }
    public void setClienteTelefono(String clienteTelefono) {
        this.clienteTelefono = clienteTelefono;
    }
    public String getClienteEmail() {
        return clienteEmail;
    }
    public void setClienteEmail(String clienteEmail) {
        this.clienteEmail = clienteEmail;
    }
    public String getVehiculoMarca() {
        return vehiculoMarca;
    }
    public void setVehiculoMarca(String vehiculoMarca) {
        this.vehiculoMarca = vehiculoMarca;
    }
    public String getVehiculoModelo() {
        return vehiculoModelo;
    }
    public void setVehiculoModelo(String vehiculoModelo) {
        this.vehiculoModelo = vehiculoModelo;
    }
    public Integer getVehiculoAno() {
        return vehiculoAno;
    }
    public void setVehiculoAno(Integer vehiculoAno) {
        this.vehiculoAno = vehiculoAno;
    }
    public String getVehiculoMatricula() {
        return vehiculoMatricula;
    }
    public void setVehiculoMatricula(String vehiculoMatricula) {
        this.vehiculoMatricula = vehiculoMatricula;
    }
    public Long getOrdenId() {
        return ordenId;
    }
    public void setOrdenId(Long ordenId) {
        this.ordenId = ordenId;
    }
    public String getOrdenNumero() {
        return ordenNumero;
    }
    public void setOrdenNumero(String ordenNumero) {
        this.ordenNumero = ordenNumero;
    }
    public List<ServicioOrdenDTO> getServicios() {
        return servicios;
    }
    public void setServicios(List<ServicioOrdenDTO> servicios) {
        this.servicios = servicios;
    }
    public List<PiezaMovimientoDTO> getPiezas() {
        return piezas;
    }
    public void setPiezas(List<PiezaMovimientoDTO> piezas) {
        this.piezas = piezas;
    }
    

    

}