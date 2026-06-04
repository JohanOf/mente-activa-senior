# Prompts utilizados

## Prompt inicial

```text
Necesito que desarrolles una aplicación web responsive llamada “MenteActiva Senior”.

La aplicación debe estar orientada a adultos mayores y debe servir para realizar ejercicios de memoria y estimulación cognitiva.

Quiero que uses HTML, CSS y JavaScript puro, sin frameworks. El código debe ser simple, ordenado, comentado y entendible, como un proyecto universitario hecho por estudiantes.

La aplicación debe basarse en ejercicios de memoria similares a estos:

1. Frase invertida:
   - Mostrar una frase escrita al revés o con el orden invertido.
   - El usuario debe escribir la frase correcta.
   - Ejemplo:
     Texto mostrado: “SAROGÁTÍP. OREMÚN LE SE SAEDI SAL Y ODNUM LE ANREIBOG EUQ OL”
     Respuesta esperada: “Lo que gobierna el mundo y las ideas es el número. Pitágoras”
   - Validar la respuesta ignorando mayúsculas y minúsculas.

2. Cuadrado mágico:
   - Mostrar un cuadrado numérico con algunos valores ocultos.
   - El usuario debe completar los números faltantes.
   - El sistema debe validar si las filas, columnas y diagonales suman el valor correcto.
   - Debe haber una instrucción clara, por ejemplo:
     “Complete los números faltantes para que las filas, columnas y diagonales sumen 264”.

3. Palabra oculta:
   - Mostrar una pista y varias letras disponibles.
   - El usuario debe descubrir la palabra correcta.
   - Ejemplo:
     Pista: “Conocida profesión relacionada con hacer pan”
     Respuesta: “Panadero”.
   - El sistema debe validar la respuesta.

La aplicación debe tener:

1. Pantalla de inicio:
   - Título: MenteActiva Senior
   - Breve descripción
   - Botón grande para comenzar

2. Menú principal:
   - Botón para Frase invertida
   - Botón para Cuadrado mágico
   - Botón para Palabra oculta

3. Niveles de dificultad:
   - Fácil
   - Medio
   - Difícil

4. Retroalimentación:
   - Mostrar mensajes claros como:
     “¡Muy bien!”
     “Excelente memoria”
     “Inténtalo nuevamente”
     “Respuesta correcta”
     “Respuesta incorrecta”

5. Accesibilidad:
   - Texto grande mínimo 18px
   - Botones grandes
   - Alto contraste
   - Colores suaves
   - Instrucciones simples
   - Navegación clara
   - Diseño responsive para celular y tablet
   - No saturar la pantalla

6. Navegación:
   - Botón para volver al menú
   - Botón para repetir ejercicio
   - Botón para cambiar de actividad

7. Puntuación:
   - Sumar puntos por respuestas correctas
   - Mostrar puntaje actual

Organiza el proyecto con esta estructura:

mente-activa-senior/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── frase-invertida.js
│   ├── cuadrado-magico.js
│   └── palabra-oculta.js
├── data/
│   ├── frases.json
│   ├── cuadrados.json
│   └── palabras.json
├── assets/
│   ├── img/
│   └── sounds/
└── docs/
    ├── documentacion-inicial.md
    ├── metodologia.md
    ├── requerimientos.md
    ├── pruebas.md
    └── prompts-utilizados.md

También crea los archivos Markdown de documentación:

1. documentacion-inicial.md
   - Introducción
   - Problema identificado
   - Objetivo general
   - Objetivos específicos
   - Público objetivo

2. metodologia.md
   - Explicación de Prompt-Driven Development
   - Por qué se eligió
   - Cómo se aplicó en el proyecto

3. requerimientos.md
   - Requerimientos funcionales
   - Requerimientos de accesibilidad
   - Requerimientos no funcionales

4. pruebas.md
   - Pruebas de navegación
   - Pruebas de accesibilidad
   - Pruebas de funcionamiento de cada actividad

5. prompts-utilizados.md
   - Guardar este prompt inicial
   - Dejar espacio para nuevos prompts usados durante el desarrollo

El diseño debe ser profesional, limpio y amigable para adultos mayores. No uses librerías externas. Todo debe funcionar abriendo index.html en el navegador.

Antes de finalizar, revisa que:
- No existan errores en consola.
- Todos los botones funcionen.
- Las 3 actividades estén implementadas.
- Existan niveles fácil, medio y difícil.
- La aplicación sea responsive.
- El texto sea grande y legible.
- La navegación sea simple.
```

## Nuevos prompts usados durante el desarrollo

- ** Iteracion 2 ** :
Actúa como un Desarrollador Frontend Senior y Experto en UX. Necesito optimizar el código actual de la aplicación “MenteActiva Senior” para asegurar un despliegue limpio y profesional, manteniendo la premisa de usar exclusivamente HTML, CSS y JavaScript nativo, sin dependencias externas.
- ** Iteracion 3 ** :
Actúa como un Especialista en Accesibilidad Web (W3C/WCAG) y Diseñador UI. El objetivo de esta iteración es auditar y corregir los problemas de accesibilidad y la paleta de colores actual de "MenteActiva Senior" para adaptarla a estándares estrictos de Alto Contraste (AAA).
