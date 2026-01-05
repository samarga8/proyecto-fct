import { Helmet } from "react-helmet-async";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Package, MoreHorizontal, Plus, FileText, Trash2, ArrowLeft } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { isLoggedIn } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { listarProductos, eliminarProducto } from "../../../services/inventarioService";
import { InventarioDTO } from "@/models/inventario_dao/InventarioDTO";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog";

function Inventario() {
  const navigate = useNavigate();
  const [inventario, setInventario] = useState<InventarioDTO[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [productoAEliminar, setProductoAEliminar] = useState<number | null>(null);
  const [eliminando, setEliminando] = useState<boolean>(false);

  // Función para cargar los productos
  const cargarProductos = useCallback(async () => {
    // Verificar autenticación antes de hacer peticiones
    if (!isLoggedIn()) {
      console.log('Usuario no autenticado, redirigiendo al login');
      setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
      navigate('/login');
      return;
    }

    try {
      setCargando(true);

      const productos = await listarProductos();
      // Asegurarse de que productos sea un array
      if (Array.isArray(productos)) {
        setInventario(productos);
      } else {
        // Si no es un array, establecer un array vacío
        console.error('La respuesta de la API no es un array:', productos);
        setInventario([]);
        setError('Formato de respuesta incorrecto');
      }
    } catch (err: any) {
      console.error('Error al cargar productos:', err);

      setError(err.message || 'Error al cargar los productos');
      setInventario([]);
    } finally {
      setCargando(false);
    }
  }, [navigate]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // Función para manejar la eliminación de un producto
  const handleEliminarProducto = async () => {
    if (productoAEliminar === null) return;

    try {
      setEliminando(true);
      await eliminarProducto(productoAEliminar);
      toast.success("Producto eliminado correctamente");
      // Recargar la lista de productos
      await cargarProductos();
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar el producto");
    } finally {
      setEliminando(false);
      setProductoAEliminar(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Inventario | AutoTaller</title>
      </Helmet>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={productoAEliminar !== null} onOpenChange={(open) => !open && setProductoAEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto será eliminado permanentemente del inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={eliminando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEliminarProducto}
              disabled={eliminando}
              className="bg-red-600 hover:bg-red-700"
            >
              {eliminando ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Inventario</h1>
              <p className="text-muted-foreground">Gestiona el inventario de repuestos y productos</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/admin/inventario/nuevo")}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Nuevo producto</span>
            </Button>
          </div>
        </div>



        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Lista de productos</CardTitle>

            </div>
            <CardDescription>Total de productos: {inventario.length}</CardDescription>

          </CardHeader>
          <CardContent>
            {cargando ? (
              <div className="text-center py-4">Cargando productos...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : inventario.length === 0 ? (
              <div className="text-center py-4">No hay productos en el inventario</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Mínimo</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[80px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventario.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{producto.nombre}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{producto.categoria}</TableCell>
                      <TableCell>{producto.stockActual}</TableCell>
                      <TableCell>{producto.stockMinimo}</TableCell>
                      <TableCell>{producto.precio}€</TableCell>
                      <TableCell>{producto.ubicacion}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            producto.estado?.toLowerCase() === "disponible"
                              ? "success"
                              : producto.estado?.toLowerCase() === "bajo"
                                ? "warning"
                                : producto.estado?.toLowerCase() === "crítico"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {producto.estado}
                        </Badge>

                      </TableCell>
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
                            <DropdownMenuItem onClick={() => navigate(`/admin/inventario/detalles/${producto.id}`)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/inventario/editar/${producto.id}`)}>
                              Editar producto
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/inventario/stock/${producto.id}`)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Añadir stock
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setProductoAEliminar(producto.id)}
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
    </>
  );
};

export default Inventario;