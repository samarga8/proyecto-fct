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
import { ArrowLeft, Save, Package, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { obtenerDetalleProducto, actualizarProducto, eliminarProducto } from "../../../services/inventarioService";
import { InventarioDTO } from "../../../models/inventario_dao/InventarioDTO";

const EditarProducto = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [stockActual, setStockActual] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState("");

  const [formErrors, setFormErrors] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stockActual: "",
    stockMinimo: "",
    ubicacion: "",
    costo: "",
    proveedor: "",
    descripcion: ""
  });

  // Cargar datos del producto desde la API
  useEffect(() => {
    const cargarProducto = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await obtenerDetalleProducto(Number(id));

        // Actualizar los estados con los datos del producto
        setNombre(data.nombre || "");
        setCategoria(data.categoria || "");
        setPrecio(String(data.precio ?? ""));
        setStockActual(String(data.stockActual ?? ""));
        setStockMinimo(String(data.stockMinimo ?? ""));
        setUbicacion(data.ubicacion || "");
        setProveedor(data.proveedor || "");
        setDescripcion(data.descripcion || "");
        setCosto(String(data.costo ?? ""));

      } catch (err: any) {
        console.error("Error al cargar el producto:", err);
        toast.error(err.message || "Error al cargar el producto");
        navigate("/admin/inventario");
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validación manual
    const errors = {
      nombre: "",
      categoria: "",
      precio: "",
      stockActual: "",
      stockMinimo: "",
      ubicacion: "",
      costo: "",
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

    if (!stockActual || isNaN(Number(stockActual)) || Number(stockActual) < 0) {
      errors.stockActual = "Introduce una cantidad válida";
      hasError = true;
    }

    if (!stockMinimo || isNaN(Number(stockMinimo)) || Number(stockMinimo) < 0) {
      errors.stockMinimo = "Introduce un valor válido para stock mínimo";
      hasError = true;
    }

    if (!ubicacion) {
      errors.ubicacion = "Introduce una ubicación";
      hasError = true;
    }

    if (!costo || isNaN(Number(costo)) || Number(costo) <= 0) {
      errors.costo = "Introduce un costo válido";
      hasError = true;
    }

    setFormErrors(errors);

    if (hasError) {
      toast.error("Por favor, corrige los errores en el formulario");
      return;
    }

    try {
      setGuardando(true);

      // Crear objeto de producto para enviar al backend
      const productoActualizado: InventarioDTO = {
        id: Number(id),
        nombre,
        categoria,
        precio: Number(precio),
        costo: Number(costo),
        stockActual: Number(stockActual),
        stockMinimo: Number(stockMinimo),
        ubicacion,
        proveedor,
        descripcion,
        stockInicial: 0,
      };

      // Llamar al servicio para actualizar el producto
      await actualizarProducto(Number(id), productoActualizado);

      toast.success("Producto actualizado correctamente");
      navigate(`/admin/inventario/detalles/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar el producto");
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar() {
    try {
      await eliminarProducto(Number(id));
      toast.success("Producto eliminado correctamente");
      navigate(`/admin/inventario`);
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar el producto");
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

  return (
    <>
      <Helmet>
        <title>Editar Producto - Sistema de Gestión de Taller</title>
      </Helmet>

      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/admin/inventario/detalles/${id}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Editar Producto</h1>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-1">
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. El producto será eliminado permanentemente del sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleEliminar} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Información del Producto
              </CardTitle>
              <CardDescription>
                Actualiza la información del producto en el inventario.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del producto *</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Aceite sintético 5W-30"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stockActual">Stock actual *</Label>
                  <Input
                    id="stockActual"
                    placeholder="0"
                    type="number"
                    min="0"
                    value={stockActual}
                    onChange={(e) => setStockActual(e.target.value)}
                  />
                  {formErrors.stockActual && (
                    <p className="text-sm font-medium text-destructive">{formErrors.stockActual}</p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ubicacion">Ubicación en almacén *</Label>
                  <Input
                    id="ubicacion"
                    placeholder="Ej: A-1"
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
                    placeholder="Ej: Auto Parts Inc."
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                  />
                  {formErrors.proveedor && (
                    <p className="text-sm font-medium text-destructive">{formErrors.proveedor}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción detallada del producto..."
                  className="min-h-[100px]"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
                {formErrors.descripcion && (
                  <p className="text-sm font-medium text-destructive">{formErrors.descripcion}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/admin/inventario`)}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={guardando}>
                {guardando ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
    </>
  );
};

export default EditarProducto;