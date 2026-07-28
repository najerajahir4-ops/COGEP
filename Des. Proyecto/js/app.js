/**
 * Enrutador Principal, Control de Vistas y Gestión de Sesiones (js/app.js)
 * Coordina la navegación SPA y conecta los diferentes módulos interactivos.
 */

const appRouter = {
  activeView: 'view-home',
  sidebarExpanded: true,
  activeProcedure: 'ordinario',

  init() {
    this.bindNavigation();
    this.bindSidebarToggle();
    this.updateSessionUI();
    this.renderProceduresGrid();
    
    // Iniciar módulos
    if (window.AdminPanel) window.AdminPanel.init();

    // Detectar scroll para conmutar la clase del header y los logos
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (header) {
        const isScrolled = header.classList.contains("header-scrolled");
        // Usamos histéresis para evitar parpadeos infinitos (flickering) por cambios de altura y layout.
        // Al bajar se activa a los 120px; al subir se desactiva bajo los 40px.
        if (!isScrolled && window.scrollY > 120) {
          header.classList.add("header-scrolled");
        } else if (isScrolled && window.scrollY < 40) {
          header.classList.remove("header-scrolled");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    // Cargar contenido inicial
    this.renderProceduresMenu();
    this.renderTimelineSteps(1);
    const resources = COGEP_RESOURCES_DATA[this.activeProcedure] || [];
    if (resources.length > 0) {
      this.renderResourceTabs(resources[0].id);
    } else {
      this.renderResourceTabs('aclaracion');
    }

    // Vincular botón de scroll a recursos
    const btnScroll = document.getElementById("btn-scroll-to-resources");
    if (btnScroll) {
      btnScroll.addEventListener("click", () => {
        const target = document.querySelector(".resources-section");
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Vincular flechas de scroll horizontal de procedimientos
    const scrollProcLeft = document.getElementById("scroll-proc-left");
    const scrollProcRight = document.getElementById("scroll-proc-right");
    const procTabsNav = document.getElementById("procedures-tabs-nav");
    
    if (scrollProcLeft && procTabsNav) {
      scrollProcLeft.addEventListener("click", () => {
        procTabsNav.scrollBy({ left: -200, behavior: 'smooth' });
      });
    }
    if (scrollProcRight && procTabsNav) {
      scrollProcRight.addEventListener("click", () => {
        procTabsNav.scrollBy({ left: 200, behavior: 'smooth' });
      });
    }

    // Cargar preferencias de configuración guardadas
    const savedDarkMode = localStorage.getItem("settings_dark_mode") === "true";
    if (savedDarkMode) {
      document.body.classList.add("dark-theme");
    }
    const savedFontSize = localStorage.getItem("settings_font_size") || "normal";
    if (savedFontSize === "grande") {
      document.documentElement.style.fontSize = "18px";
    }

    // Cerrar menús desplegables al hacer clic fuera
    document.addEventListener("click", () => {
      const headerDropdown = document.getElementById("header-profile-dropdown");
      const sidebarDropdown = document.getElementById("sidebar-profile-dropdown");
      if (headerDropdown) headerDropdown.classList.remove("show");
      if (sidebarDropdown) sidebarDropdown.classList.remove("show");
    });

    // Manejar clics de Landing Page
    const heroBtnStart = document.getElementById("hero-btn-start");
    if (heroBtnStart) {
      heroBtnStart.addEventListener("click", () => {
        const user = AuthService.getCurrentUser();
        if (user) {
          this.navigateTo("view-dashboard");
        } else {
          this.navigateTo("view-login");
        }
      });
    }

    const heroBtnDemo = document.getElementById("hero-btn-demo");
    if (heroBtnDemo) {
      heroBtnDemo.addEventListener("click", () => {
        this.activeProcedure = 'ordinario';
        this.renderProceduresMenu();
        this.renderTimelineSteps(1);
        this.renderResourceTabs('aclaracion');
        this.navigateTo("view-info");
      });
    }

    const heroScrollBtn = document.getElementById("hero-scroll-btn");
    if (heroScrollBtn) {
      heroScrollBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById("procedures-section-title");
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  },
  // 1. Enrutamiento SPA
  navigateTo(targetViewId) {
    const viewSection = document.getElementById(targetViewId);
    if (!viewSection) return;

    // Verificar accesos restringidos
    const user = AuthService.getCurrentUser();
    const restrictedViews = ['view-dashboard', 'view-simulator', 'view-eval', 'view-admin', 'view-profile', 'view-settings'];
    
    if (!user && restrictedViews.includes(targetViewId)) {
      alert("Debes iniciar sesión para acceder a este módulo educativo.");
      this.navigateTo("view-login");
      return;
    }

    // Restricciones de rol para Panel Admin
    if (targetViewId === 'view-admin' && user && user.role === 'estudiante') {
      alert("Acceso denegado: Este panel está reservado para docentes y administradores.");
      this.navigateTo("view-dashboard");
      return;
    }

    // Cargar datos dinámicos si va a Perfil
    if (targetViewId === 'view-profile' && user) {
      document.getElementById("profile-avatar-large").innerText = user.name.charAt(0).toUpperCase();
      document.getElementById("profile-name-title").innerText = user.name;
      
      const roleBadge = document.getElementById("profile-role-badge");
      if (roleBadge) {
        roleBadge.innerText = user.role.toUpperCase();
        roleBadge.className = `badge-role badge-role-${user.role}`;
      }

      document.getElementById("profile-input-name").value = user.name;
      document.getElementById("profile-input-email").value = user.email;
      document.getElementById("profile-input-role").value = user.role;
    }

    // Cargar datos dinámicos si va a Ajustes
    if (targetViewId === 'view-settings') {
      document.getElementById("settings-dark-mode").checked = document.body.classList.contains("dark-theme");
      document.getElementById("settings-sounds").checked = localStorage.getItem("settings_sounds") !== "false";
      document.getElementById("settings-notifications").checked = localStorage.getItem("settings_notifications") !== "false";
      document.getElementById("settings-font-size").value = localStorage.getItem("settings_font_size") || "normal";

      // Vincular envío de formulario de ajustes
      const formSettings = document.getElementById("form-settings");
      if (formSettings && !formSettings.dataset.bound) {
        formSettings.dataset.bound = "true";
        formSettings.addEventListener("submit", (e) => {
          e.preventDefault();
          const darkMode = document.getElementById("settings-dark-mode").checked;
          const sounds = document.getElementById("settings-sounds").checked;
          const notifications = document.getElementById("settings-notifications").checked;
          const fontSize = document.getElementById("settings-font-size").value;

          // Guardar tema oscuro
          if (darkMode) {
            document.body.classList.add("dark-theme");
            localStorage.setItem("settings_dark_mode", "true");
          } else {
            document.body.classList.remove("dark-theme");
            localStorage.setItem("settings_dark_mode", "false");
          }

          // Guardar tamaño letra
          if (fontSize === "grande") {
            document.documentElement.style.fontSize = "18px";
            localStorage.setItem("settings_font_size", "grande");
          } else {
            document.documentElement.style.fontSize = "16px";
            localStorage.setItem("settings_font_size", "normal");
          }

          localStorage.setItem("settings_sounds", sounds ? "true" : "false");
          localStorage.setItem("settings_notifications", notifications ? "true" : "false");

          alert("Preferencias guardadas exitosamente.");
          this.navigateTo("view-dashboard");
        });
      }
    }

    // Ocultar todas las secciones
    const allViews = document.querySelectorAll(".view-section");
    allViews.forEach(view => {
      view.classList.remove("active");
    });

    // Mostrar sección destino
    viewSection.classList.add("active");
    this.activeView = targetViewId;

    // Actualizar estados activos de los enlaces de navegación
    this.updateNavLinksState(targetViewId);

    // Si entra al simulador, inicializar o reiniciar
    if (targetViewId === 'view-simulator' && window.CogepSimulator) {
      window.CogepSimulator.currentNodeKey = 'start';
      window.CogepSimulator.init();
    }

    // Si entra a evaluaciones, iniciar módulo de quiz
    if (targetViewId === 'view-eval' && window.CogepQuiz) {
      window.CogepQuiz.init();
    }

    // Scroll al inicio
    document.getElementById("main-view-container").scrollTop = 0;
  },

  updateNavLinksState(viewId) {
    // Actualizar nav global
    const globalLinks = document.querySelectorAll("#nav-global-menu .nav-link");
    globalLinks.forEach(link => {
      if (link.getAttribute("data-target") === viewId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Actualizar sidebar links
    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    sidebarLinks.forEach(link => {
      if (link.getAttribute("data-target") === viewId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  },

  bindNavigation() {
    // Enlaces de navegación global
    const navLinks = document.querySelectorAll("#nav-global-menu .nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.currentTarget.getAttribute("data-target");
        if (target === "view-info") {
          this.activeProcedure = 'ordinario';
          this.renderProceduresMenu();
          this.renderTimelineSteps(1);
          this.renderResourceTabs('aclaracion');
        }
        this.navigateTo(target);
      });
    });

    // Logo nav
    const logoLink = document.getElementById("nav-brand-logo");
    if (logoLink) {
      logoLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigateTo("view-home");
      });
    }

    // Enlaces del sidebar
    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    sidebarLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.currentTarget.getAttribute("data-target");
        if (target === "view-info") {
          this.activeProcedure = 'ordinario';
          this.renderProceduresMenu();
          this.renderTimelineSteps(1);
          this.renderResourceTabs('aclaracion');
        }
        this.navigateTo(target);
      });
    });

    // Botones de inicio de sesión / registro en header
    const btnToLogin = document.getElementById("btn-to-login");
    const btnToRegister = document.getElementById("btn-to-register");

    if (btnToLogin) {
      btnToLogin.addEventListener("click", () => this.navigateTo("view-login"));
    }
    if (btnToRegister) {
      btnToRegister.addEventListener("click", () => this.navigateTo("view-register"));
    }

    // Enlaces cruzados en formularios
    const goRegister = document.getElementById("link-go-register");
    const goLogin = document.getElementById("link-go-login");

    if (goRegister) {
      goRegister.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigateTo("view-register");
      });
    }
    if (goLogin) {
      goLogin.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigateTo("view-login");
      });
    }
  },

  // 2. Control del Sidebar colapsable
  bindSidebarToggle() {
    const sidebar = document.getElementById("app-sidebar");
    const toggleBtn = document.getElementById("sidebar-toggle");
    const toggleIcon = document.getElementById("sidebar-toggle-icon");

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        this.sidebarExpanded = !this.sidebarExpanded;
        sidebar.classList.toggle("collapsed", !this.sidebarExpanded);
        
        if (this.sidebarExpanded) {
          toggleIcon.className = "fa-solid fa-chevron-left";
        } else {
          toggleIcon.className = "fa-solid fa-list";
        }
      });
    }
  },

  // 3. UI Dinámica de Sesión
  updateSessionUI() {
    const user = AuthService.getCurrentUser();
    const navAuth = document.getElementById("nav-auth-container");
    const sidebar = document.getElementById("app-sidebar");
    const adminLink = document.getElementById("sidebar-admin-item");

    if (user) {
      // Inyectar Avatar y Dropdown en Header
      navAuth.innerHTML = `
        <div class="profile-dropdown-wrapper">
          <div class="header-avatar" id="header-avatar-trigger">${user.name.charAt(0).toUpperCase()}</div>
          <div class="profile-dropdown-menu" id="header-profile-dropdown">
            <div class="dropdown-user-info">
              <span class="dropdown-username">${user.name}</span>
              <span class="dropdown-email">${user.email}</span>
            </div>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item" id="dropdown-header-btn-profile">
              <i class="fa-solid fa-user"></i> Ver Perfil
            </button>
            <button class="dropdown-item" id="dropdown-header-btn-settings">
              <i class="fa-solid fa-gear"></i> Ajustes
            </button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item logout-item" id="dropdown-header-btn-logout">
              <i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
            </button>
          </div>
        </div>
      `;

      // Evento para alternar el dropdown del header
      const headerAvatarTrigger = document.getElementById("header-avatar-trigger");
      const headerDropdown = document.getElementById("header-profile-dropdown");
      if (headerAvatarTrigger && headerDropdown) {
        headerAvatarTrigger.addEventListener("click", (e) => {
          e.stopPropagation();
          headerDropdown.classList.toggle("show");
          // Ocultar el del sidebar por si acaso
          const sidebarDropdown = document.getElementById("sidebar-profile-dropdown");
          if (sidebarDropdown) sidebarDropdown.classList.remove("show");
        });
      }

      // Eventos de botones del header dropdown
      const btnHeaderProfile = document.getElementById("dropdown-header-btn-profile");
      const btnHeaderSettings = document.getElementById("dropdown-header-btn-settings");
      const btnHeaderLogout = document.getElementById("dropdown-header-btn-logout");

      if (btnHeaderProfile) {
        btnHeaderProfile.addEventListener("click", () => {
          headerDropdown.classList.remove("show");
          this.navigateTo("view-profile");
        });
      }
      if (btnHeaderSettings) {
        btnHeaderSettings.addEventListener("click", () => {
          headerDropdown.classList.remove("show");
          this.navigateTo("view-settings");
        });
      }
      if (btnHeaderLogout) {
        btnHeaderLogout.addEventListener("click", async () => {
          headerDropdown.classList.remove("show");
          await AuthService.logout();
          this.updateSessionUI();
          this.navigateTo("view-home");
        });
      }

      // Mostrar Sidebar
      sidebar.style.display = "flex";

      // Actualizar tarjeta de usuario en sidebar y su dropdown interno
      document.getElementById("sidebar-username").innerText = user.name;
      document.getElementById("sidebar-userrole").innerText = user.role.toUpperCase();
      document.getElementById("sidebar-user-avatar").innerText = user.name.charAt(0).toUpperCase();

      // Actualizar datos del dropdown del sidebar
      const sidebarUsername = document.getElementById("dropdown-sidebar-username");
      const sidebarEmail = document.getElementById("dropdown-sidebar-email");
      if (sidebarUsername) sidebarUsername.innerText = user.name;
      if (sidebarEmail) sidebarEmail.innerText = user.email;

      // Evento para alternar el dropdown del sidebar (se vincula sólo una vez)
      const sidebarUserCard = document.getElementById("sidebar-user-card");
      const sidebarDropdown = document.getElementById("sidebar-profile-dropdown");
      
      if (sidebarUserCard && sidebarDropdown && !sidebarUserCard.dataset.bound) {
        sidebarUserCard.dataset.bound = "true";
        sidebarUserCard.addEventListener("click", (e) => {
          // Si el clic es en un botón de acción del menú, no propagar/alternar
          if (e.target.closest('.dropdown-item')) return;
          e.stopPropagation();
          sidebarDropdown.classList.toggle("show");
          // Ocultar el del header por si acaso
          if (headerDropdown) headerDropdown.classList.remove("show");
        });

        // Eventos de botones del sidebar dropdown
        const btnSidebarProfile = document.getElementById("dropdown-sidebar-btn-profile");
        const btnSidebarSettings = document.getElementById("dropdown-sidebar-btn-settings");
        const btnSidebarLogout = document.getElementById("dropdown-sidebar-btn-logout");

        if (btnSidebarProfile) {
          btnSidebarProfile.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebarDropdown.classList.remove("show");
            this.navigateTo("view-profile");
          });
        }
        if (btnSidebarSettings) {
          btnSidebarSettings.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebarDropdown.classList.remove("show");
            this.navigateTo("view-settings");
          });
        }
        if (btnSidebarLogout) {
          btnSidebarLogout.addEventListener("click", async (e) => {
            e.stopPropagation();
            sidebarDropdown.classList.remove("show");
            await AuthService.logout();
            this.updateSessionUI();
            this.navigateTo("view-home");
          });
        }
      }

      // Mostrar/Ocultar Panel de Admin de acuerdo al rol
      if (user.role === 'administrador' || user.role === 'docente') {
        adminLink.style.display = "block";
      } else {
        adminLink.style.display = "none";
      }

      // Sincronizar estadísticas en dashboard
      this.syncDashboardStats();
    } else {
      // Sesión inactiva
      navAuth.innerHTML = `
        <button class="btn btn-secondary" id="btn-to-login">Iniciar Sesión</button>
        <button class="btn btn-primary" id="btn-to-register">Registrarse</button>
      `;
      document.getElementById("btn-to-login").addEventListener("click", () => this.navigateTo("view-login"));
      document.getElementById("btn-to-register").addEventListener("click", () => this.navigateTo("view-register"));

      // Ocultar Sidebar
      sidebar.style.display = "none";
      adminLink.style.display = "none";
      
      const sidebarDropdown = document.getElementById("sidebar-profile-dropdown");
      if (sidebarDropdown) sidebarDropdown.classList.remove("show");
    }
  },

  syncDashboardStats() {
    const user = AuthService.getCurrentUser();
    if (!user) return;

    // Actualizar cantidad de simulaciones
    const simCount = localStorage.getItem('cogep_simulations_count') || '0';
    const dashSim = document.getElementById("dash-sim-count");
    if (dashSim) dashSim.innerText = simCount;

    // Actualizar nota promedio
    let scores = [];
    Object.keys(COGEP_QUIZZES).forEach(key => {
      const s = localStorage.getItem(`cogep_quiz_${key}_score`);
      if (s) scores.push(parseInt(s, 10));
    });
    
    const dashScore = document.getElementById("dash-eval-score");
    if (dashScore) {
      if (scores.length > 0) {
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        dashScore.innerText = `${avg}%`;
      } else {
        dashScore.innerText = "--";
      }
    }
  },

  // 4. Renderización del Módulo de Procedimientos del COGEP
  renderProceduresGrid() {
    const container = document.getElementById("procedures-grid-container");
    if (!container) return;

    container.innerHTML = "";
    COGEP_PROCEDURES.forEach(proc => {
      const card = document.createElement("div");
      card.className = "procedure-card";
      card.innerHTML = `
        <div class="procedure-card-image">
          <img src="${proc.image}" alt="${proc.title}">
        </div>
        <div class="procedure-card-body">
          <h3>${proc.title}</h3>
          <span class="article-badge">${proc.articles}</span>
          <p>${proc.description}</p>
          <a href="#" class="card-action" data-id="${proc.id}">
            Estudiar procedimiento <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      `;

      card.querySelector(".card-action").addEventListener("click", (e) => {
        e.preventDefault();
        const procId = e.currentTarget.getAttribute("data-id");
        this.activeProcedure = procId;
        this.renderProceduresMenu();
        
        // Cargar primera etapa del procedimiento
        const stages = COGEP_STAGES[procId] || [];
        if (stages.length > 0) {
          this.renderTimelineSteps(stages[0].number);
        } else {
          document.getElementById("timeline-steps-list").innerHTML = "<li>No hay etapas cargadas</li>";
          document.getElementById("stage-content-card").innerHTML = "<p>No hay contenido disponible</p>";
        }

        // Cargar primer recurso
        const resources = COGEP_RESOURCES_DATA[procId] || [];
        if (resources.length > 0) {
          this.renderResourceTabs(resources[0].id);
        } else {
          document.getElementById("resources-tabs-container").innerHTML = "";
          document.getElementById("resource-detail-box").innerHTML = "<p>No hay recursos disponibles</p>";
        }

        this.navigateTo("view-info");
      });

      container.appendChild(card);
    });
  },

  // 4b. Renderización del menú bar de procedimientos (pestañas superiores en view-info)
  renderProceduresMenu() {
    const tabsContainer = document.getElementById("procedures-tabs-nav");
    if (!tabsContainer) return;

    tabsContainer.innerHTML = "";
    COGEP_PROCEDURES.forEach(proc => {
      const isActive = proc.id === this.activeProcedure;
      const tab = document.createElement("div");
      tab.className = `procedure-nav-tab ${isActive ? 'active' : ''}`;
      tab.innerHTML = `<i class="fa-solid fa-scale-balanced"></i> ${proc.title}`;
      
      tab.addEventListener("click", () => {
        this.activeProcedure = proc.id;
        this.renderProceduresMenu();
        
        // Reset a etapa 1 de este procedimiento
        const stages = COGEP_STAGES[proc.id] || [];
        if (stages.length > 0) {
          this.renderTimelineSteps(stages[0].number);
        } else {
          document.getElementById("timeline-steps-list").innerHTML = "<li>No hay etapas cargadas</li>";
          document.getElementById("stage-content-card").innerHTML = "<p>No hay contenido disponible</p>";
        }

        // Reset a recurso 1 de este procedimiento
        const resources = COGEP_RESOURCES_DATA[proc.id] || [];
        if (resources.length > 0) {
          this.renderResourceTabs(resources[0].id);
        } else {
          document.getElementById("resources-tabs-container").innerHTML = "";
          document.getElementById("resource-detail-box").innerHTML = "<p>No hay recursos disponibles</p>";
        }
      });

      tabsContainer.appendChild(tab);
    });
  },

  // 5. Módulo Informativo: Timeline e inyección de datos sin resumir
  renderTimelineSteps(activeStepNum) {
    const listContainer = document.getElementById("timeline-steps-list");
    if (!listContainer) return;

    listContainer.innerHTML = "";
    const stages = COGEP_STAGES[this.activeProcedure] || [];
    stages.forEach(stage => {
      const isActive = stage.number === activeStepNum;
      const li = document.createElement("li");
      li.className = `step-nav-item ${isActive ? 'active' : ''}`;
      li.title = stage.title;
      li.innerHTML = `
        <span class="step-nav-num">${stage.number}</span>
        <span class="step-nav-text">${stage.title}</span>
      `;

      li.addEventListener("click", () => {
        this.renderTimelineSteps(stage.number);
        this.renderStageDetail(stage);
      });

      listContainer.appendChild(li);
    });

    // Cargar el detalle del paso actual
    const currentStage = stages.find(s => s.number === activeStepNum);
    if (currentStage) {
      this.renderStageDetail(currentStage);
    }
  },

  renderStageDetail(stage) {
    const card = document.getElementById("stage-content-card");
    if (!card) return;

    card.innerHTML = `
      <div class="step-header">
        <div>
          <span class="step-badge">Etapa Procesal ${stage.number}</span>
          <h3 style="color: var(--primary-blue); font-size: 1.6rem; margin-top: 0.5rem; font-weight: 800;">${stage.title}</h3>
        </div>
        <span style="font-weight: 700; color: var(--accent-gold); font-size: 1.1rem;">${stage.article}</span>
      </div>
      <div class="step-meta">
        <div class="step-meta-item"><i class="fa-regular fa-clock"></i> Término: <strong>${stage.timeLimit}</strong></div>
        <div class="step-meta-item"><i class="fa-solid fa-gavel"></i> Ley: <strong>COGEP Ecuador</strong></div>
      </div>
      <div class="step-body">
        <p style="margin-bottom: 1.5rem; font-style: italic; color: var(--text-muted);">${stage.description}</p>
        <div style="border-top: 1px solid var(--light-grey); padding-top: 1.5rem;">
          ${stage.fullContent}
        </div>
      </div>
    `;
  },

  // 6. Módulo Informativo: Pestañas de Recursos
  renderResourceTabs(activeResourceId) {
    const tabsContainer = document.getElementById("resources-tabs-container");
    const detailBox = document.getElementById("resource-detail-box");
    if (!tabsContainer || !detailBox) return;

    // Actualizar título de la sección dinámicamente
    const resourcesTitle = document.getElementById("resources-section-title");
    if (resourcesTitle) {
      const procName = COGEP_PROCEDURES.find(p => p.id === this.activeProcedure)?.title || "Procedimiento";
      resourcesTitle.innerHTML = `<i class="fa-solid fa-gavel"></i> Recursos Procedentes en el ${procName}`;
    }

    tabsContainer.innerHTML = "";
    const resources = COGEP_RESOURCES_DATA[this.activeProcedure] || [];
    resources.forEach(res => {
      const isActive = res.id === activeResourceId;
      const tab = document.createElement("div");
      tab.className = `resource-tab ${isActive ? 'active' : ''}`;
      tab.innerText = res.title;
      
      tab.addEventListener("click", () => {
        this.renderResourceTabs(res.id);
      });

      tabsContainer.appendChild(tab);
    });

    const activeRes = resources.find(r => r.id === activeResourceId);
    if (activeRes) {
      detailBox.innerHTML = `
        <div class="resource-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.8rem; margin-bottom: 1rem;">
          <h4 style="margin: 0; color: var(--primary-blue); font-size: 1.3rem; font-weight: 700;">Recurso de ${activeRes.title}</h4>
          <span class="badge" style="background-color: var(--accent-gold); color: var(--white); font-weight: 600; padding: 0.3rem 0.6rem; border-radius: 4px;">${activeRes.article}</span>
        </div>
        <div class="resource-body" style="font-size: 0.95rem; line-height: 1.6; text-align: justify; color: var(--text-dark);">
          ${activeRes.fullContent || `<p>${activeRes.desc}</p>`}
        </div>
      `;
    }
  }
};

// Auto-inicializar en la carga del documento
document.addEventListener("DOMContentLoaded", () => {
  window.appRouter = appRouter;
  appRouter.init();
});
