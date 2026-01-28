package com.sistema.taller.service;

import com.sistema.taller.model.Cliente;
import com.sistema.taller.model.Empleado;
import com.sistema.taller.model.EstadoFactura;
import com.sistema.taller.model.EstadoOrden;
import com.sistema.taller.model.Factura;
import com.sistema.taller.model.Inventario;
import com.sistema.taller.model.MovimientoInventario;
import com.sistema.taller.model.Orden;
import com.sistema.taller.model.Servicio;
import com.sistema.taller.model.Vehiculo;
import com.sistema.taller.model.dao.ActualizarEstadoOrdenDTO;
import com.sistema.taller.model.dao.EstadisticasOrdenesDTO;
import com.sistema.taller.model.dao.OrdenDetalleDTO;
import com.sistema.taller.model.dao.OrdenServicioDTO;
import com.sistema.taller.model.dao.OrdenTrabajoDTO;
import com.sistema.taller.model.dao.PiezaOrdenDTO;
import com.sistema.taller.repository.ClienteRepository;
import com.sistema.taller.repository.EmpleadoRepository;
import com.sistema.taller.repository.FacturaRepository;
import com.sistema.taller.repository.InventarioRepository;
import com.sistema.taller.repository.MovimientoInventarioRepository;
import com.sistema.taller.repository.OrdenRepository;
import com.sistema.taller.repository.VehiculoRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrdenServiceImpl {

    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private OrdenRepository ordenRepository;
    @Autowired
    private VehiculoRepository vehiculoRepository;
    @Autowired
    private EmpleadoRepository empleadoRepository;
    @Autowired
    private InventarioRepository inventarioRepository;
    @Autowired
    private MovimientoInventarioRepository movimientoInventarioRepository;
    @Autowired
    ModelMapper mapper;
   
    @Autowired
    private FacturaRepository facturaRepository;

    @Transactional
    public Orden crearOrden(OrdenServicioDTO dto) {
        Orden orden = new Orden();
        orden.setNumeroOrden(generarNumeroOrden());

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        orden.setCliente(cliente);

        Vehiculo vehiculo = vehiculoRepository.findById(dto.getVehiculoId())
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));
        orden.setVehiculo(vehiculo);


        orden.setDescripcion(dto.getDescripcion());
        orden.setFecha(dto.getFecha());
        orden.setFechaCreacion(LocalDate.now());
        orden.setEsUrgente(dto.getEsUrgente());
        orden.setEstadoOrden(EstadoOrden.PENDIENTE);

        // Servicios
        List<Servicio> servicios = dto.getServicios().stream().map(serv -> {
            Servicio s = new Servicio();
            s.setOrden(orden);
            s.setNombre(serv.getNombre());
            s.setPrecio(serv.getPrecio());
            return s;
        }).collect(Collectors.toList());

        orden.setServicios(servicios);

        BigDecimal totalServicio = servicios.stream()
                .map(Servicio::getPrecio)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        orden.setTotalServicios(totalServicio);
        orden.setTotalGeneral(dto.getTotalGeneral());
        orden.setTotalPiezas(dto.getTotalPiezas());

        // Guardar la orden y servicios 
        ordenRepository.save(orden);

        // piezas utilizadas
        if (dto.getPiezas() != null && !dto.getPiezas().isEmpty()) {
            List<MovimientoInventario> movimientos = new ArrayList<>();

            for (PiezaOrdenDTO piezaDTO : dto.getPiezas()) {
                Inventario inventario = inventarioRepository.findById(piezaDTO.getPiezaId())
                        .orElseThrow(() -> new RuntimeException("Pieza no encontrada"));

                if (inventario.getStockActual() < piezaDTO.getCantidad()) {
                    throw new RuntimeException("Stock insuficiente para: " + inventario.getNombre());
                }

                inventario.setStockActual(inventario.getStockActual() - piezaDTO.getCantidad());

                MovimientoInventario movimiento = new MovimientoInventario();
                movimiento.setTipo("Salida");
                movimiento.setCantidad(piezaDTO.getCantidad());
                movimiento.setDescripcion(piezaDTO.getNombre());
                movimiento.setFecha(LocalDate.now());
                movimiento.setInventario(inventario);
                movimiento.setOrden(orden);
                movimientos.add(movimiento);
            }

            movimientoInventarioRepository.saveAll(movimientos);
        }

        return orden;
    }

    public List<OrdenTrabajoDTO> obtenerOrdenesPorVehiculo(Long vehiculoId) {
        if (!ordenRepository.existsByVehiculoId(vehiculoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No se encontraron órdenes para el vehículo con ID: " + vehiculoId);
        }

        List<Orden> ordenes = ordenRepository.findByVehiculo_Id(vehiculoId);
        List<OrdenTrabajoDTO> dtos = new ArrayList<>();
        for (Orden orden : ordenes) {
            dtos.add(mapper.map(orden, OrdenTrabajoDTO.class));
        }

        

        return dtos;
    }

    private String generarNumeroOrden() {
        long total = ordenRepository.count() + 1;
        return String.format("ORD-%05d", total);
    }

    public OrdenTrabajoDTO obtenerPorVehiculo(Long vehiculoId) {
        Orden orden = ordenRepository.findTopByVehiculoIdOrderByFechaDesc(vehiculoId)
                .orElseThrow(() -> new RuntimeException("No se encontró orden para el vehículo"));

        OrdenTrabajoDTO dto = mapper.map(orden, OrdenTrabajoDTO.class);
        return dto;
    }

    public List<OrdenTrabajoDTO> listarOrdenes() {
        List<Orden> ordenes = ordenRepository.findAll();
        List<OrdenTrabajoDTO> dtos = new ArrayList<>();
        for (Orden orden : ordenes) {
            OrdenTrabajoDTO dto = mapper.map(orden, OrdenTrabajoDTO.class);

            // información del vehículo 
            Vehiculo vehiculo = orden.getVehiculo();
            if (vehiculo != null) {
                dto.setVehiculoInfo(vehiculo.getMarca() + " " + vehiculo.getModelo());
            }

            Empleado empleado = orden.getEmpleado();
            if (empleado != null) {
                dto.setTecnicoNombre(empleado.getNombre());
            }

            dtos.add(dto);
        }
        
        return dtos;
    }

    public OrdenTrabajoDTO obtenerOrdenPorId(Long ordenId) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        OrdenTrabajoDTO dto = mapper.map(orden, OrdenTrabajoDTO.class);
        dto.setVehiculoInfo(orden.getVehiculo().getMatricula());
        Optional<Empleado> empleado = empleadoRepository.findById(orden.getEmpleado().getId());
        if (empleado.isPresent()) {
            dto.setTecnicoNombre(empleado.get().getNombre());
        }
        return dto;
    }

    @Transactional
    public OrdenTrabajoDTO actualizarEstadoOrden(Long ordenId, ActualizarEstadoOrdenDTO dto) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        EstadoOrden estadoAnterior = orden.getEstadoOrden();

        if (dto.getNuevoEstado() != null && dto.getNuevoEstado() != estadoAnterior) {
            orden.setEstadoOrden(dto.getNuevoEstado());

            if (dto.getNuevoEstado() == EstadoOrden.COMPLETADA) {
                orden.setFechaFinalizacion(LocalDate.now());

            }

        }

        // Asignar técnico
        if (dto.getEmpleadoId() != null) {
            Empleado empleado = empleadoRepository.findById(dto.getEmpleadoId())
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
            orden.setEmpleado(empleado);
        }

        if (dto.getObservaciones() != null) {
            orden.setObservaciones(dto.getObservaciones());
        }

        // Guardar orden antes de crear factura
        ordenRepository.save(orden);

        // Crear factura si procede al guardar orden 
        if (orden.getEstadoOrden() == EstadoOrden.COMPLETADA
                && orden.getFactura() == null) {

            Factura factura = new Factura();
            factura.setNumeroFactura(generarNumeroOrden());
            factura.setOrden(orden);
            factura.setCliente(orden.getCliente());
            factura.setVehiculo(orden.getVehiculo());
            factura.setFecha(LocalDate.now());
            factura.setFechaCreacion(LocalDateTime.now());
            factura.setFechaVencimiento(LocalDate.now().plusDays(15));

            BigDecimal subtotal = orden.getTotalGeneral();
            BigDecimal impuestos = subtotal.multiply(BigDecimal.valueOf(0.21));
            BigDecimal total = subtotal.add(impuestos);

            factura.setSubtotal(subtotal);
            factura.setImpuestos(impuestos);
            factura.setTotal(total);
            factura.setEstadoFactura(EstadoFactura.PENDIENTE);
            factura.setMetodoPago("EFECTIVO");

            facturaRepository.save(factura);
            orden.setFactura(factura);
            ordenRepository.save(orden); 
        }

        return mapper.map(orden, OrdenTrabajoDTO.class);
    }

    public EstadisticasOrdenesDTO obtenerEstadisticas() {
        long total = ordenRepository.count();
        long completadas = ordenRepository.countByEstadoOrden(EstadoOrden.COMPLETADA);
        long pendientes = ordenRepository.countByEstadoOrden(EstadoOrden.PENDIENTE);

        EstadisticasOrdenesDTO dto = new EstadisticasOrdenesDTO();
        dto.setCompletadas(completadas);
        dto.setTotal(total);
        dto.setEnProceso(pendientes);

        return dto;
    }

    public OrdenDetalleDTO obtenerDetalleOrden(Long ordenId) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        OrdenDetalleDTO dto = new OrdenDetalleDTO();
        dto.setNumeroOrden(orden.getNumeroOrden());
        dto.setFechaCreacion(orden.getFechaCreacion());
        dto.setNombreCliente(orden.getCliente().getNombreCompleto());
        dto.setNombreVehiculo(orden.getVehiculo().getModelo()); 
        dto.setKilometraje(orden.getVehiculo().getKilometraje());
        dto.setTecnicoAsignado(orden.getEmpleado().getNombre());
        dto.setEstado(orden.getEstadoOrden());
        dto.setFechaFinalizada(orden.getFechaFinalizacion());
        dto.setDescripcion(orden.getDescripcion());

        BigDecimal materiales = orden.getTotalPiezas();
        dto.setMateriales(materiales);

        // Buscar el servicio llamado "Mano de obra"
        BigDecimal manoDeObra = orden.getServicios().stream()
                .filter(s -> "Mano de obra".equalsIgnoreCase(s.getNombre()))
                .map(Servicio::getPrecio)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setManoDeObra(manoDeObra);

        BigDecimal subtotal = materiales.add(manoDeObra);
        dto.setSubtotal(subtotal);

        dto.setTotalGeneral(orden.getTotalGeneral());

        List<MovimientoInventario> movimientos = movimientoInventarioRepository.findByOrdenId(ordenId);
        List<PiezaOrdenDTO> piezasDTO = movimientos.stream().map(mov -> {
            PiezaOrdenDTO pieza = new PiezaOrdenDTO();
            pieza.setPiezaId(mov.getInventario().getId());
            pieza.setNombre(mov.getInventario().getNombre());
            pieza.setCantidad(mov.getCantidad());
            pieza.setPrecio(mov.getInventario().getPrecio());
            return pieza;
        }).collect(Collectors.toList());

        dto.setPiezasUtilizadas(piezasDTO);

        return dto;
    }

}