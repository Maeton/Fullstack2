# ERS - Huerto Hogar

**Asignatura:** DSY1104 - Desarrollo Fullstack II.  
**Versión:** 2.0 - Evaluación Parcial 2.    
**Integrantes:** Mateo Nogueira, Fernanda Viveros y Andeison Belandria.

## 1. Objetivo y propuesta

Actualizar Huerto Hogar, tienda de alimentos frescos de Paine, mediante una aplicación React con componentes reutilizables, navegación, diseño Bootstrap y pruebas con Vitest y React Testing Library en un entorno jsdom. Sus usuarios pueden consultar frutas, gestionar un carrito por kilos y registrar datos de contacto.

## 2. Alcance

Incluye Inicio, Catálogo, Nosotros, Carrito y Registro, con precios en CLP y almacenamiento local. El catálogo actual contiene seis frutas; no incluye buscador. El registro no crea cuentas autenticadas y finalizar compra es una simulación. No existen pagos, backend ni gestión real de pedidos o inventario.

## 3. Requisitos funcionales

| ID | Requisito y criterio de aceptación |
| --- | --- |
| RF-01 | Navegar entre las cinco páginas y mostrar un aviso ante rutas desconocidas. |
| RF-02 | Mostrar bienvenida, video, tres productos destacados y acceso al catálogo. |
| RF-03 | Presentar productos con nombre, imagen, descripción y precio por kilo. |
| RF-04 | Agregar un kilo por clic e incrementar productos existentes sin duplicarlos. Al agregar, respetar el stock y el máximo de cinco kilos; deshabilitar el botón sin stock. |
| RF-05 | Mostrar cantidades, subtotales y total. Permitir cantidades de uno a cinco y eliminar seleccionando cero. |
| RF-06 | Guardar el carrito en `huerto_cart` y recuperarlo al abrir su página. |
| RF-07 | Al finalizar la simulación, vaciar el carrito y confirmar; impedir finalizar si está vacío. |
| RF-08 | Validar el registro, mostrar errores y enfocar el primer campo inválido. |
| RF-09 | Guardar nombre, correo, teléfono y dirección en `huerto_user`, confirmar y limpiar los campos. No guardar la contraseña. Si falla el guardado, avisar y conservar los datos. |
| RF-10 | Mostrar información del emprendimiento, contacto y mapa de referencia de Paine. |

## 4. Reglas y validaciones

- Subtotal = precio por kilo × cantidad. Total = suma de subtotales, sin despacho ni descuentos.
- El stock es estático. Su control se aplica al agregar; el selector del carrito permite de cero a cinco.
- Todos los campos de registro son obligatorios: nombre de al menos 3 caracteres, correo válido, contraseña de al menos 6 caracteres, teléfono `+56` seguido de 9 dígitos y dirección de al menos 5 caracteres.
- Se eliminan espacios exteriores de nombre, correo, teléfono y dirección. Un registro nuevo reemplaza el anterior en el mismo navegador.

## 5. Requisitos no funcionales

| ID | Requisito |
| --- | --- |
| RNF-01 | Separar páginas, componentes y datos, utilizando propiedades y estados de React. |
| RNF-02 | Adaptar el diseño con Bootstrap y comprobar legibilidad y controles en celular, tablet y escritorio. |
| RNF-03 | Utilizar español, moneda CLP, etiquetas de campos, textos alternativos y mensajes de error accesibles. |
| RNF-04 | Manejar errores de almacenamiento y evitar que un carrito ilegible impida abrir su página. |
| RNF-05 | Ejecutar diez pruebas con Vitest y React Testing Library en jsdom, incluyendo interacción con el DOM y mocks de almacenamiento. Generar un informe de cobertura mediante el proveedor V8. |
| RNF-06 | Generar correctamente la distribución con `npm.cmd run build`. |

## 6. Verificación y aceptación

La última ejecución completa con Vitest obtuvo **10 pruebas correctas y 0 fallidas en 3 archivos**: 3 de ProductoCard, 3 de Carrito y 4 de Registro. Se conserva la misma cantidad de pruebas tras la migración. Verifican visualización de datos, alta y eliminación de productos, totales, validaciones y guardado del registro, incluido un fallo simulado de almacenamiento.

Queda comprobar manualmente navegación, diseño responsivo, límites de cantidad, finalización de compra y contenido institucional. Las pruebas aprobadas no acreditan por sí solas todos los requisitos.

## 7. Ejecución y referencias

Desde `huerto-hogar-react`: `npm.cmd ci` para instalar, `npm.cmd run dev` para iniciar y `npm.cmd test` para ejecutar las pruebas. `npm.cmd run test:watch` ejecuta las pruebas al guardar cambios y `npm.cmd run test:coverage` genera cobertura en `coverage/`, incluido el informe HTML `coverage/index.html`. Las pruebas se ejecutan con Node.js y jsdom, sin instalar un navegador. Para usar la aplicación se requiere un navegador con JavaScript y almacenamiento local. El mapa requiere conexión a OpenStreetMap.

Documento elaborado a partir del código actual y la pauta DSY1104, Evaluación Parcial 2, páginas 3 a 9. Los resultados de testing se resumen en `coberturaCode.md`. No se dispuso de un ERS anterior para comparar requisitos.
