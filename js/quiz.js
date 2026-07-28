/**
 * Módulo de Evaluaciones y Cuestionarios (js/quiz.js)
 * Implementa una simulación del entorno de cuestionarios de Moodle:
 * - Selección de tests en tarjetas.
 * - Pantalla de inicio de intento con historial histórico.
 * - Navegación secuencial y cuadrícula de preguntas sin respuestas inmediatas.
 * - Resumen del intento antes de enviar.
 * - Revisión detallada post-entrega con retroalimentación y notas.
 */

function generateRandomColorImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 250;
  const ctx = canvas.getContext("2d");
  const colors = ["#1E3A8A", "#0B5394", "#76A5AF", "#351C75", "#741B47", "#B45F06", "#38761D", "#134F5C", "#434343", "#7F6000"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  ctx.fillStyle = randomColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Sutil gradiente diagonal
  const gradient = ctx.createLinearGradient(0, 0, 400, 250);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.25)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 250);
  
  return canvas.toDataURL("image/png");
}

const CogepQuiz = {
  currentProcedure: 'ordinario',
  currentQuestionIndex: 0,
  viewState: 'menu', // 'menu', 'intro', 'quiz', 'summary', 'review'
  answers: [], // Array de elementos con las elecciones del alumno (índices o null)
  flaggedQuestions: [], // Array de elementos booleanos
  currentAttempt: null, // Guardará la fecha de inicio del intento activo
  selectedAttemptIndex: -1, // Índice del intento seleccionado para revisión

  init() {
    // Autolimpiar caché antigua con imágenes corruptas (.jpg) o evaluaciones sin preguntas
    let savedProcs = localStorage.getItem('cogep_procedures');
    let savedQuizzes = localStorage.getItem('cogep_quizzes');
    let hasQuestions = false;
    if (savedQuizzes) {
      try {
        const parsed = JSON.parse(savedQuizzes);
        hasQuestions = Object.values(parsed).some(q => q.questions && q.questions.length > 0);
      } catch (e) {}
    }
    if ((savedProcs && savedProcs.includes(".jpg")) || (savedQuizzes && !hasQuestions)) {
      localStorage.removeItem('cogep_procedures');
      localStorage.removeItem('cogep_quizzes');
      savedProcs = null;
      savedQuizzes = null;
    }

    if (savedProcs) {
      try {
        const parsedProcs = JSON.parse(savedProcs);
        COGEP_PROCEDURES.length = 0;
        parsedProcs.forEach(p => COGEP_PROCEDURES.push(p));
      } catch (e) { console.error("Error al cargar procedimientos:", e); }
    }
    if (savedQuizzes) {
      try {
        const parsedQuizzes = JSON.parse(savedQuizzes);
        Object.keys(COGEP_QUIZZES).forEach(key => delete COGEP_QUIZZES[key]);
        Object.assign(COGEP_QUIZZES, parsedQuizzes);
      } catch (e) { console.error("Error al cargar cuestionarios:", e); }
    }

    this.viewState = 'menu';
    this.render();

    // Sincronizar con la base de datos de manera asíncrona
    this.syncWithDatabase();
  },

  async syncWithDatabase() {
    try {
      const apiUrl = typeof getDynamicApiUrl === 'function' ? getDynamicApiUrl() : 'http://localhost:5000/api';
      
      // 1. Obtener procedimientos
      const pResponse = await fetch(`${apiUrl}/procedures`);
      if (!pResponse.ok) return;
      const procedures = await pResponse.json();
      
      // 2. Obtener preguntas
      const qResponse = await fetch(`${apiUrl}/questions`);
      if (!qResponse.ok) return;
      const questionsList = await qResponse.json();
      
      // Reconstruir COGEP_PROCEDURES
      COGEP_PROCEDURES.length = 0;
      procedures.forEach(p => {
        COGEP_PROCEDURES.push({
          id: p.id,
          title: p.title,
          description: p.description,
          articles: p.articles || 'Art. General',
          image: p.image || 'images/logo_sitio_centro.png',
          availability: p.availability || 'always_open',
          open_at: p.open_at || null,
          period: p.period || '2026_01'
        });
      });
      
      // Reconstruir COGEP_QUIZZES
      Object.keys(COGEP_QUIZZES).forEach(key => delete COGEP_QUIZZES[key]);
      
      procedures.forEach(p => {
        COGEP_QUIZZES[p.id] = {
          title: "Evaluación: " + p.title,
          questions: []
        };
      });
      
      questionsList.forEach(q => {
        const procId = q.procedure_id;
        if (!COGEP_QUIZZES[procId]) return;
        
        let correctIdx = 0;
        const optionsStrings = q.options.map((opt, idx) => {
          if (opt.is_correct || opt.is_correct === 1) correctIdx = idx;
          return opt.option_text;
        });
        
        COGEP_QUIZZES[procId].questions.push({
          question: q.question_text,
          options: optionsStrings,
          answer: correctIdx,
          explanation: q.explanation || '',
          db_id: q.db_id,
          options_db: q.options
        });
      });
      
      // Guardar de vuelta en localStorage
      localStorage.setItem('cogep_procedures', JSON.stringify(COGEP_PROCEDURES));
      localStorage.setItem('cogep_quizzes', JSON.stringify(COGEP_QUIZZES));
      
      // Re-renderizar si el usuario está en el menú
      if (this.viewState === 'menu') {
        this.render();
      }
    } catch (e) {
      console.warn("Backend no disponible para sincronizar evaluaciones, usando localStorage:", e);
    }
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
      case 'edit_form':
        this.renderQuizForm(container, this.currentProcedure);
        break;
      case 'create_form':
        this.renderQuizForm(container, null);
        break;
    }
    
    // Auto-scroll al inicio del contenedor
    const mainContainer = document.getElementById("main-view-container");
    if (mainContainer) mainContainer.scrollTop = 0;
  },

  // 1. VISTA: MENÚ DE SELECCIÓN DE TEST (Tarjetas)
  renderMenu(container) {
    const user = AuthService.getCurrentUser();
    const canManage = user && (user.role === 'docente' || user.role === 'administrador');

    let createBtnHTML = "";
    if (canManage) {
      createBtnHTML = `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem;">
          <button class="btn btn-primary" id="btn-create-quiz" style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-plus"></i> Nueva Evaluación
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 2rem;">
        <div style="flex: 1; min-width: 250px;">
          <h2 class="section-title" style="margin: 0;">Evaluación del Conocimiento COGEP</h2>
          <p style="color: var(--text-muted); margin-top: 0.5rem; margin-bottom: 0;">
            Selecciona uno de los procedimientos procesales del COGEP para medir tus conocimientos jurídicos.
          </p>
        </div>
        ${createBtnHTML}
      </div>

      <h3 class="eval-menu-section-title" style="margin-top: 2rem; margin-bottom: 1rem; color: var(--primary-blue); font-weight: 700; border-bottom: 2px solid var(--accent-gold); padding-bottom: 0.5rem;">
        <i class="fa-solid fa-graduation-cap"></i> Evaluaciones de Introducción
      </h3>
      <div class="quiz-menu-grid" id="quiz-menu-cards-intro"></div>

      <h3 class="eval-menu-section-title" style="margin-top: 3rem; margin-bottom: 1rem; color: var(--primary-blue); font-weight: 700; border-bottom: 2px solid var(--accent-gold); padding-bottom: 0.5rem;">
        <i class="fa-solid fa-chalkboard-user"></i> Evaluaciones Creadas por Profesores
      </h3>
      <div class="quiz-menu-grid" id="quiz-menu-cards-custom"></div>
    `;

    if (canManage) {
      const btnCreate = container.querySelector("#btn-create-quiz");
      if (btnCreate) {
        btnCreate.addEventListener("click", () => {
          this.viewState = 'create_form';
          this.render();
        });
      }
    }

    const menuGridIntro = container.querySelector("#quiz-menu-cards-intro");
    const menuGridCustom = container.querySelector("#quiz-menu-cards-custom");

    const introIds = ['ordinario', 'ejecutivo', 'sumario', 'monitorio', 'ejecucion'];
    const introProcs = COGEP_PROCEDURES.filter(proc => introIds.includes(proc.id));
    const customProcs = COGEP_PROCEDURES.filter(proc => !introIds.includes(proc.id));

    // Renderizar tarjetas de Introducción
    this.populateCardsGrid(menuGridIntro, introProcs, canManage);

    // Renderizar tarjetas del Docente / Custom
    if (customProcs.length === 0) {
      menuGridCustom.innerHTML = `
        <div style="grid-column: 1 / -1; background-color: var(--light-grey); border-radius: var(--radius-md); padding: 2rem; text-align: center; border: 1px dashed var(--border-color); color: var(--text-muted); font-style: italic;">
          No hay evaluaciones personalizadas creadas por docentes todavía en este período.
        </div>
      `;
    } else {
      this.populateCardsGrid(menuGridCustom, customProcs, canManage);
    }
  },

  populateCardsGrid(gridElement, proceduresList, canManage) {
    proceduresList.forEach(proc => {
      const attempts = JSON.parse(localStorage.getItem(`cogep_quiz_attempts_${proc.id}`) || '[]');
      let highestGrade = "Sin intentos";
      if (attempts.length > 0) {
        const maxScore = Math.max(...attempts.map(a => a.percentage));
        highestGrade = `${maxScore.toFixed(2)}%`;
      }

      let editIconHTML = "";
      if (canManage) {
        editIconHTML = `
          <button class="btn-icon btn-edit-quiz-card" data-id="${proc.id}" title="Editar Evaluación" 
            style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 10;">
            <i class="fa-solid fa-pencil" style="color: var(--primary-blue); font-size: 1rem;"></i>
          </button>
        `;
      }

      const numQuestions = (COGEP_QUIZZES[proc.id]?.questions || []).length;

      // Calcular badge de disponibilidad
      const availability = proc.availability || 'always_open';
      const openAtDate = proc.open_at ? new Date(proc.open_at.replace(' ', 'T')) : null;
      const now = new Date();

      let statusBadgeHTML = "";
      if (availability === 'closed') {
        statusBadgeHTML = `<span class="badge" style="background-color: #EF4444; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; position: absolute; top: 10px; left: 10px; z-index: 10; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">Cerrado</span>`;
      } else if (availability === 'scheduled' && openAtDate && now < openAtDate) {
        statusBadgeHTML = `<span class="badge" style="background-color: #F59E0B; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; position: absolute; top: 10px; left: 10px; z-index: 10; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">Abre: ${openAtDate.toLocaleDateString()}</span>`;
      } else {
        statusBadgeHTML = `<span class="badge" style="background-color: #10B981; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; position: absolute; top: 10px; left: 10px; z-index: 10; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">Abierto</span>`;
      }

      const card = document.createElement("div");
      card.className = "quiz-card-premium";
      card.style.position = "relative";
      card.innerHTML = `
        ${statusBadgeHTML}
        ${editIconHTML}
        <div class="procedure-card-image">
          <img src="${proc.image || 'images/logo_sitio_centro.png'}" alt="${proc.title}">
        </div>
        <div class="quiz-card-body">
          <h3>${proc.title}</h3>
          <p>${proc.description}</p>
          <div style="font-size: 0.8rem; font-weight: bold; color: var(--primary-blue); margin-bottom: 0.5rem;">Período: ${proc.period || '2026_01'}</div>
          <div class="quiz-card-stats">
            <span>${numQuestions} Pregunta${numQuestions !== 1 ? 's' : ''}</span>
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

      if (canManage) {
        const editBtn = card.querySelector(".btn-edit-quiz-card");
        if (editBtn) {
          editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.currentProcedure = proc.id;
            this.viewState = 'edit_form';
            this.render();
          });
        }
      }

      gridElement.appendChild(card);
    });
  },

  // 2. VISTA: INTRODUCCIÓN E HISTORIAL DE INTENTOS
  renderIntro(container) {
    const quizData = COGEP_QUIZZES[this.currentProcedure];
    const procData = COGEP_PROCEDURES.find(p => p.id === this.currentProcedure);
    const attempts = JSON.parse(localStorage.getItem(`cogep_quiz_attempts_${this.currentProcedure}`) || '[]');

    const user = AuthService.getCurrentUser();
    const isDocenteOrAdmin = user && (user.role === 'docente' || user.role === 'administrador');

    // Determinar disponibilidad del cuestionario
    const availability = procData?.availability || 'always_open';
    const openAtDate = procData?.open_at ? new Date(procData.open_at.replace(' ', 'T')) : null;
    const now = new Date();

    let isAvailable = true;
    let availabilityMessage = "";
    if (availability === 'closed') {
      isAvailable = false;
      availabilityMessage = "Este cuestionario ha sido cerrado por el docente.";
    } else if (availability === 'scheduled' && openAtDate && now < openAtDate) {
      isAvailable = false;
      availabilityMessage = `Este cuestionario no está disponible actualmente. Se abrirá automáticamente el ${openAtDate.toLocaleString()}.`;
    }

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
            <td>${att.score.toFixed(2)} / ${quizData.questions.length.toFixed(2)}</td>
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
          <p><strong>Período asociado:</strong> ${procData?.period || '2026_01'}</p>
          <p><strong>Estado actual:</strong> ${!isAvailable ? `<span style="color:#EF4444; font-weight:bold;">Restringido</span>` : `<span style="color:#10B981; font-weight:bold;">Disponible</span>`}</p>
        </div>

        ${highestGradeText}
        ${attemptsTableHTML}

        <div style="text-align: center; margin-top: 2rem;">
          <button class="btn btn-primary" id="btn-start-attempt" style="padding: 1rem 2rem; font-size: 1.05rem;" ${(!isAvailable && !isDocenteOrAdmin) ? 'disabled style="background-color:#9CA3AF !important; border-color:#9CA3AF; cursor:not-allowed; opacity:0.6;"' : ''}>
            ${attempts.length > 0 ? 'Reintentar el cuestionario' : 'Comenzar el cuestionario'}
          </button>
          ${(!isAvailable && !isDocenteOrAdmin) ? `<div style="margin-top: 1rem; color: #EF4444; font-weight: 600; font-size: 0.95rem;"><i class="fa-solid fa-triangle-exclamation"></i> ${availabilityMessage}</div>` : ''}
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
    const quizData = COGEP_QUIZZES[this.currentProcedure];
    const totalQuestions = (quizData && quizData.questions) ? quizData.questions.length : 25;
    this.answers = Array(totalQuestions).fill(null);
    this.flaggedQuestions = Array(totalQuestions).fill(false);
    this.currentQuestionIndex = 0;
    this.currentAttempt = {
      startedAt: Date.now(),
      dbId: null
    };

    // Registrar en backend si hay token
    const token = localStorage.getItem('cogep_token') || sessionStorage.getItem('cogep_token');
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

    // Generar opciones HTML (Radio button con letra a, b, c, d, etc.)
    let optionsHTML = "";
    q.options.forEach((opt, idx) => {
      const isChecked = this.answers[this.currentQuestionIndex] === idx;
      const letter = String.fromCharCode(97 + idx); // 97 es 'a'
      optionsHTML += `
        <div class="moodle-option-row ${isChecked ? 'checked' : ''}" data-idx="${idx}">
          <input type="radio" id="q-opt-${idx}" name="moodle-q-opts" value="${idx}" ${isChecked ? 'checked' : ''}>
          <label for="q-opt-${idx}">
            <span class="moodle-option-letter">${letter}.</span> ${opt}
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
    const token = localStorage.getItem('cogep_token') || sessionStorage.getItem('cogep_token');
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
            answers: (() => {
              const answersObj = {};
              this.answers.forEach((ansIdx, qIdx) => {
                const questionId = quizData.questions[qIdx].db_id || (qIdx + 1);
                const selectedOptionId = ansIdx !== null ? (quizData.questions[qIdx].options_db ? quizData.questions[qIdx].options_db[ansIdx].id : ansIdx + 1) : null;
                answersObj[questionId] = selectedOptionId;
              });
              return answersObj;
            })()
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
        const letter = String.fromCharCode(97 + optIdx); // 97 es 'a'

        optionsHTML += `
          <div class="moodle-option-row review-option-row ${stateClass} ${isChecked ? 'checked' : ''}">
            <input type="radio" id="review-q-${qIdx}-opt-${optIdx}" name="review-q-${qIdx}-opts" value="${optIdx}" ${isChecked ? 'checked' : ''} disabled>
            <label for="review-q-${qIdx}-opt-${optIdx}">
              <span class="moodle-option-letter">${letter}.</span> ${opt}
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
  },

  renderQuizForm(container, procId) {
    const isEdit = procId !== null;
    let procData = null;
    let quizData = null;
    
    if (isEdit) {
      procData = COGEP_PROCEDURES.find(p => p.id === procId);
      quizData = COGEP_QUIZZES[procId] || { title: procData?.title || '', questions: [] };
    }

    const formTitle = isEdit ? `Editar Cuestionario: ${procData?.title}` : "Crear Nueva Evaluación";
    const currentId = isEdit ? procData.id : "";
    const currentTitle = isEdit ? procData.title : "";
    const currentDesc = isEdit ? procData.description : "";
    const currentArticles = isEdit ? (procData.articles || "") : "Art. General";
    
    // Metadatos
    const currentAvailability = isEdit ? (procData.availability || "always_open") : "always_open";
    const currentOpenAt = (isEdit && procData.open_at) ? procData.open_at.replace(" ", "T") : "";
    const currentPeriod = isEdit ? (procData.period || "2026_01") : "2026_01";
    let base64Image = isEdit ? (procData.image || "") : "";

    // Clonar preguntas
    let localQuestions = [];
    if (isEdit && quizData.questions) {
      localQuestions = JSON.parse(JSON.stringify(quizData.questions));
    } else {
      // Pregunta inicial vacía
      localQuestions = [
        {
          question: "",
          options: ["", ""],
          answer: 0,
          explanation: ""
        }
      ];
    }

    container.innerHTML = `
      <h2 class="section-title">${formTitle}</h2>
      <p style="margin-bottom: 2rem; color: var(--text-muted);">
        Completa los campos principales del cuestionario y añade las preguntas correspondientes indicando la opción correcta.
      </p>

      <form id="eval-edit-form" style="background-color: var(--white); padding: 2rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 1.5rem;">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; flex-wrap: wrap;">
          <div class="form-group" style="margin-bottom: 0;">
            <label for="eval-id" style="font-weight: 600; display: block; margin-bottom: 0.5rem;">ID Único del Procedimiento (Alfanumérico)</label>
            <input type="text" id="eval-id" class="form-control" value="${currentId}" ${isEdit ? 'readonly style="background-color: var(--light-grey); cursor: not-allowed;"' : 'required placeholder="ej: sumario"'}>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label for="eval-title" style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Título de la Evaluación</label>
            <input type="text" id="eval-title" class="form-control" value="${currentTitle}" required placeholder="ej: Procedimiento Sumario">
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label for="eval-desc" style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Descripción del Cuestionario</label>
          <textarea id="eval-desc" class="form-control" rows="2" required placeholder="Describe brevemente de qué trata este examen...">${currentDesc}</textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; flex-wrap: wrap;">
          <div class="form-group" style="margin-bottom: 0;">
            <label for="eval-articles" style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Artículos Asociados (COGEP)</label>
            <input type="text" id="eval-articles" class="form-control" value="${currentArticles}" placeholder="ej: Arts. 332-333">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label for="eval-period" style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Período Académico</label>
            <input type="text" id="eval-period" class="form-control" value="${currentPeriod}" required placeholder="ej: 2026_01">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label for="eval-availability" style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Disponibilidad</label>
            <select id="eval-availability" class="form-control">
              <option value="always_open" ${currentAvailability === 'always_open' ? 'selected' : ''}>Siempre abierta</option>
              <option value="scheduled" ${currentAvailability === 'scheduled' ? 'selected' : ''}>Programar apertura</option>
              <option value="closed" ${currentAvailability === 'closed' ? 'selected' : ''}>Cerrada</option>
            </select>
          </div>
        </div>

        <div id="open-at-container" class="form-group" style="margin-bottom: 0; display: ${currentAvailability === 'scheduled' ? 'block' : 'none'};">
          <label for="eval-open-at" style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Fecha y Hora de Apertura</label>
          <input type="datetime-local" id="eval-open-at" class="form-control" value="${currentOpenAt}">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
          <div class="form-group" style="margin-bottom: 0;">
            <label for="eval-image-file" style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Imagen de la Evaluación (JPG/PNG)</label>
            <input type="file" id="eval-image-file" class="form-control" accept="image/*" style="padding: 0.3rem 0.5rem;">
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">Deja vacío para autogenerar un color plano representativo.</p>
          </div>
          <div class="form-group" style="margin-bottom: 0; display: flex; align-items: center; gap: 1rem;">
            <div id="eval-image-preview-container" style="width: 120px; height: 75px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); overflow: hidden; background-color: var(--light-grey); display: flex; align-items: center; justify-content: center;">
              ${base64Image ? `<img src="${base64Image}" style="width: 100%; height: 100%; object-fit: cover;">` : `<i class="fa-regular fa-image" style="font-size: 1.5rem; color: var(--text-muted);"></i>`}
            </div>
            <div id="remove-btn-wrapper"></div>
          </div>
        </div>

        <div style="border-top: 2px solid var(--light-grey); padding-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="color: var(--primary-blue); margin: 0;"><i class="fa-solid fa-circle-question"></i> Preguntas del Cuestionario</h3>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-add-question-form" style="display: flex; align-items: center; gap: 0.5rem; background-color: var(--primary-blue); color: var(--white); border: none;">
              <i class="fa-solid fa-plus"></i> Añadir Pregunta
            </button>
          </div>

          <div id="questions-list-container" style="display: flex; flex-direction: column; gap: 2rem;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid var(--light-grey); padding-top: 1.5rem; margin-top: 1rem;">
          <div>
            ${isEdit ? `
              <button type="button" class="btn btn-sm" id="btn-delete-quiz" style="background-color: #EF4444; color: white; display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; border: none; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer;">
                <i class="fa-solid fa-trash-can"></i> Eliminar Todo el Cuestionario
              </button>
            ` : '<span></span>'}
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="button" class="btn btn-secondary" id="btn-cancel-quiz" style="padding: 0.6rem 1.5rem;">Cancelar</button>
            <button type="submit" class="btn btn-primary" style="padding: 0.6rem 2rem;">Guardar Cambios</button>
          </div>
        </div>

      </form>
    `;

    const questionsContainer = container.querySelector("#questions-list-container");

    const renderQuestionsList = () => {
      questionsContainer.innerHTML = "";
      if (localQuestions.length === 0) {
        questionsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-style: italic; padding: 2rem;">No hay preguntas añadidas. Haz clic en "Añadir Pregunta" para agregar una.</p>`;
        return;
      }

      localQuestions.forEach((q, qIdx) => {
        const qCard = document.createElement("div");
        qCard.className = "admin-card";
        qCard.style.borderLeft = "4px solid var(--accent-gold)";
        qCard.style.padding = "1.5rem";
        qCard.style.backgroundColor = "var(--light-grey)";
        qCard.style.position = "relative";

        let optionsHTML = "";
        q.options.forEach((opt, optIdx) => {
          const isChecked = q.answer === optIdx;
          const showDeleteBtn = q.options.length > 2; // Mantener un mínimo de 2 opciones
          optionsHTML += `
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <input type="radio" name="correct-opt-${qIdx}" class="correct-radio-input" data-qidx="${qIdx}" data-optidx="${optIdx}" ${isChecked ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
              <input type="text" class="form-control option-text-input" data-qidx="${qIdx}" data-optidx="${optIdx}" value="${opt || ''}" required placeholder="Opción ${String.fromCharCode(65 + optIdx)}" style="flex: 1;">
              ${showDeleteBtn ? `
                <button type="button" class="btn btn-sm btn-delete-option" data-qidx="${qIdx}" data-optidx="${optIdx}" style="background-color: #EF4444; color: white; border: none; border-radius: 4px; padding: 0.4rem 0.6rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                  <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                </button>
              ` : ''}
            </div>
          `;
        });

        qCard.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 0.5rem;">
            <h4 style="margin: 0; color: var(--primary-blue); font-weight: 700;">Pregunta ${qIdx + 1}</h4>
            <button type="button" class="btn btn-sm btn-delete-question-item" data-idx="${qIdx}" style="background-color: #EF4444; color: white; padding: 0.25rem 0.6rem; font-size: 0.8rem; display: flex; align-items: center; gap: 0.3rem; border: none; border-radius: var(--radius-sm); cursor: pointer;">
              <i class="fa-solid fa-xmark"></i> Eliminar Pregunta
            </button>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label style="font-weight: 600; display: block; margin-bottom: 0.3rem;">Texto de la Pregunta</label>
            <textarea class="form-control question-text-input" rows="2" data-idx="${qIdx}" required placeholder="Escribe el enunciado de la pregunta...">${q.question || ''}</textarea>
          </div>

          <div class="form-group" style="margin-bottom: 1rem;">
            <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Opciones de Respuesta (Selecciona la correcta)</label>
            <div id="options-container-${qIdx}" style="display: flex; flex-direction: column;">
              ${optionsHTML}
            </div>
            <button type="button" class="btn btn-secondary btn-sm btn-add-option" data-qidx="${qIdx}" style="margin-top: 0.5rem; display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.35rem 0.8rem;">
              <i class="fa-solid fa-plus"></i> Añadir Opción
            </button>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label style="font-weight: 600; display: block; margin-bottom: 0.3rem;">Retroalimentación / Explicación Jurídica</label>
            <textarea class="form-control question-exp-input" rows="2" data-idx="${qIdx}" placeholder="Según el Art...">${q.explanation || ''}</textarea>
          </div>
        `;

        qCard.querySelector(".question-text-input").addEventListener("input", (e) => {
          localQuestions[qIdx].question = e.target.value;
        });

        qCard.querySelector(".question-exp-input").addEventListener("input", (e) => {
          localQuestions[qIdx].explanation = e.target.value;
        });

        qCard.querySelectorAll(".option-text-input").forEach(optInput => {
          optInput.addEventListener("input", (e) => {
            const optidx = parseInt(e.target.getAttribute("data-optidx"), 10);
            localQuestions[qIdx].options[optidx] = e.target.value;
          });
        });

        qCard.querySelectorAll(".correct-radio-input").forEach(radio => {
          radio.addEventListener("change", (e) => {
            const optidx = parseInt(e.target.getAttribute("data-optidx"), 10);
            localQuestions[qIdx].answer = optidx;
          });
        });

        qCard.querySelector(".btn-add-option").addEventListener("click", () => {
          localQuestions[qIdx].options.push("");
          renderQuestionsList();
        });

        qCard.querySelectorAll(".btn-delete-option").forEach(delBtn => {
          delBtn.addEventListener("click", (e) => {
            const optidx = parseInt(e.currentTarget.getAttribute("data-optidx"), 10);
            localQuestions[qIdx].options.splice(optidx, 1);
            if (localQuestions[qIdx].answer === optidx) {
              localQuestions[qIdx].answer = 0;
            } else if (localQuestions[qIdx].answer > optidx) {
              localQuestions[qIdx].answer--;
            }
            renderQuestionsList();
          });
        });

        qCard.querySelector(".btn-delete-question-item").addEventListener("click", () => {
          localQuestions.splice(qIdx, 1);
          renderQuestionsList();
        });

        questionsContainer.appendChild(qCard);
      });
    };

    // Controlador del tipo de disponibilidad
    const availabilitySelect = container.querySelector("#eval-availability");
    const openAtContainer = container.querySelector("#open-at-container");
    if (availabilitySelect && openAtContainer) {
      availabilitySelect.addEventListener("change", (e) => {
        if (e.target.value === 'scheduled') {
          openAtContainer.style.display = 'block';
          container.querySelector("#eval-open-at").setAttribute('required', 'true');
        } else {
          openAtContainer.style.display = 'none';
          container.querySelector("#eval-open-at").removeAttribute('required');
        }
      });
    }

    // Control del file uploader
    const imageFileInput = container.querySelector("#eval-image-file");
    const previewContainer = container.querySelector("#eval-image-preview-container");
    const removeBtnWrapper = container.querySelector("#remove-btn-wrapper");

    if (imageFileInput) {
      imageFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            base64Image = event.target.result;
            previewContainer.innerHTML = `<img src="${base64Image}" style="width: 100%; height: 100%; object-fit: cover;">`;
            ensureRemoveButton();
          };
          reader.readAsDataURL(file);
        }
      });
    }

    const ensureRemoveButton = () => {
      removeBtnWrapper.innerHTML = "";
      if (base64Image) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "btn btn-secondary btn-sm";
        removeBtn.id = "btn-remove-eval-image";
        removeBtn.innerText = "Quitar Imagen";
        removeBtn.style.padding = "0.3rem 0.6rem";
        removeBtn.onclick = () => {
          base64Image = "";
          if (imageFileInput) imageFileInput.value = "";
          previewContainer.innerHTML = `<i class="fa-regular fa-image" style="font-size: 1.5rem; color: var(--text-muted);"></i>`;
          removeBtn.remove();
        };
        removeBtnWrapper.appendChild(removeBtn);
      }
    };
    ensureRemoveButton();

    container.querySelector("#btn-add-question-form").addEventListener("click", () => {
      localQuestions.push({
        question: "",
        options: ["", ""],
        answer: 0,
        explanation: ""
      });
      renderQuestionsList();
    });

    if (isEdit) {
      container.querySelector("#btn-delete-quiz").addEventListener("click", async () => {
        if (confirm(`¿Estás seguro de que deseas eliminar permanentemente todo el cuestionario "${procData.title}"? Esta acción no se puede deshacer.`)) {
          
          const token = localStorage.getItem('cogep_token') || sessionStorage.getItem('cogep_token');
          if (token) {
            try {
              const apiUrl = typeof getDynamicApiUrl === 'function' ? getDynamicApiUrl() : 'http://localhost:5000/api';
              await fetch(`${apiUrl}/procedures?id=${procId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
            } catch (err) {
              console.warn("Backend no disponible para eliminar evaluación.", err);
            }
          }

          const pIdx = COGEP_PROCEDURES.findIndex(p => p.id === procId);
          if (pIdx > -1) {
            COGEP_PROCEDURES.splice(pIdx, 1);
          }
          delete COGEP_QUIZZES[procId];

          localStorage.setItem('cogep_procedures', JSON.stringify(COGEP_PROCEDURES));
          localStorage.setItem('cogep_quizzes', JSON.stringify(COGEP_QUIZZES));

          alert("Evaluación eliminada correctamente.");
          this.viewState = 'menu';
          this.render();
        }
      });
    }

    container.querySelector("#btn-cancel-quiz").addEventListener("click", () => {
      this.viewState = 'menu';
      this.render();
    });

    container.querySelector("#eval-edit-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const newId = container.querySelector("#eval-id").value.trim().toLowerCase();
      const newTitle = container.querySelector("#eval-title").value.trim();
      const newDesc = container.querySelector("#eval-desc").value.trim();
      const newArticles = container.querySelector("#eval-articles").value.trim() || "Art. General";
      const newPeriod = container.querySelector("#eval-period").value.trim();
      const newAvailability = container.querySelector("#eval-availability").value;
      const newOpenAtVal = container.querySelector("#eval-open-at") ? container.querySelector("#eval-open-at").value : "";
      const newOpenAt = newAvailability === 'scheduled' ? newOpenAtVal : null;

      if (localQuestions.length === 0) {
        alert("Debes agregar al menos una pregunta.");
        return;
      }

      const activeId = isEdit ? procId : newId;

      // Autogenerar color plano si la imagen se deja vacía al crear/editar
      if (!base64Image) {
        base64Image = generateRandomColorImage();
      }

      // Guardar localmente
      if (isEdit) {
        const idx = COGEP_PROCEDURES.findIndex(p => p.id === procId);
        if (idx > -1) {
          COGEP_PROCEDURES[idx].title = newTitle;
          COGEP_PROCEDURES[idx].description = newDesc;
          COGEP_PROCEDURES[idx].articles = newArticles;
          COGEP_PROCEDURES[idx].image = base64Image;
          COGEP_PROCEDURES[idx].availability = newAvailability;
          COGEP_PROCEDURES[idx].open_at = newOpenAt;
          COGEP_PROCEDURES[idx].period = newPeriod;
        }
        COGEP_QUIZZES[procId] = {
          title: "Evaluación: " + newTitle,
          questions: localQuestions
        };
      } else {
        if (COGEP_QUIZZES[newId] || COGEP_PROCEDURES.some(p => p.id === newId)) {
          alert("El ID ingresado ya existe. Por favor usa un ID único.");
          return;
        }

        COGEP_PROCEDURES.push({
          id: newId,
          title: newTitle,
          description: newDesc,
          articles: newArticles,
          image: base64Image,
          availability: newAvailability,
          open_at: newOpenAt,
          period: newPeriod
        });
        COGEP_QUIZZES[newId] = {
          title: "Evaluación: " + newTitle,
          questions: localQuestions
        };
      }

      // Guardar en la base de datos a través de la API
      const token = localStorage.getItem('cogep_token') || sessionStorage.getItem('cogep_token');
      if (token) {
        try {
          const apiUrl = typeof getDynamicApiUrl === 'function' ? getDynamicApiUrl() : 'http://localhost:5000/api';
          const response = await fetch(`${apiUrl}/procedures`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              id: activeId,
              title: newTitle,
              description: newDesc,
              articles: newArticles,
              image: base64Image,
              availability: newAvailability,
              open_at: newOpenAt,
              period: newPeriod,
              questions: localQuestions
            })
          });
          
          if (!response.ok) {
            const errData = await response.json();
            alert("Advertencia de base de datos: " + (errData.message || "No se pudo sincronizar"));
          }
        } catch (err) {
          console.warn("Backend no disponible para persistir evaluación.", err);
        }
      }

      localStorage.setItem('cogep_procedures', JSON.stringify(COGEP_PROCEDURES));
      localStorage.setItem('cogep_quizzes', JSON.stringify(COGEP_QUIZZES));

      alert("Evaluación guardada exitosamente.");
      this.viewState = 'menu';
      this.render();
    });

    renderQuestionsList();
  },

};

window.CogepQuiz = CogepQuiz;
