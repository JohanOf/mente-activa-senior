(function () {
  const activities = {
    frase: {
      label: "Frase invertida",
      engine: window.FraseInvertida
    },
    cuadrado: {
      label: "Cuadrado mágico",
      engine: window.CuadradoMagico
    },
    palabra: {
      label: "Palabra oculta",
      engine: window.PalabraOculta
    },
    secuencia: {
      label: "Secuencia de palabras",
      engine: window.SecuenciaPalabras
    },
    categoria: {
      label: "Relación por categoría",
      engine: window.RelacionCategoria
    },
    refran: {
      label: "Refrán incompleto",
      engine: window.RefranIncompleto
    },
    conteo: {
      label: "Conteo mental",
      engine: window.ConteoMental
    }
  };

  const cognitiveSkills = {
    frase: "Memoria de trabajo",
    cuadrado: "Lógica y cálculo",
    palabra: "Lenguaje y vocabulario",
    secuencia: "Memoria de secuencia",
    categoria: "Semántica y categorización",
    refran: "Memoria a largo plazo",
    conteo: "Atención y concentración"
  };

  const difficultyLabels = {
    facil: "Fácil",
    medio: "Medio",
    dificil: "Difícil"
  };

  window.appState = {
    score: 0,
    selectedDifficulty: "facil",
    currentActivity: null,
    currentIndexByKey: {
      frase: 0,
      cuadrado: 0,
      palabra: 0,
      secuencia: 0,
      categoria: 0,
      refran: 0,
      conteo: 0
    },
    currentExerciseIndex: 0,
    awardedExercises: {},
    currentExercise: null
  };

  const screens = {
    home: document.getElementById("home-screen"),
    menu: document.getElementById("menu-screen"),
    activity: document.getElementById("activity-screen")
  };

  const elements = {
    scoreValue: document.getElementById("score-value"),
    startButton: document.getElementById("start-button"),
    difficultyButtons: document.querySelectorAll(".difficulty-button"),
    menuButtons: document.querySelectorAll(".menu-button"),
    activityTitle: document.getElementById("activity-title-current"),
    activityTag: document.getElementById("activity-tag"),
    difficultyBadge: document.getElementById("difficulty-badge"),
    instructions: document.getElementById("activity-instructions"),
    activityContent: document.getElementById("activity-content"),
    feedback: document.getElementById("feedback"),
    hintBox: document.getElementById("hint-box"),
    checkButton: document.getElementById("check-button"),
    repeatButton: document.getElementById("repeat-button"),
    switchButton: document.getElementById("switch-button"),
    menuButton: document.getElementById("menu-button"),
    hintButton: document.getElementById("hint-button"),
    speakButton: document.getElementById("speak-button"),
    stopSpeechButton: document.getElementById("stop-speech-button"),
    dictationButton: document.getElementById("dictation-button"),
    themeToggle: document.getElementById("theme-toggle")
  };

  let speechRecognition = null;
  let availableVoices = [];

  function updateThemeButton() {
    if (!elements.themeToggle) {
      return;
    }

    const isDark = document.documentElement.classList.contains("dark-theme");
    elements.themeToggle.setAttribute("aria-pressed", String(isDark));
    elements.themeToggle.setAttribute("aria-label", isDark ? "Activar tema claro" : "Activar tema oscuro");
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      return;
    }
  }

  function initTheme() {
    const savedTheme = getSavedTheme() || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
    updateThemeButton();
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark-theme");
    if (isDark) {
      document.documentElement.classList.remove("dark-theme");
      saveTheme("light");
    } else {
      document.documentElement.classList.add("dark-theme");
      saveTheme("dark");
    }
    updateThemeButton();
  }

  function triggerConfetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let container = document.querySelector(".confetti-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "confetti-container";
      document.body.appendChild(container);
    }

    const colors = [
      "#38bdf8", // Sky blue
      "#34d399", // Emerald
      "#fbbf24", // Amber
      "#f87171", // Red
      "#a78bfa", // Purple
      "#fb7185", // Rose
      "#2dd4bf"  // Teal
    ];

    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "confetti-particle";
      
      const startX = Math.random() * 100;
      particle.style.left = `${startX}vw`;
      particle.style.top = "-20px";
      
      const size = Math.random() * 8 + 6;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      const shapeType = Math.random();
      if (shapeType < 0.4) {
        particle.style.borderRadius = "50%";
      } else if (shapeType < 0.7) {
        particle.style.borderRadius = "3px";
      } else {
        particle.style.borderRadius = "0";
      }
      
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      const fallDuration = Math.random() * 1.5 + 1.5;
      particle.style.animationDuration = `${fallDuration}s`;
      
      const drift = (Math.random() * 60 - 30);
      particle.style.transform = `translateX(${drift}px)`;
      
      container.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, fallDuration * 1000);
    }
  }

  function showScreen(name, moveFocus = true) {
    Object.entries(screens).forEach(([screenName, screen]) => {
      const isActive = screenName === name;
      screen.classList.toggle("active", isActive);
      screen.hidden = !isActive;
    });

    if (moveFocus) {
      screens[name].focus({ preventScroll: true });
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      window.scrollTo({ top: 0, behavior });
    }
  }

  function updateScore(animate) {
    elements.scoreValue.textContent = `${window.appState.score} puntos`;
    if (animate) {
      elements.scoreValue.classList.remove("score-pulse");
      void elements.scoreValue.offsetWidth; // Force reflow
      elements.scoreValue.classList.add("score-pulse");
    }
  }

  function clearFeedback() {
    elements.feedback.className = "feedback";
    elements.feedback.textContent = "";
  }

  function clearHint() {
    elements.hintBox.className = "hint-panel";
    elements.hintBox.textContent = "";
  }

  function showFeedback(message, type) {
    elements.feedback.className = `feedback show ${type}`;
    elements.feedback.textContent = message;
  }

  function loadVoices() {
    if (!("speechSynthesis" in window)) {
      return;
    }

    availableVoices = window.speechSynthesis.getVoices();
  }

  function getPreferredVoice() {
    if (!availableVoices.length) {
      return null;
    }

    const spanishByName = availableVoices.find((voice) => {
      const name = (voice.name || "").toLowerCase();
      return name.includes("spanish") || name.includes("espanol") || name.includes("español");
    });

    return availableVoices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith("es"))
      || spanishByName
      || availableVoices[0];
  }

  function getExerciseKey() {
    return `${window.appState.currentActivity}-${window.appState.selectedDifficulty}-${window.appState.currentExerciseIndex}`;
  }

  function loadActivity(activityKey, keepIndex) {
    const activity = activities[activityKey];
    const totalExercises = activity.engine.getCount(window.appState.selectedDifficulty);
    let exerciseIndex = window.appState.currentIndexByKey[activityKey];

    stopSpeech();

    // Si el usuario no repite, se avanza al siguiente ejercicio disponible.
    if (keepIndex) {
      exerciseIndex = window.appState.currentExerciseIndex;
    } else if (totalExercises > 0) {
      window.appState.currentIndexByKey[activityKey] = (exerciseIndex + 1) % totalExercises;
    }

    window.appState.currentActivity = activityKey;
    window.appState.currentExerciseIndex = exerciseIndex;
    window.appState.currentExercise = activity.engine.getExercise(
      window.appState.selectedDifficulty,
      exerciseIndex
    );
    delete elements.activityContent.dataset.selectedOption;

    elements.activityTitle.textContent = activity.label;
    elements.activityTag.textContent = `Área: ${cognitiveSkills[activityKey]}`;
    elements.difficultyBadge.textContent = `Nivel: ${capitalize(window.appState.selectedDifficulty)}`;
    elements.instructions.textContent = activity.engine.instructions(window.appState.selectedDifficulty);
    activity.engine.render(elements.activityContent, window.appState.currentExercise);
    clearFeedback();
    clearHint();
    updateDictationAvailability();
    showScreen("activity");

    if ("speechSynthesis" in window) {
      window.setTimeout(speakCurrentActivity, 180);
    }
  }

  function showHint() {
    const activity = activities[window.appState.currentActivity];
    const hint = activity.engine.getHint
      ? activity.engine.getHint(window.appState.currentExercise)
      : "Tome su tiempo y lea nuevamente el ejercicio.";

    elements.hintBox.className = "hint-panel show";
    elements.hintBox.textContent = `Pista: ${hint}`;
  }

  function stopSpeech() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (elements.speakButton) {
      elements.speakButton.classList.remove("speaking");
    }
  }

  function speakCurrentActivity() {
    const activity = activities[window.appState.currentActivity];
    if (!activity || !("speechSynthesis" in window)) {
      showFeedback("La lectura por voz no está disponible en este navegador.", "error");
      return;
    }

    stopSpeech();

    const message = activity.engine.getSpeechText
      ? activity.engine.getSpeechText(window.appState.currentExercise, elements.instructions.textContent)
      : elements.instructions.textContent;

    loadVoices();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    const preferredVoice = getPreferredVoice();
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    }

    utterance.onstart = function () {
      showFeedback("Leyendo la actividad en voz alta.", "success");
      elements.speakButton.classList.add("speaking");
    };

    utterance.onend = function () {
      elements.speakButton.classList.remove("speaking");
    };

    utterance.onerror = function () {
      showFeedback("No se pudo reproducir la voz en este navegador.", "error");
      elements.speakButton.classList.remove("speaking");
    };

    window.speechSynthesis.resume();
    window.setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 120);
  }

  function updateDictationAvailability() {
    const target = document.querySelector("[data-voice-target='true']");
    const supported = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
    elements.dictationButton.disabled = !(target && supported);
  }

  function startDictation() {
    const target = document.querySelector("[data-voice-target='true']");
    const RecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!target || !RecognitionApi) {
      showFeedback("El dictado por voz no está disponible para esta actividad o navegador.", "error");
      return;
    }

    if (speechRecognition) {
      speechRecognition.stop();
    }

    speechRecognition = new RecognitionApi();
    speechRecognition.lang = "es-ES";
    speechRecognition.interimResults = false;
    speechRecognition.maxAlternatives = 1;

    speechRecognition.onstart = function () {
      showFeedback("Escuchando su respuesta. Hable con calma.", "success");
    };

    speechRecognition.onresult = function (event) {
      target.value = event.results[0][0].transcript;
      showFeedback("Respuesta dictada correctamente. Revise el texto y valide.", "success");
    };

    speechRecognition.onerror = function () {
      showFeedback("No fue posible completar el dictado por voz.", "error");
    };

    speechRecognition.start();
  }

  function capitalize(text) {
    return difficultyLabels[text] || text.charAt(0).toUpperCase() + text.slice(1);
  }

  function changeDifficulty(newDifficulty) {
    window.appState.selectedDifficulty = newDifficulty;
    elements.difficultyButtons.forEach((button) => {
      const isSelected = button.dataset.difficulty === newDifficulty;
      button.classList.toggle("selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });
  }

  function scoreForDifficulty(difficulty) {
    const values = {
      facil: 10,
      medio: 20,
      dificil: 30
    };
    return values[difficulty];
  }

  function validateCurrentActivity() {
    const activity = activities[window.appState.currentActivity];
    const result = activity.engine.validate();
    const exerciseKey = getExerciseKey();

    // Cada ejercicio suma puntos solo una vez aunque se valide varias veces.
    if (result.correct && !window.appState.awardedExercises[exerciseKey]) {
      window.appState.score += scoreForDifficulty(window.appState.selectedDifficulty);
      window.appState.awardedExercises[exerciseKey] = true;
      updateScore(true);
      triggerConfetti();
    }

    showFeedback(result.message, result.correct ? "success" : "error");
  }

  function bindEvents() {
    elements.startButton.addEventListener("click", () => {
      stopSpeech();
      showScreen("menu");
    });

    elements.difficultyButtons.forEach((button) => {
      button.addEventListener("click", () => changeDifficulty(button.dataset.difficulty));
    });

    elements.menuButtons.forEach((button) => {
      button.addEventListener("click", () => {
        loadActivity(button.dataset.activity, false);
      });
    });

    elements.checkButton.addEventListener("click", validateCurrentActivity);
    elements.repeatButton.addEventListener("click", () => loadActivity(window.appState.currentActivity, true));
    elements.switchButton.addEventListener("click", () => {
      stopSpeech();
      showScreen("menu");
    });
    elements.menuButton.addEventListener("click", () => {
      stopSpeech();
      showScreen("menu");
    });
    elements.hintButton.addEventListener("click", showHint);
    elements.speakButton.addEventListener("click", speakCurrentActivity);
    elements.stopSpeechButton.addEventListener("click", stopSpeech);
    elements.dictationButton.addEventListener("click", startDictation);
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener("click", toggleTheme);
    }
  }

  if ("speechSynthesis" in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  initTheme();
  bindEvents();
  updateScore();
  changeDifficulty("facil");
  showScreen("home", false);
}());
