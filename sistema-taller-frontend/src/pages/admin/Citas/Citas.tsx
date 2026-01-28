import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Calendar as CalendarIcon, MoreHorizontal, Filter, Plus, Clock, X } from "lucide-react";
import { Calendar } from "../../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { CitaDTO } from "../../../models/cita_dao/CitaDTO";
import { obtenerCitasPorFecha, eliminarCita } from "../../../services/citasService";

const Citas = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [citas, setCitas] = useState<CitaDTO[]>([]);
  const [citasFuturas, setCitasFuturas] = useState<CitaDTO[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  
  // Función para formatear la fecha en formato YYYY-MM-DD
  const formatearFechaParaAPI = (fecha: Date): string => {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


  // Función para cargar las citas del día seleccionado
  const cargarCitas = async () => {
    if (!date) return;

    setCargando(true);
    try {
      // Obtener citas para la fecha seleccionada
      const fechaFormateada = formatearFechaParaAPI(date);
      const citasDelDia = await obtenerCitasPorFecha(fechaFormateada);
      setCitas(citasDelDia);
      
      // Obtener citas para el día siguiente (citas futuras)
      const manana = new Date(date);
      manana.setDate(manana.getDate() + 1);
      const fechaManana = formatearFechaParaAPI(manana);
      const citasManana = await obtenerCitasPorFecha(fechaManana);
      setCitasFuturas(citasManana);
    } catch (error) {
      console.error("Error al cargar las citas:", error);
      toast.error("Error al cargar las citas");
    } finally {
      setCargando(false);
    }
  };

  // Cargar citas cuando cambie la fecha seleccionada
  useEffect(() => {
    cargarCitas();
  }, [date]);


  // Función para cancelar una cita
  const cancelarCita = async (id: number) => {
    try {
      await eliminarCita(id);
      toast.success("Cita cancelada correctamente");
      cargarCitas(); // Recargar las citas
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      toast.error("Error al cancelar la cita");
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Citas | AutoTaller</title>
      </Helmet>
      
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Citas</h1>
            <p className="text-muted-foreground">Gestiona las citas programadas</p>
          </div>
          <Button onClick={() => navigate("/admin/citas/nueva")}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Nueva cita</span>
          </Button>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Citas programadas</CardTitle>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <CardDescription>Citas para: {date ? format(date, "PPP", { locale: es }) : "Hoy"}</CardDescription>
              </CardHeader>
              <CardContent>
                {cargando ? (
                  <div className="text-center py-4">Cargando citas...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Vehículo</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead className="w-[80px]">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {citas.map((cita) => (
                        <TableRow key={cita.id}>
                          <TableCell>
                            <div className="font-medium">{cita.cliente?.nombreCompleto}</div>
                            <div className="text-xs text-muted-foreground">{cita.cliente?.telefono}</div>
                          </TableCell>
                          <TableCell>{cita.vehiculo?.modelo}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {cita.hora}
                            </div>
                          </TableCell>
                          <TableCell>{cita.servicio}</TableCell>
                        
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
                                <DropdownMenuItem>
                                  Editar cita
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => cancelarCita(cita.id)}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Cancelar cita
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
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Próximas citas</CardTitle>
                <CardDescription>Citas programadas para los próximos días</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cargando ? (
                  <div className="text-center py-4">Cargando citas...</div>
                ) : citasFuturas.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No hay citas programadas para los próximos días</div>
                ) : (
                  citasFuturas.map((cita) => (
                    <Card key={cita.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                              <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{cita.cliente?.nombreCompleto}</p>
                              <p className="text-sm text-muted-foreground">{cita.vehiculo?.modelo}</p>
                            </div>
                          </div>
                         
                        </div>
                        <div className="mt-3">
                          <p className="text-sm"><span className="font-medium">Fecha:</span> {cita.fecha}</p>
                          <p className="text-sm"><span className="font-medium">Hora:</span> {cita.hora}</p>
                          <p className="text-sm"><span className="font-medium">Servicio:</span> {cita.servicio}</p>
                        </div>
                     
                      </CardContent>
                    </Card>
                  ))
                )}
             
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default Citas;