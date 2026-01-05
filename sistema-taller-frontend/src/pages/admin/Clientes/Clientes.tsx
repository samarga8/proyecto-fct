import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { MoreHorizontal, UserPlus, FileText, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";

import { registrarCliente, listarClientes, eliminarCliente } from "../../../services/clienteService";
import { ICliente } from "@/models/cliente_dao/ICliente";
import { ClienteRegistroDTO } from "@/models/cliente_dao/ClienteRegistroDTO";

const Clientes = () => {
  const navigate = useNavigate();
  // Estado para almacenar la lista de clientes
  const [clientesList, setClientesList] = useState<ICliente[]>([]);
  // Estado indicador de carga
  const [loading, setLoading] = useState(true);
  // Estado para controlar la visibilidad del modal
  const [open, setOpen] = useState(false);
  
  // Estados para el formulario de nuevo cliente
  const [nombreCompleto, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [dni, setDni] = useState("");
  // Estado para almacenar errores 
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // cargar los clientes al montar el componente
  const cargarClientes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listarClientes();
      setClientesList(data);
    } catch (error) {
      toast.error("Error al cargar los clientes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);
  
  // envío del formulario
  const handleSubmit = async () => {
    const errors: {[key: string]: string} = {};
    
    // Validaciones básicas
    if (!nombreCompleto) errors.nombre = "El nombre y apellidos son obligatorios";
    if (!email) errors.email = "El email es obligatorio";
    if (!telefono) errors.telefono = "El teléfono es obligatorio";
    if (!dni) errors.dni = "El DNI es obligatorio";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Objeto para enviar al backend
    const nuevoCliente: ClienteRegistroDTO = {
      nombreCompleto: nombreCompleto,
      email,
      telefono,
      direccion,
      dni
    };
    
    try {
      // Llamada al servicio 
      await registrarCliente(nuevoCliente);
      toast.success("Cliente registrado con éxito");
      setOpen(false); // Cerrar modal
      resetForm(); 
      cargarClientes(); 
    } catch (error: any) {
      toast.error(error.message || "Error al registrar el cliente");
    }
  };
  
  // reseteamos los campos del formulario
  const resetForm = () => {
    setNombre("");
    setEmail("");
    setTelefono("");
    setDireccion("");
    setDni("");
    setFormErrors({});
  };
  
  const handleEliminarCliente = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        await eliminarCliente(id);
        toast.success("Cliente eliminado con éxito");
        cargarClientes(); 
      } catch (error: any) {
        toast.error(error.message || "Error al eliminar el cliente");
      }
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Clientes | AutoTaller</title>
      </Helmet>
      
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Clientes</h1>
              <p className="text-muted-foreground">Gestiona los clientes de tu taller</p>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Nuevo cliente</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nuevo Cliente</DialogTitle>
                <DialogDescription>
                  Completa el formulario para agregar un nuevo cliente al sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input 
                    id="nombre" 
                    placeholder="Nombre y apellidos" 
                    value={nombreCompleto} 
                    onChange={(e) => setNombre(e.target.value)}
                  />
                  {formErrors.nombre && (
                    <p className="text-sm font-medium text-destructive">{formErrors.nombre}</p>
                  )}
                </div>

                 <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input 
                    id="dni" 
                    placeholder="Ingrese el DNI" 
                    value={dni} 
                    onChange={(e) => setDni(e.target.value)}
                  />
                  {formErrors.dni && (
                    <p className="text-sm font-medium text-destructive">{formErrors.dni}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    placeholder="ejemplo@correo.com" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {formErrors.email && (
                    <p className="text-sm font-medium text-destructive">{formErrors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input 
                    id="telefono" 
                    placeholder="655 51 02 34" 
                    value={telefono} 
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                  {formErrors.telefono && (
                    <p className="text-sm font-medium text-destructive">{formErrors.telefono}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input 
                    id="direccion" 
                    placeholder="Calle, número, ciudad..." 
                    value={direccion} 
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                  {formErrors.direccion && (
                    <p className="text-sm font-medium text-destructive">{formErrors.direccion}</p>
                  )}
                </div>
                
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button variant="outline" className="mr-2">Cancelar</Button>
                  </DialogClose>
                  <Button onClick={handleSubmit}>Guardar cliente</Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Lista de clientes</CardTitle>
            </div>
            <CardDescription>Total de clientes: {clientesList.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Vehículos</TableHead>
               
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesList.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{cliente.nombreCompleto.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{cliente.nombreCompleto}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{cliente.vehiculos?.length}</TableCell>
                 
                    
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
                          <DropdownMenuItem onSelect={() => navigate(`/admin/clientes/detalle/${cliente.id}`)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => navigate(`/admin/clientes/editar/${cliente.id}`)}>
                            Editar cliente
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => navigate(`/admin/clientes/vehiculos/${cliente.id}`)}>
                            Ver vehículos
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onSelect={() => handleEliminarCliente(cliente.id)}>
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default Clientes;