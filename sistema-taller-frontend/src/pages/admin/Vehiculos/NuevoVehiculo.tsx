import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Separator } from "../../../components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { guardarVehiculo, VehiculoRegistroDTO } from "../../../services/vehiculoService";
import { listarClientes } from "../../../services/clienteService";
import { ICliente } from "@/models/cliente_dao/ICliente";

const NuevoVehiculo = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    anio: "",
    matricula: "",
    color: "",
    kilometraje: "",
    combustible: "",
    transmision: "",
    dni: ""
  });

  // Cargar la lista de clientes al montar el componente
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const data = await listarClientes();
        console.log('Respuesta del servidor clientes:', data); 
        
        // Verificar que data sea un array
        if (Array.isArray(data)) {
          setClientes(data);
        } else if (data && typeof data === 'object') {
          // Si la respuesta es un objeto, intentamos extraer los clientes
          if (Array.isArray(data.clientes)) {
            // Si tiene una propiedad 'clientes' que es un array
            setClientes(data.clientes);
          } else if (Array.isArray(data.content)) {
            // Si tiene una propiedad 'content' que es un array 
            setClientes(data.content);
          } else if (Object.values(data).length > 0) {
            const primerValor = Object.values(data)[0];
            if (Array.isArray(primerValor)) {
              setClientes(primerValor);
            } else {
              console.error('El primer valor no es un array:', primerValor);
              setClientes([]);
              toast.error("Error al cargar los clientes: formato de datos incorrecto");
            }
          } else {
            // inicializar como array vacio
            setClientes([]);
            toast.error("Error al cargar los clientes: formato de datos incorrecto");
          }
        } else {
          // Si no es un array ni un objeto, inicializar como array vacío
          console.error('La respuesta del servidor no tiene el formato esperado:', data);
          setClientes([]);
          toast.error("Error al cargar los clientes: formato de datos incorrecto");
        }
      } catch (error: any) {
        console.error('Error al cargar clientes:', error);
        toast.error(error.message || "Error al cargar los clientes");
        setClientes([]); // Asegurarse de que clientes sea un array vacio en caso de error
      }
    };
  
    cargarClientes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparar los datos para enviar al backend
      const vehiculoData: VehiculoRegistroDTO = {
        marca: formData.marca,
        modelo: formData.modelo,
        anio: parseInt(formData.anio),
        matricula: formData.matricula,
        color: formData.color,
        kilometraje: parseInt(formData.kilometraje) || 0,
        dni: formData.dni,
        combustible: formData.combustible,
        transmision: formData.transmision
      };

      // Llamar al servicio para guardar el vehículo
      await guardarVehiculo(vehiculoData);
      toast.success("Vehículo registrado correctamente");
      
      setTimeout(() => {
        navigate("/admin/vehiculos");
      }, 1500); 
    } catch (error: any) {
      toast.error(error.message || "Error al registrar el vehículo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Nuevo Vehículo | AutoTaller</title>
      </Helmet>
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/vehiculos")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Nuevo Vehículo</h1>
              <p className="text-muted-foreground">Ingresa la información del nuevo vehículo</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Datos del Vehículo</CardTitle>
                <CardDescription>Información básica del vehículo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input 
                      id="marca" 
                      name="marca" 
                      placeholder="Toyota, Honda, etc." 
                      value={formData.marca}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input 
                      id="modelo" 
                      name="modelo" 
                      placeholder="Corolla, Civic, etc." 
                      value={formData.modelo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="anio">Año</Label>
                    <Input 
                      id="anio" 
                      name="anio" 
                      placeholder="2023" 
                      value={formData.anio}
                      onChange={handleInputChange}
                      type="number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="matricula">Matricula</Label>
                    <Input 
                      id="matricula" 
                      name="matricula" 
                      placeholder="1111-ABC" 
                      value={formData.matricula}
                      onChange={handleInputChange}
                      type="text"
                      required
                    />
                  </div>
                </div>
               
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input 
                      id="color" 
                      name="color" 
                      placeholder="Rojo, Azul, etc." 
                      value={formData.color}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kilometraje">Kilometraje</Label>
                    <Input 
                      id="kilometraje" 
                      name="kilometraje" 
                      placeholder="30000" 
                      value={formData.kilometraje}
                      onChange={handleInputChange}
                      type="number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Información Técnica</CardTitle>
                <CardDescription>Detalles técnicos del vehículo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="combustible">Tipo de Combustible</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("combustible", value)}
                    value={formData.combustible}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gasolina">Gasolina</SelectItem>
                      <SelectItem value="diesel">Diésel</SelectItem>
                      <SelectItem value="electrico">Eléctrico</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transmision">Transmisión</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("transmision", value)}
                    value={formData.transmision}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatica">Automática</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI Cliente</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("dni", value)}
                    value={formData.dni}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(clientes) ? clientes.map(cliente => (
                        <SelectItem key={cliente.id} value={cliente.dni}>
                          {cliente.nombreCompleto} - {cliente.dni}
                        </SelectItem>
                      )) : (
                        <SelectItem value="" disabled>No hay clientes disponibles</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => navigate("/admin/vehiculos")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Guardando..." : "Guardar vehículo"}
            </Button>
          </div>
        </form>
      </main>
    </>
  );
};

export default NuevoVehiculo;