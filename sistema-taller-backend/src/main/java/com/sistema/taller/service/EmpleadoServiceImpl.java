package com.sistema.taller.service;

import com.sistema.taller.model.Empleado;
import com.sistema.taller.model.EmpleadoRol;
import com.sistema.taller.model.Rol;
import com.sistema.taller.model.TipoRol;
import com.sistema.taller.model.dao.EmpleadoDTO;
import com.sistema.taller.model.dao.EmpleadoRegistroDTO;
import com.sistema.taller.repository.EmpleadoRepository;
import com.sistema.taller.repository.EmpleadoRolRepository;
import com.sistema.taller.repository.RolRepository;

import jakarta.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmpleadoServiceImpl {

    @Autowired
    private EmpleadoRepository repoEmpleado;

    @Autowired
    private EmpleadoRolRepository empleadoRolRepository;

    @Autowired
    private RolRepository repoRol;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    ModelMapper mapper;

    @Transactional
    public Empleado guardarEmpleado(EmpleadoRegistroDTO empleadoDTO) throws Exception {
        Empleado empleadoExistente = repoEmpleado.findByDni(empleadoDTO.getDni());
        if (empleadoExistente != null) {
            throw new Exception("El empleado ya existe");
        }

        Empleado empleado = new Empleado();

        empleado.setUsername(empleadoDTO.getUsername().trim());
        empleado.setNombre(empleadoDTO.getNombre().trim());
        empleado.setApellidos(empleadoDTO.getApellidos().trim());
        empleado.setDni(empleadoDTO.getDni().trim());
        empleado.setEmail(empleadoDTO.getEmail().trim());
        empleado.setTelefono(empleadoDTO.getTelefono().trim());
        empleado.setDireccion(empleadoDTO.getDireccion().trim());

        String encryptedPassword = passwordEncoder.encode(empleadoDTO.getPassword().trim());
        empleado.setPassword(encryptedPassword);

        empleado.setPerfil(empleadoDTO.getPerfil().trim());
        empleado.setFechaContratacion(LocalDate.now());

        // Guardar primero el empleado para obtener ID
        Empleado empleadoGuardado = repoEmpleado.save(empleado);

        System.out.println("Buscando rol: " + empleadoDTO.getPerfil().trim());

        Rol rol = repoRol.findByNombre(TipoRol.valueOf(empleadoDTO.getPerfil().toUpperCase().trim()))
                .orElseThrow(() -> new Exception("Rol no encontrado: " + empleadoDTO.getPerfil()));

        System.out.println("Rol asignado: " + rol.getNombre());

        EmpleadoRol empleadoRol = new EmpleadoRol();
        empleadoRol.setEmpleado(empleadoGuardado);
        empleadoRol.setRol(rol);

        empleadoRolRepository.save(empleadoRol);
        empleadoGuardado.getEmpleadoRoles().add(empleadoRol);

        return empleadoGuardado;
    }

    public Empleado obtenerEmpleado(String username) {
        return repoEmpleado.findByUsername(username);
    }


    public List<EmpleadoDTO> listarEmpleados() {
        List<Empleado> empleados = repoEmpleado.findAll().stream().filter(empleado -> empleado.getEmpleadoRoles().stream().anyMatch(empleadoRol -> empleadoRol.getRol().getNombre() == TipoRol.MECANICO)).toList();
        List<EmpleadoDTO> dtos = new ArrayList<>();
        for (Empleado empleado : empleados) {
            dtos.add(mapper.map(empleado, EmpleadoDTO.class));
        }
        return dtos;
    }
}
