package com.sistema.taller.controller;

import com.sistema.taller.model.EstadoFactura;
import com.sistema.taller.model.PaymentIntentRequest;
import com.sistema.taller.repository.FacturaRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.ChargeCollection;
import com.stripe.model.PaymentIntent;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pagos")
public class CheckoutSessionController {

        @Value("${stripe.key.secret}")
        private String stripeApiKey;

        @Autowired
        private FacturaRepository repoFact;

        @PostConstruct
        public void init() {
                Stripe.apiKey = stripeApiKey;
        }

        @PostMapping("/create-payment-intent")
        public ResponseEntity<Map<String, Object>> createPaymentIntent(
                        @RequestBody PaymentIntentRequest request) throws StripeException {

                Map<String, Object> params = new HashMap<>();
                params.put("amount", Math.round(request.getAmount() * 100));
                params.put("currency", request.getCurrency());

                Map<String, String> metadata = request.getMetadata();
                if (metadata != null) {
                        params.put("metadata", metadata);
                }

                PaymentIntent intent = PaymentIntent.create(params);
                if ("succeeded".equals(intent.getStatus()) && metadata != null && metadata.containsKey("facturaId")) {
                        Long facturaId = Long.parseLong(metadata.get("facturaId"));
                        repoFact.findById(facturaId).ifPresent(factura -> {
                                factura.setEstadoFactura(EstadoFactura.PAGADA);
                                factura.setFechaPago(LocalDateTime.now());
                                repoFact.save(factura);
                        });
                }

                Map<String, Object> responseData = new HashMap<>();
                responseData.put("client_secret", intent.getClientSecret());

                return ResponseEntity.ok(responseData);
        }

        
        @GetMapping("/payment-intent-status")
        public ResponseEntity<?> getPaymentIntentStatus(
                @RequestParam("payment_intent_id") String paymentIntentId,
                @RequestParam("facturaId") Long facturaId) {
        
            try {
                PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        
                String status = paymentIntent.getStatus();
        
              
                Map<String, Object> params = new HashMap<>();
                params.put("payment_intent", paymentIntentId);
                ChargeCollection charges = Charge.list(params);
        
                String customerEmail = null;
                if (!charges.getData().isEmpty()) {
                    Charge charge = charges.getData().get(0);
                    customerEmail = charge.getBillingDetails().getEmail();
                }
        
                if ("succeeded".equals(status) || "complete".equals(status)) {
                    repoFact.findById(facturaId).ifPresent(factura -> {
                        factura.setEstadoFactura(EstadoFactura.PAGADA);
                        factura.setFechaPago(LocalDateTime.now());
                        repoFact.save(factura);
                    });
                }
        
                Map<String, Object> response = new HashMap<>();
                response.put("status", status);
                response.put("customer_email", customerEmail);
        
                return ResponseEntity.ok(response);
        
            } catch (StripeException e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Error obteniendo el estado del pago");
            }
        }
        
}