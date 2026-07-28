/**
 * Módulo de Evaluaciones y Cuestionarios (js/quiz.js)
 * Implementa una simulación del entorno de cuestionarios de Moodle:
 * - Selección de tests en tarjetas.
 * - Pantalla de inicio de intento con historial histórico.
 * - Navegación secuencial y cuadrícula de preguntas sin respuestas inmediatas.
 * - Resumen del intento antes de enviar.
 * - Revisión detallada post-entrega con retroalimentación y notas.
 */

const CogepQuiz = {
  currentProcedure: 'ordinario',
  currentQuestionIndex: 0,
  viewState: 'menu', // 'menu', 'intro', 'quiz', 'summary', 'review'
  answers: [], // Array de 25 elementos con las elecciones del alumno (índices o null)
  flaggedQuestions: [], // Array de 25 elementos booleanos
  currentAttempt: null, // Guardará la fecha de inicio del intento activo
  selectedAttemptIndex: -1, // Índice del intento seleccionado para revisión

  init() {
    this.viewState = 'menu';
    this.render();
  },

  // Helper para dar formato de duración de tiempo
  formatDuration(startedAt, completedAt) {
    const diffMs = completedAt - startedAt;
    const diffSecs = Math.floor(diffMs / 1000);
    const mins = Math.floor(diffSecs / 60);
    const secs = diffSecs % 60;
    
    let result = "";
    if (mins > 0) {
      result += `${mins} minuto${mins !== 1 ? 's' : ''} `;
    }
    result += `${secs} segundo${secs !== 1 ? 's' : ''}`;
    return result;
  },

  render() {
    const container = document.getElementById("view-eval");
    if (!container) return;

    container.innerHTML = "";

    switch (this.viewState) {
      case 'menu':
        this.renderMenu(container);
        break;
      case 'intro':
        this.renderIntro(container);
        break;
      case 'quiz':
        this.renderQuiz(container);
        break;
      case 'summary':
        this.renderSummary(container);
        break;
      case 'review':
        this.renderReview(container);
        break;
    }
    
    // Auto-scroll al inicio del contenedor
    const mainContainer = document.getElementById("main-view-container");
    if (mainContainer) mainContainer.scrollTop = 0;
  },

  // 1. VISTA: MENÚ DE SELECCIÓN DE TEST (Tarjetas)
  renderMenu(container) {
    container.innerHTML = `
      <h2 class="section-title">Evaluación del Conocimiento COGEP</h2>
      <p style="margin-bottom: 2rem; color: var(--text-muted);">
        Selecciona uno de los procedimientos procesales del COGEP para medir tus conocimientos jurídicos.
      </p>
      
      <div class="quiz-menu-grid" id="quiz-menu-cards"></div>
    `;

    const menuGrid = container.querySelector("#quiz-menu-cards");

    // Recopilar los procedimientos y generar tarjetas
    COGEP_PROCEDURES.forEach(proc => {
      // Obtener calificación más alta guardada en localStorage
      const attempts = JSON.parse(localStorage.getItem(`cogep_quiz_attempts_${proc.id}`) || '[]');
      let highestGrade = "Sin intentos";
      if (attempts.length > 0) {
        const maxScore = Math.max(...attempts.map(a => a.percentage));
        highestGrade = `${maxScore.toFixed(2)}%`;
      }

      const card = document.createElement("div");
      card.className = "quiz-card-premium";
      card.innerHTML = `
        <div class="procedure-card-image">
          <img src="${proc.image}" alt="${proc.title}">
        </div>
        <div class="quiz-card-body">
          <h3>${proc.title}</h3>
          <p>${proc.description}</p>
          <div class="quiz-card-stats">
            <span>25 Preguntas</span>
            <span class="quiz-card-badge">Nota más alta: ${highestGrade}</span>
          </div>
          <button class="btn btn-primary btn-start-test" style="width: 100%;">Ver Cuestionario</button>
        </div>
      `;

      card.querySelector(".btn-start-test").addEventListener("click", () => {
        this.currentProcedure = proc.id;
        this.viewState = 'intro';
        this.render();
      });

      menuGrid.appendChild(card);
    });
  },

  // 2. VISTA: INTRODUCCIÓN E HISTORIAL DE INTENTOS
  renderIntro(container) {
    const quizData = COGEP_QUIZZES[this.currentProcedure];
    const procData = COGEP_PROCEDURES.find(p => p.id === this.currentProcedure);
    const attempts = JSON.parse(localStorage.getItem(`cogep_quiz_attempts_${this.currentProcedure}`) || '[]');

    // Obtener la calificación más alta
    let highestGradeText = "";
    if (attempts.length > 0) {
      const maxScore = Math.max(...attempts.map(a => a.percentage));
      highestGradeText = `<div style="font-size: 1.1rem; color: var(--primary-blue); font-weight: 700; margin-bottom: 1.5rem;">Calificación más alta: ${maxScore.toFixed(2)} / 100,00.</div>`;
    }

    let attemptsTableHTML = "";
    if (attempts.length > 0) {
      let rowsHTML = "";
      attempts.forEach((att, idx) => {
        const duration = this.formatDuration(att.startedAt, att.completedAt);
        rowsHTML += `
          <tr>
            <td>Intento ${att.attemptNumber}</td>
            <td>Finalizado</td>
            <td>${duration}</td>
            <td>${att.score.toFixed(2)} / 25.00</td>
            <td>${att.percentage.toFixed(2)} de 100,00</td>
            <td>
              <button class="btn btn-secondary btn-sm btn-review-attempt" data-idx="${idx}" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;">Revisión</button>
            </td>
          </tr>
        `;
      });

      attemptsTableHTML = `
        <h3 class="attempts-title">Sus intentos</h3>
        <table class="moodle-table">
          <thead>
            <tr>
              <th>Intento</th>
              <th>Estado</th>
              <th>Tiempo empleado</th>
              <th>Puntos</th>
              <th>Calificación</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      `;
    }

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2 class="section-title" style="margin: 0;">${quizData.title}</h2>
        <button class="btn btn-secondary" id="btn-back-to-menu"><i class="fa-solid fa-arrow-left"></i> Volver a los tests</button>
      </div>

      <div class="quiz-intro-box">
        <div class="quiz-intro-info">
          <p><strong>Método de calificación:</strong> Calificación más alta</p>
          <p><strong>Calificación para aprobar:</strong> 80,00 de 100,00</p>
          <p><strong>Límite de tiempo:</strong> Sin límite</p>
        </div>

        ${highestGradeText}
        ${attemptsTableHTML}

        <div style="text-align: center; margin-top: 2rem;">
          <button class="btn btn-primary" id="btn-start-attempt" style="padding: 1rem 2rem; font-size: 1.05rem;">
            ${attempts.length > 0 ? 'Reintentar el cuestionario' : 'Comenzar el cuestionario'}
          </button>
        </div>
      </div>
    `;

    // Vincular eventos
    container.querySelector("#btn-back-to-menu").addEventListener("click", () => {
      this.viewState = 'menu';
      this.render();
    });

    container.querySelector("#btn-start-attempt").addEventListener("click", () => {
      this.startNewAttempt();
    });

    const reviewBtns = container.querySelectorAll(".btn-review-attempt");
    reviewBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.getAttribute("data-idx"), 10);
        this.selectedAttemptIndex = idx;
        this.viewState = 'review';
        this.render();
      });
    });
  },

  async startNewAttempt() {
    this.answers = Array(25).fill(null);
    this.flaggedQuestions = Array(25).fill(false);
    this.currentQuestionIndex = 0;
    this.currentAttempt = {
      startedAt: Date.now(),
      dbId: null
    };

    // Registrar en backend si hay token
    const token = localStorage.getItem('cogep_token');
    if (token) {
      try {
        const apiUrl = typeof getDynamicApiUrl === 'function' ? getDynamicApiUrl() : 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/attempts/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ procedure_id: this.currentProcedure })
        });
        if (response.ok) {
          const data = await response.json();
          this.currentAttempt.dbId = data.attemptId;
        }
      } catch (e) {
        console.warn("Backend no disponible para registrar inicio de intento.", e);
      }
    }

    this.viewState = 'quiz';
    this.render();
  },

  // 3. VISTA: REALIZACIÓN DE CUESTIONARIO (Pregunta por pregunta)
  renderQuiz(container) {
    const quizData = COGEP_QUIZZES[this.currentProcedure];
    const q = quizData.questions[this.currentQuestionIndex];
    const totalQuestions = quizData.questions.length;

    // Generar opciones HTML (Radio button con letra a, b, c, d)
    let optionsHTML = "";
    const optionLetters = ['a', 'b', 'c', 'd'];
    q.options.forEach((opt, idx) => {
      const isChecked = this.answers[this.currentQuestionIndex] === idx;
      optionsHTML += `
        <div class="moodle-option-row ${isChecked ? 'checked' : ''}" data-idx="${idx}">
          <input type="radio" id="q-opt-${idx}" name="moodle-q-opts" value="${idx}" ${isChecked ? 'checked' : ''}>
          <label for="q-opt-${idx}">
            <span class="moodle-option-letter">${optionLetters[idx]}.</span> ${opt}
          </label>
        </div>
      `;
    });

    // Generar grilla de navegación rápida de preguntas (1 a 25)
    let navGridHTML = "";
    for (let i = 0; i < totalQuestions; i++) {
      const isAnswered = this.answers[i] !== null;
      const isActive = this.currentQuestionIndex === i;
      const isFlagged = this.flaggedQuestions[i] === true;
      navGridHTML += `
        <div class="quiz-nav-cell ${isAnswered ? 'answered' : ''} ${isActive ? 'active' : ''} ${isFlagged ? 'flagged' : ''}" data-target-idx="${i}">
          ${i + 1}
        </div>
      `;
    }

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2 class="section-title" style="margin: 0;">${quizData.title}</h2>
        <button class="btn btn-secondary" id="btn-abort-quiz"><i class="fa-solid fa-right-from-bracket"></i> Salir del intento</button>
      </div>

      <div class="quiz-split-container">
        <!-- Panel Izquierdo: Información y Navegación de Preguntas -->
        <aside class="moodle-question-info">
          <h4>Pregunta ${this.currentQuestionIndex + 1}</h4>
          <div class="moodle-info-status" id="question-status-text">
            ${this.answers[this.currentQuestionIndex] !== null ? 'Respuesta guardada' : 'Sin responder aún'}
          </div>
          <div class="moodle-info-points">Puntúa como 1,00 sobre 1,00</div>
          
          <div class="moodle-flag-link ${this.flaggedQuestions[this.currentQuestionIndex] ? 'flagged' : ''}" id="btn-flag-question">
            <i class="${this.flaggedQuestions[this.currentQuestionIndex] ? 'fa-solid' : 'fa-regular'} fa-flag"></i>
            <span>${this.flaggedQuestions[this.currentQuestionIndex] ? 'Quitar marca' : 'Marcar pregunta'}</span>
          </div>

          <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
            <strong style="font-size: 0.8rem; color: var(--text-dark); display: block; margin-bottom: 0.5rem;">Navegación por el cuestionario</strong>
            <div class="quiz-navigation-grid">
              ${navGridHTML}
            </div>
          </div>
        </aside>

        <!-- Panel Derecho: Pregunta y Opciones -->
        <div class="moodle-question-body">
          <p class="moodle-question-text">${q.question}</p>
          <div class="moodle-selection-label">Seleccione una:</div>
          
          <div class="moodle-options-list">
            ${optionsHTML}
          </div>

          <div style="min-height: 25px;">
            <span class="moodle-clear-choice" id="btn-clear-choice" style="display: ${this.answers[this.currentQuestionIndex] !== null ? 'inline-block' : 'none'};">
              Quitar mi elección
            </span>
          </div>

          <!-- Acciones de Navegación del Test -->
          <div class="moodle-quiz-actions">
            <button class="btn btn-secondary" id="btn-prev-page" ${this.currentQuestionIndex === 0 ? 'disabled style="opacity:0.5; cursor:default;"' : ''}>
              Página anterior
            </button>
            <button class="btn btn-primary" id="btn-next-page">
              ${this.currentQuestionIndex === totalQuestions - 1 ? 'Terminar intento...' : 'Siguiente página'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Vincular clic en filas de opciones
    const optionRows = container.querySelectorAll(".moodle-option-row");
    optionRows.forEach(row => {
      row.addEventListener("click", (e) => {
        const idx = parseInt(row.getAttribute("data-idx"), 10);
        this.answers[this.currentQuestionIndex] = idx;
        
        // Actualizar visual de las opciones
        optionRows.forEach(r => r.classList.remove("checked"));
        row.classList.add("checked");
        row.querySelector("input").checked = true;

        // Actualizar estados
        document.getElementById("question-status-text").innerText = "Respuesta guardada";
        document.getElementById("btn-clear-choice").style.display = "inline-block";

        // Actualizar grilla lateral de navegación
        const navCell = container.querySelector(`.quiz-nav-cell[data-target-idx="${this.currentQuestionIndex}"]`);
        if (navCell) navCell.classList.add("answered");
      });
    });

    // Vincular botón Quitar elección
    const clearBtn = container.querySelector("#btn-clear-choice");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.answers[this.currentQuestionIndex] = null;
        optionRows.forEach(r => {
          r.classList.remove("checked");
          r.querySelector("input").checked = false;
        });
        document.getElementById("question-status-text").innerText = "Sin responder aún";
        clearBtn.style.display = "none";

        // Actualizar grilla lateral de navegación
        const navCell = container.querySelector(`.quiz-nav-cell[data-target-idx="${this.currentQuestionIndex}"]`);
        if (navCell) navCell.classList.remove("answered");
      });
    }

    // Vincular marcar pregunta
    container.querySelector("#btn-flag-question").addEventListener("click", (e) => {
      this.flaggedQuestions[this.currentQuestionIndex] = !this.flaggedQuestions[this.currentQuestionIndex];
      const isFlagged = this.flaggedQuestions[this.currentQuestionIndex];
      
      const link = e.currentTarget;
      const icon = link.querySelector("i");
      const label = link.querySelector("span");

      if (isFlagged) {
        link.classList.add("flagged");
        icon.className = "fa-solid fa-flag";
        label.innerText = "Quitar marca";
      } else {
        link.classList.remove("flagged");
        icon.className = "fa-regular fa-flag";
        label.innerText = "Marcar pregunta";
      }

      // Actualizar grilla lateral de navegación
      const navCell = container.querySelector(`.quiz-nav-cell[data-target-idx="${this.currentQuestionIndex}"]`);
      if (navCell) {
        navCell.classList.toggle("flagged", isFlagged);
      }
    });

    // Vincular grilla lateral de navegación rápida
    const navCells = container.querySelectorAll(".quiz-nav-cell");
    navCells.forEach(cell => {
      cell.addEventListener("click", () => {
        const targetIdx = parseInt(cell.getAttribute("data-target-idx"), 10);
        this.currentQuestionIndex = targetIdx;
        this.render();
      });
    });

    // Vincular Botón Salir
    container.querySelector("#btn-abort-quiz").addEventListener("click", () => {
      if (confirm("¿Estás seguro de que deseas salir del test? Las respuestas contestadas se perderán si cancelas el intento actual.")) {
        this.viewState = 'intro';
        this.render();
      }
    });

    // Vincular Botón Anterior
    container.querySelector("#btn-prev-page").addEventListener("click", () => {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.render();
      }
    });

    // Vincular Botón Siguiente / Terminar Intento
    container.querySelector("#btn-next-page").addEventListener("click", () => {
      if (this.currentQuestionIndex < totalQuestions - 1) {
        this.currentQuestionIndex++;
        this.render();
      } else {
        this.viewState = 'summary';
        this.render();
      }
    });
  },

  // 4. VISTA: RESUMEN DEL INTENTO (Antes de Enviar)
  renderSummary(container) {
    const quizData = COGEP_QUIZZES[this.currentProcedure];
    const totalQuestions = quizData.questions.length;

    let rowsHTML = "";
    for (let i = 0; i < totalQuestions; i++) {
      const isAnswered = this.answers[i] !== null;
      rowsHTML += `
        <tr>
          <td><strong>Pregunta ${i + 1}</strong></td>
          <td>${isAnswered ? 'Respuesta guardada' : 'Sin responder aún'}</td>
        </tr>
      `;
    }

    container.innerHTML = `
      <h2 class="section-title">Evaluación: ${quizData.title.replace("Evaluación: ", "")} - Resumen del intento</h2>
      
      <div class="quiz-intro-box">
        <table class="moodle-table" style="max-width: 600px; margin: 0 auto 2rem auto;">
          <thead>
            <tr>
              <th>Pregunta</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: center; max-width: 600px; margin: 0 auto;">
          <button class="btn btn-secondary" id="btn-return-attempt">Volver al intento</button>
          <button class="btn btn-primary" id="btn-submit-attempt" style="background-color: var(--success) !important; border-color: var(--success); font-size: 1rem; padding: 0.8rem 1.5rem;">
            Enviar todo y terminar
          </button>
        </div>
      </div>
    `;

    // Vincular volver al cuestionario
    container.querySelector("#btn-return-attempt").addEventListener("click", () => {
      this.currentQuestionIndex = totalQuestions - 1; // Volver a la última pregunta
      this.viewState = 'quiz';
      this.render();
    });

    // Vincular botón Enviar y Terminar
    container.querySelector("#btn-submit-attempt").addEventListener("click", () => {
      if (confirm("Una vez que envíe el cuestionario, ya no podrá cambiar sus respuestas para este intento.")) {
        this.submitAttempt();
      }
    });
  },

  async submitAttempt() {
    const quizData = COGEP_QUIZZES[this.currentProcedure];
    const totalQuestions = quizData.questions.length;
    const completedAt = Date.now();

    // Calcular puntos y porcentaje
    let score = 0;
    for (let i = 0; i < totalQuestions; i++) {
      const selected = this.answers[i];
      const correct = quizData.questions[i].answer;
      if (selected === correct) {
        score++;
      }
    }
    const percentage = (score / totalQuestions) * 100;

    // Enviar a backend si hay token e id de intento
    const token = localStorage.getItem('cogep_token');
    if (token && this.currentAttempt && this.currentAttempt.dbId) {
      try {
        const apiUrl = typeof getDynamicApiUrl === 'function' ? getDynamicApiUrl() : 'http://localhost:5000/api';
        await fetch(`${apiUrl}/attempts/${this.currentAttempt.dbId}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            answers: this.answers.map((ansIdx, qIdx) => ({
              question_id: quizData.questions[qIdx].db_id || qIdx + 1,
              selected_option_id: ansIdx !== null ? ansIdx + 1 : null
            }))
          })
        });
      } catch (e) {
        console.warn("Backend no disponible para registrar entrega de intento.", e);
      }
    }

    // Obtener historial guardado localmente
    const attempts = JSON.parse(localStorage.getItem(`cogep_quiz_attempts_${this.currentProcedure}`) || '[]');
    const newAttempt = {
      attemptNumber: attempts.length + 1,
      startedAt: this.currentAttempt.startedAt,
      completedAt: completedAt,
      answers: [...this.answers],
      score: score,
      percentage: percentage
    };

    attempts.push(newAttempt);
    localStorage.setItem(`cogep_quiz_attempts_${this.currentProcedure}`, JSON.stringify(attempts));

    // Guardar puntaje de compatibilidad en localStorage para el panel Dashboard general
    localStorage.setItem(`cogep_quiz_${this.currentProcedure}_score`, Math.round(percentage).toString());

    // Sincronizar estadísticas en el DOM del portal si está disponible
    if (window.appRouter) {
      window.appRouter.syncDashboardStats();
    }

    // Ir a la revisión del intento recién guardado
    this.selectedAttemptIndex = attempts.length - 1;
    this.viewState = 'review';
    this.render();
  },

  // 5. VISTA: REVISIÓN DE INTENTO
  renderReview(container) {
    const quizData = COGEP_QUIZZES[this.currentProcedure];
    const attempts = JSON.parse(localStorage.getItem(`cogep_quiz_attempts_${this.currentProcedure}`) || '[]');
    const att = attempts[this.selectedAttemptIndex];

    if (!att) {
      this.viewState = 'intro';
      this.render();
      return;
    }

    const duration = this.formatDuration(att.startedAt, att.completedAt);
    
    // Tabla de resumen de revisión (Omitimos Iniciado en y Completado en según requerimiento)
    const summaryTableHTML = `
      <table class="moodle-table" style="max-width: 600px; margin: 0 auto 2.5rem auto;">
        <tbody>
          <tr>
            <td><strong>Estado</strong></td>
            <td>Finalizado</td>
          </tr>
          <tr>
            <td><strong>Tiempo empleado</strong></td>
            <td>${duration}</td>
          </tr>
          <tr>
            <td><strong>Puntos</strong></td>
            <td>${att.score.toFixed(2)} / 25,00</td>
          </tr>
          <tr>
            <td><strong>Calificación</strong></td>
            <td><strong>${att.percentage.toFixed(2)}</strong> de 100,00 (<strong>${Math.round(att.percentage)}%</strong>)</td>
          </tr>
        </tbody>
      </table>
    `;

    // Generar todas las preguntas con su calificación y retroalimentación en vertical
    let reviewQuestionsHTML = "";
    const optionLetters = ['a', 'b', 'c', 'd'];

    quizData.questions.forEach((q, qIdx) => {
      const selectedOptIdx = att.answers[qIdx];
      const correctOptIdx = q.answer;
      const isCorrect = selectedOptIdx === correctOptIdx;
      
      let optionsHTML = "";
      q.options.forEach((opt, optIdx) => {
        let stateClass = "";
        let iconHTML = "";

        // Si es la respuesta correcta de la pregunta, pintar en verde
        if (optIdx === correctOptIdx) {
          stateClass = "correct-answer";
          // Mostrar un visto si el usuario la seleccionó o en revisión general
          iconHTML = `<i class="fa-solid fa-circle-check review-mark-icon correct"></i>`;
        }
        // Si el usuario seleccionó esta opción y estaba incorrecta, pintar en rojo
        else if (optIdx === selectedOptIdx) {
          stateClass = "incorrect-answer";
          iconHTML = `<i class="fa-solid fa-circle-xmark review-mark-icon incorrect"></i>`;
        }

        const isChecked = selectedOptIdx === optIdx;

        optionsHTML += `
          <div class="moodle-option-row review-option-row ${stateClass} ${isChecked ? 'checked' : ''}">
            <input type="radio" id="review-q-${qIdx}-opt-${optIdx}" name="review-q-${qIdx}-opts" value="${optIdx}" ${isChecked ? 'checked' : ''} disabled>
            <label for="review-q-${qIdx}-opt-${optIdx}">
              <span class="moodle-option-letter">${optionLetters[optIdx]}.</span> ${opt}
            </label>
            ${iconHTML}
          </div>
        `;
      });

      reviewQuestionsHTML += `
        <div class="quiz-split-container" style="margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 2px dashed var(--border-color);">
          <!-- Panel de Estado Izquierdo de Pregunta -->
          <aside class="moodle-question-info">
            <h4>Pregunta ${qIdx + 1}</h4>
            <div class="moodle-info-status">
              <span class="review-indicator ${isCorrect ? 'correct' : 'incorrect'}">
                <i class="fa-solid ${isCorrect ? 'fa-check' : 'fa-xmark'}"></i>
                ${isCorrect ? 'Correcta' : 'Incorrecta'}
              </span>
            </div>
            <div class="moodle-info-points" style="margin-top: 0.5rem;">
              Puntúa ${isCorrect ? '1,00' : '0,00'} sobre 1,00
            </div>
          </aside>

          <!-- Bloque de Pregunta y Opciones Derecho -->
          <div class="moodle-question-body">
            <p class="moodle-question-text">${q.question}</p>
            <div class="moodle-selection-label">Seleccione una:</div>
            
            <div class="moodle-options-list">
              ${optionsHTML}
            </div>

            <!-- Caja de retroalimentación Moodle -->
            <div class="moodle-feedback-box">
              <strong>La respuesta correcta es: ${optionLetters[correctOptIdx]}.</strong>
              <p style="margin-top: 0.5rem;">
                <strong>Retroalimentación:</strong> ${q.explanation}
              </p>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2 class="section-title" style="margin: 0;">Revisión: ${quizData.title.replace("Evaluación: ", "")} - Intento ${att.attemptNumber}</h2>
        <button class="btn btn-primary" id="btn-finish-review-top">Finalizar revisión</button>
      </div>

      <div class="quiz-intro-box">
        ${summaryTableHTML}
      </div>

      <div style="margin-top: 3rem;">
        ${reviewQuestionsHTML}
      </div>

      <div style="text-align: center; margin-top: 3rem; margin-bottom: 2rem;">
        <button class="btn btn-primary" id="btn-finish-review-bottom" style="padding: 0.8rem 2rem;">
          Finalizar revisión
        </button>
      </div>
    `;

    // Vincular botones de finalizar revisión
    const handleFinishReview = () => {
      this.viewState = 'intro';
      this.render();
    };

    container.querySelector("#btn-finish-review-top").addEventListener("click", handleFinishReview);
    container.querySelector("#btn-finish-review-bottom").addEventListener("click", handleFinishReview);
  }
};

window.CogepQuiz = CogepQuiz;
