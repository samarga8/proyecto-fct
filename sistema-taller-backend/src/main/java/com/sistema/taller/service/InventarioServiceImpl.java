package com.sistema.taller.service;

import com.sistema.taller.model.Inventario;
import com.sistema.taller.model.MovimientoInventario;
import com.sistema.taller.model.Proveedor;
import com.sistema.taller.model.dao.DetalleProductoDTO;
import com.sistema.taller.model.dao.InventarioDTO;
import com.sistema.taller.model.dao.MovimientoInventarioDTO;
import com.sistema.taller.model.dao.MovimientoStockDTO;
import com.sistema.taller.repository.InventarioRepository;
import com.sistema.taller.repository.MovimientoInventarioRepository;
import com.sistema.taller.repository.ProveedorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InventarioServiceImpl {
    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private MovimientoInventarioRepository movimientoRepository;

    @Autowired
    private ModelMapper modelMapper;

    public InventarioDTO obtenerProductoPorId(Long id) {
        Optional<Inventario> opt = inventarioRepository.findById(id);
        if (opt.isPresent()) {
            Inventario p = opt.get();
            InventarioDTO dto = new InventarioDTO();
            dto.setNombre(p.getNombre());
            dto.setCategoria(dto.getCategoria());

            // falta el precio
            dto.setDescripcion(p.getDescripcion());
            return dto;
        }
        return null;
    }

    public DetalleProductoDTO obtenerDetalleProducto(Long idProducto) {
        Inventario inventario = inventarioRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        List<MovimientoInventario> movimientos = movimientoRepository.findByInventarioId(idProducto);
        List<MovimientoInventarioDTO> dtoMovimientos = movimientos.stream()
                .map(m -> modelMapper.map(m, MovimientoInventarioDTO.class))
                .collect(Collectors.toList());

        return new DetalleProductoDTO(
                inventario.getId(),
                inventario.getNombre(),
                inventario.getCategoria(),
                inventario.getPrecio(),
                inventario.getCosto(),
                inventario.getStockMinimo(),
                inventario.getStockInicial(),
                inventario.getStockActual(),
                inventario.getEstado(),
                inventario.getUbicacion(),
                inventario.getProveedor().getNombre(),
                inventario.getFechaCreacion(),
                inventario.getDescripcion(),
                dtoMovimientos);
    }

    public List<InventarioDTO> listarProductos() {
        List<Inventario> articulos = inventarioRepository.findAll();
        List<InventarioDTO> lista = new ArrayList<>();
        for (Inventario i : articulos) {
            InventarioDTO dto = modelMapper.map(i, InventarioDTO.class);
            lista.add(dto);
        }

        return lista.stream()
                .sorted(Comparator.comparing(InventarioDTO::getNombre)) // Ordena por nombre
                .collect(Collectors.toList());
    }

    public Inventario agregarProducto(InventarioDTO dto) {
        // Buscar si el proveedor ya existe
        Proveedor proveedor = proveedorRepository.findByNombre(dto.getProveedor())
                .orElseGet(() -> {
                    Proveedor nuevo = new Proveedor();
                    nuevo.setNombre(dto.getProveedor());
                    return proveedorRepository.save(nuevo);
                });

        Inventario p = new Inventario();

        p.setFechaCreacion(LocalDate.now());
        p.setUbicacion(dto.getUbicacion());
        p.setProveedor(proveedor);
        p.setNombre(dto.getNombre());
        p.setCategoria(dto.getCategoria());
        p.setStockInicial(dto.getStockInicial());
        p.setStockActual(dto.getStockInicial());
        p.setStockMinimo(dto.getStockMinimo());
        p.setPrecio(dto.getPrecio());
        p.setCosto(dto.getCosto());
        p.setDescripcion(dto.getDescripcion());
        actualizarEstadoSegunStock(p);
        return inventarioRepository.save(p);
    }

    public void eliminarProducto(Long id) {
        inventarioRepository.deleteById(id);
    }

    public InventarioDTO actualizarProducto(Long id, InventarioDTO dto) {
        Inventario inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));

        Proveedor proveedor = proveedorRepository.findByNombre(dto.getProveedor())
                .orElseGet(() -> {
                    Proveedor nuevo = new Proveedor();
                    nuevo.setNombre(dto.getProveedor());
                    return proveedorRepository.save(nuevo);
                });

        // Actualizamos los campos
        inventario.setNombre(dto.getNombre());
        inventario.setCategoria(dto.getCategoria());
        inventario.setStockActual(dto.getStockActual());
        inventario.setStockMinimo(dto.getStockMinimo());
        inventario.setStockInicial(dto.getStockInicial());
        inventario.setPrecio(dto.getPrecio());
        inventario.setCosto(dto.getCosto());
        inventario.setDescripcion(dto.getDescripcion());
        inventario.setUbicacion(dto.getUbicacion());
        inventario.setProveedor(proveedor);

        actualizarEstadoSegunStock(inventario);
        inventarioRepository.save(inventario);

        InventarioDTO d = modelMapper.map(inventario, InventarioDTO.class);
        return d;
    }

    public InventarioDTO actualizarStock(MovimientoStockDTO dto) {
        Inventario inventario = inventarioRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + dto.getProductoId()));

        int cantidad = dto.getCantidad();

        if ("entrada".equalsIgnoreCase(dto.getTipoMovimiento())) {
            inventario.setStockActual(inventario.getStockActual() + cantidad);
        } else if ("salida".equalsIgnoreCase(dto.getTipoMovimiento())) {
            if (inventario.getStockActual() < cantidad) {
                throw new IllegalArgumentException("Stock insuficiente para realizar la salida.");
            }
            inventario.setStockActual(inventario.getStockActual() - cantidad);
        } else {
            throw new IllegalArgumentException("Tipo de movimiento inválido: " + dto.getTipoMovimiento());
        }

        actualizarEstadoSegunStock(inventario);

        inventarioRepository.save(inventario);

        InventarioDTO idto = modelMapper.map(inventario, InventarioDTO.class);

        return idto;
    }

    private void actualizarEstadoSegunStock(Inventario inventario) {
     if (inventario.getStockActual() == 0) {
        inventario.setEstado("critico");
    } else if (inventario.getStockActual() <= inventario.getStockMinimo()) {
        inventario.setEstado("bajo");
    }else {
        inventario.setEstado("disponible");
    }

}

}
