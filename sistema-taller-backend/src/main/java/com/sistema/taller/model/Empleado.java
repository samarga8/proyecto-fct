package com.sistema.taller.model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sistema.taller.utils.Authority;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Empleado implements UserDetails {

    @Id
    @GeneratedValue
    private Long id;


    private String username;


    private String nombre;


    private String apellidos;
    
    private String password;

    @Column(unique = true)
    private String dni;

    @Column(unique = true)
    private String email;

    @Column
    private String telefono;

    @Column(name = "fecha_contratacion")
    private LocalDate fechaContratacion;

    private Boolean enabled = true;

    private String direccion;

    
    private String perfil;

   

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER,mappedBy = "empleado")
    @JsonManagedReference("empleado-roles")
    private Set<EmpleadoRol> empleadoRoles = new HashSet<>();


    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled != null && this.enabled;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set< Authority> autoridades = new HashSet<>();
        this.empleadoRoles.forEach(empleadoRol -> {
            autoridades.add(new Authority(empleadoRol.getRol().getNombre()));
        });
        return autoridades;
    }

    @Override
    public String getPassword() {
        return this.password;
    }
    

    public void setUsername(String username) {
        this.username = username;
    }

    public String getLastname() {
        return apellidos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }


    public void setPassword(String password) {
        this.password = password;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public LocalDate getFechaContratacion() {
        return fechaContratacion;
    }

    public void setFechaContratacion(LocalDate fechaContratacion) {
        this.fechaContratacion = fechaContratacion;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }


    public Set<EmpleadoRol> getEmpleadoRoles() {
        return empleadoRoles;
    }

    public void setEmpleadoRoles(Set<EmpleadoRol> empleadoRoles) {
        this.empleadoRoles = empleadoRoles;
    }


}
