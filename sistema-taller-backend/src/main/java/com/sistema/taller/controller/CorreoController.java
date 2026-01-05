package com.sistema.taller.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistema.taller.model.dao.EmailFacturaDTO;
import com.sistema.taller.service.CorreoServiceImpl;

@RestController
@RequestMapping("/email")
public class CorreoController {

    @Autowired
    private CorreoServiceImpl correoService;

    @PostMapping("/enviar-factura")
    public ResponseEntity<String> enviarFacturaPorEmail(@RequestBody EmailFacturaDTO dto) {
        correoService.enviarCorreo(dto);
        return ResponseEntity.ok("Correo enviado correctamente");
    }

}
