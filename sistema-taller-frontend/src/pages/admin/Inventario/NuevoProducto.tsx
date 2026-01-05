import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, Package } from "lucide-react";
import { agregarProducto } from "../../../services/inventarioService";

const NuevoProducto = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [costo, setCosto] = useState("");
  const [stock, setStock] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formErrors, setFormErrors] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    costo: "",
    stockInicial: "",
    stockMinimo: "",
    ubicacion: "",
    proveedor: ""
  });
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validación manual
    const errors = {
      nombre: "",
      categoria: "",
      precio: "",
      costo: "",
      stockInicial: "",
      stockMinimo: "",
      ubicacion: "",
      proveedor: "",
      descripcion: ""
    };

    let hasError = false;

    if (nombre.length < 3) {
      errors.nombre = "El nombre debe tener al menos 3 caracteres";
      hasError = true;
    }

    if (!categoria) {
      errors.categoria = "Debes seleccionar una categoría";
      hasError = true;
    }

    if (!precio || isNaN(Number(precio)) || Number(precio) <= 0) {
      errors.precio = "Introduce un precio válido";
      hasError = true;
    }
    if (!costo || isNaN(Number(costo)) || Number(costo) <= 0) {
      errors.costo = "Introduce un costo válido";
      hasError = true;
    }

    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
      errors.stockInicial = "Introduce una cantidad válida";
      hasError = true;
    }

    if (!stockMinimo || isNaN(Number(stockMinimo)) || Number(stockMinimo) < 0) {
      errors.stockMinimo = "Introduce un valor válido para stock mínimo";
      hasError = true;
    }

    if (!proveedor) {
      errors.proveedor = "Debes seleccionar un proveedor";
      hasError = true;
    }

    if (!ubicacion) {
      errors.ubicacion = "Introduce una ubicación";
      hasError = true;
    }

    setFormErrors(errors);

    if (hasError) {
      return;
    }

    try {
      setIsLoading(true);

      // Crear objeto de producto para enviar al backend
      const nuevoProducto = {
        nombre,
        categoria,
        precio: Number(precio),
        costo: Number(costo),
        stockInicial: Number(stock),
        stockActual: Number(stock), 
        stockMinimo: Number(stockMinimo),
        ubicacion,
        proveedor,
        descripcion
      };

      // Llamar al servicio para agregar el producto
      await agregarProducto(nuevoProducto);

      toast.success("Producto agregado correctamente");
      navigate("/admin/inventario");
    } catch (error: any) {
      toast.error(error.message || "Error al agregar el producto");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <Helmet>
        <title>Nuevo Producto | AutoTaller</title>
      </Helmet>

      <main className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/inventario")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Nuevo Producto</h1>
            <p className="text-muted-foreground">Añade un nuevo producto al inventario</p>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Información del producto</CardTitle>
                <CardDescription>
                  Introduce los datos del nuevo producto. Los campos marcados con * son obligatorios.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del producto *</Label>
                  <Input
                    id="nombre"
                    placeholder="Nombre del producto"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                  {formErrors.nombre && (
                    <p className="text-sm font-medium text-destructive">{formErrors.nombre}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Select value={categoria} onValueChange={setCategoria}>
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lubricantes">Lubricantes</SelectItem>
                      <SelectItem value="Neumaticos">Neumaticos</SelectItem>
                      <SelectItem value="Filtros">Filtros</SelectItem>
                      <SelectItem value="Frenos">Frenos</SelectItem>
                      <SelectItem value="Encendido">Encendido</SelectItem>
                      <SelectItem value="Refrigeración">Refrigeración</SelectItem>
                      <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                      <SelectItem value="Herramientas">Herramientas</SelectItem>
                      <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.categoria && (
                    <p className="text-sm font-medium text-destructive">{formErrors.categoria}</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Fila de precios */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio Venta(€) *</Label>
                    <Input
                      id="precio"
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      min="0"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                    />
                    {formErrors.precio && (
                      <p className="text-sm font-medium text-destructive">{formErrors.precio}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="costo">Costo (€) *</Label>
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

                {/* Fila de stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stockInicial">Stock inicial *</Label>
                    <Input
                      id="stockInicial"
                      placeholder="0"
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                    {formErrors.stockInicial && (
                      <p className="text-sm font-medium text-destructive">{formErrors.stockInicial}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stockMinimo">Stock mínimo *</Label>
                    <Input
                      id="stockMinimo"
                      placeholder="0"
                      type="number"
                      min="0"
                      value={stockMinimo}
                      onChange={(e) => setStockMinimo(e.target.value)}
                    />
                    {formErrors.stockMinimo && (
                      <p className="text-sm font-medium text-destructive">{formErrors.stockMinimo}</p>
                    )}
                  </div>
                </div>
              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ubicacion">Ubicación en almacén *</Label>
                  <Input
                    id="ubicacion"
                    placeholder="Ej: A-1, Estante 3, etc."
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                  />
                  {formErrors.ubicacion && (
                    <p className="text-sm font-medium text-destructive">{formErrors.ubicacion}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proveedor">Proveedor</Label>
                  <Input
                    id="proveedor"
                    placeholder="Nombre del proveedor"
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción o notas adicionales sobre el producto..."
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/inventario")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar producto
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </>
  );
};

export default NuevoProducto;