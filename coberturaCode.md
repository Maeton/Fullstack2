# Resultados de pruebas - Huerto Hogar

**Herramientas:** Jasmine y Karma con ChromeHeadless.

En la última ejecución completa, las **10 pruebas pasaron**, sin fallos.

| Componente | Pruebas | Qué comprueban |
| --- | ---: | --- |
| ProductoCard | 3 | Datos del producto, agregar al carrito y falta de stock. |
| Carrito | 3 | Carrito vacío, cálculo del total y eliminación. |
| Registro | 4 | Campos vacíos, datos inválidos, registro válido y error al guardar. |
| **Total** | **10** | **10 correctas y 0 fallidas.** |

Se simula `localStorage` con mocks y se verifican cambios en el DOM.

Para ejecutar las pruebas desde `huerto-hogar-react`:

```powershell
npm.cmd test
```

Resultado obtenido:

```text
TOTAL: 10 SUCCESS
```
