package com.sistema.taller.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sistema.taller.model.Cliente;
import com.sistema.taller.model.Vehiculo;
import com.sistema.taller.model.dao.VehiculoRegistroDTO;
import com.sistema.taller.model.dao.VehiculoResponseDTO;
import com.sistema.taller.repository.ClienteRepository;
import com.sistema.taller.repository.VehiculoRepository;


@Service
public class VehiculoServiceImpl {
    

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private ModelMapper mapper;

  
    public void guardarVehiculo(VehiculoRegistroDTO dto) throws Exception {
        Optional<Cliente> cliente = clienteRepository.findFirstByDni(dto.getDni());
        if (cliente.isPresent()){
            Vehiculo vehiculo = new Vehiculo();
            vehiculo.setAnio(dto.getAnio());
            vehiculo.setCliente(cliente.get());
            vehiculo.setMarca(dto.getMarca());
            vehiculo.setModelo(dto.getModelo());
            vehiculo.setMatricula(dto.getMatricula());
            vehiculo.setColor(dto.getColor());
            vehiculo.setKilometraje(dto.getKilometraje());
            vehiculo.setCombustible(dto.getCombustible());
            vehiculo.setTransmision(dto.getTransmision());
            vehiculoRepository.save(vehiculo);
        } else {
            throw new Exception("El cliente no existe");
        }
    }

   
    public Vehiculo obtenerVehiculoPorMatricula(String matricula) throws Exception {
        Optional<Vehiculo> vehiculo = vehiculoRepository.findVehiculoByMatricula(matricula);
        if (vehiculo.isPresent()){
            return vehiculo.get();
        } else {
            throw new Exception("El vehiculo no existe");
        }


    }

    public VehiculoResponseDTO obtenerVehiculoPorId(Long vehiculoId) {
        Optional<Vehiculo> vehiculoOpt = vehiculoRepository.findById(vehiculoId);
        if (vehiculoOpt.isPresent()) {
            Vehiculo vehiculo = vehiculoOpt.get();
            VehiculoResponseDTO dto = mapper.map(vehiculo, VehiculoResponseDTO.class);
            

            return dto;
        }
        return null;
    }
    
    public List<VehiculoResponseDTO> listarTodosLosVehiculos() {
        List<Vehiculo> vehiculos = vehiculoRepository.findAll();
        List<VehiculoResponseDTO> dto = new ArrayList<>();
        for (Vehiculo v : vehiculos) {
            if (v.getCliente().isActivo()) {
                 dto.add(mapper.map(v, VehiculoResponseDTO.class));
            }   
        }
        return dto;
    }
    
    public Vehiculo actualizarVehiculo(Long id, Vehiculo vehiculo) {
        Vehiculo vehiculoActual = vehiculoRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Vehículo no encontrado con ID: " + id));
    
        // Solo se actualizan los campos permitidos (matrícula queda intacta)
        if (vehiculo.getCliente() != null) vehiculoActual.setCliente(vehiculo.getCliente());
        if (vehiculo.getMarca() != null) vehiculoActual.setMarca(vehiculo.getMarca());
        if (vehiculo.getModelo() != null) vehiculoActual.setModelo(vehiculo.getModelo());
        if (vehiculo.getAnio() != null) vehiculoActual.setAnio(vehiculo.getAnio());
        if (vehiculo.getKilometraje() != null) vehiculoActual.setKilometraje(vehiculo.getKilometraje());
        if (vehiculo.getColor() != null) vehiculoActual.setColor(vehiculo.getColor());
        if (vehiculo.getCombustible() != null) vehiculoActual.setCombustible(vehiculo.getCombustible());
        if (vehiculo.getTransmision() != null) vehiculoActual.setTransmision(vehiculo.getTransmision());
    
        return vehiculoRepository.save(vehiculoActual);
    }
    
    
    public void eliminarVehiculo(Long id) throws Exception {            
            vehiculoRepository.deleteById(id);
       
    }
    
    public List<Vehiculo> obtenerVehiculosPorCliente(Long clienteId) {
        return vehiculoRepository.findByClienteId(clienteId);
    }
}
