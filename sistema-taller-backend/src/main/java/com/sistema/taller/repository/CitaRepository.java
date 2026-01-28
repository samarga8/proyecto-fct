package com.sistema.taller.repository;

import com.sistema.taller.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface CitaRepository extends JpaRepository<Cita,Long> {
    List<Cita> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Cita> findByFecha(LocalDateTime fecha);
  



}