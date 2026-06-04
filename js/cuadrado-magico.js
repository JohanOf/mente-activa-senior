window.CUADRADO_MAGICO_DATA = {
  facil: [
    {
      target: 15,
      grid: [
        [8, null, 6],
        [3, 5, null],
        [null, 9, 2]
      ],
      hint: "Recuerde que el cuadrado clasico de 3 por 3 suma 15 en todas sus lineas.",
      solution: [
        [8, 1, 6],
        [3, 5, 7],
        [4, 9, 2]
      ]
    }
  ],
  medio: [
    {
      target: 24,
      grid: [
        [10, null, 8],
        [null, 8, 10],
        [8, 10, null]
      ],
      hint: "Fijese en el patron repetido de 6, 8 y 10.",
      solution: [
        [10, 6, 8],
        [6, 8, 10],
        [8, 10, 6]
      ]
    }
  ],
  dificil: [
    {
      target: 264,
      grid: [
        [96, null, 74],
        [null, 88, null],
        [80, null, 90]
      ],
      hint: "La fila del centro debe terminar con el mismo total usando numeros cercanos a 88.",
      solution: [
        [96, 94, 74],
        [88, 88, 88],
        [80, 82, 102]
      ]
    }
  ]
};

window.CuadradoMagico = {
  getExercise(difficulty, index) {
    const list = window.CUADRADO_MAGICO_DATA[difficulty] || [];
    return list[index % list.length];
  },

  getCount(difficulty) {
    const list = window.CUADRADO_MAGICO_DATA[difficulty] || [];
    return list.length;
  },

  getHint(exercise) {
    return exercise.hint;
  },

  getSpeechText(exercise, instructions) {
    return `${instructions} La suma objetivo es ${exercise.target}. Complete los espacios vacios.`;
  },

  render(container, exercise) {
    const columns = exercise.grid.length;
    const cells = exercise.grid.map((row, rowIndex) => row.map((value, colIndex) => {
      if (value === null) {
        return `
          <div class="magic-cell">
            <input
              type="number"
              inputmode="numeric"
              aria-label="Casilla ${rowIndex + 1}-${colIndex + 1}"
              data-row="${rowIndex}"
              data-col="${colIndex}"
              class="magic-input"
            >
          </div>
        `;
      }

      return `<div class="magic-cell" aria-label="Valor fijo">${value}</div>`;
    }).join("")).join("");

    container.innerHTML = `
      <div class="hint-box">
        <strong>Reto numerico</strong>
        <p>Complete los numeros faltantes para que las filas, columnas y diagonales sumen ${exercise.target}.</p>
      </div>
      <div class="magic-grid" style="grid-template-columns: repeat(${columns}, auto);">
        ${cells}
      </div>
    `;
  },

  validate() {
    const exercise = window.appState.currentExercise;
    const filledGrid = exercise.grid.map((row) => [...row]);
    const inputs = document.querySelectorAll(".magic-input");

    // Primero se reconstruye la matriz con los valores escritos por el usuario.
    for (let i = 0; i < inputs.length; i += 1) {
      const input = inputs[i];
      const row = Number(input.dataset.row);
      const col = Number(input.dataset.col);
      const value = Number(input.value);

      if (!input.value.trim()) {
        return {
          correct: false,
          message: "Complete todos los espacios antes de validar."
        };
      }

      filledGrid[row][col] = value;
    }

    const target = exercise.target;
    const size = filledGrid.length;
    const lines = [];

    for (let row = 0; row < size; row += 1) {
      lines.push(filledGrid[row].reduce((sum, value) => sum + value, 0));
    }

    for (let col = 0; col < size; col += 1) {
      let sum = 0;
      for (let row = 0; row < size; row += 1) {
        sum += filledGrid[row][col];
      }
      lines.push(sum);
    }

    let diagonalOne = 0;
    let diagonalTwo = 0;
    for (let index = 0; index < size; index += 1) {
      diagonalOne += filledGrid[index][index];
      diagonalTwo += filledGrid[index][size - 1 - index];
    }
    lines.push(diagonalOne, diagonalTwo);

    const correct = lines.every((sum) => sum === target);

    return {
      correct,
      message: correct
        ? "Muy bien. Todas las sumas son correctas."
        : "Algunas sumas no coinciden. Intentelo nuevamente."
    };
  },

  instructions(difficulty) {
    const texts = {
      facil: "Complete los numeros faltantes y revise que todo sume igual.",
      medio: "Piense con calma en los valores que faltan para mantener el equilibrio del cuadro.",
      dificil: "Observe filas, columnas y diagonales. Todas deben llegar al mismo resultado."
    };
    return texts[difficulty];
  }
};
