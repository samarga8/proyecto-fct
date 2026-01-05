import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Package, Plus, AlertCircle, History } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { obtenerDetalleProducto, actualizarStock } from "../../../services/inventarioService";
import { DetalleProductoDTO } from "../../../models/inventario_dao/DetalleProductoDTO";
import { MovimientoStockDTO } from "@/models/inventario_dao/MovimientoStockDTO";

const AnadirStock = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<DetalleProductoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el formulario de añadir stock
  const [cantidad, setCantidad] = useState("1");
  const [tipoMovimiento, setTipoMovimiento] = useState<"entrada" | "salida">("entrada");
  const [proveedor, setProveedor] = useState("");
  const [costo, setCosto] = useState("");
  const [notas, setNotas] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formErrors, setFormErrors] = useState({
    cantidad: "",
    costo: ""
  });
  
  // Cargar datos del producto desde la API
  useEffect(() => {
    const cargarProducto = async () => {
      if (!id) {
        setError("ID de producto no especificado");
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
        
        // Pre-llenar el proveedor y costo si está disponible
        if (data.proveedor) {
          setProveedor(data.proveedor);
        }
        
        if (data.costo) {
          setCosto(data.costo.toString());
        }
        
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validación manual
    const errors = {
      cantidad: "",
      costo: ""
    };
    
    let hasError = false;
    
    if (!cantidad || isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
      errors.cantidad = "Introduce una cantidad válida mayor a 0";
      hasError = true;
    }
    
    if (tipoMovimiento === "entrada" && (!costo || isNaN(Number(costo)) || Number(costo) < 0)) {
      errors.costo = "Introduce un costo válido";
      hasError = true;
    }
    
    setFormErrors(errors);
    
    if (hasError || !producto || !id) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const movimiento: MovimientoStockDTO = {
        productoId: Number(id),
        cantidad: Number(cantidad),
        tipoMovimiento: tipoMovimiento,
        notas: notas
      };
      
      if (tipoMovimiento === "entrada") {
        movimiento.proveedor = proveedor || undefined;
        movimiento.costo = costo ? Number(costo) : undefined;
      }
      
      await actualizarStock(movimiento);
      
      const mensaje = tipoMovimiento === "entrada" 
        ? `Se han añadido ${cantidad} unidades al inventario`
        : `Se han retirado ${cantidad} unidades del inventario`;
      
      toast.success(mensaje);
      navigate(`/admin/inventario/detalles/${id}`);
    } catch (err: any) {
      console.error("Error al actualizar el stock:", err);
      toast.error(err.message || "Error al actualizar el stock");
    } finally {
      setIsSubmitting(false);
    }
  }

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
              <Button onClick={() => navigate("/dashboard/inventario")}>
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
              <Button onClick={() => navigate("/dashboard/inventario")}>
                Volver al inventario
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  // Obtener el stock actual del producto
  const stockActual = producto.stockActual !== undefined ? producto.stockActual : producto.stockInicial;
  
  return (
    <>
      <Helmet>
        <title>Añadir Stock | {producto.nombre} | AutoTaller</title>
      </Helmet>
      
      <main className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(`/admin/inventario`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Actualizar Stock</h1>
            <p className="text-muted-foreground">Añadir o retirar stock del producto</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Movimiento de inventario</CardTitle>
                  <CardDescription>
                    Registra la entrada o salida de unidades
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoMovimiento">Tipo de movimiento *</Label>
                    <Select value={tipoMovimiento} onValueChange={(value: "entrada" | "salida") => setTipoMovimiento(value)}>
                      <SelectTrigger id="tipoMovimiento">
                        <SelectValue placeholder="Selecciona tipo de movimiento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entrada">Entrada de stock</SelectItem>
                        <SelectItem value="salida">Salida de stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cantidad">Cantidad *</Label>
                    <Input 
                      id="cantidad" 
                      placeholder="1" 
                      type="number"
                      min="1"
                      value={cantidad} 
                      onChange={(e) => setCantidad(e.target.value)}
                    />
                    {formErrors.cantidad && (
                      <p className="text-sm font-medium text-destructive">{formErrors.cantidad}</p>
                    )}
                  </div>
                </div>
                
                {tipoMovimiento === "entrada" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="proveedor">Proveedor</Label>
                        <Input 
                          id="proveedor" 
                          placeholder="Nombre del proveedor" 
                          value={proveedor} 
                          onChange={(e) => setProveedor(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="costo">Costo unitario ($) *</Label>
                        <Input 
                          id="costo" 
                          placeholder="0.00" 
                          type="number"
                          step="0.01"
                          min="0"
                          value={costo} 
                          onChange={(e) => setCosto(e.target.value)}
                        />
                        {formErrors.costo && (
                          <p className="text-sm font-medium text-destructive">{formErrors.costo}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
                
                {tipoMovimiento === "salida" && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Stock actual: {stockActual} unidades</AlertTitle>
                    <AlertDescription>
                      {Number(cantidad) > stockActual ? (
                        <span className="text-destructive font-medium">
                          ¡Atención! La cantidad que intentas retirar ({cantidad}) es mayor que el stock disponible.
                        </span>
                      ) : (
                        <span>
                          Después de esta operación, quedarán {stockActual - Number(cantidad)} unidades en stock.
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="notas">Notas o motivo</Label>
                  <Textarea 
                    id="notas" 
                    placeholder={tipoMovimiento === "entrada" ? "Notas sobre la compra..." : "Motivo de la salida de inventario..."}
                    rows={3}
                    value={notas} 
                    onChange={(e) => setNotas(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/admin/inventario`)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={tipoMovimiento === "salida" && Number(cantidad) > stockActual || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {tipoMovimiento === "entrada" ? "Añadir al inventario" : "Registrar salida"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Información del producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{producto.nombre}</p>
                  <p className="text-sm text-muted-foreground">{producto.categoria}</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-3 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock actual:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stockActual}</span>
                    <Badge 
                      variant={
                        producto.estado?.toLowerCase() === "disponible" ? "success" :
                        producto.estado?.toLowerCase() === "bajo" ? "warning" :
                            "destructive"
                      }
                    >
                      {producto.estado || "Normal"}
                    </Badge>
                  </div>
                </div>
               
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock mínimo:</span>
                  <span className="font-medium">{producto.stockMinimo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio:</span>
                  <span className="font-medium">{producto.precio ? producto.precio.toFixed(2) : '0.00'}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Costo:</span>
                  <span className="font-medium">{producto.costo ? producto.costo.toFixed(2) : '0.00'}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ubicación:</span>
                  <span className="font-medium">{producto.ubicacion}</span>
                </div>
              
              </div>
              
              
              <div className="pt-3 border-t">
                <h3 className="text-sm font-medium mb-2">Después del movimiento:</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nuevo stock:</span>
                    <span className="font-medium">
                      {tipoMovimiento === "entrada" 
                        ? stockActual + Number(cantidad || 0)
                        : Math.max(0, stockActual - Number(cantidad || 0))}
                    </span>
                  </div>
                  
                  {tipoMovimiento === "entrada" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor total:</span>
                      <span className="font-medium">
                        {(Number(costo || 0) * Number(cantidad || 0)).toFixed(2)}€
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {producto.historialMovimientos && producto.historialMovimientos.length > 0 && (
                <div className="pt-3 border-t">
                  <h3 className="flex items-center gap-1 text-sm font-medium mb-2">
                    <History className="h-4 w-4" />
                    Últimos movimientos
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {producto.historialMovimientos.slice(0, 3).map((movimiento) => (
                      <div key={movimiento.id} className="text-sm p-2 rounded bg-muted">
                        <div className="flex justify-between">
                          <span>
                            <Badge variant={movimiento.tipo === "Entrada" ? "outline" : "secondary"}>
                              {movimiento.tipo}
                            </Badge>
                            <span className="ml-1">{movimiento.cantidad} unidades</span>
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(movimiento.fecha).toLocaleDateString()}
                          </span>
                        </div>
                        {movimiento.descripcion && (
                          <p className="text-xs text-muted-foreground mt-1">{movimiento.descripcion}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default AnadirStock;