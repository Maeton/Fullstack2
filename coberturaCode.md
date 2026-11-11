# Resultados de pruebas - Huerto Hogar

**Herramientas:** Vitest, React Testing Library y jsdom. Cobertura con `@vitest/coverage-v8`.

En la última ejecución completa con Vitest, las **35 pruebas pasaron en 7 archivos**, sin fallos.

| Archivo / componente | Pruebas | Qué comprueban |
| --- | ---: | --- |
| `ProductoCard` | 3 | Datos del producto, agregar al carrito y falta de stock. |
| `Carrito` | 3 | Carrito vacío, cálculo del total y eliminación. |
| `Registro` | 4 | Campos vacíos, datos inválidos, registro válido y error del backend. |
| `RutaProtegida` | 4 | Redirección sin sesión, rol no permitido, acceso permitido y estado de carga. |
| `Login` | 6 | Validación local, selector de tipo de cuenta, envío del rol y error de acceso. |
| `api/client` + `api/session` | 12 | Sesión en `localStorage`, cabeceras, refresh único, reintento y cierre por token vencido. |
| `AuthContext` | 3 | Login correcto, rechazo de credenciales de otro rol y sesión guardada. |
| **Total** | **35** | **35 correctas y 0 fallidas.** |

Se simula `localStorage` y `fetch` con `vi.spyOn(...)` / `vi.stubGlobal(...)`, y se verifican cambios en el DOM de jsdom. Los mocks se restauran automáticamente entre pruebas mediante `restoreMocks: true` y se limpia el DOM con `cleanup()`.

Para instalar las dependencias y ejecutar las pruebas desde `huerto-hogar-react`:

```powershell
npm.cmd ci
npm.cmd test
```

Resultado obtenido:

```text
Test Files  7 passed (7)
     Tests  35 passed (35)
```

Para volver a ejecutar las pruebas al guardar cambios:

```powershell
npm.cmd run test:watch
```

## Cobertura de código

```powershell
npm.cmd run test:coverage
```

La última ejecución con cobertura también obtuvo **35 pruebas correctas y 0 fallidas**. El resumen global del proveedor V8 fue:

| Métrica | Cobertura | Elementos cubiertos / total |
| --- | ---: | ---: |
| Sentencias | 43,17 % | 215 / 498 |
| Ramas | 40,24 % | 132 / 328 |
| Funciones | 34,78 % | 48 / 138 |
| Líneas | 43,71 % | 205 / 469 |

La configuración incluye `src/**/*.{js,jsx}` y excluye los archivos `src/**/*.spec.{js,jsx}` y el punto de entrada `src/main.jsx`. Se generan un resumen en consola, el informe HTML `coverage/index.html` y el archivo JSON `coverage/coverage-final.json`.

La cobertura se concentra en la lógica crítica de la integración: cliente HTTP, manejo de sesión, refresh de tokens, login y control de rutas por rol. Los paneles y páginas institucionales se validaron manualmente en navegador, junto con los flujos de los tres roles y el cierre de sesión.
