window.REFRAN_INCOMPLETO_DATA = {
  facil: [
    {
      text: "Mas vale tarde que ____.",
      options: ["nunca", "siempre", "ayer"],
      answer: "nunca",
      hint: "Es una expresion muy conocida sobre llegar tarde."
    },
    {
      text: "Al mal tiempo, buena ____.",
      options: ["cara", "mesa", "silla"],
      answer: "cara",
      hint: "Se relaciona con mantener buena actitud."
    }
  ],
  medio: [
    {
      text: "No por mucho madrugar amanece mas ____.",
      options: ["temprano", "alto", "rapido"],
      answer: "temprano",
      hint: "Habla del momento en que sale el sol."
    },
    {
      text: "A caballo regalado no se le mira el ____.",
      options: ["diente", "sombrero", "lomo"],
      answer: "diente",
      hint: "La frase menciona una parte de la boca."
    }
  ],
  dificil: [
    {
      text: "El que mucho abarca, poco ____.",
      options: ["aprieta", "camina", "espera"],
      answer: "aprieta",
      hint: "Rima con la idea de sujetar algo fuerte."
    },
    {
      text: "Ojos que no ven, corazon que no ____.",
      options: ["siente", "recuerda", "duerme"],
      answer: "siente",
      hint: "Se relaciona con emociones."
    }
  ]
};

window.RefranIncompleto = {
  getExercise(difficulty, index) {
    const list = window.REFRAN_INCOMPLETO_DATA[difficulty] || [];
    return list[index % list.length];
  },

  getCount(difficulty) {
    const list = window.REFRAN_INCOMPLETO_DATA[difficulty] || [];
    return list.length;
  },

  getHint(exercise) {
    return exercise.hint;
  },

  getSpeechText(exercise, instructions) {
    return `${instructions} Complete el refran. ${exercise.text} Opciones: ${exercise.options.join(", ")}.`;
  },

  render(container, exercise) {
    const options = exercise.options.map((option) => `
      <button type="button" class="secondary-button option-button" data-option="${option}" aria-pressed="false">${option}</button>
    `).join("");

    container.innerHTML = `
      <div class="options-box">
        <strong>Complete el refrán</strong>
        <p>${exercise.text}</p>
        <div class="option-list" role="group" aria-label="Opciones para completar el refrán">${options}</div>
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
        message: "Seleccione una opción para completar el refrán."
      };
    }

    const correct = selected === window.appState.currentExercise.answer;
    return {
      correct,
      message: correct
        ? "Muy bien. Completó el refrán correctamente."
        : "La opción no completa bien el refrán. Use la pista e inténtelo otra vez."
    };
  },

  instructions(difficulty) {
    const texts = {
      facil: "Lea el refran y elija la palabra que falta.",
      medio: "Observe el refran incompleto y seleccione la opcion correcta.",
      dificil: "Piense en el refran tradicional y complete la palabra faltante."
    };
    return texts[difficulty];
  }
};
