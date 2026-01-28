import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Outlet } from "react-router-dom";
import {
  Car,
  Users,
  ClipboardList,
  Package,
  Receipt,
  LogOut,
  Calendar,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  SidebarInset,
} from "../../components/ui/sidebar";
import { getUser, getUserRole, logout } from "../../services/authService";

// Definir interfaces para los enlaces
interface SubItem {
  path: string;
  label: string;
}

interface NavLink {
  path: string;
  label: string;
  icon: string;
  subItems?: SubItem[];
}

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Función auxiliar para verificar roles
  const hasRole = (role: string) => {
    const userRole = getUserRole();
    return userRole === role;
  };

  // Función para obtener la ruta base según el rol
  const getBaseRoute = () => {
    if (hasRole('ADMINISTRADOR')) return '/admin';
    if (hasRole('MECANICO')) return '/mecanico';
    return '/dashboard';
  };
  
  useEffect(() => {
    // Obtener la información del usuario desde localStorage
    const user = getUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);
  
  
  // Memorizar los enlaces para evitar recálculos innecesarios
  const links = useMemo(() => {
    if (!currentUser) return [];

    const isAdmin = hasRole("ADMINISTRADOR");
    const isMecanico = hasRole("MECANICO");

    const newLinks: NavLink[] = [];

    // Enlaces para administradores y mecanicos
    if (isAdmin || isMecanico) {
      newLinks.push(
        {
          path: '/ordenes-trabajo',
          label: 'Órdenes de trabajo',
          icon: 'ClipboardList'
        }
      );
    }

    // Enlaces para administradores
    if (isAdmin) {
      newLinks.push(
        {
          path: '/clientes',
          label: 'Clientes',
          icon: 'Users'
        },
        {
          path: '/vehiculos',
          label: 'Vehículos',
          icon: 'Car'
        },
        
        {
          path: '/facturacion',
          label: 'Facturación',
          icon: 'Receipt'
        },
        {
          path: '/inventario',
          label: 'Inventario',
          icon: 'Package'
        },
        {
          path: '/citas',
          label: 'Citas',
          icon: 'Calendar'
        },
        
      );
    }

    return newLinks;
  }, [currentUser]);
  
  return (
    <>
      <Helmet>
        <title>Dashboard | AutoTaller</title>
      </Helmet>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen bg-background">
          {/* Sidebar */}
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center space-x-2 px-2">
                <Car className="h-6 w-6 text-secondary" />
                <span className="font-bold text-lg">
                  <span className="text-primary">Taller</span>
                  <span className="text-secondary">Mecánico</span>
                </span>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarMenu>
                {links.map((link, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild isActive={link.path.includes('/dashboard')}>
                      <Link to={`${getBaseRoute()}${link.path}`}>
                        {link.icon === "Users" && <Users className="h-4 w-4 mr-3" />}
                        {link.icon === "Car" && <Car className="h-4 w-4 mr-3" />}
                        {link.icon === "ClipboardList" && <ClipboardList className="h-4 w-4 mr-3" />}
                        {link.icon === "Receipt" && <Receipt className="h-4 w-4 mr-3" />}
                        {link.icon === "Package" && <Package className="h-4 w-4 mr-3" />}
                        {link.icon === "Calendar" && <Calendar className="h-4 w-4 mr-3" />}
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    
                    {/* Renderizar subitems si existen */}
                    {link.subItems && link.subItems.length > 0 && (
                      <SidebarMenuSub>
                        {link.subItems.map((subItem, subIndex) => (
                          <SidebarMenuSubItem key={subIndex}>
                            <SidebarMenuSubButton asChild>
                              <Link to={`${getBaseRoute()}${subItem.path}`}>
                                {subItem.label}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            
            <SidebarFooter>
              <div className="p-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      {currentUser && (
                        <span className="text-sm">
                          {currentUser.username || currentUser.sub || 'Usuario'}
                          {hasRole('ADMINISTRADOR') && (
                            <span className="block text-xs text-muted-foreground">Administrador</span>
                          )}
                          {hasRole('MECANICO') && (
                            <span className="block text-xs text-muted-foreground">Mecánico</span>
                          )}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>                  
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {logout(); window.location.href='/login';}}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SidebarFooter>
          </Sidebar>
          
          {/* Contenido principal */}
          <SidebarInset className="flex flex-col h-screen overflow-hidden">
          
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
            
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Dashboard;