import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RegisterForm from "../components/RegisterForm";
import { Car, Wrench, Shield, UserPlus } from "lucide-react";
const Register = () => {
  return (
    <>
      <Helmet>
        <title>Registro | AutoTaller</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow flex items-center justify-center px-4 py-16 bg-background relative overflow-hidden">
          
          {/* Register content */}
          <div className="container max-w-6xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="hidden lg:flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center space-x-2 bg-secondary/10 px-3 py-1 rounded-full">
                    <UserPlus size={16} className="text-secondary" />
                    <span className="text-sm font-medium text-secondary">Nuevo registro</span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-foreground">
                    Únete a nuestra plataforma de gestión de talleres mecánicos
                  </h1>
                  
                  <p className="text-muted-foreground">
                    Crea tu cuenta y comienza a disfrutar de todas las ventajas que nuestro sistema
                    de gestión tiene para ti.
                  </p>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Acceso seguro</h3>
                        <p className="text-sm text-muted-foreground">
                          Protección de datos y privacidad garantizada
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Car size={20} className="text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Seguimiento de vehículos</h3>
                        <p className="text-sm text-muted-foreground">
                          Historial completo de ordenes y reparaciones
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div className="lg:col-span-2">
                <RegisterForm />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};
export default Register;