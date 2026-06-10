(function () {
  window.onerror = function (message, source, lineno, colno, error) {
    alert("Error de ejecución: " + message + "\nEn: " + source + " (Línea: " + lineno + ")");
    return false;
  };

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

  const gameLevels = [
    { key: "level_1", name: "Nivel 1: Muy Fácil", difficulty: "facil", exerciseIndex: 0, icon: "🌱", points: 10, timeThresholds: { threeStars: 25, twoStars: 50 } },
    { key: "level_2", name: "Nivel 2: Fácil", difficulty: "facil", exerciseIndex: 1, icon: "☘️", points: 15, timeThresholds: { threeStars: 35, twoStars: 70 } },
    { key: "level_3", name: "Nivel 3: Medio", difficulty: "medio", exerciseIndex: 0, icon: "⚡", points: 20, timeThresholds: { threeStars: 45, twoStars: 90 } },
    { key: "level_4", name: "Nivel 4: Difícil", difficulty: "dificil", exerciseIndex: 0, icon: "🔥", points: 25, timeThresholds: { threeStars: 70, twoStars: 140 } },
    { key: "level_5", name: "Nivel 5: Experto", difficulty: "dificil", exerciseIndex: 1, icon: "🏆", points: 30, timeThresholds: { threeStars: 90, twoStars: 180 } }
  ];

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
    currentExercise: null,
    
    // Nuevas variables de estado
    timerInterval: null,
    levelStartTime: null,
    levelTimeElapsed: 0,
    levelScore: 0,
    levelTotalExercises: 0,
    
    // Nombre y nivel seleccionado
    userName: "",
    selectedLevelKey: ""
  };

  const screens = {
    home: document.getElementById("home-screen"),
    name: document.getElementById("name-screen"),
    menu: document.getElementById("menu-screen"),
    levelSelection: document.getElementById("level-selection-screen"),
    levelComplete: document.getElementById("level-complete-screen"),
    activity: document.getElementById("activity-screen")
  };

  const elements = {
    scoreValue: document.getElementById("score-value"),
    startButton: document.getElementById("start-button"),
    menuButtons: document.querySelectorAll(".menu-button"),
    activityTitle: document.getElementById("activity-title-current"),
    activityTag: document.getElementById("activity-tag"),
    difficultyBadge: document.getElementById("difficulty-badge"),
    instructions: document.getElementById("activity-instructions"),
    activityContent: document.getElementById("activity-content"),
    feedback: document.getElementById("feedback"),
    hintBox: document.getElementById("hint-box"),
    checkButton: document.getElementById("check-button"),
    nextExerciseButton: document.getElementById("next-exercise-button"),
    nextExerciseText: document.getElementById("next-exercise-text"),
    repeatButton: document.getElementById("repeat-button"),
    switchButton: document.getElementById("switch-button"),
    menuButton: document.getElementById("menu-button"),
    hintButton: document.getElementById("hint-button"),
    speakButton: document.getElementById("speak-button"),
    stopSpeechButton: document.getElementById("stop-speech-button"),
    dictationButton: document.getElementById("dictation-button"),
    themeToggle: document.getElementById("theme-toggle"),
    
    // Nuevos elementos
    levelSelTitle: document.getElementById("level-sel-title"),
    levelSelDescription: document.getElementById("level-sel-description"),
    levelsPathGrid: document.getElementById("levels-path-grid"),
    levelBackButton: document.getElementById("level-back-button"),
    resetProgressButton: document.getElementById("reset-progress-button"),
    timerValue: document.getElementById("timer-value"),
    progressValue: document.getElementById("progress-value"),
    completeTime: document.getElementById("complete-time"),
    completeScore: document.getElementById("complete-score"),
    completeNextBtn: document.getElementById("complete-next-btn"),
    completeRetryBtn: document.getElementById("complete-retry-btn"),
    completeLevelsBtn: document.getElementById("complete-levels-btn"),
    completeMenuBtn: document.getElementById("complete-menu-btn"),
    starsDisplay: document.getElementById("stars-display"),
    completeTitle: document.getElementById("complete-title"),
    completeSubtitle: document.getElementById("complete-subtitle"),
    scoreLabel: document.getElementById("score-label"),
    
    // Elementos de nombre
    usernameInput: document.getElementById("username-input"),
    saveNameButton: document.getElementById("save-name-button"),
    welcomeUserText: document.getElementById("welcome-user-text"),
    brandTagline: document.getElementById("brand-tagline")
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
    const name = window.appState.userName;
    if (name && elements.scoreLabel) {
      elements.scoreLabel.textContent = `PUNTOS DE ${name.toUpperCase()}`;
    } else if (elements.scoreLabel) {
      elements.scoreLabel.textContent = "PUNTAJE ACTUAL";
    }
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

  // Native audio feedback using Web Audio API
  let audioCtx = null;
  function playSound(frequencies, type = "sine", duration = 0.1, delay = 0) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = type;
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      const startTime = audioCtx.currentTime + delay;
      osc.start(startTime);
      
      if (Array.isArray(frequencies)) {
        frequencies.forEach((freqStep) => {
          osc.frequency.setValueAtTime(freqStep.freq, startTime + freqStep.time);
        });
      } else {
        osc.frequency.setValueAtTime(frequencies, startTime);
      }
      
      gainNode.gain.setValueAtTime(0.12, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  function playCorrectSound() {
    playSound([
      { freq: 523.25, time: 0 },   // C5
      { freq: 659.25, time: 0.08 } // E5
    ], "sine", 0.25);
  }

  function playIncorrectSound() {
    playSound([
      { freq: 220.00, time: 0 },   // A3
      { freq: 174.61, time: 0.1 }  // F3
    ], "triangle", 0.3);
  }

  function playVictorySound() {
    const tempo = 0.12;
    playSound(523.25, "sine", 0.12, 0);          // C5
    playSound(659.25, "sine", 0.12, tempo);       // E5
    playSound(783.99, "sine", 0.12, tempo * 2);   // G5
    playSound(1046.50, "sine", 0.35, tempo * 3);  // C6
  }

  // Progreso y persistencia (localStorage)
  function getProgress() {
    try {
      const data = localStorage.getItem("mente_activa_progress");
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(activityKey, levelKey, timeElapsed) {
    try {
      const progress = getProgress();
      if (!progress[activityKey]) {
        progress[activityKey] = {};
      }
      
      const levelProgress = progress[activityKey][levelKey] || { completed: false, bestTime: null };
      levelProgress.completed = true;
      if (levelProgress.bestTime === null || timeElapsed < levelProgress.bestTime) {
        levelProgress.bestTime = timeElapsed;
      }
      
      progress[activityKey][levelKey] = levelProgress;
      localStorage.setItem("mente_activa_progress", JSON.stringify(progress));
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  }

  function resetProgress() {
    try {
      localStorage.removeItem("mente_activa_progress");
      localStorage.removeItem("mente_activa_username");
      window.appState.userName = "";
      window.appState.score = 0;
      updateScore(true);
      
      elements.welcomeUserText.style.display = "none";
      elements.brandTagline.style.display = "inline";
      elements.usernameInput.value = "";
      
      if (window.appState.currentActivity) {
        showLevelSelection(window.appState.currentActivity);
      } else {
        showScreen("home");
      }
      playIncorrectSound();
    } catch (e) {
      console.error(e);
    }
  }

  function initUser() {
    try {
      const savedName = localStorage.getItem("mente_activa_username");
      if (savedName) {
        window.appState.userName = savedName;
        elements.welcomeUserText.textContent = `👋 ¡Hola, ${savedName}!`;
        elements.welcomeUserText.style.display = "inline";
        elements.brandTagline.style.display = "none";
      }
    } catch (e) {
      console.error(e);
    }
  }

  function formatTime(seconds) {
    if (seconds === null || seconds === undefined || isNaN(seconds) || seconds < 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function startTimer() {
    stopTimer();
    window.appState.levelStartTime = Date.now();
    window.appState.timerInterval = setInterval(() => {
      window.appState.levelTimeElapsed = Math.floor((Date.now() - window.appState.levelStartTime) / 1000);
      elements.timerValue.textContent = formatTime(window.appState.levelTimeElapsed);
    }, 1000);
    elements.timerValue.textContent = "00:00";
  }

  function stopTimer() {
    if (window.appState.timerInterval) {
      clearInterval(window.appState.timerInterval);
      window.appState.timerInterval = null;
    }
  }

  // Navegación y flujo
  function showLevelSelection(activityKey) {
    stopSpeech();
    window.appState.currentActivity = activityKey;
    const activity = activities[activityKey];
    
    elements.levelSelTitle.textContent = activity.label;
    
    const nameStr = window.appState.userName ? `${window.appState.userName}, entrena` : "Entrena";
    elements.levelSelDescription.textContent = `¡Hola! ${nameStr} tus habilidades de "${cognitiveSkills[activityKey]}". Completa los niveles secuencialmente para desbloquear los desafíos de este juego.`;
    
    const progress = getProgress();
    const actProgress = progress[activityKey] || {};
    
    elements.levelsPathGrid.innerHTML = "";
    
    let previousCompleted = true; // El nivel 1 siempre está desbloqueado
    
    gameLevels.forEach((lvl) => {
      const lvlProgress = actProgress[lvl.key] || { completed: false, bestTime: null };
      
      const cardBtn = document.createElement("button");
      cardBtn.type = "button";
      
      let badgeText = "🔒 Bloqueado";
      let badgeClass = "level-status-badge locked";
      let isLocked = true;
      let timeText = "Mejor tiempo: --";
      
      if (previousCompleted) {
        isLocked = false;
        if (lvlProgress.completed) {
          badgeText = "✅ Completado";
          badgeClass = "level-status-badge completed";
          timeText = `Mejor tiempo: ${formatTime(lvlProgress.bestTime)}`;
        } else {
          badgeText = "🔓 Disponible";
          badgeClass = "level-status-badge unlocked";
        }
      }
      
      cardBtn.className = `level-card-btn ${isLocked ? 'locked' : 'unlocked'}`;
      cardBtn.disabled = isLocked;
      cardBtn.setAttribute("aria-disabled", isLocked ? "true" : "false");
      
      cardBtn.innerHTML = `
        <div class="level-card-icon">${lvl.icon}</div>
        <div class="level-card-info">
          <span class="level-name">${lvl.name}</span>
          <span class="${badgeClass}">${badgeText}</span>
          <span class="level-best-time">${timeText}</span>
        </div>
      `;
      
      if (!isLocked) {
        cardBtn.addEventListener("click", () => {
          startLevel(activityKey, lvl.key);
        });
      }
      
      elements.levelsPathGrid.appendChild(cardBtn);
      
      previousCompleted = lvlProgress.completed;
    });
    
    showScreen("levelSelection");
  }

  function startLevel(activityKey, levelKey) {
    stopSpeech();
    window.appState.currentActivity = activityKey;
    window.appState.selectedLevelKey = levelKey;
    
    const lvlConfig = gameLevels.find(l => l.key === levelKey);
    window.appState.selectedDifficulty = lvlConfig.difficulty;
    window.appState.currentExerciseIndex = lvlConfig.exerciseIndex;
    
    window.appState.levelScore = 0;
    window.appState.levelTimeElapsed = 0;
    window.appState.levelTotalExercises = 1; // 1 ejercicio por nivel en esta progresión
    
    loadExercise(activityKey, lvlConfig.difficulty, lvlConfig.exerciseIndex);
    startTimer();
    showScreen("activity");
  }

  function loadExercise(activityKey, level, index) {
    const activity = activities[activityKey];
    window.appState.currentExerciseIndex = index;
    window.appState.currentExercise = activity.engine.getExercise(level, index);
    delete elements.activityContent.dataset.selectedOption;

    const lvlConfig = gameLevels.find(l => l.key === window.appState.selectedLevelKey);

    elements.activityTitle.textContent = activity.label;
    elements.activityTag.textContent = `Área: ${cognitiveSkills[activityKey]}`;
    elements.difficultyBadge.textContent = lvlConfig.name;
    elements.instructions.textContent = activity.engine.instructions(level);
    
    // Indicador de progreso
    elements.progressValue.textContent = lvlConfig.name;
    
    activity.engine.render(elements.activityContent, window.appState.currentExercise);
    clearFeedback();
    clearHint();
    updateDictationAvailability();
    
    // Restablecer visibilidad de botones
    elements.checkButton.hidden = false;
    elements.nextExerciseButton.hidden = true;
    
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

    if (result.correct) {
      playCorrectSound();
      
      const lvlConfig = gameLevels.find(l => l.key === window.appState.selectedLevelKey);
      const points = lvlConfig.points;
      
      if (!window.appState.awardedExercises[exerciseKey]) {
        window.appState.score += points;
        window.appState.levelScore += points;
        window.appState.awardedExercises[exerciseKey] = true;
        updateScore(true);
      }
      
      triggerConfetti();
      
      // Cambiar botones
      elements.checkButton.hidden = true;
      elements.nextExerciseButton.hidden = false;
      elements.nextExerciseText.textContent = "Finalizar nivel";
    } else {
      playIncorrectSound();
    }

    showFeedback(result.message, result.correct ? "success" : "error");
  }

  function handleNextExerciseClick() {
    // Como cada nivel tiene solo 1 ejercicio, finalizar directamente
    finishLevel();
  }

  function finishLevel() {
    stopTimer();
    stopSpeech();
    
    const timeElapsed = window.appState.levelTimeElapsed;
    const scoreEarned = window.appState.levelScore;
    const activityKey = window.appState.currentActivity;
    const levelKey = window.appState.selectedLevelKey;
    
    // Guardar progreso y mejor tiempo
    saveProgress(activityKey, levelKey, timeElapsed);
    
    // Sonido de victoria
    playVictorySound();
    
    // Rellenar pantalla de fin de juego
    elements.completeTime.textContent = formatTime(timeElapsed);
    elements.completeScore.textContent = `+${scoreEarned} puntos`;
    
    const name = window.appState.userName || "Jugador";
    if (elements.completeTitle) {
      elements.completeTitle.textContent = `¡Excelente trabajo, ${name}!`;
    }
    if (elements.completeSubtitle) {
      elements.completeSubtitle.textContent = `¡${name} obtuvo +${scoreEarned} puntos en este nivel!`;
    }
    
    // Estrellas según velocidad específica del nivel
    const lvlConfig = gameLevels.find(l => l.key === levelKey);
    let stars = 1;
    if (timeElapsed <= lvlConfig.timeThresholds.threeStars) {
      stars = 3;
    } else if (timeElapsed <= lvlConfig.timeThresholds.twoStars) {
      stars = 2;
    }
    
    // Renderizado animado de estrellas
    elements.starsDisplay.innerHTML = "";
    for (let i = 1; i <= 3; i++) {
      const star = document.createElement("span");
      star.className = "star-item";
      star.textContent = "★";
      if (i <= stars) {
        star.classList.add("gold");
      }
      elements.starsDisplay.appendChild(star);
      
      // Retrasar animación
      setTimeout(() => {
        star.classList.add("reveal");
      }, i * 200);
    }
    
    // Configurar botón Siguiente Nivel
    const currentIdx = gameLevels.findIndex(l => l.key === levelKey);
    const nextLvl = gameLevels[currentIdx + 1];
    
    if (nextLvl) {
      elements.completeNextBtn.hidden = false;
      elements.completeNextBtn.querySelector("span").textContent = `Siguiente: ${nextLvl.name}`;
    } else {
      elements.completeNextBtn.hidden = true;
    }
    
    showScreen("levelComplete");
  }

  function bindEvents() {
    elements.startButton.addEventListener("click", () => {
      stopSpeech();
      if (window.appState.userName) {
        showScreen("menu");
      } else {
        showScreen("name");
      }
    });

    elements.saveNameButton.addEventListener("click", () => {
      const name = elements.usernameInput.value.trim() || "Jugador";
      window.appState.userName = name;
      localStorage.setItem("mente_activa_username", name);
      
      elements.welcomeUserText.textContent = `👋 ¡Hola, ${name}!`;
      elements.welcomeUserText.style.display = "inline";
      elements.brandTagline.style.display = "none";
      
      updateScore(true);
      playCorrectSound();
      showScreen("menu");
    });

    elements.menuButtons.forEach((button) => {
      button.addEventListener("click", () => {
        showLevelSelection(button.dataset.activity);
      });
    });

    elements.levelBackButton.addEventListener("click", () => {
      stopSpeech();
      showScreen("menu");
    });
    
    elements.resetProgressButton.addEventListener("click", () => {
      if (confirm("¿Está seguro de que desea reiniciar todo su progreso, nombre y mejores tiempos?")) {
        resetProgress();
      }
    });

    elements.checkButton.addEventListener("click", validateCurrentActivity);
    elements.nextExerciseButton.addEventListener("click", handleNextExerciseClick);
    
    elements.repeatButton.addEventListener("click", () => {
      stopSpeech();
      const lvlConfig = gameLevels.find(l => l.key === window.appState.selectedLevelKey);
      loadExercise(window.appState.currentActivity, window.appState.selectedDifficulty, lvlConfig.exerciseIndex);
    });
    
    elements.switchButton.addEventListener("click", () => {
      stopTimer();
      stopSpeech();
      showLevelSelection(window.appState.currentActivity);
    });
    
    elements.menuButton.addEventListener("click", () => {
      stopTimer();
      stopSpeech();
      showScreen("menu");
    });
    
    elements.hintButton.addEventListener("click", showHint);
    elements.speakButton.addEventListener("click", speakCurrentActivity);
    elements.stopSpeechButton.addEventListener("click", stopSpeech);
    elements.dictationButton.addEventListener("click", startDictation);
    
    // Botones de pantalla completada
    elements.completeNextBtn.addEventListener("click", () => {
      const currentIdx = gameLevels.findIndex(l => l.key === window.appState.selectedLevelKey);
      const nextLvl = gameLevels[currentIdx + 1];
      if (nextLvl) {
        startLevel(window.appState.currentActivity, nextLvl.key);
      }
    });
    elements.completeRetryBtn.addEventListener("click", () => {
      startLevel(window.appState.currentActivity, window.appState.selectedLevelKey);
    });
    elements.completeLevelsBtn.addEventListener("click", () => {
      showLevelSelection(window.appState.currentActivity);
    });
    elements.completeMenuBtn.addEventListener("click", () => {
      showScreen("menu");
    });

    if (elements.themeToggle) {
      elements.themeToggle.addEventListener("click", toggleTheme);
    }
  }

  if ("speechSynthesis" in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  initTheme();
  initUser();
  bindEvents();
  updateScore();
  showScreen("home", false);
}());
