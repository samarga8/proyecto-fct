package com.sistema.taller.repository;

import com.sistema.taller.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface FacturaRepository extends JpaRepository<Factura,Long> {


    long countByFechaBetween(LocalDate start, LocalDate end);

    Factura findByNumeroFactura(String numFact);

    List<Factura> findAllByClienteId(long id);

    List<Factura> findByClienteIdOrderByFechaDesc(Long clienteId);

 

    Factura findByOrden_Id(Long ordenId);

    List<Factura> findByEstadoFacturaIn(List<String> estados);
    List<Factura> findByFechaBetween(LocalDate inicio, LocalDate fin);
    List<Factura> findByClienteId(Long clienteId);
    List<Factura> findByNumeroFacturaContainingIgnoreCase(String busqueda);
}