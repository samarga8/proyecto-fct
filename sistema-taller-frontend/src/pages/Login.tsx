import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";
import { Car, Settings, Wrench } from "lucide-react";
const Login = () => {
  return (
    <>
      <Helmet>
        <title>Iniciar Sesión | AutoTaller</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow flex items-center justify-center px-4 py-24 bg-background relative overflow-hidden">
          
          {/* Login form */}
          <div className="container max-w-4xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-2 hidden md:flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  <h1 className="text-3xl font-bold text-foreground">
                    Bienvenido de vuelta
                  </h1>
                  <p className="text-muted-foreground">
                    Inicia sesión para acceder al sistema de gestión de tu taller mecánico.
                    Administra vehiculos, inventario, facturas y más.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Car size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Gestión de vehículos</h3>
                        <p className="text-sm text-muted-foreground">
                          Registro completo del historial de cada vehículo
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                     
                        <Wrench size={20} className="text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Control de ordenes</h3>
                        <p className="text-sm text-muted-foreground">
                          Seguimiento de reparaciones 
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Settings size={20} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium">Inventario de repuestos</h3>
                        <p className="text-sm text-muted-foreground">
                          Control de stock 
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div className="md:col-span-3">
                <LoginForm />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};
export default Login;