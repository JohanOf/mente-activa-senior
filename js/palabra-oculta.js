window.PALABRA_OCULTA_DATA = {
  facil: [
    {
      clue: "Animal conocido por dar lana",
      letters: ["O", "V", "E", "J", "A"],
      answer: "Oveja",
      hint: "Empieza con la letra O."
    },
    {
      clue: "Bebida caliente hecha con hojas",
      letters: ["T", "E"],
      answer: "Te",
      hint: "Tiene solo dos letras."
    }
  ],
  medio: [
    {
      clue: "Conocida profesion relacionada con hacer pan",
      letters: ["P", "A", "N", "A", "D", "E", "R", "O"],
      answer: "Panadero",
      hint: "Empieza con pana."
    },
    {
      clue: "Lugar donde se guardan muchos libros",
      letters: ["B", "I", "B", "L", "I", "O", "T", "E", "C", "A"],
      answer: "Biblioteca",
      hint: "Empieza con bibli."
    }
  ],
  dificil: [
    {
      clue: "Capacidad mental para recordar experiencias pasadas",
      letters: ["M", "E", "M", "O", "R", "I", "A"],
      answer: "Memoria",
      hint: "Es una palabra central de la aplicacion."
    },
    {
      clue: "Actividad que fortalece la mente con practica constante",
      letters: ["E", "S", "T", "I", "M", "U", "L", "A", "C", "I", "O", "N"],
      answer: "Estimulacion",
      hint: "Empieza con esti."
    }
  ]
};

window.PalabraOculta = {
  getExercise(difficulty, index) {
    const list = window.PALABRA_OCULTA_DATA[difficulty] || [];
    return list[index % list.length];
  },

  getCount(difficulty) {
    const list = window.PALABRA_OCULTA_DATA[difficulty] || [];
    return list.length;
  },

  getHint(exercise) {
    return exercise.hint;
  },

  getSpeechText(exercise, instructions) {
    return `${instructions} La pista es: ${exercise.clue}. Las letras disponibles son: ${exercise.letters.join(", ")}.`;
  },

  render(container, exercise) {
    // Mezcla aleatoria (Fisher-Yates) para que las letras no salgan en orden
    const shuffled = [...exercise.letters];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const letters = shuffled
      .map((letter) => `<span class="letter-chip">${letter}</span>`)
      .join("");

    container.innerHTML = `
      <div class="hint-box">
        <strong>Pista</strong>
        <p>${exercise.clue}</p>
      </div>
      <div class="letters-box">
        <strong>Letras disponibles</strong>
        <div class="letters-list">${letters}</div>
      </div>
      <div class="field-group">
        <label for="word-answer">Escriba la palabra correcta</label>
        <input id="word-answer" data-voice-target="true" type="text" autocomplete="off" placeholder="Escriba aqui la palabra">
      </div>
    `;
  },

  validate() {
    const input = document.getElementById("word-answer");
    const normalize = (text) => text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const expected = normalize(window.appState.currentExercise.answer);
    const actual = normalize(input ? input.value : "");
    const correct = expected === actual;

    return {
      correct,
      message: correct
        ? "Muy bien. Respuesta correcta."
        : "Respuesta incorrecta. Intentelo nuevamente."
    };
  },

  instructions(difficulty) {
    const texts = {
      facil: "Lea la pista, mire las letras y escriba la palabra correcta.",
      medio: "Use la pista y ordene mentalmente las letras para descubrir la palabra.",
      dificil: "Lea con atencion la pista y escriba la palabra completa sin apuro."
    };
    return texts[difficulty];
  }
};
