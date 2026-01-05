import axios from 'axios';
import baseUrl from './helper';
import { Subject } from 'rxjs'; 

// Definir interfaces para los tipos de datos
interface RegisterData {
    username: string;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    telefono: string;
    direccion: string;
    perfil: string;
    password: string;
}

interface LoginCredentials {
    username: string;
    password: string;
}

// Subject para notificar cambios en el estado de login
export const loginStatusSubject = new Subject<boolean>();

// Función para guardar el token en localStorage
export const setToken = (token: string) => {
    localStorage.setItem('token', token);
};

// Función para obtener el token desde localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Función para eliminar el token
export const removeToken = () => {
    localStorage.removeItem('token');
};

// Función para guardar el usuario en localStorage
export const setUser = (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
};

// Función para obtener el usuario desde localStorage
export const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    } else {
        logout();
        return null;
    }
};

// Función para verificar si el usuario está logueado
export const isLoggedIn = () => {
    const token = getToken();
    if (token === undefined || token === '' || token === null) {
        return false;
    }
    return true;
};

// Función para obtener el rol del usuario
export const getUserRole = () => {
    const user = getUser();

    // Verificar que usuario no sea null o undefined
    if (!user) {
        return null;
    }

    // obtener desde authorities
    if (user.authorities && Array.isArray(user.authorities) && user.authorities.length > 0) {
        const authority = user.authorities[0].authority;
        // quitar el prefijo "ROLE_" si existe
        if (authority && authority.startsWith('ROLE_')) {
            return authority.substring(5); 
        }
        return authority;
    }

    // Verificar que usuario.perfil sea exactamente "administrador" 
    if (user.perfil && typeof user.perfil === 'string') {
        const perfilLimpio = user.perfil.trim(); 
        if (perfilLimpio === "administrador") {
            return "ADMINISTRADOR"; 
        }
        if (perfilLimpio === "mecanico") {
            return "MECANICO";
        }
    }

    return null;
};

// Configurar el interceptor de axios
axios.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log("Interceptor - headers:", config.headers);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export const register = async (userData: RegisterData) => {

    return axios.post(`${baseUrl}/empleados/`, userData);
};

export const login = async (credentials: LoginCredentials) => {
    const response = await axios.post(`${baseUrl}/generate-token`, credentials);
    if (response.data && response.data.token) {
        setToken(response.data.token);
        loginStatusSubject.next(true);
    }
    return response;
};

export const getCurrentUser = async () => {
    return axios.get(`${baseUrl}/actual-empleado`);
};

export const logout = () => {
    removeToken();
    localStorage.removeItem('user');
    loginStatusSubject.next(false);
};