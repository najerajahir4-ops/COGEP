/**
 * Base de Datos de Escenarios para el Simulador Interactivo COGEP
 * Define los casos prácticos, etapas procesales, preguntas y retroalimentación para cada procedimiento.
 */

const COGEP_SIMULATOR_SCENARIOS = {
  ordinario: [
    {
      id: "ord_incumplimiento",
      title: "Incumplimiento Contractual (Obra Civil)",
      description: "Asumes el rol de abogado defensor de una empresa damnificada. Una constructora incumplió los plazos de entrega de una obra civil valorada en $80,000. Reclamas la resolución contractual y la indemnización de daños y perjuicios.",
      stages: [
        {
          name: "Demanda",
          situation: "Tienes listos los documentos contractuales y los informes periciales del incumplimiento. Debes interponer la acción ordinaria.",
          question: "¿Cuál es el requisito indispensable respecto al anuncio de prueba que debes cumplir al presentar la demanda civil ordinaria?",
          options: [
            {
              text: "Acompañar y anunciar toda la prueba documental, testimonial y pericial en el mismo escrito de demanda.",
              correct: true,
              feedback: {
                explanation: "En el COGEP, toda la prueba (documentos, declaración de testigos, designación de peritos) debe anunciarse y adjuntarse en el escrito de demanda o contestación. No hay fase probatoria independiente posterior.",
                law: "Arts. 142.7 y 143 del COGEP",
                consequence: "El juez admitirá a trámite el anuncio de prueba y el proceso continuará con la calificación."
              }
            },
            {
              text: "Presentar el texto de la demanda y reservar el anuncio de las pruebas para una fase escrita posterior.",
              correct: false,
              feedback: {
                explanation: "Si no anuncias la prueba en la demanda, pierdes el derecho de presentarla posteriormente (preclusión), salvo que sea prueba nueva o de difícil acceso justificada.",
                law: "Art. 142.7 COGEP",
                consequence: "Se inadmitirá o quedarás en indefensión al carecer de pruebas admitidas."
              }
            },
            {
              text: "Presentar solo la demanda y solicitar verbalmente al juez que recabe la prueba de oficio en la constructora.",
              correct: false,
              feedback: {
                explanation: "La prueba de oficio por parte del juzgador es de carácter excepcionalísimo y no suple la obligación de las partes de aportar y anunciar sus pruebas.",
                law: "Art. 168 COGEP",
                consequence: "La solicitud será rechazada y tu demanda carecerá de sustento probatorio."
              }
            }
          ]
        },
        {
          name: "Calificación",
          situation: "El juez recibe la demanda ordinaria pero nota que no has precisado de forma exacta el domicilio del demandado para la citación.",
          question: "¿Cómo debe proceder legalmente el juez ante la falta de este requisito no sustancial?",
          options: [
            {
              text: "Conceder al actor el término de 3 días para completar o aclarar la demanda bajo prevención de archivo.",
              correct: true,
              feedback: {
                explanation: "Si la demanda no cumple con los requisitos del Art. 142, el juez debe otorgar 3 días para subsanar. Si no se aclara en ese lapso, se ordenará el archivo.",
                law: "Art. 146.2 del COGEP",
                consequence: "Se ne notifica la providencia para que completes el dato del domicilio en el término señalado."
              }
            },
            {
              text: "Archivar directamente la causa de forma definitiva por ser inadmisible.",
              correct: false,
              feedback: {
                explanation: "El archivo directo solo procede si la demanda es manifiestamente inadmisible por incompetencia absoluta o ineptitud de la demanda insubsanable, pero en defectos aclarables se debe dar oportunidad de subsanar.",
                law: "Art. 146.2 COGEP",
                consequence: "Se vulneraría el derecho constitucional a la tutela judicial efectiva."
              }
            },
            {
              text: "Subsanar de oficio el dato del domicilio buscando en el registro civil.",
              correct: false,
              feedback: {
                explanation: "El juzgador debe actuar con imparcialidad y no le corresponde realizar labores de investigación o subsanación de los requisitos de la demanda que competen al actor.",
                law: "Art. 146 COGEP",
                consequence: "El juez incurriría en irregularidad procesal al suplir la carga del demandante."
              }
            }
          ]
        },
        {
          name: "Citación",
          situation: "La demanda ha sido calificada positivamente. El citador judicial acude a las oficinas de la constructora demandada, pero el representante legal no se encuentra personalmente.",
          question: "¿Qué acción determina el Art. 55 del COGEP para citar válidamente en este escenario?",
          options: [
            {
              text: "Citar mediante tres boletas entregadas en días distintos a un familiar o dependiente de la oficina, o fijadas en la puerta.",
              correct: true,
              feedback: {
                explanation: "Si no se encuentra personalmente al demandado, se le citará por boletas entregadas en su domicilio o lugar de trabajo a cualquier persona de la familia o dependiente, o fijadas si no hay quien las reciba.",
                law: "Art. 55.2 del COGEP",
                consequence: "La citación se perfecciona y empieza a correr el término para contestar."
              }
            },
            {
              text: "Proceder de inmediato a realizar la citación por la prensa en un diario de amplia circulación.",
              correct: false,
              feedback: {
                explanation: "La citación por la prensa es excepcional y requiere el juramento del actor de que es imposible determinar el domicilio o paradero del demandado. Si se conoce el domicilio, la citación por prensa es nula.",
                law: "Art. 56 COGEP",
                consequence: "Se provocaría la nulidad insanable de todo lo actuado por falta de citación legal."
              }
            },
            {
              text: "Dejar una sola notificación verbal con el portero del edificio y dar por citado al demandado.",
              correct: false,
              feedback: {
                explanation: "Una sola boleta o recado verbal no surte efectos de citación en el COGEP. Se exige citación personal o el régimen formal de tres boletas en días distintos.",
                law: "Art. 55 COGEP",
                consequence: "La citación sería nula y se suspendería el trámite por indefensión."
              }
            }
          ]
        },
        {
          name: "Contestación",
          situation: "La constructora ha sido citada válidamente mediante tres boletas en sus oficinas.",
          question: "¿De qué término legal dispone la constructora para presentar su contestación a la demanda y deducir sus excepciones en la vía ordinaria?",
          options: [
            {
              text: "De un término de 30 días contados a partir de la citación.",
              correct: true,
              feedback: {
                explanation: "En el procedimiento ordinario, el término para contestar la demanda es de 30 días. En este mismo acto escrito, el demandado debe proponer sus excepciones y anunciar sus pruebas.",
                law: "Art. 291 del COGEP",
                consequence: "El caso queda listo para la convocatoria a la Audiencia Preliminar."
              }
            },
            {
              text: "De un término improrrogable de 15 días hábiles.",
              correct: false,
              feedback: {
                explanation: "El término de 15 días aplica para el procedimiento sumario y monitorio, pero no para el ordinario, el cual otorga 30 días debido a su complejidad.",
                law: "Art. 291 COGEP",
                consequence: "Si contesta en 15 días está dentro del plazo, pero afirmar que el límite es 15 días es incorrecto y restaría tiempo de defensa al cliente."
              }
            },
            {
              text: "Debe contestar verbalmente el mismo día en que se instale la audiencia preliminar.",
              correct: false,
              feedback: {
                explanation: "En el COGEP la contestación es estrictamente escrita y previa a las audiencias. No existe la contestación verbal sorpresiva en audiencia ordinaria.",
                law: "Art. 151 y 291 COGEP",
                consequence: "Se declararía la rebeldía del demandado y precluiría su derecho a presentar pruebas."
              }
            }
          ]
        }
      ]
    },
    {
      id: "ord_daños",
      title: "Daños y Perjuicios por Accidente",
      description: "Reclamas una indemnización de $45,000 por daños materiales y lucro cesante derivados de un accidente de tránsito provocado por un transporte comercial. El trámite se sustancia en la vía ordinaria civil.",
      stages: [
        {
          name: "Demanda",
          situation: "Deseas determinar la cuantía procesal para establecer la competencia del juez civil.",
          question: "¿Cómo se debe fijar la cuantía en una demanda ordinaria de daños y perjuicios?",
          options: [
            {
              text: "Especificando la cantidad líquida reclamada, desglosando los daños emergentes, lucro cesante e intereses devengados.",
              correct: true,
              feedback: {
                explanation: "La cuantía debe ser determinada y líquida en la demanda cuando se reclaman sumas de dinero adeudadas o indemnizaciones civiles, detallando los rubros reclamados.",
                law: "Art. 144 del COGEP",
                consequence: "La demanda cumple con la fijación de la cuantía y el juez puede calificarla."
              }
            },
            {
              text: "Estableciendo una cuantía indeterminada, solicitando que el juez la fije al final de la audiencia de juicio.",
              correct: false,
              feedback: {
                explanation: "No se puede dejar la cuantía indeterminada si se reclama una indemnización de dinero cuantificable. La cuantía indeterminada solo aplica a casos donde no hay valor económico directo (ej. límites, filiación).",
                law: "Art. 144 COGEP",
                consequence: "La demanda será observada por el juez para que sea aclarada y cuantificada."
              }
            }
          ]
        },
        {
          name: "Audiencia Preliminar",
          situation: "En la primera fase de la Audiencia Preliminar, se discute la validez del proceso y las excepciones previas deducidas por la demandada.",
          question: "Si el demandado interpuso la excepción de falta de personería jurídica del actor, ¿en qué momento debe resolverla el juzgador?",
          options: [
            {
              text: "En la misma audiencia preliminar, resolviendo primero las excepciones previas antes de pasar a la fase de conciliación y saneamiento.",
              correct: true,
              feedback: {
                explanation: "Las excepciones previas se resuelven en la Audiencia Preliminar, en la primera fase de saneamiento del proceso. Si se acepta una subsanable, se da término para corregirla.",
                law: "Art. 294.1 del COGEP",
                consequence: "Si el juez la desecha o se subsana, el proceso queda saneado y continúa."
              }
            },
            {
              text: "Se reserva la resolución para la sentencia definitiva que dictará tras la audiencia de juicio.",
              correct: false,
              feedback: {
                explanation: "Las excepciones previas buscan sanear el proceso. No se puede avanzar a juicio y practicar pruebas si existen vicios de personería o procedimiento no resueltos.",
                law: "Art. 294.1 COGEP",
                consequence: "Incurriría en nulidad por falta de saneamiento oportuno."
              }
            }
          ]
        },
        {
          name: "Audiencia de Juicio",
          situation: "Se instala la audiencia de juicio. Debes presentar tus alegatos iniciales y proceder a evacuar la prueba testimonial anunciada.",
          question: "¿Cuál es el orden estricto de participación y práctica de pruebas en la audiencia de juicio ordinaria?",
          options: [
            {
              text: "Primero interviene la parte actora con su alegato inicial y practica sus pruebas; luego interviene la parte demandada de igual manera.",
              correct: true,
              feedback: {
                explanation: "El debate probatorio comienza con el alegato inicial del actor, la evacuación de todas sus pruebas admitidas, seguido por el alegato inicial del demandado y la evacuación de sus respectivas pruebas.",
                law: "Art. 297 del COGEP",
                consequence: "Se respeta el principio de contradicción y orden procesal."
              }
            },
            {
              text: "Las pruebas se practican de forma simultánea, y el juez interroga a todos los testigos al mismo tiempo en un careo.",
              correct: false,
              feedback: {
                explanation: "Los testigos declaran de forma individual y sucesiva. No existe la práctica de prueba caótica o careo obligatorio general como inicio probatorio.",
                law: "Art. 178 y 297 COGEP",
                consequence: "Se vulnerarían las reglas del debido interrogatorio de testigos."
              }
            }
          ]
        }
      ]
    }
  ],
  ejecutivo: [
    {
      id: "ejec_pagare",
      title: "Cobro de Pagaré a la Orden",
      description: "Asumes el rol de abogado de un acreedor financiero. Un deudor suscribió un pagaré por $12,000 con vencimiento fijo. Han pasado 60 días desde el vencimiento y no se ha cancelado el saldo. Promueves la vía ejecutiva.",
      stages: [
        {
          name: "Demanda",
          situation: "Presentas el pagaré original como base de tu pretensión.",
          question: "¿Cuáles son las características indispensables que debe reunir la obligación contenida en el pagaré para que proceda la vía ejecutiva?",
          options: [
            {
              text: "Debe ser una obligación de dar o hacer que sea clara, pura, determinada y actualmente exigible.",
              correct: true,
              feedback: {
                explanation: "Para que un documento preconstituido sea título ejecutivo, la obligación líquida o de hacer debe ser clara (sin dudas de los sujetos), pura (sin condición pendiente), determinada (monto exacto) y exigible (plazo vencido).",
                law: "Arts. 347 y 348 del COGEP",
                consequence: "El juez admitirá el trámite ejecutivo."
              }
            },
            {
              text: "Debe estar registrada formalmente en una notaría y contar con el reconocimiento de firmas previo del deudor.",
              correct: false,
              feedback: {
                explanation: "El pagaré a la orden es un título valor con fuerza ejecutiva por ley. No requiere reconocimiento judicial de firmas ni protocolización notarial previa para ser ejecutivo.",
                law: "Art. 347.5 COGEP",
                consequence: "Exigir dicho paso demoraría innecesariamente la interposición de la demanda."
              }
            }
          ]
        },
        {
          name: "Medidas Cautelares",
          situation: "Quieres asegurar el cobro de la deuda ya que conoces que el deudor pretende vender sus bienes.",
          question: "¿En qué momento y bajo qué condiciones puedes solicitar medidas cautelares en el juicio ejecutivo?",
          options: [
            {
              text: "Puedes solicitarlas en la demanda, y el juez las ordenará con la calificación de la misma, limitadas al valor de la cuantía.",
              correct: true,
              feedback: {
                explanation: "En el procedimiento ejecutivo, el actor puede solicitar el secuestro o retención de bienes desde la demanda. El juez los ordenará en el auto de calificación sin requerir caución previa.",
                law: "Art. 351 del COGEP",
                consequence: "El citador o alguacil procederá al secuestro de los bienes o retención de cuentas de forma conjunta con la citación."
              }
            },
            {
              text: "Solo puedes solicitarlas una vez dictada sentencia ejecutoriada y en fase de ejecución forzosa.",
              correct: false,
              feedback: {
                explanation: "El procedimiento ejecutivo permite tutelar de forma preventiva el crédito antes de la sentencia debido a la presunción de certeza que otorga el título ejecutivo preconstituido.",
                law: "Art. 351 COGEP",
                consequence: "El deudor podría insolventarse durante el juicio, imposibilitando el cobro posterior."
              }
            }
          ]
        },
        {
          name: "Oposición",
          situation: "El deudor ha sido citado y sus cuentas han sido retenidas. Él desea oponerse al cobro alegando que ya realizó abonos parciales documentados.",
          question: "¿De qué término dispone el deudor para contestar y deducir sus excepciones en la vía ejecutiva?",
          options: [
            {
              text: "De un término de 15 días hábiles a partir de la citación.",
              correct: true,
              feedback: {
                explanation: "El ejecutado tiene un término de 15 días para oponerse y contestar la demanda, debiendo adjuntar las pruebas de las excepciones deducidas del Art. 353.",
                law: "Art. 353 del COGEP",
                consequence: "Si formula excepciones válidas, el juez convocará a la audiencia única."
              }
            },
            {
              text: "De un término de 30 días hábiles a partir de la citación.",
              correct: false,
              feedback: {
                explanation: "El término de 30 días es de la vía ordinaria. La vía ejecutiva es un proceso abreviado y de cognición limitada, por lo que el término es de 15 días.",
                law: "Art. 353 COGEP",
                consequence: "Si contesta al día 20, su oposición será rechazada por extemporánea."
              }
            }
          ]
        }
      ]
    },
    {
      id: "ejec_letra",
      title: "Cobro de Letra de Cambio",
      description: "Se te ha endosado una letra de cambio por valor de $8,000 emitida por un comerciante, la cual se encuentra vencida. Inicias el cobro ejecutivo.",
      stages: [
        {
          name: "Demanda",
          situation: "Al redactar la demanda ejecutiva, debes proponer la pretensión de cobro.",
          question: "Si el demandado propone en su contestación la excepción de 'extinción de la obligación' (pago), ¿qué tipo de prueba debe acompañar obligatoriamente?",
          options: [
            {
              text: "Prueba documental que justifique el pago o la consignación total o parcial (recibos, transferencias).",
              correct: true,
              feedback: {
                explanation: "Las excepciones en el juicio ejecutivo (como el pago o extinción) deben estar respaldadas por prueba documental aparejada al escrito de oposición.",
                law: "Art. 353.4 del COGEP",
                consequence: "El juez admitirá a trámite la excepción para su discusión en audiencia."
              }
            },
            {
              text: "Prueba puramente testimonial de amigos que presenciaron un supuesto acuerdo de condonación verbal.",
              correct: false,
              feedback: {
                explanation: "En materia ejecutiva no es admisible la prueba puramente testimonial para desvirtuar una obligación escrita literal sin base documental del pago.",
                law: "Art. 353 COGEP",
                consequence: "La excepción será desechada por falta de sustento legal idóneo."
              }
            }
          ]
        },
        {
          name: "Audiencia Única",
          situation: "El demandado propuso la excepción de falsedad de la firma de la letra de cambio y anunció una pericia caligráfica. El juez convoca a la audiencia única.",
          question: "¿Cómo se desarrolla la audiencia única en el procedimiento ejecutivo?",
          options: [
            {
              text: "Se desarrolla en una sola audiencia dividida en dos fases: saneamiento y excepciones; y la fase de pruebas y alegatos.",
              correct: true,
              feedback: {
                explanation: "La audiencia única del sumario y ejecutivo concentra todas las etapas en un solo acto formal. La primera fase resuelve la validez y excepciones; la segunda evacua pruebas y emite resolución verbal.",
                law: "Art. 354 del COGEP",
                consequence: "El perito sustentará su informe y el juez dictará la sentencia correspondiente."
              }
            },
            {
              text: "Es una diligencia informativa donde el juez revisa los papeles en su despacho de forma privada y notifica luego por escrito.",
              correct: false,
              feedback: {
                explanation: "El sistema procesal del COGEP es oral y por audiencias públicas. Está prohibido resolver excepciones litigiosas en despacho privado sin inmediación ni contradicción.",
                law: "Art. 4 y 354 COGEP",
                consequence: "Se causaría la nulidad por falta de audiencia y oralidad."
              }
            }
          ]
        }
      ]
    }
  ],
  sumario: [
    {
      id: "sum_arrendamiento",
      title: "Terminación de Contrato de Arrendamiento",
      description: "El arrendatario de un local comercial adeuda más de 4 cánones de arrendamiento mensuales. Demandas la terminación del contrato, el desahucio y el pago de los valores atrasados por la vía sumaria.",
      stages: [
        {
          name: "Demanda",
          situation: "Debes interponer la acción de inquilinato.",
          question: "¿Qué requisito específico relativo al contrato de arrendamiento exige la ley en las demandas de inquilinato?",
          options: [
            {
              text: "Adjuntar el contrato de arrendamiento debidamente inscrito ante la autoridad competente (notaría o registro) o solicitar el registro de la relación de inquilinato.",
              correct: true,
              feedback: {
                explanation: "Para demandas de inquilinato, el actor debe adjuntar el contrato escrito o, en su defecto, probar la relación mediante declaración juramentada o registros de pago.",
                law: "Art. 142 y Art. 332.4 del COGEP",
                consequence: "La demanda cumple con los presupuestos y se califica a trámite."
              }
            },
            {
              text: "Acompañar copia simple de la escritura del inmueble arrendado únicamente.",
              correct: false,
              feedback: {
                explanation: "La escritura de propiedad no prueba la relación de arrendamiento ni las cláusulas acordadas con el inquilino demandado.",
                law: "Art. 332.4 COGEP",
                consequence: "El juez requerirá que completes la demanda adjuntando el contrato o probando la relación."
              }
            }
          ]
        },
        {
          name: "Contestación",
          situation: "Se ha citado al demandado en el local arrendado.",
          question: "¿De qué término dispone el demandado para contestar la demanda en asuntos de inquilinato y laboral sustanciados en la vía sumaria?",
          options: [
            {
              text: "Dispone de un término excepcional de 30 días a partir de la citación.",
              correct: true,
              feedback: {
                explanation: "Aunque la regla general en el procedimiento sumario es de 15 días para contestar, en materias de inquilinato y laboral el término de contestación es excepcionalmente de 30 días.",
                law: "Art. 333.3 del COGEP",
                consequence: "El demandado presentará su contestación dentro de este término legal."
              }
            },
            {
              text: "Dispone del término general de 15 días aplicable a las demás materias sumarias.",
              correct: false,
              feedback: {
                explanation: "El COGEP establece de forma expresa que las materias de inquilinato y laboral tienen la excepción de 30 días para contestar la demanda, precautelando los derechos de defensa complejos.",
                law: "Art. 333.3 COGEP",
                consequence: "Exigir la contestación en 15 días vulnera los plazos especiales de la norma."
              }
            }
          ]
        },
        {
          name: "Audiencia Única",
          situation: "Se convoca a las partes a la audiencia única.",
          question: "Si una de las partes no asiste a la audiencia única en el procedimiento sumario, ¿cuáles son los efectos procesales según la ley?",
          options: [
            {
              text: "Si falta el actor se declara el abandono de la causa; si falta el demandado la audiencia se realiza con la parte presente (rebeldía).",
              correct: true,
              feedback: {
                explanation: "La inasistencia injustificada del actor provoca el abandono (siempre que el demandado no solicite continuar). Si falta el demandado, se continúa sustanciando la causa en su ausencia.",
                law: "Art. 87 del COGEP",
                consequence: "Se instala la audiencia y el juez resolverá según las pruebas del actor."
              }
            },
            {
              text: "El juez suspende la diligencia obligatoriamente por tres veces consecutivas antes de tomar decisiones.",
              correct: false,
              feedback: {
                explanation: "El COGEP prohíbe el diferimiento injustificado de audiencias. Solo se suspende por caso fortuito o fuerza mayor debidamente justificada.",
                law: "Art. 82 y 87 COGEP",
                consequence: "El juez incurriría en dilación innecesaria y sancionable."
              }
            }
          ]
        }
      ]
    },
    {
      id: "sum_posesion",
      title: "Recuperación de Posesión (Amparo)",
      description: "Un colindante de tu predio rural ha movido las cercas perimetrales e ingresó a tu lote para realizar siembras. Interpones una acción sumaria de amparo de posesión.",
      stages: [
        {
          name: "Demanda",
          situation: "Preparas los linderos técnicos e informes periciales.",
          question: "¿Es admisible la reconvención (contrademanda) en la vía sumaria de amparo de posesión?",
          options: [
            {
              text: "Sí, siempre que la reconvención sea conexa y su materia se tramite también en la vía sumaria.",
              correct: true,
              feedback: {
                explanation: "La reconvención conexa está permitida en el procedimiento sumario, pero debe limitarse a pretensiones que gocen del mismo trámite sumario.",
                law: "Art. 333.3 del COGEP",
                consequence: "El juzgador calificará la reconvención conjuntamente para resolver ambas en la misma audiencia."
              }
            },
            {
              text: "No, la vía sumaria prohíbe de forma absoluta cualquier tipo de reconvención civil.",
              correct: false,
              feedback: {
                explanation: "La reconvención sí está permitida en el procedimiento sumario con la limitante de la conexidad y homogeneidad de trámite. Solo en monitorio y ejecución está prohibida.",
                law: "Art. 333.3 COGEP",
                consequence: "Rechazar a priori la reconvención vulneraría el principio de economía procesal."
              }
            }
          ]
        },
        {
          name: "Audiencia Única",
          situation: "En la fase de pruebas de la Audiencia Única, debes presentar el testimonio del topógrafo que realizó el informe.",
          question: "¿Cómo se evacua e introduce el testimonio de un perito en la audiencia del COGEP?",
          options: [
            {
              text: "El perito debe comparecer personalmente a la audiencia para exponer su informe y someterse a las preguntas e interrogatorio de las partes.",
              correct: true,
              feedback: {
                explanation: "El perito tiene la obligación de asistir a la audiencia para sustentar oralmente su pericia técnica y absolver preguntas de la contraparte bajo sanción de ineficacia del informe.",
                law: "Art. 222 del COGEP",
                consequence: "Se incorpora válidamente la pericia al acervo probatorio."
              }
            },
            {
              text: "Basta con ingresar el informe escrito firmado por secretaría sin necesidad de la presencia física del perito.",
              correct: false,
              feedback: {
                explanation: "El informe escrito no tiene valor probatorio por sí solo en el COGEP si el perito no comparece a la audiencia oral a defenderlo y ser contrainterrogado.",
                law: "Art. 222 COGEP",
                consequence: "La prueba pericial carecería de valor y sería excluida por el juez."
              }
            }
          ]
        }
      ]
    }
  ],
  monitorio: [
    {
      id: "mon_deuda",
      title: "Cobro de Deuda Documentada (Servicios)",
      description: "Un cliente independiente adeuda $4,500 por concepto de honorarios profesionales. Tienes correos electrónicos de aceptación, una orden de servicio firmada y planillas de avance, pero no tienes un título ejecutivo. Demandas por vía monitoria.",
      stages: [
        {
          name: "Procedibilidad",
          situation: "Debes verificar si tu caso cumple con los presupuestos del procedimiento monitorio.",
          question: "¿Cuáles son las condiciones de cuantía y prueba para iniciar una demanda monitoria?",
          options: [
            {
              text: "Que la deuda no exceda de 50 salarios básicos unificados y que se pruebe mediante documento firmado, facturas o medios electrónicos que acrediten la relación.",
              correct: true,
              feedback: {
                explanation: "El monitorio está diseñado para cobrar deudas dinerarias líquidas, vencidas y exigibles de baja cuantía (hasta 50 SBU) respaldadas por documentos que, sin ser títulos ejecutivos, prueben la relación.",
                law: "Art. 356 del COGEP",
                consequence: "El juez calificará la demanda y dispondrá el auto de pago."
              }
            },
            {
              text: "Que la deuda no tenga límite de cuantía y que la prueba sea estrictamente un acta notarial de reconocimiento.",
              correct: false,
              feedback: {
                explanation: "El monitorio tiene un límite estricto de cuantía (50 SBU) y precisamente busca evitar requerir títulos formales o actas notariales, aceptando facturas, correos y registros contables del acreedor.",
                law: "Art. 356 COGEP",
                consequence: "Si la cuantía supera las 50 SBU, se inadmite a trámite monitorio debiendo ir a juicio ordinario."
              }
            }
          ]
        },
        {
          name: "Auto de Pago",
          situation: "El juez califica la demanda monitoria.",
          question: "¿Qué orden emite el juez en su primera providencia si la demanda monitoria cumple todos los requisitos?",
          options: [
            {
              text: "Ordenar al deudor que pague la deuda o formule oposición motivada en el término de 15 días, bajo apercibimiento de ejecución.",
              correct: true,
              feedback: {
                explanation: "El auto de pago monitorio concede 15 días al deudor. Si este no paga ni comparece (incomparecencia), el auto de pago queda firme con fuerza de sentencia ejecutoriada.",
                law: "Art. 358 del COGEP",
                consequence: "Se cita al deudor para que actúe en el plazo establecido."
              }
            },
            {
              text: "Convocar de inmediato a una audiencia preliminar para intentar la conciliación judicial.",
              correct: false,
              feedback: {
                explanation: "El monitorio no abre audiencias inmediatas. Primero se emite el requerimiento de pago (auto de pago). Las audiencias solo ocurren si el demandado comparece y se opone.",
                law: "Art. 358 COGEP",
                consequence: "Se dilataría innecesariamente el cobro rápido."
              }
            }
          ]
        },
        {
          name: "Incomparecencia",
          situation: "El deudor es citado válidamente con el auto de pago monitorio, pero transcurren los 15 días sin que realice el pago ni presente escrito de oposición.",
          question: "¿Cuál es el efecto procesal de la incomparecencia del deudor en el trámite monitorio?",
          options: [
            {
              text: "El auto de pago queda ejecutoriado con efecto de sentencia y se inicia directamente la ejecución de bienes del deudor.",
              correct: true,
              feedback: {
                explanation: "La incomparecencia del demandado precluye su derecho a defenderse en el proceso. El auto de pago pasa a tener fuerza de cosa juzgada formal y material, ordenándose el embargo directo.",
                law: "Art. 358 del COGEP",
                consequence: "La simulación finaliza con el cobro forzoso del dinero."
              }
            },
            {
              text: "El proceso se archiva de oficio y el acreedor debe demandar nuevamente por la vía ejecutiva ordinaria.",
              correct: false,
              feedback: {
                explanation: "El archivo por falta de incomparecencia del demandado iría contra el propósito del monitorio, que premia el silencio del deudor dándole el título de ejecución de forma directa al acreedor.",
                law: "Art. 358 COGEP",
                consequence: "Sería un contrasentido procesal que perjudica al acreedor."
              }
            }
          ]
        }
      ]
    },
    {
      id: "mon_facturas",
      title: "Cobro de Facturas Comerciales",
      description: "Eres el administrador de una importadora y un cliente mayorista te adeuda $15,000 en facturas físicas firmadas de recepción de mercadería. Utilizas la vía monitoria.",
      stages: [
        {
          name: "Oposición",
          situation: "El demandado comparece dentro de los 15 días y formula escrito de oposición motivado, alegando que la mercadería llegó defectuosa.",
          question: "¿Cómo se sustancia el procedimiento monitorio ante la oposición formal del deudor?",
          options: [
            {
              text: "El juez convocará a Audiencia Única, la cual se sustanciará bajo las reglas del procedimiento sumario.",
              correct: true,
              feedback: {
                explanation: "Si el deudor se opone en término, el monitorio se convierte en un juicio de conocimiento abreviado. Se sustanciará en una audiencia única bajo el trámite sumario.",
                law: "Art. 359 del COGEP",
                consequence: "Se fija fecha para la audiencia única donde se debatirán las pruebas."
              }
            },
            {
              text: "El proceso se extingue de forma automática y se obliga a las partes a ir a mediación.",
              correct: false,
              feedback: {
                explanation: "La oposición no extingue el proceso judicial; solo cambia su curso hacia el debate probatorio en audiencia única para resolver la veracidad de la oposición.",
                law: "Art. 359 COGEP",
                consequence: "Denegar la vía judicial violaría los derechos del acreedor."
              }
            }
          ]
        },
        {
          name: "Sentencia",
          situation: "Se realiza la audiencia sumaria de oposición y el juez emite sentencia condenando al deudor a pagar el 100% de las facturas.",
          question: "Si el ejecutado no apela la sentencia en el término legal, ¿qué fase corresponde iniciar?",
          options: [
            {
              text: "Fase de ejecución forzosa para el embargo y remate de bienes.",
              correct: true,
              feedback: {
                explanation: "Una vez ejecutoriada la sentencia (firme y sin recursos pendientes), el actor puede solicitar el inicio de la ejecución forzosa según las reglas del COGEP.",
                law: "Art. 360 y 370 del COGEP",
                consequence: "Se solicita el mandamiento de ejecución para embargar activos."
              }
            },
            {
              text: "Reiniciar el trámite monitorio desde la presentación de la demanda.",
              correct: false,
              feedback: {
                explanation: "La sentencia ejecutoriada tiene fuerza de cosa juzgada. No se puede reiniciar un juicio ya juzgado e irreversible (non bis in idem).",
                law: "Art. 360 COGEP",
                consequence: "Sería un error procesal gravísimo que ignora la firmeza de la sentencia."
              }
            }
          ]
        }
      ]
    }
  ],
  ejecucion: [
    {
      id: "ejec_sentencia",
      title: "Ejecución de Sentencia Judicial",
      description: "Obtuviste sentencia condenatoria firme en un juicio de cobro ordinario por $35,000. El demandado ha incumplido el pago voluntario dentro del plazo de ley. Inicias la fase de ejecución forzosa ante el mismo juez.",
      stages: [
        {
          name: "Solicitud",
          situation: "Debes requerir el cumplimiento forzoso de la sentencia al juzgador de primera instancia.",
          question: "¿Cuál es la vía procesal correcta para iniciar la ejecución forzosa de la sentencia?",
          options: [
            {
              text: "Presentar una solicitud de ejecución simple ante el mismo juez de la causa, detallando la liquidación de capital, intereses y costas.",
              correct: true,
              feedback: {
                explanation: "Las sentencias judiciales ejecutoriadas se ejecutan ante el mismo juez que conoció el caso en primera instancia, mediante una solicitud que cuantifique la obligación líquida pendiente.",
                law: "Art. 370 del COGEP",
                consequence: "El juez revisará la liquidación y emitirá el mandamiento de ejecución."
              }
            },
            {
              text: "Presentar una demanda ejecutiva formal e independiente a través de la oficina de sorteos.",
              correct: false,
              feedback: {
                explanation: "No se requiere un nuevo juicio independiente ni sorteo de causas para ejecutar una sentencia judicial propia. El mismo expediente y juzgador de origen retienen la competencia de ejecución.",
                law: "Art. 370 COGEP",
                consequence: "Se rechazaría la demanda por falta de competencia y duplicidad procesal."
              }
            }
          ]
        },
        {
          name: "Mandamiento",
          situation: "El juez aprueba la liquidación y emite el Mandamiento de Ejecución.",
          question: "¿De qué término dispone el ejecutado en el mandamiento de ejecución para pagar o proponer excepciones válidas?",
          options: [
            {
              text: "De un término de 5 días hábiles a partir de la notificación del mandamiento.",
              correct: true,
              feedback: {
                explanation: "El mandamiento de ejecución ordena pagar o presentar excepciones documentadas y taxativas en el término estricto de 5 días, bajo prevención de embargo.",
                law: "Art. 372 del COGEP",
                consequence: "El deudor debe consignar o deducir excepciones válidas (ej. pago posterior, novación escrita)."
              }
            },
            {
              text: "De un término de 15 días hábiles a partir de la notificación.",
              correct: false,
              feedback: {
                explanation: "El término de 15 días aplica a la oposición de juicios ejecutivos o de cognición abreviada, pero en la fase de ejecución de sentencia ya juzgada el plazo se reduce a 5 días para agilizar el cobro.",
                law: "Art. 372 COGEP",
                consequence: "Si presenta excepciones al sexto día, precluye su derecho y se ejecuta directamente."
              }
            }
          ]
        },
        {
          name: "Embargo",
          situation: "El deudor ejecutado no pagó voluntariamente ni propuso excepciones dentro del término de 5 días.",
          question: "¿Cómo procede el embargo de activos financieros en el COGEP?",
          options: [
            {
              text: "El juez ordena directamente la retención y transferencia de los fondos disponibles en las cuentas del deudor hasta por el valor de la obligación.",
              correct: true,
              feedback: {
                explanation: "El embargo de dinero en cuentas del sistema financiero se realiza mediante orden de retención y transferencia inmediata a la cuenta del juzgado, sin requerir avalúos ni remates.",
                law: "Art. 376 y 378 del COGEP",
                consequence: "Los fondos se transfieren para el pago inmediato al acreedor."
              }
            },
            {
              text: "Se debe nombrar a un perito liquidador para que subaste públicamente las cuentas bancarias del deudor.",
              correct: false,
              feedback: {
                explanation: "El dinero en efectivo o en cuentas es de liquidez inmediata. Las subastas o remates periciales solo aplican a bienes muebles o inmuebles que requieran conversión a dinero líquido.",
                law: "Art. 376 COGEP",
                consequence: "Demoraría de forma absurda la entrega del dinero disponible."
              }
            }
          ]
        },
        {
          name: "Remate",
          situation: "No se halló dinero en cuentas, pero se procedió al embargo y avalúo pericial de un terreno del deudor valorado en $40,000.",
          question: "¿Cómo se sustancian los remates judiciales de bienes en el COGEP?",
          options: [
            {
              text: "A través de la plataforma de remates en línea del Consejo de la Judicatura, en las horas y días señalados en la convocatoria pública.",
              correct: true,
              feedback: {
                explanation: "Todos los remates de bienes embargados en juicios civiles bajo el COGEP se realizan en línea en la plataforma web de la Judicatura para garantizar transparencia y libre postulación.",
                law: "Art. 398 y 399 del COGEP",
                consequence: "El terreno se adjudicará al mejor postor y con el dinero se cancelará la obligación."
              }
            },
            {
              text: "Mediante venta directa e informal organizada por el perito avaluador en el sitio del inmueble.",
              correct: false,
              feedback: {
                explanation: "Los remates privados informales no están autorizados. El perito solo valora el bien; la venta pública es competencia exclusiva del sistema de remates judiciales en línea.",
                law: "Art. 398 COGEP",
                consequence: "El remate directo sería nulo e ineficaz."
              }
            }
          ]
        }
      ]
    },
    {
      id: "ejec_mediacion",
      title: "Ejecución de Acta de Mediación",
      description: "Tienes un acta de mediación firmada en un centro oficial para el pago transaccional de una deuda de $6,000. El plazo de cumplimiento voluntario feneció y el deudor no ha cancelado.",
      stages: [
        {
          name: "Procedibilidad",
          situation: "Deseas iniciar la ejecución forzosa con el acta de mediación.",
          question: "¿Tiene el acta de mediación fuerza ejecutiva suficiente para iniciar la fase de ejecución directa?",
          options: [
            {
              text: "Sí, el acta de mediación tiene la calidad de sentencia ejecutoriada y su incumplimiento da derecho a iniciar directamente la fase de ejecución.",
              correct: true,
              feedback: {
                explanation: "Las actas de mediación y transacciones suscritas en centros autorizados son títulos de ejecución asimilados a sentencias ejecutoriadas con fuerza de ley directa.",
                law: "Art. 363.2 del COGEP",
                consequence: "El juez competente dará inicio directo al mandamiento de ejecución."
              }
            },
            {
              text: "No, se debe entablar primero una demanda ordinaria para que el juez declare la validez de lo acordado en mediación.",
              correct: false,
              feedback: {
                explanation: "Si el acta de mediación cumple las formalidades legales, es definitiva. No requiere homologación ni nuevo juicio previo, pues goza de la misma autoridad de cosa juzgada.",
                law: "Art. 363.2 COGEP",
                consequence: "Iniciar un juicio ordinario constituiría un trámite innecesario y dilatorio."
              }
            }
          ]
        },
        {
          name: "Pago",
          situation: "Se notifica al ejecutado con el mandamiento de ejecución. El ejecutado deposita el valor total en la cuenta del juzgado.",
          question: "¿Cuál es la actuación judicial correspondiente una vez extinguida la obligación con el pago íntegro?",
          options: [
            {
              text: "Ordenar la entrega del dinero al ejecutante y disponer el archivo definitivo del proceso.",
              correct: true,
              feedback: {
                explanation: "Satisfecha la obligación total reclamada (capital adeudado, intereses y costas), el juez debe ordenar el pago y declarar extinguido y archivado el proceso.",
                law: "Art. 361 y 372 del COGEP",
                consequence: "La simulación finaliza con éxito habiéndose recuperado el valor pactado."
              }
            },
            {
              text: "Mantener el proceso abierto e imponer una fianza permanente de buena conducta al ejecutado.",
              correct: false,
              feedback: {
                explanation: "El proceso civil de cobro busca satisfacer una deuda. Una vez pagada, no hay objeto litigioso ni base legal para fianzas de conducta civiles.",
                law: "Art. 361 COGEP",
                consequence: "Se configuraría abuso de autoridad judicial y dilación de archivo."
              }
            }
          ]
        }
      ]
    }
  ]
};
