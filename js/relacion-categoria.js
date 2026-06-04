window.RELACION_CATEGORIA_DATA = {
  facil: [
    {
      prompt: "Cual de estas opciones pertenece a la categoria frutas?",
      options: ["Manzana", "Silla", "Zapato"],
      answer: "Manzana",
      hint: "Es un alimento dulce que crece en un arbol."
    },
    {
      prompt: "Cual de estas opciones pertenece a la categoria animales?",
      options: ["Perro", "Taza", "Puerta"],
      answer: "Perro",
      hint: "Es un companero muy comun en el hogar."
    }
  ],
  medio: [
    {
      prompt: "Cual de estas opciones pertenece a la categoria profesiones de salud?",
      options: ["Medico", "Pintor", "Panadero"],
      answer: "Medico",
      hint: "Ayuda a las personas cuando estan enfermas."
    },
    {
      prompt: "Cual de estas opciones pertenece a la categoria medios de transporte?",
      options: ["Autobus", "Lampara", "Almohada"],
      answer: "Autobus",
      hint: "Se usa para trasladar varias personas."
    }
  ],
  dificil: [
    {
      prompt: "Cual de estas opciones pertenece a la categoria instrumentos musicales?",
      options: ["Violin", "Escalera", "Ventana"],
      answer: "Violin",
      hint: "Produce sonido y se toca con arco."
    },
    {
      prompt: "Cual de estas opciones pertenece a la categoria elementos del clima?",
      options: ["Tormenta", "Cuaderno", "Cuchara"],
      answer: "Tormenta",
      hint: "Puede traer lluvia, viento y truenos."
    }
  ]
};

window.RelacionCategoria = {
  getExercise(difficulty, index) {
    const list = window.RELACION_CATEGORIA_DATA[difficulty] || [];
    return list[index % list.length];
  },

  getCount(difficulty) {
    const list = window.RELACION_CATEGORIA_DATA[difficulty] || [];
    return list.length;
  },

  getHint(exercise) {
    return exercise.hint;
  },

  getSpeechText(exercise, instructions) {
    return `${instructions} ${exercise.prompt} Las opciones son: ${exercise.options.join(", ")}.`;
  },

  render(container, exercise) {
    const options = exercise.options.map((option) => `
      <button type="button" class="secondary-button option-button" data-option="${option}" aria-pressed="false">${option}</button>
    `).join("");

    container.innerHTML = `
      <div class="options-box">
        <strong>Seleccione la opción correcta</strong>
        <p>${exercise.prompt}</p>
        <div class="option-list" role="group" aria-label="Opciones de respuesta">${options}</div>
      </div>
      <div class="status-box">
        <p class="support-text">Toque una opción y luego presione validar respuesta.</p>
      </div>
    `;

    const buttons = container.querySelectorAll(".option-button");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => {
          item.classList.remove("selected-option");
          item.setAttribute("aria-pressed", "false");
        });
        button.classList.add("selected-option");
        button.setAttribute("aria-pressed", "true");
        container.dataset.selectedOption = button.dataset.option;
      });
    });
  },

  validate() {
    const selected = document.getElementById("activity-content").dataset.selectedOption || "";

    if (!selected) {
      return {
        correct: false,
        message: "Seleccione una opción antes de validar."
      };
    }

    const correct = selected === window.appState.currentExercise.answer;
    return {
      correct,
      message: correct
        ? "Muy bien. Eligió la categoría correcta."
        : "La opción elegida no es correcta. Use la pista si la necesita."
    };
  },

  instructions(difficulty) {
    const texts = {
      facil: "Lea la categoria y seleccione la opcion correcta.",
      medio: "Piense en el grupo al que pertenece cada palabra y elija la mejor opcion.",
      dificil: "Analice la categoria con atencion y seleccione la respuesta adecuada."
    };
    return texts[difficulty];
  }
};
