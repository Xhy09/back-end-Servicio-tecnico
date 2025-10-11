# Backend - Sistema de Gestión de Cotizaciones y Servicios

## 📋 Descripción

Backend desarrollado con NestJS para un sistema de gestión empresarial que incluye:

- **Gestión de Usuarios** (Admin, Empleados, Clientes)
- **Catálogo de Productos** y Categorías
- **Sistema de Cotizaciones**
- **Gestión de Servicios** y Trabajos
- **Reportes** y Estadísticas
- **Autenticación JWT** con roles
- **Auditoría** de acciones

## 🏗️ Arquitectura

El proyecto sigue una arquitectura modular basada en:

- **Entidades TypeORM** para la base de datos PostgreSQL
- **Módulos NestJS** organizados por funcionalidad
- **DTOs** con validación usando class-validator
- **Guards** para autenticación y autorización por roles
- **Servicios** con lógica de negocio
- **Controladores** para endpoints REST

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v16 o superior)
- PostgreSQL (v13 o superior)
- npm o yarn

### 1. Clonar e instalar dependencias

```bash
# Instalar dependencias
npm install
```

### 2. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=business_app

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Environment
NODE_ENV=development
PORT=3000
```

### 3. Configurar PostgreSQL

```sql
-- Crear base de datos
CREATE DATABASE business_app;

-- Crear usuario (opcional)
CREATE USER business_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE business_app TO business_user;
```

### 4. Inicializar datos

```bash
# Ejecutar seed para crear usuarios y datos de ejemplo
npm run db:seed
```

## 🏃‍♂️ Ejecución

```bash
# Modo desarrollo (con watch)
npm run start:dev

# Modo producción
npm run start:prod

# Con debug
npm run start:debug
```

El servidor estará disponible en: `http://localhost:3000`

## 📊 Usuarios por Defecto

Después del seed, tendrás estos usuarios disponibles:

| Rol       | Email                  | Password    |
|-----------|------------------------|-------------|
| Admin     | admin@empresa.com      | admin123    |
| Empleado  | empleado@empresa.com   | empleado123 |
| Cliente   | cliente@gmail.com      | cliente123  |

## 🛠️ API Endpoints

### Autenticación

```http
POST /api/auth/register    # Registrar usuario
POST /api/auth/login       # Iniciar sesión
GET  /api/auth/me          # Obtener perfil actual
```

### Usuarios

```http
GET    /api/users              # Listar usuarios (Admin/Empleado)
GET    /api/users/customers    # Listar clientes (Admin/Empleado)
GET    /api/users/employees    # Listar empleados (Admin)
GET    /api/users/profile      # Perfil actual
PATCH  /api/users/profile      # Actualizar perfil
GET    /api/users/:id          # Usuario por ID (Admin/Empleado)
PATCH  /api/users/:id          # Actualizar usuario (Admin)
DELETE /api/users/:id          # Eliminar usuario (Admin)
```

### Productos

```http
GET    /api/products           # Listar productos
POST   /api/products           # Crear producto (Admin/Empleado)
GET    /api/products/:id       # Producto por ID
PATCH  /api/products/:id       # Actualizar producto (Admin/Empleado)
DELETE /api/products/:id       # Eliminar producto (Admin)
```

### Categorías

```http
GET    /api/categories         # Listar categorías
POST   /api/categories         # Crear categoría (Admin/Empleado)
GET    /api/categories/:id     # Categoría por ID
PATCH  /api/categories/:id     # Actualizar categoría (Admin/Empleado)
DELETE /api/categories/:id     # Eliminar categoría (Admin)
```

### Cotizaciones

```http
GET    /api/quotations                    # Listar cotizaciones (Admin/Empleado)
POST   /api/quotations                    # Crear cotización (Admin/Empleado)
GET    /api/quotations/my-quotations      # Mis cotizaciones (Cliente)
GET    /api/quotations/:id               # Cotización por ID
PATCH  /api/quotations/:id               # Actualizar cotización (Admin/Empleado)
DELETE /api/quotations/:id               # Eliminar cotización (Admin)
```

### Servicios

```http
GET    /api/services                     # Listar servicios (Admin/Empleado)
POST   /api/services                     # Crear servicio (Admin/Empleado)
GET    /api/services/my-services         # Mis servicios (Cliente)
GET    /api/services/assigned-to-me      # Servicios asignados (Admin/Empleado)
GET    /api/services/:id                 # Servicio por ID
PATCH  /api/services/:id                 # Actualizar servicio (Admin/Empleado)
DELETE /api/services/:id                 # Eliminar servicio (Admin)
```

### Reportes

```http
GET    /api/reports/monthly              # Reporte mensual (?year=2024&month=10)
GET    /api/reports/customer-history/:id # Historial de cliente (Admin/Empleado)
GET    /api/reports/dashboard            # Estadísticas del dashboard (Admin/Empleado)
```

## 🔐 Sistema de Roles

### Admin
- Acceso completo al sistema
- Gestión de usuarios (crear empleados, ver todos los usuarios)
- Operaciones CRUD en productos, categorías, cotizaciones y servicios
- Acceso a todos los reportes
- Eliminación de registros

### Empleado
- Gestión de productos y categorías
- Creación y edición de cotizaciones y servicios
- Vista de clientes y sus historiales
- Acceso a reportes
- No puede eliminar registros críticos

### Cliente
- Vista de sus propias cotizaciones y servicios
- Actualización de su perfil
- Acceso limitado solo a su información

## 🗄️ Esquema de Base de Datos

### Entidades Principales

- **User**: Usuarios del sistema (Admin, Empleado, Cliente)
- **Product**: Catálogo de productos/servicios
- **Category**: Categorías de productos
- **Quotation**: Cotizaciones para clientes
- **QuotationItem**: Items de las cotizaciones
- **Service**: Servicios/trabajos realizados
- **ServiceImage**: Imágenes de los trabajos
- **AuditLog**: Log de auditoría del sistema

### Relaciones

- User → Quotation (1:N)
- User → Service (1:N) 
- Product → Category (N:1)
- Product → ProductImage (1:N)
- Quotation → QuotationItem (1:N)
- Service → ServiceImage (1:N)

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

## 📝 Scripts Útiles

```bash
npm run build        # Compilar para producción
npm run start:prod   # Ejecutar en producción
npm run db:seed      # Poblar base de datos con datos iniciales
npm run lint         # Linter
npm run format       # Formatear código
```

## 🔧 Tecnologías Utilizadas

- **NestJS** - Framework principal
- **TypeORM** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **class-validator** - Validación de DTOs
- **Passport** - Estrategias de autenticación

## 📁 Estructura del Proyecto

```
src/
├── entities/           # Entidades TypeORM
├── modules/           # Módulos organizados por funcionalidad
│   ├── auth/          # Autenticación y JWT
│   ├── users/         # Gestión de usuarios
│   ├── products/      # Productos y categorías
│   ├── quotations/    # Sistema de cotizaciones
│   ├── services/      # Gestión de servicios
│   └── reports/       # Reportes y estadísticas
├── common/            # Código compartido
│   ├── dto/           # Data Transfer Objects
│   ├── guards/        # Guards de autenticación/autorización
│   └── decorators/    # Decoradores personalizados
├── scripts/           # Scripts de utilidad
└── main.ts           # Punto de entrada
```

## 🚀 Casos de Uso Implementados

✅ **CUG-001**: Registrar Producto  
✅ **CUG-002**: Realizar Cotización  
✅ **CUG-003**: Generar Reporte Mensual  
✅ **CUG-004**: Historial de los Clientes  
✅ **CUG-005**: Estado del Servicio  
✅ **CUG-008**: Inicio de Sesión  
✅ **CUG-009**: Registro de Clientes  
✅ **CUG-010**: Registro de Empleados  

## 📞 Soporte

Para preguntas o problemas:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

## 📄 Licencia

Este proyecto es privado y confidencial.