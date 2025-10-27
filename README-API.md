# ⚡ Backend - Sistema de Gestión de Instalaciones Eléctricas

## 📋 Descripción

Backend desarrollado con **NestJS 11** para un sistema de gestión empresarial especializado en **instalaciones eléctricas y servicios técnicos** que incluye:

- 👥 **Gestión de Usuarios** (Admin, Empleados, Clientes)
- 📦 **Catálogo de Productos Eléctricos** y 8 Categorías especializadas
- 💰 **Sistema de Cotizaciones** completo con estados
- 🔧 **Gestión de Servicios** de instalación eléctrica
- 📊 **Reportes** y estadísticas en tiempo real
- 🔐 **Autenticación JWT** por headers Authorization
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

## ⚡ Inicio Rápido

**Para desarrolladores que quieren probar el backend inmediatamente:**

```powershell
# 1. Clonar e instalar dependencias
git clone https://github.com/Xhy09/back-end-Servicio-tecnico.git
cd back-end-Servicio-tecnico
npm install

# 2. Configurar variables de entorno
# Crear archivo .env con las credenciales de la base de datos
# (Ver sección de configuración más abajo)

# 3. Iniciar PostgreSQL con Docker
docker-compose up -d

# 4. Verificar que el contenedor esté corriendo
docker ps

# 5. Iniciar el backend en modo desarrollo
npm run start:dev

# 6. Poblar la base de datos (EN OTRA TERMINAL)
npm run db:seed
```

**🎉 Resultado:** 
- ✅ Backend funcionando en `http://localhost:3000`
- ✅ Base de datos PostgreSQL con 8 categorías de productos eléctricos
- ✅ 3 usuarios de prueba listos (Admin, Empleado, Cliente)
- ✅ Estados de cotizaciones configurados

**📋 Credenciales de prueba:**
- **Admin**: `admin@tedics.com` / `123456`
- **Empleado**: `empleado@tedics.com` / `123456`  
- **Cliente**: `user@tedics.com` / `123456`

---

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

**Crear archivo `.env` en la raíz del proyecto:**

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de la base de datos PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=example
DATABASE_NAME=postgres

# Variables para Docker Compose (deben coincidir con DATABASE_*)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=example
DB_NAME=postgres

# Configuración JWT (para autenticación)
JWT_SECRET=mi_super_secreto_jwt_2024_secure_key_12345
JWT_EXPIRATION=1d
```

**⚠️ Importante:** 
- Las credenciales `DATABASE_*` deben coincidir con `DB_*`
- En producción, cambia `JWT_SECRET` por una clave segura
- Si usas otro puerto, actualiza `PORT=3001` (y configura CORS en `main.ts`)

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

### 5️⃣ Poblar la base de datos con datos de ejemplo

**⚠️ IMPORTANTE:** Ejecuta el script de seed para crear datos iniciales:

```powershell
# Poblar la base de datos con usuarios y datos de ejemplo
npm run db:seed
```

**Este comando creará automáticamente:**

#### � **Usuarios:**
- 👨‍💼 **Admin**: `admin@tedics.com` / `123456`
- 👷‍♂️ **Empleado**: `empleado@tedics.com` / `123456`
- 👤 **Cliente**: `user@tedics.com` / `123456`

#### 📦 **8 Categorías de Productos Eléctricos:**
1. **Materiales Eléctricos** - Cables, interruptores, tomacorrientes
2. **Iluminación** - Luminarias, lámparas LED, focos
3. **Protección y Seguridad** - Breakers, fusibles, supresores
4. **Equipos y Herramientas** - Multímetros, pinzas amperimétricas
5. **Automatización** - Sensores, temporizadores, controles
6. **Tableros y Paneles** - Tableros de distribución
7. **Cableado y Conducción** - Cable THHN, conduit, canaletas
8. **Servicios de Instalación** - Mano de obra, instalaciones

#### 🏷️ **Estados para Cotizaciones:**
- Pendiente, Aprobada, Rechazada, En Proceso, Completada, Cancelada

#### 🔧 **Servicios de ejemplo** para el cliente de prueba

### 6️⃣ Verificar la instalación

Una vez que el servidor esté corriendo, deberías ver:

```bash
[Nest] LOG [NestApplication] Nest application successfully started
API en http://localhost:3000
```

**Prueba la API:**
```bash
curl http://localhost:3000/api
# Respuesta: "Hello World!"
```

**Prueba el login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@tedics.com", "password": "123456"}'
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

### 🔐 JWT por Authorization Headers

El backend **SOLO** acepta tokens JWT por el header `Authorization`:

```javascript
// ✅ CORRECTO - Usar token en header Authorization
fetch('http://localhost:3000/api/quotations', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
})
```

**⚠️ Todos los endpoints protegidos requieren:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**❌ NO se aceptan cookies** - La autenticación es únicamente por headers

### 🎯 Usuarios de Prueba (Creados con el script seed)

**Después de ejecutar `npm run db:seed`, tendrás estos usuarios disponibles:**

#### 👨‍💼 **Administrador**
```json
{
  "email": "admin@tedics.com",
  "password": "123456",
  "role": "admin"
}
```

#### 👷‍♂️ **Empleado**
```json
{
  "email": "empleado@tedics.com", 
  "password": "123456",
  "role": "employee"
}
```

#### 👤 **Cliente**
```json
{
  "email": "user@tedics.com",
  "password": "123456", 
  "role": "customer"
}
```

**Todos los usuarios comparten la misma contraseña: `123456`** para facilitar las pruebas.

**Para crear usuarios adicionales:**

```bash
# Windows PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"firstName": "Nuevo", "lastName": "Usuario", "email": "usuario@example.com", "password": "123456", "role": "client"}'

# Linux/Mac
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Nuevo",
    "lastName": "Usuario", 
    "email": "usuario@example.com",
    "password": "123456",
    "role": "client"
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

**Ejemplo de Login (PowerShell):**
```powershell
# Hacer login y obtener token
$body = @{
    email = "admin@tedics.com"
    password = "123456"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

# Guardar el token
$token = $response.access_token
Write-Host "Token obtenido: $token"
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "09424687-4997-4083-8fff-a9430f8840db",
    "email": "admin@tedics.com",
    "role": "admin",
    "firstName": "Admin",
    "lastName": "Usuario",
    "status": "active"
  }
}
```

**Ejemplo de petición autenticada:**
```powershell
# Usar el token en las siguientes peticiones
$headers = @{
    Authorization = "Bearer $token"
}

$categories = Invoke-RestMethod -Uri "http://localhost:3000/api/categories" `
    -Method GET `
    -Headers $headers
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

### Categorías (Instalaciones Eléctricas)

```http
GET    /api/categories         # Listar categorías (Todas las 8 categorías)
POST   /api/categories         # Crear categoría (Admin/Empleado)
GET    /api/categories/:id     # Categoría por ID
PATCH  /api/categories/:id     # Actualizar categoría (Admin/Empleado)
DELETE /api/categories/:id     # Eliminar categoría (Admin, solo sin productos)
```

**Categorías disponibles:**
1. Materiales Eléctricos
2. Iluminación
3. Protección y Seguridad
4. Equipos y Herramientas
5. Automatización
6. Tableros y Paneles
7. Cableado y Conducción
8. Servicios de Instalación

### Estados

```http
GET    /api/statuses           # Listar todos los estados disponibles
```

**Estados disponibles para cotizaciones:**
- Pendiente, Aprobada, Rechazada, En Proceso, Completada, Cancelada

### Cotizaciones

```http
GET    /api/quotations                    # Listar cotizaciones (Admin/Empleado)
POST   /api/quotations                    # Crear cotización (Cliente/Admin/Empleado)
GET    /api/quotations/my-quotations      # Mis cotizaciones (Cliente)
GET    /api/quotations/:id               # Cotización por ID
PATCH  /api/quotations/:id               # Actualizar cotización (Admin/Empleado)
DELETE /api/quotations/:id               # Eliminar cotización (Admin)
```

**⚠️ Importante sobre estados de cotizaciones:**
- El backend valida las transiciones de estado
- Solo se permiten ciertas transiciones (ejemplo: Pendiente → Iniciado)
- Usa `statusId` (UUID) al actualizar, no el nombre del estado
- Obtén los IDs desde `GET /api/statuses`

**Ejemplo de actualización de cotización:**
```powershell
# 1. Obtener estados disponibles
$statuses = Invoke-RestMethod -Uri "http://localhost:3000/api/statuses" `
    -Headers @{Authorization="Bearer $token"}

# 2. Encontrar el estado deseado
$aprobadaStatus = $statuses | Where-Object {$_.name -eq "Aprobada"}

# 3. Actualizar la cotización
$updateBody = @{
    statusId = $aprobadaStatus.id
    subtotal = 1500.00
    tax = 225.00
    total = 1725.00
    notes = "Cotización aprobada por el cliente"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/quotations/$quotationId" `
    -Method PATCH `
    -Headers @{Authorization="Bearer $token"} `
    -ContentType "application/json" `
    -Body $updateBody
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
- **Category**: 8 Categorías de productos eléctricos
- **Product**: Catálogo de productos/materiales eléctricos
- **ProductImage**: Imágenes de productos
- **Status**: Estados para cotizaciones (Pendiente, Aprobada, etc.)
- **Quotation**: Cotizaciones para clientes
- **QuotationItem**: Items/productos de las cotizaciones
- **Service**: Servicios de instalación eléctrica
- **ServiceImage**: Imágenes de los trabajos realizados
- **AuditLog**: Log de auditoría del sistema

### Relaciones

- **User** → Quotation (1:N) - Un cliente puede tener muchas cotizaciones
- **User** → Service (1:N) - Un cliente puede solicitar muchos servicios
- **Category** → Product (1:N) - Una categoría tiene muchos productos
- **Product** → ProductImage (1:N) - Un producto puede tener varias imágenes
- **Quotation** → QuotationItem (1:N) - Una cotización tiene varios items
- **Quotation** → Status (N:1) - Cada cotización tiene un estado
- **Service** → ServiceImage (1:N) - Un servicio puede tener varias imágenes

### Campos Importantes

**Quotation:**
- `statusId` (UUID): Referencia al estado actual
- `subtotal`, `tax`, `total`: Montos de la cotización
- `quotationNumber`: Número único (COT-2025-001)

**Product:**
- `categoryId` (UUID): Referencia a la categoría
- `price`: Precio unitario
- `stock`: Cantidad disponible
- `sku`: Código de producto

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
npm run build           # Compilar para producción
npm run start:prod      # Ejecutar en producción
npm run db:seed         # Poblar base de datos con datos iniciales
npm run fix:passwords   # [OPCIONAL] Regenerar contraseñas de usuarios del seed
npm run lint            # Linter
npm run format          # Formatear código
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

### ❌ Error: "Credenciales incorrectas" al hacer login

**Problema:** Los usuarios creados con el seed no pueden hacer login.

**Solución 1 - Empezar de cero (RECOMENDADO):**
```powershell
# Eliminar completamente la base de datos y empezar limpio
docker-compose down -v
docker-compose up -d

# Esperar 5 segundos a que PostgreSQL inicie
Start-Sleep -Seconds 5

# Reiniciar backend (si está corriendo, presiona Ctrl+C primero)
npm run start:dev

# En OTRA TERMINAL, ejecutar seed
npm run db:seed
```

**Solución 2 - Solo si la Solución 1 no funciona:**
```powershell
# Este script regenera las contraseñas con hashes bcrypt válidos
npm run fix:passwords
```

**Verificar el login después:**
```powershell
# Probar login
$body = @{email="admin@tedics.com"; password="123456"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
    -Method POST -ContentType "application/json" -Body $body
    
Write-Host "✅ Login exitoso! Token: $($response.access_token)"
```

### ❌ Error: "Transición de estado inválida"

**Problema:** Al actualizar el estado de una cotización, recibes error 400.

**Causa:** El backend valida las transiciones de estado:
- Pendiente → Iniciado (pero "Iniciado" no existe en los seeds)
- Usa los estados disponibles: Pendiente, Aprobada, Rechazada, En Proceso, Completada, Cancelada

**Solución:**
```powershell
# 1. Obtener estados disponibles
$statuses = Invoke-RestMethod -Uri "http://localhost:3000/api/statuses" `
    -Headers @{Authorization="Bearer $token"}

# 2. Ver estados disponibles
$statuses | Format-Table id, name

# 3. Usar el statusId correcto en lugar del nombre
$updateBody = @{
    statusId = "uuid-del-estado-deseado"  # No uses el nombre
} | ConvertTo-Json
```

### ❌ La base de datos no tiene tablas

**Problema:** TypeORM no está creando las tablas automáticamente.

**Solución:**
```bash
# 1. Verificar que synchronize: true esté en app.module.ts
# 2. Eliminar la base de datos y empezar de cero
docker-compose down -v
docker-compose up -d

# 3. Reiniciar el backend (TypeORM creará las tablas automáticamente)
npm run start:dev

# 4. Ejecutar seed
npm run db:seed
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
| **JWT** | - | Autenticación por headers |
| **bcrypt** | - | Hash seguro de contraseñas |
| **class-validator** | - | Validación de DTOs |
| **Passport** | - | Estrategias de autenticación |
| **Docker** | Latest | Contenedorización de PostgreSQL |
| **Node.js** | 18+ | Entorno de ejecución |

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
- ✅ PostgreSQL 15 en Docker funcionando
- ✅ JWT por Authorization headers configurado
- ✅ CORS configurado para múltiples orígenes
- ✅ Base de datos con 8 categorías de productos eléctricos
- ✅ 6 estados de cotizaciones (Pendiente, Aprobada, etc.)
- ✅ 3 usuarios de prueba listos (Admin, Empleado, Cliente)
- ✅ Endpoints de API REST completamente funcionales

**📊 Verificación rápida:**
```powershell
# 1. Verificar que el backend responde
Invoke-RestMethod -Uri "http://localhost:3000/api"

# 2. Login como admin
$body = @{email="admin@tedics.com"; password="123456"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
    -Method POST -ContentType "application/json" -Body $body
$token = $response.access_token

# 3. Ver categorías de productos eléctricos
Invoke-RestMethod -Uri "http://localhost:3000/api/categories" `
    -Headers @{Authorization="Bearer $token"} | Format-Table name, description
```

**⚡ Sistema listo para gestionar instalaciones eléctricas y servicios técnicos!** �