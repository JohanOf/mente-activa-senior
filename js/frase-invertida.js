window.FRASE_INVERTIDA_DATA = {
  facil: [
    {
      displayed: "ODNUM ALOH",
      answer: "Hola mundo",
      hint: "Empieza con la palabra hola."
    },
    {
      displayed: "ODREUCER NU SE AIROMEM AL",
      answer: "La memoria es un recuerdo",
      hint: "La frase comienza con la memoria."
    }
  ],
  medio: [
    {
      displayed: "ETNEM AL ECELATROF ACITCARP AL",
      answer: "La practica fortalece la mente",
      hint: "La frase termina con la mente."
    },
    {
      displayed: "SODREUCER SOL ADRAUG AROMEM AL",
      answer: "La memoria guarda los recuerdos",
      hint: "Tiene relacion con recuerdos."
    }
  ],
  dificil: [
    {
      displayed: "SAROGATIP OREMUN LE SE SAEDI SAL Y ODNUM LE ANREIBOG EUQ OL",
      answer: "Lo que gobierna el mundo y las ideas es el numero Pitagoras",
      hint: "Es una cita atribuida a Pitagoras."
    },
    {
      displayed: "AID A OTNEIMANERTNE NOC ECELATROF ES ETNEM AL",
      answer: "La mente se fortalece con entrenamiento dia a dia",
      hint: "Incluye la expresion dia a dia."
    }
  ]
};

window.FraseInvertida = {
  getExercise(difficulty, index) {
    const list = window.FRASE_INVERTIDA_DATA[difficulty] || [];
    return list[index % list.length];
  },

  getCount(difficulty) {
    const list = window.FRASE_INVERTIDA_DATA[difficulty] || [];
    return list.length;
  },

  getHint(exercise) {
    return exercise.hint;
  },

  getSpeechText(exercise, instructions) {
    return `${instructions} El texto mostrado es: ${exercise.displayed}.`;
  },

  render(container, exercise) {
    container.innerHTML = `
      <div class="phrase-display">
        <strong>Texto mostrado</strong>
        <p>${exercise.displayed}</p>
      </div>
      <div class="field-group">
        <label for="phrase-answer">Escriba la frase correcta</label>
        <input id="phrase-answer" data-voice-target="true" type="text" autocomplete="off" placeholder="Escriba aqui su respuesta">
      </div>
      <p class="support-text">La validacion ignora mayusculas, minusculas y acentos.</p>
    `;
  },

  validate() {
    const input = document.getElementById("phrase-answer");
    const userAnswer = input ? input.value : "";
    const expected = window.appState.currentExercise.answer;
    const normalize = (text) => text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ");

    return {
      correct: normalize(userAnswer) === normalize(expected),
      message: normalize(userAnswer) === normalize(expected)
        ? "Respuesta correcta. Excelente memoria."
        : "Respuesta incorrecta. Intentelo nuevamente."
    };
  },

  instructions(difficulty) {
    const texts = {
      facil: "Lea la frase al reves y escribala en el orden correcto.",
      medio: "Observe con calma la frase invertida y escriba la version correcta.",
      dificil: "Analice la frase completa, ordenela mentalmente y escriba la respuesta correcta."
    };
    return texts[difficulty];
  }
};
