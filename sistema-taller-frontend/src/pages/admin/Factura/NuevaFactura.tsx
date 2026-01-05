import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Separator } from "../../../components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, CalendarIcon, Plus, Trash2 } from "lucide-react";

// Importar solo los servicios necesarios
import { listarClientes, obtenerVehiculosPorCliente } from "../../../services/clienteService";
import { listarServicios } from "../../../services/ordenService";
import { ICliente } from "../../../models/cliente_dao/ICliente";
import { IVehiculo } from "../../../models/vehiculo_dao/IVehiculo";
import { ServicioOrdenDTO } from "../../../models/servicio_dao/ServicioOrdenDTO";
import { listarProductos } from "../../../services/inventarioService";
import { InventarioDTO } from "../../../models/inventario_dao/InventarioDTO";
import { crearFactura as crearFacturaService } from "../../../services/facturacionService";
import { FacturaDTO } from "../../../models/factura_dao/FacturaDTO";


const NuevaFactura = () => {
  const navigate = useNavigate();
  const [clienteId, setClienteId] = useState("");
  const [vehiculoId, setVehiculoId] = useState("");
  const [items, setItems] = useState<Array<{ 
    servicioId: number, 
    nombre: string, 
    precio: number, 
    subtotal: number, 
    tipo: string,
    cantidad: number  
  }>>([]);
  const [formaPago, setFormaPago] = useState("efectivo");
  
  // Estados para datos del backend
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [vehiculos, setVehiculos] = useState<IVehiculo[]>([]);
  const [servicios, setServicios] = useState<ServicioOrdenDTO[]>([]);
  const [productos, setProductos] = useState<InventarioDTO[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviandoFactura, setEnviandoFactura] = useState(false);
  
  // Estados para fechas
  const fechaHoy = new Date().toISOString().split('T')[0];
  const fechaVencimiento = new Date();
  fechaVencimiento.setDate(fechaVencimiento.getDate() + 15); // 15 días para vencimiento por defecto
  
  const [fechaEmision, setFechaEmision] = useState(fechaHoy);
  const [fechaVenc, setFechaVenc] = useState(fechaVencimiento.toISOString().split('T')[0]);
  
  // Cargar clientes y servicios al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Cargar vehículos cuando se selecciona un cliente
  useEffect(() => {
    if (clienteId) {
      cargarVehiculosPorCliente(parseInt(clienteId));
    } else {
      setVehiculos([]);
      setVehiculoId("");
    }
  }, [clienteId]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [clientesData, serviciosData, productosData] = await Promise.all([
        listarClientes(),
        listarServicios(),
        listarProductos() 
      ]);
      
      setClientes(clientesData);
      setServicios(serviciosData);
      setProductos(productosData); // AGREGAR ESTA LÍNEA
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos del formulario');
    } finally {
      setCargando(false);
    }
  };

  const cargarVehiculosPorCliente = async (clienteIdNum: number) => {
    try {
      const vehiculosData = await obtenerVehiculosPorCliente(clienteIdNum);
      setVehiculos(vehiculosData);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      toast.error('Error al cargar los vehículos del cliente');
      setVehiculos([]);
    }
  };

  // Función para agregar un servicio a la factura
  const agregarServicio = (servicioId: string) => {
    const servicio = servicios.find(s => s.servicioId.toString() === servicioId);
    if (servicio && servicio.precio) {
      setItems([...items, {
        servicioId: servicio.servicioId,
        nombre: servicio.nombre,
        precio: servicio.precio,
        subtotal: servicio.precio,
        tipo: "servicio",
        cantidad: 1  // ✅ AÑADIR ESTA LÍNEA
      }]);
    }
  };

  
  const agregarProducto = (productoId: string) => {
    const producto = productos.find(p => p.id.toString() === productoId);
    if (producto && producto.precio) {
      setItems([...items, {
        servicioId: producto.id,       
        nombre: producto.nombre,
        precio: producto.precio,
        subtotal: producto.precio,     
        tipo: "producto",
        cantidad: 1            
      }]);
    }
  };

  // Función para filtrar vehículos por cliente seleccionado
  const vehiculosFiltrados = vehiculos.filter(v => v.cliente?.id?.toString() === clienteId);
  const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const impuestos = subtotal * 0.21; 
  const total = subtotal + impuestos;
  
  // Función para eliminar un ítem de la factura
  const eliminarItem = (index: number) => {
    const nuevosItems = [...items];
    nuevosItems.splice(index, 1);
    setItems(nuevosItems);
  };
  
  // Función para actualizar la cantidad de un ítem
  const actualizarCantidad = (index: number, cantidad: number) => {
    const nuevosItems = [...items];
    nuevosItems[index].cantidad = cantidad;
    setItems(nuevosItems);
  };
  
  // Función para manejar la creación de la factura
  const crearFactura = async () => {
    
    if (!clienteId) {
      toast.error("Debe seleccionar un cliente");
      return;
    }
    
    if (!vehiculoId) {
      toast.error("Debe seleccionar un vehículo");
      return;
    }
    
    if (items.length === 0) {
      toast.error("Debe agregar al menos un ítem a la factura");
      return;
    }
    
    try {
      setEnviandoFactura(true);
      
      // Preparar los datos de la factura
      const facturaData: Partial<FacturaDTO> = {
        clienteId: parseInt(clienteId),
        vehiculoId: parseInt(vehiculoId),
        fecha: fechaEmision,
        fechaVencimiento: fechaVenc,
        subtotal: subtotal,
        impuestos: impuestos,
        total: total,
        metodoPago: formaPago,
        estadoFactura: "PENDIENTE",
        servicios: items.map(item => ({
          servicioId: item.servicioId,
          nombre: item.nombre,
          precio: item.precio,
          subtotal: item.subtotal,
          tipo: item.tipo,
          cantidad: item.cantidad
        }))
      };
      
      const facturaCreada = await crearFacturaService(facturaData);
      console.log('Respuesta del backend:', facturaCreada);
      
      toast.success("Factura creada correctamente");
      navigate("/admin/facturacion");
    } catch (error: any) {
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      toast.error(error.message || 'Error al crear la factura');
    } finally {
      setEnviandoFactura(false);
    }
  };
  
  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Nueva Factura | AutoTaller</title>
      </Helmet>
      
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin/facturacion">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Nueva Factura</h1>
              <p className="text-muted-foreground">Crea una nueva factura para un cliente</p>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-12">
          {/* Información principal */}
          <Card className="md:col-span-8">
            <CardHeader>
              <CardTitle>Información de la factura</CardTitle>
              <CardDescription>Completa los datos básicos de la factura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha de emisión</Label>
                  <div className="relative">
                    <Input 
                      id="fecha" 
                      type="date" 
                      value={fechaEmision}
                      onChange={(e) => setFechaEmision(e.target.value)}
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vencimiento">Fecha de vencimiento</Label>
                  <div className="relative">
                    <Input 
                      id="vencimiento" 
                      type="date" 
                      value={fechaVenc}
                      onChange={(e) => setFechaVenc(e.target.value)}
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Select value={clienteId} onValueChange={setClienteId}>
                    <SelectTrigger id="cliente">
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map(cliente => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>{cliente.nombreCompleto}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehiculo">Vehículo</Label>
                  <Select value={vehiculoId} onValueChange={setVehiculoId} disabled={!clienteId}>
                    <SelectTrigger id="vehiculo">
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehiculosFiltrados.map(vehiculo => (
                        <SelectItem key={vehiculo.id} value={vehiculo.id.toString()}>
                          {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notas">Notas</Label>
                <Textarea id="notas" placeholder="Agregar notas o comentarios a la factura" />
              </div>
            </CardContent>
          </Card>
          
          {/* Opciones de pago */}
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Opciones de pago</CardTitle>
              <CardDescription>Configura las opciones de pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="formaPago">Forma de pago</Label>
                <Select value={formaPago} onValueChange={setFormaPago}>
                  <SelectTrigger id="formaPago">
                    <SelectValue placeholder="Seleccionar forma de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta de crédito/débito</SelectItem>
                    <SelectItem value="transferencia">Transferencia bancaria</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estado">Estado inicial</Label>
                <Select defaultValue="pendiente">
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="pagada">Pagada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
            </CardContent>
          </Card>
          
          {/* Agregar ítems */}
          <Card className="md:col-span-12">
            <CardHeader>
              <CardTitle>Ítems de la factura</CardTitle>
              <CardDescription>Agrega los servicios y productos a facturar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="servicio">Agregar servicio</Label>
                  <div className="flex gap-2">
                   <Select onValueChange={agregarServicio}>
                      <SelectTrigger id="servicio">
                        <SelectValue placeholder="Seleccionar servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {servicios.map(servicio => (
                          <SelectItem key={servicio.servicioId} value={servicio.servicioId.toString()}>{servicio.nombre} - {servicio.precio.toFixed(2)}€</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={() => agregarServicio("1")}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="producto">Agregar producto</Label>
                  <div className="flex gap-2">
                    <Select onValueChange={agregarProducto}>
                      <SelectTrigger id="producto">
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {productos.map(producto => (
                          <SelectItem key={producto.id} value={producto.id.toString()}>{producto.nombre} - {producto.precio?.toFixed(2) || '0.00'}€</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ítem</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="w-[100px] text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Precio unitario</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No hay ítems en la factura. Agrega servicios o productos.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell>{item.tipo === "servicio" ? "Servicio" : "Producto"}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) => actualizarCantidad(index, parseInt(e.target.value) || 1)}
                            className="w-16 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">{item.precio.toFixed(2)}€</TableCell>
                        <TableCell className="text-right">{(item.precio * item.cantidad).toFixed(2)}€</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => eliminarItem(index)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div>
                <Button variant="outline" asChild>
                  <Link to="/dashboard/facturacion">Cancelar</Link>
                </Button>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-sm">
                  Subtotal: <span className="font-semibold">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="text-sm">
                  Impuestos (21%): <span className="font-semibold">{impuestos.toFixed(2)}€</span>
                </div>
                <div className="text-lg font-bold">
                  Total: {total.toFixed(2)}€
                </div>
                <Button 
                  onClick={() => {
                    crearFactura();
                  }} 
                  disabled={cargando || enviandoFactura || items.length === 0}
                >
                  {enviandoFactura ? "Creando..." : "Crear factura"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
};
export default NuevaFactura;