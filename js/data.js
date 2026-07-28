/**
 * Base de Datos Frontend para el Portal de Aprendizaje COGEP
 * Este archivo contiene los textos literales y las estructuras de datos
 * requeridas para el módulo informativo, cuestionarios y el simulador.
 */

// 1. Procedimientos Principales del COGEP
const COGEP_PROCEDURES = [
  {
    id: "ordinario",
    title: "Procedimiento Ordinario",
    image: "images/P_ordinario.png",
    articles: "Art. 289 al 317 del COGEP",
    description: "Es el procedimiento común y de mayor duración en el COGEP. Se desarrolla en varias etapas y audiencias (Preliminar y de Juicio), lo que permite una mayor actividad probatoria y contradicción entre las partes. Aplica a todas las materias no previstas para otro procedimiento.",
    characteristics: [
      "Es el procedimiento común y de mayor duración.",
      "Se desarrolla en varias etapas y audiencias (Preliminar y de Juicio).",
      "Permite una mayor actividad probatoria y contradicción entre las partes.",
      "Aplica a todas las materias no previstas para procedimiento sumario."
    ],
    baseNormative: [
      { topic: "Procedimiento Ordinario", refs: "Arts. 289 al 317 COGEP" },
      { topic: "Citaciones", refs: "Arts. 53 al 57" },
      { topic: "Demanda y Calificación", refs: "Arts. 142 al 146" },
      { topic: "Audiencias y Términos Probatorios", refs: "Arts. 291 al 296" },
      { topic: "Aclaración y Ampliación", refs: "Arts. 250 al 254" },
      { topic: "Apelación", refs: "Arts. 111 al 112" },
      { topic: "Casación", refs: "Arts. 268 al 279" },
      { topic: "Recurso de Hecho", refs: "Art. 278" }
    ]
  },
  {
    id: "ejecutivo",
    title: "Procedimiento Ejecutivo",
    image: "images/P_ejecutivo.png",
    articles: "Art. 347 al 355 del COGEP",
    description: "Se fundamenta en documentos que contienen una obligación de dar o hacer clara, pura, determinada y actualmente exigible (títulos ejecutivos). Su trámite es rápido y busca la ejecución expedita del derecho reclamado.",
    characteristics: [
      "Requiere un título ejecutivo (letra de cambio, pagaré, etc.).",
      "La obligación debe ser clara, pura, determinada y exigible.",
      "Audiencia única dividida en dos fases."
    ],
    baseNormative: [
      { topic: "Procedimiento Ejecutivo", refs: "Arts. 347 al 355 COGEP" },
      { topic: "Demanda", refs: "Art. 142" },
      { topic: "Calificación", refs: "Art. 146" },
      { topic: "Citación", refs: "Arts. 53 al 56" },
      { topic: "Excepciones", refs: "Art. 353" },
      { topic: "Audiencias", refs: "Art. 354" },
      { topic: "Ejecución y Embargo", refs: "Arts. 375 al 376" },
      { topic: "Remate", refs: "Arts. 398 al 401" }
    ]
  },
  {
    id: "sumario",
    title: "Procedimiento Sumario",
    image: "images/P_sumario.png",
    articles: "Art. 332 al 333 del COGEP",
    description: "Un trámite rápido y simplificado aplicable a controversias específicas determinadas por ley (como alimentos, disputas laborales, etc.). Se resuelve en una sola audiencia única con dos fases.",
    characteristics: [
      "Trámite concentrado y de corta duración.",
      "Se resuelve en una audiencia única.",
      "No cabe recurso de casación en la mayoría de sus casos."
    ],
    baseNormative: [
      { topic: "Procedimiento Sumario", refs: "Arts. 332 al 332.11 COGEP" },
      { topic: "Demanda y Calificación", refs: "Arts. 142 al 146" },
      { topic: "Citación", refs: "Arts. 53 al 57" },
      { topic: "Contestación", refs: "Art. 333.3" },
      { topic: "Audiencia Única", refs: "Art. 333.4" },
      { topic: "Sentencia", refs: "Art. 333.5" },
      { topic: "Recursos", refs: "Arts. 253 al 360" }
    ]
  },
  {
    id: "monitorio",
    title: "Procedimiento Monitorio",
    image: "images/P_monitorio.png",
    articles: "Art. 356 al 363 del COGEP",
    description: "Procedimiento expedito creado para el cobro de deudas de dinero, determinadas, vencidas y de cantidad líquida que no excedan las 50 deudas básicas, siempre que no consten en título ejecutivo.",
    characteristics: [
      "Para deudas de dinero sin título ejecutivo.",
      "Límite máximo de cuantía establecida por ley.",
      "Si el deudor no comparece, la resolución de pago queda firme y se inicia la ejecución."
    ],
    baseNormative: [
      { topic: "Procedimiento Monitorio", refs: "Arts. 356 al 361 COGEP" },
      { topic: "Demanda y Calificación", refs: "Arts. 357, 146" },
      { topic: "Admisión y Pago", refs: "Art. 358" },
      { topic: "Oposición", refs: "Arts. 358 al 359" },
      { topic: "Audiencia Única", refs: "Art. 354" }
    ]
  },
  {
    id: "ejecucion",
    title: "Procedimiento de Ejecución",
    image: "images/P_ejecucion.png",
    articles: "Art. 364 al 405 del COGEP",
    description: "Tiene por objeto hacer cumplir los derechos contenidos en un título de ejecución (sentencias ejecutoriadas, actas de mediación, laudos arbitrales, etc.) mediante el apremio personal o real del ejecutado.",
    characteristics: [
      "Inicia con un título de ejecución obligatorio.",
      "Fase de embargo, avalúo y remate de bienes.",
      "Oposición limitada por causales específicas."
    ],
    baseNormative: [
      { topic: "Procedimiento de Ejecución", refs: "Arts. 362 al 398 COGEP" },
      { topic: "Título de Ejecución", refs: "Art. 363" },
      { topic: "Solicitud y Mandamiento", refs: "Arts. 370 al 372" },
      { topic: "Embargo", refs: "Art. 375" },
      { topic: "Audiencia de Ejecución", refs: "Art. 392" },
      { topic: "Conclusión", refs: "Art. 395" }
    ]
  }
];

// TEXTOS COMUNES DE LA LEY PARA REUSAR Y EVITAR DUPLICACIÓN DE CÓDIGO
const COMMON_LAW_TEXTS = {
  art142: `<h4>Art. 142.- Contenido de la demanda</h4>
<p>La demanda se presentará por escrito y contendrá:</p><br>
<ol class="literal-list">
  <li>La designación de la o del juzgador ante quien se la propone.</li>
  <li>Los nombres y apellidos completos, número de cédula de identidad o ciudadanía, pasaporte, estado civil, edad, profesión u ocupación, dirección domiciliaria y electrónica de la o del actor, casillero judicial o electrónico de su defensora o defensor público o privado. Cuando se actúa en calidad de procuradora o procurador o representante legal se hará constar también los datos de la o del representado.</li>
  <li>El número del Registro Único de Contribuyentes en los casos que así se requiera.</li>
  <li>Los nombres completos y la designación del lugar en que debe citarse a la o al demandado, además de dirección electrónica, si se conoce.</li>
  <li>La narración de los hechos detallados y pormenorizados que sirven de fundamento a las pretensiones, debidamente clasificados y numerados.</li>
  <li>Los fundamentos de derecho que justifican el ejercicio de la acción, expuestos con claridad y precisión.</li>
  <li>El anuncio de los medios de prueba que se ofrece para acreditar los hechos. Se acompañarán la nómina de testigos con indicación de los hechos sobre los cuales declararán y la especificación de los objetos sobre los que versarán las diligencias, tales como la inspección judicial, la exhibición, los informes de peritos y otras similares. Si no tiene acceso a las pruebas documentales o periciales, se describirá su contenido, con indicaciones precisas sobre el lugar en que se encuentran y la solicitud de medidas pertinentes para su práctica.</li>
  <li>La solicitud de acceso judicial a la prueba debidamente fundamentada, si es del caso.</li>
  <li>La pretensión clara y precisa que se exige.</li>
  <li>La cuantía del proceso cuando sea necesaria para determinar el procedimiento.</li>
  <li>La especificación del procedimiento en que debe sustanciarse la causa.</li>
  <li>Las firmas de la o del actor o de su procuradora o procurador y de la o del defensor salvo los casos exceptuados por la ley. En caso de que la o el actor no sepa o no pueda firmar, se insertará su huella digital, para lo cual comparecerá ante la o el funcionario judicial correspondiente, quien sentará la respectiva razón.</li>
  <li>Los demás requisitos que las leyes de la materia determinen para cada caso.</li>
</ol>`,

  art146: `<h4>Art. 146.- Calificación de la demanda</h4>
<p>Presentada la demanda, la o el juzgador, en el término máximo de cinco días, examinará si cumple los requisitos legales generales y especiales que sean aplicables al caso. Si los cumple, calificará, tramitará y dispondrá la práctica de las diligencias solicitadas.</p><br>
<p>Si la demanda no cumple con los requisitos previstos en este Código, la o el juzgador dispondrá que la o el actor la complete o aclare en el término de tres días, si no lo hace, ordenará el archivo y la devolución de los documentos adjuntados a ella, sin necesidad de dejar copias.</p><br>
<p>En materia de niñez y adolescencia, la o el juzgador fijará provisionalmente la pensión de alimentos y el régimen de visitas.</p><br>
<p>En caso de expropiación urgente la o el juzgador al momento de calificar la demanda ordenará la ocupación inmediata del inmueble, siempre que a la demanda se acompañe el precio fijado en el avalúo comercial municipal.</p><br>
<p>El juez dispondrá la inscripción en el registro correspondiente, de las demandas que versen sobre dominio o posesión de inmuebles o de muebles sujetos a registro, así como también de las demandas que versen sobre demarcación y linderos, servidumbres, expropiación, división de bienes comunes y acciones reales inmobiliarias.</p><br>
<p>Antes de que se cite con la demanda se realizará la inscripción, que se comprobará con el certificado respectivo. La omisión de este requisito será subsanable en cualquier estado del juicio, pero constituye falta susceptible de ser sancionada; al efecto, la jueza o el juez deberán comunicar del particular al respectivo director provincial del Consejo de la Judicatura para que proceda a sustanciar el correspondiente sumario administrativo.</p><br>
<p>La inscripción de la demanda no impide que los bienes se enajenen válidamente en remate forzoso y aún de modo privado, pero el fallo que en el litigio recayere tendrá fuerza de cosa juzgada contra el adquiriente, aunque este no haya comparecido en el juicio. Hecha la inscripción del traspaso de dominio, el registrador la pondrá en conocimiento del juez de la causa, dentro de tres días, mediante oficio que se incorporará al proceso.</p><br>
<p>Si la sentencia fuere favorable al actor, el juez ordenará que se cancelen los registros de transferencia, gravámenes y limitaciones al dominio efectuados después de la inscripción de la demanda.</p>`,

  citacion: `<h4>Art. 53.- Citación</h4>
<p>La citación es el acto por el cual se le hace conocer a la o al demandado el contenido de la demanda o de la petición de una diligencia preparatoria y de las providencias recaídas en ellas. Se realizará en forma personal, mediante boletas o a través del medio de comunicación ordenado por la o el juzgador.</p><br>
<p>Si una parte manifiesta que conoce determinada petición o providencia o se refiere a ella en escrito o en acto del cual quede constancia en el proceso, se considerará citada o notificada en la fecha de presentación del escrito o en la del acto al que haya concurrido.</p><br>
<p>Si la o el actor ha proporcionado la dirección de correo electrónico de la o del demandado, la o el juzgador ordenará también que se le haga conocer a la o al demandado, por correo electrónico, el extracto de la demanda y del auto inicial, de lo cual, se dejará constancia en el sistema. Esto no sustituye a la citación oficial.</p><br>
<p>Toda citación deberá ser publicada en la página web del Consejo de la Judicatura, a través de los medios electrónicos y tecnológicos de los que disponga la Función Judicial.</p><br>
<p>Nota: Inciso cuarto agregado por Disposición Reformatoria Primera, numeral 2 de Ley No. 0, publicada en Registro Oficial Suplemento 31 de 7 de Julio del 2017. </p><br>

<h4>Art. 54.- Citación personal</h4>
<p>Se cumplirá con la entrega personal a la o el demandado o en el caso de personas jurídicas u otras que no pueden representarse por sí mismas a su representante legal en cualquier lugar, día y hora, el contenido de la demanda, de la petición de una diligencia preparatoria, de todas las providencias recaídas en ella y de cualquier otra información que a juicio de la o del juzgador sea necesaria para que las partes estén en condiciones de ejercer sus derechos. De la diligencia la o el citador elaborará el acta respectiva.</p><br>

<h4>Art. 55.- Citación por boletas</h4>
<p>Si no se encuentra personalmente a la o el demandado, se le citará por medio de tres boletas que se entregarán en días distintos en su domicilio o residencia a cualquier persona de la familia. Si no se encuentra a persona alguna a quien entregarlas se fijarán en la puerta del lugar de habitación.</p><br>
<p>La citación por boletas a la o el representante legal de una persona jurídica se hará en el respectivo establecimiento, oficina o lugar de trabajo, en días y horas hábiles, entregándolas a uno de sus dependientes o empleados, previa constatación de que se encuentra activo.</p><br>

<h4>Art. 56.- Citación a través de uno de los medios de comunicación</h4>
<p>A la persona o personas cuya individualidad, domicilio o residencia sea imposible determinar, se la citará mediante:</p><br>
<p>1. Publicaciones que se realizarán en tres fechas distintas, en un periódico de amplia circulación del lugar. De no haberlo, se harán en un periódico de la capital de provincia, asimismo de amplia circulación. Si tampoco hay allí, en uno de amplia circulación nacional. La publicación contendrá un extracto de la demanda o solicitud pertinente y de la providencia respectiva. Las publicaciones íntegras se agregarán al proceso.</p><br>
<p>2. Mensajes que se transmitirán en tres fechas distintas, por lo menos tres veces al día, en una radiodifusora de la localidad, en un horario de seis a veintidós horas y que contendrán un extracto de la demanda o solicitud pertinente. La o el propietario o la o el representante legal de la radiodifusora emitirá el certificado que acredite las fechas y horas en que se realizaron las transmisiones de mensajes y una copia del audio. La citación por la radio se realizará cuando, a criterio de la o del juzgador, este sea el principal medio de comunicación del lugar.</p><br>
<p>La declaración de que es imposible determinar la individualidad, el domicilio o residencia de la o del demandado y que se han efectuado todas las diligencias necesarias, para tratar de ubicar a quien se pide citar de esta forma, como acudir a los registros de público acceso, la hará la o el solicitante bajo juramento que se presentará ante la o el juzgador del proceso o mediante deprecatorio a la o al juzgador del domicilio o residencia de la o del actor.</p><br>
<p>Para el caso anterior se adjuntará además la certificación del Ministerio de Relaciones Exteriores que indique si la persona salió del país o consta en el registro consular. Si se verifica que es así, se citará mediante carteles fijados en el consulado en el que se encuentra registrado.</p><br>
<p>La o el juzgador no admitirá la solicitud sin el cumplimiento de esta condición. De admitirla, deberá motivar su decisión.</p><br>
<p>Transcurridos veinte días desde la última publicación o transmisión del mensaje radial comenzará el término para contestar la demanda.</p><br>
<p>Si se acredita que la parte actora, su apoderado o ambos, faltaron a la verdad con respecto a la dirección domiciliaria o residencia de la o del demandado o respecto al hecho de no haber sido posible determinar su individualidad, se remitirá copia de lo actuado al fiscal respectivo, para la investigación.</p><br>
<p>Nota: Ver Instructivo para la certificación y citación del Ministerio de Relaciones Exteriores. Acuerdo Ministerial No. 85. Para leer Texto, ver Registro Oficial 636 de 26 de Noviembre de 2015, página 2.</p><br>

<h4>Art. 57.- Citación a las y los ecuatorianos en el exterior</h4>
<p>La citación a las y los ecuatorianos en el exterior cuyo domicilio se conoce se realizará mediante exhorto a las autoridades consulares.</p>`,

  resourcesOrdinario: {
    aclaracion: `<h4>Art. 254.- Revocatoria y reforma</h4>
<p>Por la revocatoria la parte pretende que el mismo órgano jurisdiccional que pronunció un auto de sustanciación lo deje sin efecto y dicte otro en sustitución. También será admisible la reforma, en cuyo caso se enmendará la providencia en la parte que corresponda.</p>`,
    ampliacion: `<h4>Art. 254.- Revocatoria y reforma</h4>
<p>Por la revocatoria la parte pretende que el mismo órgano jurisdiccional que pronunció un auto de sustanciación lo deje sin efecto y dicte otro en sustitución. También será admisible la reforma, en cuyo caso se enmendará la providencia en la parte que corresponda.</p>`,
    apelacion: `<h4>Art. 111.- Nulidad y apelación</h4>
<p>El tribunal que deba pronunciarse sobre el recurso de apelación examinará si en el escrito de interposición se ha reclamado la nulidad procesal. Solamente en caso de que el tribunal encuentre que el proceso es válido, se pronunciará sobre los argumentos expresados por la o el apelante. Si encuentra que hay nulidad procesal y que la misma ha sido determinante porque la violación ha influido o ha podido influir en la decisión del proceso, la declarará a partir del acto viciado y remitirá el proceso a la o al juzgador de primer nivel. Los procesos conocidos por la o el juzgador superior, sin que se haya declarado la nulidad, no podrán ser anulados por las o los juzgadores inferiores, aun cuando hayan observado después, que ha faltado alguna solemnidad sustancial.</p><br>
<h4>Art. 112.- Nulidad de sentencia</h4>
<p>La sentencia ejecutoriada que pone fin al proceso es nula en los siguientes casos:</p><br>

  <p>1. Por falta de jurisdicción o competencia de la o del juzgador que la dictó, salvo que estas se hayan planteado y resuelto como excepciones previas.</p><br>
  <p>2. Por ilegitimidad de personería de cualquiera de las partes, salvo que esta se haya planteado y resuelto como excepción previa.</p><br>
  <p>3. Por no haberse citado con la demanda a la o el demandado si este no compareció al proceso.</p><br>
  <p>4. Por no haberse notificado a las partes la convocatoria a las audiencias o la sentencia, siempre y cuando la parte no haya comparecido a la respectiva audiencia o no se haya interpuesto recurso alguno a la sentencia.</p><br>

<p>Las nulidades comprendidas en este artículo podrán demandarse ante la o el juzgador de primera instancia de la misma materia de aquel que dictó sentencia, mientras esta no haya sido ejecutada. No podrán ser conocidas por la o el juzgador que las dictó. La presentación de la demanda de nulidad no impide que se continúe con la ejecución. La nulidad de la sentencia no podrá demandarse cuando haya sido expedida por las salas de la Corte Nacional de Justicia y se dejará a salvo las acciones que franquee la Constitución de la República.</p>`,
    casacion: `<h4>Art. 268.- Casos</h4>
<p>El recurso de casación procederá en los siguientes casos:</p><br>

  <p>1. Cuando se haya incurrido en aplicación indebida, falta de aplicación o errónea interpretación de normas procesales, que hayan viciado al proceso de nulidad insubsanable o causado indefensión y hayan influido por la gravedad de la transgresión en la decisión de la causa, y siempre que la respectiva nulidad no haya sido subsanada en forma legal.</p><br>
  <p>2. Cuando la sentencia o auto no contenga los requisitos exigidos por la ley o en su parte dispositiva se adopten decisiones contradictorias o incompatibles, así como, cuando no cumplan el requisito de motivación.</p><br>
  <p>3. Cuando se haya resuelto en la sentencia o auto lo que no sea materia del litigio o se haya concedido más allá de lo demandado, o se omita resolver algún punto de la controversia.</p><br>
  <p>4. Cuando se haya incurrido en aplicación indebida, falta de aplicación o errónea interpretación de los preceptos jurídicos aplicables a la valoración de la prueba, siempre que hayan conducido a una equivocada aplicación o a la no aplicación de normas de derecho sustantivo en la sentencia o auto.</p><br>
  <p>5. Cuando se haya incurrido en aplicación indebida, falta de aplicación o errónea interpretación de normas de derecho sustantivo, incluyendo los precedentes jurisprudenciales obligatorios, que hayan sido determinantes en la parte dispositiva de la sentencia o auto.</p>`,
    hecho: `<h4>Art. 278.- Procedencia</h4>
<p>El recurso de hecho procede contra las providencias que niegan un recurso de apelación o de casación, a fin de que la o el juzgador competente las confirme o las revoque.</p>`
  }
};

// 2. Actos Procesales del Procedimiento Ordinario
const ORDINARIO_STAGES = [
  {
    number: 1,
    title: "DEMANDA",
    article: "Art. 142",
    description: "El actor presenta la demanda por escrito cumpliendo estrictamente con los requisitos formales.",
    timeLimit: "N/A",
    fullContent: COMMON_LAW_TEXTS.art142
  },
  {
    number: 2,
    title: "CALIFICACIÓN DE LA DEMANDA",
    article: "Art. 146",
    description: "El juzgador califica la demanda en cuanto a requisitos legales generales y especiales.",
    timeLimit: "3 días (Art. 146.2)",
    fullContent: COMMON_LAW_TEXTS.art146
  },
  {
    number: 3,
    title: "CITACIÓN AL DEMANDADO",
    article: "Arts. 53-57",
    description: "Se pone en conocimiento del demandado la demanda y la providencia inicial dictada.",
    timeLimit: "3 a 20 días, según la forma de citación",
    fullContent: COMMON_LAW_TEXTS.citacion
  },
  {
    number: 4,
    title: "CONTESTACIÓN A LA DEMANDA",
    article: "Art. 291",
    description: "El demandado contesta la demanda, propone excepciones previas y/o reconviene.",
    timeLimit: "30 días (Art. 291)",
    fullContent: `<h4>Art. 291.- Calificación de la demanda y contestación</h4>
<p>Presentada y admitida la demanda, la o el juzgador ordenará se cite al o a los demandados en la forma prevista en este Código. La o el demandado tendrá treinta días para presentar su contestación a la demanda. Este término se contará desde que se practicó la última citación, cuando las o los demandados son va contestarla, se reconviene al actor, la o el juzgador en los tres días siguientes notificará y concederá a la o al actor el término de treinta días para contestarla.</p><br>
<p>Previamente a sustanciar el proceso, la o el juzgador calificará la demanda, la contestación a la demanda, la reconvención, la contestación a la reconvención y procederá conforme lo previsto en las disposiciones generales para los procesos.</p>`
  },
  {
    number: 5,
    title: "AUDIENCIA PRELIMINAR",
    article: "Art. 292",
    description: "Saneamiento, conciliación, fijación de los puntos de debate y resolución de pruebas.",
    timeLimit: "Máx. 30 días desde la contestación",
    fullContent: `<h4>Art. 292.- Convocatoria</h4>
<p>Con la contestación o sin ella, en el término de tres días posteriores al vencimiento de los términos previstos en el artículo anterior, la o el juzgador convocará a la audiencia preliminar, la que deberá realizarse en un término no menor a diez ni mayor a veinte días.</p>`
  },
  {
    number: 6,
    title: "PERÍODO PROBATORIO",
    article: "Art. 294",
    description: "Práctica y debate de admisibilidad de las pruebas anunciadas y admitidas en la audiencia.",
    timeLimit: "30 días (Art. 294)",
    fullContent: `<h4>Art. 294.- Desarrollo</h4>
<p>La audiencia preliminar se desarrollará conforme con las siguientes reglas:</p><br>
<ol class="literal-list">
  <li>Instalada la audiencia, la o el juzgador solicitará a las partes se pronuncien sobre las excepciones previas propuestas. De ser pertinente, serán resueltas en la misma audiencia.</li>
  <li>La o el juzgador resolverá sobre la validez del proceso, la determinación del objeto de la controversia, los reclamos de terceros, competencia y cuestiones de procedimiento que puedan afectar la validez del proceso, con el fin de convalidarlo o sanearlo. La nulidad se declarará siempre que pueda influir en la decisión del proceso o provocar indefensión. Toda omisión hace responsables a las o los juzgadores que en ella han incurrido, quienes serán condenados en costas.</li>
  <li>La o el juzgador ofrecerá la palabra a la parte actora que expondrá los fundamentos de su demanda. Luego intervendrá la parte demandada, fundamentando su contestación y reconviniendo de considerarlo pertinente. Si la parte actora es reconvenida, la o el juzgador concederá la palabra para que fundamente su contestación. Si se alegan hechos nuevos, se procederá conforme a este Código.</li>
  <li>La o el juzgador, de manera obligatoria, promoverá la conciliación conforme a la ley. De darse la conciliación total, será aprobada en el mismo acto, mediante sentencia que causará ejecutoria.</li>
  <li>En caso de producirse una conciliación parcial, la o el juzgador la aprobará mediante auto que causará ejecutoria y continuará el proceso sobre la materia en que subsista la controversia.</li>
  <li>La o el juzgador, de oficio, o a petición de parte, podrá disponer que la controversia pase a un centro de mediación legalmente constituido, para que se busque un acuerdo entre las partes. En caso de que las partes suscriban un acta de mediación en la que conste un acuerdo total, la o el juzgador la incorporará al proceso para darlo por concluido.</li>
  <li>Concluida la primera intervención de las partes, si no hay vicios de procedimiento que afecten la validez procesal, continuará la audiencia, para lo cual las partes deberán:
    <ul>
      <li>a) Anunciar la totalidad de las pruebas que serán presentadas en la audiencia de juicio. Formular solicitudes, objeciones y planteamientos que estimen relevantes referidos a la oferta de prueba de la contraparte.</li>
      <li>b) La o el juzgador podrá ordenar la práctica de prueba de oficio, en los casos previstos en este Código.</li>
      <li>c) Solicitar la exclusión, rechazo o inadmisibilidad de los medios de prueba encaminados a probar hechos notorios o que por otro motivo no requieren prueba.</li>
      <li>d) La o el juzgador resolverá sobre la admisibilidad de la prueba conducente, pertinente y útil; excluirá la práctica de medios de prueba ilegales, incluyendo los que se han obtenido o practicado con violación de los requisitos formales, las normas y garantías previstas en la Constitución, los instrumentos internacionales de protección de derechos humanos y este Código, y que fueron anunciadas por los sujetos procesales.</li>
      <li>e) Para el caso de las pruebas que deban practicarse antes de la audiencia de juicio, la o el juzgador, conjuntamente con las partes, harán los señalamientos correspondientes con el objeto de planificar la marcha del proceso.</li>
      <li>f) Los acuerdos probatorios podrán realizarse por mutuo acuerdo entre las partes o a petición de una de ellas cuando sea innecesario probar el hecho, inclusive sobre la comparecencia de los peritos para que rindan testimonio sobre los informes presentados. La o el juzgador fijará la fecha de la audiencia de juicio.</li>
    </ul>
  </li>
  <li>Concluidas las intervenciones de los sujetos procesales, la o el juzgador comunicará motivadamente, de manera verbal, a los presentes sus resoluciones, inclusive señalará la fecha de la audiencia de juicio, que se considerarán notificadas en el mismo acto. Se conservará la grabación de las actuaciones y exposiciones realizadas en la audiencia.</li>
</ol>
<p>Las manifestaciones de dirección de la audiencia, incluso la proposición de fórmulas de arreglo entre las partes y las ordenadas para el cumplimiento de las actividades previstas en la misma, en ningún caso significarán prejuzgamiento. Por esta causa, la o el juzgador no podrá ser acusado de prevaricato, recusado, ni sujeto a queja.</p><br>
<p>La o el secretario elaborará, bajo su responsabilidad y su firma, el extracto de la audiencia, que recogerá la identidad de los comparecientes, los procedimientos especiales alternativos del procedimiento ordinario que se ha aplicado, las alegaciones, los incidentes y las resoluciones de la o el juzgador.</p>`
  },
  {
    number: 7,
    title: "AUDIENCIA DE JUICIO",
    article: "Art. 295",
    description: "Práctica de pruebas no practicadas y alegatos finales de las partes procesales.",
    timeLimit: "Máx. 20 días después de finalizada la audiencia preliminar",
    fullContent: `<h4>Art. 295.- Resolución de excepciones</h4>
<p>Se resolverán conforme con las siguientes reglas:</p>
<ol class="literal-list">
  <li>Si se acepta una excepción previa que no es subsanable, se declarará sin lugar la demanda y se ordenará su archivo.</li>
  <li>Si se acepta la excepción de defecto en la forma de proponer la demanda, la parte actora subsanará los defectos dentro del término de seis días, otorgando a la parte demandada el término de diez días para completar o reemplazar su contestación y anunciar prueba, atendiendo las aclaraciones o precisiones formuladas. De no hacerlo se tendrá la demanda o la reconvención por no presentada.</li>
  <li>Si se aceptan las excepciones de falta de capacidad, de falta de personería o de incompleta conformación del litis consorcio se concederá un término de diez días para subsanar el defecto, bajo apercibimiento de tener por no presentada la demanda y de aplicarse las sanciones pertinentes.</li>
  <li>Si el asunto es de puro derecho se escuchará las alegaciones de las partes. La o el juzgador emitirá su resolución y notificará posteriormente la sentencia por escrito.</li>
</ol>
<p>Terminados los alegatos, la o el juzgador podrá suspender la audiencia hasta que forme su convicción, debiendo reanudarla para emitir su resolución mediante pronunciamiento oral de acuerdo con lo previsto en este Código.</p>`
  },
  {
    number: 8,
    title: "SENTENCIA",
    article: "Art. 296",
    description: "El juzgador dicta sentencia oral en la audiencia o por escrito dentro de los 10 días.",
    timeLimit: "10 días (Art. 296)",
    fullContent: `<h4>Art. 296.- Resolución de recursos</h4>
<p>En la audiencia preliminar, se resolverán los recursos propuestos que se regirán por las siguientes reglas:</p><br>
<ol class="literal-list">
  <li>El auto interlocutorio que rechace las excepciones previas, únicamente será apelable con efecto diferido. Si la resolución acoge las excepciones previas o resuelve cualquier cuestión que ponga fin al proceso será apelable con efecto suspensivo.</li>
  <li>La ampliación y la aclaración de las resoluciones dictadas se propondrán en audiencia y se decidirán inmediatamente por la o el juzgador.</li>
</ol>`
  }
];

const ORDINARIO_RESOURCES = [
  { id: "aclaracion", title: "Aclaración", article: "Art. 254", desc: "Procede cuando la sentencia o auto es oscuro o ambiguo. Plazo: 3 días. Resolución: 48 horas.", fullContent: COMMON_LAW_TEXTS.resourcesOrdinario.aclaracion },
  { id: "ampliacion", title: "Ampliación", article: "Art. 254", desc: "Procede cuando no se haya resuelto algún punto controvertido. Plazo: 3 días. Resolución: 48 horas.", fullContent: COMMON_LAW_TEXTS.resourcesOrdinario.ampliacion },
  { id: "apelacion", title: "Apelación", article: "Arts. 111-112", desc: "Procede contra sentencia y autos interlocutorios que pongan fin al juicio. Plazo: 3 días. Resolución: 20 días.", fullContent: COMMON_LAW_TEXTS.resourcesOrdinario.apelacion },
  { id: "casacion", title: "Casación", article: "Art. 268", desc: "Procede contra sentencias de Cortes Provinciales por causales taxativas de ley. Plazo: 10 días. Resolución: 60 días.", fullContent: COMMON_LAW_TEXTS.resourcesOrdinario.casacion },
  { id: "hecho", title: "Hecho", article: "Art. 278", desc: "Procede cuando se niega indebidamente el recurso de apelación o casación. Plazo: 3 días. Resolución: 5 días.", fullContent: COMMON_LAW_TEXTS.resourcesOrdinario.hecho }
];

// 3. Actos Procesales y Recursos del Procedimiento Ejecutivo
const EJECUTIVO_STAGES = [
  {
    number: 1,
    title: "PRESENTACIÓN DE LA DEMANDA",
    article: "Art. 142",
    description: "Se presenta demanda ejecutiva con título ejecutivo. Debe cumplir con los requisitos del COGEP. Se pueden solicitar medidas cautelares.",
    timeLimit: "N/A",
    fullContent: COMMON_LAW_TEXTS.art142
  },
  {
    number: 2,
    title: "CALIFICACIÓN DE LA DEMANDA",
    article: "Art. 146",
    description: "El juez califica la demanda. Si cumple requisitos se admite; de lo contrario ordena completar en 3 días.",
    timeLimit: "Hasta 5 días",
    fullContent: COMMON_LAW_TEXTS.art146
  },
  {
    number: 3,
    title: "CITACIÓN AL DEMANDADO",
    article: "Arts. 53-56",
    description: "Personal, por boletas, o por prensa/radio si se desconoce domicilio.",
    timeLimit: "Variable",
    fullContent: COMMON_LAW_TEXTS.citacion
  },
  {
    number: 4,
    title: "TÉRMINO PARA PAGAR U OPONER EXCEPCIONES",
    article: "Art. 353",
    description: "El demandado tiene 15 días para pagar la obligación, proponer excepciones o no comparecer.",
    timeLimit: "15 días",
    fullContent: `<h4>Art. 353.- Excepciones</h4>
<p>En el procedimiento ejecutivo la oposición solamente podrá fundarse en estas excepciones:</p><br>
<ol class="literal-list">
  <li>Título no ejecutivo.</li>
  <li>Nulidad formal o falsedad del título.</li>
  <li>Extinción total o parcial de la obligación exigida.</li>
  <li>Existencia de auto de llamamiento a juicio por delito de usura o enriquecimiento privado no justificado, en el que la parte demandada del procedimiento ejecutivo figure como acusadora particular o denunciante del proceso penal y el actor del procedimiento ejecutivo sea el procesado. En caso de que el auto de llamamiento a juicio sea posterior a la contestación a la demanda, la o el demandado podrá adjuntarlo al proceso y solicitar su suspensión.</li>
  <li>Excepciones previas previstas en este Código.</li>
</ol>`
  },
  {
    number: 5,
    title: "ESCENARIOS POSIBLES",
    article: "Art. 352",
    description: "Si paga se extingue la obligación; si no opone excepciones se dicta sentencia inmediata; si opone excepciones se convoca a audiencia única.",
    timeLimit: "Inmediato",
    fullContent: `<h4>Art. 352.- Falta de contestación a la demanda</h4>
<p>Si la o el deudor dentro del respectivo término no cumple la obligación, ni propone excepciones o si las excepciones propuestas son distintas a las permitidas en este Código para este tipo de procesos, la o el juzgador en forma inmediata pronunciará sentencia mandando que la o el deudor cumpla con la obligación. Esta resolución no será susceptible de recurso alguno.</p>`
  },
  {
    number: 6,
    title: "AUDIENCIA ÚNICA",
    article: "Art. 354",
    description: "Convocatoria dentro de los 20 días siguientes al término para contestar. Dividida en dos fases.",
    timeLimit: "Dentro de 20 días",
    fullContent: `<h4>Art. 354.- Audiencia (Fase única)</h4>
<p>Si se formula oposición debidamente fundamentada, dentro del término de tres días se notificará a la contraparte con copia de la misma y se señalará día y hora para la audiencia única, la que deberá realizarse en el término máximo de veinte días contados a partir de la fecha en que concluyó el término para presentar la oposición o para contestar la reconvención, de ser el caso.</p><br>
<p>La audiencia única se realizará en dos fases, la primera de saneamiento, fijación de los puntos en debate y conciliación y la segunda, de prueba y alegatos. La segunda fase se desarrollará en el siguiente orden: debate probatorio, alegato inicial, práctica de pruebas, alegato final.</p><br>
<p>Culminada la audiencia la o al juzgador deberá pronunciar su resolución y posteriormente notificar la sentencia conforme con este Código. De la sentencia cabrá apelación únicamente con efecto no suspensivo conforme con las reglas generales previstas en este Código. Para la suspensión de la ejecución de la sentencia el deudor deberá consignar o caucionar el valor de la obligación. Para la caución se estará a lo dispuesto en este Código. No será admisible el recurso de casación para este tipo de procesos.</p>`
  },
  {
    number: 7,
    title: "SENTENCIA",
    article: "Art. 354",
    description: "Dictada de forma oral en la audiencia y notificada posteriormente por escrito.",
    timeLimit: "N/A",
    fullContent: `<h4>Art. 354.- Sentencia Ejecutiva</h4>
<p>Culminada la audiencia la o al juzgador deberá pronunciar su resolución y posteriormente notificar la sentencia conforme con este Código. De la sentencia cabrá apelación únicamente con efecto no suspensivo conforme con las reglas generales previstas en este Código. Para la suspensión de la ejecución de la sentencia el deudor deberá consignar o caucionar el valor de la obligación.</p>`
  },
  {
    number: 8,
    title: "EJECUCIÓN DE LA SENTENCIA",
    article: "Art. 376",
    description: "Medidas que puede ordenar el juez: embargo, retención bancaria, prohibición de enajenar, secuestro, avalúo, remate y adjudicación.",
    timeLimit: "Variable",
    fullContent: `<h4>Art. 376.- Embargo</h4>
<p>La prohibición de enajenar, la retención o el secuestro anteriores no impiden el embargo y dispuesto este, la o el juzgador que lo ordena oficiará al que haya dictado la medida preventiva, para que notifique a la o al acreedor que la solicitó, a fin de que pueda hacer valer sus derechos como tercerista, si lo quiere. Las providencias preventivas subsistirán, no obstante el embargo, dejando a salvo el procedimiento de ejecución para el remate.</p><br>
<p>La o el depositario de las cosas secuestradas las entregará a la o al depositario designado por la o el juzgador que ordenó el embargo, o las conservará en su poder, a órdenes de esta o este juzgador si también es designado depositaria o depositario de las cosas embargadas. Si el embargo es cancelado sin llegar al remate, en la providencia de cancelación se oficiará a la o al juzgador que ordenó la providencia preventiva, la cual seguirá vigente hasta que sea cancelada por la o el juzgador que la dictó. Hecho el remate, la o el juzgador declarará canceladas las providencias preventivas y oficiará a la o al juzgador que las ordenó para que se tome nota de tal cancelación en el proceso respectivo.</p>`
  },
  {
    number: 9,
    title: "AUDIENCIA DE EJECUCIÓN",
    article: "Art. 392",
    description: "Resolver observaciones al avalúo, aprobar liquidaciones, tercerías y continuar con el remate.",
    timeLimit: "Variable",
    fullContent: `<h4>Art. 392.- Audiencia de ejecución</h4>
<p>La audiencia seguirá, en lo que sea pertinente, los lineamientos generales para el desarrollo de audiencias previstas en este Código, debiendo además cumplirse con lo siguiente:</p><br>
<ol class="literal-list">
  <li>Conocer y resolver sobre la oposición de la o del ejecutado por extinción de la obligación o pagos parciales posteriores al título de ejecución, debidamente justificados.</li>
  <li>De ser procedente aprobar fórmulas de pago, incluso cuando impliquen la suspensión del procedimiento de ejecución.</li>
  <li>Conocer sobre las observaciones de las partes al informe pericial de avalúo de los bienes y de ser el caso designar otra u otro perito.</li>
  <li>Señalar de entre los bienes embargados, los que deben ser objeto de remate, con base a su avalúo y al monto de la obligación.</li>
  <li>Resolver sobre la admisibilidad de las tercerías y sobre reclamaciones de terceros perjudicados.</li>
</ol>
<p>A la audiencia podrán concurrir otras personas por invitación del ejecutante o el ejecutado, los asistentes podrán proponer cualquier forma de realización de los bienes de la o del deudor y presentar a terceros que, previa caución de seriedad de oferta, se ofrezcan a adquirir dichos bienes por un precio previsiblemente superior al que pueda lograrse mediante venta en pública subasta. En este caso, la o el acreedor que ha vencido en el proceso podrá solicitar a la o al juzgador una prórroga para hacer acudir a la o al tercero adquirente, para lo cual se deberá contar con el acuerdo de la o del deudor y de la o del acreedor. En todo caso la o el acreedor que ha vencido no podrá oponerse si el precio ofrecido es mayor al monto de la obligación.</p><br>
<p>La audiencia terminará con el auto que resuelve los asuntos planteados y que ordene lo que corresponda para la continuación del procedimiento. Si continúa la ejecución, la o el juzgador señalará la fecha y la hora en que se realizará el remate electrónico, ordenando la publicación en la página web del Consejo de la Judicatura de un extracto que contendrá el detalle e imágenes de los bienes a ser rematados y su valor.</p>`
  },
  {
    number: 10,
    title: "REMATE DE BIENES",
    article: "Arts. 398-401",
    description: "Fases: avalúo, publicación, posturas y adjudicación. Concluye el proceso con el pago al acreedor.",
    timeLimit: "Variable",
    fullContent: `<h4>Art. 398.- Remate de los bienes de la o del ejecutado</h4>
<p>Los bienes de la o del ejecutado, que no se encuentren descritos en los artículos anteriores, sean muebles o inmuebles, derechos o acciones, se rematarán a través de la plataforma única de la página web del Consejo de la Judicatura. Por acuerdo de las partes y a su costa, los bienes embargados también se podrán rematar en entidades públicas o privadas autorizadas por el Consejo de la Judicatura. La o el ejecutante y la o el ejecutado podrán convenir que la venta, tanto de muebles como de inmuebles, se haga al martillo, con la intervención de martillador público, acuerdo que deberá ser respetado por la o el juzgador.</p><br>

<h4>Art. 399.- Posturas del remate</h4>
<p>El aviso del remate deberá ser publicado en la plataforma única de la página web del Consejo de la Judicatura, con el término de al menos veinte días de anticipación a la fecha del remate. La plataforma recibirá las ofertas desde las cero horas hasta las veinticuatro horas del día señalado para el remate. Adicionalmente y con fines de publicidad, a criterio de la o del juzgador debidamente motivado, el aviso del remate podrá ser publicado en otros medios electrónicos, impresos o escritos. La o el ejecutado podrá pagar la obligación con depósito bancario o transferencia bancaria electrónica dentro del mismo término. En el remate en línea, las o los postores deberán entregar, mediante depósito bancario o transferencia bancaria electrónica el 10% de la postura realizada. Si la postura contempla el pago a plazo, se deberá entregar el 15% de la postura realizada. La o el ejecutante podrá participar en el remate con cargo a su crédito estando exento del depósito del 10%), salvo que en la audiencia única se hayan admitido tercerías coadyuvantes, en cuyo caso participará en las mismas condiciones que las o los otros postores.</p><br>

<h4>Art. 400.- Requisitos de la postura</h4>
<p>Las posturas presentadas para primer y segundo señalamiento, no podrán ser inferiores al 100% del avalúo pericial efectuado. A partir del tercer señalamiento se admitirán posturas que en ningún caso podrán ser inferiores al 75% del avalúo pericial efectuado. <em>(Reformado por el Art. 65 de la Ley s/n, R.O. 517-S, 26-VI-2019)</em></p><br>

<h4>Art. 401.- Formas de pago</h4>
<p>Las formas de pago de las posturas son las siguientes: </p><br>
<p>1. Al contado.</p><br>
<p>2. A plazo. En el remate de bienes inmuebles no se admitirán posturas en que se fije plazos que excedan de cinco años contados desde el día del remate, ni las que no ofrezcan el pago de, por lo menos, el interés legal, pagadero por anualidades adelantadas.</p><br>
<p>La cosa rematada, si es bien inmueble, quedará en todo caso, hipotecada por lo que se ofrezca a plazo, debiendo inscribirse este gravamen en el correspondiente registro, al mismo tiempo que el traspaso de la propiedad. Del mismo modo, la prenda se conservará en poder de la o del acreedor prendario, mientras se cancele el precio del remate.</p><br>
<p>En el remate de bienes muebles, todo pago se hará al contado, sin que puedan admitirse ofertas a plazo, a menos que la o el ejecutante y la o el ejecutado convengan lo contrario.</p><br>
<p>De existir posturas iguales se preferirá la que se haya ingresado en primer lugar, salvo que se trate de postura de la o del ejecutante.</p><br>

<h4>Art. 402.- Calificación de las posturas.</h4>
<p>Una vez acreditados los valores de las posturas la o el juzgador señalará día y hora para la audiencia pública, en la que podrán intervenir los postores. La o el juzgador procederá a calificar las posturas teniendo en cuenta la cantidad ofrecida, el plazo y demás condiciones. Preferirá las que cubran al contado el crédito, intereses y costas de la o del ejecutante.</p><br>
<p>El auto de admisión y calificación de las posturas se reducirá a escrito, se notificará dentro de las cuarenta y ocho horas siguientes al de la realización de la audiencia y debe comprender el examen de todas las que se hayan presentado, enumerando su orden de preferencia y describiendo con claridad, exactitud y precisión todas sus condiciones.</p><br>
<p>El auto de calificación de posturas podrá ser apelado por la o el ejecutante y las o los terceristas coadyuvantes. La o el ejecutado podrá apelar cuando la postura sea inferior a la base del remate determinada en los requisitos de la postura, previstos en este Código. Concedida la apelación, la Corte Provincial fallará en el término de quince días sin ninguna tramitación por el mérito del proceso y de su fallo no se admitirá recurso alguno.</p><br>

<h4>Art. 403.- Posturas que se conceptúen iguales.-</h4>
<p><em>(Reformado por el Art. 66 de la Ley s/n, R.O. 517-S, 26-VI-2019).</em> Si hay dos o más posturas que se conceptúan iguales, la o el juzgador, de considerar que son las mejores, dispondrá en la misma audiencia de calificación, la adjudicación de la cosa al mejor postor.</p><br>
<p>En este remate no se admitirán otras u otros postores que los señalados en este artículo, y todo lo que ocurra se hará constar sucintamente en acta firmada por la o el juzgador, las o los postores que quieran hacerlo, las partes si concurren y la o el secretario.</p><br>

<h4>Art. 404.- Postura de la o del acreedor y de las o los trabajadores.</h4>
<p>La o el acreedor puede hacer postura con la misma libertad que cualquier otra persona y si no hay tercerías coadyuvantes, podrá imputarla al valor de su crédito sin acompañar la consignación del 10%.</p><br>
<p>Las o los trabajadores pueden hacer postura con la misma libertad que cualquier otra persona, e imputarla al valor de su crédito sin consignar el 10% aunque haya tercería coadyuvante.</p><br>
<p>Si el avalúo de los bienes embargados es superior al valor del crédito materia de la ejecución, consignará el 10% de lo que la oferta exceda al crédito.</p><br>

<h4>Art. 405.- Retasa y embargo de otros bienes.-</h4>
<p><em>(Sustituido por el Art. 82 de la Ley s/n, R.O. 245-3S, 7-II-2023).-</em> En el caso en que no haya postores, la o el acreedor podrá solicitar las retasas que sean necesarias de los bienes embargados y se reanudará el proceso de remate con el nuevo avalúo o pedir que se embarguen y rematen otros bienes liberando los bienes anteriormente embargados.</p><br>
<p>Si el valor ofrecido al contado no alcanza a cubrir el crédito de la o del ejecutante o el de la o del tercerista, podrán pedir, a su arbitrio, que se rematen como créditos los dividendos a plazo.</p><br>

<h4>Art. 406.- Nulidad del remate.</h4>
<p>El remate será nulo en los siguientes casos:</p><br>
<ol class="literal-list">
  <li>Si se verifica en día distinto del que sea señalado por la o el juzgador.</li>
  <li>Si no se ha publicitado el remate en la forma ordenada por la o el juzgador.</li>
</ol>
<p>La nulidad podrá ser declarada de oficio o a petición de parte en la audiencia de calificación de posturas. De lo que se resuelva no habrá recurso alguno.</p><br>
<p>Si se declara la nulidad del remate se señalará nuevo día para el remate conforme con este Código.</p><br>

<h4>Art. 407.- Auto de adjudicación.</h4>
<p>Dentro del término de diez días de ejecutoriado el auto de calificación de posturas, a la o al postor preferente consignará el valor ofrecido de contado, hecho lo cual, la o el juzgador emitirá el auto de adjudicación que contendrá:</p><br>
<ol class="literal-list">
  <li>Los nombres y apellidos completos, cédula de identidad o pasaporte, estado civil, de la o del deudor y de la o del postor al que se adjudicó el bien.</li>
  <li>La individualización del bien rematado con sus antecedentes de dominio y registrales, si es del caso.</li>
  <li>El precio por el que se haya rematado.</li>
  <li>La cancelación de todos los gravámenes inscritos con anterioridad a su adjudicación.</li>
  <li>Los demás datos que la o el juzgador considere necesarios.</li>
</ol>
<p>Los gastos e impuestos que genere la transferencia de dominio se pagarán con el producto del remate.</p><br>
<p>La o el juzgador dispondrá que una vez ejecutoriado el auto de adjudicación se proceda a la devolución de los valores correspondientes a las posturas no aceptadas.</p><br>
<p>Si la cosa rematada es inmueble quedará hipotecada, por lo que se ofrezca a plazo, debiendo inscribirse este gravamen en el correspondiente registro, al mismo tiempo que el traspaso de propiedad. Del mismo modo, la prenda se conservará en poder del acreedor prendario mientras se cancela el precio del remate.</p><br>

<h4>Art. 408.- No consignación del valor ofrecido.</h4>
<p>Si la o el postor no consigna la cantidad que ofreció de contado, se mandará a notificar a la o al postor que siga en el orden de preferencia, para que consigne, en el término de diez días, la cantidad ofrecida y así sucesivamente.</p><br>
<p>En este caso, el anterior postor pagará las costas y la quiebra del remate ocasionadas por la falta de pago, con la cantidad que haya consignado al tiempo de hacer la postura y si falta con otros bienes.</p><br>

<h4>Art. 409.- Quiebra del remate.</h4>
<p>Se llama quiebra del remate, la diferencia entre el precio aceptado por la o el postor cuya oferta se declaró preferente y el ofrecido por la o el postor a quien se adjudique lo rematado. </p><br>

<h4>Art. 410.- Protocolización e inscripción del auto de adjudicación.</h4>
<p>El auto de adjudicación se protocolizará para que sirva de título y se inscribirá en el registro que corresponda.</p><br>

<h4>Art. 411.- Tradición material.</h4>
<p>La tradición material se efectuará con la intervención de la Policía Nacional, la entrega se hará con intervención de la o del depositario y conforme con el inventario formulado al tiempo del embargo. Las divergencias que ocurran se resolverán por la o el mismo juzgador de la causa.</p><br>

<h4>Art. 412.- Pago a la o al acreedor.</h4>
<p>De la cantidad que se consigne por el precio de la cosa rematada, se pagará a la o al acreedor inmediatamente los valores que se le adeuden en concepto del principal de su crédito, intereses, indemnizaciones y costas. El sobrante se entregará a la o al deudor, salvo que la o el juzgador haya ordenado su retención, a solicitud de otro juez.</p><br>

<h4>Art. 413.- Régimen de recursos.</h4>
<p>Serán apelables exclusivamente el auto de calificación de postura y el auto de adjudicación.</p><br>
<p><strong>Nota:</strong> Mediante la Res. 07-2024 (R.O. 554-2S, 9-V-2024) emitida por la Corte Nacional de Justicia, se dispone que el presente artículo se debe interpretar de la siguiente manera: En la fase de la ejecución de las decisiones judiciales o acuerdos extrajudiciales que hayan fijado medidas para el cumplimiento de obligaciones de alimentos a favor de niñas, niños, adolescentes, o personas con discapacidad, no caben los recursos de apelación y de hecho respecto de los autos interlocutorios que fijan el monto de las pensiones adeudadas u otros aspectos que tengan que ver con su objeto ni de aquellos dictados para la ejecución de los apremios personales o reales.</p><br>

`
  }
];

const EJECUTIVO_RESOURCES = [
  { id: "aclaracion", title: "Aclaración", article: "Art. 254", desc: "Procede ante obscuridad de la resolución. Término: 3 días.", fullContent: COMMON_LAW_TEXTS.resourcesOrdinario.aclaracion },
  { id: "ampliacion", title: "Ampliación", article: "Art. 254", desc: "Procede cuando el juez omitió resolver algún punto. Término: 3 días.", fullContent: COMMON_LAW_TEXTS.resourcesOrdinario.ampliacion },
  { id: "apelacion", title: "Apelación", article: "Art. 111", desc: "Procede contra sentencia y autos interlocutorios. Efecto no suspensivo. Conoce la Corte Provincial.", fullContent: COMMON_LAW_TEXTS.resourcesOrdinario.apelacion },
  { id: "casacion", title: "Casación", article: "Art. 268", desc: "Procede contra sentencias de segunda instancia. Conoce la Corte Nacional de Justicia.", fullContent: COMMON_LAW_TEXTS.resourcesOrdinario.casacion },
  {
    id: "amparo", title: "Acción Extraordinaria de Protección", article: "Art. 94 Const.", desc: "Ante vulneración de derechos constitucionales. Conoce la Corte Constitucional.", fullContent: `<h4>Art. 94 de la Constitución de la República del Ecuador</h4>
<p>La acción extraordinaria de protección procederá contra sentencias o autos definitivos en los que se haya violado por acción u omisión derechos reconocidos en la Constitución, y se interpondrá ante la Corte Constitucional. El recurso procederá cuando se hayan agotado los recursos ordinarios y extraordinarios dentro del término legal, a menos que la falta de interposición de estos recursos no fuera atribuible a la negligencia de la persona titular del derecho constitucional vulnerado.</p>` }
];

// 4. Actos Procesales y Recursos del Procedimiento Sumario
const SUMARIO_STAGES = [
  {
    number: 1,
    title: "DEMANDA",
    article: "Art. 142",
    description: "El actor presenta la demanda con los requisitos generales del Art. 142 del COGEP.",
    timeLimit: "N/A",
    fullContent: COMMON_LAW_TEXTS.art142
  },
  {
    number: 2,
    title: "CALIFICACIÓN DE LA DEMANDA",
    article: "Art. 146",
    description: "El juzgador examina si la demanda cumple con los requisitos legales.",
    timeLimit: "3 días (Art. 146)",
    fullContent: COMMON_LAW_TEXTS.art146
  },
  {
    number: 3,
    title: "CITACIÓN AL DEMANDADO",
    article: "Arts. 53-57",
    description: "Se notifica al demandado con la demanda y el auto inicial.",
    timeLimit: "3 a 20 días",
    fullContent: COMMON_LAW_TEXTS.citacion
  },
  {
    number: 4,
    title: "CONTESTACIÓN A LA DEMANDA",
    article: "Arts. 291 y 333.3",
    description: "El demandado contesta la demanda, deduce excepciones y puede reconvenir.",
    timeLimit: "10 o 15 días (Art. 333.3)",
    fullContent: `<h4>Art. 291.- Calificación de la demanda y contestación</h4>
<p>Presentada y admitida la demanda, la o el juzgador ordenará se cite al o a los demandados en la forma prevista en este Código. La o el demandado tendrá treinta días para presentar su contestación a la demanda. Este término se contará desde que se practicó la última citación, cuando las o los demandados son va contestarla, se reconviene al actor, la o el juzgador en los tres días siguientes notificará y concederá a la o al actor el término de treinta días para contestarla.</p><br>
<p>Previamente a sustanciar el proceso, la o el juzgador calificará la demanda, la contestación a la demanda, la reconvención, la contestación a la reconvención y procederá conforme lo previsto en las disposiciones generales para los procesos.</p><br>

<h4>Art. 333.- Procedimiento (Reglas 1 a 3)</h4>
<p>El procedimiento sumario se rige por las siguientes reglas:</p>
<ol class="literal-list">
  <li>No procede la reforma de la demanda.</li>
  <li>Solo se admitirá la reconvención conexa.</li>
  <li>(Sustituido por el Art. 55 de la Ley s/n, R.O. 517-S, 26-VI-2019).- Para contestar la demanda y la reconvención se tendrá un término de quince días a excepción de la materia de niñez y adolescencia y del despido intempestivo de mujeres embarazadas o en período de lactancia y los dirigentes sindicales que será de 10 días. El Estado y las instituciones del Sector Público contestarán la demanda en el término previsto en el artículo 291 de este Código.</li>
</ol>`
  },
  {
    number: 5,
    title: "AUDIENCIA ÚNICA",
    article: "Art. 333.4",
    description: "Se desarrolla en una sola audiencia con dos fases concentradas.",
    timeLimit: "Máx. 20-30 días",
    fullContent: `<h4>Art. 333.- Procedimiento (Regla 4)</h4>
<ol start="4" class="literal-list">
  <li>(Reformado por el Art. 56, Art. 57 y Art. 58 de la Ley s/n, R.O. 517-S, 26-VI-2019).- Se desarrollará en audiencia única, con dos fases, la primera de saneamiento, fijación de los puntos en debate y conciliación y la segunda, de prueba y alegatos. La segunda fase se desarrollará en el siguiente orden: debate probatorio, alegato inicial, práctica de pruebas, alegato final. Esta audiencia se realizará en el término máximo de treinta días a partir de la contestación a la demanda. En materia de niñez y adolescencia y de despido intempestivo de mujeres embarazadas o en período de lactancia y de los dirigentes sindicales, la audiencia única se realizará en el término máximo de veinte días contados a partir de la citación. En materia tributaria, en acción especial por clausura de establecimientos, la audiencia única se realizará en el término máximo de cuarenta y ocho horas.</li>
</ol>`
  },
  {
    number: 6,
    title: "SENTENCIA",
    article: "Art. 333.5",
    description: "El juzgador emite resolución oral en audiencia y notifica por escrito.",
    timeLimit: "10 días",
    fullContent: `<h4>Art. 333.- Procedimiento (Reglas 5 y 6)</h4>
<ol start="5" class="literal-list">
  <li>En las controversias sobre alimentos, tenencia, visitas y patria potestad de niñas, niños y adolescentes, la o el juzgador para dictar la sentencia no podrá suspender la audiencia para emitir la decisión oral, conforme este Código.</li>
  <li>Serán apelables las resoluciones dictadas en el procedimiento sumario. Las resoluciones de alimentos, tenencia, visitas, patria potestad, despojo violento, despojo judicial serán apelables solamente en efecto no suspensivo. Las sentencias que se pronuncien dentro de los juicios en que se ventilen las controversias entre el abogado y su cliente por el pago de honorarios, no serán susceptibles de los recursos de apelación ni de hecho.</li>
</ol>`
  }
];

const SUMARIO_RESOURCES = [
  { id: "aclaracion", title: "Aclaración", article: "Art. 254", desc: "Procede ante obscuridad de la resolución. Término: 3 días.", fullContent: COMMON_LAW_TEXTS.resourcesOrdinario.aclaracion },
  { id: "ampliacion", title: "Ampliación", article: "Art. 254", desc: "Procede ante omisión de resolver puntos del litigio. Término: 3 días.", fullContent: COMMON_LAW_TEXTS.resourcesOrdinario.ampliacion },
  {
    id: "apelacion", title: "Apelación", article: "Art. 360", desc: "Procede contra sentencia y autos interlocutorios. Término de interposición: 3 días.", fullContent: `<h4>Art. 360.- Apelación en Sumario</h4>
<p>Las resoluciones dictadas en el procedimiento sumario son apelables de conformidad con las reglas generales de este Código. Las apelaciones en materias de alimentos, niñez y adolescencia se concederán únicamente en el efecto no suspensivo.</p>` },
  { id: "casacion", title: "Casación", article: "Art. 268", desc: "Solo procede en sentencias de segunda instancia en los casos que no correspondan a materias excluidas.", fullContent: COMMON_LAW_TEXTS.resourcesOrdinario.casacion },
  { id: "hecho", title: "Hecho", article: "Art. 278", desc: "Procede al negarse indebidamente el recurso de apelación o casación. Término: 3 días.", fullContent: COMMON_LAW_TEXTS.resourcesOrdinario.hecho }
];


// 5. Actos Procesales y Recursos del Procedimiento Monitorio
const MONITORIO_STAGES = [
  {
    number: 1,
    title: "DEMANDA",
    article: "Arts. 356 y 357",
    description: "Presentación de la demanda, crédito líquido, determinado, exigible y vencido hasta 50 SBU.",
    timeLimit: "N/A",
    fullContent: `<h4>Art. 356.- Procedencia.</h4>
<p>La persona que pretenda cobrar una deuda determinada de dinero, líquida, exigible y de plazo vencido, cuyo monto no exceda de cincuenta salarios básicos unificados del trabajador en general, que no conste en título ejecutivo, podrá iniciar un procedimiento monitorio, cuando se pruebe la deuda de alguna de las siguientes formas:</p><br>
<ol class="literal-list">
  <li>Mediante documento, cualquiera que sea su forma y que aparezca firmado por la deudora o el deudor o con su sello, impronta o marca o con cualquier otra señal, física o electrónica, proveniente de dicha deudora o dicho deudor.</li>
  <li>Mediante facturas o documentos, cualquiera que sea su forma y clase o el soporte físico en que se encuentren, que aparezcan firmados por el deudor o comprobante de entrega, certificación, telefax, documentos electrónicos, que sean de los que comprueban la existencia de créditos o deudas que demuestren la existencia de la relación previa entre acreedora o acreedor y deudora o deudor. Cuando el documento haya sido creado unilateralmente por la o el acreedor, para acudir al proceso deberá acompañar prueba que haga creíble la existencia de una relación previa entre acreedora o acreedor y deudora o deudor.</li>
  <li>Mediante la certificación expedida por la o el administrador del condominio, club, asociación, establecimiento educativo, u otras organizaciones similares o de quien ejerza la representación legal de estas, de la que aparezca que la o el deudor debe una o más obligaciones, cuando se trate del cobro de cuotas de condominio, clubes, asociaciones, u otras organizaciones similares, así como valores correspondientes a matrícula, colegiatura y otras prestaciones adicionales en el caso de servicios educativos.</li>
  <li>Mediante contrato o una declaración jurada de la o del arrendador de que la o el arrendatario se encuentra en mora del pago de las pensiones de arrendamiento por el término que señala la ley, cuando se trate del cobro de cánones vencidos de arrendamiento, siempre que la o el inquilino esté en uso del bien.</li>
  <li>La o el trabajador cuyas remuneraciones mensuales o adicionales no hayan sido pagadas oportunamente, acompañará a su petición el detalle de las remuneraciones materia de la reclamación y la prueba de la relación laboral.</li>
</ol>
<h4>Art. 357.- Demanda.</h4>
<p>El procedimiento monitorio se inicia con la presentación de la demanda que contendrá además de los requisitos generales, la especificación del origen y cantidad de la deuda; o con la presentación del formulario proporcionado por el Consejo de la Judicatura. En cualquiera de los casos, se acompañará el documento que prueba la deuda.</p><br>
<p>Si la cantidad demandada no excede de los tres salarios básicos unificados del trabajador en general no se requerirá el patrocinio de un abogado</p>`
  },
  {
    number: 2,
    title: "CALIFICACIÓN DE LA DEMANDA",
    article: "Art. 146",
    description: "El juzgador califica la demanda.",
    timeLimit: "5 días",
    fullContent: `<h4>Art. 146.- Calificación de la demanda.</h4>
<p>Presentada la demanda, la o el juzgador, en el término máximo de cinco días, examinará si cumple los requisitos legales generales y especiales que sean aplicables al caso. Si los cumple, calificará, tramitará y dispondrá la práctica de las diligencias solicitadas.</p><br>
<p>Si la demanda no cumple con los requisitos previstos en este Código, la o el juzgador dispondrá que la o el actor la complete o aclare en el término de tres días, si no lo hace, ordenará el archivo y la devolución de los documentos adjuntados a ella, sin necesidad de dejar copias.</p><br>
<p>En materia de niñez y adolescencia, la o el juzgador fijará provisionalmente la pensión de alimentos y el régimen de visitas.</p><br>
<p>En caso de expropiación urgente la o el juzgador al momento de calificar la demanda ordenará la ocupación inmediata del inmueble, siempre que a la demanda se acompañe el precio fijado en el avalúo comercial municipal.</p><br>
<p>El juez dispondrá la inscripción en el registro correspondiente, de las demandas que versen sobre dominio o posesión de inmuebles o de muebles sujetos a registro, así como también de las demandas que versen sobre demarcación y linderos, servidumbres, expropiación, división de bienes comunes y acciones reales inmobiliarias.</p><br>
<p>Antes de que se cite con la demanda se realizará la inscripción, que se comprobará con el certificado respectivo. La omisión de este requisito será subsanable en cualquier estado del juicio, pero constituye falta susceptible de ser sanctioned; al efecto, la jueza o el juez deberán comunicar del particular al respectivo director provincial del Consejo de la Judicatura para que proceda a sustanciar el correspondiente sumario administrativo.</p><br>
<p>La inscripción de la demanda no impide que los bienes se enajenen válidamente en remate forzoso y aún de modo privado, pero el fallo que en el litigio recayere tendrá fuerza de cosa juzgada contra el adquiriente, aunque este no haya comparecido en el juicio. Hecha la inscripción del traspaso de dominio, el registrador la pondrá en conocimiento del juez de la causa, dentro de tres días, mediante oficio que se incorporará al proceso.</p><br>
<p>Si la sentencia fuere favorable al actor, el juez ordenará que se cancelen los registros de transferencia, gravámenes y limitaciones al dominio efectuados después de la inscripción de la demanda.</p>`
  },
  {
    number: 3,
    title: "ADMISIÓN",
    article: "Art. 358",
    description: "Auto de admisión",
    timeLimit: "N/A",
    fullContent: `<h4>Art. 358.- Admisión de la demanda de pago.</h4>
<p>La o el juzgador, una vez que declare admisible la demanda, concederá el término de quince días para el pago y mandará que se cite a la o al deudor.</p>`
  },
  {
    number: 4,
    title: "CITACIÓN AL DEUDOR",
    article: "Art. 358",
    description: "Se cita al deudor con la demanda",
    timeLimit: "N/A",
    fullContent: `<h4>Art. 358.- Admisión de la demanda de pago.</h4>
<p>La o el juzgador, una vez que declare admisible la demanda, concederá el término de quince días para el pago y mandará que se cite a la o al deudor.</p><br>
<p>La citación con el petitorio y el mandamiento de pago de la o del juzgador interrumpe la prescripción.</p><br>
<p>Si la o el deudor no comparece dentro del término concedido para el efecto o si lo hace sin manifestar oposición, el auto interlocutorio al que se refiere el inciso primero quedará en firme, tendrá el efecto de cosa juzgada y se procederá a la ejecución, comenzando por el embargo de los bienes de la o del deudor que la acreedora o el acreedor señale en la forma prevista por este Código.</p>`
  },
  {
    number: 5,
    title: "MANDAMIENTO DE PAGO",
    article: "Art. 358",
    description: "El juez ordena pagar la deuda o formular oposición",
    timeLimit: "N/A",
    fullContent: `<h4>Art. 358. Admisión de la demanda de pago.</h4>
<p>La o el juzgador, una vez que declare admisible la demanda, concederá el término de quince días para el pago y mandará que se cite a la o al deudor.</p><br>
<p>La citación con el petitorio y el mandamiento de pago de la o del juzgador interrumpe la prescripción.</p><br>
<p>Si la o el deudor no comparece dentro del término concedido para el efecto o si lo hace sin manifestar oposición, el auto interlocutorio al que se refiere el inciso primero quedará en firme, tendrá el efecto de cosa juzgada y se procederá a la ejecución, comenzando por el embargo de los bienes de la o del deudor que la acreedora o el acreedor señale en la forma prevista por este Código.</p>`
  },
  {
    number: 6,
    title: "PLAZO PARA OPOSICIÓN",
    article: "Art. 359",
    description: "Se realiza en un término máximo de 15 días.",
    timeLimit: "Máx. 15 días",
    fullContent: `<h4>Art. 359. Oposición a la demanda.</h4>
<p>Si la parte demandada comparece y formula excepciones, la o el juzgador convocará a audiencia única, con dos fases, la primera de saneamiento, fijación de los puntos en debate y conciliación y la segunda, de prueba y alegatos. Si no hay acuerdo o este es parcial, en la misma audiencia dispondrá se practiquen las pruebas anunciadas, luego de lo cual, oirá los alegatos de las partes y en la misma diligencia dictará sentencia, contra la cual solo caben la ampliación, aclaración y el recurso de apelación.</p><br>
<p>En este proceso no procede la reforma a la demanda, ni la reconvención.</p>`
  },
  {
    number: 7,
    title: "NO HAY OPOSICIÓN",
    article: "Art. 358",
    description: "AUTO EJECUTORIADO. El auto se convierte en título de ejecución. <br>PROCEDIMIENTO DE EJECUCIÓN: Se continúa con el procedimiento de ejecución.",
    timeLimit: "N/A",
    fullContent: `<h4>Art. 358. Admisión de la demanda de pago.</h4>
<p>La o el juzgador, una vez que declare admisible la demanda, concederá el término de quince días para el pago y mandará que se cite a la o al deudor. </p><br>
<p>La citación con el petitorio y el mandamiento de pago de la o del juzgador interrumpe la prescripción.</p> <br>
<p>Si la o el deudor no comparece dentro del término concedido para el efecto o si lo hace sin manifestar oposición, el auto interlocutorio al que se refiere el inciso primero quedará en firme, tendrá el efecto de cosa juzgada y se procederá a la ejecución, comenzando por el embargo de los bienes de la o del deudor que la acreedora o el acreedor señale en la forma prevista por este Código.</p>`
  },
  {
    number: 8,
    title: "OPOSICIÓN A LA DEMANDA",
    article: "Arts. 358 y 359",
    description: "OPOSICIÓN FUNDAMENTADA: El deudor formula oposición fundamentada con prueba documental. <br>TRASLADO A LA CONTRAPARTE: Se corre traslado de la oposición a la contraparte.",
    timeLimit: "3 días",
    fullContent: `<h4>Art. 359. Oposición a la demanda.</h4>
<p>Si la parte demandada comparece y formula excepciones, la o el juzgador convocará a audiencia única, con dos fases, la primera de saneamiento, fijación de los puntos en debate y conciliación y la segunda, de prueba y alegatos. Si no hay acuerdo o este es parcial, en la misma audiencia dispondrá se practiquen las pruebas anunciadas, luego de lo cual, oirá los alegatos de las partes y en la misma diligencia dictará sentencia, contra la cual solo caben la ampliación, aclaración y el recurso de apelación.</p><br>
<p>En este proceso no procede la reforma a la demanda, ni la reconvención.</p>`
  },
  {
    number: 9,
    title: "AUDIENCIA ÚNICA",
    article: "Art. 354",
    description: "Se realiza en un término máximo de 20 días. <br>FASE 1 SANEAMIENTO (Verificación de presupuestos procesales, Conciliación, Fijación de puntos de debate). <br>FASE 2 PRÁCTICA DE PRUEBA (Anuncio y admisión, Práctica de pruebas, Alegatos finales). <br>FASE 3 SENTENCIA (La sentencia se dicta en la misma audiencia. Notificación oral).",
    timeLimit: "Máx. 20 días",
    fullContent: `<h4>Art. 354.- Audiencia.</h4>
<p>Si se formula oposición debidamente fundamentada, dentro del término de tres días se notificará a la contraparte con copia de la misma y se señalará día y hora para la audiencia única, la que deberá realizarse en el término máximo de veinte días contados a partir de la fecha en que concluyó el término para presentar la oposición o para contestar la reconvención, de ser el caso.</p><br>
<p>La audiencia única se realizará en dos fases, la primera de saneamiento, fijación de los puntos en debate y conciliación y la segunda, de prueba y alegatos. Culminada la audiencia la o al juzgador deberá pronunciar su resolución y posteriormente notificar la sentencia conforme con este Código.</p><br>
<p>De la sentencia cabrá apelación únicamente con efecto no suspensivo conforme con las reglas generales previstas en este Código. Para la suspensión de la ejecución de la sentencia el deudor deberá consignar o caucionar el valor de la obligación. Para la caución se estará a lo dispuesto en este Código. No será admisible el recurso de casación para este tipo de procesos.</p>`
  }
];

const MONITORIO_RESOURCES = [
  {
    id: "aclaracion",
    title: "Aclaración",
    article: "Art. 253",
    desc: "Aclaración (3 días)",
    fullContent: `<h4>Art. 253.- Aclaración y ampliación.-</h4>
<p>La aclaración tendrá lugar en caso de sentencia oscura. La ampliación procederá cuando no se haya resuelto alguno de los puntos controvertidos o se haya omitido decidir sobre frutos, intereses o costas.</p>`
  },
  {
    id: "ampliacion",
    title: "Ampliación",
    article: "Art. 253",
    desc: "Ampliación (3 días)",
    fullContent: `<h4>Art. 253. Aclaración y ampliación.-</h4>
<p>La aclaración tendrá lugar en caso de sentencia oscura. La ampliación procederá cuando no se haya resuelto alguno de los puntos controvertidos o se haya omitido decidir sobre frutos, intereses o costas.</p>`
  },
  {
    id: "apelacion",
    title: "Apelación",
    article: "Art. 256 y siguientes",
    desc: "Efecto no suspensivo. SEGUNDA INSTANCIA: Resuelve la apelación.",
    fullContent: `<h4>Art. 256.- Procedencia.</h4>
<p>El recurso de apelación procede contra las sentencias y los autos interlocutorios dictados dentro de primera instancia así como contra las providencias con respecto a las cuales la ley conceda expresamente este recurso. Se interpondrá de manera oral en la respectiva audiencia.</p><br>
<p>Las sentencias adversas al sector público se elevarán en consulta a la respectiva Corte Provincial, aunque las partes no recurran, salvo las sentencias emitidas por los Jueces de lo Contencioso Administrativo y Tributario. En la consulta se procederá como en la apelación.</p><br>

<p><em>Nota: Ver Resolución de la Corte Nacional de Justicia, Normas que Regulan Apelación Conforme lo Previsto el COGEP. Resolución de la Corte Nacional de Justicia No. 15. Para leer Texto, ver Registro Oficial Suplemento 104 de 20 de Octubre de 2017, página 10.</em></p>`
  },
  {
    id: "no_casacion",
    title: "No procede recurso de apelación",
    article: "Art. 354",
    desc: "No será admisible el recurso de casación para este tipo de procesos.",
    fullContent: `<h4>Art. 354.- Audiencia.</h4>
<p>Si se formula oposición debidamente fundamentada, dentro del término de tres días se notificará a la contraparte con copia de la misma y se señalará día y hora para la audiencia única, la que deberá realizarse en el término máximo de veinte días contados a partir de la fecha en que concluyó el término para presentar la oposición o para contestar la reconvención, de ser el caso.</p><br>
<p>La audiencia única se realizará en dos fases, la primera de saneamiento, fijación de los puntos en debate y conciliación y la segunda, de prueba y alegatos. Culminada la audiencia la o al juzgador deberá pronunciar su resolución y posteriormente notificar la sentencia conforme con este Código.</p><br>
<p>De la sentencia cabrá apelación únicamente con efecto no suspensivo conforme con las reglas generales previstas en este Código. Para la suspensión de la ejecución de la sentencia el deudor deberá consignar o caucionar el valor de la obligación. Para la caución se estará a lo dispuesto en este Código.</p><br>
<p>No será admisible el recurso de casación para este tipo de procesos</p>`
  }
];

//================================================================

// 6. Actos Procesales y Recursos del Procedimiento de Ejecución

const EJECUCION_STAGES = [
  {
    number: 1,
    title: "TITULO DE EJECUCIÓN",
    article: "Arts. 362 y 363",
    description: "Sentencia ejecutoriada, acta de mediación, laudo arbitral, escritura pública, etc.",
    timeLimit: "N/A",
    fullContent: `<h4>Art. 362. Ejecución.</h4>
<p>Es el conjunto de actos procesales para hacer cumplir las obligaciones contenidas en un título de ejecución</p><br>
<h4>Art. 363.- Títulos de ejecución.-</h4>
<p>Son títulos de ejecución los siguientes:</p><br>
<ol class="literal-list">
  <li>La sentencia ejecutoriada.</li><br>
  <li>El laudo arbitral.</li><br>
  <li>El acta de mediación..</li><br>
  <li>El contrato prendario y de reserva de dominio.</li><br>
  <li>La sentencia, el laudo arbitral o el acta de mediación expedidos en el extranjero, homologados conforme con las reglas de este Código.</li><br>
  <li>Las actas transaccionales.</li><br>
  <li>Los demás que establezca la ley.</li><br>
</ol>
<p>Las y los juzgadores intervendrán directamente en la ejecución de los laudos arbitrales y de las actas de mediación. Además ejecutarán las providencias preventivas ordenadas por los tribunales de arbitraje nacionales o internacionales.</p>`
  },
  {
    number: 2,
    title: "SOLICITUD DE EJECUCIÓN",
    article: "Art. 370",
    description: "El acreedor solicita la ejecución.",
    timeLimit: "N/A",
    fullContent: `<h4>Art. 370.- Solicitud de ejecución.</h4>
<p>Si se trata de la ejecución de un título que no sea la sentencia o auto ejecutoriado, se deberá presentar una solicitud que, además de los requisitos de la demanda, contenga la identificación del título de ejecución que sirve de habilitante para presentar la solicitud.</p>`
  },
  {
    number: 3,
    title: "MANDAMIENTO DE EJECUCIÓN",
    article: "Art. 372",
    description: "El juez ordena el cumplimiento de la obligación.",
    timeLimit: "5 días",
    fullContent: `<h4>Art. 372.- Mandamiento de ejecución.</h4>
<p>Recibida la liquidación, la o el juzgador expedirá el mandamiento de ejecución que contendrá:</p><br>
<ol class="literal-list">
  <li>La identificación precisa de la o del ejecutado que debe cumplir la obligación.</li><br>
  <li>La determinación de la obligación cuyo cumplimiento se pretende, adjuntando copia de la liquidación, de ser el caso.</li><br>
  <li>La orden a la o al ejecutado de pagar o cumplir con la obligación en el término de cinco días, bajo prevención que de no hacerlo, se procederá a la ejecución forzosa.</li><br>
</ol>
<p>Cuando se trate de ejecución de títulos que no sean la sentencia ejecutoriada, la notificación del mandamiento de ejecución a la o al ejecutado se efectuará en persona o mediante tres boletas.</p><br>
<p>De cumplirse con la obligación se la declarará extinguida y se ordenará el archivo del expediente</p>`
  },
  {
    number: 4,
    title: "CITACIÓN / NOTIFICACIÓN",
    article: "Arts. 53 y 65",
    description: "Se notifica el mandamiento de ejecución",
    timeLimit: "24 horas",
    fullContent: `<h4>Art. 53.- Citación.</h4>
<p>La citación es el acto por el cual se le hace conocer a la o al demandado el contenido de la demanda o de la petición de una diligencia preparatoria y de las providencias recaídas en ellas. </p><br>
<p>Se realizará en forma personal, mediante boletas oa través del medio de comunicación ordenado por la o el juzgador. Si una parte manifiesta que conoce determinada petición o providencia o se refiere a ella en escrito o en acto del cual quede constancia en el proceso, se considerará citada o notificada en la fecha de presentación del escrito o en la del acto al que haya concurrido.</p> <br>
<p>Si la o el actor ha proporcionado la dirección de correo electrónico de la o del demandado, la o el juzgador ordenará también que se le haga conocer a la o al demandado, por correo electrónico, el extracto de la demanda y del auto inicial, de lo cual, se dejará constancia en el sistema.</p><br>
<p>Esto no sustituye a la citación oficial. Toda citación deberá ser publicada en la página web del Consejo de la Judicatura, a través de los medios electrónicos y tecnológicos de los que disponga la Función Judicial.</p><br>
<p><em>Nota: Inciso cuarto agregado por Disposición Reformatoria Primera, numeral 2 de Ley No. 0, publicada en Registro Oficial Suplemento 31 de 7 de Julio del 2017.</em></p><br>

<h4>Art. 65.- Notificación.-</h4>
<p>Es el acto por el cual se pone en conocimiento de las partes, de otras personas o de quien debe cumplir una orden o aceptar un nombramiento expedido por la o el juzgador, todas las providencias judiciales. Las providencias judiciales deberán notificarse dentro de las veinticuatro horas siguientes a su pronunciamiento. Su incumplimiento acarreará sanciones conforme con lo determinado en la ley.</p>`
  },
  {
    number: 5,
    title: "CUMPLE LA OBLIGACIÓN",
    article: "Art. 395",
    description: "¿Cumple voluntariamente? SÍ: Se cumple la obligación. <br>Archivo del proceso.",
    timeLimit: "N/A",
    fullContent: `<h4>Art. 395.- Conclusión de la ejecución y archivo del proceso.</h4>
<p>En cualquier momento antes del remate, una vez acreditada la extinción de la obligación liquidada en mandamiento de ejecución, se declarará la conclusión de la ejecución y el archivo del proceso.</p>`
  },
  {
    number: 6,
    title: "EMBARGO DE BIENES",
    article: "Arts. 375 y 376",
    description: "Se ordena el embargo de bienes del ejecutado",
    timeLimit: "N/A",
    fullContent: `<h4>Art. 375.- Falta de cumplimiento del mandamiento de ejecución.</h4>
<p>De no cumplirse con la obligación, la o el juzgador ordenará que se publique en la página web de la Función Judicial el mandamiento de ejecución para conocimiento de terceros, a fin de que, todos aquellos que tengan interés en la ejecución concurran a la audiencia con todas las pruebas necesarias para hacer efectivos sus derechos.</p><br>
<p>Adicionalmente se ordenará el embargo de los bienes de propiedad de la o del ejecutado conforme con la documentación certificada proporcionada por la o el ejecutante o la obtenida por la o el juzgador, los que se entregarán a la o al depositario de acuerdo con la ley.</p><br>
<p>Practicado el embargo, la o el juzgador ordenará el avalúo de los bienes con la intervención de una o un perito. El informe se presentará con los sustentos técnicos que respalden el avalúo y la firma de la o del depositario judicial a cargo de los bienes en señal de su conformidad.</p><br>
<p>La o el juzgador notificará a las partes el informe pericial, que será discutido en la audiencia de ejecución, que deberá llevarse a cabo en el término máximo de quince días. A esta audiencia comparecerá la o el perito a fin de sustentarlo.</p><br>

<h4>Art. 376.- Embargo.</h4>
<p>La prohibición de enajenar, la retención o el secuestro anteriores no impiden el embargo y dispuesto éste, la o el juzgador que lo ordena oficiará al que haya dictado la medida preventiva, para que notifique a la o al acreedor que la solicitó, a fin de que pueda hacer valer sus derechos como tercerista, si lo quiere. Las providencias preventivas subsistirán, no obstante el embargo, dejando a salvo el procedimiento de ejecución para el remate.</p><br>
<p>La o el depositario de las cosas secuestradas las entregará a la o al depositario designado por la o el juzgador que ordered el embargo, o las conservará en su poder, a órdenes de esta o este juzgador si también es designado depositaria o depositario de las cosas embargadas.</p><br>
<p>Sí el embargo is cancelado sin llegar al remate, en la providencia de cancelación se oficiará a la o al juzgador que ordenó la providencia preventiva, la cual seguirá vigente hasta que sea cancelada por la o el juzgador que la dictó.</p><br>
<p>Hecho el remate, la o el juzgador declarará canceladas las providencias preventivas y oficiará a la o al juzgador que las ordenó para que se tome nota de tal cancelación en el proceso respectivo.</p>`
  },
  {
    number: 7,
    title: "AVALÚO PERICIAL",
    article: "Art. 375",
    description: "Se realiza el avalúo de los bienes embargados con intervención de perito",
    timeLimit: "N/A",
    fullContent: `<h4>Art. 375.- Avalúo Pericial</h4>
<p>Practicado el embargo, la o el juzgador ordenará el avalúo de los bienes con la intervención de una o un perito. El informe se presentará con los sustentos técnicos que respalden el avalúo y la firma de la o del depositario judicial a cargo de los bienes en señal de su conformidad.</p>`
  },
  {
    number: 8,
    title: "NOTIFICACIÓN DEL INFORME",
    article: "Art. 375",
    description: "Se notifica a las partes el informe pericial",
    timeLimit: "N/A",
    fullContent: `<h4>Art. 375.- Notificación del Informe</h4>
<p>La o el juzgador notificará a las partes el informe pericial, que será discutido en la audiencia de ejecución, que deberá llevarse a cabo en el término máximo de quince días. A esta audiencia comparecerá la o el perito a fin de sustentarlo.</p>`
  },
  {
    number: 9,
    title: "AUDIENCIA DE EJECUCIÓN",
    article: "Art. 392",
    description: "Se realiza en un término máximo de 15 días después del avalúo.",
    timeLimit: "máx 15 días",
    fullContent: `<h4>Art. 392.- Audiencia de ejecución.</h4>
<p>La audiencia seguirá, en lo que sea pertinente, los lineamientos generales para el desarrollo de audiencias previstas en este Código, debiendo además cumplirse con lo siguiente:</p><br>
<ol class="literal-list">
  <li>Conocer y resolver sobre la oposición de la o del ejecutado por extinción de la obligación o pagos parciales posteriores al título de ejecución, debidamente justificados.</li><br>
  <li>De ser procedente aprobar fórmulas de pago, incluso cuando impliquen la suspensión del procedimiento de ejecución.</li><br>
  <li>Conocer sobre las observaciones de las partes al informe pericial de avalúo de los bienes y de ser el caso designar otra u otro perito.</li><br>
  <li>Señalar de entre los bienes embargados, los que deben ser objeto de remate, con base a su avalúo y al monto de la obligación,</li><br>
  <li>Resolver sobre la admisibilidad de las tercerias y sobre reclamaciones de terceros perjudicados.</li><br>
</ol>
<p>A la audiencia podrán concurrir otras personas por invitación del ejecutante o el ejecutado, los asistentes podrán proponer cualquier forma de realización de los bienes de la o del deudor y presentar a terceros que, previa caución de seriedad de oferta, se ofrezcan a adquirir dichos bienes por un precio previsiblemente superior al que pueda lograrse mediante venta en pública subasta, en este caso, la o el acreedor que ha vencido en el proceso podrá solicitar a la o al juzgador una prórroga para hacer acudir a la o al tercero adquirente, para lo cual se deberá contar con el acuerdo de la o del deudor y de la o del acreedor.</p><br>
<p>En todo caso la o el acreedor que ha vencido no podrá oponerse si el precio ofrecido es mayor al monto de la obligación.</p><br>
<p>La audiencia terminará con el auto que resuelve los asuntos planteados y que ordene lo que corresponda para la continuación del procedimiento.</p><br>
<p>Si continúa la ejecución, la o el juzgador señalará la fecha y la hora en que se realizará el remate electrónico, ordenando la publicación en la página web del Consejo de la Judicatura de un extracto que contendrá el detalle e imágenes de los bienes a ser rematados y su valor</p>`
  },
  {
    number: 10,
    title: "RESOLUCIÓN EN AUDIENCIA",
    article: "Art. 392",
    description: "Fórmula de pago, Observaciones al avalúo, Tercerias, Bienes a rematar",
    timeLimit: "Inmediato",
    fullContent: `<h4>Art. 392.- Resolución en Audiencia.</h4>
<p>La audiencia terminará con el auto que resuelve los asuntos planteados (fórmulas de pago, observaciones al avalúo, tercerías y fijación de bienes a rematar) y que ordene lo que corresponda para la continuación del procedimiento.</p>`
  },
  {
    number: 11,
    title: "AUTO DE EJECUCIÓN",
    article: "Art. 392",
    description: "Se ordena el remate de los bienes",
    timeLimit: "N/A",
    fullContent: `<h4>Art. 392.- Auto de Ejecución</h4>
<p>Si continúa la ejecución, la o el juzgador señalará la fecha y la hora en que se realizará el remate electrónico, ordenando la publicación en la página web del Consejo de la Judicatura de un extracto que contendrá el detalle e imágenes de los bienes a ser rematados y su valor.</p>`
  },
  {
    number: 12,
    title: "REMATE ELECTRÓNICO",
    article: "Art. 392 y ss.",
    description: "Se realiza el remate conforme a la ley.",
    timeLimit: "N/A",
    fullContent: `<h4>Remate Electrónico</h4>
<p>Se realiza el remate electrónico a través de la plataforma de la página web del Consejo de la Judicatura conforme a las disposiciones generales de la normativa vigente.</p>`
  },
  {
    number: 13,
    title: "ADJUDICACIÓN O PAGO",
    article: "Art. 392 y ss.",
    description: "Se adjudican los bienes o se cancela la deuda.",
    timeLimit: "N/A",
    fullContent: `<h4>Adjudicación o Pago</h4>
<p>Se emite el auto de adjudicación de los bienes al postor preferente o se cancela totalmente la deuda con los valores ingresados.</p>`
  },
  {
    number: 14,
    title: "SATISFACCIÓN DEL CRÉDITO",
    article: "Art. 392 y ss.",
    description: "Se entrega el producto del remate al acreedor.",
    timeLimit: "N/A",
    fullContent: `<h4>Satisfacción del Crédito</h4>
<p>Entrega de los valores recaudados al acreedor hasta cubrir el valor adeudado, intereses and costas.</p>`
  },
  {
    number: 15,
    title: "CONCLUSIÓN Y ARCHIVO DEL PROCESO",
    article: "Art. 395",
    description: "Conclusión de la ejecución y archivo del proceso.",
    timeLimit: "Inmediato",
    fullContent: `<h4>Art. 395.- Conclusión de la ejecución y archivo del proceso.</h4>
<p>En cualquier momento antes del remate, una vez acreditada la extinción de la obligación liquidada en mandamiento de ejecución, se declarará la conclusión de la ejecución y el archivo del proceso.</p>`
  }
];

const EJECUCION_RESOURCES = [
  {
    id: "aclaracion",
    title: "Aclaración",
    article: "Art. 253",
    desc: "3 días",
    fullContent: `<h4>Art. 253. Aclaración y ampliación.-</h4>
<p>La aclaración tendrá lugar en caso de sentencia oscura. La ampliación procederá cuando no se haya resuelto alguno de los puntos controvertidos o se haya omitido decidir sobre frutos, intereses o costas.</p>`
  },
  {
    id: "ampliacion",
    title: "Ampliación",
    article: "Art. 254 / 253",
    desc: "3 días",
    fullContent: `<h4>Art. 253. Aclaración y ampliación.-</h4>
<p>La aclaración tendrá lugar en caso de sentencia oscura. La ampliación procederá cuando no se haya resuelto alguno de los puntos controvertidos o se haya omitido decidir sobre frutos, intereses o costas.</p>`
  },
  {
    id: "apelacion",
    title: "Apelación",
    article: "Art. 256 y siguientes",
    desc: "Efecto no suspensivo",
    fullContent: `<h4>Art. 256.- Procedencia.</h4>
<p>El recurso de apelación procede contra las sentencias y los autos interlocutorios dictados dentro de primera instancia así como contra las providencias con respecto a las cuales la ley conceda expresamente este recurso. Se interpondrá de manera oral en la respectiva audiencia. Las sentencias adversas al sector público se elevarán en consulta a la respectiva Corte Provincial, aunque las partes no recurran, salvo las sentencias emitidas por los Jueces de lo Contencioso Administrativo y Tributario. En la consulta se procederá como en la apelación.</p>`
  },
  {
    id: "casacion",
    title: "Casación",
    article: "Art. 266",
    desc: "Solo cuando la providencia resuelva puntos esenciales no discutidos ni resueltos en la sentencia.",
    fullContent: `<h4>Art. 266.- Procedencia.</h4>
<p>El recurso de casación procederá contra las sentencias y autos que pongan fin a los procesos de conocimiento dictados por las Cortes Provinciales de Justicia y por los Tribunales Contencioso Tributario y Contencioso Administrativo.</p><br>
<p>Igualmente procederá respecto de las providencias expedidas por dichas cortes o tribunales en la fase de ejecución de las sentencias dictadas en procesos de conocimiento, si tales providencias resuelven puntos esenciales no controvertidos en el proceso ni decididos en el fallo o contradicen lo ejecutoriado.</p><br>
<p>Se interpondrá de manera escrita dentro del término de diez días, posteriores a la ejecutoria del auto o sentencia o del auto que niegue o acepte su ampliación o aclaración</p>`
  },
  {
    id: "hecho",
    title: "Recurso de Hecho",
    article: "Art. 278",
    desc: "Si se niega indebidamente la apelación o casación",
    fullContent: `<h4>Art. 278.- Procedencia.</h4>
<p>El recurso de hecho procede contra las providencias que niegan un recurso de apelación o de casación, a fin de que la o el juzgador competente las confirme o las revoque.</p>`
  }
];


// Mapeos Dinámicos globales
const COGEP_STAGES = {
  ordinario: ORDINARIO_STAGES,
  ejecutivo: EJECUTIVO_STAGES,
  sumario: SUMARIO_STAGES,
  monitorio: MONITORIO_STAGES,
  ejecucion: EJECUCION_STAGES
};

const COGEP_RESOURCES_DATA = {
  ordinario: ORDINARIO_RESOURCES,
  ejecutivo: EJECUTIVO_RESOURCES,
  sumario: SUMARIO_RESOURCES,
  monitorio: MONITORIO_RESOURCES,
  ejecucion: EJECUCION_RESOURCES
};

// 7. Simulador de Decisiones - Escenarios / Grafo del juego
const SIMULATOR_SCENARIOS = {
  start: {
    title: "Caso de Estudio: Presentación de Demanda Ordinaria",
    description: "Eres el abogado de Juan. Quieres presentar una demanda ordinaria de cobro de dinero. La cuantía es alta, por lo que no aplica el proceso monitorio. ¿Qué es lo primero que debes hacer?",
    options: [
      { text: "Presentar la demanda por escrito cumpliendo con el Art. 142 del COGEP.", next: "demanda_correcta" },
      { text: "Citar directamente al demandado en su oficina.", next: "citacion_prematura" },
      { text: "Pedir al juez que dicte sentencia de inmediato.", next: "sentencia_imposible" }
    ]
  },
  demanda_correcta: {
    title: "Paso 1: Demanda Presentada",
    description: "Has presentado la demanda con todos los requisitos. Ahora, el juez debe calificar la demanda. ¿Cuál es el término legal para que el juez califique e informe si cumple con los requisitos?",
    options: [
      { text: "El término es de 3 días (Art. 146.2 COGEP).", next: "calificacion_correcta" },
      { text: "El juez tiene hasta 30 días calendario para calificarla.", next: "plazo_incorrecto_calif" },
      { text: "No hay plazo establecido, es cuando el juez lo decida.", next: "plazo_incorrecto_calif" }
    ]
  },
  citacion_prematura: {
    title: "¡Error de Procedimiento!",
    description: "No puedes citar al demandado si la demanda no ha sido calificada y admitida a trámite por un juzgador competente. Debes iniciar de nuevo.",
    options: [
      { text: "Reiniciar Simulación", next: "start" }
    ]
  },
  sentencia_imposible: {
    title: "¡Imposible!",
    description: "No se puede dictar sentencia sin la etapa de contestación, prueba y audiencias previas. El debido proceso (Art. 76 CE) exige cumplir con las etapas establecidas. Regresa e inicia correctamente.",
    options: [
      { text: "Reiniciar Simulación", next: "start" }
    ]
  },
  plazo_incorrecto_calif: {
    title: "Término Erróneo",
    description: "El Art. 146.2 establece claramente que el juzgador dispone del término máximo de 3 días para calificar (y en caso de aclaración/subsanación 3 días). Revisa la normativa del COGEP y vuelve a intentarlo.",
    options: [
      { text: "Volver a Calificación", next: "demanda_correcta" }
    ]
  },
  calificacion_correcta: {
    title: "Paso 2: Calificación y Subsanación",
    description: "¡Correcto! El juzgador califica la demanda. En caso de encontrar defectos o si no cumple con los requisitos, ¿qué término concede el juez al actor para completar o aclarar la demanda bajo apercibimiento de archivo?",
    options: [
      { text: "Otorga el término de 3 días (Art. 146 COGEP).", next: "citacion_fase" },
      { text: "Otorga el término de 10 días hábiles.", next: "plazo_subsanacion_incorrecto" },
      { text: "Se archiva la demanda directamente sin posibilidad de subsanar.", next: "plazo_subsanacion_incorrecto" }
    ]
  },
  plazo_subsanacion_incorrecto: {
    title: "Respuesta Incorrecta",
    description: "El Art. 146 del COGEP determina expresamente que el juez otorgará un término de 3 días para completar o aclarar la demanda. De lo contrario, ordenará el archivo y la devolución de documentos.",
    options: [
      { text: "Reintentar Subsanación", next: "calificacion_correcta" }
    ]
  },
  citacion_fase: {
    title: "Paso 3: Citación al Demandado",
    description: "La demanda ha sido calificada de forma positiva y el juzgador ordena citar al demandado. El citador acude al domicilio del demandado, pero este no se encuentra personalmente. ¿Qué acción establece el Art. 55 del COGEP?",
    options: [
      { text: "Citar por medio de tres boletas entregadas en días distintos a familiares o fijadas en la puerta.", next: "contestacion_fase" },
      { text: "Citar de inmediato mediante una sola publicación en la radio local.", next: "citacion_boleta_incorrecta" },
      { text: "Proceder a archivar la demanda por inactividad.", next: "citacion_boleta_incorrecta" }
    ]
  },
  citacion_boleta_incorrecta: {
    title: "Citación Inválida",
    description: "La citación por medios de comunicación (Art. 56) solo procede bajo juramento de imposibilidad de determinar el domicilio. Si el citador conoce el domicilio, debe citar personalmente o mediante el régimen de tres boletas (Art. 55). Intentar otro medio invalida el proceso.",
    options: [
      { text: "Volver a Citación", next: "citacion_fase" }
    ]
  },
  contestacion_fase: {
    title: "Paso 4: Contestación y Audiencia",
    description: "¡Excelente! El demandado ha sido citado legalmente. A partir de la citación, ¿de qué término dispone el demandado en el Procedimiento Ordinario para contestar la demanda y anunciar su prueba?",
    options: [
      { text: "Término de 30 días (Art. 291 COGEP).", next: "simulacion_completada" },
      { text: "Término de 15 días improrrogables.", next: "plazo_contestacion_incorrecto" },
      { text: "Debe contestar en la misma audiencia preliminar.", next: "plazo_contestacion_incorrecto" }
    ]
  },
  plazo_contestacion_incorrecto: {
    title: "Plazo Erróneo para Contestar",
    description: "Para el procedimiento ordinario, el Art. 291 indica que el término para contestar la demanda es de 30 días. En otros procedimientos (como el sumario) el término es menor, pero en el Ordinario es de 30 días.",
    options: [
      { text: "Reintentar Contestación", next: "contestacion_fase" }
    ]
  },
  simulacion_completada: {
    title: "¡Simulación Exitosa!",
    description: "¡Felicitaciones! Has completado exitosamente la fase inicial del Procedimiento Ordinario (Demanda, Calificación, Citación y Contestación) aplicando adecuadamente el Código Orgánico General de Procesos (COGEP). Has demostrado un excelente dominio procesal.",
    options: [
      { text: "Iniciar nueva simulación", next: "start" }
    ]
  }
};

// 8. Estructura de Cuestionarios (Tests) Completos
const COGEP_QUIZZES = {
  ordinario: {
    title: "Evaluación: Procedimiento Ordinario",
    questions: [
      {
        question: "María presenta una demanda dentro del procedimiento ordinario. En el escrito identifica al juzgador, relata los hechos y firma junto con su abogado. Sin embargo, no anuncia los medios de prueba ni establece claramente la pretensión. Como juzgador, ¿qué corresponde hacer?",
        options: [
          "Admitir inmediatamente la demanda.",
          "Disponer que la actora complete o aclare la demanda dentro de tres días.",
          "Convocar directamente a audiencia preliminar.",
          "Archivar inmediatamente el proceso sin oportunidad de subsanar."
        ],
        answer: 1,
        explanation: "El Art. 142 COGEP exige que la demanda contenga, entre otros requisitos, el anuncio de medios de prueba y una pretensión clara y precisa. Si faltan requisitos, el Art. 146 dispone que el juzgador ordene completar o aclarar la demanda en 3 días; si no se corrige, procederá el archivo."
      },
      {
        question: "Un estudiante revisa un caso donde el actor presentó correctamente la demanda. El juez demora varias semanas antes de examinar si cumple requisitos legales. Según el documento, ¿cuál es el término máximo para examinar y calificar la demanda?",
        options: [
          "48 horas.",
          "3 días.",
          "5 días.",
          "30 días."
        ],
        answer: 2,
        explanation: "El Art. 146 COGEP establece que, presentada la demanda, el juzgador examinará si cumple requisitos generales y especiales en un término máximo de cinco días. Si cumple, calificará y tramitará la causa."
      },
      {
        question: "El citador acude al domicilio del demandado, pero no logra encontrarlo personalmente. ¿Qué forma de actuación corresponde según el procedimiento ordinario?",
        options: [
          "Suspender definitivamente la citación.",
          "Publicar inmediatamente en prensa nacional.",
          "Entregar tres boletas en días distintos en el domicilio.",
          "Dictar sentencia en rebeldía."
        ],
        answer: 2,
        explanation: "El Art. 55 COGEP señala que, si no se encuentra personalmente al demandado, la citación podrá realizarse mediante tres boletas entregadas en días distintos en su domicilio o residencia; si no hay personas presentes, podrán fijarse en la puerta del lugar."
      },
      {
        question: "Pedro quiere demandar a una persona cuyo domicilio y residencia resultan imposibles de determinar. Afirma haber realizado diligencias para ubicarla. ¿Qué requisito adicional exige el procedimiento antes de admitir esta forma de citación?",
        options: [
          "Solicitar autorización municipal.",
          "Declaración juramentada indicando imposibilidad de determinar individualidad, domicilio o residencia.",
          "Haber intentado únicamente la citación por correo electrónico.",
          "Presentar un recurso de apelación previo."
        ],
        answer: 1,
        explanation: "El Art. 56 COGEP exige que quien solicita citación por medios de comunicación declare bajo juramento que fue imposible determinar la individualidad, domicilio o residencia del demandado y que se realizaron diligencias necesarias para localizarlo."
      },
      {
        question: "En un proceso ordinario, el demandado fue citado válidamente. El estudiante debe calcular cuánto tiempo tiene para responder. ¿Cuál es el término para presentar la contestación?",
        options: [
          "10 días.",
          "20 días.",
          "30 días.",
          "60 días."
        ],
        answer: 2,
        explanation: "El Art. 291 COGEP dispone que la o el demandado tendrá 30 días para presentar su contestación a la demanda, contados desde la práctica de la última citación cuando existan varios demandados."
      },
      {
        question: "En un procedimiento ordinario, ya venció el término de contestación a la demanda. El juez debe actuar. ¿Qué corresponde según el COGEP?",
        options: [
          "Convocar audiencia preliminar después de 60 días.",
          "Convocar audiencia preliminar dentro de los tres días posteriores al vencimiento del término anterior.",
          "Emitir sentencia inmediata.",
          "Abrir directamente período probatorio."
        ],
        answer: 1,
        explanation: "El Art. 292 dispone que, con o sin contestación, dentro de los 3 días posteriores al vencimiento del término anterior, el juzgador convocará a la audiencia preliminar."
      },
      {
        question: "El juez convocó audiencia preliminar. Un estudiante debe verificar si la fecha señalada es válida. ¿En qué plazo debe realizarse?",
        options: [
          "Entre 5 y 8 días.",
          "Entre 10 y 20 días.",
          "Máximo 45 días.",
          "Dentro de 90 días."
        ],
        answer: 1,
        explanation: "Según el Art. 292, la audiencia preliminar debe realizarse en un término no menor a 10 ni mayor a 20 días."
      },
      {
        question: "Instalada la audiencia preliminar, la parte demandada insiste en sus excepciones previas. ¿Cuál es la actuación inicial del juzgador?",
        options: [
          "Ignorarlas hasta la sentencia.",
          "Solicitar pronunciamiento de las partes sobre las excepciones propuestas.",
          "Declarar automáticamente nulidad.",
          "Remitir el caso a mediación."
        ],
        answer: 1,
        explanation: "El Art. 294 numeral 1 señala que instalada la audiencia, el juzgador solicitará a las partes que se pronuncien sobre las excepciones previas propuestas."
      },
      {
        question: "Durante la audiencia preliminar, actor y demandado llegan a un acuerdo completo. ¿Qué efecto produce?",
        options: [
          "Se suspende el proceso por 90 días.",
          "El juez aprueba mediante sentencia que causa ejecutoria.",
          "Debe abrirse período probatorio igualmente.",
          "Debe enviarse obligatoriamente a Corte Provincial."
        ],
        answer: 1,
        explanation: "El Art. 294 numeral 4 dispone que si existe conciliación total, ésta será aprobada mediante sentencia que causará ejecutoria."
      },
      {
        question: "Las partes solucionan únicamente una parte del conflicto. ¿Cómo debe proceder el juez?",
        options: [
          "Declarar terminado todo el proceso.",
          "Aprobar la conciliación parcial y continuar sobre la controversia restante.",
          "Archivar inmediatamente.",
          "Convocar nuevo juicio."
        ],
        answer: 1,
        explanation: "El Art. 294 numeral 5 establece que la conciliación parcial se aprueba mediante auto con fuerza ejecutoria, continuando el proceso respecto de la materia aún controvertida."
      },
      {
        question: "En Mediación, el juez considera viable un acuerdo extrajudicial. ¿Qué puede hacer conforme al procedimiento ordinario?",
        options: [
          "Ordenar sentencia anticipada.",
          "Remitir la controversia a un centro de mediación legalmente constituido.",
          "Eliminar la audiencia preliminar.",
          "Negar toda conciliación."
        ],
        answer: 1,
        explanation: "El Art. 294 numeral 6 autoriza al juzgador, de oficio o a petición de parte, disponer que la controversia pase a un centro de mediación legalmente constituido."
      },
      {
        question: "Las partes firman un acta de mediación con acuerdo total. ¿Qué hace el juzgador?",
        options: [
          "Reinicia la causa.",
          "Incorpora el acta al proceso y lo concluye.",
          "Convoca nueva audiencia preliminar.",
          "Abre etapa probatoria."
        ],
        answer: 1,
        explanation: "El documento establece que si existe acuerdo total en mediación, el juez incorporar el acta al proceso para darlo por concluido."
      },
      {
        question: "Terminadas las primeras intervenciones, las partes deben continuar con sus obligaciones procesales. ¿Qué deben hacer?",
        options: [
          "Presentar únicamente testigos.",
          "Anunciar la totalidad de las pruebas para audiencia de juicio.",
          "Esperar sentencia.",
          "Apelar inmediatamente."
        ],
        answer: 1,
        explanation: "El Art. 294 numeral 7 establece que las partes deben anunciar la totalidad de pruebas que presentarán en la audiencia de juicio."
      },
      {
        question: "Una parte intenta presentar prueba obtenida violando garantías constitucionales. ¿Qué corresponde?",
        options: [
          "Admitirla obligatoriamente.",
          "Excluir la prueba ilegal.",
          "Resolverla en apelación.",
          "Mantenerla por economía procesal."
        ],
        answer: 1,
        explanation: "El juzgador debe excluir pruebas ilegales, incluyendo las obtenidas con violación de normas, garantías constitucionales o requisitos formales."
      },
      {
        question: "Concluida la admisibilidad de prueba, corresponde organizar el juicio. ¿Quién fija la fecha?",
        options: [
          "El actor.",
          "El secretario.",
          "El juzgador.",
          "La Corte Provincial."
        ],
        answer: 2,
        explanation: "Conforme al Art. 294, la o el juzgador fijará la fecha de la audiencia de juicio luego del tratamiento probatorio."
      },
      {
        question: "Ha llegado la fecha señalada para la audiencia de juicio en un procedimiento ordinario. ¿Cuál es la finalidad principal de esta audiencia?",
        options: [
          "Corregir la demanda inicial.",
          "Practicar prueba, alegar y resolver la controversia.",
          "Presentar únicamente excepciones previas.",
          "Solicitar mediación obligatoria."
        ],
        answer: 1,
        explanation: "La audiencia de juicio constituye la etapa destinada a la práctica de prueba, exposición de alegatos y resolución del conflicto, conforme a la estructura del procedimiento ordinario prevista en el COGEP."
      },
      {
        question: "Durante la audiencia de juicio, una parte intenta presentar prueba documental que nunca fue anunciada en audiencia preliminar. ¿Cómo debe actuar el juzgador?",
        options: [
          "Admitirla sin análisis.",
          "Diferir el juicio.",
          "Verificar si la prueba fue oportunamente anunciada antes de admitirla.",
          "Remitir el asunto a casación."
        ],
        answer: 2,
        explanation: "En el procedimiento ordinario, la prueba debe ser anunciada oportunamente, y su práctica en juicio depende de la admisibilidad previamente determinada por el juzgador."
      },
      {
        question: "Finalizada la práctica probatoria, las partes solicitan intervenir nuevamente. ¿Qué actuación procesal corresponde?",
        options: [
          "Presentar nuevos testigos.",
          "Formular alegatos finales.",
          "Reiniciar la audiencia preliminar.",
          "Presentar apelación inmediata."
        ],
        answer: 1,
        explanation: "Luego de practicadas las pruebas, las partes pueden realizar alegatos finales, vinculando los hechos demostrados con sus pretensiones y argumentos jurídicos."
      },
      {
        question: "Concluida la audiencia de juicio, el estudiante analiza cómo finaliza el procedimiento. ¿Qué corresponde emitir al juzgador?",
        options: [
          "Reconvención.",
          "Citación adicional.",
          "Sentencia.",
          "Nueva demanda."
        ],
        answer: 2,
        explanation: "La sentencia constituye el acto jurisdiccional mediante el cual el juzgador resuelve el conflicto sometido a conocimiento dentro del procedimiento ordinario."
      },
      {
        question: "Una parte considera que la sentencia contiene puntos oscuros o ambiguos. ¿Qué mecanismo procesal puede solicitar?",
        options: [
          "Casación directa.",
          "Reconvención.",
          "Aclaración.",
          "Nueva citación."
        ],
        answer: 2,
        explanation: "La aclaración procede cuando una resolución presenta conceptos dudosos, ambiguos u oscuros que requieren precisión por parte del juzgador."
      },
      {
        question: "El juez resolvió parcialmente las pretensiones planteadas y omitió pronunciarse sobre un punto solicitado por una parte. ¿Qué recurso corresponde solicitar?",
        options: [
          "Ampliación.",
          "Mediación.",
          "Contestación.",
          "Citación."
        ],
        answer: 0,
        explanation: "La ampliación procede cuando el juzgador omitió resolver alguno de los puntos controvertidos o peticiones formuladas oportunamente."
      },
      {
        question: "Una de las partes considera incorrecta la decisión emitida por el juzgador de primera instancia. ¿Qué finalidad tiene la apelación?",
        options: [
          "Reiniciar automáticamente el juicio.",
          "Solicitar revisión de la decisión por el superior.",
          "Modificar la demanda inicial.",
          "Presentar nuevas pruebas ilimitadas."
        ],
        answer: 1,
        explanation: "La apelación es un recurso ordinario mediante el cual se busca que un órgano jurisdiccional superior revise la resolución dictada por el juez inferior."
      },
      {
        question: "Una parte considera que existe incorrecta aplicación o interpretación de normas jurídicas en la sentencia. ¿Qué recurso resulta pertinente?",
        options: [
          "Recurso de hecho.",
          "Reconvención.",
          "Casación.",
          "Citación."
        ],
        answer: 2,
        explanation: "La casación busca controlar la correcta aplicación e interpretación del derecho, revisando errores jurídicos presentes en resoluciones judiciales."
      },
      {
        question: "El juez negó la concesión de un recurso solicitado por una de las partes. ¿Qué herramienta procesal podría activarse?",
        options: [
          "Recurso de hecho.",
          "Contestación complementaria.",
          "Nueva demanda ordinaria.",
          "Conciliación obligatoria."
        ],
        answer: 0,
        explanation: "El recurso de hecho puede interponerse cuando existe negativa respecto de la concesión de determinados recursos previstos en la normativa procesal."
      },
      {
        question: "Un estudiante debe explicar la lógica completa del procedimiento ordinario del COGEP. ¿Cuál de las siguientes secuencias refleja correctamente la estructura general?",
        options: [
          "Sentencia -> Demanda -> Citación -> Juicio.",
          "Citación -> Sentencia -> Demanda -> Apelación.",
          "Demanda -> Citación -> Contestación -> Audiencia preliminar -> Audiencia de juicio -> Sentencia.",
          "Mediación -> Casación -> Reconvención -> Archivo."
        ],
        answer: 2,
        explanation: "El procedimiento ordinario se desarrolla de forma secuencial: demanda, calificación, citación, contestación, audiencia preliminar, audiencia de juicio y sentencia, incorporando mecanismos probatorios y recursos procesales contemplados en el COGEP."
      }
    ]
  },
  ejecutivo: {
    title: "Evaluación: Procedimiento Ejecutivo",
    questions: [
      {
        question: "Luis desea cobrar judicialmente una deuda y presenta un pagaré firmado por el deudor. ¿Por qué este caso podría tramitarse mediante procedimiento ejecutivo?",
        options: [
          "Porque toda deuda se tramita obligatoriamente por ejecutivo.",
          "Porque existe un título ejecutivo que respalda la obligación.",
          "Porque no se requieren documentos.",
          "Porque el actor eligió libremente el procedimiento."
        ],
        answer: 1,
        explanation: "El procedimiento ejecutivo exige la existencia de un título ejecutivo, es decir, un documento que permita exigir una obligación clara, pura, determinada y actualmente exigible."
      },
      {
        question: "Presentada y admitida la demanda ejecutiva, el juez debe emitir la providencia correspondiente. ¿Qué actuación procesal caracteriza esta etapa?",
        options: [
          "Convocatoria inmediata a remate.",
          "Emisión del mandamiento de ejecución.",
          "Archivo del proceso.",
          "Casación automática."
        ],
        answer: 1,
        explanation: "Dentro del procedimiento ejecutivo, una vez calificada la demanda, el juzgador dicta el mandamiento de ejecución, disponiendo el cumplimiento de la obligación reclamada."
      },
      {
        question: "El ejecutado considera improcedente la obligación exigida y decide defenderse. ¿Qué puede hacer dentro del procedimiento ejecutivo?",
        options: [
          "Ignorar la demanda sin consecuencias.",
          "Formular oposición con fundamento legal.",
          "Presentar directamente casación.",
          "Solicitar remate inmediato."
        ],
        answer: 1,
        explanation: "El ejecutado tiene la posibilidad de oponerse a la ejecución, planteando defensas y excepciones previstas por la normativa procesal."
      },
      {
        question: "El deudor no cumple voluntariamente la obligación exigida. ¿Qué medida puede adoptarse para asegurar la ejecución?",
        options: [
          "Reforma constitucional.",
          "Embargo de bienes.",
          "Apelación obligatoria.",
          "Revocatoria de la demanda."
        ],
        answer: 1,
        explanation: "El embargo constituye una medida propia del procedimiento ejecutivo destinada a asegurar bienes que permitan satisfacer el crédito reclamado."
      },
      {
        question: "Durante el remate de bienes muebles, un postor propone pagar en cuotas sin acuerdo entre ejecutante y ejecutado. ¿Qué corresponde según el documento?",
        options: [
          "Admitir siempre ofertas a plazo.",
          "Rechazar la oferta a plazo salvo acuerdo entre ejecutante y ejecutado.",
          "Suspender automáticamente el remate.",
          "Remitir el caso a Corte Provincial."
        ],
        answer: 1,
        explanation: "En el remate de bienes muebles, el documento señala que todo pago se hará al contado, salvo que ejecutante y ejecutado acuerden otra modaldiad."
      },
      {
        question: "Dos postores presentan ofertas equivalentes durante un remate. ¿Qué criterio general aplica?",
        options: [
          "Se anulan ambas posturas.",
          "Se prefiere la ingresada primero, salvo postura del ejecutante.",
          "Gana siempre la última presentada.",
          "Se ordena nuevo juicio."
        ],
        answer: 1,
        explanation: "El documento establece que, ante posturas iguales, se preferirá la ingresada en primer lugar, salvo cuando exista postura de la o del ejecutante."
      },
      {
        question: "Acreditados los valores ofrecidos por varios postores, el juez debe continuar el procedimiento. ¿Qué actuación corresponde?",
        options: [
          "Emitir sentencia definitiva.",
          "Señalar audiencia pública para calificación de posturas.",
          "Convocar mediación obligatoria.",
          "Declarar automáticamente adjudicado el bien."
        ],
        answer: 1,
        explanation: "El Art. 402 dispone que, acreditados los valores, la o el juzgador señalará día y hora para audiencia pública donde se calificarán las posturas."
      },
      {
        question: "Existen varias ofertas válidas sobre un bien rematado. ¿Qué criterio debe considerar prioritariamente el juzgador?",
        options: [
          "Únicamente la simpatía del postor.",
          "Cantidad ofrecida, plazo y condiciones.",
          "Orden alfabético de los participantes.",
          "Antigüedad del abogado patrocinador."
        ],
        answer: 1,
        explanation: "El Art. 402 establece que el juzgador calificará las posturas considerando cantidad ofrecida, plazo y demás condiciones, privilegiando las que cubran al contado crédito, intereses y costas."
      },
      {
        question: "Se emitió el auto de calificación de posturas y una parte desea impugnarlo. ¿Quiénes pueden apelar?",
        options: [
          "Solamente el secretario judicial.",
          "Ejecutante y terceristas coadyuvantes; el ejecutado en ciertos casos previstos.",
          "Cualquier ciudadano.",
          "Solo el deudor."
        ],
        answer: 1,
        explanation: "El documento dispone que el auto de calificación de posturas puede ser apelado por ejecutante y terceristas coadyuvantes; el ejecutado podrá hacerlo cuando la postura sea inferior a la base del remate."
      },
      {
        question: "Fue concedida una apelación relacionada con la calificación de posturas. ¿Cómo debe resolver la Corte Provincial?",
        options: [
          "En audiencia oral obligatoria de seis meses.",
          "En el término de quince días y sin ninguna tramitación.",
          "Mediante consulta popular.",
          "Únicamente con intervención notarial."
        ],
        answer: 1,
        explanation: "Concedida la apelación, la Corte Provincial resolverá en el término de quince días, sin ninguna tramitación, y contra su fallo no cabrá recurso alguno."
      },
      {
        question: "Durante la audiencia de calificación, dos ofertas son consideradas por el juzgador como igualmente convenientes y además constituyen las mejores posturas. ¿Qué puede disponer el juzgador?",
        options: [
          "Anular el remate automáticamente.",
          "Suspender indefinidamente la audiencia.",
          "Disponer en la misma audiencia la adjudicación al mejor postor.",
          "Ordenar nuevo juicio ejecutivo."
        ],
        answer: 2,
        explanation: "El Art. 403 establece que si existen posturas conceptuadas iguales y el juzgador considera que son las mejores, podrá disponer en la misma audiencia la adjudicación al mejor postor."
      },
      {
        question: "El acreedor desea participar como postor en el remate del bien embargado. ¿Qué posibilidad reconoce el procedimiento?",
        options: [
          "Tiene prohibido participar.",
          "Puede participar con la misma libertad que cualquier persona.",
          "Solo puede intervenir con autorización notarial.",
          "Debe esperar terminar el remate."
        ],
        answer: 1,
        explanation: "El Art. 404 reconoce que la o el acreedor puede hacer postura con la misma libertad que cualquier otra persona."
      },
      {
        question: "No existen tercerías coadyuvantes y el acreedor presenta postura imputándola al valor de su crédito. ¿Debe acompañar obligatoriamente la consignación del 10%?",
        options: [
          "Sí, siempre.",
          "No, en este supuesto puede actuar sin esa consignación.",
          "Solo si lo autoriza la Corte Provincial.",
          "Solo si intervienen testigos."
        ],
        answer: 1,
        explanation: "Conforme al Art. 404, si no existen tercerías coadyuvantes, el acreedor puede imputar la postura al valor de su crédito sin acompañar la consignación del 10%."
      },
      {
        question: "Trabajadores con crédito reconocido desean intervenir en el remate. ¿Qué regla les resulta aplicable?",
        options: [
          "Tienen prohibición absoluta de participar.",
          "Solo pueden intervenir mediante abogado del ejecutante.",
          "Pueden postular libremente e imputar su crédito sin consignar 10%.",
          "Deben esperar el resultado del remate."
        ],
        answer: 2,
        explanation: "El Art. 404 dispone que las y los trabajadores pueden hacer postura libremente e imputarla al valor de su crédito sin consignar el 10%, aun existiendo tercería coadyuvante."
      },
      {
        question: "Se realiza el remate, pero nadie presenta ofertas. ¿Qué alternativa tiene el acreedor?",
        options: [
          "Perder automáticamente el proceso.",
          "Solicitar retasa de bienes o embargo y remate de otros bienes.",
          "Reiniciar la demanda desde cero.",
          "Presentar casación inmediata."
        ],
        answer: 1,
        explanation: "El Art. 405 establece que, si no existen postores, el acreedor podrá solicitar retasas necesarias o pedir embargo y remate de otros bienes, liberando los anteriores."
      },
      {
        question: "El remate se realizó en fecha distinta a la señalada por el juzgador. ¿Qué efecto puede producir?",
        options: [
          "Ninguno.",
          "Nulidad del remate.",
          "Revocatoria automática de la demanda.",
          "Casación obligatoria."
        ],
        answer: 1,
        explanation: "El Art. 406 señala que el remate será nulo cuando se verifique en día distinto del señalado por la o el juzgador."
      },
      {
        question: "Una parte demuestra que el remate no fue publicitado conforme lo ordenado judicialmente. ¿Qué consecuencia prevé el procedimiento?",
        options: [
          "Ninguna consecuencia procesal.",
          "Suspensión de la apelación.",
          "Posible nulidad del remate.",
          "Archivo definitivo de la ejecución."
        ],
        answer: 2,
        explanation: "Según el Art. 406, el remate será nulo si no se publicitó en la forma ordenada por el juzgador."
      },
      {
        question: "Durante la audiencia de calificación se identifica una causal de nulidad del remate. ¿Quién puede promoverla?",
        options: [
          "Solamente el ejecutante.",
          "Únicamente el secretario judicial.",
          "El juzgador de oficio o a petición de parte.",
          "Exclusivamente la Corte Constitucional."
        ],
        answer: 2,
        explanation: "La nulidad del remate puede declararse de oficio o a petición de parte durante la audiencia de calificación."
      },
      {
        question: "El juzgador declaró nulo un remate. ¿Qué corresponde posteriormente?",
        options: [
          "Terminar definitivamente el proceso.",
          "Señalar nuevo día para el remate conforme al Código.",
          "Dictar sentencia penal.",
          "Abrir mediación obligatoria."
        ],
        answer: 1,
        explanation: "Si se declara la nulidad del remate, el procedimiento dispone señalar nuevo día para el remate conforme al COGEP."
      },
      {
        question: "El postor preferente consignó correctamente el valor ofrecido. ¿Qué debe emitir el juzgador?",
        options: [
          "Reconvención.",
          "Auto de adjudicación.",
          "Acción extraordinaria de protección.",
          "Reforma constitucional."
        ],
        answer: 1,
        explanation: "El Art. 407 dispone que, consignado el valor ofrecido, la o el juzgador emitirá el auto de adjudicación, que contendrá los datos exigidos por la norma."
      },
      {
        question: "El juez prepara el auto de adjudicación luego de haberse consignado el valor correspondiente del remate. ¿Cuál de los siguientes elementos debe constar en dicho auto?",
        options: [
          "Únicamente el nombre del abogado patrocinador.",
          "Solo la fecha del embargo.",
          "Individualización del bien rematado y precio del remate.",
          "Únicamente la dirección del juzgado."
        ],
        answer: 2,
        explanation: "El Art. 407 establece que el auto de adjudicación debe contener, entre otros aspectos, la individualización del bien rematado, antecedentes registrales cuando corresponda y el precio por el que se realizó el remate."
      },
      {
        question: "El postor declarado preferente no consigna dentro del plazo el valor ofrecido al contado. ¿Qué corresponde hacer al juzgador?",
        options: [
          "Archivar inmediatamente el proceso.",
          "Convocar nuevo juicio ejecutivo.",
          "Notificar al siguiente postor según el orden de preferencia para que consigne.",
          "Adjudicar automáticamente el bien al ejecutado."
        ],
        answer: 2,
        explanation: "El Art. 408 dispone que si la o el postor no consigna el valor ofrecido, se notificará a la o al siguiente postor en el orden de preferencia para que consigne dentro del término legal."
      },
      {
        question: "El primer postor incumplió el pago y el bien terminó adjudicándose a otro oferente por un valor menor. ¿Cómo denomina el COGEP a la diferencia entre ambos valores?",
        options: [
          "Retasa judicial.",
          "Postura preferente.",
          "Quiebra del remate.",
          "Tradición material."
        ],
        answer: 2,
        explanation: "Según el Art. 409, se denomina quiebra del remate a la diferencia entre el precio aceptado al primer postor preferente y el valor ofrecido por quien finalmente resulte adjudicatario."
      },
      {
        question: "Concluido el proceso de adjudicación, el nuevo propietario necesita formalizar jurídicamente el título. ¿Qué dispone el procedimiento?",
        options: [
          "El auto queda válido sin formalidad alguna.",
          "Debe protocolizarse e inscribirse en el registro correspondiente.",
          "Solo requiere firma del depositario.",
          "Debe aprobarlo previamente la Corte Constitucional."
        ],
        answer: 1,
        explanation: "El Art. 410 dispone que el auto de adjudicación se protocolizará para servir de título y se inscribirá en el registro correspondiente."
      },
      {
        question: "Se consignó el precio del bien rematado y el estudiante debe determinar el destino de esos valores y los recursos aplicables. ¿Qué actuación corresponde según el documento?",
        options: [
          "Todo el dinero se entrega automáticamente al deudor.",
          "Se paga primero al acreedor principal, intereses, indemnizaciones y costas; además, son apelables exclusivamente el auto de calificación de postura y el auto de adjudicación.",
          "Solo se pagan costas judiciales.",
          "Procede apelación contra cualquier providencia del remate."
        ],
        answer: 1,
        explanation: "El Art. 412 dispone que con el valor del remate se pagará inmediatamente a la o al acreedor el principal, intereses, indemnizaciones y costas, entregándose el sobrante al deudor si corresponde. Además, el Art. 413 señala que serán apelables exclusivamente el auto de calificación de postura y el auto de adjudicación."
      }
    ]
  },
  sumario: {
    title: "Evaluación: Procedimiento Sumario",
    questions: [
      {
        question: "Andrea presenta una demanda en procedimiento sumario. Relata los hechos y señala al demandado, pero omite anunciar medios de prueba y no especifica claramente la pretensión. ¿Qué análisis corresponde realizar al juzgador?",
        options: [
          "Admitir inmediatamente la demanda.",
          "Revisar si cumple los requisitos del Art. 142 antes de calificarla.",
          "Convocar directamente a audiencia única.",
          "Dictar sentencia anticipada."
        ],
        answer: 1,
        explanation: "El Art. 142 exige que la demanda contenga, entre otros elementos, fundamentos de derecho, anuncio de prueba y pretensión clara y precisa. Antes de tramitarla, el juzgador debe verificar estos requisitos."
      },
      {
        question: "Presentada una demanda sumaria correctamente estructurada, el estudiante analiza cuánto tiempo tiene el juez para revisarla. ¿Cuál es el término máximo de calificación?",
        options: [
          "48 horas.",
          "3 días.",
          "5 días.",
          "15 días."
        ],
        answer: 2,
        explanation: "El Art. 146 COGEP establece que la o el juzgador examinará la demanda en un término máximo de cinco días para verificar requisitos legales generales y especiales."
      },
      {
        question: "El juez advierte que la demanda presentada no cumple con varios requisitos procesales. ¿Qué actuación corresponde?",
        options: [
          "Rechazar definitivamente la acción.",
          "Conceder tres días para completar o aclarar la demanda.",
          "Ordenar inmediatamente audiencia única.",
          "Remitir el caso a apelación."
        ],
        answer: 1,
        explanation: "Según el Art. 146, si la demanda no cumple requisitos, el juzgador ordenará completarla o aclararla dentro de tres días; si no se subsana, procederá el archivo."
      },
      {
        question: "El citador encuentra al demandado personalmente en su lugar de trabajo. ¿Qué modalidad de citación corresponde?",
        options: [
          "Citación por radio.",
          "Citación por boletas.",
          "Citación personal.",
          "Citación consular."
        ],
        answer: 2,
        explanation: "El Art. 54 señala que la citación personal se cumple mediante entrega directa del contenido de la demanda y providencias a la o al demandado o a su representante legal."
      },
      {
        question: "El demandado no pudo ser localizado personalmente en su domicilio. ¿Qué alternativa prevé el procedimiento?",
        options: [
          "Suspender definitivamente la citación.",
          "Publicar inmediatamente en prensa nacional.",
          "Utilizar tres boletas entregadas en días distintos.",
          "Dictar sentencia automática."
        ],
        answer: 2,
        explanation: "El Art. 55 dispone que, si no se encuentra personalmente al demandado, la citación se realizará mediante tres boletas entregadas en días distintos en domicilio o residencia."
      },
      {
        question: "La parte actora no logra determinar el domicilio ni residencia del demandado. ¿Qué requisito debe cumplir para solicitar citación por medios de comunicación?",
        options: [
          "Solicitar autorización municipal.",
          "Presentar juramento indicando imposibilidad de determinar domicilio e individualidad.",
          "Presentar casación previa.",
          "Obtener autorización del registrador."
        ],
        answer: 1,
        explanation: "El Art. 56 exige que el solicitante declare bajo juramento haber agotado diligencias necesarias y que fue imposible determinar individualidad, domicilio o residencia del demandado."
      },
      {
        question: "En una localidad rural, el juez considera que la radiodifusora es el principal medio de comunicación. ¿Qué característica debe cumplir esta modalidad?",
        options: [
          "Una sola transmisión mensual.",
          "Tres transmisiones diarias en horario de 06h00 a 22h00.",
          "Publicación exclusiva en redes sociales.",
          "Notificación únicamente por correo electrónico."
        ],
        answer: 1,
        explanation: "El Art. 56 establece que los mensajes radiales deberán transmitirse en tres fechas distintas, al menos tres veces por día, entre las 06h00 y 22h00."
      },
      {
        question: "El demandado fue citado válidamente y desea ejercer su defensa. ¿Qué puede realizar al contestar la demanda?",
        options: [
          "Solo aceptar hechos.",
          "Contestar, proponer excepciones y eventualmente reconvenir.",
          "Presentar únicamente apelación.",
          "Solicitar directamente casación."
        ],
        answer: 1,
        explanation: "El documento señala que el demandado contesta la demanda, propone excepciones y puede reconvenir dentro del procedimiento sumario."
      },
      {
        question: "Luego de presentada la acción, el actor intenta modificar sustancialmente su demanda. ¿Qué regla aplica en procedimiento sumario?",
        options: [
          "Siempre procede reforma libremente.",
          "Solo con autorización de la contraparte.",
          "No procede la reforma de la demanda.",
          "Solo procede después de sentencia."
        ],
        answer: 2,
        explanation: "El Art. 333 numeral 1 establece expresamente que no procede la reforma de la demanda dentro del procedimiento sumario."
      },
      {
        question: "El demandado desea presentar una pretensión contra el actor durante el procedimiento sumario. ¿Qué limitación establece el COGEP?",
        options: [
          "Está prohibida toda reconvención.",
          "Solo se admite reconvención conexa.",
          "La reconvención requiere autorización consular.",
          "Debe plantearse únicamente en apelación."
        ],
        answer: 1,
        explanation: "El Art. 333 numeral 2 dispone que en procedimiento sumario solo se admitirá la reconvención conexa."
      },
      {
        question: "Un estudiante analiza diferentes conflictos jurídicos y debe identificar cuándo corresponde utilizar el procedimiento sumario. ¿Cuál es una característica general de este procedimiento?",
        options: [
          "Está diseñado únicamente para delitos penales.",
          "Se utiliza para materias determinadas expresamente por la ley.",
          "Se aplica a toda clase de controversias civiles.",
          "Reemplaza siempre al procedimiento ordinario."
        ],
        answer: 1,
        explanation: "El Art. 333 COGEP establece que el procedimiento sumario se aplica a los casos expresamente determinados por la normativa, bajo reglas procesales específicas."
      },
      {
        question: "Venció el término de contestación y el juez debe continuar el trámite procesal. ¿Qué característica distingue al procedimiento sumario?",
        options: [
          "Dos audiencias obligatorias.",
          "Una audiencia única.",
          "Solo etapa escrita.",
          "Resolución sin audiencia."
        ],
        answer: 1,
        explanation: "El procedimiento sumario se desarrolla mediante audiencia única, concentrando saneamiento, conciliación, prueba y alegatos en un solo acto procesal."
      },
      {
        question: "Instalada la audiencia, el juzgador debe verificar la regularidad procesal antes de continuar. ¿Qué actuación corresponde?",
        options: [
          "Emitir sentencia inmediata.",
          "Realizar saneamiento del proceso.",
          "Ordenar casación.",
          "Remitir el caso a mediación obligatoria."
        ],
        answer: 1,
        explanation: "Dentro de la audiencia única, el juzgador debe efectuar el saneamiento procesal, verificando competencia, validez del procedimiento y posibles nulidades."
      },
      {
        question: "Durante la audiencia, las partes manifiestan voluntad de solucionar el conflicto. ¿Qué debe hacer el juzgador?",
        options: [
          "Negar todo acuerdo.",
          "Intentar la conciliación conforme al procedimiento.",
          "Suspender definitivamente la causa.",
          "Dictar sentencia automática."
        ],
        answer: 1,
        explanation: "La conciliación constituye una etapa de la audiencia única, buscando que las partes alcancen una solución consensuada antes de continuar con la controversia."
      },
      {
        question: "No fue posible conciliar y el proceso continúa. ¿Qué actividad sigue dentro de la audiencia única?",
        options: [
          "Consulta popular.",
          "Práctica de prueba.",
          "Casación inmediata.",
          "Nueva demanda."
        ],
        answer: 1,
        explanation: "Superada la etapa conciliatoria, corresponde la práctica probatoria, permitiendo demostrar hechos relevantes del proceso."
      },
      {
        question: "Luego de practicarse las pruebas, las partes solicitan intervenir nuevamente. ¿Qué actuación corresponde?",
        options: [
          "Reformar la demanda.",
          "Presentar alegatos finales.",
          "Reiniciar la citación.",
          "Convocar audiencia preliminar."
        ],
        answer: 1,
        explanation: "Después de la práctica de prueba, las partes pueden formular alegatos, relacionando pruebas, hechos y fundamentos jurídicos antes de la decisión judicial."
      },
      {
        question: "Concluyeron las etapas de la audiencia única. ¿Qué corresponde al juzgador?",
        options: [
          "Emitir sentencia.",
          "Presentar reconvención.",
          "Iniciar nuevamente citación.",
          "Abrir etapa extraordinaria de prueba."
        ],
        answer: 0,
        explanation: "Luego del desarrollo de la audiencia única, el juzgador debe resolver la controversia mediante sentencia conforme al COGEP."
      },
      {
        question: "Una de las partes considera que ciertos puntos de la sentencia resultan ambiguos. ¿Qué mecanismo procesal puede solicitar?",
        options: [
          "Aclaración.",
          "Nueva citación.",
          "Reforma de demanda.",
          "Embargo."
        ],
        answer: 0,
        explanation: "La aclaración procede cuando existen conceptos oscuros, ambiguos o imprecisos dentro de una resolución judicial."
      },
      {
        question: "El juzgador omitió resolver uno de los puntos discutidos por las partes. ¿Qué solicitud corresponde?",
        options: [
          "Casación inmediata.",
          "Ampliación.",
          "Citación complementaria.",
          "Nueva demanda."
        ],
        answer: 1,
        explanation: "La ampliación permite requerir pronunciamiento judicial sobre asuntos omitidos dentro de la resolución emitida."
      },
      {
        question: "Una parte considera incorrecta la decisión adoptada en primera instancia. ¿Qué finalidad cumple la apelación?",
        options: [
          "Iniciar nuevo proceso desde cero.",
          "Obtener revisión de la decisión por el órgano superior.",
          "Reformar la Constitución.",
          "Evitar toda ejecución."
        ],
        answer: 1,
        explanation: "La apelación permite solicitar que una autoridad jurisdiccional superior revise la decisión emitida por el juzgador de primera instancia."
      },
      {
        question: "Una parte sostiene que en la sentencia existe una incorrecta aplicación e interpretación de normas jurídicas. ¿Qué recurso extraordinario podría intentar?",
        options: [
          "Reforma de demanda.",
          "Casación.",
          "Citación complementaria.",
          "Reconvención."
        ],
        answer: 1,
        explanation: "La casación constituye un recurso extraordinario orientado a controlar la correcta aplicación e interpretación del derecho, revisando errores jurídicos contenidos en resoluciones judiciales."
      },
      {
        question: "El juzgador negó la concesión de un recurso solicitado por una de las partes. ¿Qué alternativa procesal puede activarse?",
        options: [
          "Mediación obligatoria.",
          "Recurso de hecho.",
          "Nueva demanda sumaria.",
          "Embargo preventivo."
        ],
        answer: 1,
        explanation: "El recurso de hecho procede frente a determinadas negativas relacionadas con la concesión de recursos contemplados por la normativa procesal."
      },
      {
        question: "Un estudiante compara procedimiento ordinario y procedimiento sumario. ¿Cuál elemento distingue principalmente al procedimiento sumario?",
        options: [
          "Tiene audiencia preliminar y audiencia de juicio.",
          "Utiliza audiencia única concentrada.",
          "Carece totalmente de prueba.",
          "Se desarrolla solo por escrito."
        ],
        answer: 1,
        explanation: "A diferencia del procedimiento ordinario, el sumario concentra las actuaciones procesales en una audiencia única, buscando mayor celeridad y simplificación procesal."
      },
      {
        question: "Durante el análisis del procedimiento sumario, un alumno observa que varias etapas se desarrollan en un solo acto procesal. ¿Qué característica del procedimiento refleja esta dinámica?",
        options: [
          "Fragmentación procesal.",
          "Concentración procesal.",
          "Desformalización absoluta.",
          "Suspensión indefinida."
        ],
        answer: 1,
        explanation: "El procedimiento sumario responde a una lógica de concentración procesal, integrando saneamiento, conciliación, prueba, alegatos y decisión en una estructura simplificada."
      },
      {
        question: "Un estudiante debe reconstruir correctamente la lógica general del procedimiento sumario dentro del COGEP. ¿Cuál secuencia representa adecuadamente su estructura?",
        options: [
          "Demanda -> Audiencia preliminar -> Juicio -> Casación.",
          "Demanda -> Citación -> Contestación -> Audiencia única -> Sentencia.",
          "Citación -> Sentencia -> Demanda -> Reconvención.",
          "Mediación -> Embargo -> Remate -> Casación."
        ],
        answer: 1,
        explanation: "La estructura general del procedimiento sumario comprende demanda, calificación, citación, contestación, audiencia única y sentencia, incorporando mecanismos de defensa, prueba y recursos procesales previstos en el COGEP."
      }
    ]
  },
  monitorio: {
    title: "Evaluación: Procedimiento Monitorio",
    questions: [
      {
        question: "María desea cobrar una deuda de USD 8.000. Posee documentos firmados por el deudor, pero no cuenta con un título ejecutivo. ¿Qué procedimiento podría utilizar?",
        options: [
          "Procedimiento ordinario exclusivamente.",
          "Procedimiento monitorio.",
          "Procedimiento penal.",
          "Procedimiento de casación."
        ],
        answer: 1,
        explanation: "El Art. 356 COGEP permite iniciar un procedimiento monitorio para cobrar una deuda líquida, determinada, exigible y vencida que no conste en título ejecutivo y cuyo monto no exceda de cincuenta salarios básicos unificados."
      },
      {
        question: "Un acreedor pretende cobrar una deuda mediante procedimiento monitorio. ¿Cuál es el límite máximo establecido por la norma?",
        options: [
          "10 SBU.",
          "25 SBU.",
          "50 SBU.",
          "100 SBU."
        ],
        answer: 2,
        explanation: "El procedimiento monitorio procede cuando la deuda no excede de cincuenta salarios básicos unificados del trabajador en general."
      },
      {
        question: "El acreedor presenta un documento firmado por el deudor donde se reconoce la obligación. ¿Constituye un medio válido para iniciar el procedimiento monitorio?",
        options: [
          "No, porque solo sirven escrituras públicas.",
          "Sí, siempre que permita demostrar la deuda.",
          "Solo si existe sentencia previa.",
          "Únicamente si intervino un notario."
        ],
        answer: 1,
        explanation: "El Art. 356 numeral 1 admite documentos firmados por la o el deudor, incluyendo señales físicas o electrónicas que permitan acreditar la obligación."
      },
      {
        question: "Una empresa desea cobrar una deuda utilizando facturas firmadas y comprobantes de entrega. ¿Qué establece el COGEP?",
        options: [
          "No sirven para procedimiento monitorio.",
          "Son válidos para demostrar la existencia de la relación crediticia.",
          "Solo sirven en procedimiento ejecutivo.",
          "Deben transformarse en escritura pública."
        ],
        answer: 1,
        explanation: "El Art. 356 numeral 2 reconoce facturas, comprobantes de entrega, certificaciones, documentos electrónicos y otros elementos que permitan demostrar la existencia de créditos o deudas."
      },
      {
        question: "Un administrador de condominio pretende cobrar valores adeudados por un propietario. ¿Qué documento puede utilizar para respaldar la demanda?",
        options: [
          "Declaración verbal.",
          "Certificación emitida por el administrador o representante legal.",
          "Solo escritura pública.",
          "Exclusivamente sentencia judicial."
        ],
        answer: 1,
        explanation: "El Art. 356 numeral 3 permite utilizar certificaciones emitidas por administradores o representantes legales para reclamar cuotas de condominio, asociaciones o instituciones educativas."
      },
      {
        question: "Un arrendador reclama varios meses de arriendo impago mientras el inquilino sigue ocupando el inmueble. ¿Qué documento puede respaldar la acción monitoria?",
        options: [
          "Contrato de arriendo o declaración jurada del arrendador.",
          "Solo testigos.",
          "Únicamente escritura pública.",
          "Exclusivamente sentencia previa."
        ],
        answer: 0,
        explanation: "El Art. 356 numeral 4 permite iniciar el procedimiento monitorio mediante contrato o declaración jurada del arrendador respecto de cánones vencidos."
      },
      {
        question: "Un trabajador no ha recibido varias remuneraciones mensuales. ¿Qué debe acompañar a su petición?",
        options: [
          "Solo una declaración verbal.",
          "Detalle de remuneraciones reclamadas y prueba de la relación laboral.",
          "Únicamente testigos.",
          "Ningún documento."
        ],
        answer: 1,
        explanation: "El Art. 356 numeral 5 exige presentar el detalle de las remuneraciones reclamadas y la prueba de la relación laboral."
      },
      {
        question: "El actor presenta una demanda monitoria sin indicar claramente el origen de la deuda. ¿Qué requisito falta?",
        options: [
          "Nacionalidad del juez.",
          "Especificación del origen y cantidad de la deuda.",
          "Sentencia previa.",
          "Peritaje obligatorio."
        ],
        answer: 1,
        explanation: "El Art. 357 dispone que la demanda debe contener la especificación del origen y cantidad de la deuda, además de los requisitos generales."
      },
      {
        question: "La deuda reclamada equivale a dos salarios básicos unificados. ¿Es obligatorio contar con abogado?",
        options: [
          "Sí, siempre.",
          "No, cuando la cantidad no excede tres SBU.",
          "Solo en segunda instancia.",
          "Solo si existe oposición."
        ],
        answer: 1,
        explanation: "El Art. 357 señala que cuando la cantidad demandada no excede de tres salarios básicos unificados, no se requiere patrocinio de abogado."
      },
      {
        question: "El estudiante analiza cuánto tiempo tiene el juez para examinar una demanda monitoria. ¿Cuál es el término máximo?",
        options: [
          "3 días.",
          "5 días.",
          "15 días.",
          "20 días."
        ],
        answer: 1,
        explanation: "El Art. 146 COGEP establece que la o el juzgador examinará la demanda en un término máximo de cinco días."
      },
      {
        question: "El juez calificó la demanda monitoria y admitió a trámite la petición. ¿Qué orden contendrá el auto interlocutorio?",
        options: [
          "Que el demandado presente apelación.",
          "Que el demandado pague la deuda o formule oposición dentro del término legal.",
          "Que el actor presente nueva demanda.",
          "Que se convoque directamente a remate."
        ],
        answer: 1,
        explanation: "El Art. 358 dispone que, admtiida la demanda, el juzgador ordenará que el deudor pague la deuda reclamada o formule oposición dentro del término previsto por la ley."
      },
      {
        question: "El demandado debe ser informado oficialmente de la existencia del proceso monitorio. ¿Qué actuación procesal resulta indispensable?",
        options: [
          "Publicación automática en prensa.",
          "Citación conforme a las reglas del COGEP.",
          "Audiencia preliminar obligatoria.",
          "Sentencia inmediata."
        ],
        answer: 1,
        explanation: "La citación garantiza el derecho a la defensa y permite que el deudor pueda pagar, oponerse o ejercer los mecanismos procesales previstos en el procedimiento monitorio."
      },
      {
        question: "El demandado fue citado válidamente, pero no comparece ni presenta oposición dentro del término correspondiente. ¿Qué consecuencia jurídica produce esta conducta?",
        options: [
          "Se archiva el proceso.",
          "Se entiende aceptada la obligación y continúa la ejecución.",
          "Se convoca audiencia única.",
          "Se reinicia la citación."
        ],
        answer: 1,
        explanation: "Si el deudor no formula oposición dentro del término legal, el procedimiento monitorio permite continuar con la ejecución de la obligación reclamada."
      },
      {
        question: "El demandado considera que la deuda no existe y decide controvertir la pretensión. ¿Qué puede hacer dentro del término legal?",
        options: [
          "Formular oposición fundamentada.",
          "Únicamente presentar apelación.",
          "Solicitar remate.",
          "Pedir casación directa."
        ],
        answer: 0,
        explanation: "El procedimiento monitorio reconoce al demandado el derecho de formular oposición motivada, exponiendo las razones por las cuales considera improcedente la reclamación."
      },
      {
        question: "El demandado presenta oportunamente oposición a la reclamación. ¿Qué ocurre con el procedimiento?",
        options: [
          "Se extingue automáticamente la deuda.",
          "La controversia debe sustanciarse conforme a las reglas procesales correspondientes.",
          "Se dicta sentencia a favor del actor.",
          "Se ordena remate inmediato."
        ],
        answer: 1,
        explanation: "La oposición impide que la reclamación continúe automáticamente y genera la necesidad de resolver la controversia mediante el trámite previsto por el COGEP."
      },
      {
        question: "Un estudiante compara el procedimiento monitorio con el ejecutivo. ¿Cuál es una diferencia fundamental?",
        options: [
          "El monitorio requiere necesariamente un título ejecutivo.",
          "El monitorio permite reclamar deudas que no constan en título ejecutivo.",
          "Ambos exigen exactamente los mismos requisitos documentales.",
          "El monitorio solo se aplica en materia penal."
        ],
        answer: 1,
        explanation: "La principal característica del procedimiento monitorio es que permite reclamar determinadas deudas sin necesidad de un título ejecutivo, siempre que existan documentos que acrediten razonablemente la obligación."
      },
      {
        question: "Carlos intenta cobrar una obligación cuyo plazo de pago aún no ha vencido. ¿Puede utilizar el procedimiento monitorio?",
        options: [
          "Sí, en cualquier caso.",
          "No, porque la deuda debe ser exigible y vencida.",
          "Sí, siempre que exista abogado.",
          "Sí, si el deudor está ausente."
        ],
        answer: 1,
        explanation: "El procedimiento monitorio exige que la obligación sea líquida, determinada, exigible y de plazo vencido. Una deuda todavía no vencida no cumple estos requisitos."
      },
      {
        question: "Una persona pretende cobrar una suma aproximada sin especificar el valor exacto adeudado. ¿Qué requisito estaría incumpliendo?",
        options: [
          "Competencia.",
          "Determinación de la deuda.",
          "Citación.",
          "Patrocinio legal."
        ],
        answer: 1,
        explanation: "La deuda reclamada debe encontrarse claramente determinada o ser determinable, permitiendo establecer con precisión el monto exigido."
      },
      {
        question: "Un estudiante analiza por qué el legislador incorporó el procedimiento monitorio al COGEP. ¿Cuál es su finalidad principal?",
        options: [
          "Resolver conflictos penales.",
          "Facilitar el cobro rápido de determinadas obligaciones dinerarias.",
          "Sustituir completamente al procedimiento ordinario.",
          "Tramitar divorcios."
        ],
        answer: 1,
        explanation: "El procedimiento monitorio busca proporcionar una vía ágil y simplificada para el cobro de obligaciones dinerarias que reúnen los requisitos previstos por la ley."
      },
      {
        question: "Una deuda asciende a diez salarios básicos unificados y el acreedor desea presentar demanda monitoria. ¿Qué requisito profesional resulta aplicable?",
        options: [
          "No requiere abogado bajo ninguna circunstancia.",
          "Requiere patrocinio de abogado por exceder el límite legal de excepción.",
          "Solo requiere abogado en apelación.",
          "El abogado es opcional."
        ],
        answer: 1,
        explanation: "La excepción al patrocinio profesional opera únicamente cuando la cuantía no supera tres salarios básicos unificados; superado ese monto, corresponde actuar con abogado."
      },
      {
        question: "El juez verifica que la demanda cumple todos los requisitos legales y decide admitirla. ¿Qué resolución debe emitir?",
        options: [
          "Sentencia definitiva.",
          "Auto interlocutorio.",
          "Auto de remate.",
          "Recurso de apelación."
        ],
        answer: 1,
        explanation: "El Art. 358 establece que, una vez admitida la demanda monitoria, la o el juzgador emitirá un auto interlocutorio ordenando al deudor pagar la obligación o formular oposición dentro del término de quince días."
      },
      {
        question: "El demandado recibe la citación y reconoce que efectivamente mantiene la deuda reclamada. ¿Cuál es una de las opciones que le concede el procedimiento monitorio?",
        options: [
          "Pagar la obligación reclamada.",
          "Presentar recurso de casación.",
          "Solicitar embargo de sus bienes.",
          "Reformar la demanda."
        ],
        answer: 0,
        explanation: "El procedimiento monitorio permite que el deudor, una vez citado, pague la obligación reclamada y concluya el conflicto sin necesidad de continuar la controversia judicial."
      },
      {
        question: "Una estudiante analiza cuándo utilizar el procedimiento ejecutivo y cuándo el monitorio. ¿Cuál afirmación es correcta?",
        options: [
          "Ambos requieren necesariamente un título ejecutivo.",
          "El monitorio puede utilizarse cuando no existe título ejecutivo, pero sí documentos que acrediten la deuda.",
          "El ejecutivo procede únicamente para arriendos.",
          "El monitorio reemplaza totalmente al ejecutivo."
        ],
        answer: 1,
        explanation: "La principal diferencia es que el procedimiento ejecutivo exige título ejecutivo, mientras que el monitorio admite otros documentos que permitan acreditar razonablemente la existencia de la obligación."
      },
      {
        question: "Un alumno debe identificar la secuencia lógica del procedimiento monitorio. ¿Cuál de las siguientes opciones refleja adecuadamente su desarrollo?",
        options: [
          "Demanda -> Citación -> Pago u oposición -> Resolución correspondiente.",
          "Demanda -> Audiencia preliminar -> Audiencia de juicio -> Casación.",
          "Embargo -> Remate -> Adjudicación -> Sentencia.",
          "Reconvención -> Conciliación -> Casación -> Archivo."
        ],
        answer: 0,
        explanation: "El procedimiento monitorio se caracteriza por su estructura simplificada: demanda, admisión, citación, pago u oposición del deudor y continuación del trámite según la conducta asumida por éste."
      },
      {
        question: "Pedro reclama USD 5.000 por concepto de arriendos vencidos. Presenta el contrato de arrendamiento y una declaración jurada. La deuda está vencida y el demandado es citado legalmente. ¿Cuál de los siguientes elementos justifica principalmente la procedencia del procedimiento monitorio?",
        options: [
          "La existencia de una deuda líquida, exigible, vencida y respaldada documentalmente.",
          "La existencia de sentencia previa.",
          "La existencia de título ejecutivo.",
          "La intervención obligatoria de un notario."
        ],
        answer: 0,
        explanation: "El procedimiento monitorio procede cuando existe una obligación dineraria líquida, determinada, exigible y vencida, respaldada por alguno de los documentos previstos en el Art. 356 del COGEP, como ocurre con los cánones de arrendamiento adeudados."
      }
    ]
  },
  ejecucion: {
    title: "Evaluación: Procedimiento de Ejecución",
    questions: [
      {
        question: "Una sentencia ya se encuentra ejecutoriada, pero la parte condenada no cumple voluntariamente con lo ordenado. ¿Cuál es la finalidad del procedimiento de ejecución?",
        options: [
          "Revisar nuevamente la sentencia.",
          "Hacer cumplir las obligaciones contenidas en un título de ejecución.",
          "Presentar una nueva demanda.",
          "Modificar el fallo emitido."
        ],
        answer: 1,
        explanation: "El Art. 362 COGEP define la ejecución como el conjunto de actos procesales destinados a hacer cumplir las obligaciones contenidas en un título de ejecución."
      },
      {
        question: "Un acreedor obtuvo una sentencia favorable que ya no admite recursos ordinarios. ¿Qué naturaleza tiene esta resolución?",
        options: [
          "Título ejecutivo.",
          "Título de ejecución.",
          "Providencia preventiva.",
          "Documento privado."
        ],
        answer: 1,
        explanation: "El Art. 363 numeral 1 establece que la sentencia ejecutoriada constituye un título de ejecución."
      },
      {
        question: "Dos partes resolvieron su conflicto mediante mediación y firmaron un acuerdo definitivo. ¿Qué valor tiene este documento para efectos de ejecución?",
        options: [
          "Ninguno.",
          "Es únicamente un documento informativo.",
          "Constituye un título de ejecución.",
          "Requiere convertirse en sentencia."
        ],
        answer: 2,
        explanation: "El Art. 363 reconoce expresamente al acta de mediación como uno de los títulos de ejecución."
      },
      {
        question: "El acreedor pretende ejecutar un título distinto de una sentencia ejecutoriada. ¿Qué debe contener la solicitud?",
        options: [
          "Únicamente el nombre del acreedor.",
          "La identificación del título de ejecución que sirve de habilitante.",
          "Solo una declaración verbal.",
          "Ningún requisito especial."
        ],
        answer: 1,
        explanation: "El Art. 370 COGEP exige identificar el título de ejecución que sirve de fundamento para presentar la solicitud."
      },
      {
        question: "El juez recibe la liquidación correspondiente y debe continuar el trámite. ¿Qué providencia debe emitir?",
        options: [
          "Sentencia.",
          "Mandamiento de ejecución.",
          "Auto de remate.",
          "Casación."
        ],
        answer: 1,
        explanation: "Conforme al Art. 372, recibida la liquidación, la o el juzgador expedirá el mandamiento de ejecución."
      },
      {
        question: "El ejecutado recibe el mandamiento y decide cumplir inmediatamente con la obligación. ¿Qué consecuencia jurídica produce?",
        options: [
          "Continúa el embargo.",
          "Se declara extinguida la obligación y se archiva el expediente.",
          "Se convoca audiencia de ejecución.",
          "Se ordena remate."
        ],
        answer: 1,
        explanation: "El Art. 372 dispone que, cumplida la obligación, se declarará extinguida y se ordenará el archivo del expediente."
      },
      {
        question: "El juez notifica el mandamiento de ejecución al deudor. ¿Cuánto tiempo tiene para cumplir voluntariamente?",
        options: [
          "3 días.",
          "5 días.",
          "10 días.",
          "15 días."
        ],
        answer: 1,
        explanation: "El Art. 372 numeral 3 ordena al ejecutado pagar o cumplir la obligación en el término de cinco días, bajo prevención de ejecución forzosa."
      },
      {
        question: "Se trata de la ejecución de un título distinto de una sentencia ejecutoriada. ¿Cómo puede notificarse el mandamiento?",
        options: [
          "Únicamente por prensa.",
          "Personalmente o mediante tres boletas.",
          "Solo por correo electrónico.",
          "Exclusivamente por radio."
        ],
        answer: 1,
        explanation: "El Art. 372 dispone que la notificación del mandamiento de ejecución se efectuará en persona o mediante tres boletas."
      },
      {
        question: "El juez dicta una providencia dentro del procedimiento de ejecución. ¿En qué plazo debe notificarse?",
        options: [
          "24 horas.",
          "3 días.",
          "5 días.",
          "15 días."
        ],
        answer: 0,
        explanation: "El Art. 65 COGEP establece que las providencias judiciales deberán notificarse dentro de las veinticuatro horas siguientes a su pronunciamiento."
      },
      {
        question: "El ejecutado no cumple la obligación dentro del término concedido. ¿Qué actuación corresponde al juzgador?",
        options: [
          "Archivar la causa.",
          "Ordenar el embargo de bienes.",
          "Dictar nueva sentencia.",
          "Remitir el proceso a mediación."
        ],
        answer: 1,
        explanation: "El Art. 375 COGEP dispone que, ante el incumplimiento del mandamiento de ejecución, el juzgador ordenará el embargo de bienes del ejecutado."
      },
      {
        question: "El ejecutado no cumplió voluntariamente con la obligación dentro del plazo concedido por el juez. ¿Cuál es la finalidad principal del embargo?",
        options: [
          "Castigar al deudor.",
          "Garantizar el cumplimiento de la obligación mediante la afectación de bienes.",
          "Declarar insolvente al ejecutado.",
          "Finalizar el proceso judicial."
        ],
        answer: 1,
        explanation: "El embargo constituye una medida destinada a asegurar bienes suficientes para satisfacer la obligación pendiente, permitiendo posteriormente su realización o adjudicación."
      },
      {
        question: "El juez debe decidir sobre qué bienes recaerá el embargo. ¿Qué criterio debe observarse?",
        options: [
          "Embargar todos los bienes existentes.",
          "Embargar bienes suficientes para cubrir la obligación, intereses y costas.",
          "Embargar únicamente bienes inmuebles.",
          "Embargar exclusivamente dinero en efectivo."
        ],
        answer: 1,
        explanation: "El embargo debe guardar proporcionalidad con la obligación reclamada, procurando cubrir el monto adeudado, intereses y costas procesales sin afectar innecesariamente otros bienes."
      },
      {
        question: "Luego del embargo de un inmueble, el juez requiere determinar su valor actualizado. ¿Qué actuación corresponde?",
        options: [
          "Sentencia complementaria.",
          "Avalúo pericial.",
          "Casación.",
          "Reconvención."
        ],
        answer: 1,
        explanation: "El avalúo pericial permite determinar técnicamente el valor del bien embargado, información indispensable para posteriores actos de ejecución."
      },
      {
        question: "Un perito fue designado para exigir el avalúo dentro del procedimiento de ejecución. ¿Cuál es su función principal?",
        options: [
          "Dictar sentencia.",
          "Establecer técnicamente el valor del bien.",
          "Resolver recursos.",
          "Aprobar el remate."
        ],
        answer: 1,
        explanation: "El perito aporta conocimientos especializados para determinar objetivamente el valor comercial del bien sujeto a ejecución."
      },
      {
        question: "Una de las partes considera que el avalúo realizado no refleja el valor real del inmueble. ¿Qué puede hacer?",
        options: [
          "Impugnar u objetar el informe conforme al procedimiento.",
          "Solicitar directamente casación.",
          "Presentar una nueva demanda.",
          "Declarar nulo el proceso."
        ],
        answer: 0,
        explanation: "Las partes conservan el derecho de cuestionar el informe pericial cuando consideren que existen errores técnicos o inconsistencias en la valoración efectuada."
      },
      {
        question: "Dentro del procedimiento existen aspectos que requieren discusión y resolución judicial. ¿Qué mecanismo prevé el COGEP?",
        options: [
          "Audiencia de ejecución.",
          "Audiencia preliminar obligatoria.",
          "Audiencia penal.",
          "Consulta popular."
        ],
        answer: 0,
        explanation: "La audiencia de ejecución permite resolver cuestiones vinculadas al cumplimiento forzoso, oposición, fórmulas de pago y demás incidencias propias de esta etapa procesal."
      },
      {
        question: "El ejecutado considera que la obligación ya fue cumplida parcialmente antes del inicio de la ejecución. ¿Qué derecho procesal puede ejercer?",
        options: [
          "Oponerse dentro de las causales previstas por la ley.",
          "Reformar la sentencia.",
          "Solicitar nueva demanda.",
          "Presentar acción penal."
        ],
        answer: 0,
        explanation: "El procedimiento de ejecución admite oposición únicamente por las causas expresamente previstas en el COGEP, las cuales deben ser demostradas por quien las invoca."
      },
      {
        question: "El ejecutado reconoce la deuda, pero solicita cancelarla mediante pagos periódicos. ¿Qué mecanismo contempla el procedimiento?",
        options: [
          "Reconvención.",
          "Fórmula de pago.",
          "Casación automática.",
          "Archivo de la causa."
        ],
        answer: 1,
        explanation: "El COGEP permite proponer fórmulas de pago, siempre que cumplan los requisitos legales y sean aceptadas o aprobadas según corresponda."
      },
      {
        question: "Una persona ajena al proceso sostiene que un bien embargado le pertenece y no al ejecutado. ¿Qué mecanismo procesal puede utilizar?",
        options: [
          "Acción extraordinaria de protección.",
          "Tercería.",
          "Casación.",
          "Reconvención."
        ],
        answer: 1,
        explanation: "Las tercerías permiten a terceros proteger derechos que puedan verse afectados por actos de ejecución, como el embargo de bienes de su propiedad."
      },
      {
        question: "Luego del avalúo y demás actuaciones, el bien embargado será vendido para satisfacer la obligación. ¿Qué modalidad establece actualmente el COGEP?",
        options: [
          "Subasta exclusivamente presencial.",
          "Remate electrónico a través de plataforma habilitada.",
          "Venta directa sin control judicial.",
          "Sorteo público."
        ],
        answer: 1,
        explanation: "El sistema de ejecución contempla el remate electrónico, mecanismo que busca mayor transparencia, publicidad y participación de postores."
      },
      {
        question: "Luego del remate, el mejor postor consignó oportunamente el valor ofrecido y no existe ninguna impugnación pendiente. ¿Qué actuación corresponde al juzgador?",
        options: [
          "Dictar una nueva sentencia.",
          "Emitir el auto de adjudicación.",
          "Reiniciar el remate.",
          "Archivar el proceso."
        ],
        answer: 1,
        explanation: "Una vez cumplidos los requisitos legales y consignado el valor correspondiente, el juzgador emitirá el auto de adjudicación, documento que formaliza la transferencia del bien rematado al adjudicatario."
      },
      {
        question: "El remate de un inmueble produjo una cantidad suficiente para cubrir la obligación reclamada. ¿Cuál es el destino principal de esos fondos?",
        options: [
          "Entregarlos íntegramente al ejecutado.",
          "Cubrir la obligación reconocida en favor del acreedor.",
          "Transferirlos al Consejo de la Judicatura.",
          "Mantenerlos indefinidamente en depósito judicial."
        ],
        answer: 1,
        explanation: "El objetivo esencial de la ejecución es satisfacer el derecho reconocido al acreedor, utilizando para ello los valores obtenidos mediante la realización de bienes embargados."
      },
      {
        question: "Después de pagar capital, intereses y costas, aún existe un saldo sobrante proveniente del remate. ¿Qué corresponde hacer con ese excedente?",
        options: [
          "Entregarlo al ejecutado.",
          "Entregarlo al juez.",
          "Repartirlo entre los postores.",
          "Declararlo abandonado."
        ],
        answer: 0,
        explanation: "Cuando el producto del remate supera el valor necesario para satisfacer la obligación ejecutada, el excedente debe ser entregado al titular de los bienes ejecutados."
      },
      {
        question: "La obligación reconocida en el título ya fue completamente satisfecha. ¿Qué debe hacer el juzgador?",
        options: [
          "Continuar indefinidamente con la ejecución.",
          "Declarar cumplida la obligación y disponer el archivo.",
          "Convocatoria a nueva audiencia.",
          "Ordenar un nuevo embargo."
        ],
        answer: 1,
        explanation: "La ejecución concluye cuando la obligación ha sido cumplida totalmente. En ese momento, el juzgador declara extinguida la obligación y dispone el archivo de la causa."
      },
      {
        question: "Una empresa obtuvo una sentencia ejecutoriada que ordena el pago de USD 20.000. El deudor no paga dentro de los cinco días concedidos en el mandamiento de ejecución. Posteriormente se embarga un inmueble, se realiza el avalúo pericial y finalmente se efectúa el remate electrónico. ¿Cuál secuencia representa correctamente el procedimiento de ejecución?",
        options: [
          "Sentencia -> Casación -> Mediación -> Archivo.",
          "Mandamiento -> Embargo -> Avalúo -> Remate -> Pago al acreedor -> Archivo.",
          "Demanda -> Reconvención -> Sentencia -> Archivo.",
          "Citación -> Audiencia preliminar -> Juicio -> Casación."
        ],
        answer: 1,
        explanation: "La lógica del procedimiento de ejecución busca hacer efectivo el cumplimiento de una obligación reconocida en un título de ejecución. Cuando no existe pago voluntario, pueden aplicarse medidas como embargo, avalúo, remate, adjudicación y pago al acreedor, hasta lograr la satisfacción total del derecho reconocido."
      }
    ]
  }
};
