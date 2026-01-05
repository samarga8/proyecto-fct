import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Clock, FileText } from "lucide-react";
import { Separator } from "../../../components/ui/separator";
import { obtenerDetalleOrden } from "../../../services/ordenService";
import { OrdenDetalleDTO } from "../../../models/orden_dao/OrdenDetalleDTO";
import { toast } from "sonner";
import { getUserRole } from "../../../services/authService";

const OrdenDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orden, setOrden] = useState<OrdenDetalleDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const cargarOrden = async () => {
      if (!id) {
        setError("ID de orden no válido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const ordenData = await obtenerDetalleOrden(id); 
        setOrden(ordenData);
      } catch (err: any) {
        setError(err.message || "Error al cargar la orden");
      } finally {
        setLoading(false);
      }
    };

    cargarOrden();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (error || !orden) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error || "Orden no encontrada"}</p>
          <Button onClick={() => navigate("/admin/ordenes-trabajo")}>Volver a órdenes</Button>
        </div>
      </div>
    );
  }

  // Formatear fecha
  const formatearFecha = (fecha: string | Date) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  // Calcular impuestos (21%)
  const impuestos = orden.subtotal * 0.21;

  const manejarVerFactura = () => {
    if (!id) {
      toast.error("ID de orden no válido");
      return;
    }    
    navigate(`/admin/facturacion/detalle/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>Detalle de Orden | AutoTaller</title>
      </Helmet>
      
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Orden de Trabajo: {orden.numeroOrden}</h1>
              <p className="text-muted-foreground">Creada el {formatearFecha(orden.fechaCreacion)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Solo mostrar el botón si la orden está completada */}
            {getUserRole() === 'ADMINISTRADOR' && orden.estado === "COMPLETADA" && (
              <Button 
                variant="outline" 
                onClick={manejarVerFactura}
              >
                <FileText className="mr-2 h-4 w-4" />
                Ver factura
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Información de la orden</CardTitle>
                 <Badge 
                  variant={
                    orden.estado === "COMPLETADA" ? "secondary" : 
                    orden.estado === "EN_PROGRESO" ? "default" : 
                    orden.estado === "PENDIENTE" ? "outline" :
                    "outline"
                  }
                >
                  {orden.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Cliente</h3>
                    <p className="text-base">{orden.nombreCliente}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Vehículo</h3>
                    <p className="text-base">{orden.nombreVehiculo}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Kilometraje</h3>
                    <p className="text-base">{orden.kilometraje?.toLocaleString()} km</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Técnico asignado</h3>
                    <p className="text-base">{orden.tecnicoAsignado}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Fecha de creación</h3>
                    <p className="text-base">{formatearFecha(orden.fechaCreacion)}</p>
                  </div>
                  {orden.fechaFinalizada && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Fecha de finalización</h3>
                      <p className="text-base">{formatearFecha(orden.fechaFinalizada)}</p>
                    </div>
                  )}
                </div>
              </div>
               <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Descripción del servicio</h3>
                <p>{orden.descripcion}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resumen de costos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Materiales:</span>
                  <span>{orden.materiales.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mano de obra:</span>
                  <span>{orden.manoDeObra.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{orden.subtotal.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Impuestos (21%):</span>
                  <span>{impuestos.toLocaleString()}€</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total General:</span>
                  <span>{orden.totalGeneral.toLocaleString()}€</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="materiales" className="w-full">
          <TabsList>
            <TabsTrigger value="materiales">
              <FileText className="mr-2 h-4 w-4" />
              Materiales y repuestos
            </TabsTrigger>
            <TabsTrigger value="historial">
              <Clock className="mr-2 h-4 w-4" />
              Historial
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="materiales" className="p-4 border rounded-md mt-2">
            <h3 className="text-lg font-medium mb-4">Materiales y repuestos utilizados</h3>
            <div className="space-y-4">
              {orden.piezas && orden.piezas.length > 0 ? (
                orden.piezas.map((material, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{material.nombre}</p>
                      <p className="text-sm text-muted-foreground">Cantidad: {material.cantidad}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(material.precio * material.cantidad).toLocaleString()}€</p>
                      <p className="text-sm text-muted-foreground">{material.precio.toLocaleString()}€ por unidad</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No hay materiales registrados para esta orden.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="historial" className="p-4 border rounded-md mt-2">
            <h3 className="text-lg font-medium mb-4">Historial de la orden</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 border-b pb-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Orden creada</p>
                  <p className="text-sm text-muted-foreground">{formatearFecha(orden.fechaCreacion)} - Administrador</p>
                </div>
              </div>
              {orden.fechaFinalizada && (
                <div className="flex items-start gap-4 border-b pb-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Orden finalizada</p>
                    <p className="text-sm text-muted-foreground">{formatearFecha(orden.fechaFinalizada)} - {orden.tecnicoAsignado}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
};

export default OrdenDetalle;