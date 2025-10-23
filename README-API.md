# 🚀 Backend - Sistema de Gestión de Servicios Técnicos

## 📋 Descripción

Backend desarrollado con **NestJS 11** para un sistema de gestión empresarial que incluye:

- 👥 **Gestión de Usuarios** (Admin, Empleados, Clientes)
- 📦 **Catálogo de Productos** y Categorías
- 💰 **Sistema de Cotizaciones** completo
- 🔧 **Gestión de Servicios** técnicos y trabajos
- 📊 **Reportes** y estadísticas en tiempo real
- 🔐 **Autenticación JWT híbrida** (cookies + headers)
- 📝 **Auditoría** completa de acciones
- 🌐 **CORS** configurado para múltiples orígenes

## 🏗️ Arquitectura

El proyecto sigue una arquitectura modular basada en:

- **Entidades TypeORM** para la base de datos PostgreSQL
- **Módulos NestJS** organizados por funcionalidad
- **DTOs** con validación usando class-validator
- **Guards** para autenticación y autorización por roles
- **Servicios** con lógica de negocio
- **Controladores** para endpoints REST

## 🚀 Instalación y Configuración

### 📋 Prerrequisitos

- **Node.js** (v18 o superior) ✅
- **Docker** y **Docker Compose** 🐳
- **Git** para clonar el repositorio 
- **PostgreSQL** (v15 - se ejecuta en Docker)

### 1️⃣ Clonar el repositorio e instalar dependencias

```bash
# Clonar el repositorio
git clone https://github.com/Xhy09/back-end-Servicio-tecnico.git
cd back-end-Servicio-tecnico

# Instalar dependencias
npm install
```

### 2️⃣ Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

**Editar `.env` con tus configuraciones:**

```env
# Configuración del servidor
PORT=3000

# Configuración de la base de datos PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=lol11990
DATABASE_NAME=postgres

# Variables para Docker Compose (deben coincidir con las de arriba)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=lol11990
DB_NAME=postgres

# Configuración JWT
JWT_SECRET=mi_super_secreto_jwt_2024_secure_key_12345
JWT_EXPIRATION=1d

# Configuración de Node.js
NODE_ENV=development
```

### 3️⃣ Iniciar PostgreSQL con Docker

```bash
# Iniciar la base de datos PostgreSQL en segundo plano
docker-compose up -d

# Verificar que el contenedor esté corriendo
docker ps
```

**⚠️ Importante:** El Docker Compose creará automáticamente la base de datos PostgreSQL con la configuración del `.env`.

### 4️⃣ Compilar y ejecutar el backend

```bash
# Compilar el proyecto (primera vez)
npm run build

# Iniciar en modo desarrollo (con hot reload)
npm run start:dev
```

El servidor estará disponible en: **`http://localhost:3000`** 🎉

### 5️⃣ Verificar la instalación

Una vez que el servidor esté corriendo, deberías ver:

```bash
[Nest] LOG [NestApplication] Nest application successfully started
API en http://localhost:3000
```

**Prueba la API:**
```bash
curl http://localhost:3000/api
# Respuesta: {"message": "API funcionando correctamente"}
```

## 🏃‍♂️ Comandos de Ejecución

```bash
# 🔄 Desarrollo (con hot reload y watch mode)
npm run start:dev

# 🚀 Producción
npm run start:prod

# 🐛 Debug (con debugger habilitado)
npm run start:debug

# 🏗️ Compilar para producción
npm run build

# 🧹 Limpiar y reinstalar dependencias
rm -rf node_modules package-lock.json && npm install
```

### 🛑 Detener servicios

```bash
# Detener el backend (Ctrl+C en la terminal)

# Detener Docker Compose
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina datos de la BD)
docker-compose down -v
```

## 🌐 Configuración CORS

El backend está configurado para aceptar peticiones desde:

- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:5173` 
- `http://localhost:3001` (Frontend production)
- `http://127.0.0.1:3001`

Para agregar más orígenes, edita `src/main.ts`:

```typescript
app.enableCors({
  origin: [
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'https://tu-dominio.com'  // ← Agregar aquí
  ],
  credentials: true,
  // ...
});
```

## 👥 Sistema de Autenticación

### JWT Híbrido (Cookies + Headers)

El backend acepta tokens JWT de **2 formas**:

1️⃣ **Cookies** (automático en navegador):
```javascript
// Se establecen automáticamente en login/register
fetch('/api/auth/me', { credentials: 'include' })
```

2️⃣ **Authorization Header** (para APIs):
```javascript
fetch('/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
```

### Usuarios de Prueba

Las tablas se crean automáticamente. Para usuarios de prueba, puedes registrarte o crear vía endpoint:

```bash
# Registrar nuevo usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "Usuario",
    "email": "admin@tedics.com",
    "password": "123456",
    "role": "admin"
  }'
```

## 🛠️ API Endpoints

### 🔐 Autenticación

```http
POST /api/auth/register    # Registrar usuario
POST /api/auth/login       # Iniciar sesión  
POST /api/auth/logout      # Cerrar sesión
GET  /api/auth/me          # Obtener perfil actual (requiere JWT)
```

**Ejemplo de Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tedics.com",
    "password": "123456"
  }'
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@tedics.com",
    "role": "admin",
    "firstName": "Admin",
    "lastName": "Usuario"
  }
}
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

## �️ Solución de Problemas Comunes

### ❌ Error: "Cannot connect to database"

**Problema:** El backend no puede conectarse a PostgreSQL.

**Solución:**
```bash
# 1. Verificar que Docker esté corriendo
docker ps

# 2. Verificar que el contenedor PostgreSQL esté activo
docker-compose ps

# 3. Reiniciar Docker Compose
docker-compose down && docker-compose up -d

# 4. Verificar las variables de .env
# Asegurar que DB_PASSWORD coincida con DATABASE_PASSWORD
```

### ❌ Error: "Port 3000 already in use"

**Solución:**
```bash
# Cambiar puerto en .env
PORT=3001

# O terminar proceso que usa el puerto 3000
npx kill-port 3000
```

### ❌ Error: "Module not found" 

**Solución:**
```bash
# Limpiar y reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### ❌ Error de CORS en el frontend

**Solución:** Verificar que el origen del frontend esté en `src/main.ts`:
```typescript
origin: ['http://localhost:3001'] // ← Tu puerto del frontend
```

## 📦 Scripts de Desarrollo

```bash
# 🔍 Ver logs de Docker
docker-compose logs -f

# 🗄️ Acceder a PostgreSQL directamente
docker exec -it mi_proyecto_db psql -U postgres

# 🧪 Tests
npm run test          # Tests unitarios
npm run test:e2e      # Tests end-to-end
npm run test:cov      # Cobertura de tests

# 📝 Linting y formato
npm run lint          # ESLint
npm run format        # Prettier
```

## 🔧 Tecnologías y Versiones

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **NestJS** | 11.0.1 | Framework backend principal |
| **TypeORM** | 0.3.27 | ORM para base de datos |
| **PostgreSQL** | 15-alpine | Base de datos relacional |
| **JWT** | - | Autenticación y autorización |
| **bcrypt** | - | Hash seguro de contraseñas |
| **class-validator** | - | Validación de DTOs |
| **Passport** | - | Estrategias de autenticación |
| **Docker** | - | Contenedorización de PostgreSQL |
| **cookie-parser** | - | Manejo de cookies para JWT |

## 📁 Estructura del Proyecto

```
📦 back-end-Servicio-tecnico/
├── 📂 src/                     # 🔥 Código fuente principal
│   ├── 📂 entities/            # 🗃️ Entidades TypeORM (User, Product, etc.)
│   ├── 📂 modules/             # 📦 Módulos organizados por funcionalidad
│   │   ├── 📂 auth/            # 🔐 Autenticación JWT híbrida
│   │   ├── 📂 users/           # 👥 Gestión de usuarios y roles
│   │   ├── 📂 products/        # 📦 Catálogo de productos
│   │   ├── 📂 quotations/      # 💰 Sistema de cotizaciones
│   │   ├── 📂 services/        # 🔧 Gestión de servicios técnicos
│   │   ├── 📂 reports/         # 📊 Reportes y estadísticas
│   │   ├── 📂 audit-logs/      # 📝 Auditoría del sistema
│   │   └── 📂 statuses/        # 🏷️ Estados de cotizaciones/servicios
│   ├── 📂 common/              # 🔄 Código compartido
│   │   ├── 📂 dto/             # 📋 Data Transfer Objects
│   │   ├── 📂 guards/          # 🛡️ Guards de autenticación/autorización
│   │   ├── 📂 decorators/      # ✨ Decoradores personalizados (@GetUser)
│   │   └── 📄 service-Priority.enum.ts  # 📊 Enums compartidos
│   ├── 📂 database/            # 🗄️ Configuración de base de datos
│   │   └── 📂 migrations/      # 🔄 Migraciones de BD
│   ├── 📂 scripts/             # ⚡ Scripts de utilidad (seed, etc.)
│   └── 📄 main.ts              # 🚀 Punto de entrada principal
├── 📂 test/                    # 🧪 Tests end-to-end
├── 📂 packages/                # 📦 Paquetes compartidos
│   └── 📂 shared/              # 🔄 Tipos compartidos (QuotationStatus)
├── 📄 .env                     # 🔒 Variables de entorno (IGNORADO por git)
├── 📄 .env.example             # 📋 Plantilla de configuración
├── 📄 docker-compose.yml       # 🐳 Configuración PostgreSQL
├── 📄 ormconfig.ts            # ⚙️ Configuración TypeORM
├── 📄 package.json            # 📦 Dependencias y scripts
├── 📄 tsconfig.json           # 🔧 Configuración TypeScript
└── 📄 README-API.md           # 📖 Esta documentación
```

### 🎯 Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/main.ts` | 🚀 Bootstrap del servidor, CORS, pipes globales |
| `src/app.module.ts` | 🏗️ Módulo raíz, configuración TypeORM |
| `src/modules/auth/jwt.strategy.ts` | 🔐 Estrategia JWT híbrida (cookies + headers) |
| `.env` | 🔒 Variables de entorno (DB, JWT, puerto) |
| `docker-compose.yml` | 🐳 PostgreSQL containerizado |
| `ormconfig.ts` | ⚙️ Configuración adicional de TypeORM |

## 🚀 Casos de Uso Implementados

✅ **CUG-001**: Registrar Producto  
✅ **CUG-002**: Realizar Cotización  
✅ **CUG-003**: Generar Reporte Mensual  
✅ **CUG-004**: Historial de los Clientes  
✅ **CUG-005**: Estado del Servicio  
✅ **CUG-008**: Inicio de Sesión  
✅ **CUG-009**: Registro de Clientes  
✅ **CUG-010**: Registro de Empleados  

## � Despliegue en Producción

### 📋 Preparación

```bash
# 1. Compilar para producción
npm run build

# 2. Configurar variables de entorno de producción
cp .env .env.production
# Editar .env.production con datos reales
```

### 🌍 Variables de Entorno de Producción

```env
NODE_ENV=production
PORT=3000

# Base de datos de producción
DATABASE_HOST=tu-servidor-postgres.com
DATABASE_PORT=5432
DATABASE_USERNAME=tu_usuario_prod
DATABASE_PASSWORD=contraseña_super_segura
DATABASE_NAME=servicio_tecnico_prod

# JWT con secreto más seguro
JWT_SECRET=un_secreto_jwt_ultra_seguro_para_produccion_256_bits
JWT_EXPIRATION=1h
```

### 🔒 Seguridad en Producción

- ✅ Usar HTTPS obligatorio
- ✅ Configurar CORS solo para dominios permitidos
- ✅ JWT con secretos seguros (256+ bits)
- ✅ Variables de entorno en archivo seguro
- ✅ Base de datos con SSL/TLS
- ✅ Rate limiting en endpoints críticos

## 🤝 Contribución

### 📝 Proceso de Desarrollo

1. **Fork** del repositorio
2. **Crear branch** para feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. **Push** al branch: `git push origin feature/nueva-funcionalidad`
5. **Pull Request** con descripción detallada

### 📏 Estándares de Código

```bash
# Antes de commit, ejecutar:
npm run lint        # ESLint
npm run format      # Prettier
npm run test        # Tests unitarios
npm run build       # Verificar compilación
```

## 📞 Soporte y Contacto

### 🐛 Reportar Problemas

- 📝 **Issues**: Crear issue en GitHub con etiquetas apropiadas
- 🔍 **Logs**: Incluir logs del backend y Docker
- 🌍 **Ambiente**: Especificar SO, versión Node.js, etc.

### 📧 Equipo de Desarrollo

- **Repositorio**: [https://github.com/Xhy09/back-end-Servicio-tecnico](https://github.com/Xhy09/back-end-Servicio-tecnico)
- **Branch Principal**: `main`
- **Branch de Desarrollo**: `back2`

### 🆘 Ayuda Rápida

```bash
# ❓ Estado general del sistema
curl http://localhost:3000/api

# 🔍 Verificar logs del backend
npm run start:dev | grep -E "(LOG|ERROR|WARN)"

# 🗄️ Estado de la base de datos
docker exec mi_proyecto_db psql -U postgres -c "SELECT version();"
```

---

## 📄 Licencia y Derechos

Este proyecto es **privado y confidencial**. 

**© 2025 - Sistema de Gestión de Servicios Técnicos**  
Todos los derechos reservados.

---

### 🎉 ¡Listo para Desarrollar!

Si seguiste todos los pasos correctamente, deberías tener:

- ✅ Backend corriendo en `http://localhost:3000`
- ✅ PostgreSQL en Docker funcionando
- ✅ JWT híbrido configurado
- ✅ CORS configurado para frontend
- ✅ Base de datos con tablas creadas automáticamente
- ✅ Endpoints de API listos para usar

**¡Hora de conectar el frontend y crear algo increíble!** 🚀