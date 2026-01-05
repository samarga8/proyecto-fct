# 🚗 Sistema de Gestión de Taller Mecánico (AutoTaller)

Bienvenido al repositorio del proyecto **Taller Mecánico**. Este sistema es una aplicación web completa para la gestión integral de un taller mecánico, permitiendo administrar clientes, vehículos, órdenes de reparación, inventario, facturación y pagos.

## 📋 Características Principales

- **Gestión de Clientes y Vehículos**: Registro detallado de clientes y sus vehículos asociados.
- **Órdenes de Reparación**: Creación, seguimiento y actualización de estados de reparación.
- **Inventario y Stock**: Control de piezas y repuestos con alertas de stock bajo.
- **Facturación Automática**: Generación de facturas en PDF y envío por correo electrónico.
- **Pagos Online**: Integración con **Stripe** para pagos seguros.
- **Roles de Usuario**: Paneles diferenciados para Administradores y Mecánicos.

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Java 17** con **Spring Boot 3**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Hibernate)
- **MySQL** (Base de datos)
- **Maven** (Gestión de dependencias)

### Frontend
- **React** (TypeScript)
- **Tailwind CSS** (Estilos)
- **React Query** (Gestión de estado del servidor)
- **Axios** (Cliente HTTP)
- **React Router** (Navegación)

---

## 🚀 Guía de Instalación y Configuración

Sigue estos pasos para poner en marcha el proyecto en tu entorno local.

### Prerrequisitos
Asegúrate de tener instalado:
- **Java JDK 17** o superior.
- **Node.js** (v18 o superior) y **npm**.
- **MySQL Server**.
- **Git**.

### 1. Clonar el Repositorio

```bash
git clone https://github.com/samarga8/proyecto-fct.git
cd proyecto-fct
```

### 2. Configuración del Backend (Servidor)

1.  Navega a la carpeta del backend:
    ```bash
    cd sistema-taller-backend
    ```

2.  **Base de Datos**: Crea una base de datos vacía en MySQL llamada `sistema_taller`.
    ```sql
    CREATE DATABASE sistema_taller;
    ```

3.  **Configuración de Variables de Entorno**:
    - Renombra el archivo de plantilla:
      De: `src/main/resources/application.properties.example`
      A: `src/main/resources/application.properties`
    - Abre el archivo `application.properties` y edita las siguientes líneas con tus datos reales:

    ```properties
    # Conexión a Base de Datos
    spring.datasource.username=TU_USUARIO_MYSQL
    spring.datasource.password=TU_CONTRASEÑA_MYSQL

    # Configuración de Correo (Gmail App Password)
    email.username=TU_EMAIL@gmail.com
    email.password=TU_CONTRASEÑA_DE_APLICACION

    # Pasarela de Pago (Stripe)
    stripe.key.secret=sk_test_TU_CLAVE_SECRETA
    stripe.key.public=pk_test_TU_CLAVE_PUBLICA
    ```

4.  **Ejecutar el Servidor**:
    ```bash
    ./mvnw spring-boot:run
    ```
    El servidor iniciará en `http://localhost:8080`.

### 3. Configuración del Frontend (Cliente)

1.  Abre una nueva terminal y navega a la carpeta del frontend:
    ```bash
    cd sistema-taller-frontend
    ```

2.  **Instalar Dependencias**:
    ```bash
    npm install
    ```

3.  **Ejecutar la Aplicación**:
    ```bash
    npm start
    ```
    La aplicación se abrirá automáticamente en `http://localhost:3000`.

---

## 🔑 Usuarios de Prueba (Por Defecto)

Al iniciar la aplicación por primera vez, el sistema (si está configurado el `RolInitializer`) podría crear usuarios por defecto. De lo contrario, deberás registrar un primer usuario administrador mediante la API o base de datos.

*Nota: Revisa la clase `RolInitializer.java` o `DataInitializer.java` si existen para ver credenciales predeterminadas.*

---

## 📄 Estructura del Proyecto

```
proyecto-fct/
├── sistema-taller-backend/   # Código fuente del servidor (Spring Boot)
│   ├── src/main/java/        # Controladores, Servicios, Modelos, Seguridad
│   └── src/main/resources/   # Configuración y templates de correo
│
└── sistema-taller-frontend/  # Código fuente del cliente (React)
    ├── src/components/       # Componentes reutilizables UI
    ├── src/pages/            # Vistas principales (Admin, Login, etc.)
    └── src/services/         # Conexión con la API (Axios)
```

## 🤝 Contribución

Este es un proyecto académico para el módulo de FCT (Formación en Centros de Trabajo). Cualquier sugerencia o mejora es bienvenida.
