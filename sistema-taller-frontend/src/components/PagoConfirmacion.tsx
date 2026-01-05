import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import baseUrl from '../services/helper';

const PagoConfirmacion: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState<string>('Consultando estado del pago...');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verificarPago = async () => {
      const paymentIntentId = searchParams.get('payment_intent_id');
      const facturaId = searchParams.get('facturaId');

      if (!paymentIntentId || !facturaId) {
        setEstado('Faltan parámetros en la URL.');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${baseUrl}/pagos/payment-intent-status?payment_intent_id=${paymentIntentId}&facturaId=${facturaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const status = response.data.status || 'desconocido';
        setEstado(`Estado del pago: ${status}`);

        if (response.data.customer_email) {
          setEmail(response.data.customer_email);
        }

        if (status === 'succeeded' || status === 'complete') {
          toast.success('¡Pago realizado exitosamente!');
        } else {
          toast.error(`Estado del pago: ${status}`);
        }
      } catch (error) {
        console.error('Error:', error);
        setEstado('Error consultando el estado del pago.');
        toast.error('Error al verificar el estado del pago');
      } finally {
        setLoading(false);
      }
    };

    verificarPago();

    const timer = setTimeout(() => {
      navigate('/admin/facturacion', { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white">
        <CardContent className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Gracias!</h1>
          <p className="font-semibold mb-4">{loading ? 'Consultando estado del pago...' : estado}</p>
          {email && <p className="text-blue-700 mb-4">Correo del cliente: {email}</p>}
          <p className="text-sm text-gray-500 mb-4">
            Serás redirigido a la página de facturación.
          </p>
          <Button onClick={() => navigate('/admin/facturacion')} className="bg-green-600 hover:bg-green-700">
            Ir a facturación ahora
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PagoConfirmacion;
