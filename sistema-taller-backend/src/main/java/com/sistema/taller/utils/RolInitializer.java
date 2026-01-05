package com.sistema.taller.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sistema.taller.model.Rol;
import com.sistema.taller.model.TipoRol;
import com.sistema.taller.repository.RolRepository;

import jakarta.annotation.PostConstruct;

@Component
public class RolInitializer {
    
    @Autowired
    private RolRepository repoRol;

    @PostConstruct
    public void init() {
        for (TipoRol tipoRol : TipoRol.values()) {
            repoRol.findByNombre(tipoRol).orElseGet(() -> {
                Rol rol = new Rol();
                rol.setNombre(tipoRol);
                System.out.println("Creando rol inicial: " + tipoRol);
                return repoRol.save(rol);
            });
        }
    }
}
