package com.sistema.taller.controller;

import com.sistema.taller.model.Empleado;
import com.sistema.taller.security.JwtUtil;
import com.sistema.taller.service.EmpleadoDetailsServiceImpl;
import com.sistema.taller.utils.JwtRequest;
import com.sistema.taller.utils.JwtResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@CrossOrigin("*")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmpleadoDetailsServiceImpl empleadoDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/generate-token")
    public ResponseEntity<?> generarToken(@RequestBody JwtRequest jwtRequest) throws Exception {
        try {
            autenticar(jwtRequest.getUsername(), jwtRequest.getPassword());

        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Empleado no encontrado");
        }
        UserDetails userDetails = this.empleadoDetailsService.loadUserByUsername(jwtRequest.getUsername());
        String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(new JwtResponse(token));
    }

    private void autenticar(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            System.out.println("Empleado deshabilitado: " + e.getMessage());
            throw new Exception("Empleado deshabilitado " + e.getMessage());
        } catch (BadCredentialsException e) {
            System.out.println("Credenciales invalidas para usuario " + username);
            throw new Exception("Credenciales invalidas " + e.getMessage());
        }
    }


    @GetMapping("/actual-empleado")
    public ResponseEntity<?> obtenerEmpleadoActual(Principal principal){
        if (principal == null) {
            System.out.println("Principal es null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
        System.out.println("Usuario autenticado: " + principal.getName());
        Empleado empleado = (Empleado) this.empleadoDetailsService.loadUserByUsername(principal.getName());
        return ResponseEntity.ok(empleado);
    }

}
