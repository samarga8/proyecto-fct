import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import stripePromise from '../config/stripe';
import { FacturaDetalleDTO } from '../models/factura_dao/FacturaDTO';
import { obtenerFacturaPorId } from '../services/facturacionService';
import baseUrl from '../services/helper';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PagoFormProps {
    factura: FacturaDetalleDTO;
    onSuccess: () => void;
    onCancel: () => void;
}

const PagoForm: React.FC<PagoFormProps> = ({ factura, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(`${baseUrl}/pagos/create-payment-intent`, {
                facturaId: factura.id,
                amount: factura.subtotal, 
                currency: 'eur',
                metadata: {
                    facturaId: factura.id.toString(),
                    facturaNumero: factura.numeroFactura,
                    clienteNombre: factura.clienteNombreCompleto
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });


            const { client_secret } = response.data;

            // Confirmar el pago
            const cardElement = elements.getElement(CardElement);

            const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: cardElement!,
                    billing_details: {
                        name: factura.clienteNombreCompleto,
                        email: factura.clienteEmail,
                    },
                },
            });

            if (error) {
                toast.error(`Error en el pago: ${error.message}`);
            } else if (paymentIntent.status === 'succeeded') {
                // Redirigir a la página de confirmación con los parámetros necesarios
                window.location.href = `/admin/facturacion/confirmacion?payment_intent_id=${paymentIntent.id}&facturaId=${factura.id}`;
                
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al procesar el pago');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="invoice bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                <header className="invoice-header bg-primary text-white p-6">
                    <div className="flex justify-between items-center">
                        <div className="logo flex items-center">
                            <h2 className="text-2xl font-bold">Taller Mecánico</h2>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">FACTURA</h1>
                        </div>
                    </div>
                </header>

                <div className="invoice-content p-6">
                    <section className="data-client mb-6">
                        <h3 className="text-lg font-bold border-b pb-2 mb-3">DATOS DEL CLIENTE</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><strong>Nombre:</strong> {factura.clienteNombreCompleto}</p>
                                <p><strong>Dirección:</strong> {factura.clienteDireccion}</p>
                            </div>
                            <div>
                                <p><strong>Email:</strong> {factura.clienteEmail}</p>
                                <p><strong>Teléfono:</strong> {factura.clienteTelefono}</p>
                            </div>
                        </div>
                    </section>

                    <section className="date-number mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <p><strong>Número factura:</strong> {factura.numeroFactura}</p>
                            <p><strong>Fecha factura:</strong> {format(new Date(factura.fecha), 'dd/MM/yyyy', { locale: es })}</p>
                        </div>
                    </section>

                    <table className="w-full border-collapse mb-6">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Concepto</th>
                                <th className="border p-2 text-right">Cantidad</th>
                                <th className="border p-2 text-right">Precio</th>
                                <th className="border p-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {factura.servicios && factura.servicios.length > 0 ? (
                                factura.servicios.map((servicio, index) => (
                                    <tr key={`servicio-${index}`}>
                                        <td className="border p-2">{servicio.nombre}</td>
                                        <td className="border p-2 text-right">{servicio.precio.toFixed(2)} €</td>
                                        <td className="border p-2 text-right">{(servicio.precio).toFixed(2)} €</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="border p-2 text-center">No hay servicios registrados</td>
                                </tr>
                            )}
                            {factura.piezas && factura.piezas.length > 0 ? (
                                factura.piezas.map((pieza, index) => (
                                    <tr key={`pieza-${index}`}>
                                        <td className="border p-2">{pieza.nombrePieza}</td>
                                        <td className="border p-2 text-right">{pieza.cantidad}</td>
                                        <td className="border p-2 text-right">{pieza.precioUnitario.toFixed(2)} €</td>
                                        <td className="border p-2 text-right">{pieza.subTotal.toFixed(2)} €</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="border p-2 text-center">No hay piezas registradas</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="summary mb-6">
                        <p><strong>Nota:</strong> El servicio tiene una garantía de 90 días.</p>
                    </div>

                    <section className="totals mb-6">
                        <div className="flex flex-col items-end">
                            <p className="text-xl font-bold"><strong>Total:</strong> {factura.subtotal.toFixed(2)} €</p>
                        </div>
                    </section>
                </div>

                <footer className="invoice-footer bg-gray-100 p-6">
                    <div className="grid grid-cols-2 gap-4">
                      
                        <div>
                            <ul className="text-sm">
                                <li>Taller mecánico</li>
                                <li>Calle Mayor 21</li>
                                <li>tallerMecanico@gmail.com</li>
                                <li>Teléfono: 000-000-000</li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>

            <Card className="w-full max-w-md mx-auto mb-6">
                <CardHeader>
                    <CardTitle>Datos de pago</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="p-4 border rounded-md">
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={!stripe || loading}
                                className="flex-1"
                            >
                                {loading ? 'Procesando...' : `Pagar ${factura.subtotal.toLocaleString()}€`}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

const PagoStripe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [factura, setFactura] = useState<FacturaDetalleDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargarFactura = async () => {
            if (!id) {
                setError("ID de factura no válido");
                setLoading(false);
                return;
            }

            try {
                const facturaData = await obtenerFacturaPorId(id);
                setFactura(facturaData);
            } catch (error) {
                console.error('Error al cargar factura:', error);
                setError('Error al cargar la factura');
                toast.error('Error al cargar la factura');
            } finally {
                setLoading(false);
            }
        };

        cargarFactura();
    }, [id]);

    const handleSuccess = () => {
        toast.success("Pago procesado exitosamente");
        navigate(`/admin/facturacion`);
    };

    const handleCancel = () => {
        navigate(`/admin/facturacion/detalle/${id}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <Card className="w-full max-w-md mx-auto">
                    <CardContent className="flex items-center justify-center p-6">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p>Cargando factura...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !factura) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <Card className="w-full max-w-md mx-auto">
                    <CardContent className="p-6 text-center">
                        <p className="text-red-500 mb-4">{error || 'Factura no encontrada'}</p>
                        <Button onClick={() => navigate('/admin/facturacion')}>
                            Volver a Facturación
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Elements stripe={stripePromise}>
                <PagoForm
                    factura={factura}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </Elements>
        </div>
    );
};

export default PagoStripe;