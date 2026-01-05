package com.sistema.taller.service;

import com.sistema.taller.model.Empleado;
import com.sistema.taller.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class EmpleadoDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private EmpleadoRepository repoEmpleado;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Empleado empleado = this.repoEmpleado.findByUsername(username);
        if (empleado != null){
            return empleado;
        } else {
            throw new UsernameNotFoundException("Empleado no encontrado");
        }
    }

}
