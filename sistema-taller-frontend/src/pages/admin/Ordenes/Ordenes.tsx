import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { MoreHorizontal, Plus, FileText, Eye, Play, AlertCircle, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { toast } from "sonner";
import { OrdenTrabajoDTO, EstadoOrden } from "../../../models/orden_dao/OrdenTrabajoDTO";
import { IEmpleado } from "../../../models/empleado_dao/IEmpleado";
import { EstadisticasOrdenesDTO } from "../../../models/orden_dao/EstadisticasOrdenesDTO";
import { ActualizarEstadoOrdenDTO } from "../../../models/orden_dao/ActualizarEstadoOrdenDTO";
import {
  listarOrdenes,
  obtenerEstadisticasOrdenes,
  actualizarEstadoOrden,
  asignarTecnico 
} from "../../../services/ordenService";
import { obtenerTecnicos } from "../../../services/EmpleadoService";

const GestionOrdenes = () => {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState<OrdenTrabajoDTO[]>([]);
  const [filteredOrdenes, setFilteredOrdenes] = useState<OrdenTrabajoDTO[]>([]);
  const [tecnicos, setTecnicos] = useState<IEmpleado[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasOrdenesDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrden, setSelectedOrden] = useState<OrdenTrabajoDTO | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isAsignarDialogOpen, setIsAsignarDialogOpen] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoOrden>("PENDIENTE");
  const [nuevoTecnico, setNuevoTecnico] = useState("");
  const [tabActual, setTabActual] = useState("todas");
  const [actualizandoEstado, setActualizandoEstado] = useState(false);


  const obtenerTecnicoDisponible = (): number | null => {
    return tecnicos[0].id;
  };

  // Cargar datos
  useEffect(() => {
    cargarDatos(); 
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [ordenesData, tecnicosData, estadisticasData] = await Promise.all([
        listarOrdenes(),
        obtenerTecnicos(), 
        obtenerEstadisticasOrdenes()
      ]);
      
      setOrdenes(ordenesData);
      setTecnicos(tecnicosData);
      setEstadisticas(estadisticasData);
    } catch (error: any) {
      toast.error(error.message || "Error al cargar los datos");
      // asegurar que los estados tengan valores por defecto
      setOrdenes([]);
      setFilteredOrdenes([]);
      setTecnicos([]);
    } finally {
      setLoading(false); 
    }
  };

  const aplicarFiltros = useCallback(() => {
    let result = [...ordenes];

    // Filtrar por tab actual
    if (tabActual !== "todas") {
      const estadoFiltro: EstadoOrden = tabActual === "pendientes" ? "PENDIENTE" :
        tabActual === "en-progreso" ? "EN_PROGRESO" : "COMPLETADA";
      result = result.filter(orden => orden.estado === estadoFiltro);
    }
    // Si tabActual === "todas", NO se aplica filtro por estado

    setFilteredOrdenes(result);
  }, [ordenes, tabActual]);

  useEffect(() => {
    aplicarFiltros();
  }, [aplicarFiltros]);


  const handleTabChange = (value: string) => {
    setTabActual(value);
   
  };

  // Corrección en handleActualizarEstado 
  const handleActualizarEstado = async () => {
    if (!selectedOrden || !nuevoEstado) return;
  
    try {
      setActualizandoEstado(true);
      // asignar tecnico si empleadoId es null
      let empleadoIdFinal: number | undefined = selectedOrden.empleadoId || undefined;
      
      if (!empleadoIdFinal) {
        const tecnicoDisponible = obtenerTecnicoDisponible();
        if (tecnicoDisponible === null) {
          toast.error("No hay técnicos disponibles para asignar a esta orden");
          return;
        }
        empleadoIdFinal = tecnicoDisponible; 
      }
      
      const datosActualizacion: ActualizarEstadoOrdenDTO = {
        ordenId: selectedOrden.id,
        nuevoEstado,
        observaciones: `Estado actualizado a ${nuevoEstado}${!selectedOrden.empleadoId ? ' - Técnico asignado automáticamente' : ''}`,
        empleadoId: empleadoIdFinal 
      };
  
      await actualizarEstadoOrden(datosActualizacion);
      toast.success(`Estado de la orden ${selectedOrden.numeroOrden} actualizado a: ${nuevoEstado}`);
      setIsUpdateDialogOpen(false);
  
      // Recargar datos
      await cargarDatos();
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar el estado");
    } finally {
      setActualizandoEstado(false);
    }
  };

  const handleAsignarTecnico = async () => {
  if (!selectedOrden || !nuevoTecnico) return;

  try {
    const tecnicoSeleccionado = Array.isArray(tecnicos) ? 
      tecnicos
        .filter(t => t && t.id) 
        .find(t => t.id.toString() === nuevoTecnico) : null;

    if (!tecnicoSeleccionado) {
      toast.error("Técnico no encontrado"); 
      return;
    }

    await asignarTecnico(
      selectedOrden.id, 
      tecnicoSeleccionado.id, 
      `Técnico asignado: ${tecnicoSeleccionado.nombre}`
    );
    
    toast.success(`Técnico ${tecnicoSeleccionado.nombre} asignado a la orden ${selectedOrden.numeroOrden}`);
    setIsAsignarDialogOpen(false);
    setNuevoTecnico("");

    // Recargar datos
    await cargarDatos();
  } catch (error: any) {
    toast.error(error.message || "Error al asignar técnico");
  } finally {
    setActualizandoEstado(false);
  }
};

  
  const iniciarReparacion = async (orden: OrdenTrabajoDTO) => {
    try {
      // Validación: asignar técnico si empleadoId es null
      let empleadoIdFinal: number | undefined = orden.empleadoId || undefined;
      
      if (!empleadoIdFinal) {
        const tecnicoDisponible = obtenerTecnicoDisponible();
        if (tecnicoDisponible === null) {
          toast.error("No hay técnicos disponibles para iniciar la reparación");
          return;
        }
        empleadoIdFinal = tecnicoDisponible;
      }
      
      const datosActualizacion: ActualizarEstadoOrdenDTO = {
        ordenId: orden.id,
        nuevoEstado: "EN_PROGRESO",
        observaciones: `Reparación iniciada${!orden.empleadoId ? ' - Técnico asignado automáticamente' : ''}`,
        empleadoId: empleadoIdFinal
      };
  
      await actualizarEstadoOrden(datosActualizacion);
      toast.success(`Reparación iniciada para la orden ${orden.numeroOrden}`);
  
      // Recargar datos
      await cargarDatos();
  
    
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar reparación");
    }
  };

  // Corrección en completarReparacion 
  const completarReparacion = async (orden: OrdenTrabajoDTO) => {
    try {
      // Validación: asignar técnico si empleadoId es null
      let empleadoIdFinal: number | undefined = orden.empleadoId || undefined;
      
      if (!empleadoIdFinal) {
        const tecnicoDisponible = obtenerTecnicoDisponible();
        if (tecnicoDisponible === null) {
          toast.error("No hay técnicos disponibles para completar la reparación");
          return;
        }
        empleadoIdFinal = tecnicoDisponible;
      }
      
      const datosActualizacion: ActualizarEstadoOrdenDTO = {
        ordenId: orden.id,
        nuevoEstado: "COMPLETADA",
        observaciones: `Reparación completada${!orden.empleadoId ? ' - Técnico asignado automáticamente' : ''}`,
        empleadoId: empleadoIdFinal
      };
  
      await actualizarEstadoOrden(datosActualizacion);
      toast.success(`Reparación completada para la orden ${orden.numeroOrden}`);
  
      // Recargar datos
      await cargarDatos();
    } catch (error: any) {
      toast.error(error.message || "Error al completar reparación");
    }
  };

const getEstadoBadgeVariant = (estado: EstadoOrden) => {
  switch (estado) {
    case "ORIGINAR":
        return "default";  
    case "PENDIENTE":
      return "outline";
    case "EN_PROGRESO":
      return "default";
    case "COMPLETADA":
      return "secondary";
    case "PAUSADA":
      return "destructive";
    default:
      return "outline";
  }
};


  const getPrioridadBadge = (esUrgente: boolean) => {
    if (esUrgente) {
      return <Badge variant="destructive" className="ml-2">Urgente</Badge>;
    }
    return <Badge variant="outline" className="ml-2">Normal</Badge>;
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando órdenes...</span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gestión de Órdenes | AutoTaller</title>
      </Helmet>

      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-2xl font-semibold">Órdenes de Trabajo</h1>
              <p className="text-muted-foreground">Administra y controla las órdenes de servicio</p>
            </div>
          </div>
          <div className="flex gap-2">
            
            <Button onClick={() => navigate("/admin/vehiculos")}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Nueva orden</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Órdenes activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estadisticas?.ordenesPendientes || ordenes.filter(o => o.estado === "EN_PROGRESO").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Órdenes pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estadisticas?.ordenesActivas || ordenes.filter(o => o.estado === "PENDIENTE").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Órdenes completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estadisticas?.ordenesCompletadasMes || ordenes.filter(o => o.estado === "COMPLETADA").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Lista de órdenes</CardTitle>
              
            </div>
            <CardDescription>Total de órdenes: {filteredOrdenes.length}</CardDescription>

            <div className="flex flex-col gap-4 pt-2">

              <Tabs defaultValue="todas" onValueChange={handleTabChange}>
                <TabsList className="grid w-full md:w-auto grid-cols-4">
                  <TabsTrigger value="todas">Todas</TabsTrigger>
                  <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                  <TabsTrigger value="en-progreso">En progreso</TabsTrigger>
                  <TabsTrigger value="completadas">Completadas</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Orden</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[120px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrdenes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No se encontraron órdenes que coincidan con los criterios de búsqueda
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrdenes.map((orden) => (
                    <TableRow key={orden.id}>
                      <TableCell className="font-medium">
                        {orden.numeroOrden}
                        {getPrioridadBadge(orden.esUrgente)}
                      </TableCell>
                      <TableCell>{orden.clienteNombre}</TableCell>
                      <TableCell>{orden.vehiculoInfo}</TableCell>
                      <TableCell>{formatearFecha(orden.fecha)}</TableCell>
                      <TableCell>{orden.tecnicoNombre}</TableCell>
                      <TableCell>{orden.servicios?.[0]?.nombre || 'Sin servicio'}...</TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadgeVariant(orden.estado)}>
                          {orden.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {orden.estado === "PENDIENTE" && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-green-600"
                              onClick={() => iniciarReparacion(orden)}
                              title="Iniciar reparación"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}

                          {orden.estado === "EN_PROGRESO" && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-green-600"
                              onClick={() => completarReparacion(orden)}
                              title="Marcar como completada"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => navigate(`/ordenes/orden-detalle/${orden?.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              {orden.estado === "ORIGINAR" && (
                                <DropdownMenuItem
                                  onClick={() => navigate(`/admin/vehiculos/nueva-orden/${orden.vehiculoId}`)}
                                >
                                  <Play className="mr-2 h-4 w-4" />
                                  Originar orden
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOrden(orden);
                                  setNuevoEstado(orden.estado);
                                  setIsUpdateDialogOpen(true);
                                }}
                              >
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Actualizar estado
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOrden(orden);
                                  setNuevoTecnico("");
                                  setIsAsignarDialogOpen(true);
                                }}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Asignar técnico
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Diálogo para actualizar estado */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar estado de orden</DialogTitle>
            <DialogDescription>
              Cambia el estado actual de la orden {selectedOrden?.numeroOrden}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={nuevoEstado} onValueChange={(value: EstadoOrden) => setNuevoEstado(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="EN_PROGRESO">En progreso</SelectItem>
                  <SelectItem value="COMPLETADA">Completada</SelectItem>
                  <SelectItem value="PAUSADA">Pausada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleActualizarEstado} disabled={actualizandoEstado}>
              {actualizandoEstado && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para asignar técnico */}
      <Dialog open={isAsignarDialogOpen} onOpenChange={setIsAsignarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar técnico</DialogTitle>
            <DialogDescription>
              Selecciona el técnico para la orden {selectedOrden?.numeroOrden}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tecnico">Técnico</Label>
              <Select value={nuevoTecnico} onValueChange={setNuevoTecnico}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar técnico" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(tecnicos) && tecnicos.length > 0 ? (
                    tecnicos
                      .filter(tecnico => 
                        tecnico && 
                        tecnico.id && 
                        tecnico.nombre
                        
                      )
                      .map(tecnico => (
                        <SelectItem key={tecnico.id} value={tecnico.id.toString()}>
                          {tecnico.nombre}
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem value="" disabled>
                      No hay técnicos disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAsignarDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAsignarTecnico} disabled={actualizandoEstado}>
              {actualizandoEstado && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Asignar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GestionOrdenes;
