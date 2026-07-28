/**
 * Enrutador Principal, Control de Vistas y Gestión de Sesiones (js/app.js)
 * Coordina la navegación SPA y conecta los diferentes módulos interactivos.
 */

const appRouter = {
  activeView: localStorage.getItem('cogep_active_view') || 'view-home',
  sidebarExpanded: true,
  activeProcedure: 'ordinario',

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
      } catch (e) { console.error(e); }
    }
    if (savedQuizzes) {
      try {
        const parsedQuizzes = JSON.parse(savedQuizzes);
        Object.keys(COGEP_QUIZZES).forEach(key => delete COGEP_QUIZZES[key]);
        Object.assign(COGEP_QUIZZES, parsedQuizzes);
      } catch (e) { console.error(e); }
    }

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

    // Cargar preferencias del usuario actual
    this.applyUserPreferences();

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

  updateHeroVideo(theme) {
    const video = document.getElementById("hero-video");
    if (!video) return;
    
    let videoName = "fondo_div_hero_din.mp4"; // Vino (default)
    
    if (theme === "azul") {
      videoName = "fondo_div_hero_din_azul.mp4";
    } else if (theme === "verde") {
      videoName = "fondo_div_hero_din_verde.mp4";
    }
    
    const currentSrc = video.getAttribute("src");
    const newSrc = "images/" + videoName;
    
    if (currentSrc !== newSrc) {
      video.setAttribute("src", newSrc);
      video.load(); // Forzar al navegador a recargar el video
    }
  },
  
  // 0. Aplicar Preferencias de Interfaz por Usuario
  applyUserPreferences() {
    const user = AuthService.getCurrentUser();
    
    // Si no hay usuario activo, restablecer al tema claro y tamaño de fuente normal por defecto
    if (!user) {
      document.body.classList.remove("dark-theme");
      document.body.removeAttribute("data-theme");
      document.documentElement.style.fontSize = "16px";
      return;
    }
    
    const suffix = "_" + user.email;

    const savedDarkMode = localStorage.getItem("settings_dark_mode" + suffix) === "true";
    if (savedDarkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    const savedFontSize = localStorage.getItem("settings_font_size" + suffix) || "normal";
    if (savedFontSize === "grande") {
      document.documentElement.style.fontSize = "18px";
    } else {
      document.documentElement.style.fontSize = "16px";
    }

    const savedTheme = localStorage.getItem("settings_color_theme" + suffix) || "vino";
    document.body.setAttribute("data-theme", savedTheme);
    this.updateHeroVideo(savedTheme);
  },

  // 1. Enrutamiento SPA
  navigateTo(targetViewId) {
    const viewSection = document.getElementById(targetViewId);
    if (!viewSection) return;

    // Verificar accesos restringidos
    const user = AuthService.getCurrentUser();
    const restrictedViews = ['view-dashboard', 'view-simulator', 'view-eval', 'view-admin', 'view-profile', 'view-settings'];
    
    if (!user && restrictedViews.includes(targetViewId)) {
      Toast.show("Debes iniciar sesión para acceder a este módulo educativo.", "error");
      this.navigateTo("view-login");
      return;
    }

    // Restricciones de rol para Panel Admin
    if (targetViewId === 'view-admin' && user && user.role === 'estudiante') {
      Toast.show("Acceso denegado: Este panel está reservado para docentes y administradores.", "error");
      this.navigateTo("view-dashboard");
      return;
    }

    // Cargar datos dinámicos si va a Perfil
    if (targetViewId === 'view-profile' && user) {
      const avatarLarge = document.getElementById("profile-avatar-large");
      if (user.avatar) {
        avatarLarge.innerHTML = `<img src="${user.avatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        avatarLarge.style.padding = "0";
      } else {
        avatarLarge.innerText = user.name.charAt(0).toUpperCase();
        avatarLarge.style.padding = "";
      }
      document.getElementById("profile-name-title").innerText = user.name;
      
      const roleBadge = document.getElementById("profile-role-badge");
      if (roleBadge) {
        roleBadge.innerText = user.role.toUpperCase();
        roleBadge.className = `badge-role badge-role-${user.role}`;
      }

      document.getElementById("profile-input-name").value = user.name;
      document.getElementById("profile-input-email").value = user.email;
      document.getElementById("profile-input-role").value = user.role;

      // Vincular botón de cambiar foto de perfil
      const btnChangeAvatar = document.getElementById("btn-change-avatar");
      if (btnChangeAvatar && !btnChangeAvatar.dataset.bound) {
        btnChangeAvatar.dataset.bound = "true";
        btnChangeAvatar.addEventListener("click", () => {
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = "image/*";
          fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const img = new Image();
                img.onload = async () => {
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  const size = 150; // Redimensionar a 150x150 píxeles para optimizar memoria
                  canvas.width = size;
                  canvas.height = size;
                  
                  // Recortar en forma de cuadrado centrado
                  let srcX = 0;
                  let srcY = 0;
                  let srcWidth = img.width;
                  let srcHeight = img.height;
                  
                  if (img.width > img.height) {
                    srcWidth = img.height;
                    srcX = (img.width - img.height) / 2;
                  } else if (img.height > img.width) {
                    srcHeight = img.width;
                    srcY = (img.height - img.width) / 2;
                  }
                  
                  ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, size, size);
                  const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8); // Compresión de calidad JPEG a 80%
                  
                  // Subir y guardar
                  const success = await AuthService.updateAvatar(resizedBase64);
                  if (success) {
                    avatarLarge.innerHTML = `<img src="${resizedBase64}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                    avatarLarge.style.padding = "0";
                    appRouter.updateSessionUI(); // Refrescar los otros avatars en sidebar y header
                    Toast.show("Foto de perfil actualizada exitosamente.", "success");
                  } else {
                    Toast.show("No se pudo actualizar la foto de perfil en el servidor.", "error");
                  }
                };
                img.src = e.target.result;
              };
              reader.readAsDataURL(file);
            }
          };
          fileInput.click();
        });
      }
    }

    // Cargar datos dinámicos si va a Ajustes
    if (targetViewId === 'view-settings') {
      const emailSuffix = user ? "_" + user.email : "";

      document.getElementById("settings-dark-mode").checked = document.body.classList.contains("dark-theme");
      document.getElementById("settings-notifications").checked = localStorage.getItem("settings_notifications" + emailSuffix) !== "false";
      document.getElementById("settings-font-size").value = localStorage.getItem("settings_font_size" + emailSuffix) || "normal";
      
      const savedTheme = localStorage.getItem("settings_color_theme" + emailSuffix) || "vino";
      document.getElementById("settings-theme").value = savedTheme;

      // Vincular envío de formulario de ajustes
      const formSettings = document.getElementById("form-settings");
      if (formSettings && !formSettings.dataset.bound) {
        formSettings.dataset.bound = "true";
        formSettings.addEventListener("submit", (e) => {
          e.preventDefault();
          const darkMode = document.getElementById("settings-dark-mode").checked;
          const notifications = document.getElementById("settings-notifications").checked;
          const fontSize = document.getElementById("settings-font-size").value;
          const colorTheme = document.getElementById("settings-theme").value;

          const currentUser = AuthService.getCurrentUser();
          const suffix = currentUser ? "_" + currentUser.email : "";

          // Guardar tema oscuro
          if (darkMode) {
            document.body.classList.add("dark-theme");
            localStorage.setItem("settings_dark_mode" + suffix, "true");
          } else {
            document.body.classList.remove("dark-theme");
            localStorage.setItem("settings_dark_mode" + suffix, "false");
          }

          // Guardar tamaño letra
          if (fontSize === "grande") {
            document.documentElement.style.fontSize = "18px";
            localStorage.setItem("settings_font_size" + suffix, "grande");
          } else {
            document.documentElement.style.fontSize = "16px";
            localStorage.setItem("settings_font_size" + suffix, "normal");
          }

          localStorage.setItem("settings_notifications" + suffix, notifications ? "true" : "false");

          // Guardar tema de colores
          document.body.setAttribute("data-theme", colorTheme);
          localStorage.setItem("settings_color_theme" + suffix, colorTheme);
          
          // Actualizar video del hero si estamos en home
          appRouter.updateHeroVideo(colorTheme);

          Toast.show("Preferencias guardadas exitosamente.", "success");
          this.navigateTo("view-dashboard");
        });
      }
    }
 
    // Personalizar y refrescar Panel de Administración/Estudiantes según rol
    if (targetViewId === 'view-admin' && user) {
      const panelTitle = document.getElementById("admin-panel-title");
      const panelDesc = document.getElementById("admin-panel-desc");
      if (user.role === 'docente') {
        if (panelTitle) panelTitle.innerText = "Panel de Estudiantes";
        if (panelDesc) panelDesc.innerHTML = "Panel exclusivo para <strong>Docentes</strong>. Permite visualizar a los estudiantes registrados en el sistema.";
      } else {
        if (panelTitle) panelTitle.innerText = "Panel de Administración de Usuarios";
        if (panelDesc) panelDesc.innerHTML = "Panel exclusivo para perfiles de <strong>Administrador</strong>. Permite realizar operaciones CRUD para gestionar la base de usuarios del sistema.";
      }
      if (window.AdminPanel) {
        window.AdminPanel.renderUsers();
        window.AdminPanel.renderQuestions();
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
    localStorage.setItem('cogep_active_view', targetViewId);

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
      // Calcular HTML para el avatar del header
      const headerAvatarHTML = user.avatar 
        ? `<img src="${user.avatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` 
        : user.name.charAt(0).toUpperCase();

      // Inyectar Avatar y Dropdown en Header
      navAuth.innerHTML = `
        <div class="profile-dropdown-wrapper">
          <div class="header-avatar" id="header-avatar-trigger" style="display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 0;">${headerAvatarHTML}</div>
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
          this.applyUserPreferences();
          this.navigateTo("view-home");
        });
      }

      // Mostrar Sidebar
      sidebar.style.display = "flex";

      // Actualizar tarjeta de usuario en sidebar y su dropdown interno
      document.getElementById("sidebar-username").innerText = user.name;
      document.getElementById("sidebar-userrole").innerText = user.role.toUpperCase();
      
      const sidebarAvatarEl = document.getElementById("sidebar-user-avatar");
      if (sidebarAvatarEl) {
        if (user.avatar) {
          sidebarAvatarEl.innerHTML = `<img src="${user.avatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
          sidebarAvatarEl.style.padding = "0";
          sidebarAvatarEl.style.display = "flex";
          sidebarAvatarEl.style.alignItems = "center";
          sidebarAvatarEl.style.justifyContent = "center";
          sidebarAvatarEl.style.overflow = "hidden";
        } else {
          sidebarAvatarEl.innerText = user.name.charAt(0).toUpperCase();
          sidebarAvatarEl.style.padding = "";
          sidebarAvatarEl.style.display = "";
        }
      }

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
            this.applyUserPreferences();
            this.navigateTo("view-home");
          });
        }
      }

      // Mostrar/Ocultar Panel de Admin de acuerdo al rol
      if (user.role === 'administrador' || user.role === 'docente') {
        adminLink.style.display = "block";
        const sidebarText = adminLink.querySelector(".sidebar-text");
        const sidebarIcon = adminLink.querySelector("i");
        if (user.role === 'docente') {
          if (sidebarText) sidebarText.innerText = "Panel de Estudiantes";
          if (sidebarIcon) sidebarIcon.className = "fa-solid fa-users-gear";
        } else {
          if (sidebarText) sidebarText.innerText = "Panel Admin";
          if (sidebarIcon) sidebarIcon.className = "fa-solid fa-user-gear";
        }
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

    const container = document.getElementById("view-dashboard");
    if (!container) return;

    if (user.role === 'docente' || user.role === 'administrador') {
      this.renderDocenteDashboard(container);
    } else {
      this.renderStudentDashboard(container);
    }
  },

  async fetchStats() {
    const token = localStorage.getItem('cogep_token') || sessionStorage.getItem('cogep_token');
    if (!token) return null;
    try {
      const apiUrl = typeof getDynamicApiUrl === 'function' ? getDynamicApiUrl() : 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/attempts/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        return await response.json();
      }
    } catch(e) {
      console.warn("Error al cargar estadísticas del servidor", e);
    }
    return null;
  },

  renderStudentDashboard(container) {
    const simCount = localStorage.getItem('cogep_simulations_count') || '0';
    let scores = [];
    Object.keys(COGEP_QUIZZES).forEach(key => {
      const s = localStorage.getItem(`cogep_quiz_${key}_score`);
      if (s) scores.push(parseInt(s, 10));
    });
    
    let avgScoreText = "--";
    if (scores.length > 0) {
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      avgScoreText = `${avg}%`;
    }

    const procCount = localStorage.getItem('cogep_studied_procedures_count') || '1';

    container.innerHTML = `
      <h2 class="section-title">Mi Progreso Académico</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
          <div style="background-color: var(--white); padding: 1.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid rgba(0,0,0,0.05); text-align: center;">
              <i class="fa-solid fa-graduation-cap" style="font-size: 2rem; color: var(--accent-gold); margin-bottom: 0.5rem;"></i>
              <h3 style="font-size: 0.9rem; color: var(--text-muted);">Procedimientos Estudiados</h3>
              <p style="font-size: 2rem; font-weight: 700; color: var(--primary-blue);" id="dash-proc-count">${procCount} / 5</p>
          </div>
          <div style="background-color: var(--white); padding: 1.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid rgba(0,0,0,0.05); text-align: center;">
              <i class="fa-solid fa-gamepad" style="font-size: 2rem; color: var(--accent-gold); margin-bottom: 0.5rem;"></i>
              <h3 style="font-size: 0.9rem; color: var(--text-muted);">Simulaciones Completadas</h3>
              <p style="font-size: 2rem; font-weight: 700; color: var(--primary-blue);" id="dash-sim-count">${simCount}</p>
          </div>
          <div style="background-color: var(--white); padding: 1.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid rgba(0,0,0,0.05); text-align: center;">
              <i class="fa-solid fa-square-poll-vertical" style="font-size: 2rem; color: var(--accent-gold); margin-bottom: 0.5rem;"></i>
              <h3 style="font-size: 0.9rem; color: var(--text-muted);">Promedio de Evaluaciones</h3>
              <p style="font-size: 2rem; font-weight: 700; color: var(--primary-blue);" id="dash-eval-score">${avgScoreText}</p>
          </div>
      </div>

      <div style="background-color: var(--white); border-radius: var(--radius-md); padding: 2.5rem; border: 1px solid rgba(166, 122, 83, 0.15); box-shadow: var(--shadow-sm);">
          <h3 style="color: var(--primary-blue); margin-bottom: 1rem;">Bienvenido al Portal de Simulación COGEP</h3>
          <p style="margin-bottom: 1.5rem;">Para comenzar a estudiar, te sugerimos seguir las siguientes actividades dinámicas:</p>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="display: flex; gap: 1rem; align-items: center; padding: 1rem; background-color: var(--light-grey); border-radius: var(--radius-sm);">
                  <span style="font-size: 1.5rem; color: var(--accent-gold); font-weight: 800;">1</span>
                  <div style="flex: 1;">
                      <h4 style="font-size: 0.95rem; color: var(--primary-blue);">Revisar el Módulo Informativo</h4>
                      <p style="font-size: 0.85rem; color: var(--text-muted);">Estudia el Procedimiento Ordinario de forma cronológica, revisa los requisitos de la Demanda y analiza cómo estructurar el resto de actos procesales.</p>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="appRouter.navigateTo('view-info')">Ir a Estudiar</button>
              </div>
              <div style="display: flex; gap: 1rem; align-items: center; padding: 1rem; background-color: var(--light-grey); border-radius: var(--radius-sm);">
                  <span style="font-size: 1.5rem; color: var(--accent-gold); font-weight: 800;">2</span>
                  <div style="flex: 1;">
                      <h4 style="font-size: 0.95rem; color: var(--primary-blue);">Probar el Simulador de Decisiones</h4>
                      <p style="font-size: 0.85rem; color: var(--text-muted);">Asume el rol de abogado y juez y toma decisiones basadas en el Código Orgánico General de Procesos.</p>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="appRouter.navigateTo('view-simulator')">Iniciar Juego</button>
              </div>
              <div style="display: flex; gap: 1rem; align-items: center; padding: 1rem; background-color: var(--light-grey); border-radius: var(--radius-sm);">
                  <span style="font-size: 1.5rem; color: var(--accent-gold); font-weight: 800;">3</span>
                  <div style="flex: 1;">
                      <h4 style="font-size: 0.95rem; color: var(--primary-blue);">Rendir una Autoevaluación</h4>
                      <p style="font-size: 0.85rem; color: var(--text-muted);">Responde preguntas con retroalimentación inmediata sobre plazos y requisitos procesales.</p>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="appRouter.navigateTo('view-eval')">Hacer Test</button>
              </div>
          </div>
      </div>
    `;
  },

  async renderDocenteDashboard(container) {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <h2 class="section-title" style="margin: 0;">Panel de Estadísticas del Docente</h2>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <select id="teacher-period-filter" class="form-control" style="width: auto; min-width: 180px; height: 42px; border: 1px solid var(--accent-gold); font-weight: bold; border-radius: var(--radius-sm);">
            <option value="">Cargando períodos...</option>
          </select>
        </div>
      </div>
      
      <!-- Carga Spinner -->
      <div id="teacher-dashboard-loading" style="text-align: center; padding: 4rem;">
        <i class="fa-solid fa-spinner fa-spin" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 1.5rem;"></i>
        <p style="color: var(--text-muted); font-size: 1.1rem; font-weight: 500;">Cargando estadísticas de los estudiantes...</p>
      </div>

      <!-- Métricas del período -->
      <div id="teacher-dashboard-content" style="display: none;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;" id="teacher-metric-cards">
          <!-- Inyectado dinámicamente -->
        </div>

        <h3 class="attempts-title" style="margin-top: 2rem; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-chart-pie" style="color: var(--accent-gold);"></i> Progreso por Examen Evaluativo
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;" id="teacher-quizzes-stats-grid">
          <!-- Inyectado dinámicamente -->
        </div>

        <h3 class="attempts-title" style="margin-top: 2rem; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-users" style="color: var(--accent-gold);"></i> Desglose de Estudiantes Evaluados
        </h3>
        <div class="admin-table-container" style="box-shadow: var(--shadow-sm); border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color);">
          <table class="moodle-table" style="width: 100%; border-collapse: collapse; margin-bottom: 0;">
            <thead>
              <tr style="background-color: var(--primary-blue); color: var(--white);">
                <th style="padding: 1rem; text-align: left;">Estudiante</th>
                <th style="padding: 1rem; text-align: left;">Evaluación</th>
                <th style="padding: 1rem; text-align: left;">Fecha de Envío</th>
                <th style="padding: 1rem; text-align: left;">Calificación</th>
                <th style="padding: 1rem; text-align: left;">Estado</th>
              </tr>
            </thead>
            <tbody id="teacher-attempts-table-body">
              <!-- Inyectado dinámicamente -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    const statsData = await this.fetchStats();
    const loadingEl = document.getElementById("teacher-dashboard-loading");
    const contentEl = document.getElementById("teacher-dashboard-content");
    const periodSelect = document.getElementById("teacher-period-filter");

    if (!statsData) {
      if (loadingEl) {
        loadingEl.innerHTML = `
          <i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: var(--error); margin-bottom: 1.5rem;"></i>
          <p style="color: var(--error); font-weight: bold; font-size: 1.2rem;">Error de Conexión</p>
          <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 450px; margin: 0.5rem auto;">
            No se pudo obtener información del servidor. Verifica que tu servidor local de base de datos MySQL y el backend de PHP estén corriendo.
          </p>
        `;
      }
      return;
    }

    const procedures = statsData.procedures || [];
    const attempts = statsData.attempts || [];

    // Períodos únicos
    const periods = [...new Set(procedures.map(p => p.period || '2026_01'))];
    if (periods.length === 0) periods.push('2026_01');

    if (periodSelect) {
      periodSelect.innerHTML = periods.map(p => `<option value="${p}">Período: ${p}</option>`).join('');
    }

    let selectedPeriod = periods[0];

    const updateTeacherDashboardContent = () => {
      const periodProcs = procedures.filter(p => (p.period || '2026_01') === selectedPeriod);
      const periodProcIds = periodProcs.map(p => p.id);
      const periodAttempts = attempts.filter(att => periodProcIds.includes(att.procedure_id));

      // 1. Renderizar tarjetas de métricas del período
      const totalStudentsSet = new Set(periodAttempts.map(att => att.user_id));
      const totalStudentsEvaluated = totalStudentsSet.size;
      
      let sumScores = 0;
      periodAttempts.forEach(att => sumScores += parseFloat(att.score));
      const globalAverage = periodAttempts.length > 0 ? Math.round(sumScores / periodAttempts.length) : 0;
      
      const metricsContainer = document.getElementById("teacher-metric-cards");
      if (metricsContainer) {
        metricsContainer.innerHTML = `
          <div style="background-color: var(--white); padding: 1.8rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid rgba(0,0,0,0.05); text-align: center; border-bottom: 4px solid var(--accent-gold);">
            <i class="fa-solid fa-users" style="font-size: 2.2rem; color: var(--primary-blue); margin-bottom: 0.8rem;"></i>
            <h3 style="font-size: 0.95rem; color: var(--text-muted); font-weight: 600;">Estudiantes Evaluados</h3>
            <p style="font-size: 2.2rem; font-weight: 800; color: var(--primary-blue); margin-top: 0.5rem;">${totalStudentsEvaluated}</p>
          </div>
          <div style="background-color: var(--white); padding: 1.8rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid rgba(0,0,0,0.05); text-align: center; border-bottom: 4px solid var(--accent-gold);">
            <i class="fa-solid fa-square-poll-vertical" style="font-size: 2.2rem; color: var(--primary-blue); margin-bottom: 0.8rem;"></i>
            <h3 style="font-size: 0.95rem; color: var(--text-muted); font-weight: 600;">Promedio General de Notas</h3>
            <p style="font-size: 2.2rem; font-weight: 800; color: var(--primary-blue); margin-top: 0.5rem;">${globalAverage}%</p>
          </div>
          <div style="background-color: var(--white); padding: 1.8rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid rgba(0,0,0,0.05); text-align: center; border-bottom: 4px solid var(--accent-gold);">
            <i class="fa-solid fa-file-invoice" style="font-size: 2.2rem; color: var(--primary-blue); margin-bottom: 0.8rem;"></i>
            <h3 style="font-size: 0.95rem; color: var(--text-muted); font-weight: 600;">Evaluaciones Creadas</h3>
            <p style="font-size: 2.2rem; font-weight: 800; color: var(--primary-blue); margin-top: 0.5rem;">${periodProcs.length}</p>
          </div>
        `;
      }

      // 2. Renderizar grid de exámenes
      const quizzesStatsGrid = document.getElementById("teacher-quizzes-stats-grid");
      if (quizzesStatsGrid) {
        quizzesStatsGrid.innerHTML = "";
        
        periodProcs.forEach(proc => {
          const procAttempts = periodAttempts.filter(att => att.procedure_id === proc.id);
          const totalAtts = procAttempts.length;
          
          let avg = 0;
          let max = 0;
          let min = 0;
          let passRate = 0;
          
          if (totalAtts > 0) {
            const scores = procAttempts.map(att => parseFloat(att.score));
            avg = Math.round(scores.reduce((a, b) => a + b, 0) / totalAtts);
            max = Math.max(...scores);
            min = Math.min(...scores);
            
            const passed = scores.filter(s => s >= 80).length;
            passRate = Math.round((passed / totalAtts) * 100);
          }
          
          let stateBadge = "";
          if (proc.availability === 'closed') {
            stateBadge = `<span style="background-color:#FEE2E2; color:#EF4444; padding:0.2rem 0.5rem; border-radius:4px; font-weight:bold; font-size:0.75rem;">Cerrado</span>`;
          } else if (proc.availability === 'scheduled') {
            stateBadge = `<span style="background-color:#FEF3C7; color:#F59E0B; padding:0.2rem 0.5rem; border-radius:4px; font-weight:bold; font-size:0.75rem;">Programado</span>`;
          } else {
            stateBadge = `<span style="background-color:#D1FAE5; color:#10B981; padding:0.2rem 0.5rem; border-radius:4px; font-weight:bold; font-size:0.75rem;">Abierto</span>`;
          }
          
          const card = document.createElement("div");
          card.style.backgroundColor = "var(--white)";
          card.style.borderRadius = "var(--radius-md)";
          card.style.boxShadow = "var(--shadow-sm)";
          card.style.border = "1px solid rgba(0,0,0,0.06)";
          card.style.padding = "1.5rem";
          card.style.display = "flex";
          card.style.flexDirection = "column";
          card.style.gap = "0.8rem";
          
          card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:start; gap:0.5rem;">
              <h4 style="color: var(--primary-blue); font-weight: 700; margin: 0; font-size: 1.1rem; line-height: 1.3;">
                ${proc.title}
              </h4>
              ${stateBadge}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; font-size: 0.85rem; color: var(--text-dark); margin-top: 0.5rem;">
              <div><strong>Alumnos rindieron:</strong> ${totalAtts}</div>
              <div><strong>Aprobación:</strong> ${totalAtts > 0 ? passRate + '%' : '--'}</div>
              <div><strong>Promedio:</strong> ${totalAtts > 0 ? avg + '%' : '--'}</div>
              <div><strong>Nota Alta:</strong> ${totalAtts > 0 ? max.toFixed(1) + '%' : '--'}</div>
              <div style="grid-column: span 2;"><strong>Nota Baja:</strong> ${totalAtts > 0 ? min.toFixed(1) + '%' : '--'}</div>
            </div>
            
            ${totalAtts > 0 ? `
              <div style="margin-top:0.5rem;">
                <div style="background-color: var(--light-grey); border-radius: 4px; height: 8px; overflow: hidden; position: relative;">
                  <div style="background-color: ${avg >= 80 ? 'var(--success)' : 'var(--accent-gold)'}; width: ${avg}%; height: 100%; border-radius: 4px;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;">
                  <span>Rendimiento Académico</span>
                  <strong>${avg}%</strong>
                </div>
              </div>
            ` : `
              <div style="background-color: var(--light-grey); padding: 0.8rem; border-radius: 4px; text-align: center; color: var(--text-muted); font-size: 0.8rem; font-style: italic; margin-top: auto;">
                Ningún estudiante ha rendido esta evaluación aún.
              </div>
            `}
          `;
          quizzesStatsGrid.appendChild(card);
        });
      }

      // 3. Renderizar listado de estudiantes
      const tableBody = document.getElementById("teacher-attempts-table-body");
      if (tableBody) {
        tableBody.innerHTML = "";
        
        if (periodAttempts.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="5" style="text-align: center; color: var(--text-muted); font-style: italic; padding: 3rem; background-color: var(--white);">
                No se registran intentos para evaluaciones del período ${selectedPeriod}.
              </td>
            </tr>
          `;
        } else {
          periodAttempts.forEach((att, index) => {
            const isPassed = parseFloat(att.score) >= 80;
            const completedDate = att.completed_at ? new Date(att.completed_at.replace(' ', 'T')).toLocaleString('es-EC', { hour12: true }) : 'En curso';
            
            const tr = document.createElement("tr");
            tr.style.borderBottom = "1px solid var(--border-color)";
            tr.style.backgroundColor = index % 2 === 0 ? "var(--white)" : "rgba(166,122,83,0.02)";
            
            tr.innerHTML = `
              <td style="padding: 1rem;">
                <div style="font-weight: 700; color: var(--primary-blue); font-size: 0.95rem;">${att.student_name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${att.student_email}</div>
              </td>
              <td style="padding: 1rem; font-weight: 500; font-size: 0.9rem;">${att.procedure_title}</td>
              <td style="padding: 1rem; font-size: 0.85rem; color: var(--text-muted);">${completedDate}</td>
              <td style="padding: 1rem; font-weight: 800; color: ${isPassed ? 'var(--success)' : 'var(--error)'}; font-size: 1.05rem;">
                ${parseFloat(att.score).toFixed(2)}%
              </td>
              <td style="padding: 1rem;">
                <span class="badge" style="background-color: ${isPassed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}; color: ${isPassed ? 'var(--success)' : 'var(--error)'}; padding: 0.3rem 0.6rem; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 800; display: inline-block; border: 1px solid ${isPassed ? 'var(--success)' : 'var(--error)'};">
                  ${isPassed ? 'APROBADO' : 'REPROBADO'}
                </span>
              </td>
            `;
            tableBody.appendChild(tr);
          });
        }
      }
    };

    if (periodSelect) {
      periodSelect.addEventListener("change", (e) => {
        selectedPeriod = e.target.value;
        updateTeacherDashboardContent();
      });
    }

    if (loadingEl) loadingEl.style.display = "none";
    if (contentEl) contentEl.style.display = "block";

    updateTeacherDashboardContent();
  },

  // 4. Renderización del Módulo de Procedimientos del COGEP
  renderProceduresGrid() {
    const container = document.getElementById("procedures-grid-container");
    if (!container) return;

    container.innerHTML = "";
    const introIds = ['ejecucion', 'ejecutivo', 'monitorio', 'ordinario', 'sumario'];
    const filteredProcedures = COGEP_PROCEDURES.filter(proc => introIds.includes(proc.id));
    filteredProcedures.forEach(proc => {
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

    // Actualizar los artículos del procedimiento seleccionado debajo de "Actos Procesales"
    const articlesEl = document.getElementById("info-procedure-articles");
    if (articlesEl) {
      const currentProc = COGEP_PROCEDURES.find(p => p.id === this.activeProcedure);
      if (currentProc) {
        let displayArticles = "";
        if (currentProc.id === 'ordinario') displayArticles = "(Art. 289 al 317 del COGEP)";
        else if (currentProc.id === 'sumario') displayArticles = "(Art. 332 al 332.11 COGEP)";
        else if (currentProc.id === 'monitorio') displayArticles = "(Art. 356 al 361 y siguientes COGEP)";
        else if (currentProc.id === 'ejecucion') displayArticles = "(Art. 362 AL 398 COGEP)";
        else if (currentProc.id === 'ejecutivo') displayArticles = "(Art. 347 al 355 COGEP)";
        else displayArticles = currentProc.articles || "";
        
        articlesEl.innerText = displayArticles;
      } else {
        articlesEl.innerText = "";
      }
    }

    tabsContainer.innerHTML = "";
    const introIds = ['ejecucion', 'ejecutivo', 'monitorio', 'ordinario', 'sumario'];
    const filteredProcedures = COGEP_PROCEDURES.filter(proc => introIds.includes(proc.id));
    filteredProcedures.forEach(proc => {
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

    this.renderProcedureDetails();
  },

  // 4c. Renderización dinámica de Normativa, Características y Tiempos bajo Recursos Procedentes
  renderProcedureDetails() {
    const container = document.getElementById("procedure-details-container");
    if (!container) return;

    const procId = this.activeProcedure;
    let html = "";

    if (procId === 'ordinario') {
      html = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; width: 100%; max-width: 900px; margin: 0 auto;">
          <div class="procedure-detail-card" style="background: var(--white); padding: 2rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--primary-blue); border-left: 1px solid rgba(0,0,0,0.05); border-right: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05);">
            <h4 style="color: var(--primary-blue); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-book-bookmark" style="color: var(--accent-gold);"></i> Base Normativa Principal</h4>
            <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.75rem;">
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--accent-gold); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 289 al 317 COGEP</strong> (Procedimiento Ordinario)</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--accent-gold); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 53 al 57</strong> citaciones.</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--accent-gold); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 142 al 146</strong> demanda y calificación</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--accent-gold); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 291 al 296</strong> audiencias y términos probatorios</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--accent-gold); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 250 al 254</strong> aclaración y ampliación</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--accent-gold); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 111 al 112</strong> apelación</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--accent-gold); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 268 al 279</strong> casación</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--accent-gold); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Art. 278</strong> recurso de hechor</span></li>
            </ul>
          </div>
          <div class="procedure-detail-card" style="background: var(--white); padding: 2rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--accent-gold); border-left: 1px solid rgba(0,0,0,0.05); border-right: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05);">
            <h4 style="color: var(--accent-gold); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-star" style="color: var(--primary-blue);"></i> Características del Procedimiento Ordinario</h4>
            <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.9rem;">
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--primary-blue); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span>Es el procedimiento común y de mayor duración.</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--primary-blue); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span>Se desarrolla en varias etapas y audiencias.</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--primary-blue); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span>Permite una mayor actividad probatoria y contradicción entre las partes.</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--primary-blue); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span>Aplica a todas las materias no previstas para procedimiento sumario.</span></li>
            </ul>
          </div>
        </div>
      `;
      container.style.display = "block";
    } else if (procId === 'ejecutivo') {
      html = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; width: 100%; max-width: 900px; margin: 0 auto;">
          <div class="procedure-detail-card" style="background: var(--white); padding: 2rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--primary-blue); border-left: 1px solid rgba(0,0,0,0.05); border-right: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05);">
            <h4 style="color: var(--primary-blue); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-hourglass-half" style="color: var(--accent-gold);"></i> Tiempos Referenciales del Proceso Ejecutivo</h4>
            <ol style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.95rem; line-height: 1.5;">
              <li><strong>Calificación de demanda:</strong> 5 días aprox.</li>
              <li><strong>Citación:</strong> variable</li>
              <li><strong>Contestación/ excepciones:</strong> 15 días.</li>
              <li><strong>Convocatoria audiencia:</strong> 20 días aprox.</li>
              <li><strong>Audiencia única:</strong> 1 día.</li>
              <li><strong>Apelación:</strong> 10 días.</li>
              <li><strong>Ejecución y remate:</strong> variable.</li>
            </ol>
          </div>
          <div class="procedure-detail-card" style="background: var(--white); padding: 2rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--accent-gold); border-left: 1px solid rgba(0,0,0,0.05); border-right: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05);">
            <h4 style="color: var(--accent-gold); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-gavel" style="color: var(--primary-blue);"></i> Base Legal Principal</h4>
            <p style="font-size: 0.95rem; margin-bottom: 1rem; color: var(--text-muted); line-height: 1.4;">Libro IV del Procedimiento Ejecutivo del COGEP y normas relativas a:</p>
            <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.6rem;">
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-scale-balanced" style="color: var(--primary-blue); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span>Demanda</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-scale-balanced" style="color: var(--primary-blue); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span>Citación</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-scale-balanced" style="color: var(--primary-blue); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span>Audiencias</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-scale-balanced" style="color: var(--primary-blue); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span>Ejecución</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-scale-balanced" style="color: var(--primary-blue); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span>Recursos</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-scale-balanced" style="color: var(--primary-blue); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span>Remate y embargo.</span></li>
            </ul>
          </div>
        </div>
      `;
      container.style.display = "block";
    } else if (procId === 'sumario') {
      html = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; width: 100%; max-width: 900px; margin: 0 auto;">
          <div class="procedure-detail-card" style="background: var(--white); padding: 2rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--primary-blue); border-left: 1px solid rgba(0,0,0,0.05); border-right: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05);">
            <h4 style="color: var(--primary-blue); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-star" style="color: var(--accent-gold);"></i> Características del Procedimiento Sumario</h4>
            <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.75rem;">
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--accent-gold); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span>Es más rápido y oral.</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--accent-gold); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span>Se aplica a causas de menor cuantía y materias específicas (Art. 332 COGEP).</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--accent-gold); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span>Concentra en una sola audiencia todas las etapas principales.</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--accent-gold); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span>Busca la celeridad y economía procesal.</span></li>
            </ul>
          </div>
          <div class="procedure-detail-card" style="background: var(--white); padding: 2rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--accent-gold); border-left: 1px solid rgba(0,0,0,0.05); border-right: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05);">
            <h4 style="color: var(--accent-gold); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-book-bookmark" style="color: var(--primary-blue);"></i> Base Normativa Principal</h4>
            <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.75rem;">
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--primary-blue); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 332 al 332.11 COGEP</strong> (Procedimiento Sumario)</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--primary-blue); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 53 al 57</strong> citaciones.</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--primary-blue); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 142 al 146</strong> demanda y calificación</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--primary-blue); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 253 al 256</strong> aclaración y amplificación</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--primary-blue); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 360 al 367</strong> apelación.</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--primary-blue); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 268 al 279</strong> casación</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--primary-blue); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 132 al 134</strong> recurso de hecho.</span></li>
            </ul>
          </div>
        </div>
      `;
      container.style.display = "block";
    } else if (procId === 'monitorio') {
      html = `
        <div style="display: flex; flex-direction: column; gap: 2.5rem; width: 100%; max-width: 900px; margin: 0 auto; box-sizing: border-box; padding: 0 1rem;">
          <!-- Fila superior: Tiempos y Audiencia Única -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; align-items: stretch; width: 100%; box-sizing: border-box;">
            
            <!-- Tiempos Principales -->
            <div class="procedure-detail-card" style="background: var(--white); padding: 2rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--accent-gold); border-left: 1px solid rgba(0,0,0,0.05); border-right: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; height: 100%; box-sizing: border-box;">
              <h4 style="color: var(--accent-gold); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-clock" style="color: var(--primary-blue);"></i> Tiempos Principales</h4>
              <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.75rem; margin: 0;">
                <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--primary-blue); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span><strong>Calificación de demanda:</strong> aprox. 5 días.</span></li>
                <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--primary-blue); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span><strong>Oposición del deudor:</strong> 15 días.</span></li>
                <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--primary-blue); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span><strong>Traslado de la oposición:</strong> 3 días.</span></li>
                <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--primary-blue); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span><strong>Audiencia única:</strong> máx. 20 días.</span></li>
                <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--primary-blue); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span><strong>Aclaración y ampliación:</strong> 3 días.</span></li>
                <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--primary-blue); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span><strong>Apelación:</strong> conforme a reglas generales del COGEP.</span></li>
              </ul>
            </div>
            
            <!-- Acto Procesal 9: Audiencia Única -->
            <div class="procedure-detail-card" style="background: var(--white); padding: 2rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--primary-blue); border-left: 1px solid rgba(0,0,0,0.05); border-right: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; height: 100%; box-sizing: border-box;">
              <h4 style="color: var(--primary-blue); font-size: 1.15rem; font-weight: 700; margin-bottom: 0.3rem; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-users-rectangle" style="color: var(--accent-gold);"></i> Acto Procesal 9: Audiencia Única</h4>
              <p style="font-size: 0.85rem; margin-bottom: 1.25rem; color: var(--text-muted); font-style: italic;">Se realiza en un término máximo de 20 días. (Art. 354 COGEP)</p>
              <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.95rem; line-height: 1.4;">
                <div>
                  <strong style="color: var(--primary-blue); display: block; margin-bottom: 0.3rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Fase 1: Saneamiento</strong>
                  <ul style="list-style-type: none; padding-left: 1rem; margin: 0; display: flex; flex-direction: column; gap: 0.25rem;">
                    <li style="position: relative;"><i class="fa-solid fa-minus" style="color: var(--accent-gold); font-size: 0.8rem; position: absolute; left: -1rem; top: 0.3rem;"></i> Verificación de presupuestos procesales</li>
                    <li style="position: relative;"><i class="fa-solid fa-minus" style="color: var(--accent-gold); font-size: 0.8rem; position: absolute; left: -1rem; top: 0.3rem;"></i> Conciliación</li>
                    <li style="position: relative;"><i class="fa-solid fa-minus" style="color: var(--accent-gold); font-size: 0.8rem; position: absolute; left: -1rem; top: 0.3rem;"></i> Fijación de puntos de debate</li>
                  </ul>
                </div>
                <div>
                  <strong style="color: var(--primary-blue); display: block; margin-bottom: 0.3rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Fase 2: Práctica de Prueba</strong>
                  <ul style="list-style-type: none; padding-left: 1rem; margin: 0; display: flex; flex-direction: column; gap: 0.25rem;">
                    <li style="position: relative;"><i class="fa-solid fa-minus" style="color: var(--accent-gold); font-size: 0.8rem; position: absolute; left: -1rem; top: 0.3rem;"></i> Anuncio y admisión</li>
                    <li style="position: relative;"><i class="fa-solid fa-minus" style="color: var(--accent-gold); font-size: 0.8rem; position: absolute; left: -1rem; top: 0.3rem;"></i> Práctica de pruebas</li>
                    <li style="position: relative;"><i class="fa-solid fa-minus" style="color: var(--accent-gold); font-size: 0.8rem; position: absolute; left: -1rem; top: 0.3rem;"></i> Alegatos finales</li>
                  </ul>
                </div>
                <div>
                  <strong style="color: var(--primary-blue); display: block; margin-bottom: 0.3rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Fase 3: Sentencia</strong>
                  <ul style="list-style-type: none; padding-left: 1rem; margin: 0; display: flex; flex-direction: column; gap: 0.25rem;">
                    <li style="position: relative;"><i class="fa-solid fa-minus" style="color: var(--accent-gold); font-size: 0.8rem; position: absolute; left: -1rem; top: 0.3rem;"></i> La sentencia se dicta en la misma audiencia.</li>
                    <li style="position: relative;"><i class="fa-solid fa-minus" style="color: var(--accent-gold); font-size: 0.8rem; position: absolute; left: -1rem; top: 0.3rem;"></i> Notificación oral.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Banner inferior: Base Normativa Principal (fino y alineado) -->
          <div class="procedure-detail-card" style="background: var(--white); padding: 1.25rem 2rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-left: 4px solid var(--primary-blue); border-top: 1px solid rgba(0,0,0,0.05); border-right: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 1.5rem; width: 100%; box-sizing: border-box;">
            <div style="display: flex; align-items: center; gap: 1.25rem; width: 100%;">
              <i class="fa-solid fa-book-bookmark" style="color: var(--accent-gold); font-size: 1.5rem;"></i>
              <span style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.4;">
                <strong style="color: var(--primary-blue); font-weight: 700; text-transform: uppercase; margin-right: 0.5rem;">Base Normativa Principal:</strong>
                Arts. 354 al 361 y siguientes del COGEP
              </span>
            </div>
          </div>
        </div>
      `;
      container.style.display = "block";
    } else if (procId === 'ejecucion') {
      html = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; width: 100%; max-width: 900px; margin: 0 auto;">
          <div class="procedure-detail-card" style="background: var(--white); padding: 2rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--primary-blue); border-left: 1px solid rgba(0,0,0,0.05); border-right: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05);">
            <h4 style="color: var(--primary-blue); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-book-bookmark" style="color: var(--accent-gold);"></i> Base Normativa Principal</h4>
            <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.75rem;">
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle-chevron-right" style="color: var(--accent-gold); margin-top: 0.2rem; font-size: 0.9rem;"></i> <span><strong>Arts. 362 al 405 COGEP</strong> (Fase de Ejecución)</span></li>
            </ul>
          </div>
          <div class="procedure-detail-card" style="background: var(--white); padding: 2rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border-top: 4px solid var(--accent-gold); border-left: 1px solid rgba(0,0,0,0.05); border-right: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05);">
            <h4 style="color: var(--accent-gold); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-list-check" style="color: var(--primary-blue);"></i> Características de la Ejecución</h4>
            <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.9rem;">
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--primary-blue); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span>Su objeto es hacer cumplir un título de ejecución (sentencia ejecutoriada, acta de mediación, laudo arbitral).</span></li>
              <li style="display: flex; gap: 0.75rem; font-size: 0.95rem; line-height: 1.4;"><i class="fa-solid fa-circle" style="color: var(--primary-blue); font-size: 0.5rem; margin-top: 0.6rem;"></i> <span>Proceso directo a ejecución sin fase de contradicción sobre el fondo.</span></li>
            </ul>
          </div>
        </div>
      `;
      container.style.display = "block";
    } else {
      container.style.display = "none";
    }

    container.innerHTML = html;
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
  // Restaurar la vista persistida
  appRouter.navigateTo(appRouter.activeView);
});
