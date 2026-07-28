/**
 * Módulo del Simulador de Decisiones Procesales COGEP (js/simulator.js)
 * Administra el flujo del simulador interactivo de casos prácticos:
 * - Selección de procedimiento y caso.
 * - Flujo visual interactivo superior (línea de tiempo).
 * - Toma de decisiones etapa por etapa.
 * - Retroalimentación jurídica inmediata con opción de reintento.
 */

const CogepSimulator = {
  currentNodeKey: 'start', // Mantener por compatibilidad con appRouter
  viewState: 'menu', // 'menu', 'context', 'game', 'complete'
  selectedProcedure: 'ordinario',
  selectedSimulation: null,
  currentStageIndex: 0,
  selectedOptionIndex: -1,
  feedbackState: null, // null, 'correct', 'incorrect'

  init() {
    this.viewState = 'menu';
    this.selectedSimulation = null;
    this.currentStageIndex = 0;
    this.selectedOptionIndex = -1;
    this.feedbackState = null;
    this.render();
  },

  render() {
    const container = document.getElementById("view-eval"); // Usar contenedor principal de evaluaciones si no se usa view-simulator
    const simulatorContainer = document.getElementById("view-simulator");
    const activeContainer = simulatorContainer || container;

    if (!activeContainer) return;

    activeContainer.innerHTML = "";

    switch (this.viewState) {
      case 'menu':
        this.renderMenu(activeContainer);
        break;
      case 'context':
        this.renderContext(activeContainer);
        break;
      case 'game':
        this.renderGame(activeContainer);
        break;
      case 'complete':
        this.renderComplete(activeContainer);
        break;
    }

    // Scroll al inicio
    const mainContainer = document.getElementById("main-view-container");
    if (mainContainer) mainContainer.scrollTop = 0;
  },

  // 1. PANTALLA: MENÚ DE SELECCIÓN DE PROCEDIMIENTO Y CASO
  renderMenu(container) {
    container.innerHTML = `
      <h2 class="section-title">Simulador de Casos Procesales COGEP</h2>
      <p style="margin-bottom: 2rem; color: var(--text-muted);">
        Asume el rol de defensor o juzgador y toma decisiones en casos jurídicos reales de acuerdo con el COGEP.
      </p>

      <div class="sim-procedures-nav" style="display: flex; gap: 1rem; margin-bottom: 2.5rem; overflow-x: auto; padding-bottom: 0.5rem;">
        ${COGEP_PROCEDURES.map(proc => `
          <button class="btn ${this.selectedProcedure === proc.id ? 'btn-primary' : 'btn-secondary'} sim-proc-tab-btn" data-id="${proc.id}">
            <i class="fa-solid fa-scale-balanced"></i> ${proc.title.replace("Procedimiento ", "")}
          </button>
        `).join("")}
      </div>

      <div class="sim-cases-grid" id="sim-cases-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
        <!-- Se inyectan las simulaciones del procedimiento activo -->
      </div>
    `;

    // Vincular clics en pestañas de procedimiento
    const tabs = container.querySelectorAll(".sim-proc-tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        this.selectedProcedure = e.currentTarget.getAttribute("data-id");
        this.render();
      });
    });

    // Inyectar tarjetas de casos
    const casesList = container.querySelector("#sim-cases-list");
    const scenarios = COGEP_SIMULATOR_SCENARIOS[this.selectedProcedure] || [];

    if (scenarios.length === 0) {
      casesList.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--white); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <i class="fa-regular fa-folder-open" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <p style="color: var(--text-muted);">No hay simulaciones configuradas para este procedimiento.</p>
        </div>
      `;
      return;
    }

    scenarios.forEach((scen, idx) => {
      const card = document.createElement("div");
      card.className = "quiz-card-premium";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.justifyContent = "space-between";
      card.style.padding = "1.5rem";

      card.innerHTML = `
        <div>
          <h3 style="color: var(--primary-blue); font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;">${scen.title}</h3>
          <p style="font-size: 0.9rem; color: var(--text-dark); margin-bottom: 1.5rem; line-height: 1.5;">${scen.description}</p>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; margin-bottom: 1rem; color: var(--text-muted);">
            <span><i class="fa-solid fa-layer-group"></i> ${scen.stages.length} Etapas Procesales</span>
            <span style="font-weight: 600; color: var(--accent-gold);"><i class="fa-solid fa-star"></i> Práctica Guiada</span>
          </div>
          <button class="btn btn-primary btn-select-case" style="width: 100%;" data-idx="${idx}">Ver Caso Práctico</button>
        </div>
      `;

      card.querySelector(".btn-select-case").addEventListener("click", () => {
        this.selectedSimulation = scen;
        this.viewState = 'context';
        this.render();
      });

      casesList.appendChild(card);
    });
  },

  // 2. PANTALLA: CONTEXTO INICIAL
  renderContext(container) {
    const scen = this.selectedSimulation;
    if (!scen) return;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2 class="section-title" style="margin: 0;">${scen.title}</h2>
        <button class="btn btn-secondary" id="btn-back-to-sim-menu"><i class="fa-solid fa-arrow-left"></i> Volver al Menú</button>
      </div>

      <div class="quiz-intro-box" style="padding: 2.5rem;">
        <h3 style="color: var(--primary-blue); font-size: 1.4rem; font-weight: 700; margin-bottom: 1rem;"><i class="fa-solid fa-circle-info"></i> Contexto Inicial del Caso</h3>
        <p style="font-size: 1.05rem; line-height: 1.6; text-align: justify; margin-bottom: 2rem; color: var(--text-dark);">
          ${scen.description}
        </p>

        <div style="background-color: var(--light-grey); padding: 1.5rem; border-radius: var(--radius-sm); margin-bottom: 2rem; border-left: 4px solid var(--accent-gold);">
          <h4 style="color: var(--primary-blue); font-weight: 700; margin-bottom: 0.5rem;"><i class="fa-solid fa-user-tie"></i> Tu Rol Procesal</h4>
          <p style="margin: 0; font-size: 0.95rem;">
            Deberás actuar conforme a derecho y tomar las decisiones correctas en representación de tu cliente o como juzgador de la causa. El proceso no terminará si cometes errores, pero se te enseñará el fundamento legal para corregir tu decisión.
          </p>
        </div>

        <h4 style="color: var(--primary-blue); font-weight: 700; margin-bottom: 1rem;">Línea Procesal del Caso:</h4>
        <div class="sim-timeline-stages custom-horizontal-scrollbar" style="display: flex; gap: 0.75rem; align-items: center; overflow-x: auto; padding-bottom: 1.2rem; margin-bottom: 2.5rem; width: 100%;">
          ${scen.stages.map((stg, sIdx) => `
            <div style="background: var(--surface); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
              <span style="background: var(--primary); color: var(--white); font-weight: bold; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">${sIdx + 1}</span>
              <strong style="color: var(--text-dark);">${stg.name}</strong>
            </div>
            ${sIdx < scen.stages.length - 1 ? `<i class="fa-solid fa-arrow-right" style="align-self: center; color: var(--text-muted); font-size: 0.75rem; flex-shrink: 0;"></i>` : ''}
          `).join("")}
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 2.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
          <button class="btn btn-primary" id="btn-start-simulation" style="padding: 1rem 2.5rem; font-size: 1.1rem; font-weight: 700;">
            Comenzar Simulación <i class="fa-solid fa-play" style="margin-left: 0.5rem;"></i>
          </button>
        </div>
      </div>
    `;

    container.querySelector("#btn-back-to-sim-menu").addEventListener("click", () => {
      this.viewState = 'menu';
      this.render();
    });

    container.querySelector("#btn-start-simulation").addEventListener("click", () => {
      this.currentStageIndex = 0;
      this.selectedOptionIndex = -1;
      this.feedbackState = null;
      this.viewState = 'game';
      this.render();
    });
  },

  // 3. PANTALLA: JUEGO ACTIVO (ETAPAS Y DECISIONES)
  renderGame(container) {
    const scen = this.selectedSimulation;
    if (!scen) return;

    const currentStage = scen.stages[this.currentStageIndex];
    const totalStages = scen.stages.length;

    // Renders de la línea de tiempo horizontal superior
    let timelineHTML = "";
    scen.stages.forEach((stg, idx) => {
      let stateClass = "pending";
      let iconHTML = `<span class="timeline-num">${idx + 1}</span>`;

      if (idx < this.currentStageIndex) {
        stateClass = "completed";
        iconHTML = `<i class="fa-solid fa-circle-check"></i>`;
      } else if (idx === this.currentStageIndex) {
        stateClass = "active";
        iconHTML = `<i class="fa-solid fa-circle-dot pulsing-dot"></i>`;
      }

      timelineHTML += `
        <div class="sim-timeline-step ${stateClass}">
          <div class="sim-timeline-circle">${iconHTML}</div>
          <span class="sim-timeline-label">${stg.name}</span>
        </div>
      `;
    });

    // Renders de las opciones
    let optionsHTML = "";
    currentStage.options.forEach((opt, idx) => {
      const isSelected = this.selectedOptionIndex === idx;
      const isLocked = this.feedbackState !== null;
      const isCorrectOption = opt.correct;
      
      let stateClass = "";
      if (isSelected) stateClass = "selected";
      
      if (isLocked) {
        if (isCorrectOption) {
          stateClass = "correct-locked";
        } else if (isSelected) {
          stateClass = "incorrect-locked";
        } else {
          stateClass = "disabled-locked";
        }
      }

      optionsHTML += `
        <div class="sim-option-item ${stateClass}" data-idx="${idx}">
          <div class="sim-option-radio">
            <input type="radio" name="sim-choices" id="opt-${idx}" value="${idx}" ${isSelected ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>
          </div>
          <div class="sim-option-text-wrap">
            <label for="opt-${idx}">${opt.text}</label>
          </div>
        </div>
      `;
    });

    // Retroalimentación HTML
    let feedbackHTML = "";
    if (this.feedbackState === 'correct') {
      const fb = currentStage.options[this.selectedOptionIndex].feedback;
      feedbackHTML = `
        <div class="sim-feedback-box success">
          <h4 style="margin: 0 0 0.5rem 0; color: var(--success); font-weight: 700;"><i class="fa-solid fa-circle-check"></i> ¡Decisión Correcta!</h4>
          <p><strong>Razón Jurídica:</strong> ${fb.explanation}</p>
          <p><strong>Fundamento Legal:</strong> <span class="badge" style="background: var(--success); color: var(--white);">${fb.law}</span></p>
          <p><strong>Consecuencia Procesal:</strong> ${fb.consequence}</p>
          <div style="text-align: right; margin-top: 1.5rem;">
            <button class="btn btn-primary" id="btn-next-stage" style="padding: 0.6rem 1.5rem;">
              ${this.currentStageIndex === totalStages - 1 ? 'Finalizar Simulación' : 'Avanzar a Siguiente Etapa'} <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;
    } else if (this.feedbackState === 'incorrect') {
      const fb = currentStage.options[this.selectedOptionIndex].feedback;
      feedbackHTML = `
        <div class="sim-feedback-box error">
          <h4 style="margin: 0 0 0.5rem 0; color: var(--error); font-weight: 700;"><i class="fa-solid fa-triangle-exclamation"></i> Decisión Errada / Improcedente</h4>
          <p><strong>Razón del Error:</strong> ${fb.explanation}</p>
          <p><strong>Consecuencia Procesal:</strong> ${fb.consequence}</p>
          <p><strong>Fundamento Legal:</strong> <span class="badge" style="background: var(--error); color: var(--white);">${fb.law}</span></p>
          <div style="text-align: right; margin-top: 1.5rem;">
            <button class="btn btn-secondary" id="btn-retry-stage" style="padding: 0.6rem 1.5rem;">
              <i class="fa-solid fa-rotate-left"></i> Reintentar Decisión
            </button>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2 class="section-title" style="margin: 0;">${scen.title}</h2>
        <button class="btn btn-secondary" id="btn-abort-simulation"><i class="fa-solid fa-xmark"></i> Abortar Simulación</button>
      </div>

      <!-- Barra de flujo de etapas horizontal -->
      <div class="sim-timeline-flow-container">
        <div class="sim-timeline-flow">
          ${timelineHTML}
        </div>
      </div>

      <div class="sim-game-layout">
        <!-- Panel Izquierdo: Situación del caso -->
        <div class="sim-panel-situation">
          <div class="sim-panel-header">
            <h3><i class="fa-solid fa-scale-unbalanced"></i> Situación Procesal</h3>
            <span class="sim-stage-badge">Etapa: ${currentStage.name}</span>
          </div>
          <div class="sim-panel-body">
            <p style="font-size: 1.05rem; line-height: 1.6; color: var(--text-dark);">${currentStage.situation}</p>
          </div>
        </div>

        <!-- Panel Derecho: Pregunta y Opciones -->
        <div class="sim-panel-decisions">
          <h3 style="color: var(--primary-blue); font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">¿Qué actuación corresponde realizar?</h3>
          <p style="font-size: 0.95rem; font-weight: 600; margin-bottom: 1.25rem; color: var(--text-muted);">${currentStage.question}</p>

          <div class="sim-options-list">
            ${optionsHTML}
          </div>

          ${feedbackHTML}

          <!-- Botón de acción si no se ha evaluado -->
          ${this.feedbackState === null ? `
            <div style="text-align: right; margin-top: 1.5rem;">
              <button class="btn btn-primary" id="btn-evaluate-decision" ${this.selectedOptionIndex === -1 ? 'disabled style="opacity:0.5; cursor:default;"' : ''}>
                <i class="fa-solid fa-gavel"></i> Evaluar Decisión
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Vincular clic en opciones (sólo si no está bloqueado)
    if (this.feedbackState === null) {
      const optionItems = container.querySelectorAll(".sim-option-item");
      optionItems.forEach(item => {
        item.addEventListener("click", () => {
          const idx = parseInt(item.getAttribute("data-idx"), 10);
          this.selectedOptionIndex = idx;
          
          // Actualizar interfaz
          optionItems.forEach(i => i.classList.remove("selected"));
          item.classList.add("selected");
          item.querySelector("input").checked = true;

          // Habilitar botón de evaluar
          const evalBtn = document.getElementById("btn-evaluate-decision");
          if (evalBtn) {
            evalBtn.disabled = false;
            evalBtn.style.opacity = "1";
            evalBtn.style.cursor = "pointer";
          }
        });
      });

      // Vincular botón Evaluar
      const evalBtn = container.querySelector("#btn-evaluate-decision");
      if (evalBtn) {
        evalBtn.addEventListener("click", () => {
          const opt = currentStage.options[this.selectedOptionIndex];
          this.feedbackState = opt.correct ? 'correct' : 'incorrect';
          this.render();
        });
      }
    }

    // Vincular botón Siguiente Etapa
    const nextBtn = container.querySelector("#btn-next-stage");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (this.currentStageIndex === totalStages - 1) {
          this.viewState = 'complete';
        } else {
          this.currentStageIndex++;
          this.selectedOptionIndex = -1;
          this.feedbackState = null;
        }
        this.render();
      });
    }

    // Vincular botón Reintentar
    const retryBtn = container.querySelector("#btn-retry-stage");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        this.selectedOptionIndex = -1;
        this.feedbackState = null;
        this.render();
      });
    }

    // Vincular Abortar
    container.querySelector("#btn-abort-simulation").addEventListener("click", () => {
      if (confirm("¿Estás seguro de que deseas salir del simulador? Se perderá el progreso de este caso.")) {
        this.viewState = 'menu';
        this.render();
      }
    });
  },

  // 4. PANTALLA: CASO COMPLETADO CON ÉXITO
  renderComplete(container) {
    const scen = this.selectedSimulation;
    if (!scen) return;

    // Actualizar historial en LocalStorage
    let simCount = parseInt(localStorage.getItem('cogep_simulations_count') || '0', 10);
    simCount += 1;
    localStorage.setItem('cogep_simulations_count', simCount.toString());

    // Guardar ID del caso completado
    const completedList = JSON.parse(localStorage.getItem('cogep_completed_simulations') || '[]');
    if (!completedList.includes(scen.id)) {
      completedList.push(scen.id);
      localStorage.setItem('cogep_completed_simulations', JSON.stringify(completedList));
    }

    // Actualizar dashboard inmediatamente si la app tiene su instancia abierta
    if (window.appRouter) {
      window.appRouter.syncDashboardStats();
    }

    container.innerHTML = `
      <div class="sim-complete-box" style="text-align: center; padding: 4rem 2rem; background: var(--white); border-radius: var(--radius-md); box-shadow: var(--shadow-md); border: 1px solid var(--border-color); max-width: 700px; margin: 2rem auto;">
        <div class="sim-complete-icon" style="font-size: 4.5rem; color: var(--accent-gold); margin-bottom: 1.5rem; animation: bounce 1s infinite alternate;">
          <i class="fa-solid fa-trophy"></i>
        </div>
        <h2 style="color: var(--primary-blue); font-size: 2.2rem; font-weight: 800; margin-bottom: 1rem;">¡Simulación Finalizada!</h2>
        <h3 style="color: var(--text-dark); font-size: 1.3rem; font-weight: 600; margin-bottom: 1.5rem;">${scen.title}</h3>
        
        <p style="font-size: 1.05rem; line-height: 1.6; color: var(--text-dark); max-width: 550px; margin: 0 auto 2rem auto; text-align: justify;">
          ¡Excelente trabajo! Has completado satisfactoriamente todas las etapas procesales del caso práctico aplicando de manera óptima las disposiciones del Código Orgánico General de Procesos (COGEP) de Ecuador.
        </p>

        <div style="background-color: var(--light-grey); padding: 1.25rem; border-radius: var(--radius-sm); margin-bottom: 2.5rem; display: inline-block;">
          <span style="font-size: 0.95rem; color: var(--text-dark);">
            Total de simulaciones resueltas: <strong>${simCount}</strong>
          </span>
        </div>

        <div>
          <button class="btn btn-primary" id="btn-finish-sim-flow" style="padding: 1rem 2.5rem; font-size: 1.1rem; font-weight: 700;">
            Finalizar y Volver al Menú
          </button>
        </div>
      </div>
    `;

    container.querySelector("#btn-finish-sim-flow").addEventListener("click", () => {
      this.init();
    });
  }
};

window.CogepSimulator = CogepSimulator;
