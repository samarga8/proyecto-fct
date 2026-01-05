package com.sistema.taller.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistema.taller.model.Servicio;

public interface ServicioRepository extends JpaRepository<Servicio,Long>{

    List<Servicio> findByOrden_Vehiculo_Id(Long vehiculoId);

    List<Servicio> findByOrden_Id(Long ordenId);
   // List<Servicio> findByVehiculo_Id(Long vehiculoId);
    
}
