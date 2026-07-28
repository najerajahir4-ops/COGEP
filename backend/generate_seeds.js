const fs = require('fs');
const path = require('path');
const vm = require('vm');

try {
  const dataJsPath = path.join(__dirname, '../js/data.js');
  let dataContent = fs.readFileSync(dataJsPath, 'utf8');

  // Agregar exportación global para poder leer las constantes desde Node VM
  dataContent += "\nglobal.COGEP_QUIZZES = COGEP_QUIZZES;\n";

  // Crear contexto sandbox para evaluar data.js
  const sandbox = { global: {} };
  sandbox.global = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(dataContent, sandbox);

  const quizzes = sandbox.COGEP_QUIZZES || sandbox.global.COGEP_QUIZZES;
  if (!quizzes) {
    throw new Error("No se encontró COGEP_QUIZZES en data.js");
  }

  let sql = "USE cogep_db;\n\n";
  sql += "-- Limpiar preguntas y opciones previas para evitar duplicados\n";
  sql += "DELETE FROM question_options;\n";
  sql += "DELETE FROM questions;\n\n";

  for (const [procId, quiz] of Object.entries(quizzes)) {
    for (const q of quiz.questions) {
      const qText = q.question.replace(/'/g, "''");
      const qExp = q.explanation.replace(/'/g, "''");
      sql += `INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('${procId}', '${qText}', '${qExp}');\n`;
      sql += `SET @qid = LAST_INSERT_ID();\n`;
      
      q.options.forEach((optText, optIdx) => {
        const escapedOpt = optText.replace(/'/g, "''");
        const isCorrect = optIdx === q.answer ? 1 : 0;
        sql += `INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '${escapedOpt}', ${isCorrect});\n`;
      });
      sql += `\n`;
    }
  }

  fs.writeFileSync(path.join(__dirname, 'insert_questions.sql'), sql, 'utf8');
  console.log("Semillas SQL de preguntas generadas exitosamente en insert_questions.sql");
} catch (e) {
  console.error("Error al generar las semillas:", e);
}
