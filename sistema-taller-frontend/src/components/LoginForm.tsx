import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { login, getCurrentUser, setUser, getUserRole } from "../services/authService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Loader2, Lock } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(5,{
    message: "El nombre de usuario debe tener al menos 4 caracters.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 4 caracteres.",
  }),
  rememberMe: z.boolean().optional(),
});
type FormData = z.infer<typeof formSchema>;
const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Agregar hook useNavigate
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  function onSubmit(data: FormData) {
    setIsLoading(true);
    
    // Convertir el formato de los datos para que coincida con lo que espera el backend
    const credentials = {
      username: data.username,
      password: data.password
    };
    
    login(credentials)
      .then((response) => {
        console.log("Login exitoso:", response.data);
        toast.success("Inicio de sesión exitoso");
        
        // Obtener información del usuario actual después del login
        getCurrentUser()
          .then((userResponse) => {
            setUser(userResponse.data);
            // Redirigir al usuario al dashboard
            // En lugar de:
            // navigate('/dashboard');
            
            // Usa:
            const userRole = getUserRole();
            if (userRole === 'ADMINISTRADOR') {
              navigate('/admin/dashboard');
            } else if (userRole === 'MECANICO') {
              navigate('/mecanico/dashboard');
            } else {
              navigate('/dashboard');
            }
          })
          .catch((userError) => {
            console.error("Error al obtener información del usuario:", userError);
            console.error("Detalles del error:", userError.response?.data || userError.message);
            toast.error("Error al obtener información del usuario");
            // Aún así redirigimos al dashboard
            navigate('/dashboard');
          });
      })
      .catch((error) => {
        console.error("Error de login:", error);
        console.error("Detalles del error:", error.response?.data || error.message);
        toast.error(error.response?.data?.mensaje || "Error al iniciar sesión");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto shadow-lg border-border">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="juan123" 
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="******" 
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            
          </div>
          
          
          
          <p className="text-center text-sm text-muted-foreground pt-2">
            ¿No tienes una cuenta?{" "}
            <Link to="/registro" className="text-primary font-medium hover:underline">
              Registrarse
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
export default LoginForm;