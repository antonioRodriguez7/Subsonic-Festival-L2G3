package com.susbsonic.usuarios.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmailWithPdf(String to, String subject, String body, MultipartFile pdfAttachment, String attachmentName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);
            
            helper.addAttachment(attachmentName, pdfAttachment);

            mailSender.send(message);
            System.out.println("✅ Email enviado correctamente a: " + to);
        } catch (Exception e) {
            System.err.println("❌ Error al enviar el email: " + e.getMessage());
            // No bloqueamos el flujo si hay error de envio de correo
        }
    }
}
