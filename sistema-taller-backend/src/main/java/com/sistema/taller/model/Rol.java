package com.sistema.taller.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Rol implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TipoRol nombre;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY,mappedBy = "rol")
    @JsonManagedReference("rol-empleados")
    private Set<EmpleadoRol> empleadoRol = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoRol getNombre() {
        return nombre;
    }

    public void setNombre(TipoRol nombre) {
        this.nombre = nombre;
    }

    public Set<EmpleadoRol> getEmpleadoRol() {
        return empleadoRol;
    }

    public void setEmpleadoRol(Set<EmpleadoRol> empleadoRol) {
        this.empleadoRol = empleadoRol;
    }
}
