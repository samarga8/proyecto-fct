package com.sistema.taller.model.dao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.sistema.taller.model.EstadoFactura;

public class FacturaDTO {
    
        private long id;
        private String numeroFactura;
        private Long clienteId;
        private String clienteNombre;
        private String clienteEmail;
        private long vehiculoId;
        private String vehiculoInfo;
        private Long ordenTrabajoId;
        private LocalDate fecha;
        private LocalDate fechaVencimiento;
        private BigDecimal subtotal;
        private BigDecimal impuestos;
        private BigDecimal total;
        private EstadoFactura estadoFactura;
        private String metodoPago;
        private String notas;
        private LocalDateTime fechaCreacion;
        private LocalDateTime fechaPago;
        
       
        public String getNumeroFactura() {
            return numeroFactura;
        }
        public void setNumeroFactura(String numeroFactura) {
            this.numeroFactura = numeroFactura;
        }
        public Long getClienteId() {
            return clienteId;
        }
        public void setClienteId(Long clienteId) {
            this.clienteId = clienteId;
        }
        public String getClienteNombre() {
            return clienteNombre;
        }
        public void setClienteNombre(String clienteNombre) {
            this.clienteNombre = clienteNombre;
        }
        public Long getVehiculoId() {
            return vehiculoId;
        }
        public void setVehiculoId(Long vehiculoId) {
            this.vehiculoId = vehiculoId;
        }
        public String getVehiculoInfo() {
            return vehiculoInfo;
        }
        public void setVehiculoInfo(String vehiculoInfo) {
            this.vehiculoInfo = vehiculoInfo;
        }
       
        
        public void setVehiculoId(long vehiculoId) {
            this.vehiculoId = vehiculoId;
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
        
        public String getMetodoPago() {
            return metodoPago;
        }
        public void setMetodoPago(String metodoPago) {
            this.metodoPago = metodoPago;
        }
       
        public LocalDateTime getFechaCreacion() {
            return fechaCreacion;
        }
        public void setFechaCreacion(LocalDateTime fechaCreacion) {
            this.fechaCreacion = fechaCreacion;
        }
        public LocalDateTime getFechaPago() {
            return fechaPago;
        }
        public void setFechaPago(LocalDateTime fechaPago) {
            this.fechaPago = fechaPago;
        }
        public String getNotas() {
            return notas;
        }
        public void setNotas(String notas) {
            this.notas = notas;
        }
        public EstadoFactura getEstadoFactura() {
            return estadoFactura;
        }
        public void setEstadoFactura(EstadoFactura estadoFactura) {
            this.estadoFactura = estadoFactura;
        }
        public long getId() {
            return id;
        }
        public void setId(long id) {
            this.id = id;
        }
         public String getClienteEmail() {
            return clienteEmail;
        }
        public void setClienteEmail(String clienteEmail) {
            this.clienteEmail = clienteEmail;
        }
        public Long getOrdenTrabajoId() {
            return ordenTrabajoId;
        }
        public void setOrdenTrabajoId(Long ordenTrabajoId) {
            this.ordenTrabajoId = ordenTrabajoId;
        }

        

}
