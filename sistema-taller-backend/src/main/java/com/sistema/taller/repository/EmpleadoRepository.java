package com.sistema.taller.repository;

import com.sistema.taller.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmpleadoRepository extends JpaRepository<Empleado,Long> {
    Empleado findByDni(String dni);
    Empleado findByUsername(String username);
    Optional<Empleado> findByNombre(String nombre);
}
