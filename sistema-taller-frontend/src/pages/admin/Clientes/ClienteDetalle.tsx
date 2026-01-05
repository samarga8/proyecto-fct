import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Car, Mail, Phone, MapPin, Edit, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../../components/ui/alert-dialog";
import { obtenerClientePorId, obtenerVehiculosPorCliente, eliminarCliente } from "../../../services/clienteService";
import { ICliente } from "@/models/cliente_dao/ICliente";
import { IVehiculo } from "@/models/vehiculo_dao/IVehiculo";

const ClienteDetalle = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  const clienteId = parseInt(id!);

  // Estados para almacenar los datos del cliente y sus vehículos
  const [cliente, setCliente] = useState<ICliente | null>(null);
  const [vehiculosCliente, setVehiculosCliente] = useState<IVehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del cliente y sus vehiculos
  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      // Obtener cliente por id
      const clienteData = await obtenerClientePorId(clienteId);
      setCliente(clienteData);

      // Obtener vehiculos del cliente
      const vehiculosData = await obtenerVehiculosPorCliente(clienteId);
      setVehiculosCliente(vehiculosData);

      setError(null);
    } catch (error: any) {
      setError(error.message || 'Error al cargar los datos del cliente');
      toast.error(error.message || 'Error al cargar los datos del cliente');
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    if (clienteId > 0) {
      cargarDatos();
    }
  }, [clienteId, cargarDatos]);

  if (!cliente) {
    return (
      <main className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/clientes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Cliente no encontrado</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>{error || 'El cliente solicitado no existe o ha sido eliminado.'}</p>
            <Button className="mt-4" onClick={() => navigate("/admin/clientes")}>
              Volver a la lista de clientes
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }
  const handleEliminar = async () => {
    try {
      setLoading(true);
      await eliminarCliente(clienteId);
      toast.success(`Cliente ${cliente.nombreCompleto} eliminado correctamente`);
      navigate("/admin/clientes");
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar el cliente");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>{cliente ? `${cliente.nombreCompleto} | Detalle de Cliente | AutoTaller` : 'Cliente | AutoTaller'}</title>
      </Helmet>

      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate("/admin/clientes")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{cliente.nombreCompleto}</h1>
              <p className="text-muted-foreground">Detalle del cliente</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/admin/clientes/editar/${cliente.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente el cliente y todos sus datos asociados del sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEliminar}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Información del cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Nombre completo</p>
                  <p className="font-medium">{cliente.nombreCompleto}</p>
                </div>


                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{cliente.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{cliente.telefono}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p>{cliente.direccion}</p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Vehículos registrados</p>
                <p className="text-3xl font-bold">{vehiculosCliente.length}</p>
              </div>

              <Button className="w-full" onClick={() => navigate(`/admin/vehiculos`)}>
                <Car className="mr-2 h-4 w-4" />
                Ver vehículos
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vehículos del cliente</CardTitle>
            <CardDescription>Lista de vehículos registrados para {cliente.nombreCompleto}</CardDescription>
          </CardHeader>
          <CardContent>
            {vehiculosCliente.length > 0 ? (
              <div className="space-y-4">
                {vehiculosCliente.map((vehiculo) => (
                  <Card key={vehiculo.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Car className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{vehiculo.marca} {vehiculo.modelo}</p>
                            <p className="text-sm text-muted-foreground">{vehiculo.anio} - {vehiculo.matricula}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No hay vehículos registrados</h3>
                <p className="mt-2 text-muted-foreground">
                  Este cliente no tiene vehículos registrados en el sistema.
                </p>
                <Button className="mt-4" onClick={() => navigate(`/admin/vehiculos/nuevo`)}>
                  Registrar un vehículo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
};
export default ClienteDetalle;