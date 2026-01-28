package com.sistema.taller.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sistema.taller.model.Cita;
import com.sistema.taller.model.Cliente;
import com.sistema.taller.model.EstadoOrden;
import com.sistema.taller.model.Orden;
import com.sistema.taller.model.Vehiculo;
import com.sistema.taller.model.dao.CitaDTO;
import com.sistema.taller.model.dao.FiltrosCitasDTO;
import com.sistema.taller.model.dao.VehiculoResponseDTO;
import com.sistema.taller.model.dao.cliente_dao.ClienteSimpleDTO;
import com.sistema.taller.repository.CitaRepository;
import com.sistema.taller.repository.ClienteRepository;
import com.sistema.taller.repository.OrdenRepository;
import com.sistema.taller.repository.VehiculoRepository;

@Service
public class CitaService {

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private VehiculoRepository vehiculoRepository;

    private static final DateTimeFormatter FECHA_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private static final DateTimeFormatter HORA_FMT = DateTimeFormatter.ofPattern("HH:mm");

    public List<CitaDTO> listarCitas() {
        return citaRepository.findAll()
                .stream()
                .map(this::mapearCitaADTO)
                .toList();
    }

    public List<CitaDTO> listarCitasPorFecha(String fechaStr) {

        LocalDate dia = LocalDate.parse(fechaStr, FECHA_FMT);
        LocalDateTime inicio = dia.atStartOfDay();
        LocalDateTime fin = dia.atTime(23, 59, 59);

        return citaRepository.findByFechaBetween(inicio, fin)
                .stream()
                .map(this::mapearCitaADTO)
                .toList();
    }

    public CitaDTO crearCita(CitaDTO dto) {

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Vehiculo vehiculo = vehiculoRepository.findById(dto.getVehiculoId())
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        LocalDate fecha = LocalDate.parse(dto.getFecha(), FECHA_FMT);
        LocalTime hora = LocalTime.parse(dto.getHora(), HORA_FMT);

        // Crear orden
        Orden orden = new Orden();
        orden.setCliente(cliente);
        orden.setVehiculo(vehiculo);
        orden.setEstadoOrden(EstadoOrden.ORIGINAR);
        orden.setFecha(fecha);
        orden.setNumeroOrden(generarNumeroOrden());

        // Crear cita
        Cita cita = new Cita();
        cita.setFecha(LocalDateTime.of(fecha, hora));
        cita.setDescripcion(dto.getDescripcion());
        cita.setServicios(dto.getServicio());
        cita.setCliente(cliente);
        cita.setVehiculo(vehiculo);

        // 🔗 RELACIÓN CLAVE
        cita.setOrden(orden);

        // 🚀 UNA sola operación
        citaRepository.save(cita);

        return mapearCitaADTO(cita);
    }

    private String generarNumeroOrden() {
        long total = ordenRepository.count() + 1;
        return String.format("ORD-%05d", total);
    }

    /*
     * =====================================================
     * ACTUALIZAR CITA
     * =====================================================
     */
    public CitaDTO actualizarCita(Long id, CitaDTO dto) {

        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        LocalDate fecha = LocalDate.parse(dto.getFecha(), FECHA_FMT);
        LocalTime hora = LocalTime.parse(dto.getHora(), HORA_FMT);

        cita.setFecha(LocalDateTime.of(fecha, hora));
        cita.setDescripcion(dto.getDescripcion());
        cita.setServicios(dto.getServicio());

        if (dto.getCliente() != null) {
            Cliente cliente = clienteRepository.findById(dto.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            cita.setCliente(cliente);
        }

        if (dto.getVehiculo() != null) {
            Vehiculo vehiculo = vehiculoRepository.findById(dto.getVehiculo().getId())
                    .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));
            cita.setVehiculo(vehiculo);
        }

        return mapearCitaADTO(citaRepository.save(cita));
    }

    /*
     * =====================================================
     * ELIMINAR CITA
     * =====================================================
     */
    public void eliminarCita(Long id) {
        citaRepository.deleteById(id);
    }

    public List<CitaDTO> filtrarCitas(FiltrosCitasDTO filtros) {

        List<Cita> citas = citaRepository.findAll();

        // Filtrado dinámico en memoria (para queries más complejas se puede usar
        // Specification o QueryDSL)
        return citas.stream()
                .filter(cita -> {
                    // Filtrar por fecha
                    if (filtros.getFecha() != null) {
                        LocalDate dia = LocalDate.parse(filtros.getFecha(), FECHA_FMT);
                        LocalDateTime inicio = dia.atStartOfDay();
                        LocalDateTime fin = dia.atTime(23, 59, 59);
                        if (cita.getFecha().isBefore(inicio) || cita.getFecha().isAfter(fin)) {
                            return false;
                        }
                    }

                    // Filtrar por clienteId
                    if (filtros.getClienteId() != null && !filtros.getClienteId().equals(cita.getCliente().getId())) {
                        return false;
                    }

                    // Filtrar por vehiculoId
                    if (filtros.getVehiculoId() != null
                            && !filtros.getVehiculoId().equals(cita.getVehiculo().getId())) {
                        return false;
                    }

                    // Filtrar por busqueda en descripcion
                    if (filtros.getBusqueda() != null && !filtros.getBusqueda().isBlank()) {
                        if (cita.getDescripcion() == null || !cita.getDescripcion().toLowerCase()
                                .contains(filtros.getBusqueda().toLowerCase())) {
                            return false;
                        }
                    }

                    return true;
                })
                .map(this::mapearCitaADTO)
                .collect(Collectors.toList());
    }

    // Mapper único Cita -> CitaDTO
    private CitaDTO mapearCitaADTO(Cita cita) {
        CitaDTO dto = new CitaDTO();
        dto.setId(cita.getId());
        dto.setFecha(cita.getFecha().format(FECHA_FMT));
        dto.setHora(cita.getFecha().format(HORA_FMT));
        dto.setDescripcion(cita.getDescripcion());
        dto.setServicio(cita.getServicios());

        // Cliente
        ClienteSimpleDTO clienteDTO = new ClienteSimpleDTO();
        clienteDTO.setId(cita.getCliente().getId());
        clienteDTO.setNombreCompleto(cita.getCliente().getNombreCompleto());
        clienteDTO.setEmail(cita.getCliente().getEmail());
        clienteDTO.setTelefono(cita.getCliente().getTelefono());
        clienteDTO.setDireccion(cita.getCliente().getDireccion());
        clienteDTO.setDni(cita.getCliente().getDni());
        dto.setCliente(clienteDTO);

        // Vehículo
        VehiculoResponseDTO vehiculoDTO = new VehiculoResponseDTO();
        vehiculoDTO.setId(cita.getVehiculo().getId());
        vehiculoDTO.setMarca(cita.getVehiculo().getMarca());
        vehiculoDTO.setModelo(cita.getVehiculo().getModelo());
        vehiculoDTO.setAnio(cita.getVehiculo().getAnio());
        vehiculoDTO.setMatricula(cita.getVehiculo().getMatricula());
        vehiculoDTO.setColor(cita.getVehiculo().getColor());
        vehiculoDTO.setKilometraje(cita.getVehiculo().getKilometraje());
        vehiculoDTO.setCombustible(cita.getVehiculo().getCombustible());
        vehiculoDTO.setTransmision(cita.getVehiculo().getTransmision());
        vehiculoDTO.setCliente(clienteDTO);
        dto.setVehiculo(vehiculoDTO);

        return dto;
    }

}
