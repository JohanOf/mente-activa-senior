window.SECUENCIA_PALABRAS_DATA = {
  facil: [
    {
      sequence: ["sol", "casa", "flor"],
      answer: "sol casa flor",
      hint: "Recuerde la primera palabra: sol."
    },
    {
      sequence: ["mesa", "pan", "luna"],
      answer: "mesa pan luna",
      hint: "La ultima palabra es luna."
    }
  ],
  medio: [
    {
      sequence: ["puerta", "reloj", "naranja", "tren"],
      answer: "puerta reloj naranja tren",
      hint: "Las dos palabras del centro son reloj y naranja."
    },
    {
      sequence: ["playa", "doctor", "libro", "verde"],
      answer: "playa doctor libro verde",
      hint: "Empieza con playa y termina con verde."
    }
  ],
  dificil: [
    {
      sequence: ["montana", "cuchara", "ventana", "camino", "jardin"],
      answer: "montana cuchara ventana camino jardin",
      hint: "La tercera palabra es ventana."
    },
    {
      sequence: ["familia", "mercado", "abrigo", "musica", "estrella"],
      answer: "familia mercado abrigo musica estrella",
      hint: "La secuencia termina con musica y estrella."
    }
  ]
};

window.SecuenciaPalabras = {
  getExercise(difficulty, index) {
    const list = window.SECUENCIA_PALABRAS_DATA[difficulty] || [];
    return list[index % list.length];
  },

  getCount(difficulty) {
    const list = window.SECUENCIA_PALABRAS_DATA[difficulty] || [];
    return list.length;
  },

  getHint(exercise) {
    return exercise.hint;
  },

  getSpeechText(exercise, instructions) {
    return `${instructions} Escuche esta secuencia. ${exercise.sequence.join(", ")}. Puede repetirla en el mismo orden.`;
  },

  render(container, exercise) {
    const chips = exercise.sequence.map((word) => `<span class="sequence-chip">${word}</span>`).join("");

    container.innerHTML = `
      <div class="sequence-box">
        <strong>Secuencia a recordar</strong>
        <div class="sequence-list">${chips}</div>
      </div>
      <div class="field-group">
        <label for="sequence-answer">Escriba la secuencia en el mismo orden</label>
        <input id="sequence-answer" data-voice-target="true" type="text" autocomplete="off" placeholder="Ejemplo: sol casa flor">
      </div>
      <p class="screen-reader-note">Puede separar las palabras con espacios.</p>
    `;
  },

  validate() {
    const input = document.getElementById("sequence-answer");
    const normalize = (text) => text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
    const correct = normalize(input ? input.value : "") === normalize(window.appState.currentExercise.answer);

    return {
      correct,
      message: correct
        ? "Excelente memoria. Recordo la secuencia completa."
        : "El orden no es correcto. Revise la secuencia e intentelo otra vez."
    };
  },

  instructions(difficulty) {
    const texts = {
      facil: "Lea las palabras y escribalas en el mismo orden.",
      medio: "Observe la secuencia con calma y repitala exactamente igual.",
      dificil: "Recuerde todas las palabras y escribalas en el mismo orden mostrado."
    };
    return texts[difficulty];
  }
};
