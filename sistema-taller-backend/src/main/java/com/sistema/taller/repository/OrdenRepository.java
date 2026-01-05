package com.sistema.taller.repository;

import com.sistema.taller.model.EstadoOrden;
import com.sistema.taller.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrdenRepository extends JpaRepository<Orden, Long> {
    boolean existsByVehiculoId(Long vehiculoId);
    List<Orden> findByVehiculo_Id(Long vehiculoId);
    List<Orden> findByEmpleado_Id(Long empleadoId);
    List<Orden> findByEstadoOrdenIn(List<String> estados);
    Optional<Orden> findTopByVehiculoIdOrderByFechaDesc(Long vehiculoId);
    long countByEstadoOrden(EstadoOrden estado);
}
