# Huerto Hogar — Evaluación Parcial 3

Tienda de frutas y productos del huerto desarrollada con **React + Vite + Bootstrap**, conectada a un backend **Spring Boot + H2 + JWT**.

## Integrantes

- Mateo Nogueira
- Fernanda Viveros
- Andeison Belandria

## Stack

- React 19 + Vite 8
- React Router 7
- Bootstrap 5
- Vitest + React Testing Library
- Backend: [Fullstack2-Backend](https://github.com/Maeton/Fullstack2-Backend) (Spring Boot, H2, JWT, Swagger)

## Requisitos

- Node.js 20 o superior.
- Backend corriendo en `http://localhost:8080`.

## Configuración

Desde `huerto-hogar-react`:

```powershell
Copy-Item .env.example .env
npm.cmd ci
```

`.env` contiene la URL de la API:

```env
VITE_API_URL=http://localhost:8080
```

## Ejecutar

```powershell
npm.cmd run dev
```

Abrir <http://localhost:5173>.

El backend se levanta desde su repositorio:

```powershell
.\mvnw.cmd -DskipTests package
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1
```

## Cuentas semilla

| Rol | Correo | Contraseña |
| --- | --- | --- |
| CLIENTE | `cliente@huerto.cl` | `Cliente123!` |
| VENDEDOR | `vendedor@huerto.cl` | `Vendedor123!` |
| ADMIN | `admin@huerto.cl` | `Admin123!` |

El login incluye un selector de **tipo de cuenta**: solo acepta las credenciales del rol seleccionado. Si se elige un rol y se ingresan credenciales de otro, el acceso se rechaza y no se guarda la sesión.

## Funcionalidades

- Catálogo e inicio cargados desde `GET /api/productos`.
- Carrito persistente en `localStorage` y creación de pedidos reales con `POST /api/pedidos`.
- Historial de pedidos del cliente con estado, fecha, ítems y total.
- Registro público conectado a la API; el backend siempre asigna el rol **CLIENTE**.
- Sesión persistente ante recargas, refresh automático del access token y logout.
- Rutas protegidas y menú dinámico según el rol.
- Panel de vendedor: crear, editar y desactivar sus productos.
- Panel de administración: crear usuarios con rol, desactivar cuentas y cambiar el estado de los pedidos.

## Roles y accesos

| Sección | Público | CLIENTE | VENDEDOR | ADMIN |
| --- | :---: | :---: | :---: | :---: |
| Inicio, Catálogo, Nosotros | Sí | Sí | Sí | Sí |
| Registro / Login | Sí | — | — | — |
| Carrito y Mis pedidos | — | Sí | — | — |
| Panel vendedor | — | — | Sí | Sí |
| Administración | — | — | — | Sí |

El backend refuerza cada permiso con `@PreAuthorize`; el frontend no es la única barrera.

## Pruebas y calidad

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run test:coverage
npm.cmd run build
```

Estado actual: **lint sin errores**, **35 pruebas en 7 archivos**, build de producción correcto. El detalle está en [coberturaCode.md](coberturaCode.md).

## Estructura

```text
src/
  api/            cliente HTTP, refresh y sesión
  assets/         imágenes y video
  components/     Header, Footer, ProductoCard, RutaProtegida
  context/        AuthContext
  hooks/          useProductos
  pages/          Inicio, Catálogo, Carrito, Login, Registro,
                  MisPedidos, PanelVendedor, PanelAdmin, SinAcceso
huerto-hogar-react/
                  aplicación React (package.json, vite.config.js)
```

## Documentación

- [Resultados de pruebas](coberturaCode.md)
- [Requisitos del software](ERS.md)
- [Backend](https://github.com/Maeton/Fullstack2-Backend)
