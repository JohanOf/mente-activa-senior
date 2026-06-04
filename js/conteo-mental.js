window.CONTEO_MENTAL_DATA = {
  facil: [
    {
      question: "Cuantas veces aparece la palabra SOL?",
      sequence: ["SOL", "CASA", "SOL", "FLOR", "SOL"],
      answer: "3",
      hint: "La palabra SOL aparece al inicio, al medio y al final."
    },
    {
      question: "Cuantas veces aparece la palabra PAN?",
      sequence: ["PAN", "LUNA", "PAN", "MESA"],
      answer: "2",
      hint: "Es menos de tres."
    }
  ],
  medio: [
    {
      question: "Cuantas veces aparece la palabra TREN?",
      sequence: ["TREN", "ARBOL", "TREN", "TREN", "LLAVE", "TREN"],
      answer: "4",
      hint: "Aparece mas de tres veces."
    },
    {
      question: "Cuantas veces aparece la palabra LIBRO?",
      sequence: ["LIBRO", "SILLA", "LIBRO", "RELOJ", "VENTANA", "LIBRO"],
      answer: "3",
      hint: "Aparece una vez al inicio y una vez al final."
    }
  ],
  dificil: [
    {
      question: "Cuantas veces aparece la palabra MUSICA?",
      sequence: ["MUSICA", "MUSICA", "FAMILIA", "MUSICA", "JARDIN", "NUBE", "MUSICA"],
      answer: "4",
      hint: "Aparece dos veces seguidas al principio."
    },
    {
      question: "Cuantas veces aparece la palabra ESTRELLA?",
      sequence: ["ESTRELLA", "RIO", "ESTRELLA", "SOL", "ESTRELLA", "MONTA", "ESTRELLA"],
      answer: "4",
      hint: "Aparece cuatro veces en total."
    }
  ]
};

window.ConteoMental = {
  getExercise(difficulty, index) {
    const list = window.CONTEO_MENTAL_DATA[difficulty] || [];
    return list[index % list.length];
  },

  getCount(difficulty) {
    const list = window.CONTEO_MENTAL_DATA[difficulty] || [];
    return list.length;
  },

  getHint(exercise) {
    return exercise.hint;
  },

  getSpeechText(exercise, instructions) {
    return `${instructions} ${exercise.question} La lista es: ${exercise.sequence.join(", ")}.`;
  },

  render(container, exercise) {
    const chips = exercise.sequence.map((item) => `<span class="sequence-chip">${item}</span>`).join("");

    container.innerHTML = `
      <div class="sequence-box">
        <strong>${exercise.question}</strong>
        <div class="sequence-list">${chips}</div>
      </div>
      <div class="field-group">
        <label for="count-answer">Escriba el numero correcto</label>
        <input id="count-answer" data-voice-target="true" type="number" inputmode="numeric" autocomplete="off" placeholder="Ejemplo: 3">
      </div>
    `;
  },

  validate() {
    const input = document.getElementById("count-answer");
    const value = input ? input.value.trim() : "";

    if (!value) {
      return {
        correct: false,
        message: "Escriba un numero antes de validar."
      };
    }

    const correct = value === window.appState.currentExercise.answer;
    return {
      correct,
      message: correct
        ? "Excelente. El conteo es correcto."
        : "El numero no es correcto. Observe otra vez la lista."
    };
  },

  instructions(difficulty) {
    const texts = {
      facil: "Mire la lista y cuente cuantas veces aparece la palabra indicada.",
      medio: "Observe con calma cada palabra y escriba la cantidad correcta.",
      dificil: "Cuente con atencion todas las repeticiones antes de responder."
    };
    return texts[difficulty];
  }
};
