/**
 * Módulo de Autenticación y Validación de Datos (js/auth.js)
 * Maneja los formularios de ingreso, registro y validación con JS.
 */

const getDynamicApiUrl = () => {
  if (window.location.port === '5000') {
    return 'http://localhost:5000/api';
  }
  const pathParts = window.location.pathname.split('/');
  let projectFolder = '';
  if (pathParts.length > 1 && pathParts[1] && !pathParts[1].endsWith('.html')) {
    projectFolder = '/' + pathParts[1];
  }
  return window.location.origin + projectFolder + '/backend/router.php/api';
};

// Sistema de Notificaciones Toast Personalizado para evitar ventanas nativas 'alert()'
const Toast = {
  container: null,
  init() {
    if (this.container) return;
    this.container = document.createElement("div");
    this.container.id = "custom-toast-container";
    this.container.style.cssText = "position: fixed; top: 90px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px; max-width: 380px; width: 100%; pointer-events: none;";
    document.body.appendChild(this.container);
  },
  show(message, type = 'info') {
    this.init();
    const toast = document.createElement("div");
    toast.style.cssText = "padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 10px 25px rgba(86, 28, 36, 0.15); color: #FFF; font-weight: 600; font-size: 0.95rem; display: flex; align-items: center; gap: 12px; transform: translateX(120%); transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); pointer-events: auto; line-height: 1.4; font-family: 'Montserrat', sans-serif;";
    
    let iconClass = "fa-circle-info";
    if (type === 'success') {
      toast.style.backgroundColor = "#10B981";
      toast.style.borderLeft = "5px solid #059669";
      iconClass = "fa-circle-check";
    } else if (type === 'error') {
      toast.style.backgroundColor = "#EF4444";
      toast.style.borderLeft = "5px solid #DC2626";
      iconClass = "fa-circle-exclamation";
    } else {
      toast.style.backgroundColor = "var(--primary, #561C24)";
      toast.style.borderLeft = "5px solid var(--secondary, #6D2932)";
    }

    toast.innerHTML = `<i class="fa-solid ${iconClass}" style="font-size: 1.2rem;"></i> <span style="flex: 1;">${message}</span>`;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 10);

    setTimeout(() => {
      toast.style.transform = "translateX(120%)";
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4500);
  }
};
window.Toast = Toast;

const CustomModal = {
  confirm(message, title = "Confirmar Acción") {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        z-index: 10001;
        display: flex; justify-content: center; align-items: center;
        opacity: 0; transition: opacity 0.3s ease;
      `;

      const modal = document.createElement('div');
      modal.style.cssText = `
        background: var(--white, #FFF); border-radius: 12px; width: 90%; max-width: 400px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        transform: scale(0.9); transition: transform 0.3s ease;
        overflow: hidden; font-family: 'Montserrat', sans-serif;
        border: 1px solid var(--border-color, transparent);
      `;

      modal.innerHTML = `
        <div style="background: var(--primary, #561C24); color: var(--text-light, white); padding: 1rem 1.5rem; font-weight: 600; font-size: 1.1rem; display: flex; justify-content: space-between; align-items: center;">
          <span>${title}</span>
          <i class="fa-solid fa-circle-question"></i>
        </div>
        <div style="padding: 1.5rem; color: var(--text-dark, #333); font-size: 1rem; line-height: 1.5; text-align: center;">
          ${message}
        </div>
        <div style="padding: 1rem 1.5rem; background: var(--light-grey, #F9FAFB); display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-color, #E5E7EB);">
          <button id="modal-btn-cancel" style="padding: 0.6rem 1.2rem; border-radius: 6px; border: 1px solid var(--border-color, #D1D5DB); background: var(--white, #FFF); color: var(--text-dark, #4B5563); font-weight: 600; cursor: pointer; transition: all 0.2s;">Cancelar</button>
          <button id="modal-btn-confirm" style="padding: 0.6rem 1.2rem; border-radius: 6px; border: none; background: var(--primary, #561C24); color: var(--text-light, white); font-weight: 600; cursor: pointer; transition: all 0.2s;">Aceptar</button>
        </div>
      `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
      }, 10);

      const cleanup = () => {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => overlay.remove(), 300);
      };

      modal.querySelector('#modal-btn-cancel').addEventListener('click', () => {
        cleanup();
        resolve(false);
      });

      modal.querySelector('#modal-btn-confirm').addEventListener('click', () => {
        cleanup();
        resolve(true);
      });
    });
  }
};
window.CustomModal = CustomModal;

const AuthService = {
  currentUser: null,
  get apiBaseUrl() {
    return getDynamicApiUrl();
  },

  init() {
    const token = localStorage.getItem('cogep_token') || sessionStorage.getItem('cogep_token');
    if (!token) {
      this.currentUser = null;
      return Promise.resolve();
    }

    // CARGA OPTIMISTA: Cargar de memoria al instante para evitar el parpadeo
    const savedSession = localStorage.getItem('cogep_session') || sessionStorage.getItem('cogep_session');
    if (savedSession) {
      try {
        this.currentUser = JSON.parse(savedSession);
      } catch (e) {}
    }

    // Verificar en la base de datos en segundo plano
    return fetch(`${this.apiBaseUrl}/auth/me`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json().then(user => {
          this.currentUser = user;
          const storage = localStorage.getItem('cogep_token') ? localStorage : sessionStorage;
          storage.setItem('cogep_session', JSON.stringify(user));
          // Forzar re-render de la UI por si el rol cambió en la base de datos mientras estábamos desconectados
          if (window.appRouter) window.appRouter.updateSessionUI();
        });
      } else {
        throw new Error("Sesión caducada o inválida");
      }
    })
    .catch(error => {
      console.warn('La sesión en segundo plano fue rechazada:', error);
      this.currentUser = null;
      localStorage.removeItem('cogep_token');
      localStorage.removeItem('cogep_session');
      sessionStorage.removeItem('cogep_token');
      sessionStorage.removeItem('cogep_session');
      if (window.appRouter) {
        window.appRouter.updateSessionUI();
        if (window.appRouter.activeView !== 'view-home') {
          window.appRouter.navigateTo('view-home');
        }
      }
    });
  },

  getCurrentUser() {
    return this.currentUser;
  },

  async login(email, password, remember = false) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          return { unverified: true, email: data.email, message: data.message };
        }
        return null;
      }

      this.currentUser = data.user;
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('cogep_token', data.token);
      storage.setItem('cogep_session', JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }
  },

  async register(name, email, role, password) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar');
      }

      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  async oauthLogin(provider, email, name) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, email, name })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error en la autenticación social.');
      }

      this.currentUser = data.user;
      sessionStorage.setItem('cogep_token', data.token);
      sessionStorage.setItem('cogep_session', JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (error) {
      console.error('Error en oauthLogin:', error);
      throw error;
    }
  },

  async updateAvatar(base64Image) {
    const token = localStorage.getItem('cogep_token') || sessionStorage.getItem('cogep_token');
    if (!token) return false;

    try {
      const response = await fetch(`${this.apiBaseUrl}/users/update-avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: base64Image })
      });

      if (response.ok) {
        if (this.currentUser) {
          this.currentUser.avatar = base64Image;
          const storage = localStorage.getItem('cogep_token') ? localStorage : sessionStorage;
          storage.setItem('cogep_session', JSON.stringify(this.currentUser));
        }
        return true;
      }
    } catch (e) {
      console.error("Error al actualizar la foto de perfil en el servidor:", e);
    }
    return false;
  },

  async logout() {
    this.currentUser = null;
    localStorage.removeItem('cogep_token');
    localStorage.removeItem('cogep_session');
    sessionStorage.removeItem('cogep_token');
    sessionStorage.removeItem('cogep_session');
    try {
      await fetch(`${this.apiBaseUrl}/auth/logout`, { method: 'POST' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },

  // Validaciones del lado del cliente
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  validatePassword(password) {
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLength && hasUppercase && hasNumber;
  }
};

// Inicialización de Eventos de Autenticación al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
  // Inicialización sincrónica optimista
  AuthService.init();

  // Sincronizar el estado de la sesión verificado con el Router de la SPA inmediatamente
  if (window.appRouter) {
    window.appRouter.updateSessionUI();
    window.appRouter.applyUserPreferences();
    if (AuthService.getCurrentUser()) {
      // Redirigir al dashboard si ya estaba en vistas de bienvenida/login/registro
      if (window.appRouter.activeView === 'view-home' || window.appRouter.activeView === 'view-login' || window.appRouter.activeView === 'view-register') {
        window.appRouter.navigateTo("view-dashboard");
      }
    }
  }

  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");

  // Escuchar entrada de contraseña para validar requerimientos en tiempo real
  const regPassword = document.getElementById("reg-password");
  if (regPassword) {
    regPassword.addEventListener("input", (e) => {
      const val = e.target.value;
      
      const isLengthValid = val.length >= 8;
      const isUpperValid = /[A-Z]/.test(val);
      const isNumberValid = /[0-9]/.test(val);
      
      updateReqItem("req-length", isLengthValid, "Mínimo 8 caracteres");
      updateReqItem("req-upper", isUpperValid, "Al menos una letra mayúscula");
      updateReqItem("req-number", isNumberValid, "Al menos un número");
    });
  }

  function updateReqItem(id, isValid, text) {
    const el = document.getElementById(id);
    if (!el) return;
    if (isValid) {
      el.className = "req-item valid";
      el.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${text}`;
    } else {
      el.className = "req-item invalid";
      el.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${text}`;
    }
  }

  // Manejar envío de login
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const emailInput = document.getElementById("login-email");
      const passwordInput = document.getElementById("login-password");
      
      let isValid = true;

      // Validar Email
      if (!AuthService.validateEmail(emailInput.value)) {
        document.getElementById("login-email-group").classList.add("has-error");
        isValid = false;
      } else {
        document.getElementById("login-email-group").classList.remove("has-error");
      }

      // Validar Contraseña
      if (passwordInput.value.trim() === "") {
        document.getElementById("login-password-group").classList.add("has-error");
        isValid = false;
      } else {
        document.getElementById("login-password-group").classList.remove("has-error");
      }

      if (isValid) {
        const rememberCheckbox = document.getElementById("login-remember");
        const remember = rememberCheckbox ? rememberCheckbox.checked : false;
        const user = await AuthService.login(emailInput.value, passwordInput.value, remember);
        if (!user) {
          Toast.show("Credenciales incorrectas. Por favor intente de nuevo.", "error");
          return;
        }

        if (user.unverified) {
          Toast.show(user.message, "info");
          document.getElementById("verify-email-hidden").value = user.email;
          document.getElementById("verify-subtitle").innerText = `Tu cuenta no está verificada. Te hemos enviado un código a ${user.email}. Por favor, ingrésalo a continuación.`;
          
          const msgBox = document.getElementById("verify-message-box");
          if (msgBox) {
            msgBox.style.display = "none";
            msgBox.innerText = "";
          }
          
          if (window.appRouter) {
            window.appRouter.navigateTo("view-verify");
          }
          return;
        }
        
        if (window.appRouter) {
          window.appRouter.updateSessionUI();
          window.appRouter.applyUserPreferences();
          window.appRouter.navigateTo("view-home");
        }
        formLogin.reset();
      }
    });
  }

  // Manejar envío de registro
  if (formRegister) {
    formRegister.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("reg-name");
      const emailInput = document.getElementById("reg-email");
      const passwordInput = document.getElementById("reg-password");
      const confirmInput = document.getElementById("reg-confirm");

      let isValid = true;

      // Validar Nombre
      if (nameInput.value.trim() === "") {
        document.getElementById("reg-name-group").classList.add("has-error");
        isValid = false;
      } else {
        document.getElementById("reg-name-group").classList.remove("has-error");
      }

      // Validar Email
      if (!AuthService.validateEmail(emailInput.value)) {
        document.getElementById("reg-email-group").classList.add("has-error");
        isValid = false;
      } else {
        document.getElementById("reg-email-group").classList.remove("has-error");
      }

      // Validar Contraseña
      if (!AuthService.validatePassword(passwordInput.value)) {
        document.getElementById("reg-password-group").classList.add("has-error");
        isValid = false;
      } else {
        document.getElementById("reg-password-group").classList.remove("has-error");
      }

      // Validar Confirmar
      if (passwordInput.value !== confirmInput.value || confirmInput.value === "") {
        document.getElementById("reg-confirm-group").classList.add("has-error");
        isValid = false;
      } else {
        document.getElementById("reg-confirm-group").classList.remove("has-error");
      }

      if (isValid) {
        try {
          const regResult = await AuthService.register(
            nameInput.value,
            emailInput.value,
            "estudiante",
            passwordInput.value
          );
          
          document.getElementById("verify-email-hidden").value = regResult.email;
          document.getElementById("verify-subtitle").innerText = `Te hemos enviado un código de verificación de 6 dígitos a ${regResult.email}. Por favor, ingrésalo a continuación.`;
          
          const msgBox = document.getElementById("verify-message-box");
          if (msgBox) {
            msgBox.style.display = "none";
            msgBox.innerText = "";
          }

          Toast.show(regResult.message || "Registro exitoso. Revisa tu bandeja de entrada.", "success");
          if (window.appRouter) {
            window.appRouter.navigateTo("view-verify");
          }
          formRegister.reset();
        } catch (error) {
          Toast.show(error.message || "No se pudo completar el registro.", "error");
        }
      }
    });
  }

  // Lógica de Registro/Login con Redes Sociales (Google / Microsoft OAuth Real)
  const socialButtons = document.querySelectorAll(".btn-social");
  socialButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const provider = btn.getAttribute("data-provider");
      Toast.show("Conectando con el proveedor...", "info");
      
      try {
        // Obtener Client ID desde el servidor
        const configRes = await fetch(`${AuthService.apiBaseUrl}/auth/oauth-config`);
        if (!configRes.ok) throw new Error("No se pudo obtener la configuración de autenticación.");
        const config = await configRes.json();
        
        const clientId = provider === 'google' ? config.google_client_id : config.microsoft_client_id;
        if (!clientId) {
          throw new Error(`El Client ID para ${provider === 'google' ? 'Google' : 'Microsoft'} no está configurado en el servidor.`);
        }
        
        const width = 500;
        const height = 650;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        
        // redirectUri dinámico para que funcione tanto en localhost con puerto 80 como 5000
        const redirectUri = `${window.location.origin}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}/backend/router.php/api/auth/oauth-callback`;
        
        let oauthUrl = '';
        if (provider === 'google') {
          oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&state=google`;
        } else {
          oauthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email%20User.Read&state=microsoft`;
        }
        
        window.open(
          oauthUrl, 
          "oauth_popup", 
          `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes`
        );
      } catch (err) {
        Toast.show(err.message || "Error al iniciar la autenticación.", "error");
      }
    });
  });

  // Escuchar el mensaje seguro enviado por nuestro callback en el popup
  window.addEventListener("message", async (event) => {
    if (event.origin !== window.location.origin) return;
    
    if (event.data && event.data.status === "success" && event.data.token) {
      const { token, user } = event.data;
      
      try {
        AuthService.currentUser = user;
        
        const rememberCheckbox = document.getElementById("login-remember");
        const remember = rememberCheckbox ? rememberCheckbox.checked : false;
        
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('cogep_token', token);
        storage.setItem('cogep_session', JSON.stringify(user));
        
        Toast.show(`¡Bienvenido, ${user.name}! Sesión iniciada con éxito.`, "success");
        
        if (window.appRouter) {
          window.appRouter.updateSessionUI();
          window.appRouter.applyUserPreferences();
          window.appRouter.navigateTo("view-home");
        }
        
        if (formLogin) formLogin.reset();
        if (formRegister) formRegister.reset();
      } catch (err) {
        Toast.show("Error al guardar la sesión.", "error");
      }
    } else if (event.data && event.data.status === "error") {
      Toast.show(event.data.message || "Error en la autenticación social.", "error");
    }
  });

  // Lógica de recuperación de claves (NUEVA)
  const linkForgot = document.getElementById("link-forgot-pass");
  if (linkForgot) {
    linkForgot.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.appRouter) {
        window.appRouter.navigateTo("view-forgot");
      }
    });
  }

  // Manejar el formulario para solicitar código de recuperación
  const formForgot = document.getElementById("form-forgot");
  if (formForgot) {
    formForgot.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("forgot-email");
      const emailVal = emailInput.value.trim();
      
      if (!AuthService.validateEmail(emailVal)) {
        document.getElementById("forgot-email-group").classList.add("has-error");
        document.getElementById("forgot-email-error").style.display = "block";
        return;
      } else {
        document.getElementById("forgot-email-group").classList.remove("has-error");
        document.getElementById("forgot-email-error").style.display = "none";
      }
      
      try {
        const response = await fetch(`${AuthService.apiBaseUrl}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailVal })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          Toast.show(data.message, "success");
          // Rellenar correo oculto en la pantalla de reinicio
          document.getElementById("reset-email-hidden").value = emailVal;
          document.getElementById("reset-subtitle").innerText = `Ingresa el código de 6 dígitos enviado a ${emailVal} y tu nueva contraseña.`;
          
          if (window.appRouter) {
            window.appRouter.navigateTo("view-reset");
          }
          formForgot.reset();
        } else {
          Toast.show(data.message || "Error al solicitar la recuperación.", "error");
        }
      } catch (error) {
        console.error("Error en forgot password:", error);
        Toast.show("Error de conexión con el servidor.", "error");
      }
    });
  }

  // Manejar el formulario para cambiar la contraseña con el código
  const formReset = document.getElementById("form-reset");
  if (formReset) {
    formReset.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailVal = document.getElementById("reset-email-hidden").value;
      const codeInput = document.getElementById("reset-code");
      const passwordInput = document.getElementById("reset-password");
      const confirmInput = document.getElementById("reset-confirm");
      
      const codeVal = codeInput.value.trim();
      const passwordVal = passwordInput.value;
      const confirmVal = confirmInput.value;
      
      let isValid = true;
      
      // Validar código
      if (!/^\d{6}$/.test(codeVal)) {
        document.getElementById("reset-code-group").classList.add("has-error");
        document.getElementById("reset-code-error").style.display = "block";
        isValid = false;
      } else {
        document.getElementById("reset-code-group").classList.remove("has-error");
        document.getElementById("reset-code-error").style.display = "none";
      }
      
      // Validar contraseña
      if (!AuthService.validatePassword(passwordVal)) {
        document.getElementById("reset-password-group").classList.add("has-error");
        document.getElementById("reset-password-error").style.display = "block";
        isValid = false;
      } else {
        document.getElementById("reset-password-group").classList.remove("has-error");
        document.getElementById("reset-password-error").style.display = "none";
      }
      
      // Validar confirmación
      if (passwordVal !== confirmVal || confirmVal === "") {
        document.getElementById("reset-confirm-group").classList.add("has-error");
        document.getElementById("reset-confirm-error").style.display = "block";
        isValid = false;
      } else {
        document.getElementById("reset-confirm-group").classList.remove("has-error");
        document.getElementById("reset-confirm-error").style.display = "none";
      }
      
      if (!isValid) return;
      
      try {
        const response = await fetch(`${AuthService.apiBaseUrl}/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailVal,
            code: codeVal,
            password: passwordVal
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          Toast.show(data.message, "success");
          if (window.appRouter) {
            window.appRouter.navigateTo("view-login");
          }
          formReset.reset();
        } else {
          Toast.show(data.message || "Error al restablecer la contraseña.", "error");
        }
      } catch (error) {
        console.error("Error en reset password:", error);
        Toast.show("Error de conexión con el servidor.", "error");
      }
    });
  }

  // Enlaces para volver al login
  const setupBackLink = (linkId) => {
    const link = document.getElementById(linkId);
    if (link) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.appRouter) {
          window.appRouter.navigateTo("view-login");
        }
      });
    }
  };
  setupBackLink("link-forgot-back");
  setupBackLink("link-reset-back");

  // Lógica para alternar visibilidad de contraseña (Ojito)
  const setupPasswordToggle = (toggleId, inputId) => {
    const toggleIcon = document.getElementById(toggleId);
    const passwordInput = document.getElementById(inputId);
    
    if (toggleIcon && passwordInput) {
      toggleIcon.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        
        // Alternar ícono de ojo abierto / ojo cerrado
        if (type === "password") {
          toggleIcon.classList.remove("fa-eye-slash");
          toggleIcon.classList.add("fa-eye");
        } else {
          toggleIcon.classList.remove("fa-eye");
          toggleIcon.classList.add("fa-eye-slash");
        }
      });
    }
  };

  setupPasswordToggle("toggle-login-pass", "login-password");
  setupPasswordToggle("toggle-reg-pass", "reg-password");
  setupPasswordToggle("toggle-reg-confirm", "reg-confirm");
  setupPasswordToggle("toggle-reset-pass", "reset-password");
  setupPasswordToggle("toggle-reset-confirm", "reset-confirm");

  // --- LÓGICA DE VERIFICACIÓN DE CÓDIGO (NUEVA) ---
  const formVerify = document.getElementById("form-verify");
  if (formVerify) {
    formVerify.addEventListener("submit", async (e) => {
      e.preventDefault();
      const codeInput = document.getElementById("verify-code");
      const emailInput = document.getElementById("verify-email-hidden");
      const errorSpan = document.getElementById("verify-code-error");
      const msgBox = document.getElementById("verify-message-box");

      const codeVal = codeInput.value.trim();
      const emailVal = emailInput.value.trim();

      if (!/^\d{6}$/.test(codeVal)) {
        errorSpan.style.display = "block";
        return;
      } else {
        errorSpan.style.display = "none";
      }

      msgBox.style.display = "block";
      msgBox.style.backgroundColor = "#fff9e6";
      msgBox.style.borderColor = "#ffeaba";
      msgBox.style.color = "#8a6d3b";
      msgBox.style.border = "1px solid #ffeaba";
      msgBox.innerText = "Verificando código...";

      try {
        const response = await fetch(`${AuthService.apiBaseUrl}/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailVal, code: codeVal })
        });

        const data = await response.json();
        
        if (response.ok) {
          msgBox.style.backgroundColor = "#dff0d8";
          msgBox.style.borderColor = "#d6e9c6";
          msgBox.style.color = "#3c763d";
          msgBox.style.border = "1px solid #d6e9c6";
          msgBox.innerHTML = `<strong>¡Verificado!</strong> ${data.message}`;
          
          // Guardar sesión automática
          AuthService.currentUser = data.user;
          const rememberCheckbox = document.getElementById("login-remember");
          const remember = rememberCheckbox ? rememberCheckbox.checked : false;
          const storage = remember ? localStorage : sessionStorage;
          storage.setItem('cogep_token', data.token);
          storage.setItem('cogep_session', JSON.stringify(data.user));

          setTimeout(() => {
            if (window.appRouter) {
              window.appRouter.updateSessionUI();
              window.appRouter.applyUserPreferences();
              window.appRouter.navigateTo("view-dashboard");
            }
            formVerify.reset();
            msgBox.style.display = "none";
          }, 2000);
        } else {
          msgBox.style.backgroundColor = "#f2dede";
          msgBox.style.borderColor = "#ebccd1";
          msgBox.style.color = "#a94442";
          msgBox.style.border = "1px solid #ebccd1";
          if (data.error_type === 'expired' || data.message === 'código expirado') {
            msgBox.innerHTML = "<strong>Error:</strong> El código de verificación ha expirado. Por favor, solicita uno nuevo.";
          } else {
            msgBox.innerHTML = `<strong>Error:</strong> ${data.message}`;
          }
        }
      } catch (error) {
        console.error("Error en verificación:", error);
        msgBox.style.backgroundColor = "#f2dede";
        msgBox.style.borderColor = "#ebccd1";
        msgBox.style.color = "#a94442";
        msgBox.style.border = "1px solid #ebccd1";
        msgBox.innerText = "Error de conexión con el servidor.";
      }
    });
  }

  // Lógica de Reenvío de código
  const btnResend = document.getElementById("btn-resend-code");
  if (btnResend) {
    btnResend.addEventListener("click", async () => {
      const emailVal = document.getElementById("verify-email-hidden").value.trim();
      const msgBox = document.getElementById("verify-message-box");
      const timerMsg = document.getElementById("resend-timer-msg");

      if (!emailVal) {
        Toast.show("No hay un correo electrónico asociado. Por favor intenta registrarte de nuevo.", "error");
        return;
      }

      btnResend.disabled = true;
      btnResend.style.opacity = "0.5";

      try {
        const response = await fetch(`${AuthService.apiBaseUrl}/auth/resend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailVal })
        });

        const data = await response.json();

        msgBox.style.display = "block";

        if (response.ok) {
          msgBox.style.backgroundColor = "#d9edf7";
          msgBox.style.borderColor = "#bce8f1";
          msgBox.style.color = "#31708f";
          msgBox.style.border = "1px solid #bce8f1";
          msgBox.innerText = data.message || "Se ha enviado un nuevo código de verificación.";
          
          // Iniciar cooldown de 60 segundos
          let seconds = 60;
          timerMsg.style.display = "block";
          timerMsg.innerText = `Puedes reenviar en ${seconds} segundos.`;

          const interval = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
              clearInterval(interval);
              btnResend.disabled = false;
              btnResend.style.opacity = "1";
              timerMsg.style.display = "none";
            } else {
              timerMsg.innerText = `Puedes reenviar en ${seconds} segundos.`;
            }
          }, 1000);
        } else {
          msgBox.style.backgroundColor = "#f2dede";
          msgBox.style.borderColor = "#ebccd1";
          msgBox.style.color = "#a94442";
          msgBox.style.border = "1px solid #ebccd1";
          msgBox.innerText = data.message;
          btnResend.disabled = false;
          btnResend.style.opacity = "1";

          // Manejar rate limiting con los segundos indicados
          if (response.status === 429) {
            const matches = data.message.match(/\d+/);
            if (matches && matches[0]) {
              let seconds = parseInt(matches[0], 10);
              btnResend.disabled = true;
              btnResend.style.opacity = "0.5";
              timerMsg.style.display = "block";
              timerMsg.innerText = `Puedes reenviar en ${seconds} segundos.`;
              const interval = setInterval(() => {
                seconds--;
                if (seconds <= 0) {
                  clearInterval(interval);
                  btnResend.disabled = false;
                  btnResend.style.opacity = "1";
                  timerMsg.style.display = "none";
                } else {
                  timerMsg.innerText = `Puedes reenviar en ${seconds} segundos.`;
                }
              }, 1000);
            }
          }
        }
      } catch (error) {
        console.error("Error al reenviar:", error);
        msgBox.style.display = "block";
        msgBox.style.backgroundColor = "#f2dede";
        msgBox.style.borderColor = "#ebccd1";
        msgBox.style.color = "#a94442";
        msgBox.style.border = "1px solid #ebccd1";
        msgBox.innerText = "Error de conexión al reenviar el código.";
        btnResend.disabled = false;
        btnResend.style.opacity = "1";
      }
    });
  }

  // Verificación por Hash/URL automática
  const checkUrlVerification = async () => {
    const hash = window.location.hash;
    if (hash.startsWith("#verify")) {
      const queryStr = hash.split("?")[1];
      if (!queryStr) return;
      const params = new URLSearchParams(queryStr);
      const email = params.get("email");
      const code = params.get("code");

      if (email && code) {
        document.getElementById("verify-email-hidden").value = email;
        document.getElementById("verify-code").value = code;
        document.getElementById("verify-subtitle").innerText = `Verificando código para ${email} automáticamente...`;
        
        if (window.appRouter) {
          window.appRouter.navigateTo("view-verify");
        }

        // Auto submit
        const formVerify = document.getElementById("form-verify");
        if (formVerify) {
          formVerify.dispatchEvent(new Event("submit"));
        }
      } else if (email) {
        document.getElementById("verify-email-hidden").value = email;
        document.getElementById("verify-subtitle").innerText = `Ingresa el código enviado a ${email}`;
        if (window.appRouter) {
          window.appRouter.navigateTo("view-verify");
        }
      }
    }
  };

  // Ejecutar checkUrlVerification después de la carga inicial
  setTimeout(checkUrlVerification, 500);
  window.addEventListener("hashchange", checkUrlVerification);
});
