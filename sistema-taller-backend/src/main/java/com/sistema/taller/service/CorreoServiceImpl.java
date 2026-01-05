package com.sistema.taller.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import com.sistema.taller.model.dao.EmailFacturaDTO;

@Service
public class CorreoServiceImpl {

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TemplateEngine templateEngine;

    public void enviarCorreo(EmailFacturaDTO emailFacturaDTO) {

        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true,"UTF-8");
            helper.setTo(emailFacturaDTO.getClienteEmail());
            helper.setSubject(emailFacturaDTO.getAsunto());
           
            Context context = new Context();
            context.setVariable("EmailFacturaDTO", emailFacturaDTO);
            String html = templateEngine.process("email", context);
            helper.setText(html, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo", e);
        }
    }
}