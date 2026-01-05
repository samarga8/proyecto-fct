package com.sistema.taller.repository;

import com.sistema.taller.model.Vehiculo;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehiculoRepository extends JpaRepository<Vehiculo,Long> {

    List<Vehiculo> findByClienteId(long id);
    Optional<Vehiculo> findVehiculoByMatricula(String matricula);




}