import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Car, MoreHorizontal, FileText, Wrench, ArrowLeft, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { obtenerClientePorId, obtenerVehiculosPorCliente } from "../../../services/clienteService";
import { ICliente } from "@/models/cliente_dao/ICliente";
import { IVehiculo } from "@/models/vehiculo_dao/IVehiculo";
import { eliminarVehiculo } from "../../../services/vehiculoService";

const ClienteVehiculos = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const clienteId = parseInt(id || "0");
  
  // Estados para almacenar los datos del cliente y sus vehículos
  const [cliente, setCliente] = useState<ICliente | null>(null);
  const [vehiculosCliente, setVehiculosCliente] = useState<IVehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar datos del cliente y sus vehículos
  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      // Obtener cliente por id
      const clienteData = await obtenerClientePorId(clienteId);
      setCliente(clienteData);
      
      // Obtener vehículos del cliente
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
  
  const handleEliminarVehiculo = async (vehiculoId: number) => {
    try {
      await eliminarVehiculo(vehiculoId);
      // Actualizar la lista de vehículos después de eliminar
      setVehiculosCliente(prev => prev.filter(v => v.id !== vehiculoId));
      toast.success("Vehículo eliminado correctamente");
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar el vehículo");
    }
  };

  if (loading) {
    return (
      <main className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/clientes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Cargando...</h1>
        </div>
      </main>
    );
  }
  
  if (error || !cliente) {
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
  
  return (
    <>
      <Helmet>
        <title>Vehículos de {cliente.nombreCompleto} | AutoTaller</title>
      </Helmet>
      
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate(`/admin/clientes/detalle/${clienteId}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Vehículos de {cliente.nombreCompleto}</h1>
              <p className="text-muted-foreground">Gestiona los vehículos registrados para este cliente</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/admin/clientes/detalle/${clienteId}`)}>
              <UserCircle className="mr-2 h-4 w-4" />
              Ver cliente
            </Button>
            <Button onClick={() => navigate(`/admin/vehiculos/nuevo`)}>
              <Car className="mr-2 h-4 w-4" />
              Registrar vehículo
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vehículos del cliente</CardTitle>
                <CardDescription>Total de vehículos: {vehiculosCliente.length}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {vehiculosCliente.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead className="w-[80px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiculosCliente.map((vehiculo) => (
                    <TableRow key={vehiculo.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <Car className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{vehiculo.marca} {vehiculo.modelo}</p>
                            <p className="text-sm text-muted-foreground">{vehiculo.anio}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{vehiculo.matricula}</TableCell>
                      
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
                            <DropdownMenuItem onClick={() => {
                              navigate(`/admin/vehiculos/detalle/${vehiculo.id}`);
                            }}>
                              <FileText className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              navigate(`/admin/vehiculos/editar/${vehiculo.id}`);
                            }}>
                              Editar vehículo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              navigate(`/admin/vehiculos/nueva-orden/${vehiculo.id}`);
                            }}>
                              <Wrench className="mr-2 h-4 w-4" />
                              Crear orden de servicio
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleEliminarVehiculo(vehiculo.id)}
                            >
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
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

export default ClienteVehiculos;