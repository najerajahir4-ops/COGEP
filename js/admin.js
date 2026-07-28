/**
 * Módulo de Administración (js/admin.js)
 * Implementa la interfaz CRUD conectada al Backend PHP y MySQL con fallback a almacenamiento local.
 */

const escapeHTML = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const AdminPanel = {
  get apiBaseUrl() {
    if (typeof getDynamicApiUrl === 'function') {
      return getDynamicApiUrl();
    }
    if (window.location.port === '5000') {
      return 'http://localhost:5000/api';
    }
    const pathParts = window.location.pathname.split('/');
    let projectFolder = '';
    if (pathParts.length > 1 && pathParts[1] && !pathParts[1].endsWith('.html')) {
      projectFolder = '/' + pathParts[1];
    }
    return window.location.origin + projectFolder + '/backend/router.php/api';
  },
  users: [
    { id: 1, name: "Jandry López Velez", email: "jandry.lopez@derecho.edu.ec", role: "estudiante" },
    { id: 2, name: "Dra. María Belén", email: "maria.belen@derecho.edu.ec", role: "docente" },
    { id: 3, name: "Dr. Alexander Caillagua", email: "alex.caillagua@derecho.edu.ec", role: "administrador" }
  ],

  async init() {
    const regUsers = JSON.parse(localStorage.getItem('cogep_registered_users') || '[]');
    if (regUsers.length > 0) {
      this.users = regUsers.map((u, index) => ({
        id: index + 1,
        name: u.name,
        email: u.email,
        role: u.role
      }));
    }
    await this.renderUsers();
    await this.renderQuestions();
    this.bindEvents();
  },

  getAuthHeaders() {
    const token = localStorage.getItem('cogep_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  },

  // Sincronizar usuarios de vuelta a localStorage como respaldo
  saveUsers() {
    const regUsers = JSON.parse(localStorage.getItem('cogep_registered_users') || '[]');
    const updatedRegUsers = this.users.map(u => {
      const existing = regUsers.find(ru => ru.email.toLowerCase() === u.email.toLowerCase());
      return {
        name: u.name,
        email: u.email,
        role: u.role,
        password: existing ? existing.password : "password123"
      };
    });
    localStorage.setItem('cogep_registered_users', JSON.stringify(updatedRegUsers));
  },

  // --- CRUD USUARIOS ---
  async renderUsers() {
    const tbody = document.getElementById("admin-users-table-body");
    if (!tbody) return;

    // Intentar obtener desde backend
    try {
      const response = await fetch(`${this.apiBaseUrl}/users`, {
        headers: this.getAuthHeaders()
      });
      if (response.ok) {
        this.users = await response.json();
      }
    } catch (e) {
      console.warn("Backend no disponible para cargar usuarios, usando datos locales.", e);
    }

    tbody.innerHTML = "";
    
    const currentUser = AuthService.getCurrentUser();
    const isDocente = currentUser && currentUser.role === 'docente';
    
    // Ocultar botón de agregar si es docente
    const addUserBtn = document.getElementById("admin-add-user-btn");
    if (addUserBtn) {
      addUserBtn.style.display = isDocente ? "none" : "block";
    }

    // Ocultar cabecera de acciones si es docente
    const actionsHeader = document.querySelector(".admin-actions-header");
    if (actionsHeader) {
      actionsHeader.style.display = isDocente ? "none" : "table-cell";
    }

    // Si es docente, solo puede visualizar estudiantes
    const visibleUsers = isDocente 
      ? this.users.filter(u => u.role === 'estudiante') 
      : this.users;

    visibleUsers.forEach(user => {
      const tr = document.createElement("tr");
      
      if (isDocente) {
        tr.innerHTML = `
          <td><strong>${escapeHTML(user.name)}</strong></td>
          <td>${escapeHTML(user.email)}</td>
          <td><span class="badge-role badge-role-${escapeHTML(user.role)}">${escapeHTML(user.role).toUpperCase()}</span></td>
        `;
      } else {
        tr.innerHTML = `
          <td><strong>${escapeHTML(user.name)}</strong></td>
          <td>${escapeHTML(user.email)}</td>
          <td><span class="badge-role badge-role-${escapeHTML(user.role)}">${escapeHTML(user.role).toUpperCase()}</span></td>
          <td class="admin-actions-cell">
            <button class="btn-icon btn-icon-edit" data-id="${user.id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn-icon btn-icon-delete" data-id="${user.id}" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
          </td>
        `;

        // Vincular eventos de editar y eliminar
        tr.querySelector(".btn-icon-edit").addEventListener("click", (e) => {
          const id = parseInt(e.currentTarget.getAttribute("data-id"), 10);
          this.editUser(id);
        });

        tr.querySelector(".btn-icon-delete").addEventListener("click", (e) => {
          const id = parseInt(e.currentTarget.getAttribute("data-id"), 10);
          this.deleteUser(id);
        });
      }

      tbody.appendChild(tr);
    });
  },

  editUser(id) {
    const user = this.users.find(u => u.id === id);
    if (!user) return;

    document.getElementById("admin-user-id").value = user.id;
    document.getElementById("admin-user-name").value = user.name;
    document.getElementById("admin-user-email").value = user.email;
    document.getElementById("admin-user-role").value = user.role;

    // Ocultar campo de rol si es docente (el docente no puede modificar roles)
    const currentUser = AuthService.getCurrentUser();
    const roleGroup = document.getElementById("admin-user-role").closest(".form-group");
    if (roleGroup) {
      if (currentUser && currentUser.role === 'docente') {
        roleGroup.style.display = "none";
      } else {
        roleGroup.style.display = "block";
      }
    }

    document.getElementById("admin-user-form-title").innerText = "Editar Usuario";
    document.getElementById("admin-user-form-container").style.display = "block";
  },

  async deleteUser(id) {
    if (await CustomModal.confirm("¿Estás seguro de que deseas eliminar este usuario del sistema?", "Eliminar Usuario")) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/users/${id}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        });
        if (!response.ok) {
          const err = await response.json();
          Toast.show(err.message || "Error al eliminar usuario del servidor", "error");
        }
      } catch (e) {
        console.warn("Backend no disponible para eliminar usuario.", e);
      }

      this.users = this.users.filter(u => u.id !== id);
      this.saveUsers();
      await this.renderUsers();
    }
  },

  async renderQuestions() {
    const currentUser = AuthService.getCurrentUser();
    const isDocente = currentUser && currentUser.role === 'docente';
    const questsCard = document.getElementById("admin-questions-card");
    if (questsCard) {
      questsCard.style.display = isDocente ? "none" : "block";
    }
    if (isDocente) return;

    const tbody = document.getElementById("admin-quests-table-body");
    if (!tbody) return;

    // Intentar consultar backend
    try {
      const response = await fetch(`${this.apiBaseUrl}/questions`);
      if (response.ok) {
        const backendQuests = await response.json();
        if (backendQuests && backendQuests.length > 0) {
          // Agrupar preguntas por procedimiento
          backendQuests.forEach(q => {
            if (!COGEP_QUIZZES[q.procedure_id]) {
              COGEP_QUIZZES[q.procedure_id] = { title: `Evaluación: ${q.procedure_id}`, questions: [] };
            }
          });
        }
      }
    } catch (e) {
      console.warn("Backend preguntas no disponible, usando datos estáticos.", e);
    }

    tbody.innerHTML = "";
    
    // Iterar por todos los procedimientos para recopilar las preguntas
    Object.keys(COGEP_QUIZZES).forEach(procKey => {
      const quiz = COGEP_QUIZZES[procKey];
      if (!quiz.questions) return;
      quiz.questions.forEach((q, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><span class="badge badge-gold">${procKey.toUpperCase()}</span></td>
          <td>${q.question}</td>
          <td class="admin-actions-cell">
            <button class="btn-icon btn-icon-edit" data-proc="${procKey}" data-idx="${index}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn-icon btn-icon-delete" data-proc="${procKey}" data-idx="${index}" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
          </td>
        `;

        tr.querySelector(".btn-icon-edit").addEventListener("click", (e) => {
          const proc = e.currentTarget.getAttribute("data-proc");
          const idx = parseInt(e.currentTarget.getAttribute("data-idx"), 10);
          this.editQuestion(proc, idx);
        });

        tr.querySelector(".btn-icon-delete").addEventListener("click", (e) => {
          const proc = e.currentTarget.getAttribute("data-proc");
          const idx = parseInt(e.currentTarget.getAttribute("data-idx"), 10);
          this.deleteQuestion(proc, idx);
        });

        tbody.appendChild(tr);
      });
    });
  },

  editQuestion(proc, idx) {
    const quiz = COGEP_QUIZZES[proc];
    const q = quiz.questions[idx];
    if (!q) return;

    document.getElementById("admin-quest-id").value = `${proc}-${idx}`;
    document.getElementById("admin-quest-procedure").value = proc;
    document.getElementById("admin-quest-text").value = q.question;
    document.getElementById("admin-quest-opt0").value = q.options[0] || "";
    document.getElementById("admin-quest-opt1").value = q.options[1] || "";
    document.getElementById("admin-quest-opt2").value = q.options[2] || "";
    document.getElementById("admin-quest-opt3").value = q.options[3] || "";
    document.getElementById("admin-quest-explanation").value = q.explanation || "";

    document.getElementById("admin-quest-form-title").innerText = "Editar Pregunta";
    document.getElementById("admin-quest-form-container").style.display = "block";
  },

  async deleteQuestion(proc, idx) {
    if (await CustomModal.confirm("¿Estás seguro de que deseas eliminar esta pregunta evaluativa?", "Eliminar Pregunta")) {
      const q = COGEP_QUIZZES[proc].questions[idx];
      if (q && q.db_id) {
        try {
          await fetch(`${this.apiBaseUrl}/questions/${q.db_id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
          });
        } catch (e) {
          console.warn("Error enviando DELETE de pregunta al servidor.", e);
        }
      }

      COGEP_QUIZZES[proc].questions.splice(idx, 1);
      await this.renderQuestions();
      
      if (COGEP_QUIZZES[proc].questions.length === 0) {
        COGEP_QUIZZES[proc].placeholder = true;
        COGEP_QUIZZES[proc].message = "El test no tiene preguntas activas en este momento.";
      }
      if (window.CogepQuiz) {
        window.CogepQuiz.render();
      }
    }
  },

  bindEvents() {
    // Mostrar formulario de nuevo usuario
    const btnAddUser = document.getElementById("admin-add-user-btn");
    if (btnAddUser) {
      btnAddUser.addEventListener("click", () => {
        document.getElementById("admin-user-id").value = "";
        document.getElementById("admin-user-form").reset();
        
        const currentUser = AuthService.getCurrentUser();
        const roleGroup = document.getElementById("admin-user-role").closest(".form-group");
        if (roleGroup) {
          if (currentUser && currentUser.role === 'docente') {
            roleGroup.style.display = "none";
            document.getElementById("admin-user-role").value = "estudiante";
          } else {
            roleGroup.style.display = "block";
          }
        }

        document.getElementById("admin-user-form-title").innerText = "Agregar Nuevo Usuario";
        document.getElementById("admin-user-form-container").style.display = "block";
      });
    }

    // Cancelar formulario usuario
    const btnCancelUser = document.getElementById("admin-user-cancel");
    if (btnCancelUser) {
      btnCancelUser.addEventListener("click", () => {
        document.getElementById("admin-user-form-container").style.display = "none";
      });
    }

    // Guardar usuario (Crear / Editar)
    const formUser = document.getElementById("admin-user-form");
    if (formUser) {
      formUser.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("admin-user-id").value;
        const name = document.getElementById("admin-user-name").value;
        const email = document.getElementById("admin-user-email").value;
        
        const currentUser = AuthService.getCurrentUser();
        let role = "estudiante";
        
        if (currentUser && currentUser.role === 'administrador') {
          role = document.getElementById("admin-user-role").value;
        }

        if (id) {
          // Editar backend
          try {
            await fetch(`${this.apiBaseUrl}/users/${id}`, {
              method: 'PUT',
              headers: this.getAuthHeaders(),
              body: JSON.stringify({ name, email, role })
            });
          } catch (err) {
            console.warn("Backend no disponible para editar usuario.", err);
          }

          const index = this.users.findIndex(u => u.id === parseInt(id, 10));
          if (index !== -1) {
            const oldUser = this.users[index];
            this.users[index] = { 
              id: parseInt(id, 10), 
              name, 
              email, 
              role: (currentUser && currentUser.role === 'administrador') ? role : oldUser.role 
            };
          }
        } else {
          // Crear backend
          try {
            const response = await fetch(`${this.apiBaseUrl}/users`, {
              method: 'POST',
              headers: this.getAuthHeaders(),
              body: JSON.stringify({ name, email, role, password: 'Password123' })
            });
            if (response.ok) {
              const newUser = await response.json();
              this.users.push(newUser);
            }
          } catch (err) {
            console.warn("Backend no disponible para crear usuario.", err);
            const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
            this.users.push({ id: newId, name, email, role });
          }
        }

        this.saveUsers();
        await this.renderUsers();
        document.getElementById("admin-user-form-container").style.display = "none";
        document.getElementById("admin-user-form").reset();
      });
    }

    // Mostrar formulario de nueva pregunta
    const btnAddQuest = document.getElementById("admin-add-quest-btn");
    if (btnAddQuest) {
      btnAddQuest.addEventListener("click", () => {
        document.getElementById("admin-quest-id").value = "";
        document.getElementById("admin-quest-form").reset();
        document.getElementById("admin-quest-form-title").innerText = "Agregar Nueva Pregunta";
        document.getElementById("admin-quest-form-container").style.display = "block";
      });
    }

    // Cancelar formulario pregunta
    const btnCancelQuest = document.getElementById("admin-quest-cancel");
    if (btnCancelQuest) {
      btnCancelQuest.addEventListener("click", () => {
        document.getElementById("admin-quest-form-container").style.display = "none";
      });
    }

    // Guardar pregunta (Crear / Editar)
    const formQuest = document.getElementById("admin-quest-form");
    if (formQuest) {
      formQuest.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("admin-quest-id").value;
        const proc = document.getElementById("admin-quest-procedure").value;
        const qText = document.getElementById("admin-quest-text").value;
        const opt0 = document.getElementById("admin-quest-opt0").value;
        const opt1 = document.getElementById("admin-quest-opt1").value;
        const opt2 = document.getElementById("admin-quest-opt2").value;
        const opt3 = document.getElementById("admin-quest-opt3").value;
        const explanation = document.getElementById("admin-quest-explanation").value;

        const options = [
          { text: opt0, is_correct: true },
          { text: opt1, is_correct: false }
        ];
        if (opt2.trim() !== "") options.push({ text: opt2, is_correct: false });
        if (opt3.trim() !== "") options.push({ text: opt3, is_correct: false });

        // Intentar guardar en backend
        try {
          if (id) {
            const parts = id.split("-");
            const dbId = parts[1];
            await fetch(`${this.apiBaseUrl}/questions/${dbId}`, {
              method: 'PUT',
              headers: this.getAuthHeaders(),
              body: JSON.stringify({ procedure_id: proc, question_text: qText, explanation, options })
            });
          } else {
            await fetch(`${this.apiBaseUrl}/questions`, {
              method: 'POST',
              headers: this.getAuthHeaders(),
              body: JSON.stringify({ procedure_id: proc, question_text: qText, explanation, options })
            });
          }
        } catch (err) {
          console.warn("Backend no disponible para guardar pregunta.", err);
        }

        const newQuest = {
          question: qText,
          options: [opt0, opt1, opt2, opt3].filter(o => o.trim() !== ""),
          answer: 0,
          explanation: explanation
        };

        if (id) {
          const parts = id.split("-");
          const oldProc = parts[0];
          const idx = parseInt(parts[1], 10);
          
          if (oldProc === proc && COGEP_QUIZZES[proc] && COGEP_QUIZZES[proc].questions) {
            COGEP_QUIZZES[proc].questions[idx] = newQuest;
          } else if (COGEP_QUIZZES[oldProc] && COGEP_QUIZZES[oldProc].questions) {
            COGEP_QUIZZES[oldProc].questions.splice(idx, 1);
            if (!COGEP_QUIZZES[proc].questions) COGEP_QUIZZES[proc].questions = [];
            COGEP_QUIZZES[proc].questions.push(newQuest);
          }
        } else {
          if (!COGEP_QUIZZES[proc].questions) {
            COGEP_QUIZZES[proc].questions = [];
          }
          COGEP_QUIZZES[proc].questions.push(newQuest);
          COGEP_QUIZZES[proc].placeholder = false;
        }

        await this.renderQuestions();
        if (window.CogepQuiz) {
          window.CogepQuiz.render();
        }
        document.getElementById("admin-quest-form-container").style.display = "none";
        document.getElementById("admin-quest-form").reset();
      });
    }
  }
};

window.AdminPanel = AdminPanel;

