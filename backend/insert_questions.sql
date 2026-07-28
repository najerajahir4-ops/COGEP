USE cogep_db;

-- Limpiar preguntas y opciones previas para evitar duplicados
DELETE FROM question_options;
DELETE FROM questions;

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'María presenta una demanda dentro del procedimiento ordinario. En el escrito identifica al juzgador, relata los hechos y firma junto con su abogado. Sin embargo, no anuncia los medios de prueba ni establece claramente la pretensión. Como juzgador, ¿qué corresponde hacer?', 'El Art. 142 COGEP exige que la demanda contenga, entre otros requisitos, el anuncio de medios de prueba y una pretensión clara y precisa. Si faltan requisitos, el Art. 146 dispone que el juzgador ordene completar o aclarar la demanda en 3 días; si no se corrige, procederá el archivo.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Admitir inmediatamente la demanda.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Disponer que la actora complete o aclare la demanda dentro de tres días.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Convocar directamente a audiencia preliminar.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Archivar inmediatamente el proceso sin oportunidad de subsanar.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Un estudiante revisa un caso donde el actor presentó correctamente la demanda. El juez demora varias semanas antes de examinar si cumple requisitos legales. Según el documento, ¿cuál es el término máximo para examinar y calificar la demanda?', 'El Art. 146 COGEP establece que, presentada la demanda, el juzgador examinará si cumple requisitos generales y especiales en un término máximo de cinco días. Si cumple, calificará y tramitará la causa.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '48 horas.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '3 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '5 días.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '30 días.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'El citador acude al domicilio del demandado, pero no logra encontrarlo personalmente. ¿Qué forma de actuación corresponde según el procedimiento ordinario?', 'El Art. 55 COGEP señala que, si no se encuentra personalmente al demandado, la citación podrá realizarse mediante tres boletas entregadas en días distintos en su domicilio o residencia; si no hay personas presentes, podrán fijarse en la puerta del lugar.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Suspender definitivamente la citación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Publicar inmediatamente en prensa nacional.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Entregar tres boletas en días distintos en el domicilio.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Dictar sentencia en rebeldía.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Pedro quiere demandar a una persona cuyo domicilio y residencia resultan imposibles de determinar. Afirma haber realizado diligencias para ubicarla. ¿Qué requisito adicional exige el procedimiento antes de admitir esta forma de citación?', 'El Art. 56 COGEP exige que quien solicita citación por medios de comunicación declare bajo juramento que fue imposible determinar la individualidad, domicilio o residencia del demandado y que se realizaron diligencias necesarias para localizarlo.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solicitar autorización municipal.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Declaración juramentada indicando imposibilidad de determinar individualidad, domicilio o residencia.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Haber intentado únicamente la citación por correo electrónico.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar un recurso de apelación previo.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'En un proceso ordinario, el demandado fue citado válidamente. El estudiante debe calcular cuánto tiempo tiene para responder. ¿Cuál es el término para presentar la contestación?', 'El Art. 291 COGEP dispone que la o el demandado tendrá 30 días para presentar su contestación a la demanda, contados desde la práctica de la última citación cuando existan varios demandados.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '10 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '20 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '30 días.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '60 días.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'En un procedimiento ordinario, ya venció el término de contestación a la demanda. El juez debe actuar. ¿Qué corresponde según el COGEP?', 'El Art. 292 dispone que, con o sin contestación, dentro de los 3 días posteriores al vencimiento del término anterior, el juzgador convocará a la audiencia preliminar.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Convocar audiencia preliminar después de 60 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Convocar audiencia preliminar dentro de los tres días posteriores al vencimiento del término anterior.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Emitir sentencia inmediata.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Abrir directamente período probatorio.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'El juez convocó audiencia preliminar. Un estudiante debe verificar si la fecha señalada es válida. ¿En qué plazo debe realizarse?', 'Según el Art. 292, la audiencia preliminar debe realizarse en un término no menor a 10 ni mayor a 20 días.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Entre 5 y 8 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Entre 10 y 20 días.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Máximo 45 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Dentro de 90 días.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Instalada la audiencia preliminar, la parte demandada insiste en sus excepciones previas. ¿Cuál es la actuación inicial del juzgador?', 'El Art. 294 numeral 1 señala que instalada la audiencia, el juzgador solicitará a las partes que se pronuncien sobre las excepciones previas propuestas.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ignorarlas hasta la sentencia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solicitar pronunciamiento de las partes sobre las excepciones propuestas.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Declarar automáticamente nulidad.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Remitir el caso a mediación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Durante la audiencia preliminar, actor y demandado llegan a un acuerdo completo. ¿Qué efecto produce?', 'El Art. 294 numeral 4 dispone que si existe conciliación total, ésta será aprobada mediante sentencia que causará ejecutoria.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se suspende el proceso por 90 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'El juez aprueba mediante sentencia que causa ejecutoria.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Debe abrirse período probatorio igualmente.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Debe enviarse obligatoriamente a Corte Provincial.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Las partes solucionan únicamente una parte del conflicto. ¿Cómo debe proceder el juez?', 'El Art. 294 numeral 5 establece que la conciliación parcial se aprueba mediante auto con fuerza ejecutoria, continuando el proceso respecto de la materia aún controvertida.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Declarar terminado todo el proceso.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Aprobar la conciliación parcial y continuar sobre la controversia restante.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Archivar inmediatamente.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Convocar nuevo juicio.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'En Mediación, el juez considera viable un acuerdo extrajudicial. ¿Qué puede hacer conforme al procedimiento ordinario?', 'El Art. 294 numeral 6 autoriza al juzgador, de oficio o a petición de parte, disponer que la controversia pase a un centro de mediación legalmente constituido.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ordenar sentencia anticipada.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Remitir la controversia a un centro de mediación legalmente constituido.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Eliminar la audiencia preliminar.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Negar toda conciliación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Las partes firman un acta de mediación con acuerdo total. ¿Qué hace el juzgador?', 'El documento establece que si existe acuerdo total en mediación, el juez incorporar el acta al proceso para darlo por concluido.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reinicia la causa.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Incorpora el acta al proceso y lo concluye.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Convoca nueva audiencia preliminar.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Abre etapa probatoria.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Terminadas las primeras intervenciones, las partes deben continuar con sus obligaciones procesales. ¿Qué deben hacer?', 'El Art. 294 numeral 7 establece que las partes deben anunciar la totalidad de pruebas que presentarán en la audiencia de juicio.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar únicamente testigos.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Anunciar la totalidad de las pruebas para audiencia de juicio.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Esperar sentencia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Apelar inmediatamente.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Una parte intenta presentar prueba obtenida violando garantías constitucionales. ¿Qué corresponde?', 'El juzgador debe excluir pruebas ilegales, incluyendo las obtenidas con violación de normas, garantías constitucionales o requisitos formales.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Admitirla obligatoriamente.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Excluir la prueba ilegal.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Resolverla en apelación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Mantenerla por economía procesal.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Concluida la admisibilidad de prueba, corresponde organizar el juicio. ¿Quién fija la fecha?', 'Conforme al Art. 294, la o el juzgador fijará la fecha de la audiencia de juicio luego del tratamiento probatorio.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'El actor.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'El secretario.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'El juzgador.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'La Corte Provincial.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Ha llegado la fecha señalada para la audiencia de juicio en un procedimiento ordinario. ¿Cuál es la finalidad principal de esta audiencia?', 'La audiencia de juicio constituye la etapa destinada a la práctica de prueba, exposición de alegatos y resolución del conflicto, conforme a la estructura del procedimiento ordinario prevista en el COGEP.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Corregir la demanda inicial.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Practicar prueba, alegar y resolver la controversia.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar únicamente excepciones previas.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solicitar mediación obligatoria.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Durante la audiencia de juicio, una parte intenta presentar prueba documental que nunca fue anunciada en audiencia preliminar. ¿Cómo debe actuar el juzgador?', 'En el procedimiento ordinario, la prueba debe ser anunciada oportunamente, y su práctica en juicio depende de la admisibilidad previamente determinada por el juzgador.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Admitirla sin análisis.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Diferir el juicio.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Verificar si la prueba fue oportunamente anunciada antes de admitirla.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Remitir el asunto a casación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Finalizada la práctica probatoria, las partes solicitan intervenir nuevamente. ¿Qué actuación procesal corresponde?', 'Luego de practicadas las pruebas, las partes pueden realizar alegatos finales, vinculando los hechos demostrados con sus pretensiones y argumentos jurídicos.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar nuevos testigos.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Formular alegatos finales.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reiniciar la audiencia preliminar.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar apelación inmediata.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Concluida la audiencia de juicio, el estudiante analiza cómo finaliza el procedimiento. ¿Qué corresponde emitir al juzgador?', 'La sentencia constituye el acto jurisdiccional mediante el cual el juzgador resuelve el conflicto sometido a conocimiento dentro del procedimiento ordinario.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reconvención.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación adicional.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sentencia.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Nueva demanda.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Una parte considera que la sentencia contiene puntos oscuros o ambiguos. ¿Qué mecanismo procesal puede solicitar?', 'La aclaración procede cuando una resolución presenta conceptos dudosos, ambiguos u oscuros que requieren precisión por parte del juzgador.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Casación directa.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reconvención.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Aclaración.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Nueva citación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'El juez resolvió parcialmente las pretensiones planteadas y omitió pronunciarse sobre un punto solicitado por una parte. ¿Qué recurso corresponde solicitar?', 'La ampliación procede cuando el juzgador omitió resolver alguno de los puntos controvertidos o peticiones formuladas oportunamente.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ampliación.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Mediación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Contestación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Una de las partes considera incorrecta la decisión emitida por el juzgador de primera instancia. ¿Qué finalidad tiene la apelación?', 'La apelación es un recurso ordinario mediante el cual se busca que un órgano jurisdiccional superior revise la resolución dictada por el juez inferior.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reiniciar automáticamente el juicio.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solicitar revisión de la decisión por el superior.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Modificar la demanda inicial.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar nuevas pruebas ilimitadas.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Una parte considera que existe incorrecta aplicación o interpretación de normas jurídicas en la sentencia. ¿Qué recurso resulta pertinente?', 'La casación busca controlar la correcta aplicación e interpretación del derecho, revisando errores jurídicos presentes en resoluciones judiciales.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Recurso de hecho.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reconvención.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Casación.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'El juez negó la concesión de un recurso solicitado por una de las partes. ¿Qué herramienta procesal podría activarse?', 'El recurso de hecho puede interponerse cuando existe negativa respecto de la concesión de determinados recursos previstos en la normativa procesal.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Recurso de hecho.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Contestación complementaria.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Nueva demanda ordinaria.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Conciliación obligatoria.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ordinario', 'Un estudiante debe explicar la lógica completa del procedimiento ordinario del COGEP. ¿Cuál de las siguientes secuencias refleja correctamente la estructura general?', 'El procedimiento ordinario se desarrolla de forma secuencial: demanda, calificación, citación, contestación, audiencia preliminar, audiencia de juicio y sentencia, incorporando mecanismos probatorios y recursos procesales contemplados en el COGEP.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sentencia -> Demanda -> Citación -> Juicio.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación -> Sentencia -> Demanda -> Apelación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Demanda -> Citación -> Contestación -> Audiencia preliminar -> Audiencia de juicio -> Sentencia.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Mediación -> Casación -> Reconvención -> Archivo.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Luis desea cobrar judicialmente una deuda y presenta un pagaré firmado por el deudor. ¿Por qué este caso podría tramitarse mediante procedimiento ejecutivo?', 'El procedimiento ejecutivo exige la existencia de un título ejecutivo, es decir, un documento que permita exigir una obligación clara, pura, determinada y actualmente exigible.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Porque toda deuda se tramita obligatoriamente por ejecutivo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Porque existe un título ejecutivo que respalda la obligación.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Porque no se requieren documentos.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Porque el actor eligió libremente el procedimiento.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Presentada y admitida la demanda ejecutiva, el juez debe emitir la providencia correspondiente. ¿Qué actuación procesal caracteriza esta etapa?', 'Dentro del procedimiento ejecutivo, una vez calificada la demanda, el juzgador dicta el mandamiento de ejecución, disponiendo el cumplimiento de la obligación reclamada.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Convocatoria inmediata a remate.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Emisión del mandamiento de ejecución.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Archivo del proceso.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Casación automática.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'El ejecutado considera improcedente la obligación exigida y decide defenderse. ¿Qué puede hacer dentro del procedimiento ejecutivo?', 'El ejecutado tiene la posibilidad de oponerse a la ejecución, planteando defensas y excepciones previstas por la normativa procesal.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ignorar la demanda sin consecuencias.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Formular oposición con fundamento legal.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar directamente casación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solicitar remate inmediato.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'El deudor no cumple voluntariamente la obligación exigida. ¿Qué medida puede adoptarse para asegurar la ejecución?', 'El embargo constituye una medida propia del procedimiento ejecutivo destinada a asegurar bienes que permitan satisfacer el crédito reclamado.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reforma constitucional.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Embargo de bienes.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Apelación obligatoria.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Revocatoria de la demanda.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Durante el remate de bienes muebles, un postor propone pagar en cuotas sin acuerdo entre ejecutante y ejecutado. ¿Qué corresponde según el documento?', 'En el remate de bienes muebles, el documento señala que todo pago se hará al contado, salvo que ejecutante y ejecutado acuerden otra modaldiad.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Admitir siempre ofertas a plazo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Rechazar la oferta a plazo salvo acuerdo entre ejecutante y ejecutado.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Suspender automáticamente el remate.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Remitir el caso a Corte Provincial.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Dos postores presentan ofertas equivalentes durante un remate. ¿Qué criterio general aplica?', 'El documento establece que, ante posturas iguales, se preferirá la ingresada en primer lugar, salvo cuando exista postura de la o del ejecutante.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se anulan ambas posturas.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se prefiere la ingresada primero, salvo postura del ejecutante.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Gana siempre la última presentada.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se ordena nuevo juicio.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Acreditados los valores ofrecidos por varios postores, el juez debe continuar el procedimiento. ¿Qué actuación corresponde?', 'El Art. 402 dispone que, acreditados los valores, la o el juzgador señalará día y hora para audiencia pública donde se calificarán las posturas.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Emitir sentencia definitiva.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Señalar audiencia pública para calificación de posturas.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Convocar mediación obligatoria.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Declarar automáticamente adjudicado el bien.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Existen varias ofertas válidas sobre un bien rematado. ¿Qué criterio debe considerar prioritariamente el juzgador?', 'El Art. 402 establece que el juzgador calificará las posturas considerando cantidad ofrecida, plazo y demás condiciones, privilegiando las que cubran al contado crédito, intereses y costas.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Únicamente la simpatía del postor.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Cantidad ofrecida, plazo y condiciones.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Orden alfabético de los participantes.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Antigüedad del abogado patrocinador.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Se emitió el auto de calificación de posturas y una parte desea impugnarlo. ¿Quiénes pueden apelar?', 'El documento dispone que el auto de calificación de posturas puede ser apelado por ejecutante y terceristas coadyuvantes; el ejecutado podrá hacerlo cuando la postura sea inferior a la base del remate.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solamente el secretario judicial.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ejecutante y terceristas coadyuvantes; el ejecutado en ciertos casos previstos.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Cualquier ciudadano.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo el deudor.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Fue concedida una apelación relacionada con la calificación de posturas. ¿Cómo debe resolver la Corte Provincial?', 'Concedida la apelación, la Corte Provincial resolverá en el término de quince días, sin ninguna tramitación, y contra su fallo no cabrá recurso alguno.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'En audiencia oral obligatoria de seis meses.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'En el término de quince días y sin ninguna tramitación.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Mediante consulta popular.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Únicamente con intervención notarial.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Durante la audiencia de calificación, dos ofertas son consideradas por el juzgador como igualmente convenientes y además constituyen las mejores posturas. ¿Qué puede disponer el juzgador?', 'El Art. 403 establece que si existen posturas conceptuadas iguales y el juzgador considera que son las mejores, podrá disponer en la misma audiencia la adjudicación al mejor postor.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Anular el remate automáticamente.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Suspender indefinidamente la audiencia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Disponer en la misma audiencia la adjudicación al mejor postor.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ordenar nuevo juicio ejecutivo.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'El acreedor desea participar como postor en el remate del bien embargado. ¿Qué posibilidad reconoce el procedimiento?', 'El Art. 404 reconoce que la o el acreedor puede hacer postura con la misma libertad que cualquier otra persona.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Tiene prohibido participar.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Puede participar con la misma libertad que cualquier persona.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo puede intervenir con autorización notarial.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Debe esperar terminar el remate.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'No existen tercerías coadyuvantes y el acreedor presenta postura imputándola al valor de su crédito. ¿Debe acompañar obligatoriamente la consignación del 10%?', 'Conforme al Art. 404, si no existen tercerías coadyuvantes, el acreedor puede imputar la postura al valor de su crédito sin acompañar la consignación del 10%.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sí, siempre.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'No, en este supuesto puede actuar sin esa consignación.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo si lo autoriza la Corte Provincial.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo si intervienen testigos.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Trabajadores con crédito reconocido desean intervenir en el remate. ¿Qué regla les resulta aplicable?', 'El Art. 404 dispone que las y los trabajadores pueden hacer postura libremente e imputarla al valor de su crédito sin consignar el 10%, aun existiendo tercería coadyuvante.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Tienen prohibición absoluta de participar.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo pueden intervenir mediante abogado del ejecutante.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Pueden postular libremente e imputar su crédito sin consignar 10%.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Deben esperar el resultado del remate.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Se realiza el remate, pero nadie presenta ofertas. ¿Qué alternativa tiene el acreedor?', 'El Art. 405 establece que, si no existen postores, el acreedor podrá solicitar retasas necesarias o pedir embargo y remate de otros bienes, liberando los anteriores.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Perder automáticamente el proceso.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solicitar retasa de bienes o embargo y remate de otros bienes.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reiniciar la demanda desde cero.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar casación inmediata.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'El remate se realizó en fecha distinta a la señalada por el juzgador. ¿Qué efecto puede producir?', 'El Art. 406 señala que el remate será nulo cuando se verifique en día distinto del señalado por la o el juzgador.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ninguno.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Nulidad del remate.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Revocatoria automática de la demanda.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Casación obligatoria.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Una parte demuestra que el remate no fue publicitado conforme lo ordenado judicialmente. ¿Qué consecuencia prevé el procedimiento?', 'Según el Art. 406, el remate será nulo si no se publicitó en la forma ordenada por el juzgador.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ninguna consecuencia procesal.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Suspensión de la apelación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Posible nulidad del remate.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Archivo definitivo de la ejecución.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Durante la audiencia de calificación se identifica una causal de nulidad del remate. ¿Quién puede promoverla?', 'La nulidad del remate puede declararse de oficio o a petición de parte durante la audiencia de calificación.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solamente el ejecutante.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Únicamente el secretario judicial.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'El juzgador de oficio o a petición de parte.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Exclusivamente la Corte Constitucional.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'El juzgador declaró nulo un remate. ¿Qué corresponde posteriormente?', 'Si se declara la nulidad del remate, el procedimiento dispone señalar nuevo día para el remate conforme al COGEP.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Terminar definitivamente el proceso.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Señalar nuevo día para el remate conforme al Código.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Dictar sentencia penal.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Abrir mediación obligatoria.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'El postor preferente consignó correctamente el valor ofrecido. ¿Qué debe emitir el juzgador?', 'El Art. 407 dispone que, consignado el valor ofrecido, la o el juzgador emitirá el auto de adjudicación, que contendrá los datos exigidos por la norma.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reconvención.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Auto de adjudicación.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Acción extraordinaria de protección.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reforma constitucional.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'El juez prepara el auto de adjudicación luego de haberse consignado el valor correspondiente del remate. ¿Cuál de los siguientes elementos debe constar en dicho auto?', 'El Art. 407 establece que el auto de adjudicación debe contener, entre otros aspectos, la individualización del bien rematado, antecedentes registrales cuando corresponda y el precio por el que se realizó el remate.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Únicamente el nombre del abogado patrocinador.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo la fecha del embargo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Individualización del bien rematado y precio del remate.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Únicamente la dirección del juzgado.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'El postor declarado preferente no consigna dentro del plazo el valor ofrecido al contado. ¿Qué corresponde hacer al juzgador?', 'El Art. 408 dispone que si la o el postor no consigna el valor ofrecido, se notificará a la o al siguiente postor en el orden de preferencia para que consigne dentro del término legal.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Archivar inmediatamente el proceso.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Convocar nuevo juicio ejecutivo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Notificar al siguiente postor según el orden de preferencia para que consigne.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Adjudicar automáticamente el bien al ejecutado.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'El primer postor incumplió el pago y el bien terminó adjudicándose a otro oferente por un valor menor. ¿Cómo denomina el COGEP a la diferencia entre ambos valores?', 'Según el Art. 409, se denomina quiebra del remate a la diferencia entre el precio aceptado al primer postor preferente y el valor ofrecido por quien finalmente resulte adjudicatario.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Retasa judicial.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Postura preferente.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Quiebra del remate.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Tradición material.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Concluido el proceso de adjudicación, el nuevo propietario necesita formalizar jurídicamente el título. ¿Qué dispone el procedimiento?', 'El Art. 410 dispone que el auto de adjudicación se protocolizará para servir de título y se inscribirá en el registro correspondiente.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'El auto queda válido sin formalidad alguna.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Debe protocolizarse e inscribirse en el registro correspondiente.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo requiere firma del depositario.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Debe aprobarlo previamente la Corte Constitucional.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecutivo', 'Se consignó el precio del bien rematado y el estudiante debe determinar el destino de esos valores y los recursos aplicables. ¿Qué actuación corresponde según el documento?', 'El Art. 412 dispone que con el valor del remate se pagará inmediatamente a la o al acreedor el principal, intereses, indemnizaciones y costas, entregándose el sobrante al deudor si corresponde. Además, el Art. 413 señala que serán apelables exclusivamente el auto de calificación de postura y el auto de adjudicación.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Todo el dinero se entrega automáticamente al deudor.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se paga primero al acreedor principal, intereses, indemnizaciones y costas; además, son apelables exclusivamente el auto de calificación de postura y el auto de adjudicación.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo se pagan costas judiciales.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Procede apelación contra cualquier providencia del remate.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Andrea presenta una demanda en procedimiento sumario. Relata los hechos y señala al demandado, pero omite anunciar medios de prueba y no especifica claramente la pretensión. ¿Qué análisis corresponde realizar al juzgador?', 'El Art. 142 exige que la demanda contenga, entre otros elementos, fundamentos de derecho, anuncio de prueba y pretensión clara y precisa. Antes de tramitarla, el juzgador debe verificar estos requisitos.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Admitir inmediatamente la demanda.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Revisar si cumple los requisitos del Art. 142 antes de calificarla.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Convocar directamente a audiencia única.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Dictar sentencia anticipada.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Presentada una demanda sumaria correctamente estructurada, el estudiante analiza cuánto tiempo tiene el juez para revisarla. ¿Cuál es el término máximo de calificación?', 'El Art. 146 COGEP establece que la o el juzgador examinará la demanda en un término máximo de cinco días para verificar requisitos legales generales y especiales.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '48 horas.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '3 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '5 días.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '15 días.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'El juez advierte que la demanda presentada no cumple con varios requisitos procesales. ¿Qué actuación corresponde?', 'Según el Art. 146, si la demanda no cumple requisitos, el juzgador ordenará completarla o aclararla dentro de tres días; si no se subsana, procederá el archivo.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Rechazar definitivamente la acción.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Conceder tres días para completar o aclarar la demanda.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ordenar inmediatamente audiencia única.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Remitir el caso a apelación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'El citador encuentra al demandado personalmente en su lugar de trabajo. ¿Qué modalidad de citación corresponde?', 'El Art. 54 señala que la citación personal se cumple mediante entrega directa del contenido de la demanda y providencias a la o al demandado o a su representante legal.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación por radio.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación por boletas.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación personal.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación consular.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'El demandado no pudo ser localizado personalmente en su domicilio. ¿Qué alternativa prevé el procedimiento?', 'El Art. 55 dispone que, si no se encuentra personalmente al demandado, la citación se realizará mediante tres boletas entregadas en días distintos en domicilio o residencia.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Suspender definitivamente la citación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Publicar inmediatamente en prensa nacional.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Utilizar tres boletas entregadas en días distintos.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Dictar sentencia automática.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'La parte actora no logra determinar el domicilio ni residencia del demandado. ¿Qué requisito debe cumplir para solicitar citación por medios de comunicación?', 'El Art. 56 exige que el solicitante declare bajo juramento haber agotado diligencias necesarias y que fue imposible determinar individualidad, domicilio o residencia del demandado.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solicitar autorización municipal.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar juramento indicando imposibilidad de determinar domicilio e individualidad.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar casación previa.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Obtener autorización del registrador.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'En una localidad rural, el juez considera que la radiodifusora es el principal medio de comunicación. ¿Qué característica debe cumplir esta modalidad?', 'El Art. 56 establece que los mensajes radiales deberán transmitirse en tres fechas distintas, al menos tres veces por día, entre las 06h00 y 22h00.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Una sola transmisión mensual.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Tres transmisiones diarias en horario de 06h00 a 22h00.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Publicación exclusiva en redes sociales.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Notificación únicamente por correo electrónico.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'El demandado fue citado válidamente y desea ejercer su defensa. ¿Qué puede realizar al contestar la demanda?', 'El documento señala que el demandado contesta la demanda, propone excepciones y puede reconvenir dentro del procedimiento sumario.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo aceptar hechos.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Contestar, proponer excepciones y eventualmente reconvenir.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar únicamente apelación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solicitar directamente casación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Luego de presentada la acción, el actor intenta modificar sustancialmente su demanda. ¿Qué regla aplica en procedimiento sumario?', 'El Art. 333 numeral 1 establece expresamente que no procede la reforma de la demanda dentro del procedimiento sumario.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Siempre procede reforma libremente.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo con autorización de la contraparte.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'No procede la reforma de la demanda.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo procede después de sentencia.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'El demandado desea presentar una pretensión contra el actor durante el procedimiento sumario. ¿Qué limitación establece el COGEP?', 'El Art. 333 numeral 2 dispone que en procedimiento sumario solo se admitirá la reconvención conexa.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Está prohibida toda reconvención.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo se admite reconvención conexa.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'La reconvención requiere autorización consular.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Debe plantearse únicamente en apelación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Un estudiante analiza diferentes conflictos jurídicos y debe identificar cuándo corresponde utilizar el procedimiento sumario. ¿Cuál es una característica general de este procedimiento?', 'El Art. 333 COGEP establece que el procedimiento sumario se aplica a los casos expresamente determinados por la normativa, bajo reglas procesales específicas.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Está diseñado únicamente para delitos penales.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se utiliza para materias determinadas expresamente por la ley.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se aplica a toda clase de controversias civiles.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reemplaza siempre al procedimiento ordinario.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Venció el término de contestación y el juez debe continuar el trámite procesal. ¿Qué característica distingue al procedimiento sumario?', 'El procedimiento sumario se desarrolla mediante audiencia única, concentrando saneamiento, conciliación, prueba y alegatos en un solo acto procesal.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Dos audiencias obligatorias.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Una audiencia única.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo etapa escrita.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Resolución sin audiencia.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Instalada la audiencia, el juzgador debe verificar la regularidad procesal antes de continuar. ¿Qué actuación corresponde?', 'Dentro de la audiencia única, el juzgador debe efectuar el saneamiento procesal, verificando competencia, validez del procedimiento y posibles nulidades.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Emitir sentencia inmediata.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Realizar saneamiento del proceso.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ordenar casación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Remitir el caso a mediación obligatoria.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Durante la audiencia, las partes manifiestan voluntad de solucionar el conflicto. ¿Qué debe hacer el juzgador?', 'La conciliación constituye una etapa de la audiencia única, buscando que las partes alcancen una solución consensuada antes de continuar con la controversia.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Negar todo acuerdo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Intentar la conciliación conforme al procedimiento.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Suspender definitivamente la causa.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Dictar sentencia automática.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'No fue posible conciliar y el proceso continúa. ¿Qué actividad sigue dentro de la audiencia única?', 'Superada la etapa conciliatoria, corresponde la práctica probatoria, permitiendo demostrar hechos relevantes del proceso.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Consulta popular.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Práctica de prueba.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Casación inmediata.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Nueva demanda.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Luego de practicarse las pruebas, las partes solicitan intervenir nuevamente. ¿Qué actuación corresponde?', 'Después de la práctica de prueba, las partes pueden formular alegatos, relacionando pruebas, hechos y fundamentos jurídicos antes de la decisión judicial.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reformar la demanda.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar alegatos finales.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reiniciar la citación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Convocar audiencia preliminar.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Concluyeron las etapas de la audiencia única. ¿Qué corresponde al juzgador?', 'Luego del desarrollo de la audiencia única, el juzgador debe resolver la controversia mediante sentencia conforme al COGEP.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Emitir sentencia.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar reconvención.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Iniciar nuevamente citación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Abrir etapa extraordinaria de prueba.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Una de las partes considera que ciertos puntos de la sentencia resultan ambiguos. ¿Qué mecanismo procesal puede solicitar?', 'La aclaración procede cuando existen conceptos oscuros, ambiguos o imprecisos dentro de una resolución judicial.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Aclaración.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Nueva citación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reforma de demanda.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Embargo.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'El juzgador omitió resolver uno de los puntos discutidos por las partes. ¿Qué solicitud corresponde?', 'La ampliación permite requerir pronunciamiento judicial sobre asuntos omitidos dentro de la resolución emitida.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Casación inmediata.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ampliación.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación complementaria.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Nueva demanda.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Una parte considera incorrecta la decisión adoptada en primera instancia. ¿Qué finalidad cumple la apelación?', 'La apelación permite solicitar que una autoridad jurisdiccional superior revise la decisión emitida por el juzgador de primera instancia.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Iniciar nuevo proceso desde cero.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Obtener revisión de la decisión por el órgano superior.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reformar la Constitución.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Evitar toda ejecución.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Una parte sostiene que en la sentencia existe una incorrecta aplicación e interpretación de normas jurídicas. ¿Qué recurso extraordinario podría intentar?', 'La casación constituye un recurso extraordinario orientado a controlar la correcta aplicación e interpretación del derecho, revisando errores jurídicos contenidos en resoluciones judiciales.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reforma de demanda.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Casación.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación complementaria.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reconvención.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'El juzgador negó la concesión de un recurso solicitado por una de las partes. ¿Qué alternativa procesal puede activarse?', 'El recurso de hecho procede frente a determinadas negativas relacionadas con la concesión de recursos contemplados por la normativa procesal.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Mediación obligatoria.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Recurso de hecho.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Nueva demanda sumaria.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Embargo preventivo.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Un estudiante compara procedimiento ordinario y procedimiento sumario. ¿Cuál elemento distingue principalmente al procedimiento sumario?', 'A diferencia del procedimiento ordinario, el sumario concentra las actuaciones procesales en una audiencia única, buscando mayor celeridad y simplificación procesal.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Tiene audiencia preliminar y audiencia de juicio.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Utiliza audiencia única concentrada.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Carece totalmente de prueba.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se desarrolla solo por escrito.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Durante el análisis del procedimiento sumario, un alumno observa que varias etapas se desarrollan en un solo acto procesal. ¿Qué característica del procedimiento refleja esta dinámica?', 'El procedimiento sumario responde a una lógica de concentración procesal, integrando saneamiento, conciliación, prueba, alegatos y decisión en una estructura simplificada.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Fragmentación procesal.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Concentración procesal.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Desformalización absoluta.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Suspensión indefinida.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('sumario', 'Un estudiante debe reconstruir correctamente la lógica general del procedimiento sumario dentro del COGEP. ¿Cuál secuencia representa adecuadamente su estructura?', 'La estructura general del procedimiento sumario comprende demanda, calificación, citación, contestación, audiencia única y sentencia, incorporando mecanismos de defensa, prueba y recursos procesales previstos en el COGEP.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Demanda -> Audiencia preliminar -> Juicio -> Casación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Demanda -> Citación -> Contestación -> Audiencia única -> Sentencia.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación -> Sentencia -> Demanda -> Reconvención.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Mediación -> Embargo -> Remate -> Casación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'María desea cobrar una deuda de USD 8.000. Posee documentos firmados por el deudor, pero no cuenta con un título ejecutivo. ¿Qué procedimiento podría utilizar?', 'El Art. 356 COGEP permite iniciar un procedimiento monitorio para cobrar una deuda líquida, determinada, exigible y vencida que no conste en título ejecutivo y cuyo monto no exceda de cincuenta salarios básicos unificados.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Procedimiento ordinario exclusivamente.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Procedimiento monitorio.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Procedimiento penal.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Procedimiento de casación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'Un acreedor pretende cobrar una deuda mediante procedimiento monitorio. ¿Cuál es el límite máximo establecido por la norma?', 'El procedimiento monitorio procede cuando la deuda no excede de cincuenta salarios básicos unificados del trabajador en general.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '10 SBU.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '25 SBU.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '50 SBU.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '100 SBU.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'El acreedor presenta un documento firmado por el deudor donde se reconoce la obligación. ¿Constituye un medio válido para iniciar el procedimiento monitorio?', 'El Art. 356 numeral 1 admite documentos firmados por la o el deudor, incluyendo señales físicas o electrónicas que permitan acreditar la obligación.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'No, porque solo sirven escrituras públicas.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sí, siempre que permita demostrar la deuda.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo si existe sentencia previa.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Únicamente si intervino un notario.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'Una empresa desea cobrar una deuda utilizando facturas firmadas y comprobantes de entrega. ¿Qué establece el COGEP?', 'El Art. 356 numeral 2 reconoce facturas, comprobantes de entrega, certificaciones, documentos electrónicos y otros elementos que permitan demostrar la existencia de créditos o deudas.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'No sirven para procedimiento monitorio.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Son válidos para demostrar la existencia de la relación crediticia.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo sirven en procedimiento ejecutivo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Deben transformarse en escritura pública.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'Un administrador de condominio pretende cobrar valores adeudados por un propietario. ¿Qué documento puede utilizar para respaldar la demanda?', 'El Art. 356 numeral 3 permite utilizar certificaciones emitidas por administradores o representantes legales para reclamar cuotas de condominio, asociaciones o instituciones educativas.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Declaración verbal.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Certificación emitida por el administrador o representante legal.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo escritura pública.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Exclusivamente sentencia judicial.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'Un arrendador reclama varios meses de arriendo impago mientras el inquilino sigue ocupando el inmueble. ¿Qué documento puede respaldar la acción monitoria?', 'El Art. 356 numeral 4 permite iniciar el procedimiento monitorio mediante contrato o declaración jurada del arrendador respecto de cánones vencidos.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Contrato de arriendo o declaración jurada del arrendador.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo testigos.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Únicamente escritura pública.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Exclusivamente sentencia previa.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'Un trabajador no ha recibido varias remuneraciones mensuales. ¿Qué debe acompañar a su petición?', 'El Art. 356 numeral 5 exige presentar el detalle de las remuneraciones reclamadas y la prueba de la relación laboral.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo una declaración verbal.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Detalle de remuneraciones reclamadas y prueba de la relación laboral.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Únicamente testigos.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ningún documento.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'El actor presenta una demanda monitoria sin indicar claramente el origen de la deuda. ¿Qué requisito falta?', 'El Art. 357 dispone que la demanda debe contener la especificación del origen y cantidad de la deuda, además de los requisitos generales.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Nacionalidad del juez.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Especificación del origen y cantidad de la deuda.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sentencia previa.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Peritaje obligatorio.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'La deuda reclamada equivale a dos salarios básicos unificados. ¿Es obligatorio contar con abogado?', 'El Art. 357 señala que cuando la cantidad demandada no excede de tres salarios básicos unificados, no se requiere patrocinio de abogado.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sí, siempre.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'No, cuando la cantidad no excede tres SBU.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo en segunda instancia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo si existe oposición.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'El estudiante analiza cuánto tiempo tiene el juez para examinar una demanda monitoria. ¿Cuál es el término máximo?', 'El Art. 146 COGEP establece que la o el juzgador examinará la demanda en un término máximo de cinco días.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '3 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '5 días.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '15 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '20 días.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'El juez calificó la demanda monitoria y admitió a trámite la petición. ¿Qué orden contendrá el auto interlocutorio?', 'El Art. 358 dispone que, admtiida la demanda, el juzgador ordenará que el deudor pague la deuda reclamada o formule oposición dentro del término previsto por la ley.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Que el demandado presente apelación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Que el demandado pague la deuda o formule oposición dentro del término legal.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Que el actor presente nueva demanda.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Que se convoque directamente a remate.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'El demandado debe ser informado oficialmente de la existencia del proceso monitorio. ¿Qué actuación procesal resulta indispensable?', 'La citación garantiza el derecho a la defensa y permite que el deudor pueda pagar, oponerse o ejercer los mecanismos procesales previstos en el procedimiento monitorio.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Publicación automática en prensa.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación conforme a las reglas del COGEP.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Audiencia preliminar obligatoria.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sentencia inmediata.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'El demandado fue citado válidamente, pero no comparece ni presenta oposición dentro del término correspondiente. ¿Qué consecuencia jurídica produce esta conducta?', 'Si el deudor no formula oposición dentro del término legal, el procedimiento monitorio permite continuar con la ejecución de la obligación reclamada.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se archiva el proceso.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se entiende aceptada la obligación y continúa la ejecución.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se convoca audiencia única.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se reinicia la citación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'El demandado considera que la deuda no existe y decide controvertir la pretensión. ¿Qué puede hacer dentro del término legal?', 'El procedimiento monitorio reconoce al demandado el derecho de formular oposición motivada, exponiendo las razones por las cuales considera improcedente la reclamación.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Formular oposición fundamentada.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Únicamente presentar apelación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solicitar remate.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Pedir casación directa.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'El demandado presenta oportunamente oposición a la reclamación. ¿Qué ocurre con el procedimiento?', 'La oposición impide que la reclamación continúe automáticamente y genera la necesidad de resolver la controversia mediante el trámite previsto por el COGEP.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se extingue automáticamente la deuda.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'La controversia debe sustanciarse conforme a las reglas procesales correspondientes.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se dicta sentencia a favor del actor.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se ordena remate inmediato.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'Un estudiante compara el procedimiento monitorio con el ejecutivo. ¿Cuál es una diferencia fundamental?', 'La principal característica del procedimiento monitorio es que permite reclamar determinadas deudas sin necesidad de un título ejecutivo, siempre que existan documentos que acrediten razonablemente la obligación.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'El monitorio requiere necesariamente un título ejecutivo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'El monitorio permite reclamar deudas que no constan en título ejecutivo.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ambos exigen exactamente los mismos requisitos documentales.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'El monitorio solo se aplica en materia penal.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'Carlos intenta cobrar una obligación cuyo plazo de pago aún no ha vencido. ¿Puede utilizar el procedimiento monitorio?', 'El procedimiento monitorio exige que la obligación sea líquida, determinada, exigible y de plazo vencido. Una deuda todavía no vencida no cumple estos requisitos.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sí, en cualquier caso.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'No, porque la deuda debe ser exigible y vencida.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sí, siempre que exista abogado.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sí, si el deudor está ausente.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'Una persona pretende cobrar una suma aproximada sin especificar el valor exacto adeudado. ¿Qué requisito estaría incumpliendo?', 'La deuda reclamada debe encontrarse claramente determinada o ser determinable, permitiendo establecer con precisión el monto exigido.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Competencia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Determinación de la deuda.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Patrocinio legal.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'Un estudiante analiza por qué el legislador incorporó el procedimiento monitorio al COGEP. ¿Cuál es su finalidad principal?', 'El procedimiento monitorio busca proporcionar una vía ágil y simplificada para el cobro de obligaciones dinerarias que reúnen los requisitos previstos por la ley.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Resolver conflictos penales.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Facilitar el cobro rápido de determinadas obligaciones dinerarias.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sustituir completamente al procedimiento ordinario.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Tramitar divorcios.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'Una deuda asciende a diez salarios básicos unificados y el acreedor desea presentar demanda monitoria. ¿Qué requisito profesional resulta aplicable?', 'La excepción al patrocinio profesional opera únicamente cuando la cuantía no supera tres salarios básicos unificados; superado ese monto, corresponde actuar con abogado.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'No requiere abogado bajo ninguna circunstancia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Requiere patrocinio de abogado por exceder el límite legal de excepción.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo requiere abogado en apelación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'El abogado es opcional.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'El juez verifica que la demanda cumple todos los requisitos legales y decide admitirla. ¿Qué resolución debe emitir?', 'El Art. 358 establece que, una vez admitida la demanda monitoria, la o el juzgador emitirá un auto interlocutorio ordenando al deudor pagar la obligación o formular oposición dentro del término de quince días.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sentencia definitiva.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Auto interlocutorio.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Auto de remate.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Recurso de apelación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'El demandado recibe la citación y reconoce que efectivamente mantiene la deuda reclamada. ¿Cuál es una de las opciones que le concede el procedimiento monitorio?', 'El procedimiento monitorio permite que el deudor, una vez citado, pague la obligación reclamada y concluya el conflicto sin necesidad de continuar la controversia judicial.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Pagar la obligación reclamada.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar recurso de casación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solicitar embargo de sus bienes.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reformar la demanda.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'Una estudiante analiza cuándo utilizar el procedimiento ejecutivo y cuándo el monitorio. ¿Cuál afirmación es correcta?', 'La principal diferencia es que el procedimiento ejecutivo exige título ejecutivo, mientras que el monitorio admite otros documentos que permitan acreditar razonablemente la existencia de la obligación.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ambos requieren necesariamente un título ejecutivo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'El monitorio puede utilizarse cuando no existe título ejecutivo, pero sí documentos que acrediten la deuda.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'El ejecutivo procede únicamente para arriendos.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'El monitorio reemplaza totalmente al ejecutivo.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'Un alumno debe identificar la secuencia lógica del procedimiento monitorio. ¿Cuál de las siguientes opciones refleja adecuadamente su desarrollo?', 'El procedimiento monitorio se caracteriza por su estructura simplificada: demanda, admisión, citación, pago u oposición del deudor y continuación del trámite según la conducta asumida por éste.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Demanda -> Citación -> Pago u oposición -> Resolución correspondiente.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Demanda -> Audiencia preliminar -> Audiencia de juicio -> Casación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Embargo -> Remate -> Adjudicación -> Sentencia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reconvención -> Conciliación -> Casación -> Archivo.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('monitorio', 'Pedro reclama USD 5.000 por concepto de arriendos vencidos. Presenta el contrato de arrendamiento y una declaración jurada. La deuda está vencida y el demandado es citado legalmente. ¿Cuál de los siguientes elementos justifica principalmente la procedencia del procedimiento monitorio?', 'El procedimiento monitorio procede cuando existe una obligación dineraria líquida, determinada, exigible y vencida, respaldada por alguno de los documentos previstos en el Art. 356 del COGEP, como ocurre con los cánones de arrendamiento adeudados.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'La existencia de una deuda líquida, exigible, vencida y respaldada documentalmente.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'La existencia de sentencia previa.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'La existencia de título ejecutivo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'La intervención obligatoria de un notario.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'Una sentencia ya se encuentra ejecutoriada, pero la parte condenada no cumple voluntariamente con lo ordenado. ¿Cuál es la finalidad del procedimiento de ejecución?', 'El Art. 362 COGEP define la ejecución como el conjunto de actos procesales destinados a hacer cumplir las obligaciones contenidas en un título de ejecución.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Revisar nuevamente la sentencia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Hacer cumplir las obligaciones contenidas en un título de ejecución.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar una nueva demanda.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Modificar el fallo emitido.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'Un acreedor obtuvo una sentencia favorable que ya no admite recursos ordinarios. ¿Qué naturaleza tiene esta resolución?', 'El Art. 363 numeral 1 establece que la sentencia ejecutoriada constituye un título de ejecución.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Título ejecutivo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Título de ejecución.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Providencia preventiva.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Documento privado.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'Dos partes resolvieron su conflicto mediante mediación y firmaron un acuerdo definitivo. ¿Qué valor tiene este documento para efectos de ejecución?', 'El Art. 363 reconoce expresamente al acta de mediación como uno de los títulos de ejecución.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ninguno.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Es únicamente un documento informativo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Constituye un título de ejecución.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Requiere convertirse en sentencia.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'El acreedor pretende ejecutar un título distinto de una sentencia ejecutoriada. ¿Qué debe contener la solicitud?', 'El Art. 370 COGEP exige identificar el título de ejecución que sirve de fundamento para presentar la solicitud.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Únicamente el nombre del acreedor.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'La identificación del título de ejecución que sirve de habilitante.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo una declaración verbal.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ningún requisito especial.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'El juez recibe la liquidación correspondiente y debe continuar el trámite. ¿Qué providencia debe emitir?', 'Conforme al Art. 372, recibida la liquidación, la o el juzgador expedirá el mandamiento de ejecución.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sentencia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Mandamiento de ejecución.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Auto de remate.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Casación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'El ejecutado recibe el mandamiento y decide cumplir inmediatamente con la obligación. ¿Qué consecuencia jurídica produce?', 'El Art. 372 dispone que, cumplida la obligación, se declarará extinguida y se ordenará el archivo del expediente.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Continúa el embargo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se declara extinguida la obligación y se archiva el expediente.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se convoca audiencia de ejecución.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Se ordena remate.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'El juez notifica el mandamiento de ejecución al deudor. ¿Cuánto tiempo tiene para cumplir voluntariamente?', 'El Art. 372 numeral 3 ordena al ejecutado pagar o cumplir la obligación en el término de cinco días, bajo prevención de ejecución forzosa.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '3 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '5 días.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '10 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '15 días.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'Se trata de la ejecución de un título distinto de una sentencia ejecutoriada. ¿Cómo puede notificarse el mandamiento?', 'El Art. 372 dispone que la notificación del mandamiento de ejecución se efectuará en persona o mediante tres boletas.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Únicamente por prensa.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Personalmente o mediante tres boletas.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solo por correo electrónico.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Exclusivamente por radio.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'El juez dicta una providencia dentro del procedimiento de ejecución. ¿En qué plazo debe notificarse?', 'El Art. 65 COGEP establece que las providencias judiciales deberán notificarse dentro de las veinticuatro horas siguientes a su pronunciamiento.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '24 horas.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '3 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '5 días.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, '15 días.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'El ejecutado no cumple la obligación dentro del término concedido. ¿Qué actuación corresponde al juzgador?', 'El Art. 375 COGEP dispone que, ante el incumplimiento del mandamiento de ejecución, el juzgador ordenará el embargo de bienes del ejecutado.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Archivar la causa.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ordenar el embargo de bienes.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Dictar nueva sentencia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Remitir el proceso a mediación.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'El ejecutado no cumplió voluntariamente con la obligación dentro del plazo concedido por el juez. ¿Cuál es la finalidad principal del embargo?', 'El embargo constituye una medida destinada a asegurar bienes suficientes para satisfacer la obligación pendiente, permitiendo posteriormente su realización o adjudicación.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Castigar al deudor.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Garantizar el cumplimiento de la obligación mediante la afectación de bienes.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Declarar insolvente al ejecutado.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Finalizar el proceso judicial.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'El juez debe decidir sobre qué bienes recaerá el embargo. ¿Qué criterio debe observarse?', 'El embargo debe guardar proporcionalidad con la obligación reclamada, procurando cubrir el monto adeudado, intereses y costas procesales sin afectar innecesariamente otros bienes.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Embargar todos los bienes existentes.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Embargar bienes suficientes para cubrir la obligación, intereses y costas.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Embargar únicamente bienes inmuebles.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Embargar exclusivamente dinero en efectivo.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'Luego del embargo de un inmueble, el juez requiere determinar su valor actualizado. ¿Qué actuación corresponde?', 'El avalúo pericial permite determinar técnicamente el valor del bien embargado, información indispensable para posteriores actos de ejecución.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sentencia complementaria.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Avalúo pericial.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Casación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reconvención.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'Un perito fue designado para exigir el avalúo dentro del procedimiento de ejecución. ¿Cuál es su función principal?', 'El perito aporta conocimientos especializados para determinar objetivamente el valor comercial del bien sujeto a ejecución.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Dictar sentencia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Establecer técnicamente el valor del bien.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Resolver recursos.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Aprobar el remate.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'Una de las partes considera que el avalúo realizado no refleja el valor real del inmueble. ¿Qué puede hacer?', 'Las partes conservan el derecho de cuestionar el informe pericial cuando consideren que existen errores técnicos o inconsistencias en la valoración efectuada.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Impugnar u objetar el informe conforme al procedimiento.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solicitar directamente casación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar una nueva demanda.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Declarar nulo el proceso.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'Dentro del procedimiento existen aspectos que requieren discusión y resolución judicial. ¿Qué mecanismo prevé el COGEP?', 'La audiencia de ejecución permite resolver cuestiones vinculadas al cumplimiento forzoso, oposición, fórmulas de pago y demás incidencias propias de esta etapa procesal.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Audiencia de ejecución.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Audiencia preliminar obligatoria.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Audiencia penal.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Consulta popular.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'El ejecutado considera que la obligación ya fue cumplida parcialmente antes del inicio de la ejecución. ¿Qué derecho procesal puede ejercer?', 'El procedimiento de ejecución admite oposición únicamente por las causas expresamente previstas en el COGEP, las cuales deben ser demostradas por quien las invoca.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Oponerse dentro de las causales previstas por la ley.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reformar la sentencia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Solicitar nueva demanda.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Presentar acción penal.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'El ejecutado reconoce la deuda, pero solicita cancelarla mediante pagos periódicos. ¿Qué mecanismo contempla el procedimiento?', 'El COGEP permite proponer fórmulas de pago, siempre que cumplan los requisitos legales y sean aceptadas o aprobadas según corresponda.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reconvención.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Fórmula de pago.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Casación automática.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Archivo de la causa.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'Una persona ajena al proceso sostiene que un bien embargado le pertenece y no al ejecutado. ¿Qué mecanismo procesal puede utilizar?', 'Las tercerías permiten a terceros proteger derechos que puedan verse afectados por actos de ejecución, como el embargo de bienes de su propiedad.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Acción extraordinaria de protección.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Tercería.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Casación.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reconvención.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'Luego del avalúo y demás actuaciones, el bien embargado será vendido para satisfacer la obligación. ¿Qué modalidad establece actualmente el COGEP?', 'El sistema de ejecución contempla el remate electrónico, mecanismo que busca mayor transparencia, publicidad y participación de postores.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Subasta exclusivamente presencial.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Remate electrónico a través de plataforma habilitada.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Venta directa sin control judicial.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sorteo público.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'Luego del remate, el mejor postor consignó oportunamente el valor ofrecido y no existe ninguna impugnación pendiente. ¿Qué actuación corresponde al juzgador?', 'Una vez cumplidos los requisitos legales y consignado el valor correspondiente, el juzgador emitirá el auto de adjudicación, documento que formaliza la transferencia del bien rematado al adjudicatario.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Dictar una nueva sentencia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Emitir el auto de adjudicación.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Reiniciar el remate.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Archivar el proceso.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'El remate de un inmueble produjo una cantidad suficiente para cubrir la obligación reclamada. ¿Cuál es el destino principal de esos fondos?', 'El objetivo esencial de la ejecución es satisfacer el derecho reconocido al acreedor, utilizando para ello los valores obtenidos mediante la realización de bienes embargados.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Entregarlos íntegramente al ejecutado.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Cubrir la obligación reconocida en favor del acreedor.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Transferirlos al Consejo de la Judicatura.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Mantenerlos indefinidamente en depósito judicial.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'Después de pagar capital, intereses y costas, aún existe un saldo sobrante proveniente del remate. ¿Qué corresponde hacer con ese excedente?', 'Cuando el producto del remate supera el valor necesario para satisfacer la obligación ejecutada, el excedente debe ser entregado al titular de los bienes ejecutados.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Entregarlo al ejecutado.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Entregarlo al juez.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Repartirlo entre los postores.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Declararlo abandonado.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'La obligación reconocida en el título ya fue completamente satisfecha. ¿Qué debe hacer el juzgador?', 'La ejecución concluye cuando la obligación ha sido cumplida totalmente. En ese momento, el juzgador declara extinguida la obligación y dispone el archivo de la causa.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Continuar indefinidamente con la ejecución.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Declarar cumplida la obligación y disponer el archivo.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Convocatoria a nueva audiencia.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Ordenar un nuevo embargo.', 0);

INSERT INTO questions (procedure_id, question_text, explanation) VALUES ('ejecucion', 'Una empresa obtuvo una sentencia ejecutoriada que ordena el pago de USD 20.000. El deudor no paga dentro de los cinco días concedidos en el mandamiento de ejecución. Posteriormente se embarga un inmueble, se realiza el avalúo pericial y finalmente se efectúa el remate electrónico. ¿Cuál secuencia representa correctamente el procedimiento de ejecución?', 'La lógica del procedimiento de ejecución busca hacer efectivo el cumplimiento de una obligación reconocida en un título de ejecución. Cuando no existe pago voluntario, pueden aplicarse medidas como embargo, avalúo, remate, adjudicación y pago al acreedor, hasta lograr la satisfacción total del derecho reconocido.');
SET @qid = LAST_INSERT_ID();
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Sentencia -> Casación -> Mediación -> Archivo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Mandamiento -> Embargo -> Avalúo -> Remate -> Pago al acreedor -> Archivo.', 1);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Demanda -> Reconvención -> Sentencia -> Archivo.', 0);
INSERT INTO question_options (question_id, option_text, is_correct) VALUES (@qid, 'Citación -> Audiencia preliminar -> Juicio -> Casación.', 0);

