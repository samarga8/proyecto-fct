import { Toaster } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/admin/Dashboard";

import RoleGuard from "./guards/RoleGuard";

import Clientes from "./pages/admin/Clientes/Clientes";
import Vehiculos from "./pages/admin/Vehiculos/Vehiculos";
import ClienteDetalle from "./pages/admin/Clientes/ClienteDetalle";
import EditarCliente from "./pages/admin/Clientes/EditarCliente";
import ClienteVehiculo from "./pages/admin/Clientes/ClienteVehiculo";
import NuevoVehiculo from "./pages/admin/Vehiculos/NuevoVehiculo";
import VehiculoDetalle from "./pages/admin/Vehiculos/VehiculoDetalle";
import EditarVehiculo from "./pages/admin/Vehiculos/EditarVehiculo";
import NuevaOrdenServicio from "./pages/admin/Vehiculos/NuevaOrdenServicio";
import Inventario from "./pages/admin/Inventario/Inventario";
import NuevoProducto from "./pages/admin/Inventario/NuevoProducto";
import ProductoDetalle from "./pages/admin/Inventario/ProductoDetalle";
import EditarProducto from "./pages/admin/Inventario/EditarProducto";
import AñadirStock from "./pages/admin/Inventario/AñadirStock";
import Ordenes from "./pages/admin/Ordenes/Ordenes";
import OrdenDetalle from "./pages/admin/Ordenes/OrdenDetalle";
import Facturacion from "./pages/admin/Factura/Facturacion";
import NuevaFactura from "./pages/admin/Factura/NuevaFactura";
import DetalleFactura from "./pages/admin/Factura/DetalleFactura";
import PagoStripe from "./components/PagoStripe";
import PagoConfirmacion from "./components/PagoConfirmacion";
import Citas from "./pages/admin/Citas/Citas";
import NuevaCita from "./pages/admin/Citas/NuevaCita";

const queryClient = new QueryClient(); // React Query se utiliza para centralizar y optimizar la gestión de peticiones al backend.

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster /> 
      <HelmetProvider>
        <BrowserRouter> 
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
          
            {/* Rutas compartidas para Administrador y Mecanico */}
            <Route element={<RoleGuard allowedRoles={['ADMINISTRADOR', 'MECANICO']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route element={<Dashboard />}>
                <Route path="/ordenes/orden-detalle/:id" element={<OrdenDetalle />} />
              </Route>
            </Route>

            {/* Rutas solo para administradores */}
            <Route element={<RoleGuard allowedRoles={['ADMINISTRADOR']} />}>
              <Route element={<Dashboard />}>
                <Route path="/admin/dashboard" element={<Navigate to="/admin/ordenes-trabajo" replace />} />
                <Route path="/admin/clientes" element={<Clientes />} />
              <Route path="/admin/clientes/detalle/:id" element={<ClienteDetalle />} />
              <Route path="/admin/clientes/editar/:id" element={<EditarCliente />} />
              <Route path="/admin/clientes/vehiculos/:id" element={<ClienteVehiculo />} />
              
              <Route path="/admin/vehiculos" element={<Vehiculos />} />
              <Route path="/admin/vehiculos/nuevo" element={<NuevoVehiculo />} />
              <Route path="/admin/vehiculos/detalle/:id" element={<VehiculoDetalle />} />
              <Route path="/admin/vehiculos/editar/:id" element={<EditarVehiculo />} />
              <Route path="/admin/vehiculos/nueva-orden/:id" element={<NuevaOrdenServicio />} />

              <Route path="/admin/ordenes-trabajo" element={<Ordenes />} />
            
              <Route path="/admin/facturacion" element={<Facturacion />} />
              <Route path="/admin/facturacion/nuevo" element={<NuevaFactura />} />
              <Route path="/admin/facturacion/detalle/:id" element={<DetalleFactura />} />
              <Route path="/admin/facturacion/pago/:id" element={<PagoStripe />} />
              <Route path="/admin/facturacion/confirmacion" element={<PagoConfirmacion />} />

              <Route path="/admin/inventario" element={<Inventario />} />
              <Route path="/admin/inventario/nuevo" element={<NuevoProducto />} />
              <Route path="/admin/inventario/detalles/:id" element={<ProductoDetalle />} />
              <Route path="/admin/inventario/editar/:id" element={<EditarProducto />} />
              <Route path="/admin/inventario/stock/:id" element={<AñadirStock />} />

              <Route path="/admin/citas" element={<Citas />} />
              <Route path="/admin/citas/nueva" element={<NuevaCita />} />
              
              
              </Route>
            </Route>

            {/* Rutas solo para mecanicos */}
            <Route element={<RoleGuard allowedRoles={['MECANICO']} />}>
              <Route element={<Dashboard />}>
                <Route path="/mecanico/dashboard" element={<Navigate to="/mecanico/ordenes-trabajo" replace />} />
                <Route path="/mecanico/ordenes-trabajo" element={<Ordenes />} />
              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
