package com.sistema.taller.service;

import com.sistema.taller.model.Cliente;
import com.sistema.taller.model.EstadoFactura;
import com.sistema.taller.model.Factura;
import com.sistema.taller.model.Orden;
import com.sistema.taller.model.Vehiculo;

import com.sistema.taller.model.dao.EstadisticasFacturacionDTO;
import com.sistema.taller.model.dao.FacturaDTO;
import com.sistema.taller.model.dao.FacturaDetalleDTO;
import com.sistema.taller.model.dao.FiltrosFacturacionDTO;
import com.sistema.taller.model.dao.IngresoMensualDTO;
import com.sistema.taller.model.dao.PiezaMovimientoDTO;
import com.sistema.taller.model.dao.RespuestaFacturacionDTO;
import com.sistema.taller.model.dao.ServicioOrdenDTO;
import com.sistema.taller.repository.ClienteRepository;
import com.sistema.taller.repository.FacturaRepository;
import com.sistema.taller.repository.OrdenRepository;
import com.sistema.taller.repository.VehiculoRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FacturaServiceImpl {

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private FacturaRepository repoFactura;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private OrdenRepository ordenRepository;

    public String generarNumeroFactura() {
        LocalDate hoy = LocalDate.now();
        int year = hoy.getYear();

        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);
        long count = repoFactura.countByFechaBetween(startOfYear, endOfYear);
        long siguienteNumero = count + 1;

        return String.format("FAC-%d%03d", year, siguienteNumero);
    }

    @Transactional
    public Factura crearFactura(FacturaDTO dto) {
        Factura facturaExistente = repoFactura.findByNumeroFactura(dto.getNumeroFactura());
        if (facturaExistente != null) {
            throw new RuntimeException("Ya existe una factura con ese número");
        }

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Vehiculo vehiculo = vehiculoRepository.findById(dto.getVehiculoId())
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        // sino la encuentra la dejamos en null para orden nueva
        Orden orden = null;
        if (dto.getOrdenTrabajoId() != null) {
            orden = ordenRepository.findById(Long.valueOf(dto.getOrdenTrabajoId()))
                    .orElse(null); 
        }

        Factura factura = mapper.map(dto, Factura.class);
        factura.setId(null);
        factura.setCliente(cliente);
        factura.setVehiculo(vehiculo);
        if (orden != null) {
            factura.setOrden(orden);
        }
        factura.setEstadoFactura(EstadoFactura.PENDIENTE);
        factura.setOrden(orden);
        factura.setNumeroFactura(generarNumeroFactura());
        factura.setFechaCreacion(LocalDateTime.now());
        factura.setNotas(dto.getNotas());

        Factura facturaGuardada = repoFactura.save(factura);

        if (orden != null) {
            orden.setFactura(facturaGuardada);
            ordenRepository.save(orden);
        }

        return facturaGuardada;
    }



    public List<FacturaDTO> obtenerTodas() {
        List<Factura> facturas = repoFactura.findAll(Sort.by(Sort.Direction.DESC, "fecha"));
        List<FacturaDTO> dtos = new ArrayList<>();
        for (Factura factura : facturas) {
            FacturaDTO dto = mapper.map(factura, FacturaDTO.class);

            String nombreVehiculo = factura.getVehiculo().getMarca() + " " + factura.getVehiculo().getModelo();
            dto.setVehiculoInfo(nombreVehiculo);

            dtos.add(dto);

        }
        return dtos;
    }

    public FacturaDetalleDTO obtenerFacturaDetallePorId(Long id) {
        Optional<Factura> optionalFactura = repoFactura.findById(id);
        if (optionalFactura.isEmpty()) {
            return null; 
        }
        Factura factura = optionalFactura.get();

        FacturaDetalleDTO dto = new FacturaDetalleDTO();
        dto.setId(factura.getId());
        dto.setNumeroFactura(factura.getNumeroFactura());
        dto.setFecha(factura.getFecha());
        dto.setFechaVencimiento(factura.getFechaVencimiento());
        dto.setSubtotal(factura.getSubtotal());
        dto.setImpuestos(factura.getImpuestos());
        dto.setTotal(factura.getTotal());
        dto.setEstadoFactura(factura.getEstadoFactura().name());
        dto.setMetodoPago(factura.getMetodoPago());
        dto.setNotas(factura.getNotas());

        // Cliente
        if (factura.getCliente() != null) {
            Cliente cliente = factura.getCliente();
            String nombreCompleto = cliente.getNombreCompleto();
            dto.setClienteNombreCompleto(nombreCompleto.trim());
            dto.setClienteDireccion(cliente.getDireccion());
            dto.setClienteTelefono(cliente.getTelefono());
            dto.setClienteEmail(cliente.getEmail());
        }

        // Vehículo
        if (factura.getVehiculo() != null) {
            Vehiculo vehiculo = factura.getVehiculo();
            dto.setVehiculoMarca(vehiculo.getMarca());
            dto.setVehiculoModelo(vehiculo.getModelo());
            dto.setVehiculoAno(vehiculo.getAnio());
            dto.setVehiculoMatricula(vehiculo.getMatricula());
        }

        // Orden y servicios
        if (factura.getOrden() != null) {
            Orden orden = factura.getOrden();
            dto.setOrdenId(orden.getId());
            dto.setOrdenNumero(orden.getNumeroOrden());

            // Mapeamos servicios a DTOs
            List<ServicioOrdenDTO> serviciosDTO = orden.getServicios().stream().map(servicio -> {
                ServicioOrdenDTO servicioDTO = new ServicioOrdenDTO();
                servicioDTO.setServicioId(servicio.getId());
                servicioDTO.setNombre(servicio.getNombre());
                servicioDTO.setPrecio(servicio.getPrecio());

                return servicioDTO;
            }).collect(Collectors.toList());

            dto.setServicios(serviciosDTO);

            List<PiezaMovimientoDTO> piezasDTO = orden.getMovimientos().stream().map(mov -> {
                PiezaMovimientoDTO piezaDTO = new PiezaMovimientoDTO();
                piezaDTO.setMovimientoId(mov.getId());
                piezaDTO.setCantidad(mov.getCantidad());
                // Datos de la pieza asociada al movimiento 
                if (mov.getInventario() != null) {
                    piezaDTO.setPiezaId(mov.getInventario().getId());
                    piezaDTO.setNombrePieza(mov.getInventario().getNombre());
                    piezaDTO.setPrecioUnitario(mov.getInventario().getPrecio());
                    // Subtotal = cantidad * precio unitario
                    piezaDTO.setSubTotal(mov.getInventario().getPrecio().multiply(new BigDecimal(mov.getCantidad())));
                }
                return piezaDTO;
            }).collect(Collectors.toList());
            dto.setPiezas(piezasDTO);
        }

        return dto;

    }

    public List<Factura> obtenerPorCliente(Long clienteId) {
        return repoFactura.findByClienteIdOrderByFechaDesc(clienteId);
    }

    public void eliminarFactura(Long id) {
        repoFactura.deleteById(id);
    }

    public RespuestaFacturacionDTO filtrarFacturas(FiltrosFacturacionDTO filtros) {
        List<Factura> todas = repoFactura.findAll();

        List<Factura> filtradas = todas.stream()
                .filter(f -> filtros.getEstado() == null || filtros.getEstado().isEmpty()
                        || filtros.getEstado().contains(f.getEstado()))
                .filter(f -> filtros.getFechaInicio() == null || !f.getFecha().isBefore(filtros.getFechaInicio()))
                .filter(f -> filtros.getFechaFin() == null || !f.getFecha().isAfter(filtros.getFechaFin()))
                .filter(f -> filtros.getClienteId() == null || f.getCliente().getId().equals(filtros.getClienteId()))
                .filter(f -> filtros.getBusqueda() == null || f.getNumeroFactura().contains(filtros.getBusqueda())
                        || f.getCliente().getNombreCompleto().toLowerCase()
                                .contains(filtros.getBusqueda().toLowerCase()))
                .collect(Collectors.toList());

        List<FacturaDTO> facturaDTOs = filtradas.stream()
                .map(f -> mapper.map(f, FacturaDTO.class)) 
                .collect(Collectors.toList());

        EstadisticasFacturacionDTO estadisticas = calcularEstadisticas(filtradas);

        return new RespuestaFacturacionDTO(facturaDTOs, estadisticas, facturaDTOs.size());
    }

    public EstadisticasFacturacionDTO obtenerEstadisticas() {
        List<Factura> facturas = repoFactura.findAll();
        return calcularEstadisticas(facturas);
    }

    public List<IngresoMensualDTO> obtenerIngresosMensuales() {
        List<Factura> facturas = repoFactura.findAll();

        Map<YearMonth, List<Factura>> agrupadas = facturas.stream()
                .filter(f -> f.getEstado() == EstadoFactura.PAGADA)
                .collect(Collectors.groupingBy(f -> YearMonth.from(f.getFecha())));

        List<IngresoMensualDTO> ingresos = new ArrayList<>();

        for (Map.Entry<YearMonth, List<Factura>> entry : agrupadas.entrySet()) {
            YearMonth ym = entry.getKey();
            List<Factura> grupo = entry.getValue();

            double total = grupo.stream().mapToDouble(f -> f.getSubtotal().doubleValue()).sum();
            long servicios = grupo.stream().map(Factura::getOrden).filter(Objects::nonNull).count();

            ingresos.add(new IngresoMensualDTO(
                    ym.getMonth().getDisplayName(TextStyle.FULL, Locale.getDefault()),
                    ym.getYear(),
                    total,
                    servicios,
                    grupo.size()));
        }

        ingresos.sort(Comparator.comparing(IngresoMensualDTO::getAnio)
                .thenComparing(i -> Month.valueOf(i.getMes().toUpperCase())));

        return ingresos;
    }

    private EstadisticasFacturacionDTO calcularEstadisticas(List<Factura> facturas) {
        LocalDate ahora = LocalDate.now();
        YearMonth mesActual = YearMonth.from(ahora);
        YearMonth mesAnterior = mesActual.minusMonths(1);

        double totalMesActual = facturas.stream()
                .filter(f -> YearMonth.from(f.getFecha()).equals(mesActual))
                .mapToDouble(f -> f.getSubtotal().doubleValue())
                .sum();

        double totalMesAnterior = facturas.stream()
                .filter(f -> YearMonth.from(f.getFecha()).equals(mesAnterior))
                .mapToDouble(f -> f.getSubtotal().doubleValue())
                .sum();

        long pendientes = facturas.stream().filter(f -> f.getEstado().equals(EstadoFactura.PENDIENTE)).count();
        long vencidas = facturas.stream().filter(f -> f.getEstado().equals(EstadoFactura.VENCIDA)).count();

        double totalPendiente = facturas.stream()
                .filter(f -> f.getEstado().equals(EstadoFactura.PENDIENTE))
                .mapToDouble(f -> f.getSubtotal().doubleValue()).sum();

        double totalVencido = facturas.stream()
                .filter(f -> f.getEstado().equals(EstadoFactura.VENCIDA))
                .mapToDouble(f -> f.getSubtotal().doubleValue()).sum();

        double porcentajeCambio = totalMesAnterior > 0
                ? ((totalMesActual - totalMesAnterior) / totalMesAnterior) * 100
                : 0;

        return new EstadisticasFacturacionDTO(
                BigDecimal.valueOf(totalMesActual),
                BigDecimal.valueOf(totalPendiente),
                BigDecimal.valueOf(totalVencido),
                (int) pendientes,
                (int) vencidas,
                porcentajeCambio);
    }
}