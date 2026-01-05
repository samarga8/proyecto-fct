package com.sistema.taller.repository;

import com.sistema.taller.model.Rol;
import com.sistema.taller.model.TipoRol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol,Long> {

    Optional<Rol> findByNombre(TipoRol nombre);
}
