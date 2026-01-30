import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { Separator } from "../../../components/ui/separator";
import { Calendar } from "../../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { ArrowLeft, Calendar as CalendarIcon, Save, Plus, X, Package } from "lucide-react";
import { cn } from "../../../lib/utils";
import { obtenerVehiculoPorId } from "../../../services/vehiculoService";
import { IVehiculo } from "../../../models/vehiculo_dao/IVehiculo";
import { crearOrdenServicio, originarOrdenServicio } from "../../../services/ordenService";
import { ServicioOrdenDTO } from "../../../models/servicio_dao/ServicioOrdenDTO";
import { OrdenServicioDTO } from "../../../models/orden_dao/OrdenServicioDTO";
import { EstadoOrden } from "../../../models/orden_dao/OrdenTrabajoDTO";
import { listarProductos } from "../../../services/inventarioService";
import { InventarioDTO } from "../../../models/inventario_dao/InventarioDTO";
import { PiezaOrdenDTO } from "../../../models/orden_dao/PiezaOrdenDTO";

// Interfaz para las piezas seleccionadas
interface PiezaSeleccionada {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  stockDisponible: number;
}

const NuevaOrdenServicio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ordenId = searchParams.get("ordenId") || undefined;
  const [vehiculo, setVehiculo] = useState<IVehiculo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioOrdenDTO[]>([]);
  const [descripcion, setDescripcion] = useState<string>("");
  const [esUrgente, setEsUrgente] = useState<boolean>(false);
  const [estadoInicial, setEstadoInicial] = useState<EstadoOrden>(ordenId ? "ORIGINAR" : "PENDIENTE");

  // Estados para el formulario de servicios
  const [nombreServicio, setNombreServicio] = useState<string>("");
  const [precioServicio, setPrecioServicio] = useState<string>("");
  const [erroresFormulario, setErroresFormulario] = useState<{ [key: string]: string }>({});

  // Estados para piezas del inventario
  const [inventarioDisponible, setInventarioDisponible] = useState<InventarioDTO[]>([]);
  const [piezasSeleccionadas, setPiezasSeleccionadas] = useState<PiezaSeleccionada[]>([]);
  const [piezaActual, setPiezaActual] = useState<string>("");
  const [cantidadPieza, setCantidadPieza] = useState<string>("1");
  const [loadingInventario, setLoadingInventario] = useState<boolean>(true);
  const [erroresPieza, setErroresPieza] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar vehículo e inventario en paralelo
        const [vehiculoData, inventarioData] = await Promise.all([
          obtenerVehiculoPorId(Number(id)),
          listarProductos()
        ]);

        setVehiculo(vehiculoData);
        // Filtrar solo productos con stock disponible
        const productosDisponibles = inventarioData.filter(producto =>
          producto.stockActual && producto.stockActual > 0
        );
        setInventarioDisponible(productosDisponibles);
      } catch (err: any) {
        setError(err.message || "Error al cargar los datos");
        toast.error(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
        setLoadingInventario(false);
      }
    };

    cargarDatos();
  }, [id]);

  const validarFormularioServicio = () => {
    const errores: { [key: string]: string } = {};

    if (!nombreServicio) {
      errores.nombre = "El concepto es obligatorio";
    }


    setErroresFormulario(errores);
    return Object.keys(errores).length === 0;
  };

  const handleAgregarServicio = () => {
    if (!validarFormularioServicio()) {
      return;
    }

    const precio = Number(precioServicio) || 0;
    const subtotal = precio;

    // Generar un ID único para el servicio
    const nuevoId = Date.now();

    const nuevoServicio: ServicioOrdenDTO = {
      servicioId: nuevoId,
      nombre: nombreServicio.trim(),
      precio: precio,
      subtotal: subtotal,
      tipo: "servicio"  
    };

    setServiciosSeleccionados([...serviciosSeleccionados, nuevoServicio]);

    setNombreServicio("");
    setPrecioServicio("");
    setErroresFormulario({});

    toast.success("Servicio agregado correctamente");
  };

  const handleRemoverServicio = (id: number) => {
    setServiciosSeleccionados(serviciosSeleccionados.filter(s => s.servicioId !== id));
  };

  const validarFormularioPieza = () => {
    const errores: { [key: string]: string } = {};

    if (!piezaActual) {
      errores.pieza = "Debe seleccionar una pieza";
    }

    if (!cantidadPieza.trim()) {
      errores.cantidad = "La cantidad es obligatoria";
    } else if (isNaN(Number(cantidadPieza)) || Number(cantidadPieza) < 1) {
      errores.cantidad = "La cantidad debe ser un número mayor o igual a 1";
    } else {
      const pieza = inventarioDisponible.find(p => p.id === Number(piezaActual));
      if (pieza && Number(cantidadPieza) > (pieza.stockActual || 0)) {
        errores.cantidad = `Stock insuficiente. Disponible: ${pieza.stockActual}`;
      }
    }

    setErroresPieza(errores);
    return Object.keys(errores).length === 0;
  };

  const handleAgregarPieza = () => {
    if (!validarFormularioPieza()) {
      return;
    }

    const pieza = inventarioDisponible.find(p => p.id === Number(piezaActual));
    if (!pieza) return;

    // Verificar si la pieza ya está agregada
    const yaExiste = piezasSeleccionadas.some(p => p.id === pieza.id);
    if (yaExiste) {
      toast.error("Esta pieza ya está agregada");
      return;
    }

    const cantidad = Number(cantidadPieza);
    const precio = pieza.precio || pieza.costo || 0;
    const subtotal = precio * cantidad;

    const nuevaPieza: PiezaSeleccionada = {
      id: pieza.id,
      nombre: pieza.nombre,
      precio: precio,
      cantidad: cantidad,
      subtotal: subtotal,
      stockDisponible: pieza.stockActual || 0
    };

    setPiezasSeleccionadas([...piezasSeleccionadas, nuevaPieza]);

    // Limpiar el formulario
    setPiezaActual("");
    setCantidadPieza("1");
    setErroresPieza({});

    toast.success("Pieza agregada correctamente");
  };

  const handleRemoverPieza = (id: number) => {
    setPiezasSeleccionadas(piezasSeleccionadas.filter(p => p.id !== id));
  };

  const calcularTotalPiezas = () => {
    return piezasSeleccionadas.reduce((sum, pieza) => sum + pieza.subtotal, 0);
  };

  const calcularTotalGeneral = () => {
    const totalServicios = serviciosSeleccionados.reduce((sum, item) => {
      const valor = item.subtotal || (item.precio) || 0;
      return sum + (isNaN(valor) ? 0 : valor);
    }, 0);
    const totalPiezas = calcularTotalPiezas();
    return totalServicios + totalPiezas;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehiculo || !date) {
      toast.error("Información incompleta para crear la orden");
      return;
    }

    if (serviciosSeleccionados.length === 0) {
      toast.error("Debe agregar al menos un servicio");
      return;
    }

    try {
      const totalServicios = serviciosSeleccionados.reduce((sum, item) => sum + (item.subtotal || item.precio), 0);
      const totalPiezas = calcularTotalPiezas();
      const subtotal = totalServicios + totalPiezas;
      const iva = subtotal * 0.21;
      const totalGeneral = subtotal + iva;

      // Mapear piezas seleccionadas al DTO
      const piezasDTO: PiezaOrdenDTO[] = piezasSeleccionadas.map(pieza => ({
        piezaId: pieza.id,
        nombre: pieza.nombre,
        precio: pieza.precio,
        cantidad: pieza.cantidad,
        subtotal: pieza.subtotal
      }));

      const ordenData: OrdenServicioDTO = {
        id: ordenId,
        clienteId: vehiculo.cliente.id,
        vehiculoId: vehiculo.id,
        empleadoId: 1,
        fecha: date,
        esUrgente,
        descripcion,
        estado: estadoInicial,
        servicios: serviciosSeleccionados,
        piezas: piezasDTO,
        totalServicios,
        totalPiezas,
        subtotal,
        totalGeneral
      };

      if (estadoInicial === "ORIGINAR" && ordenId) {
        await originarOrdenServicio(ordenData);
      } else {
        await crearOrdenServicio(ordenData);
      }

      toast.success("Orden de servicio creada correctamente");
      navigate("/admin/vehiculos");
    } catch (error: any) {
      toast.error(error.message || "Error al crear la orden de servicio");
    }
  };

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
        <title>Nueva Orden de Servicio | AutoTaller</title>
      </Helmet>
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/vehiculos/detalle/${id}`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Nueva Orden de Servicio</h1>
              <p className="text-muted-foreground">Crea una nueva orden para {vehiculo.marca} {vehiculo.modelo}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Detalles de la orden</CardTitle>
                <CardDescription>Información sobre el servicio a realizar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha programada</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="urgente" checked={esUrgente} onCheckedChange={(checked) => setEsUrgente(!!checked)} />
                  <Label htmlFor="urgente">Marcar como urgente</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="origen-orden">Origen de la orden</Label>
                  <Select
                    value={estadoInicial}
                    onValueChange={(value: EstadoOrden) => setEstadoInicial(value)}
                  >
                    <SelectTrigger id="origen-orden">
                      <SelectValue placeholder="Seleccionar origen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDIENTE">Orden directa</SelectItem>
                      <SelectItem value="ORIGINAR">Originada desde cita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción del servicio</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Describe el servicio o problema a resolver..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Sección de Servicios */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Servicios</h3>
                  </div>

                  {/* Formulario para añadir servicios */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Añadir servicio</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="concepto">Concepto</Label>
                          <Input
                            id="concepto"
                            value={nombreServicio}
                            onChange={(e) => setNombreServicio(e.target.value)}
                            className={cn(erroresFormulario.nombre && "border-red-500")}
                            placeholder="Ej: Cambio de aceite"
                          />
                          {erroresFormulario.nombre && (
                            <p className="text-sm text-red-500">{erroresFormulario.nombre}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="precio">Precio añadido(opcional)</Label>
                          <Input
                            id="precio"
                            type="number"
                            step="0.01"
                            min="0"
                            value={precioServicio || ''}
                            onChange={(e) => setPrecioServicio(e.target.value)}
                            className={cn(erroresFormulario.precio && "border-red-500")}
                            placeholder="0.00"
                          />
                          {erroresFormulario.precio && (
                            <p className="text-sm text-red-500">{erroresFormulario.precio}</p>
                          )}
                        </div>

                      </div>

                      <Button type="button" onClick={handleAgregarServicio} className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Añadir Servicio
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Tabla de servicios seleccionados */}
                  {serviciosSeleccionados.length === 0 ? (
                    <div className="text-center p-4 border rounded-md">
                      <p className="text-muted-foreground">No hay servicios agregados</p>
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="py-2 px-4 text-left">Servicio</th>
                            <th className="py-2 px-4 text-right">Precio Añadido</th>
                            
                            <th className="py-2 px-4 text-right">Subtotal</th>
                            <th className="py-2 px-4 text-center">Quitar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {serviciosSeleccionados.map((servicio) => {
              
                            return (
                              <tr key={servicio.servicioId} className="border-t">
                                <td className="py-3 px-4">{servicio.nombre}</td>
                                <td className="py-3 px-4 text-right">{servicio.precio.toFixed(2)}€</td>
                                <td className="py-3 px-4 text-right">{(servicio.subtotal || servicio.precio).toFixed(2)}€</td>
                                <td className="py-3 px-4 text-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoverServicio(servicio.servicioId)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="border-t bg-muted/20">
                            <td className="py-3 px-4 font-medium" colSpan={2}>Total Servicios</td>
                            <td className="py-3 px-4 text-right font-medium">
                              {serviciosSeleccionados.reduce((sum, item) => sum + (item.subtotal || item.precio), 0).toFixed(2)}€
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Sección de Piezas del Inventario */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Piezas del Inventario
                    </h3>
                  </div>

                  {/* Formulario para añadir piezas */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Seleccionar pieza del inventario</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="pieza">Pieza</Label>
                          <Select value={piezaActual} onValueChange={setPiezaActual} disabled={loadingInventario}>
                            <SelectTrigger className={cn(erroresPieza.pieza && "border-red-500")}>
                              <SelectValue placeholder={loadingInventario ? "Cargando piezas..." : "Seleccionar pieza"} />
                            </SelectTrigger>
                            <SelectContent>
                              {inventarioDisponible.length === 0 && !loadingInventario ? (
                                <div className="p-2 text-center text-sm text-muted-foreground">
                                  No hay piezas disponibles en inventario
                                </div>
                              ) : (
                                inventarioDisponible.map((pieza) => (
                                  <SelectItem key={pieza.id} value={pieza.id.toString()}>
                                    <div className="flex flex-col">
                                      <span>{pieza.nombre}</span>
                                      <span className="text-xs text-muted-foreground">
                                        Stock: {pieza.stockActual} | ${(pieza.precio || pieza.costo || 0).toFixed(2)}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          {erroresPieza.pieza && (
                            <p className="text-sm text-red-500">{erroresPieza.pieza}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cantidadPieza">Cantidad</Label>
                          <Input
                            id="cantidadPieza"
                            type="number"
                            min="1"
                            value={cantidadPieza}
                            onChange={(e) => setCantidadPieza(e.target.value)}
                            className={cn(erroresPieza.cantidad && "border-red-500")}
                            placeholder="1"
                          />
                          {erroresPieza.cantidad && (
                            <p className="text-sm text-red-500">{erroresPieza.cantidad}</p>
                          )}
                        </div>
                      </div>

                      {/* Mostrar información de la pieza seleccionada */}
                      {piezaActual && (
                        <div className="p-3 bg-muted rounded-md">
                          {(() => {
                            const pieza = inventarioDisponible.find(p => p.id === Number(piezaActual));
                            if (!pieza) return null;
                            const precio = pieza.precio || pieza.costo || 0;
                            const cantidad = Number(cantidadPieza) || 0;
                            return (
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p><strong>Categoría:</strong> {pieza.categoria}</p>
                                  <p><strong>Ubicación:</strong> {pieza.ubicacion}</p>
                                </div>
                                <div>
                                  <p><strong>Precio unitario:</strong> {precio.toFixed(2)}€</p>
                                  <p><strong>Subtotal:</strong> {(precio * cantidad).toFixed(2)}€</p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      <Button type="button" onClick={handleAgregarPieza} disabled={loadingInventario} className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Añadir Pieza
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Tabla de piezas seleccionadas */}
                  {piezasSeleccionadas.length === 0 ? (
                    <div className="text-center p-4 border rounded-md">
                      <p className="text-muted-foreground">No hay piezas seleccionadas</p>
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="py-2 px-4 text-left">Pieza</th>
                            <th className="py-2 px-4 text-right">Precio Unit.</th>
                            <th className="py-2 px-4 text-right">Cantidad</th>
                            <th className="py-2 px-4 text-right">Subtotal</th>
                            <th className="py-2 px-4 text-center">Quitar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {piezasSeleccionadas.map((pieza) => (
                            <tr key={pieza.id} className="border-t">
                              <td className="py-3 px-4">{pieza.nombre}</td>
                              <td className="py-3 px-4 text-right">{pieza.precio.toFixed(2)}€</td>
                              <td className="py-3 px-4 text-right">{pieza.cantidad}</td>
                              <td className="py-3 px-4 text-right">{pieza.subtotal.toFixed(2)}€</td>
                              <td className="py-3 px-4 text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoverPieza(pieza.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t bg-muted/20">
                            <td className="py-3 px-4 font-medium" colSpan={3}>Total Piezas</td>
                            <td className="py-3 px-4 text-right font-medium">{calcularTotalPiezas().toFixed(2)}€</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                {/* Total general */}
                <Separator />

              </CardContent>
            </Card>

            {/* Información del vehículo */}
            <Card>
              <CardHeader>
                <CardTitle>Información del vehículo</CardTitle>
                <CardDescription>Datos del vehículo para esta orden</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">{vehiculo.marca.substring(0, 1)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{vehiculo.marca} {vehiculo.modelo}</h3>
                      <p className="text-sm text-muted-foreground">{vehiculo.anio} • {vehiculo.matricula}</p>
                    </div>
                  </div>
                  <Separator />
                  {vehiculo.cliente && (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-medium">Cliente</h3>
                        <p>{vehiculo.cliente.nombreCompleto}</p>
                        <p className="text-sm text-muted-foreground">DNI: {vehiculo.cliente.dni}</p>
                      </div>
                    </>
                  )}
                  <div className="border-t pt-4">
                    <div className="border-t pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Subtotal:</span>
                          <span>{calcularTotalGeneral().toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>IVA (21%):</span>
                          <span>{(calcularTotalGeneral() * 0.21).toFixed(2)}€</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Total General:</span>
                            <span>{(calcularTotalGeneral() * 1.21).toFixed(2)}€</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button type="submit" className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Crear Orden de Servicio
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/admin/vehiculos/detalle/${id}`)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </>
  );
};

export default NuevaOrdenServicio;
