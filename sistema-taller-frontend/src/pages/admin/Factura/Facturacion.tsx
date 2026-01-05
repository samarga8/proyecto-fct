import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Tabs, TabsContent } from "../../../components/ui/tabs";
import { MoreHorizontal, Mail, Eye, Plus, ArrowLeft } from "lucide-react";
import {
  obtenerTodas,
  obtenerEstadisticasFacturacion,
  obtenerIngresosMensuales,
  enviarFacturaPorEmail,
  obtenerFacturaPorId,
} from "../../../services/facturacionService";
import {
  FacturaDTO,
  FacturaDetalleDTO,
  EstadisticasFacturacionDTO,
  IngresoMensualDTO,
  EmailLineaDTO
} from "../../../models/factura_dao/FacturaDTO";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";


const Facturacion = () => {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState<FacturaDTO[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasFacturacionDTO | null>(null);
  const [ingresos, setIngresos] = useState<IngresoMensualDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<FacturaDTO | null>(null);
  const [enviandoEmail, setEnviandoEmail] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [todasLasFacturas, estadisticasData, ingresosData] = await Promise.all([
        obtenerTodas(),
        obtenerEstadisticasFacturacion(),
        obtenerIngresosMensuales()
      ]);

      // Actualizar para manejar el array directo de facturas
      setFacturas(todasLasFacturas || []);
      setEstadisticas(estadisticasData);
      setIngresos(ingresosData || []);
    } catch (error: any) {
      setFacturas([]);
      setEstadisticas(null);
      setIngresos([]);
      toast.error(error.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Enviar por email
  const handleEnviarEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!facturaSeleccionada) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const asunto = formData.get("asunto") as string;

    if (!email || !email.includes('@')) {
      toast.error("Debe ingresar un email válido");
      return;
    }

    try {
      setEnviandoEmail(true);

      // Obtener detalles completos de la factura 
      const facturaDetalle = await obtenerFacturaPorId(facturaSeleccionada.id.toString());
      
      // Construir líneas de la factura 
      const lineas: EmailLineaDTO[] = [];
      
      if (facturaDetalle.servicios) {
        facturaDetalle.servicios.forEach(s => {
          lineas.push({
            concepto: s.nombre,
            cantidad: s.cantidad || 1, 
            precio: s.precio,
            total: (s.cantidad || 1) * s.precio 
          });
        });
      }
      
      if (facturaDetalle.piezas) {
        facturaDetalle.piezas.forEach(p => {
          lineas.push({
            concepto: p.nombrePieza,
            cantidad: p.cantidad,
            precio: p.precioUnitario,
            total: p.subTotal
          });
        });
      }

      await enviarFacturaPorEmail({
        email,
        asunto,
        facturaId: facturaSeleccionada.id.toString(),
        clienteNombre: facturaDetalle.clienteNombreCompleto,
        clienteDireccion: facturaDetalle.clienteDireccion,
        clienteEmail: facturaDetalle.clienteEmail,
        clienteTelefono: facturaDetalle.clienteTelefono,
        numeroFactura: facturaDetalle.numeroFactura || facturaDetalle.id.toString(),
        fechaFactura: new Date(facturaDetalle.fecha).toLocaleDateString(),
        lineas,
        iva: facturaDetalle.impuestos,
        subtotal: facturaDetalle.subtotal,
        total: facturaDetalle.total
      });

      toast.success("Factura enviada por email correctamente");
      setEmailModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Error al enviar la factura por email");
    } finally {
      setEnviandoEmail(false);
    }
  };


  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando datos de facturación...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Facturación | AutoTaller</title>
      </Helmet>

      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/admin/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Facturación</h1>
            <p className="text-muted-foreground">Gestiona las facturas y pagos</p>
          </div>
          </div>
          <Button onClick={() => navigate('/admin/facturacion/nuevo')}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Nueva factura</span>
          </Button>
        
      </div>
        <div className="grid gap-6 md:grid-cols-3">

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos cobrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {                 
                  const ingresoMesActual = facturas
                    .filter(f => {
                      return f.estadoFactura === 'PAGADA'})
                    .reduce((sum, f) => sum + f.subtotal, 0);
                    
                  return formatearMoneda(ingresoMesActual);
                })()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Facturas pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estadisticas ? formatearMoneda(estadisticas.totalPendiente) : '$0.00'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {estadisticas?.facturasPendientes} facturas sin pagar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Facturas vencidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {estadisticas ? formatearMoneda(estadisticas.totalVencido) : '$0.00'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {estadisticas?.facturasVencidas} facturas vencidas
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="facturas" className="w-full">
          <TabsContent value="facturas" className="pt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Lista de facturas</CardTitle>

                </div>
                <CardDescription>Total de facturas: {facturas?.length || 0}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Factura</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Vehículo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Vencimiento</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-[80px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facturas.map((factura) => (
                      <TableRow key={factura.id}>
                        <TableCell className="font-medium">{factura.numeroFactura}</TableCell>
                        <TableCell>{factura.clienteNombre}</TableCell>
                        <TableCell>{factura.vehiculoInfo}</TableCell>
                        <TableCell>{new Date(factura.fecha).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(factura.fechaVencimiento).toLocaleDateString()}</TableCell>
                        <TableCell>{formatearMoneda(factura.subtotal)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              factura.estadoFactura === "PAGADA" ? "default" :
                                factura.estadoFactura === "PENDIENTE" ? "outline" :
                                  "destructive"
                            }
                          >
                            {factura.estadoFactura}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/facturacion/detalle/${factura.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver factura
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setFacturaSeleccionada(factura);
                                setEmailModalOpen(true);
                              }}>
                                <Mail className="mr-2 h-4 w-4" />
                                Enviar por email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {
                                if (factura.estadoFactura !== "PAGADA") {
                                  navigate(`/admin/facturacion/pago/${factura.id}`);
                                } else {
                                  toast.error("Esta factura ya está pagada");
                                }
                              }}>
                                Registrar pago
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal para enviar email */}
        <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Enviar factura por email</DialogTitle>
              <DialogDescription>
                Completa los datos para enviar la factura por email
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEnviarEmail}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email del destinatario</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="cliente@gmail.com"
                    required
                    defaultValue={facturaSeleccionada?.clienteEmail}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asunto">Asunto</Label>
                  <Input
                    id="asunto"
                    name="asunto"
                    type="text"
                    placeholder={`Factura #${facturaSeleccionada?.numeroFactura || facturaSeleccionada?.id}`}
                    defaultValue={`Factura #${facturaSeleccionada?.numeroFactura || facturaSeleccionada?.id}`}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEmailModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={enviandoEmail}>
                  {enviandoEmail ? "Enviando..." : "Enviar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
};

export default Facturacion;





