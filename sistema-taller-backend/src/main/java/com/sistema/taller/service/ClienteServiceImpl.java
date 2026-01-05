package com.sistema.taller.service;

import com.sistema.taller.model.Cliente;
import com.sistema.taller.model.Vehiculo;
import com.sistema.taller.model.dao.VehiculoResponseDTO;
import com.sistema.taller.model.dao.cliente_dao.ClienteRegistroDTO;
import com.sistema.taller.model.dao.cliente_dao.ClienteResponseDTO;
import com.sistema.taller.model.dao.cliente_dao.ClienteSimpleDTO;
import com.sistema.taller.repository.ClienteRepository;
import com.sistema.taller.repository.VehiculoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteServiceImpl {

    @Autowired
    private ClienteRepository repoCliente;

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private VehiculoRepository repoVehiculo;

    @Transactional
    public Cliente registrarCliente(ClienteRegistroDTO dto) throws Exception {
        Optional<Cliente> cliente = repoCliente.findFirstByDni(dto.getDni());
        if (cliente.isPresent()) {
            throw new IllegalArgumentException("El cliente con DNI " + dto.getDni() + " ya existe.");
        }

        Cliente nuevoCliente = new Cliente();
        nuevoCliente.setDni(dto.getDni());
        nuevoCliente.setNombreCompleto(dto.getNombreCompleto());
        nuevoCliente.setTelefono(dto.getTelefono());
        nuevoCliente.setEmail(dto.getEmail());
        nuevoCliente.setDireccion(dto.getDireccion());
        nuevoCliente.setFechaRegistro(LocalDate.now());

        repoCliente.save(nuevoCliente);

        return nuevoCliente;
    }

    public List<ClienteResponseDTO> listarClientes() {
        List<Cliente> lista = repoCliente.findAllActivos().stream().sorted(Comparator.comparing(Cliente::getNombreCompleto))
                .toList();
        List<ClienteResponseDTO> listaDTO = lista.stream().map(cliente -> {
            ClienteResponseDTO dto = new ClienteResponseDTO();
            dto.setId(cliente.getId());
            dto.setDni(cliente.getDni());
            dto.setNombreCompleto(cliente.getNombreCompleto());
            dto.setDireccion(cliente.getDireccion());
            dto.setTelefono(cliente.getTelefono());
            dto.setEmail(cliente.getEmail());
            // Mapear vehículos a VehiculoDTO
            List<VehiculoResponseDTO> vehiculosDTO = cliente.getVehiculos().stream().map(vehiculo -> {
                VehiculoResponseDTO vdto = new VehiculoResponseDTO();
                vdto.setId(vehiculo.getId());
                vdto.setMarca(vehiculo.getMarca());
                vdto.setModelo(vehiculo.getModelo());
                vdto.setMatricula(vehiculo.getMatricula());
                vdto.setAnio(vehiculo.getAnio());
                vdto.setKilometraje(vehiculo.getKilometraje());
                vdto.setColor(vehiculo.getColor());

                // Mapear cliente simple
                ClienteSimpleDTO csdto = new ClienteSimpleDTO();
                csdto.setDni(cliente.getDni());
                csdto.setNombreCompleto(cliente.getNombreCompleto());
                vdto.setCliente(csdto);
                return vdto;
            }).toList();
            dto.setVehiculos(vehiculosDTO);
            return dto;
        }).toList();
        return listaDTO;
    }

    public Cliente obtenerCliente(String dni) throws Exception {
        Optional<Cliente> cliente = repoCliente.findFirstByDni(dni);
        if (cliente.isPresent()) {
            return cliente.get();
        } else {
            throw new Exception("El cliente no existe");
        }
    }

    @Transactional
    public Cliente actualizarCliente(Cliente cliente) {
        Cliente existente = repoCliente.findById(cliente.getId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado con ID " + cliente.getId()));

        if (repoCliente.existsByEmailAndIdNot(cliente.getEmail(), cliente.getId())) {
            throw new IllegalArgumentException("El email ya está en uso por otro cliente.");
        }

        if (repoCliente.existsByDniAndIdNot(cliente.getDni(), cliente.getId())) {
            throw new IllegalArgumentException("El DNI ya está en uso por otro cliente.");
        }

        // Actualizar datos
        existente.setNombreCompleto(cliente.getNombreCompleto());
        existente.setDni(cliente.getDni());
        existente.setEmail(cliente.getEmail());
        existente.setTelefono(cliente.getTelefono());
        existente.setDireccion(cliente.getDireccion());

        return repoCliente.save(existente);
    }

    @Transactional
    public void eliminarCliente(Long id) {
        Cliente cliente = repoCliente.findById(id)
                .orElseThrow(() -> new IllegalStateException("Cliente no existe"));

        cliente.setActivo(false);
    }

    public Cliente findById(long id) {
        Optional<Cliente> cliente = repoCliente.findById(id);
        return cliente.orElse(null);
    }

    public List<VehiculoResponseDTO> obtenerVehiculosPorCliente(long clienteId) {
        List<Vehiculo> vehiculos = repoVehiculo.findByClienteId(clienteId);
        List<VehiculoResponseDTO> dtos = new ArrayList<>();
        for (Vehiculo vehiculo : vehiculos) {
            dtos.add(mapper.map(vehiculo, VehiculoResponseDTO.class));
        }
        return dtos;
    }
}
