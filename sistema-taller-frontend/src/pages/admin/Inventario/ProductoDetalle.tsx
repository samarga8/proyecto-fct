import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { ArrowLeft, Package, Edit, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { obtenerDetalleProducto } from "../../../services/inventarioService";
import { DetalleProductoDTO } from "../../../models/inventario_dao/DetalleProductoDTO";

const ProductoDetalle = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<DetalleProductoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del producto desde la API
  useEffect(() => {
    const cargarProducto = async () => {
      if (!id || id === 'undefined') {
        setError("ID de producto no válido o no especificado");
        setLoading(false);
        return;
      }
      
      // Validar que el ID sea un número válido
      const numericId = Number(id);
      if (isNaN(numericId)) {
        setError("ID de producto no válido");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await obtenerDetalleProducto(numericId);
       
        setProducto(data);
        setError(null);
      } catch (err: any) {
        console.error("Error al cargar el producto:", err);
        setError(err.message || "Error al cargar el producto");
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  if (loading) {
    return (
      <main className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando información del producto...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-4">
              <Button onClick={() => navigate("/admin/inventario")}>
                Volver al inventario
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Producto no encontrado</AlertTitle>
          <AlertDescription>
            El producto que estás buscando no existe o ha sido eliminado.
            <div className="mt-4">
              <Button onClick={() => navigate("/admin/inventario")}>
                Volver al inventario
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  // Formatear precio para mostrar
  const precioFormateado = producto.costo ? `${producto.costo.toFixed(2)}€` : "0.00€";
  // Calcular valor total del inventario con verificación de stockActual
  const stockActualValue = producto.stockActual ?? 0; 
  const valorTotal = producto.costo ? (producto.costo * stockActualValue).toFixed(2) : "0.00";

  return (
    <>
      <Helmet>
        <title>{producto && producto.nombre ? `${producto.nombre} | Inventario | AutoTaller` : "Producto | Inventario | AutoTaller"}</title>
      </Helmet>
      
      <main className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/inventario")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{producto.nombre}</h1>
            <p className="text-muted-foreground">Detalles del producto</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/admin/inventario/stock/${producto.id}`)}>
              <Plus className="mr-2 h-4 w-4" />
              Añadir stock
            </Button>
            <Button onClick={() => navigate(`/admin/inventario/editar/${producto.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar producto
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Información general</CardTitle>
                  <CardDescription>Datos principales del producto</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
                  <p className="mt-1 font-medium">{producto.nombre}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Categoría</h3>
                  <p className="mt-1 font-medium">{producto.categoria}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Precio de venta</h3>
                  <p className="mt-1 font-medium">{precioFormateado}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Stock actual</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-medium">{stockActualValue}</p>
                    <Badge
                        variant={
                          producto.estado?.toLowerCase() === "disponible" ? "success" :
                          producto.estado?.toLowerCase() === "bajo" ? "warning" :
                          "destructive"
                        }
                      >
                      {producto.estado?.charAt(0).toUpperCase() + producto.estado?.slice(1) || producto.estado}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Stock mínimo</h3>
                  <p className="mt-1 font-medium">{producto.stockMinimo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Ubicación</h3>
                  <p className="mt-1 font-medium">{producto.ubicacion}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Proveedor</h3>
                  <p className="mt-1 font-medium">{producto.proveedor || "No especificado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Fecha de registro</h3>
                  <p className="mt-1 font-medium">{new Date(producto.fechaCreacion).toLocaleDateString()}</p>
                </div>
              </div>
              
              {producto.descripcion && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Descripción</h3>
                  <p className="text-sm">{producto.descripcion}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Estado del inventario</CardTitle>
              <CardDescription>Resumen y estadísticas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stock actual:</span>
                  <span className="font-medium">{stockActualValue} unidades</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      producto.estado?.toLowerCase() === "disponible" ? "bg-green-500" : 
                      producto.estado?.toLowerCase() === "bajo" ? "bg-yellow-500" : 
                      "bg-red-500"
                    }`} 
                    style={{ width: `${Math.min((stockActualValue / producto.stockMinimo) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {stockActualValue < producto.stockMinimo 
                    ? `${producto.stockMinimo - stockActualValue} unidades por debajo del mínimo`
                    : "Stock adecuado"}
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">Movimientos recientes</h3>
                <div className="space-y-3">
                  {producto.historialMovimientos && producto.historialMovimientos.slice(0, 3).map(movimiento => (
                    <div key={movimiento.id} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${movimiento.tipo === "Entrada" ? "bg-green-500" : "bg-red-500"}`}></div>
                      <div className="text-sm flex-1">
                        <span className="font-medium">{movimiento.tipo}</span>: {movimiento.cantidad} unidades
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(movimiento.fecha).toLocaleDateString()}</div>
                    </div>
                  ))}
                  {(!producto.historialMovimientos || producto.historialMovimientos.length === 0) && (
                    <div className="text-sm text-muted-foreground">No hay movimientos recientes</div>
                  )}
                </div>
              </div>
              
              {producto.precio && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">Valor del inventario</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Precio unitario:</span>
                      <span className="font-medium">{precioFormateado}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Valor total:</span>
                      <span className="font-medium">{valorTotal}€</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
           
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Historial de movimientos</CardTitle>
            <CardDescription>Registro de entradas y salidas del producto</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="movimientos">
              <TabsList className="mb-4">
                <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
              </TabsList>
              <TabsContent value="movimientos">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Descripción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {producto.historialMovimientos && producto.historialMovimientos.map((movimiento) => (
                      <TableRow key={movimiento.id}>
                        <TableCell>{new Date(movimiento.fecha).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={movimiento.tipo === "Entrada" ? "secondary" : "outline"}>
                            {movimiento.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {movimiento.tipo === "Entrada" ? "+" : "-"}{movimiento.cantidad}
                        </TableCell>
                        <TableCell>{movimiento.descripcion}</TableCell>
                      </TableRow>
                    ))}
                    {(!producto.historialMovimientos || producto.historialMovimientos.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">No hay movimientos registrados</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
             
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default ProductoDetalle;
