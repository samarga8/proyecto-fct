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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmpleadoDetailsServiceImpl empleadoDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/generate-token")
    public ResponseEntity<JwtResponse> generarToken(@RequestBody JwtRequest jwtRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        jwtRequest.getUsername(),
                        jwtRequest.getPassword()));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(token));
    }

    @GetMapping("/actual-empleado")
    public ResponseEntity<?> obtenerEmpleadoActual(Principal principal) {
        if (principal == null) {
            System.out.println("Principal es null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
        Empleado empleado = (Empleado) this.empleadoDetailsService.loadUserByUsername(principal.getName());
        return ResponseEntity.ok(empleado);
    }

}
