import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { 
  Wrench, 
  Clock, 
  CheckCircle,  
  UserCheck, 
  Car, 
  ArrowRight, 
  Calendar, 
} from "lucide-react";
const Home = () => {
  return (
    <>
      <Helmet>
        <title>AutoTaller | Sistema de Gestión para Talleres Mecánicos</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-background">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl"
              >
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Sistema de Gestión para <span className="text-primary">Talleres Mecánicos</span>
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Optimiza la administración de tu taller con nuestra plataforma integral. 
                  Gestiona citas, inventario, clientes y facturación en un solo lugar.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link to="/registro">Registrarse</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/login">Iniciar sesión</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};
export default Home;