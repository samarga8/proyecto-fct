import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isLoggedIn, getUserRole } from '../services/authService';

interface RoleGuardProps {
  allowedRoles: string[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles }) => {
  const isAuthenticated = isLoggedIn();
  const userRole = getUserRole();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirige al login si no está autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (userRole && allowedRoles.includes(userRole)) {
    return <Outlet />; // Renderiza las rutas hijas si tiene el rol permitido
  }
  
  // Redirige según el rol si no tiene acceso a esta ruta
  if (userRole === 'ADMINISTRADOR') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (userRole === 'MECANICO') {
    return <Navigate to="/mecanico/dashboard" replace />;
  }
  
  // Fallback a la página principal
  return <Navigate to="/" replace />;
};

export default RoleGuard;