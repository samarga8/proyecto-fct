import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Separator } from "../../../components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { IVehiculo } from "@/models/vehiculo_dao/IVehiculo";
import { obtenerVehiculoPorId, actualizarVehiculo } from "../../../services/vehiculoService";

interface FormData {
    marca: string;
    modelo: string;
    anio: number;
    matricula: string;
    color: string;
    kilometraje: number;
    combustible: string;
    transmision: string;
    estadoVehiculo: string;
    cliente?: { id: number; nombreCompleto: string; dni: string };
}

const EditarVehiculo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        marca: "",
        modelo: "",
        anio: new Date().getFullYear(),
        matricula: "",
        color: "",
        kilometraje: 0,
        combustible: "",
        transmision: "",
        estadoVehiculo: ""
    });
    const [clienteInfo, setClienteInfo] = useState<{ id?: number; nombreCompleto?: string; dni?: string }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargarDatos = async () => {
            if (!id) return;

            try {
                setLoading(true);
                // Cargar el vehículo
                const vehiculoData = await obtenerVehiculoPorId(Number(id));

                // formulario con los datos del vehiculo
                setFormData({
                    marca: vehiculoData.marca,
                    modelo: vehiculoData.modelo,
                    anio: vehiculoData.anio,
                    matricula: vehiculoData.matricula,
                    color: vehiculoData.color || "",
                    kilometraje: vehiculoData.kilometraje || 0,
                    combustible: vehiculoData.combustible || "",
                    transmision: vehiculoData.transmision || "",
                    estadoVehiculo: vehiculoData.estadoVehiculo || "",
                    cliente: vehiculoData.cliente
                });

                // Si el vehículo tiene un cliente, guardar su informacion
                if (vehiculoData.cliente) {
                    setClienteInfo({
                        id: vehiculoData.cliente.id,
                        nombreCompleto: vehiculoData.cliente.nombreCompleto,
                        dni: vehiculoData.cliente.dni
                    });
                }

                setError(null);
            } catch (error: any) {
                console.error("Error al cargar datos:", error);
                setError(error.message || "Error al cargar la información");
                toast.error(error.message || "Error al cargar la información");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [id]);

    // Funcion para manejar cambios en los inputs del formulario
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Extraemos el nombre del campo y su nuevo valor
        const { name, value } = e.target;
        let parsedValue: string | number = value;

        // Si el campo es 'anio' o 'kilometraje', convertimos el texto a número
        if (name === "anio" || name === "kilometraje") {
            // Si esta vacio ponemos 0, si no parseamos a entero a 0
            parsedValue = value === "" ? 0 : parseInt(value, 0);
        }

        // mantenemos los valores anteriores (...prev)
        // y sobrescribiendo solo el campo que ha cambiado ([name]: parsedValue)
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) return;

        try {
            setLoading(true);
            // actualizacion de datos
            const vehiculoActualizado: Partial<IVehiculo> = {
                ...formData,
                id: Number(id),
                // Mantener el cliente asociado si existe
                cliente: clienteInfo.id ? { id: clienteInfo.id } as any : undefined
            };

            await actualizarVehiculo(Number(id), vehiculoActualizado as IVehiculo);
            toast.success("Vehículo actualizado correctamente");
            navigate(`/admin/vehiculos`);
        } catch (error: any) {
            console.error("Error al actualizar:", error);
            toast.error(error.message || "Error al actualizar el vehículo");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.marca) {
        return <div className="p-6">Cargando información del vehículo...</div>;
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-red-500 mb-4">{error}</div>
                <Button onClick={() => navigate("/admin/vehiculos")}>Volver a la lista</Button>
            </div>
        );
    }
    return (
        <>
            <Helmet>
                <title>Editar Vehículo | AutoTaller</title>
            </Helmet>
            <main className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/vehiculos/detalle/${id}`)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold">Editar Vehículo</h1>
                            <p className="text-muted-foreground">Actualiza la información del vehículo</p>
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
                                            type="number"
                                            value={formData.anio}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="placa">Placa</Label>
                                        <Input
                                            id="placa"
                                            name="placa"
                                            value={formData.matricula}
                                            onChange={handleInputChange}
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
                                            value={formData.color || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="kilometraje">Kilometraje</Label>
                                        <Input
                                            id="kilometraje"
                                            name="kilometraje"
                                            type="number"
                                            value={formData.kilometraje || ""}
                                            onChange={handleInputChange}
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
                                        value={formData.combustible || ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Gasolina">Gasolina</SelectItem>
                                            <SelectItem value="Diésel">Diésel</SelectItem>
                                            <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                                            <SelectItem value="Híbrido">Híbrido</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="transmision">Transmisión</Label>
                                    <Select
                                        onValueChange={(value) => handleSelectChange("transmision", value)}
                                        value={formData.transmision || ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Manual">Manual</SelectItem>
                                            <SelectItem value="Automática">Automática</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Separator className="my-4" />
                                <div className="space-y-2">
                                    <Label htmlFor="cliente">Cliente</Label>
                                    {clienteInfo.nombreCompleto ? (
                                        <div className="p-3 border rounded-md bg-muted/50">
                                            <p className="font-medium">{clienteInfo.nombreCompleto}</p>
                                           
                                        </div>
                                    ) : (
                                        <div className="p-3 border rounded-md bg-muted/50 text-muted-foreground">
                                            No hay cliente asociado a este vehículo
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" type="button" onClick={() => navigate(`/admin/vehiculos`)}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Guardar cambios
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
};
export default EditarVehiculo;