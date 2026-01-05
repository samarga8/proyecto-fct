package com.sistema.taller.service;

import com.sistema.taller.model.Servicio;
import com.sistema.taller.model.dao.ServicioOrdenDTO;
import com.sistema.taller.repository.ServicioRepository;


import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;



@Service
public class ServicioServiceImpl {

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    ModelMapper mapper;

    public List<ServicioOrdenDTO> obtenerServiciosPorVehiculo(Long vehiculoId) {
        List<Servicio> servicios = servicioRepository.findByOrden_Vehiculo_Id(vehiculoId);
        List<ServicioOrdenDTO> dto = new ArrayList<>();
        for (Servicio servicio : servicios) {
            dto.add(mapper.map(servicio, ServicioOrdenDTO.class));
        }
        return dto;

    }

    public List<ServicioOrdenDTO> listarServicios() {
        List<Servicio> servicios = servicioRepository.findAll();

        Collection<Servicio> unicosPorNombre = servicios.stream()
                .collect(Collectors.toMap(
                        Servicio::getNombre,
                        Function.identity(),
                        (existing, replacement) -> existing))
                .values();

        return unicosPorNombre.stream()
                .map(s -> mapper.map(s, ServicioOrdenDTO.class))
                .collect(Collectors.toList());
    }

}