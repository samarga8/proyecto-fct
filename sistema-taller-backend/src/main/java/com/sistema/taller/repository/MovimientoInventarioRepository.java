package com.sistema.taller.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistema.taller.model.MovimientoInventario;

public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {
    List<MovimientoInventario> findByInventarioId(Long inventarioId);

    List<MovimientoInventario> findByOrdenId(Long ordenId);

}
