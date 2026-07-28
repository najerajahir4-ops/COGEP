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

const AuthService = {
  currentUser: null,
  get apiBaseUrl() {
    return getDynamicApiUrl();
  },

  async init() {
    const token = localStorage.getItem('cogep_token');
    if (!token) {
      this.currentUser = null;
      return;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        this.currentUser = await response.json();
        localStorage.setItem('cogep_session', JSON.stringify(this.currentUser));
      } else {
        this.currentUser = null;
        localStorage.removeItem('cogep_token');
        localStorage.removeItem('cogep_session');
      }
    } catch (error) {
      console.error('No se pudo verificar la sesión:', error);
      this.currentUser = null;
    }
  },

  getCurrentUser() {
    return this.currentUser;
  },

  async login(email, password) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        return null;
      }

      this.currentUser = data.user;
      localStorage.setItem('cogep_token', data.token);
      localStorage.setItem('cogep_session', JSON.stringify(this.currentUser));
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

  async logout() {
    this.currentUser = null;
    localStorage.removeItem('cogep_token');
    localStorage.removeItem('cogep_session');
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
document.addEventListener("DOMContentLoaded", async () => {
  await AuthService.init();

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
        const user = await AuthService.login(emailInput.value, passwordInput.value);
        if (!user) {
          alert("Credenciales incorrectas. Por favor intente de nuevo.");
          return;
        }
        
        if (window.appRouter) {
          window.appRouter.updateSessionUI();
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
          await AuthService.register(
            nameInput.value,
            emailInput.value,
            "estudiante",
            passwordInput.value
          );
          alert("Registro exitoso. Ahora puedes iniciar sesión.");
          if (window.appRouter) {
            window.appRouter.navigateTo("view-login");
          }
          formRegister.reset();
        } catch (error) {
          alert(error.message || "No se pudo completar el registro.");
        }
      }
    });
  }

  // Simulación de recuperación de claves
  const linkForgot = document.getElementById("link-forgot-pass");
  if (linkForgot) {
    linkForgot.addEventListener("click", (e) => {
      e.preventDefault();
      const email = prompt("Por favor ingresa tu correo electrónico registrado para recuperar tu contraseña:");
      if (email) {
        if (AuthService.validateEmail(email)) {
          alert(`Se ha enviado un correo de recuperación a: ${email} con las instrucciones.`);
        } else {
          alert("El correo electrónico ingresado no es válido.");
        }
      }
    });
  }

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
});
