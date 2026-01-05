import { Helmet } from "react-helmet-async";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Car, MoreHorizontal, FileText, Wrench, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { listarVehiculos, eliminarVehiculo } from "../../../services/vehiculoService";
import { IVehiculo } from "@/models/vehiculo_dao/IVehiculo";

const Vehiculos = () => {
  const navigate = useNavigate();
  const [vehiculosList, setVehiculosList] = useState<IVehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eliminarDialogOpen, setEliminarDialogOpen] = useState(false);
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState<number | null>(null);

  // Cargar vehículos al montar el componente
  useEffect(() => {
    const cargarVehiculos = async () => {
      try {
        setLoading(true);
        const data = await listarVehiculos();
        setVehiculosList(data);
        setError(null);
      } catch (error: any) {
        setError(error.message || "Error al cargar los vehículos");
        toast.error(error.message || "Error al cargar los vehículos");
      } finally {
        setLoading(false);
      }
    };

    cargarVehiculos();
  }, []);

  const handleEliminarVehiculo = async () => {
    if (vehiculoAEliminar !== null) {
      try {
        await eliminarVehiculo(vehiculoAEliminar);
        setVehiculosList(vehiculosList.filter(v => v.id !== vehiculoAEliminar));
        toast.success("Vehículo eliminado correctamente");
      } catch (error: any) {
        toast.error(error.message || "Error al eliminar el vehículo");
      } finally {
        setEliminarDialogOpen(false);
        setVehiculoAEliminar(null);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Vehículos | AutoTaller</title>
      </Helmet>
      
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          <div>
            <h1 className="text-2xl font-semibold">Vehículos</h1>
            <p className="text-muted-foreground">Gestiona los vehículos registrados en tu taller</p>
          </div>
          </div>
          <Button onClick={() => navigate('/admin/vehiculos/nuevo')}>
            <Car className="mr-2 h-4 w-4" />
            <span>Nuevo vehículo</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Lista de vehículos</CardTitle>
              
            </div>
            <CardDescription>Total de vehículos: {vehiculosList.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <p>Cargando vehículos...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-8 text-red-500">
                <p>{error}</p>
              </div>
            ) : vehiculosList.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <p>No hay vehículos registrados</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Matricula</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="w-[80px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiculosList.map((vehiculo) => (
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
                     <TableCell>{vehiculo.cliente?.nombreCompleto || "Sin cliente asignado"}</TableCell>
                     
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
                            <DropdownMenuItem onClick={() => navigate(`/admin/vehiculos/detalle/${vehiculo.id}`)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/vehiculos/editar/${vehiculo.id}`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar vehículo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/vehiculos/nueva-orden/${vehiculo.id}`)}>
                              <Wrench className="mr-2 h-4 w-4" />
                              Crear orden de servicio
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => {
                                setVehiculoAEliminar(vehiculo.id);
                                setEliminarDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
      <AlertDialog open={eliminarDialogOpen} onOpenChange={setEliminarDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el vehículo permanentemente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEliminarVehiculo} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Vehiculos;