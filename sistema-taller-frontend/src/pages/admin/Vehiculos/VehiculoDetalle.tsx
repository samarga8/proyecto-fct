import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { ArrowLeft, Car, Wrench, History, Pencil } from "lucide-react";
import { obtenerVehiculoPorId } from "../../../services/vehiculoService";
import { IVehiculo } from "@/models/vehiculo_dao/IVehiculo";
import { toast } from "sonner";
import { obtenerOrdenesPorVehiculo } from "../../../services/ordenService";
import { OrdenTrabajoDTO } from "@/models/orden_dao/OrdenTrabajoDTO";
import { isLoggedIn, getToken } from "../../../services/authService";


const VehiculoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehiculo, setVehiculo] = useState<IVehiculo | null>(null);
  const [ordenes, setOrdenes] = useState<OrdenTrabajoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarVehiculo = async () => {
      if (!id) return;
      // Verificar autenticacion
      if (!isLoggedIn()) {
        setError("Sesion expirada. Por favor, inicia sesión nuevamente.");
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        console.log("Token:", getToken()); 

        const data = await obtenerVehiculoPorId(Number(id));

        const vehiculoAdaptado: IVehiculo = {
          ...data,
          kilometraje: data.kilometraje
        };

        setVehiculo(vehiculoAdaptado);

        // Cargar las órdenes del vehículo 
        try {
          const ordenesData = await obtenerOrdenesPorVehiculo(Number(id));
          console.log("Órdenes cargadas:", ordenesData);
          setOrdenes(Array.isArray(ordenesData) ? ordenesData : []);
        } catch (ordenError: any) {
          console.error("Error al cargar órdenes:", ordenError);

          // Si es error 401, redirigir al login
          if (ordenError.response?.status === 401) {
            setError("Sesión expirada. Redirigiendo al login...");
            setTimeout(() => navigate('/login'), 2000);
            return;
          }

          // Para otros errores, solo continuar
          setOrdenes([]);
          console.warn("No se pudieron cargar las órdenes, pero continuando con la carga del vehículo");
        }

        setError(null);
      } catch (error: any) {
        console.error("Error completo:", error);

        if (error.response?.status === 401) {
          setError("Sesión expirada. Redirigiendo al login...");
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        setError(error.message || "Error al cargar la información del vehículo");
        toast.error(error.message || "Error al cargar la información del vehículo");
      } finally {
        setLoading(false);
      }
    };

    cargarVehiculo();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <p>Cargando información del vehículo...</p>
      </div>
    );
  }

  if (error || !vehiculo) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <p className="text-red-500">{error || "No se encontró el vehículo"}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${vehiculo.marca} ${vehiculo.modelo} | AutoTaller`}</title>
      </Helmet>
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/vehiculos")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{vehiculo.marca} {vehiculo.modelo}</h1>
              <p className="text-muted-foreground">Detalles del vehículo</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/admin/vehiculos/editar/${id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar vehículo
            </Button>
            <Button onClick={() => navigate(`/admin/vehiculos/nueva-orden/${id}`)}>
              <Wrench className="mr-2 h-4 w-4" />
              Nueva orden de servicio
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Información del Vehículo</CardTitle>
              <CardDescription>Datos principales del vehículo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}</h2>
                  <p className="text-muted-foreground">Matrícula: {vehiculo.matricula}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Datos básicos</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Marca:</dt>
                      <dd>{vehiculo.marca}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Modelo:</dt>
                      <dd>{vehiculo.modelo}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Año:</dt>
                      <dd>{vehiculo.anio}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Matrícula:</dt>
                      <dd>{vehiculo.matricula}</dd>
                    </div>
                    {/* El VIN no está en la interfaz IVehiculo, podría añadirse si es necesario */}
                  </dl>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Características</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Color:</dt>
                      <dd>{vehiculo.color || "No especificado"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Kilometraje:</dt>
                      <dd>{(vehiculo.kilometraje) ? `${vehiculo.kilometraje} km` : "No especificado"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Combustible:</dt>
                      <dd>{vehiculo.combustible || "No especificado"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Transmisión:</dt>
                      <dd>{vehiculo.transmision || "No especificado"}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Propietario</CardTitle>
              <CardDescription>Información del cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehiculo.cliente ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="font-medium">{vehiculo.cliente.nombreCompleto.substring(0, 2)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{vehiculo.cliente.nombreCompleto}</h3>
                        <p className="text-sm text-muted-foreground">DNI: {vehiculo.cliente.dni}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Contacto</p>
                      <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/admin/clientes/detalle/${vehiculo.cliente.id}`)}>
                        Ver información de contacto
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p>No hay información del propietario</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="historial">
          <TabsList className="mb-4">
            <TabsTrigger value="historial">
              <History className="mr-2 h-4 w-4" />
              Historial de ordenes
            </TabsTrigger>
           
          </TabsList>
          <TabsContent value="historial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de ordenes</CardTitle>
                <CardDescription>Registro de ordenes realizadas al vehículo</CardDescription>
              </CardHeader>
              <CardContent>
                {ordenes.length > 0 ? (
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/50">
                        <tr>
                          <th scope="col" className="px-4 py-3">Fecha</th>
                          <th scope="col" className="px-4 py-3">Número de Orden</th>
                          <th scope="col" className="px-4 py-3">Descripción</th>
                          <th scope="col" className="px-4 py-3">Total</th>
                          <th scope="col" className="px-4 py-3">Estado</th>
                          <th scope="col" className="px-4 py-3">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordenes.map((orden) => {
                          // Obtener descripción segura
                          const descripcion = orden.descripcion ||
                            (orden.servicios && orden.servicios.length > 0
                              ? orden.servicios[0].nombre
                              : 'Sin descripción');

                          return (
                            <tr key={orden.id} className="border-b">
                              <td className="px-4 py-3">{new Date(orden.fecha).toLocaleDateString()}</td>
                              <td className="px-4 py-3">{orden.numeroOrden}</td>
                              <td className="px-4 py-3">{descripcion}</td>
                              <td className="px-4 py-3">{orden.totalGeneral?.toFixed(2) || '0.00'}€</td>
                              <td className="px-4 py-3">
                                <Badge variant="secondary">{orden.estado}</Badge>
                              </td>
                              <td className="px-4 py-3">
                                <Button variant="ghost" size="sm" onClick={() => navigate(`/ordenes/orden-detalle/${orden?.id}`)}>
                                  Ver detalle
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 font-medium">No hay historial de servicios</h3>
                    <p className="text-muted-foreground">Este vehículo no tiene servicios registrados.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>      
        </Tabs>
      </main>
    </>
  );
};

export default VehiculoDetalle;