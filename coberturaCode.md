# Resultados de pruebas - Huerto Hogar

**Herramientas:** Vitest, React Testing Library y jsdom. Cobertura con `@vitest/coverage-v8`.

En la última ejecución completa con Vitest, las **10 pruebas pasaron en 3 archivos**, sin fallos. Se conservan los mismos diez casos de prueba tras la migración.

| Componente | Pruebas | Qué comprueban |
| --- | ---: | --- |
| ProductoCard | 3 | Datos del producto, agregar al carrito y falta de stock. |
| Carrito | 3 | Carrito vacío, cálculo del total y eliminación. |
| Registro | 4 | Campos vacíos, datos inválidos, registro válido y error al guardar. |
| **Total** | **10** | **10 correctas y 0 fallidas.** |

Se simula `localStorage` con `vi.spyOn(...).mockImplementation(...)` y se verifican cambios en el DOM de jsdom. Los mocks se restauran automáticamente entre pruebas mediante `restoreMocks: true` y se limpia el DOM con `cleanup()`.

Para instalar las dependencias y ejecutar las pruebas desde `huerto-hogar-react`:

```powershell
npm.cmd ci
npm.cmd test
```

Resultado obtenido:

```text
Test Files  3 passed (3)
     Tests  10 passed (10)
```

Para volver a ejecutar las pruebas al guardar cambios:

```powershell
npm.cmd run test:watch
```

## Cobertura de código

```powershell
npm.cmd run test:coverage
```

La última ejecución con cobertura también obtuvo **10 pruebas correctas y 0 fallidas**. El resumen global del proveedor V8 fue:

| Métrica | Cobertura | Elementos cubiertos / total |
| --- | ---: | ---: |
| Sentencias | 74,35 % | 87 / 117 |
| Ramas | 79,36 % | 50 / 63 |
| Funciones | 60,52 % | 23 / 38 |
| Líneas | 75 % | 84 / 112 |

La configuración incluye `src/**/*.{js,jsx}` y excluye los archivos `src/**/*.spec.jsx` y el punto de entrada `src/main.jsx`. Se generan un resumen en consola, el informe HTML `coverage/index.html` y el archivo JSON `coverage/coverage-final.json`.

La cobertura mide el código ejecutado por estas pruebas; no acredita por sí sola todos los requisitos. Permanecen pendientes las comprobaciones manuales de navegación, diseño responsivo, límites de cantidad, finalización de compra y contenido institucional indicadas en el ERS.
